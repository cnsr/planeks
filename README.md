# PLANEKS test assignment

#### Installation
```sh
$ cp .env.example .env
$ docker-compose up --build
$ cd frontend && npm i && npm run build
```

#### About
Backend in Django, Django Rest Framework. Uses Celery (Redis) and [Faker](https://github.com/joke2k/faker).
Dependencis are managed by [Poetry](https://python-poetry.org/).
Migrations are included for ease of use.
Very basic frontend in React. It is not wrapped into Docker container.
PostgreSQL as database.
Produced documents are stored in Amazon S3. _(Not sure why.)_
