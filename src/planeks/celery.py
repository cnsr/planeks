from __future__ import absolute_import

import os

from celery import Celery
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "planeks.settings.base")

TASK_SERIALIZER = "json"
ACCEPT_CONTENT = ["json"]

app = Celery(__name__)
app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks()
