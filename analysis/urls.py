from django.conf.urls import url
from analysis import views

app_name = 'analysis'
urlpatterns = [
    url(r'^$', views.analysis, name='analysis'),
]
