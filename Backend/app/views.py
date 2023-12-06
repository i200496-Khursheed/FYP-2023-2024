#views.py
import json
from django.shortcuts import render
from django.http import JsonResponse
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
    
# @csrf_exempt
# def query_hadith(request):
#     print("hello",request)
#     print('popo',request)
#     if request.method == 'GET':
#         theme = request.GET.get('theme', '')  
#         hadith_number = request.GET.get('hadith_number', None)  # Corrected to use `None` instead of `null`

#         # Generate the SPARQL query based on the provided parameters
#         if hadith_number is None:  # Corrected condition to check for `None`
#             query = constructHadithSparQLQueryString(theme=theme)
#         else:
#             query = constructHadithSparQLQueryString(theme=theme, hadith_number=hadith_number)

#         # Execute the SPARQL query and get the result
#         prefix = "http://www.tafsirtabari.com/ontology"
#         get_query = urllib.parse.quote(query)
#         result = Sparql_Endpoint(get_query, prefix)
#         print(result)

#         return JsonResponse({'result': result})
#     else:
#         return JsonResponse({'error': 'Only GET requests are allowed for this endpoint'})
@csrf_exempt
def query_hadith(request):
    print('backend/POST')
    print(request.body)
    if request.method == 'POST':  # Change to POST
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON in the request body'}, status=400)

        # Get values from the request data or use default values
        theme = data['theme'] if 'theme' in data and data['theme'] != '' else '?theme'
        hadith_number = data['hadith_number'] if 'hadith_number' in data and data['hadith_number'] != '' else '?hadith_number'
        versetext = data['versetext'] if 'versetext' in data and data['versetext'] != '' else '?vtext'
        chapterNo = data['chapterNo'] if 'chapterNo' in data and data['chapterNo'] != '' else '?chapterNo'
        verseNo = data['verseNo'] if 'verseNo' in data and data['verseNo'] != '' else '?verseNo'
        mentions = data['mentions'] if 'mentions' in data and data['mentions'] != '' else '?mentions'
        subtheme = data['subtheme'] if 'subtheme' in data and data['subtheme'] != '' else '?subtheme'
        RootNarrator = data['RootNarrator'] if 'RootNarrator' in data and data['RootNarrator'] != '' else '?root_narrator'
        narrator = data['narrators'][0]['name'] if 'narrators' in data and data['narrators'] and data['narrators'][0].get('name') != '' else '?narrator'
        narratortitle = data['narrators'][0]['title'] if 'narrators' in data and data['narrators'] and data['narrators'][0].get('title') != '' else 'narrator-title'
        applyLimit = data.get('applyLimit', True)
        limit = data.get('limit', '')

        print('narrator', narrator)
        query = constructHadithSparQLQueryString(versetext, chapterNo, verseNo, theme, mentions, subtheme,
                                                     hadith_number, RootNarrator, narrator, narratortitle,
                                                     applyLimit, limit)
      
        prefix = "http://www.tafsirtabari.com/ontology"
        get_query = urllib.parse.quote(query)
        print(query)
        result = Sparql_Endpoint(get_query, prefix)
        # print("idhar", result)

        return JsonResponse({'result': result})
    else:
        return JsonResponse({'error': 'Only POST requests are allowed for this endpoint'})
