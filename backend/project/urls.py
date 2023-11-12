from django.contrib import admin
from django.urls import path
from app.views import ReactView, query_hadith

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', ReactView.as_view(), name="anything"),
    path('api/query_hadith/', query_hadith, name='query_hadith'),
]
