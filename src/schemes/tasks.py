import base64
import csv
import io
import os
import random

# from typing import List
from celery import Celery, task
from django.conf import settings
from django.core.files.base import ContentFile
from faker import Faker

from .constants import *
from .constants import delimiters, types_with_range
from .models import DataSet, Schema, SchemaColumn

fake = Faker()


@task
def create_csv(dataset_id, rows):
    dataset = (
        DataSet.objects.select_related("schema")
        .prefetch_related("schema__columns")
        .get(id=dataset_id)
    )

    filename = os.path.normpath(f"{dataset.schema.name}_dataset_{dataset.id}.csv")

    # writing to string io since no docker storage available
    csvfile = io.StringIO()

    csvwriter = csv.writer(
        csvfile,
        delimiter=delimiters.get(dataset.schema.field_delimiter, "'"),
        quotechar=delimiters.get(dataset.schema.string_delimiter, ","),
        quoting=csv.QUOTE_MINIMAL,
    )

    cols = dataset.schema.columns.all().order_by("order")

    cols_headers = list(cols.values_list("name", flat=True))

    csvwriter.writerow(cols_headers)

    for row in range(rows):
        csvwriter.writerow(construct_row(cols))

    dataset.is_completed = True
    # store it at s3 bucket
    dataset.file.save(
        filename, ContentFile(csvfile.getvalue().encode("utf-8"), name=filename)
    )
    dataset.save()
    return f"Finished procesing {dataset_id} for {rows} rows."


def construct_row(columns):
    output = []
    for col in columns:
        if col.column_type not in types_with_range:
            output.append(faker_methods[col.column_type]())
        else:
            if col.column_type == INTEGER_COLUMN:
                output.append(random.randint(col.int_min, col.int_max))
    return output


faker_methods = {
    FULLNAME_COLUMN: fake.name,
    JOB_COLUMN: fake.job,
    EMAIL: fake.email,
    DOMAIN_COLUMN: fake.domain_name,
    PHONE_COLUMN: fake.phone_number,
    COMPANY_COLUMN: fake.company,
    ADDRESS_COLUMN: fake.address,
    DATE_COLUMN: fake.date_time,
}
