from django.db import models

# Create your models here.
#database

class React(models.Model):
    theme = models.CharField(max_length=100, default='default_tables_value')
    narratortitle = models.CharField(max_length=100, default='default_narrator_value')
    narratorname = models.CharField(max_length=100, default='default_theme_value')