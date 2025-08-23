from django.urls import path
from .. import views

urlpatterns = [
    # Console views only
    path('', views.index, name='index'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('database/', views.database_view, name='database'),
]
