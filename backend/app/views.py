#views.py
from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from .serializer import *
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import urllib.parse

from .queryengine import Sparql_Endpoint, constructHadithSparQLQueryString

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
        
@csrf_exempt
def query_hadith(request):
    print('popo',request)
    if request.method == 'GET':
        theme = request.GET.get('theme', '')  
        hadith_number = request.GET.get('hadith_number', None)  # Corrected to use `None` instead of `null`

        # Generate the SPARQL query based on the provided parameters
        if hadith_number is None:  # Corrected condition to check for `None`
            query = constructHadithSparQLQueryString(theme=theme)
        else:
            query = constructHadithSparQLQueryString(theme=theme, hadith_number=hadith_number)

        # Execute the SPARQL query and get the result
        prefix = "http://www.tafsirtabari.com/ontology"
        get_query = urllib.parse.quote(query)
        result = Sparql_Endpoint(get_query, prefix)
        print(result)

        return JsonResponse({'result': result})
    else:
        return JsonResponse({'error': 'Only GET requests are allowed for this endpoint'})

