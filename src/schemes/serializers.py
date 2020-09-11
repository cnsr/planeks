from rest_framework import serializers

from .models import DataSet, Schema, SchemaColumn


class ColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchemaColumn
        fields = "__all__"


class SchemaSerializer(serializers.ModelSerializer):
    columns = ColumnSerializer(many=True)

    class Meta:
        model = Schema
        fields = (
            "id",
            "name",
            "field_delimiter",
            "string_delimiter",
            "last_modified",
            "columns",
        )
        read_only_fields = ("last_modified",)

    def create(self, validated_data):
        columns_data = validated_data.pop("columns")

        schema = Schema.objects.create(**validated_data)

        columns = self.create_columns(columns_data)

        schema.columns.add(*columns)
        return schema

    def create_columns(self, columns_data):
        columns = []
        for col in columns_data:
            if col.get("id") == -1:
                col.pop("id")
            column = SchemaColumn.objects.create(**col)
            columns.append(column)
        return columns

    def update(self, instance, validated_data):
        instance = Schema.objects.prefetch_related("columns").get(id=instance.id)

        columns_data = validated_data.pop("columns")

        # filter already existing and set them
        existing_columns = [col for col in columns_data if col.get("id", -1) != -1]
        instance.columns.set(existing_columns)

        # add new ones
        new_columns = [col for col in columns_data if col not in existing_columns]
        instance.columns.add(*self.create_columns(new_columns))

        for k, v in validated_data.items():
            instance.k = v

        instance.save(update_fields=list(validated_data.keys()))
        return instance


class DataSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSet
        fields = (
            "created_at",
            "is_completed",
            "file",
        )
        read_only_fields = (
            "created_at",
            "is_completed",
            "file",
        )
