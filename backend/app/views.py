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

from .queryengine import Sparql_Endpoint, constructCommentarySparQLQueryString, constructHadithSparQLQueryString, constructVerseSparQLQueryString, getNarratorChain

class ReactView(APIView):
    print('sadsada')
    
# @csrf_exempt
# def queryhadith(request):
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


#Verse
@csrf_exempt
def query_verse(request):
    print('backend/POST')
    print(request.body)
    if request.method == 'POST':  # Change to POST
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON in the request body'}, status=400)

        # Get values from the request data or use default values
        chapterNo = data['chapterNo'] if 'chapterNo' in data and data['chapterNo'] != '' else '?chapterNo'
        verseNo = data['verseNo'] if 'verseNo' in data and data['verseNo'] != '' else '?verseNo'
        theme = data['theme'] if 'theme' in data and data['theme'] != '' else '?theme'
        reference = data['reference'] if 'reference' in data and data['reference'] != '' else '?reference'
        subtheme = data['subtheme'] if 'subtheme' in data and data['subtheme'] != '' else '?subtheme'
        hadith_number = data['hadith_number'] if 'hadith_number' in data and data['hadith_number'] != '' else '?hadith_number'
        narrator = data['narrator'] if 'narrator' in data and data['narrator'] != '' else '?narrator'
        commno = data['commno'] if 'commno' in data and data['commno'] != '' else '?commno'
        applyLimit = data.get('applyLimit', True)
        #limit = data.get('limit', '')
        limit = 100

        query = constructVerseSparQLQueryString(chapterNo, verseNo, theme, reference, subtheme, hadith_number,
                                                narrator, commno, applyLimit, limit)
        
        prefix = "http://www.tafsirtabari.com/ontology"
        get_query = urllib.parse.quote(query)
        print(query)
        result = Sparql_Endpoint(get_query, prefix)
        # Use your Sparql_Endpoint function to query the endpoint
        
        return JsonResponse({'result': result})
    else:
        return JsonResponse({'error': 'Only POST requests are allowed for this endpoint'})


#commentary
@csrf_exempt
def query_commentary(request):
    print('backend/POST')
    print(request.body)
    if request.method == 'POST':  # Change to POST
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON in the request body'}, status=400)

        # Get values from the request data or use default values
        commno = data['number'] if 'number' in data and data['number'] != '' else '?number'
        chapterNo = data['chapter_no'] if 'chapter_no' in data and data['chapter_no'] != '' else '?chapter_no'
        verseNo = data['V_no'] if 'V_no' in data and data['V_no'] != '' else '?V_no'
        theme = data['theme'] if 'theme' in data and data['theme'] != '' else '?theme'
        mentions = data['mentions'] if 'mentions' in data and data['mentions'] != '' else '?mentions'
        subtheme = data['subtheme'] if 'subtheme' in data and data['subtheme'] != '' else '?subtheme'
        applyLimit = data.get('applyLimit', True)
        limit = data.get('limit', '')

        query = constructCommentarySparQLQueryString(commno, chapterNo, verseNo, theme, mentions, subtheme,
                                                     applyLimit, limit)
        
        prefix = "http://www.tafsirtabari.com/ontology"
        get_query = urllib.parse.quote(query)
        print(query)
        result = Sparql_Endpoint(get_query, prefix)
        # Use your Sparql_Endpoint function to query the endpoint
        
        return JsonResponse({'result': result})
    else:
        return JsonResponse({'error': 'Only POST requests are allowed for this endpoint'})


@csrf_exempt
def chain_narrators(request):
    print('From chain narrators')
    print(request.body)
    if request.method == 'POST':  # Change to POST
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON in the request body'}, status=400)

        # Get values from the request data or use default values
        hadithNo = data['hadithNo'] if 'hadithNo' in data and data['hadithNo'] != '' else '?hadithNo'
        applyLimit = data.get('applyLimit', True)
        limit = data.get('limit', '')

        query = getNarratorChain(hadithNo,applyLimit, limit)
        
        prefix = "http://www.tafsirtabari.com/ontology"
        get_query = urllib.parse.quote(query)
        #print(query)
        result = Sparql_Endpoint(get_query, prefix)
        print(result)
        # Use your Sparql_Endpoint function to query the endpoint
        
        return JsonResponse({'result': result})
    else:
        return JsonResponse({'error': 'Only POST requests are allowed for this endpoint'})


    