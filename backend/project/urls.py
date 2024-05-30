from django.contrib import admin
from django.urls import path
from app.views import ReactView, chain_narrators, query_hadith, query_verse, query_commentary, query_federated, competency_question1, query_federated2, competency_question2, competency_question3, competency_question4, competency_question5, competency_question6, competency_question7, competency_question8, competency_question9,competency_question10, competency_question11, competency_question12

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', ReactView.as_view(), name="anything"),
    path('api/query_hadith/', query_hadith, name='query_hadith'),
    path('api/query_verse/', query_verse, name='query_verse'),
    path('api/query_commentary/', query_commentary, name='query_commentary'),
    path('api/query_federated/', query_federated, name='query_federated'),
    path('api/competency_question1/', competency_question1, name='competency_question1'),
    path('api/chain_narrators/', chain_narrators, name='chain_narrators'),

    path('api/query_federated2/', query_federated2, name='query_federated2'),

    path('api/competency_question2/', competency_question2, name='competency_question2'),
    path('api/competency_question3/', competency_question3, name='competency_question3'),
    path('api/competency_question4/', competency_question4, name='competency_question4'),
    path('api/competency_question5/', competency_question5, name='competency_question5'),
    path('api/competency_question6/', competency_question6, name='competency_question6'),
    path('api/competency_question7/', competency_question7, name='competency_question7'),
    path('api/competency_question8/', competency_question8, name='competency_question8'),
    path('api/competency_question9/', competency_question9, name='competency_question9'),
    path('api/competency_question10/', competency_question10, name='competency_question10'),
    path('api/competency_question11/', competency_question11, name='competency_question11'),
    path('api/competency_question12/', competency_question12, name='competency_question12'),






]
