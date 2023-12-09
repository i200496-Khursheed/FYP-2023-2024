from django.contrib import admin
from django.urls import path
from app.views import ReactView, query_hadith, query_verse, query_commentary

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', ReactView.as_view(), name="anything"),
    path('api/query_hadith/', query_hadith, name='query_hadith'),
    path('api/query_verse/', query_verse, name='query_verse'),
    path('api/query_commentary/', query_commentary, name='query_commentary'),
]
