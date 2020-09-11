from datetime import date

from django.db import models

from users.models import User

from .constants import (COMMA_DELIMITER, DOUBLE_QUTATIONS, FULLNAME_COLUMN,
                        column_types, field_delimiter_choices,
                        string_delimiter_choices)


class SchemaColumn(models.Model):
    name = models.CharField(max_length=255)
    column_type = models.CharField(
        choices=column_types,
        default=FULLNAME_COLUMN,
        max_length=12,
    )
    int_min = models.SmallIntegerField(default=0)
    int_max = models.SmallIntegerField(default=0)
    order = models.PositiveSmallIntegerField(default=0)


class Schema(models.Model):
    name = models.CharField(max_length=255, blank=False)
    field_delimiter = models.CharField(
        choices=field_delimiter_choices, default=COMMA_DELIMITER, max_length=10
    )
    string_delimiter = models.CharField(
        choices=string_delimiter_choices, default=DOUBLE_QUTATIONS, max_length=10
    )
    last_modified = models.DateField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    columns = models.ManyToManyField(SchemaColumn, related_name="columns")

    class Meta:
        ordering = ["-last_modified"]


class DataSet(models.Model):
    schema = models.ForeignKey(Schema, on_delete=models.SET_NULL, null=True)
    created_at = models.DateField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)
    file = models.FileField(upload_to="media/")

    class Meta:
        ordering = ["-created_at"]
