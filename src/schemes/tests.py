from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .constants import (COMMA_DELIMITER, DOUBLE_QUTATIONS, EMAIL,
                        FULLNAME_COLUMN, PHONE_COLUMN)
from .models import DataSet, Schema, SchemaColumn


class SchemeTests(APITestCase):
    url = reverse("create_scheme")

    data = {
        "name": "TestScheme",
        "field_delimiter": COMMA_DELIMITER,
        "string_delimiter": DOUBLE_QUTATIONS,
        "columns": [
            {
                "id": -1,
                "column_type": FULLNAME_COLUMN,
                "name": "Full Name",
            },
            {
                "id": -1,
                "column_type": PHONE_COLUMN,
                "name": "Phone Number",
            },
        ],
    }

    def authenticate(self):
        user = get_user_model().objects.create_user("test")
        self.client.force_authenticate(user)

    def test_empty_data(self):
        self.authenticate()
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_creation(self):
        self.authenticate()
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.schema_id = response.data.get("id")

    def test_creation_and_update(self):
        self.authenticate()

        # create
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.schema_id = response.data.get("id")

        # update
        self.data["columns"].append(
            {
                "id": -1,
                "column_type": EMAIL,
                "name": "Email",
            }
        )

        self.update_url = reverse("view_single_scheme", kwargs={"id": self.schema_id})

        response = self.client.put(self.update_url, self.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_dataset(self):
        self.authenticate()

        # create
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.schema_id = response.data.get("id")

        # request dataset
        self.dataset_url = reverse("request_dataset", kwargs={"id": self.schema_id})

        response = self.client.post(self.dataset_url, data={"rows": 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        dataset = DataSet.objects.last()

        self.assertFalse(dataset.is_completed)
