from django.shortcuts import render

# Create your views here.
# views.py

from .graphdb_connector import execute_sparql_query
from django.shortcuts import render
from .graphdb_connector import Sparql_Endpoint

def my_view(request):
    sparql_query = """
    SELECT ?subject ?predicate ?object
    WHERE {
        ?subject ?predicate ?object
    }
    """
    results = execute_sparql_query(sparql_query)

    # Process and use the results in your view

    return render(request, 'template_name.html', {'results': results})



def test_view(request):
    sparql_query = """
    SELECT ?subject ?predicate ?object
    WHERE {
        ?subject ?predicate ?object
    }
    """
    results = execute_sparql_query(sparql_query, prefix="http://example.com/")

    return render(request, 'D:\FYP\Project\FYP\\templates\\test.html', {'results': results})
