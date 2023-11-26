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
    
    # def get(self, request):
    #     output = [{"theme": output.theme,
    #                "narratorname": output.narratorname,
    #                "narratortitle": output.narratortitle}
    #               for output in React.objects.all()]
    #     return Response(output)
    
    # def post(self, request):
    #     print(request.data)
    #     serializer = ReactSerializer(data=request.data)
    #     print('serererer',serializer)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({"message": "Data saved successfully"})
    #     else:
    #         return Response(serializer.errors, status=400)
        
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


# @csrf_exempt
# def query_hadith(request):
#     print('backend/POST')
#     if request.method == 'POST':  # Change to POST
#         try:
#             data = json.loads(request.body)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON in the request body'}, status=400)

#         theme = data.get('theme', '')
#         hadith_number = data.get('hadith_number', None)

#         if hadith_number is None:
#             query = constructHadithSparQLQueryString(theme=theme)
#         else:
#             query = constructHadithSparQLQueryString(theme=theme, hadith_number=hadith_number)

#         prefix = "http://www.tafsirtabari.com/ontology"
#         get_query = urllib.parse.quote(query)
#         result = Sparql_Endpoint(get_query, prefix)
#         print(result)

#         return JsonResponse({'result': result})
#     else:
#         return JsonResponse({'error': 'Only POST requests are allowed for this endpoint'})

@csrf_exempt
def query_hadith(request):
    print('backend/POST')
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON in the request body'}, status=400)

        # Set default values if not provided in the request
        theme = data.get('theme', '?theme')
        hadith_number = data.get('hadith_number', '?hadith_number')

        # Handle null values
        versetext = data.get('versetext', '?vtext')
        chapterNo = data.get('chapterNo', '?chapterNo')
        verseNo = data.get('verseNo', '?verseNo')
        narrator = data.get('narrator', '?narrator')
        narratortitle = data.get('narratortitle', 'narrator-title')
        reffered_chapNo = data.get('reffered_chapNo', '?refferedChapNo')
        reffered_vNo = data.get('reffered_vNo', '?refferedVerseNo')
        refrences_chapNo = data.get('refrences_chapNo', '?refrencesChapNo')
        refrences_vNo = data.get('refrences_vNo', '?refrencesVerseNo')
        applyLimit = True
        limit = ""

        # Call the constructHadithSparQLQueryString function with the provided or default values
        query = constructHadithSparQLQueryString(versetext=versetext, chapterNo=chapterNo, verseNo=verseNo,
                                                 theme=theme, hadith_number=hadith_number, narrator=narrator,
                                                 narratortitle=narratortitle, reffered_chapNo=reffered_chapNo,
                                                 reffered_vNo=reffered_vNo, refrences_chapNo=refrences_chapNo,
                                                 refrences_vNo=refrences_vNo, applyLimit=applyLimit, limit=limit)

        prefix = "http://www.tafsirtabari.com/ontology"
        get_query = urllib.parse.quote(query)
        result = Sparql_Endpoint(get_query, prefix)
        print(result)

        return JsonResponse({'result': result})
    else:
        return JsonResponse({'error': 'Only POST requests are allowed for this endpoint'})
