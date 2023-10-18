from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from .serializer import *
from rest_framework.response import Response

class ReactView(APIView):
    print('sadsada')
    
    def get(self, request):
        output = [{"theme": output.theme,
                   "narratorname": output.narratorname,
                   "narratortitle": output.narratortitle}
                  for output in React.objects.all()]
        return Response(output)
    
    def post(self, request):
        print(request.data)
        serializer = ReactSerializer(data=request.data)
        print('serererer',serializer)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Data saved successfully"})
        else:
            return Response(serializer.errors, status=400)
