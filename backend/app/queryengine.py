
import requests
from rdflib import Graph
from rdflib.plugins.sparql import prepareQuery
#from django.conf import settings
import urllib.parse

def Sparql_Endpoint(query: str, prefix: str = "") -> dict:
    x = requests.get( 
        'http://khursheed:7200/repositories/completekg?query='+query+'&format=application%2Fsparql-results%2Bjson&timeout=0',
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
    return json

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


def FederatedQuery(person='?person', 
                    applyLimit=True, limit=""):
    newline=r"\n\n"
    baseQueryString = f'''
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX dbp: <http://dbpedia.org/property/>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT ?death ?abstract (GROUP_CONCAT(DISTINCT ?data; separator="{newline}") AS ?concatenatedData) (GROUP_CONCAT(DISTINCT ?quote; separator="{newline}") AS ?concatenatedQuotes) (GROUP_CONCAT(DISTINCT ?children; separator="{newline}") AS ?concatenatedChildren) (GROUP_CONCAT(DISTINCT ?parents; separator="{newline}") AS ?concatenatedParents) (GROUP_CONCAT(DISTINCT ?relatives; separator="{newline}") AS ?concatenatedRelatives)
WHERE {{
  ?person rdf:type :Person.
  ?person :hasName "{person}".

  ?pn rdf:type :Person.
  ?pn owl:sameAs ?person.

  SERVICE <https://dbpedia.org/sparql> {{
    ?pn dbo:wikiPageWikiLink ?data.
    ?pn dbo:abstract ?abstract.
  
    OPTIONAL {{
      ?pn dbo:deathDate ?death.
    }}
    OPTIONAL {{
      ?pn dbp:children ?children.
    }}
    OPTIONAL {{
      ?pn dbp:quote ?quote.
    }}
    OPTIONAL {{
      ?pn dbp:parents ?parents.
    }}
    OPTIONAL {{
      ?pn dbp:relatives ?relatives.
    }}
    
    FILTER(LANG(?abstract) = "en")
  }}
}}
GROUP BY ?death ?abstract

    '''
    return baseQueryString


def FederatedQuery1_2(person='?person', 
                    applyLimit=True, limit=""):
    newline=r"\n\n"
    baseQueryString = f'''
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX dbp: <http://dbpedia.org/property/>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT ?death ?abstract (GROUP_CONCAT(DISTINCT ?data; separator="{newline}") AS ?concatenatedData) (GROUP_CONCAT(DISTINCT ?quote; separator="{newline}") AS ?concatenatedQuotes) (GROUP_CONCAT(DISTINCT ?children; separator="{newline}") AS ?concatenatedChildren) (GROUP_CONCAT(DISTINCT ?parents; separator="{newline}") AS ?concatenatedParents) (GROUP_CONCAT(DISTINCT ?relatives; separator="{newline}") AS ?concatenatedRelatives)
WHERE {{
  ?person rdf:type :Other.
  ?person :hasName "{person}".

  ?pn rdf:type :Other.
  ?pn owl:sameAs ?person.

  SERVICE <https://dbpedia.org/sparql> {{
    ?pn dbo:wikiPageWikiLink ?data.
    ?pn dbo:abstract ?abstract.
  
    OPTIONAL {{
      ?pn dbo:deathDate ?death.
    }}
    OPTIONAL {{
      ?pn dbp:children ?children.
    }}
    OPTIONAL {{
      ?pn dbp:quote ?quote.
    }}
    OPTIONAL {{
      ?pn dbp:parents ?parents.
    }}
    OPTIONAL {{
      ?pn dbp:relatives ?relatives.
    }}
    
    FILTER(LANG(?abstract) = "en")
  }}
}}
GROUP BY ?death ?abstract

    '''
    return baseQueryString


def FederatedQuery1_3(person='?person', 
                    applyLimit=True, limit=""):
    newline=r"\n\n"
    baseQueryString = f'''
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX dbp: <http://dbpedia.org/property/>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT ?death ?abstract (GROUP_CONCAT(DISTINCT ?data; separator="{newline}") AS ?concatenatedData) (GROUP_CONCAT(DISTINCT ?quote; separator="{newline}") AS ?concatenatedQuotes) (GROUP_CONCAT(DISTINCT ?children; separator="{newline}") AS ?concatenatedChildren) (GROUP_CONCAT(DISTINCT ?parents; separator="{newline}") AS ?concatenatedParents) (GROUP_CONCAT(DISTINCT ?relatives; separator="{newline}") AS ?concatenatedRelatives)
WHERE {{
  ?person rdf:type :Organization.
  ?person :hasName "{person}".

  ?pn rdf:type :Organization.
  ?pn owl:sameAs ?person.

  SERVICE <https://dbpedia.org/sparql> {{
    ?pn dbo:wikiPageWikiLink ?data.
    ?pn dbo:abstract ?abstract.
  
    OPTIONAL {{
      ?pn dbo:deathDate ?death.
    }}
    OPTIONAL {{
      ?pn dbp:children ?children.
    }}
    OPTIONAL {{
      ?pn dbp:quote ?quote.
    }}
    OPTIONAL {{
      ?pn dbp:parents ?parents.
    }}
    OPTIONAL {{
      ?pn dbp:relatives ?relatives.
    }}
    
    FILTER(LANG(?abstract) = "en")
  }}
}}
GROUP BY ?death ?abstract

    '''
    return baseQueryString


def FederatedQuery_2(information="?information", 
                    applyLimit=True, limit=""):
    newline=r"\n\n"                
    baseQueryString = f'''
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX dbp: <http://dbpedia.org/property/>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT ?abstract
       (GROUP_CONCAT(DISTINCT ?data; separator="{newline} ") AS ?concatenatedData) 
       (GROUP_CONCAT(DISTINCT ?parents; separator="{newline} ") AS ?concatenatedParents)
       (GROUP_CONCAT(DISTINCT ?children; separator="{newline} ") AS ?concatenatedChildren) 
       (GROUP_CONCAT(DISTINCT ?quote; separator="{newline} ") AS ?concatenatedQuotes) 
       (GROUP_CONCAT(DISTINCT ?relatives; separator="{newline} ") AS ?concatenatedRelatives)
WHERE {{
  SERVICE <https://dbpedia.org/sparql> {{
    BIND(<{information}> as ?link)
    ?link dbo:wikiPageWikiLink ?data.
    ?link dbo:abstract ?abstract.
  
    OPTIONAL{{
      ?link dbo:deathDate ?death.
    }}
    OPTIONAL {{
      ?link dbp:children ?children.
    }}
    OPTIONAL {{
      ?link dbp:quote ?quote.
    }}
    OPTIONAL{{
      ?link dbp:parents ?parents.
    }}
    OPTIONAL {{
      ?link dbp:relatives ?relatives.
        }}
    
    FILTER(LANG(?abstract) = "en")
  }}
}}
GROUP BY ?abstract

    '''

    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''
    return baseQueryString

#this is used when the link from dbpedia is not same for resource page
def FederatedQuery_3(information="?information", 
                    applyLimit=True, limit=""):
    newline=r"\n\n"                
    baseQueryString = f'''
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX dbp: <http://dbpedia.org/property/>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT ?abstract
       (GROUP_CONCAT(DISTINCT ?data; separator="{newline} ") AS ?concatenatedData) 
       (GROUP_CONCAT(DISTINCT ?parents; separator="{newline} ") AS ?concatenatedParents)
       (GROUP_CONCAT(DISTINCT ?children; separator="{newline} ") AS ?concatenatedChildren) 
       (GROUP_CONCAT(DISTINCT ?quote; separator="{newline} ") AS ?concatenatedQuotes) 
       (GROUP_CONCAT(DISTINCT ?relatives; separator="{newline} ") AS ?concatenatedRelatives)
WHERE {{
  SERVICE <https://dbpedia.org/sparql> {{
    <{information}> ?predicate ?link .
    ?link dbo:wikiPageWikiLink ?data.
    ?link dbo:abstract ?abstract.
  
    OPTIONAL{{
      ?link dbo:deathDate ?death.
    }}
    OPTIONAL {{
      ?link dbp:children ?children.
    }}
    OPTIONAL {{
      ?link dbp:quote ?quote.
    }}
    OPTIONAL{{
      ?link dbp:parents ?parents.
    }}
    OPTIONAL {{
      ?link dbp:relatives ?relatives.
        }}
    
    FILTER(LANG(?abstract) = "en")
  }}
}}
GROUP BY ?abstract

    '''

    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''
    return baseQueryString
def getNarratorChain(hadith_number='?hadith_number', 
                    applyLimit=True, limit=""):
    baseQueryString = f'''
            PREFIX : <http://www.tafsirtabari.com/ontology#>
            PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            SELECT DISTINCT  ?Text  ?HadithNo  ?RootNarrator  ?NarratorName    WHERE {{
    '''

    baseQueryString += f'''\n  ?HadithNo1 rdf:type :Hadith .'''
    baseQueryString += f'''\n  ?HadithNo1 :hasText ?Text.'''
    baseQueryString += f'''\n  ?HadithNo1 :hasHadithNo ?HadithNo.'''
    baseQueryString += f'''\n  ?HadithNo1 :containsNarratorChain ?Narrators.'''
    baseQueryString += f'''\n  ?Narrators :hasNarratorSegment ?segment.'''
    baseQueryString += f'''\n  ?segment :refersTo ?Person.'''
    baseQueryString += f'''\n  ?Person :hasName ?NarratorName.'''
    baseQueryString += f'''\n  ?Person :hasNarratorType ?type.'''
    baseQueryString += f'''\n  ?type :hasType ?NarratorType.'''
    baseQueryString += f'''\n  ?Narrators :hasRootNarratorSegment ?Root.'''
    baseQueryString += f'''\n  ?Root :refersTo ?RootPerson .'''
    baseQueryString += f'''\n  ?RootPerson :hasName ?RootNarrator .'''
    baseQueryString += f'''\n  ?RootPerson :hasNarratorType ?Roottype.'''
    baseQueryString += f'''\n  ?Roottype :hasType ?rootNarratorType.'''

    
    if hadith_number != '?hadith_number':
        baseQueryString += f'''\n  ?HadithNo1 :hasHadithNo  "{hadith_number}" .'''

    
        

    baseQueryString += f'\n}}'

    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''
        

    return baseQueryString


def constructHadithSparQLQueryString(versetext='?vtext', chapterNo='?chapterNo', verseNo='?verseNo',
                                     theme='?theme', mentions="?mentions", subtheme="?subtheme",
                                     hadith_number='?hadith_number', RootNarrator='?root_narrator',
                                     narrator='?narrator', narratortitle='narrator-title',
                                     applyLimit=True, limit=""):
    baseQueryString = f'''
            PREFIX : <http://www.tafsirtabari.com/ontology#>
            PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            SELECT ?HadithNo
       (GROUP_CONCAT(DISTINCT ?ref_type; SEPARATOR=",") AS ?RefTypes)
       (GROUP_CONCAT(DISTINCT ?Text; SEPARATOR=",") AS ?Texts)
       (GROUP_CONCAT(DISTINCT ?rootNarratorType; SEPARATOR=",") AS ?RootNarratorTypes)
       (GROUP_CONCAT(DISTINCT ?Theme; SEPARATOR=",") AS ?Themes)
       (GROUP_CONCAT(DISTINCT ?subtheme; SEPARATOR=",") AS ?Subthemes)
       (GROUP_CONCAT(DISTINCT ?RootNarrator; SEPARATOR=",") AS ?RootNarrators)
       (GROUP_CONCAT(DISTINCT ?NarratorType; SEPARATOR=",") AS ?NarratorTypes)
       (GROUP_CONCAT(DISTINCT ?NarratorName; SEPARATOR=",") AS ?NarratorNames)
       (GROUP_CONCAT(DISTINCT ?Refer; SEPARATOR=",") AS ?Refers)
       (GROUP_CONCAT(DISTINCT ?chapter; SEPARATOR=",") AS ?Chapters)
       (GROUP_CONCAT(DISTINCT ?Verse_Text; SEPARATOR=",") AS ?VerseTexts)
       (GROUP_CONCAT(DISTINCT ?Verse_No; SEPARATOR=",") AS ?VerseNos) WHERE {{
    '''

    baseQueryString += f'''\n  ?HadithNo1 rdf:type :Hadith .'''
    baseQueryString += f'''\n  ?HadithNo1 :hasText ?Text.'''
    baseQueryString += f'''\n  ?HadithNo1 :hasHadithNo ?HadithNo.'''
    baseQueryString += f'''\n  ?HadithNo1 :hasTheme ?Theme_url.'''
    baseQueryString += f'''\n  ?Theme_url :hasName ?Theme.'''
    baseQueryString += f'''\n  OPTIONAL {{'''
    baseQueryString += f'''\n  ?HadithNo1 :hasHadithText ?text.'''
    baseQueryString += f'''\n  ?text :containsSegment ?seg.'''
    baseQueryString += f'''\n  ?seg :hasSubTheme ?subthemes.'''
    baseQueryString += f'''\n  ?subthemes :hasName ?subtheme.'''
    baseQueryString += f'''\n  ?seg :references ?verse.'''
    baseQueryString += f'''\n  ?verse :hasChapterNo ?chapter.'''
    baseQueryString += f'''\n  ?verse :hasText ?Verse_Text.'''
    baseQueryString += f'''\n  ?verse :hasVerseNo ?Verse_No.'''
    baseQueryString += f'''\n  }}'''
    baseQueryString += f'''\n  OPTIONAL {{'''
    baseQueryString += f'''\n  ?HadithNo1 :hasHadithText ?Hadith.'''
    baseQueryString += f'''\n  ?Hadith :mentions ?Ref.'''
    baseQueryString += f'''\n  ?Ref :hasName ?Refer. 
                                ?Ref rdf:type ?ref_type
                                }}'''
    baseQueryString += f'''\n  ?HadithNo1 :containsNarratorChain ?Narrators.'''
    baseQueryString += f'''\n  ?Narrators :hasNarratorSegment ?segment.'''
    baseQueryString += f'''\n  ?segment :refersTo ?Person.'''
    baseQueryString += f'''\n  ?Person :hasName ?NarratorName.'''
    baseQueryString += f'''\n  ?Person :hasNarratorType ?type.'''
    baseQueryString += f'''\n  ?type :hasType ?NarratorType.'''
    baseQueryString += f'''\n  ?Narrators :hasRootNarratorSegment ?Root.'''
    baseQueryString += f'''\n  ?Root :refersTo ?RootPerson .'''
    baseQueryString += f'''\n  ?RootPerson :hasName ?RootNarrator .'''
    baseQueryString += f'''\n  ?RootPerson :hasNarratorType ?Roottype.'''
    baseQueryString += f'''\n  ?Roottype :hasType ?rootNarratorType.'''




    if theme != '?theme':
        baseQueryString += f'''\n  ?Theme_url :hasName "{theme}" .'''

    if subtheme != '?subtheme':
        baseQueryString += f'''\n     FILTER(?subtheme = "{subtheme}").''' 
        baseQueryString += f'''\n  FILTER(?subtheme = "{subtheme}" || !BOUND(?subtheme))'''

    if narrator != '?narrator':
        baseQueryString += f'''\n     FILTER(CONTAINS(?NarratorName,"{narrator}"))''' 
        

    if narratortitle != 'narrator-title':
        baseQueryString += f'''\n  FILTER(?NarratorType = "{narratortitle}")  .'''

    if hadith_number != '?hadith_number':
        baseQueryString += f'''\n  ?HadithNo1 :hasHadithNo  "{hadith_number}" .'''

    if RootNarrator != '?root_narrator':
        baseQueryString += f'''\n FILTER(?RootNarrator = "{RootNarrator}") .'''
   
    if mentions != '?mentions':
        baseQueryString += f'''\n  FILTER(?Refer = "{mentions}") .'''
        
    
    baseQueryString += f'\n}}'
    baseQueryString += f'''\n  GROUP BY ?HadithNo'''
    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''
        

    return baseQueryString

def constructHadithSparQLQueryString_fullgraph(
                                     theme='?theme', mentions="?mentions",
                                     hadith_number='?hadith_number',
                                     narrator='?narrator', narratortitle='narrator-title',
                                     applyLimit=True, limit=""):
    baseQueryString = f'''
           PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX W3: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?HadithNo1  
       (GROUP_CONCAT(DISTINCT ?Text; SEPARATOR=",") AS ?Texts)
       (GROUP_CONCAT(DISTINCT ?Theme; SEPARATOR=",") AS ?Themes)
       (GROUP_CONCAT(DISTINCT ?NarratorType; SEPARATOR=",") AS ?NarratorTypes)
       (GROUP_CONCAT(DISTINCT ?NarratorName; SEPARATOR=",") AS ?NarratorNames)
       (GROUP_CONCAT(DISTINCT ?Refer; SEPARATOR=",") AS ?Refers) WHERE {{
  ?HadithNo1 rdf:type :Hadith .
  ?HadithNo1 :hasText ?Text.
  ?HadithNo1 :hasHadithNo ?HadithNo.
  ?HadithNo1 :hasTheme ?Theme_url.
  ?Theme_url :hasName ?Theme.
  
 

  OPTIONAL {{
    ?HadithNo1 :hasHadithText ?Hadith.
    ?Hadith :mentions ?Ref.
    ?Ref :hasName ?Refer.
    ?Ref rdf:type ?ref_type.
  }}

  ?HadithNo1 :containsNarratorChain ?Narrators.
  ?Narrators :hasNarratorSegment ?segment.
  ?segment :refersTo ?Person.
  ?Person :hasName ?NarratorName.
  ?Person :hasNarratorType ?type.
  ?type :hasType ?NarratorType.


 
  
 


 
    '''






    if theme != '?theme':
        baseQueryString += f'''\n  FILTER(?Theme="{theme}" ) .'''

 

    if narrator != '?narrator':
        baseQueryString += f'''\n     FILTER(CONTAINS(?NarratorName,"{narrator}"))''' 
        

    if narratortitle != 'narrator-title':
        baseQueryString += f'''\n  FILTER(?NarratorType = "{narratortitle}")  .'''

    if hadith_number != '?hadith_number':
        baseQueryString += f'''\n  ?HadithNo1 :hasHadithNo  "{hadith_number}" .'''

    
   
    if mentions != '?mentions':
        baseQueryString += f'''\n  FILTER(?Refer = "{mentions}") .'''
        
    
    baseQueryString += f'\n}}'
    baseQueryString += f'''\n  GROUP BY ?HadithNo1'''
    #baseQueryString += f'''\n  Limit 500'''
    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''
        

    return baseQueryString



def constructHadithSparQLQueryString_fullgraph2(HADITH_IRI,applyLimit=True, limit=""):
    baseQueryString = f'''
           
            PREFIX : <http://www.tafsirtabari.com/ontology#>
            PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            SELECT ?HadithNo1
       
       (GROUP_CONCAT(DISTINCT ?subtheme; SEPARATOR=",") AS ?Subthemes)
       
       ?chapter
        ?Verse_Text ?Verse_No WHERE {{
  BIND({HADITH_IRI} AS ?HadithNo1)

  OPTIONAL {{
  ?HadithNo1 :hasHadithText ?text.
  ?text :containsSegment ?seg.
  ?seg :hasSubTheme ?subthemes.
  ?subthemes :hasName ?subtheme.
  ?seg :references ?verse.
  ?verse :hasChapterNo ?chapter.
  ?verse :hasText ?Verse_Text.
  ?verse :hasVerseNo ?Verse_No.
  }}


 
}}
  GROUP BY ?HadithNo1 ?chapter
        ?Verse_Text ?Verse_No
 


 
    '''






    
        
    

    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''
        

    return baseQueryString

def constructCommentarySparQLQueryString(commno='?number',chapterNo='?chapter_no', verseNo='?V_no',
                                     theme='?theme', mentions="?mentions", subtheme="?subtheme", 
                                     applyLimit=True, limit=""):
    baseQueryString = f'''
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?number
       (GROUP_CONCAT(DISTINCT ?Text; separator=", ") as ?Texts)
       (GROUP_CONCAT(DISTINCT ?chapter_no; separator=", ") as ?chapter_nos)
       (GROUP_CONCAT(DISTINCT ?V_Text; separator=", ") as ?V_Texts)
       (GROUP_CONCAT(DISTINCT ?V_no; separator=", ") as ?V_nos)
       (GROUP_CONCAT(DISTINCT ?name; separator=", ") as ?person_names)
       (GROUP_CONCAT(DISTINCT ?page; separator=", ") as ?pages)
       (GROUP_CONCAT(DISTINCT ?volume; separator=", ") as ?volumes)
       (GROUP_CONCAT(DISTINCT ?edition; separator=", ") as ?editions)
       (GROUP_CONCAT(DISTINCT ?theme_name; separator=", ") as ?theme_names)
       (GROUP_CONCAT(DISTINCT ?sec_chp; separator=", ") as ?sec_chps)
       (GROUP_CONCAT(DISTINCT ?sec_no; separator=", ") as ?sec_nos)
       (GROUP_CONCAT(DISTINCT ?sec_text; separator=", ") as ?sec_texts)
       (GROUP_CONCAT(DISTINCT ?subtheme; separator=", ") as ?subthemes)
       (GROUP_CONCAT(DISTINCT ?refer_type_suffix; separator=", ") as ?refer_type)
       (GROUP_CONCAT(DISTINCT ?per_type; separator=", ") as ?p_type)
WHERE {{
  ?Commentary rdf:type :Commentary.
  ?Commentary :hasCommentaryNo ?number.
  
  ?Commentary :hasText ?Text.
  ?Commentary :references ?Verse.
  ?Verse rdf:type ?refer_type.
  BIND(SUBSTR(STR(?refer_type), STRLEN(STR(:)) + 1) AS ?refer_type_suffix)
    optional {{
    ?Verse :hasChapterNo ?chapter_no.
    ?Verse :hasText ?V_Text.
    ?Verse :hasVerseNo ?V_no.
    ?Commentary :mentions ?person.
    ?person :hasName ?name.
    ?person rdf:type ?p_type.
    BIND(SUBSTR(STR(?p_type), STRLEN(STR(:)) + 1) AS ?per_type).
  }}
    OPTIONAL {{
    ?Commentary :hasBookLocation ?BL.
    ?BL :hasPageNo ?page.
    ?BL :hasVolumeNo ?volume.
    ?BL :hasEdition ?edition.
  }}
  optional {{
    ?Commentary :containsSegment ?segment.
    ?segment :hasText ?seg_text.
    ?segment :hasSubTheme ?sub.
    ?sub :hasName ?subtheme. 
  }}
  ?Commentary :hasTheme ?theme.
  ?theme :hasName ?theme_name.

  optional {{
    ?section rdf:type :Section.
    ?section :containsCommentary ?Commentary.
    ?section :hasChapterNo ?sec_chp.
    ?section :hasSectionNo ?sec_no.
    ?section :hasText ?sec_text.
  }}


    '''

    if commno != '?number':
        baseQueryString += f'''\n  FILTER(?number = "{commno}")'''
        baseQueryString += f'''\n  FILTER(?number = "{commno}" || !BOUND(?number))'''


    if chapterNo != '?chapter_no':
        baseQueryString += f'''\n  FILTER(?chapter_no = "{chapterNo}")'''
        baseQueryString += f'''\n  FILTER(?chapter_no = "{chapterNo}" || !BOUND(?chapter_no))'''

    if verseNo != '?V_no':
        baseQueryString += f'''\n  FILTER(?V_no = "{verseNo}")'''
        baseQueryString += f'''\n  FILTER(?V_no = "{verseNo}" || !BOUND(?V_no))'''
 
    if theme != '?theme':
        baseQueryString += f'''\n  Filter(?theme_name="{theme}") .'''

    if subtheme != '?subtheme':
        baseQueryString += f'''\n     FILTER(?subtheme = "{subtheme}").''' 
        baseQueryString += f'''\n  FILTER(?subtheme = "{subtheme}" || !BOUND(?subtheme))'''

    if mentions != '?mentions':
        baseQueryString += f'''\n  FILTER(?name = "{mentions}") .'''

    baseQueryString += f'\n}}'
    baseQueryString += f'\n GROUP BY ?number'

    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''

    return baseQueryString

def constructCommentarySparQLQueryString_fullgraph(commno='?number',chapterNo='?chapter_no', verseNo='?V_no',
                                     theme='?theme', mentions="?mentions", 
                                     applyLimit=True, limit=""):
    baseQueryString = f'''
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT DISTINCT ?number ?Text  ?V_Text ?chapter_no ?V_no ?Commentary  (GROUP_CONCAT(DISTINCT ?theme_name; SEPARATOR=",") AS ?themes) (GROUP_CONCAT(DISTINCT ?name; SEPARATOR=",") AS ?names)
WHERE {{
  ?Commentary rdf:type :Commentary.
  ?Commentary :hasCommentaryNo ?number.

  ?Commentary :hasText ?Text.
  ?Commentary :references ?Verse.
  ?Commentary :hasTheme ?theme.
  ?theme :hasName ?theme_name.
  ?Verse :hasChapterNo ?chapter_no.
  ?Verse :hasText ?V_Text.
  ?Verse :hasVerseNo ?V_no.
  ?Commentary :mentions ?person.
  ?person :hasName ?name.
    
    









    '''

    if commno != '?number':
        baseQueryString += f'''\n  FILTER(?number = "{commno}")'''



    if chapterNo != '?chapter_no':
        baseQueryString += f'''\n  FILTER(?chapter_no = "{chapterNo}")'''


    if verseNo != '?V_no':
        baseQueryString += f'''\n  FILTER(?V_no = "{verseNo}")'''
        
 
    if theme != '?theme':
        baseQueryString += f'''\n  Filter(?theme_name="{theme}") .'''


    if mentions != '?mentions':
        baseQueryString += f'''\n  FILTER(?name = "{mentions}") .'''

    baseQueryString += f'\n}}'
    baseQueryString += f'\n group by ?number ?Text  ?V_Text ?chapter_no ?V_no ?Commentary'
    


    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''
    else:
        baseQueryString += f'\n limit 5'
    return baseQueryString

def constructCommentarySparQLQueryString_fullgraph2(Commentary_IRI, subtheme="?subtheme", 
                                     applyLimit=True, limit=""):
    baseQueryString = f'''
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT   (GROUP_CONCAT(DISTINCT ?subtheme; SEPARATOR=",") AS ?subthemes)
WHERE {{
    BIND({Commentary_IRI} as ?Commentary)
  ?Commentary rdf:type :Commentary.
     OPTIONAL {{

    ?Commentary :containsSegment ?segment.
    ?segment :hasText ?seg_text.
    ?segment :hasSubTheme ?sub.
    ?sub :hasName ?subtheme.
  
  }}
  
 



    '''



    if subtheme != '?subtheme':
        baseQueryString += f'''\n     FILTER(?subtheme = "{subtheme}").''' 
      



    baseQueryString += f'\n}}'
  

    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''

    return baseQueryString

def constructCommentarySparQLQueryString_fullgraph3(Commentary_IRI, 
                                     applyLimit=True, limit=""):
    baseQueryString = f'''
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT DISTINCT  ?volume ?edition (GROUP_CONCAT(DISTINCT ?page; SEPARATOR=",") AS ?pages)
WHERE {{
    BIND({Commentary_IRI} as ?Commentary)
  ?Commentary rdf:type :Commentary.
     OPTIONAL {{
    ?Commentary :hasBookLocation ?BL.
    ?BL :hasPageNo ?page.
    ?BL :hasVolumeNo ?volume.
    ?BL :hasEdition ?edition.
  }}
  






}} group by ?volume ?edition


  
 



    '''




  

    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''

    return baseQueryString
def constructVerseSparQLQueryString(chapterNo='?chapterNo', verseNo='?verseNo',
                                     theme='?theme', hadithTheme='?hadithTheme', reference="?reference", subtheme="?subtheme",hadith_number='?hadith_number',
                                     narrator='?narrator', 
                                     commno='?commno',applyLimit=True, limit=""):
    baseQueryString = f'''
            PREFIX : <http://www.tafsirtabari.com/ontology#>
            PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            SELECT  ?chapter ?Verseno (GROUP_CONCAT(DISTINCT ?Text; SEPARATOR=";") as ?Texts)
       (GROUP_CONCAT(DISTINCT ?Surahname; SEPARATOR=";") as ?Surahnames)
       (GROUP_CONCAT(DISTINCT ?commno; SEPARATOR=";") as ?commnos)
       (GROUP_CONCAT(DISTINCT ?commtext; SEPARATOR=";") as ?commtexts)
       (GROUP_CONCAT(DISTINCT ?reference; SEPARATOR=";") as ?references)
       (GROUP_CONCAT(DISTINCT ?themename; SEPARATOR=";") as ?themenames)
       (GROUP_CONCAT(DISTINCT ?subtheme; SEPARATOR=";") as ?subthemes)
       (GROUP_CONCAT(DISTINCT ?segment_text; SEPARATOR=";") as ?segment_texts)
       (GROUP_CONCAT(DISTINCT ?hadithno; SEPARATOR=";") as ?hadithnos)
       (GROUP_CONCAT(DISTINCT ?hadithtext; SEPARATOR=";") as ?hadithtexts)
       (GROUP_CONCAT(DISTINCT ?name; SEPARATOR=";") as ?names)
       (GROUP_CONCAT(DISTINCT ?page; SEPARATOR=";") as ?pages)
       (GROUP_CONCAT(DISTINCT ?volume; SEPARATOR=";") as ?volumes)
       (GROUP_CONCAT(DISTINCT ?edition; SEPARATOR=";") as ?editions)
       (GROUP_CONCAT(DISTINCT ?hadithTheme; SEPARATOR=";") as ?hadithThemes) WHERE {{
    '''

    baseQueryString += f'''\n  ?Verse rdf:type :Verse .'''
    baseQueryString += f'''\n  ?Verse :hasText ?Text.'''
    baseQueryString += f'''\n  ?Verse :hasChapterNo ?chapter.'''
    baseQueryString += f'''\n  ?Verse :hasVerseNo ?Verseno.'''
    baseQueryString += f'''\n  ?Verse :containsVerseFragment ?versefragment.'''
    baseQueryString += f'''\n  ?Surah rdf:type :Surah.'''
    baseQueryString += f'''\n  ?Surah :containsVerse ?Verse.'''
    baseQueryString += f'''\n  ?Surah :hasName ?Surahname.'''
    baseQueryString += f'''\n  ?Commentary rdf:type :Commentary.'''
    baseQueryString += f'''\n  ?Commentary :references ?versefragment.'''
    baseQueryString += f'''\n  ?Commentary :hasCommentaryNo ?commno.'''
    baseQueryString += f'''\n  ?Commentary :hasText ?commtext.'''
    baseQueryString += f'''\n  ?Commentary :mentions ?person.'''
    baseQueryString += f'''\n  ?person :hasName ?reference.'''
    baseQueryString += f'''\n  ?Commentary :hasTheme ?theme.'''
    baseQueryString += f'''\n  ?theme :hasName ?themename.'''
    baseQueryString += f'''\n  ?Commentary :containsSegment ?seg.'''
    baseQueryString += f'''\n  optional {'{'} '''
    baseQueryString += f'''\n  ?Commentary :hasBookLocation ?BL.'''
    baseQueryString += f'''\n  ?BL :hasPageNo ?page.'''
    baseQueryString += f'''\n  ?BL :hasVolumeNo ?volume.'''
    baseQueryString += f'''\n  ?BL :hasEdition ?edition.'''
    baseQueryString += f'''\n  {'}'}'''
    baseQueryString += f'''\n  optional {'{'}'''
    baseQueryString += f'''\n  ?seg :hasText ?segment_text.'''
    baseQueryString += f'''\n  ?seg :hasSubTheme ?sub.'''
    baseQueryString += f'''\n  ?sub :hasName ?subtheme.'''
    baseQueryString += f'''\n  {'}'}'''
    baseQueryString += f'''\n  ?Hadith rdf:type :HadithText.'''
    baseQueryString += f'''\n  optional {'{'}'''
    baseQueryString += f'''\n  ?Hadith :references ?versefragment.'''
    baseQueryString += f'''\n  ?Hadith :hasHadithNo ?hadithno.
                               ?Hadith :hasText ?hadithtext.
                                {'}'}
                                    optional{'{'}   
                                ?Hadith_1 rdf:type :HadithText.
                                ?Hadith_1 :references ?versefragment.
                                ?Hadith_2 rdf:type :Hadith.
                                ?Hadith_2 :hasHadithText ?Hadith_1.
                                ?Hadith_2 :hasTheme ?htheme.
                                ?htheme :hasName ?hadithTheme.
                                ?Hadith_2 :containsNarratorChain ?chain.
                                ?chain :hasNarratorSegment ?narrator.
                                ?narrator :refersTo ?nar.
                                ?nar :hasName ?name.
                                {'}'}'''

    if chapterNo != '?chapterNo':
        baseQueryString += f'''\n  FILTER(?chapter = "{chapterNo}")'''
        baseQueryString += f'''\n  FILTER(?chapter = "{chapterNo}" || !BOUND(?chapter))'''

    if verseNo != '?verseNo':
        baseQueryString += f'''\n  FILTER(?Verseno = "{verseNo}")'''
        baseQueryString += f'''\n  FILTER(?Verseno = "{verseNo}" || !BOUND(?Verseno))'''

    if theme != '?theme':
       
        baseQueryString += f'''\n FILTER(?themename = '{theme}')'''

    if hadithTheme != '?hadithTheme':
       
        baseQueryString += f'''\n FILTER(?hadithTheme = '{hadithTheme}')'''

    if subtheme != '?subtheme':
        baseQueryString += f'''\n     FILTER(?subtheme = "{subtheme}").''' 
        baseQueryString += f'''\n  FILTER(?subtheme = "{subtheme}" || !BOUND(?subtheme))'''

    if commno != '?commno':
        baseQueryString += f'''\n     FILTER(?commno = "{commno}").''' 
        baseQueryString += f'''\n  FILTER(?commno = "{commno}" || !BOUND(?commno))'''


    if reference != '?reference':
        baseQueryString += f'''\n     FILTER(?reference = "{reference}").''' 
        baseQueryString += f'''\n  FILTER(?reference = "{reference}" || !BOUND(?reference))'''
    
    if narrator != '?narrator':
        baseQueryString += f'''\n     FILTER(CONTAINS(?name,"{narrator}"))''' 
    
    if hadith_number != '?hadith_number':
        baseQueryString += f'''\n     FILTER(CONTAINS(?hadithno,"{hadith_number}"))''' 
    baseQueryString += f'\n}}'
    baseQueryString += f'''\n  GROUP BY ?chapter ?Verseno'''
    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''

    return baseQueryString

def constructVerseSparQLQueryString_fullgraph(chapterNo='?chapterNo', verseNo='?verseNo',
                                               applyLimit=True, limit=""):
    baseQueryString = f'''
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT Distinct ?Verse ?chapter ?Verseno ?Text ?Surahname  WHERE {{

  ?Verse rdf:type :Verse .
  ?Verse :hasText ?Text.
  ?Verse :hasChapterNo ?chapter.
  ?Verse :hasVerseNo ?Verseno.
  ?Verse :containsVerseFragment ?versefragment.
  ?Surah rdf:type :Surah.
  ?Surah :containsVerse ?Verse.
  ?Surah :hasName ?Surahname.
    



 
    '''

    

    if chapterNo != '?chapterNo':
        baseQueryString += f'''\n  FILTER(?chapter = "{chapterNo}")'''
        

    if verseNo != '?verseNo':
        baseQueryString += f'''\n  FILTER(?Verseno = "{verseNo}")'''
        

    
    baseQueryString += f'\n}}'
    
    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''

    return baseQueryString

def constructVerseSparQLQueryString_fullgraph2(VERSE_IRI,
                                     theme='?theme', reference="?reference", 
                                     applyLimit=True, limit=""):
    baseQueryString = f'''
            PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT Distinct ?Verse ?commno ?commtext   (GROUP_CONCAT(DISTINCT ?themename; SEPARATOR=",") AS ?Theme) 
                (GROUP_CONCAT(DISTINCT ?reference; SEPARATOR=",") AS ?reference_people)  WHERE {{
   BIND(<{VERSE_IRI}> as ?Verse).
  ?Verse :containsVerseFragment ?versefragment.
  ?Surah rdf:type :Surah.
  ?Surah :containsVerse ?Verse.
  ?Commentary rdf:type :Commentary.
  ?Commentary :references ?versefragment.
  ?Commentary :hasCommentaryNo ?commno.
  ?Commentary :hasText ?commtext.
  ?Commentary :mentions ?person.
  ?person :hasName ?reference.
  ?Commentary :hasTheme ?theme.
  ?theme :hasName ?themename.

    


    '''




    if theme != '?theme':
       
        baseQueryString += f'''\n FILTER(?themename = '{theme}')'''




    if reference != '?reference':
        baseQueryString += f'''\n     FILTER(?reference = "{reference}").''' 
      
    


    baseQueryString += f'\n}}'
    baseQueryString += f'''\n  GROUP BY ?Verse ?commno ?commtext'''
    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''

    return baseQueryString

def constructVerseSparQLQueryString_fullgraph3(VERSE_IRI,applyLimit=True, limit=""):
    baseQueryString = f'''
            PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT Distinct ?Verse ?hadithno  (GROUP_CONCAT(DISTINCT ?hadithTheme; SEPARATOR=",") AS ?Theme) 
                (GROUP_CONCAT(DISTINCT ?name; SEPARATOR=",") AS ?narrators)  ?hadithtext WHERE {{
   BIND(<#V002:003> as ?Verse).
  ?Verse :containsVerseFragment ?versefragment.
  ?Surah rdf:type :Surah.
  ?Surah :containsVerse ?Verse.
    optional{{
      ?Hadith_1 rdf:type :HadithText.
    ?Hadith_1 :references ?versefragment.
    ?Hadith_2 rdf:type :Hadith.
    ?Hadith_2 :hasHadithText ?Hadith_1.
    ?Hadith_2 :hasTheme ?htheme.
    ?htheme :hasName ?hadithTheme.
    ?Hadith_1 :hasHadithNo ?hadithno.
    ?Hadith_1 :hasText ?hadithtext.
    ?Hadith_2 :containsNarratorChain ?chain.
    ?chain :hasNarratorSegment ?narrator.
    ?narrator :refersTo ?nar.
    ?nar :hasName ?name.
    }} 

    

}} Group by ?hadithtext ?Verse ?hadithno
    '''
    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''

    return baseQueryString

def constructVerseSparQLQueryString_fullgraph4(VERSE_IRI,applyLimit=True, limit=""):
    baseQueryString = f'''
           PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT Distinct ?Verse  (GROUP_CONCAT(DISTINCT ?page; SEPARATOR=",") AS ?pages) ?volume ?edition  WHERE {{
   BIND(<{VERSE_IRI}> as ?Verse).
  ?Verse :containsVerseFragment ?versefragment.
  ?Surah rdf:type :Surah.
  ?Surah :containsVerse ?Verse.
  ?Commentary rdf:type :Commentary.
  ?Commentary :references ?versefragment.
  ?Commentary :containsSegment ?seg.
  optional {{
  ?Commentary :hasBookLocation ?BL.
  ?BL :hasPageNo ?page.
  ?BL :hasVolumeNo ?volume.
  ?BL :hasEdition ?edition.
  }}

 
    

}} group by ?Verse ?volume ?edition


    '''
    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''

    return baseQueryString

def constructVerseSparQLQueryString_fullgraph5(VERSE_IRI,applyLimit=True, limit=""):
    baseQueryString = f'''
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT Distinct ?Verse  (GROUP_CONCAT(DISTINCT ?subtheme; SEPARATOR=",") as ?subthemes)   WHERE {{
   BIND(<{VERSE_IRI}> as ?Verse).
  ?Verse :containsVerseFragment ?versefragment.
  ?Surah rdf:type :Surah.
  ?Surah :containsVerse ?Verse.
  ?Commentary rdf:type :Commentary.
  ?Commentary :references ?versefragment.
  ?Commentary :containsSegment ?seg.
 optional {{
  ?seg :hasText ?segment_text.
  ?seg :hasSubTheme ?sub.
  ?sub :hasName ?subtheme.
  }}

 
    

}} Group by ?Verse


    '''
    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''

    return baseQueryString

    
    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''

    return baseQueryString
    
    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''

    return baseQueryString
    
    if applyLimit and limit is not None and limit != '' and int(limit) >= 1:
        baseQueryString += f'''
        LIMIT {limit}
        '''

    return baseQueryString

def competencyquestion1():
    baseQueryString = '''
        PREFIX : <http://www.tafsirtabari.com/ontology#>
        PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        SELECT DISTINCT ?reference ?Text ?chapter ?Verseno ?Surahname WHERE {
    '''

    baseQueryString += '\n  ?Verse rdf:type :Verse .'
    baseQueryString += '\n  ?Verse :hasText ?Text.'
    baseQueryString += '\n  ?Verse :hasChapterNo ?chapter.'
    baseQueryString += '\n  ?Verse :hasVerseNo ?Verseno.'
    baseQueryString += '\n  optional {'
    baseQueryString += '\n    ?Verse :containsVerseFragment ?versefragment.'
    baseQueryString += '\n    ?Surah rdf:type :Surah.'
    baseQueryString += '\n    ?Surah :containsVerse ?Verse.'
    baseQueryString += '\n    ?Surah :hasName ?Surahname.'
    baseQueryString += '\n  }'
    baseQueryString += '\n  ?Commentary rdf:type :Commentary.'
    baseQueryString += '\n  ?Commentary :references ?versefragment.'
    baseQueryString += '\n  ?Commentary :hasCommentaryNo ?commno.'
    baseQueryString += '\n  ?Commentary :hasText ?commtext.'
    baseQueryString += '\n  ?Commentary :mentions ?person.'
    baseQueryString += '\n  ?person :hasName ?reference.'


    baseQueryString += '\n  FILTER(?reference = "ابن عباس").'
    baseQueryString += '\n}'
    baseQueryString += '\nLIMIT 100'  # Adjust the limit as needed


    return baseQueryString


# Latest Competancy Questions:

#how many times has {name} narrated hadith
def competencyquestion2():
    baseQueryString = '''
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?narrator_name (COUNT(?narrator2_name) AS ?heard_count)
WHERE {
    ?Narrator :hasName ?narrator_name.
    ?Narrator :heardFrom ?Narrator2.
    ?Narrator2 :hasName ?narrator2_name.
    
    FILTER(?narrator_name="سفيان")
}
GROUP BY ?narrator_name
ORDER BY DESC(?heard_count)

    '''

   


    return baseQueryString
#No of Hadiths in each Theme:
def competencyquestion3():
    baseQueryString = '''
#No of Hadiths in each Theme:
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX W3:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
select ?Theme_Name ?Hadis_count(count( ?Hadis ) as ?Hadis_count)
where {
?Theme rdf:type :Theme.
?Theme :hasName ?Theme_Name.
?Hadis :hasTheme ?Theme.
?Hadis rdf:type :Hadith.
}group by ?Theme_Name
    '''

   


    return baseQueryString

#hadith narrated by ibn abbas
def competencyquestion4():
    baseQueryString = '''
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT Distinct ?no  ?name
WHERE {
    ?Hadith_no rdf:type :Hadith .
    ?Hadith_no :hasTheme ?Theme .
    ?Hadith_no :hasHadithNo ?no .
    

     ?NarratorName :hasName ?name.
    ?NarratorName :hasName "ابن عباس" .
    ?NarratorName :hasNarratorType ?narratortitle .

}

    '''

   


    return baseQueryString

#most heard from narrators
def competencyquestion5():
    baseQueryString = '''
           #write a query to display names of most heard from narrators with count
PREFIX : <http://www.tafsirtabari.com/ontology#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

            SELECT ?narrator_name (COUNT(?narrator2_name) AS ?heard_count)
            WHERE {
                ?Narrator :hasName ?narrator_name.
                ?Narrator :heardFrom ?Narrator2.
                ?Narrator2 :hasName ?narrator2_name.
            }
            GROUP BY ?narrator_name
            ORDER BY DESC(?heard_count)

    '''

   


    return baseQueryString
# What is the Theme of Hadith 189
def competencyquestion6():
    baseQueryString = '''
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

select ?HadithNo ?Theme
where {
    ?HadithNo rdf:type :Hadith.
    ?HadithNo :hasHadithNo "189".
    ?HadithNo :hasTheme ?Theme.
}
'''

    return baseQueryString

# What is the Name of Surah 12? 
def competencyquestion7():
    baseQueryString = '''
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

select ?Name
where {
    ?Surah rdf:type :Surah.
    ?Surah :hasSurahNo '12'.
    ?Surah :hasName ?Name.
}
'''
    return baseQueryString

# What are the names of narrators and narrator they heard hadith from? 
def competencyquestion8():
    baseQueryString = '''
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

select *
where {
    ?Narrator :hasName ?name1.
    ?Narrator :heardFrom ?Narrator2.
    ?Narrator2 :hasName ?name2.
}
'''
    return baseQueryString

# What is the text of Verse 3 in Surah 12? 
def competencyquestion9():
    baseQueryString = '''
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT DISTINCT ?Text
WHERE {
    ?Surah rdf:type :Surah.
    ?Surah :hasSurahNo '12'.
    ?Surah :containsVerse ?Verse.
    ?Verse :hasVerseNo '3'.
    ?Verse :hasText ?Text.
}
'''
    return baseQueryString

# What are all the names mentioned with their count in all Hadith? 
def competencyquestion10():
    baseQueryString = '''
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?person_name (COUNT(?person_name) as ?mention_count)
WHERE {
    ?Hadith rdf:type :Hadith.
    ?Hadith :hasText ?text.
    ?Hadith :mentions ?name.
    ?name :hasName ?person_name.
}
GROUP BY ?person_name
ORDER BY DESC(?mention_count)
'''
    return baseQueryString

# What hadith follows what hadith? 
def competencyquestion11():
    baseQueryString = '''
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?hadith_no ?follows
WHERE {
    ?Hadith rdf:type :Hadith.
    ?Hadith :hasHadithNo ?hadith_no.
    ?Hadith :follows ?follows.
    ?follows :hasHadithNo ?text.
}
'''
    return baseQueryString

# Finding all verses which have used the word مِنْ
def competencyquestion12():
    baseQueryString = '''
PREFIX : <http://www.tafsirtabari.com/ontology#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

select ?no ?name ?Text
where {
  ?Surah rdf:type :Surah.
    ?Surah :hasSurahNo ?no.
    ?Surah :hasName ?name.
    ?Surah :containsVerse ?Verse.
    ?Verse :hasText ?Text.
    FILTER(CONTAINS(?Text,  'مِنْ'))
}
'''
    return baseQueryString


# End of Latest Comp Questions

if __name__ == "__main__":
    prefix = "http://www.tafsirtabari.com/ontology"
    # Create instances of the classes
    """
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
    query = constructHadithSparQLQueryString(theme='lugha')"""
    # query = constructHadithSparQLQueryString()

    #query = constructVerseSparQLQueryString_fullgraph(chapterNo='2')
    #query = constructVerseSparQLQueryString_fullgraph4(VERSE_IRI="#V002:008")

    #query = constructCommentarySparQLQueryString_fullgraph(theme='lugha')
    #query = constructCommentarySparQLQueryString_fullgraph2(Commentary_IRI=":C_007_SS_002.001.008")
    #query = constructCommentarySparQLQueryString_fullgraph3(Commentary_IRI=":C_007_SS_002.001.008")
    
    #query = constructHadithSparQLQueryString_fullgraph2(HADITH_IRI=':HD_35307')
    #query = getNarratorChain(hadith_number="120")
    
    #query=FederatedQuery_2(information="http://dbpedia.org/resource/Muhammad")
    #query=FederatedQuery_2(information="http://dbpedia.org/resource/Amina_bint_Wahb")
    print(query)
    results = []
    
    get_query = urllib.parse.quote(query)
    result = Sparql_Endpoint(get_query,prefix)
    print(result)
"""    abstracts = []

for results in result["results"]["bindings"]:
    abstract = results["abstract"]["value"]
    abstracts.append(abstract)

print(abstracts)"""
print("finish")
