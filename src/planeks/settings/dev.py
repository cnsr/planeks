from planeks.settings.base import *

DEBUG = True
ALLOWED_HOSTS = [
    "*",
]
CORS_ALLOW_ALL_ORIGINS = True

INSTALLED_APPS += [
    "django_extensions",
]

CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0")
