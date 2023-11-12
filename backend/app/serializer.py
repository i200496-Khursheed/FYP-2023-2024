from rest_framework import serializers
from .models import *

class ReactSerializer(serializers.ModelSerializer):
    # Define additional fields here
    theme = serializers.CharField()
    narratortitle = serializers.CharField()
    narratorname = serializers.CharField()

    class Meta:
        model = React
        fields = ['theme', 'narratortitle', 'narratorname']
