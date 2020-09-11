#!/bin/sh
poetry run python manage.py makemigrations --settings=planeks.settings.dev
poetry run python manage.py migrate --settings=planeks.settings.dev
echo "from django.contrib.auth import get_user_model; User=get_user_model(); User.objects.create_superuser('admin', 'qwerty123')" | poetry run python manage.py shell --settings=planeks.settings.dev
poetry run gunicorn -b :8000 planeks.wsgi
