import requests
from rdflib import Graph
from rdflib.plugins.sparql import prepareQuery
from django.conf import settings
import urllib.parse

# Configure Django settings
settings.configure(
    DEBUG=True,  # Set to True or False based on your project settings
    DATABASES={
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'db.sqlite3',  # Adjust the database configuration
        }
    },
    # GRAPHDB_ENDPOINT='http://HafuzTunn:7200/repositories/tafsir?query='+query+'&format=application%2Fsparql-results%2Bjson&timeout=0',  # Set your GraphDB endpoint here
    # Add any other Django settings you need
)

def Sparql_Endpoint(query: str, prefix: str = "") -> dict:
    x = requests.get( 
        'http://HafuzTunn:7200/repositories/tafsir?query='+query+'&format=application%2Fsparql-results%2Bjson&timeout=0',
        headers={
            'Accept' : 'application/sparql-results+json', 
            'Host' : 'localhost:7200'
        }
    )
    json = x.json()
    # print(json.dumps(uglyjson, indent=2, sort_keys=True))
    result = dict()
    for _dict in json['results']['bindings']:
        for key, val in _dict.items():
            if key not in result:
                result[key] = list()
            uri = str(_dict[key]["value"])
            _className = str(uri).replace(prefix, "")
            result[key].append(_className)
            # print(result)
    return result

def Display(result: dict):
    for k in result.keys():
        print()
        print(k)
        print("_______________________________")
        for val in result[k]:
            print(val)

def GetList(result: dict) -> list:
    _list = []
    for k in result.keys():
        for val in result[k]:
            _list.append(val)
    return _list

class AllClasses:
    classList = []
    prefix = "http://www.tafsirtabari.com/ontology"
    def __init__(self):
        self.prefix = "http://www.tafsirtabari.com/ontology#"

        get_all_classes_query = urllib.parse.quote('''
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>

        SELECT DISTINCT ?Classes WHERE {
            ?Classes a owl:Class.
        }
        ''')

        classesDict = Sparql_Endpoint(get_all_classes_query, self.prefix)
        self.classList = GetList(classesDict)

class AllInstances:
    instanceList = []
    prefix = "http://www.tafsirtabari.com/ontology"
    def __init__(self):
        self.prefix = "http://www.tafsirtabari.com/ontology#"
        get_all_instance_query = urllib.parse.quote('''
        SELECT DISTINCT ?s WHERE {
            ?s a ?p.
        }
        ''')
        instanceDict = Sparql_Endpoint(get_all_instance_query, self.prefix)
        self.instanceList = GetList(instanceDict)

class AllPersonNames:
    personNameList = []
    prefix = "http://www.tafsirtabari.com/ontology"
    def __init__(self) -> None:
        self.prefix = "http://www.tafsirtabari.com/ontology#"

        get_all_person_name_query = urllib.parse.quote('''
        PREFIX : <http://www.tafsirtabari.com/ontology#>
        PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        
        SELECT DISTINCT ?names WHERE {
            ?person :hasName ?names.
            ?person W3:type :Person.
        }
        ''')

        personDict = Sparql_Endpoint(get_all_person_name_query, self.prefix)
        self.personNameList = GetList(personDict)

class AllHadithNumbers:
    hadithNumbersList = []
    prefix = "http://www.tafsirtabari.com/ontology"
    def __init__(self) -> None:
        self.prefix = "http://www.tafsirtabari.com/ontology#"
        get_all_hadith_number_query = urllib.parse.quote('''
        PREFIX : <http://www.tafsirtabari.com/ontology#>
        PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        
        SELECT DISTINCT ?hadithNo WHERE {
             ?h :hasHadithNo ?hadithNo.
        }
        ''')

        hadithNumberDict = Sparql_Endpoint(get_all_hadith_number_query, self.prefix)
        self.hadithNumbersList = GetList(hadithNumberDict)

class AllThemes:
    themesList = []
    prefix = "http://www.tafsirtabari.com/ontology"
    def __init__(self) -> None:
        self.prefix = "http://www.tafsirtabari.com/ontology#"
        get_all_themes_query = urllib.parse.quote('''
        PREFIX : <http://www.tafsirtabari.com/ontology#>
        PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        
        SELECT DISTINCT ?themes WHERE {
             ?h :hasTheme ?themes.
        }
        ''')

        themesDict = Sparql_Endpoint(get_all_themes_query, self.prefix)
        self.themesList = GetList(themesDict)

class AllVerseText:
    verseTextList = []
    prefix = "http://www.tafsirtabari.com/ontology"
    def __init__(self) -> None:
        self.prefix = "http://www.tafsirtabari.com/ontology#"
        get_all_verse_text_query = urllib.parse.quote('''
        PREFIX : <http://www.tafsirtabari.com/ontology#>
        PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        
        SELECT ?text WHERE {
            ?V  W3:type  :Verse.
            ?V :hasText ?text.
        }
        ''')

        verseTextDict = Sparql_Endpoint(get_all_verse_text_query, self.prefix)
        self.verseTextList = GetList(verseTextDict)

if __name__ == "__main__":
    # Create instances of the classes
    all_classes = AllClasses()
    all_instances = AllInstances()
    all_person_names = AllPersonNames()
    all_hadith_numbers = AllHadithNumbers()
    all_themes = AllThemes()

    # Display the list of classes
    print("List of Classes:")
    for class_name in all_classes.classList:
        print(class_name)

    # Display the list of instances
    print("\nList of Instances:")
    for instance_name in all_instances.instanceList:
        print(instance_name)

    # Display the list of person names
    print("\nList of Person Names:")
    for person_name in all_person_names.personNameList:
        print(person_name)

    # Display the list of hadith numbers
    print("\nList of Hadith Numbers:")
    for hadith_number in all_hadith_numbers.hadithNumbersList:
        print(hadith_number)

    # Display the list of themes
    print("\nList of Themes:")
    for theme in all_themes.themesList:
        print(theme)
