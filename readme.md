# TYPO3 Extension nk_google_map

Die Extension stellt einen ViewHelper bereit, um Marker mit NAPI Inhalte ggf. geclustert in Google Karten darzustellen. 

Sie wird von den Nordkirche Extensions nkc_address und nkc_event verwendet für die Kartendarstellung.

Optional können auch verschiedene Filter für die Karte eingeblendet werden.

## Installation
Die Installation der Extension erfolgt über composer, falls die Extension nicht schon durch nkc-address oder nkc-event als Abhängigkeit mit installiert wurde.

    composer req nordkirche/nk-google-map


Bitte binden Sie anschließend das statische Template der Extension in Ihr TypoScript Template ein und hinterlegen Sie Ihren Google Maps Api Key in den TypoScript Konstanten.  

## Der ViewHelper

    <nk:googleMap   requestUri="" 
                    streamUri="" 
                    markers="" 
                    configuration="" />
   
  
   
### Parameter

    requestUri      Die Uri, über welche die Marker abgerufen werden können
    streamUri       Wie requestUri, aber der ViewHelper geht davon aus, dass die Marker paginiert geladen werden
    markers         JSON Objekt mit Markern (kein Nachladen)
    configuration   JSON Objekt mit Konfiguration (siehe unten)        
    
### Konfiguration

    {
        // Pfad zu den Map Icons
        "iconBasePath" : "/typo3conf/ext/nkc_base/Resources/Public/MapIcons/",
        
        // Styleangaben für Map Canvas
        "style" : "height: 300px",
        
        // Optionale CSS Klasse für den Map Container
        "cssClass" : "my-events-map",
        
        // Facetten für die optionalen Filter: wenn gesetzt, werden Filter eingeblendet
        "facets" : {
            
            "institution_type" : {
                1 : "label 1",
                2 : "label 2"  
            },
            
            "functions" : {
            },
            
            "categories" : {
            }                      
       }        
    }    

### JavaScript
Die Extensions verwendet die Google Maps Api und bindet diese automatisch ein. Damit dies funktioniert, müssen Sie Ihren Google Maps API Key in den TyposScript Konstanten hinterlegen. Wenn Sie die Google Maps Api bereits selber einbinden oder lieber an anderer Stelle einbinden wollen, können Sie dies daktivieren:

    page.includeJSFooterlibs.gmapsApi >

Außerdem wird jQuery benötigt. Dies wird ebenfalls automatisch eingebunden. Um dies zu unterbinden, verwenden Sie bitte folgenden TypoScript Code:

    page.includeJSFooterlibs.jquery >
    
