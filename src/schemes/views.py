from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .models import DataSet, Schema, SchemaColumn
from .serializers import DataSetSerializer, SchemaSerializer
from .tasks import create_csv


class CreateSchemaView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = SchemaSerializer

    def create(self, request):
        data = self.request.data
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)

        instance = serializer.save()
        instance.created_by = self.request.user
        instance.save(
            update_fields=[
                "created_by",
            ]
        )

        return Response(serializer.data, status=status.HTTP_200_OK)


class ViewUpdateDeleteSchemaView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = SchemaSerializer
    lookup_url_kwarg = "id"

    def get_object(self):
        return (
            Schema.objects.prefetch_related("columns")
            .filter(
                created_by=self.request.user, id=self.kwargs.get(self.lookup_url_kwarg)
            )
            .first()
        )

    def retrieve(self, *args, **kwargs):
        instance = self.get_object()
        if not instance:
            return Response(
                {"error": "Schema not found."}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.serializer_class(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, id):
        instance = self.get_object()
        serializer = self.serializer_class(data=self.request.data, instance=instance)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        if not instance:
            return Response(
                {"error": "Schema not found."}, status=status.HTTP_404_NOT_FOUND
            )
        return Response({"status": "Success"}, status=status.HTTP_200_OK)


class ListSchemesView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = SchemaSerializer

    def get_queryset(self):
        return Schema.objects.prefetch_related("columns").filter(
            created_by=self.request.user,
        )

    def list(self, request):
        serializer = self.serializer_class(data=self.get_queryset(), many=True)
        serializer.is_valid()

        return Response(serializer.data, status=status.HTTP_200_OK)


class ListDataSetsView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = DataSetSerializer
    lookup_url_kwarg = "id"

    def get_queryset(self):
        schema = Schema.objects.get(id=self.kwargs.get(self.lookup_url_kwarg))
        return DataSet.objects.filter(schema=schema)

    def list(self, *args, **kwargs):
        serializer = self.serializer_class(data=self.get_queryset(), many=True)
        serializer.is_valid()

        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateDataSetsView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = DataSetSerializer
    lookup_url_kwarg = "id"

    def get_object(self):
        return (
            Schema.objects.prefetch_related("columns")
            .filter(
                created_by=self.request.user, id=self.kwargs.get(self.lookup_url_kwarg)
            )
            .first()
        )

    def create(self, *args, **kwargs):
        schema = self.get_object()
        number_of_rows = self.request.data.get("rows")
        dataset = DataSet.objects.create()
        dataset.schema = schema
        dataset.save()
        # TASK
        create_csv.delay(dataset.id, number_of_rows)

        return Response(self.serializer_class(dataset).data, status=status.HTTP_200_OK)
        # get rows from data and save object
