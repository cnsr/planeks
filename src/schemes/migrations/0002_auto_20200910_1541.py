# Generated by Django 3.1.1 on 2020-09-10 15:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("schemes", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="schema",
            name="field_delimiter",
            field=models.CharField(
                choices=[
                    ("comma", "comma"),
                    ("semicolon", "semicolon"),
                    ("colon", "colon"),
                    ("tab", "tab"),
                    ("space", "space"),
                ],
                default="comma",
                max_length=10,
            ),
        ),
        migrations.AlterField(
            model_name="schema",
            name="string_delimiter",
            field=models.CharField(
                choices=[("double", "double"), ("single", "single")],
                default="double",
                max_length=10,
            ),
        ),
    ]
