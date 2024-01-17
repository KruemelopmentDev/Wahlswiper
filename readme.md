#Vorraussetzungen

Es wird jquery benötigt für den Wahlswiper. [Hier herunterladen](https://jquery.com)

#Setup

```
    $(document).ready(function() {
           const swiper = new WahlSwiper(arrayFragen, arrayParteien, arrayAntworten);
           swiper.createCards("wrapperID");
       });

    arrayFragen=[{"question":"Frage1","imageURL":"images/image1.png"},....]
    question ist die Frage und imageURL gibt den Pfad zu einem Bild für die Frage an

    arrayPartien=["Partei1","Partei2",....]
    Namen aller Parteien/Kandidaten für die Wahl

    arrayAntworten=[[["short_answer":0,"long_answer":"Freitext"],...],...]
    short_answer = Antwort auf die Frage (0=nein,1=neutral,2=ja), long_answer = Freitext mit Antwort auf die Frage
```

#Styling

In der swiper.css sind oben sehr viele Variablen definiert für alle möglichen Farben um das Design leicht anzupassen.

überall klasse wahlswiper davor
