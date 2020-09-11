from planeks.settings.base import *

DEBUG = True
ALLOWED_HOSTS = [
    "*",
]
CORS_ALLOW_ALL_ORIGINS = True

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "fakecsv",
        "USER": "django",
        "PASSWORD": "django",
        "HOST": "localhost",
        "PORT": 5432,
    }
}

INSTALLED_APPS += [
    "django_extensions",
]

CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL")
