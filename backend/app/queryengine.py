#queryengine.py
import requests
from rdflib import Graph
from rdflib.plugins.sparql import prepareQuery
from django.conf import settings
import urllib.parse

def Sparql_Endpoint(query: str, prefix: str = "") -> dict:
    x = requests.get( 
        'http://Sameer:7200/repositories/FYP?query='+query+'&format=application%2Fsparql-results%2Bjson&timeout=0',
        headers={
            'Accept' : 'application/sparql-results+json', 
            'Host' : 'localhost:7200'
        }
    )
    print(x.status_code)
    #print(x.text)
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




def constructSparQLQueryString(versetext='?vtext', chapterNo='?chapterNo', verseNo='?verseNo',
                             theme='?theme', reffered_chapNo='?refferedChapNo',
                             reffered_vNo='?refferedVerseNo', refrences_chapNo='?refrencesChapNo',
                             refrences_vNo='?refrencesVerseNo', applyLimit=False, limit=None,
                             relationlst=None, categorylst=None, valuelst=None):
    baseQueryString = f'''
            PREFIX : <http://www.tafsirtabari.com/ontology#>
            PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>

           select distinct ?completeText ?chapterNo  ?VerseNo where {'{'}'''

    if versetext != '?vtext':
        baseQueryString += f'''\n  ?verse :hasText {versetext}.'''

    baseQueryString += f'''
                ?verse :isPartOfVerse ?completeVerse. 
        	?completeVerse :hasText ?completeText.
        	'''

    if chapterNo != '?chapterNo':
        baseQueryString += f'''\n   ?verse :hasChapterNo  {chapterNo}.'''
    baseQueryString += f'''
                   ?verse :hasChapterNo  ?chapterNo.
        	'''
    if verseNo != '?verseNo':
        baseQueryString += f'''\n    ?verse :hasVerseNo  {verseNo}.'''

    baseQueryString += f'''
            ?verse :hasVerseNo  ?VerseNo.
            ?section :isAbout ?Verse .
            ?section :containsCommentary ?commentary .
        	'''

    if theme != '?theme':
        baseQueryString += f'''\n     ?commentary :hasTheme {theme} .'''

    if reffered_chapNo != '?refferedChapNo' or reffered_vNo != '?refferedVerseNo':
        baseQueryString += f'''\n  
            ?commentary :references ?RefferedVerse .
            ?RefferedVerse :hasChapterNo  {reffered_chapNo}.
            ?RefferedVerse :hasVerseNo   {reffered_vNo}.
            '''

    if refrences_chapNo != '?refrencesChapNo' or refrences_vNo != '?refrencesVerseNo':
        baseQueryString += f'''\n  
          ?sectionContainingCommentary :containsCommentary   ?commentary .
            ?sectionContainingCommentary  :isAbout ?Refferingverse .
            ?Refferingverse :hasChapterNo {refrences_chapNo} .
            ?Refferingverse :hasVerseNo  {refrences_vNo}.
            '''
    #baseQueryString += constructDynamicFilterString(relationlst, categorylst, valuelst)

    baseQueryString += '}'
    if applyLimit and limit is not None and limit != '' and int(limit) > 1:
        baseQueryString += f'''
        limit {limit}
        '''

    return baseQueryString

def constructHadithSparQLQueryString(versetext='?vtext', chapterNo='?chapterNo', verseNo='?verseNo',
                             theme='?theme',hadith_number='?hadith_number', narrator = '?narrator',narratortitle='narrator-title', reffered_chapNo='?refferedChapNo',
                             reffered_vNo='?refferedVerseNo', refrences_chapNo='?refrencesChapNo',
                             refrences_vNo='?refrencesVerseNo', applyLimit=True, limit="",
                             ):
    baseQueryString = f'''
            PREFIX : <http://www.tafsirtabari.com/ontology#>
            PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
           select  DISTINCT ?Text ?HadithNo ?Theme ?RootNarrator ?NarratorType ?SurahNo ?AyatNo ?Organization ?Time ?Person  where {'{'}'''

    baseQueryString += f'''\n  ?HadithNo1 rdf:type :Hadith .'''
    if versetext != '?vtext':
        baseQueryString += f'''\n  ?verse :hasText {versetext}.'''

    #baseQueryString += f'''
     #           ?verse :isPartOfVerse ?completeVerse. 
      #  	?completeVerse :hasText ?completeText.
       # 	'''

    if chapterNo != '?chapterNo':
        baseQueryString += f'''\n   ?verse :hasChapterNo  {chapterNo}.'''
    #baseQueryString += f'''
    #               ?verse :hasChapterNo  ?chapterNo.
    #    	'''
    if verseNo != '?verseNo':
        baseQueryString += f'''\n    ?verse :hasVerseNo  {verseNo}.'''

    #baseQueryString += f'''
    #        ?verse :hasVerseNo  ?VerseNo.
    #        ?section :isAbout ?Verse .
    #        ?section :containsCommentary ?commentary .
    #    	'''
    baseQueryString += f'''\n     ?HadithNo1 :hasText ?Text.'''
    baseQueryString += f'''\n     ?HadithNo1 :hasHadithNo ?HadithNo.'''
    baseQueryString += f'''\n     ?Hadith :hasTheme ?Theme.'''



    if theme != '?theme'   :
        baseQueryString += f'''\n     ?Theme :hasName "{theme}" .''' 
    if narrator != '?narrator':
        baseQueryString += f'''\n     ?NarratorName :hasName {narrator} .'''
    if narratortitle!='narrator-title':
        baseQueryString += f'''\n     ?NarratorName :hasNarratorType {narratortitle} .'''
    if hadith_number != '?hadith_number':
        baseQueryString += f'''\n     ?HadithNo1 :hasHadithNo  "{hadith_number}" .'''
    
    if reffered_chapNo != '?refferedChapNo' or reffered_vNo != '?refferedVerseNo':
        baseQueryString += f'''\n  
            ?commentary :references ?RefferedVerse .
            ?RefferedVerse :hasChapterNo  {reffered_chapNo}.
            ?RefferedVerse :hasVerseNo   {reffered_vNo}.
            '''

    if refrences_chapNo != '?refrencesChapNo' or refrences_vNo != '?refrencesVerseNo':
        baseQueryString += f'''\n  
          ?sectionContainingCommentary :containsCommentary   ?commentary .
            ?sectionContainingCommentary  :isAbout ?Refferingverse .
            ?Refferingverse :hasChapterNo {refrences_chapNo} .
            ?Refferingverse :hasVerseNo  {refrences_vNo}.
            '''
    #baseQueryString += constructDynamicFilterString(relationlst, categorylst, valuelst)

    baseQueryString += '}'
    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        limit {limit}
        '''

    return baseQueryString
if __name__ == "__main__":
    prefix = "http://www.tafsirtabari.com/ontology"
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
        
    print("\nQuery")
    query = constructHadithSparQLQueryString(theme='lugha')

    print(query)
    results = []
    
    get_query = urllib.parse.quote(query)
    result = Sparql_Endpoint(get_query,prefix)
    print(result)