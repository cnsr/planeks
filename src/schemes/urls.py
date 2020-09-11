from django.urls import path

from .views import (CreateDataSetsView, CreateSchemaView, ListDataSetsView,
                    ListSchemesView, ViewUpdateDeleteSchemaView)

urlpatterns = [
    path("scheme/add/", CreateSchemaView.as_view(), name="create_scheme"),
    path("scheme/", ListSchemesView.as_view(), name="list_schemes"),
    path(
        "scheme/<int:id>/",
        ViewUpdateDeleteSchemaView.as_view(),
        name="view_single_scheme",
    ),
    path(
        "scheme/<int:id>/datasets/",
        ListDataSetsView.as_view(),
        name="view_single_scheme_datasets",
    ),
    path(
        "scheme/<int:id>/datasets/add/",
        CreateDataSetsView.as_view(),
        name="request_dataset",
    ),
]
