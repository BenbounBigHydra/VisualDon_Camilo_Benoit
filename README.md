# VisualDon_Camilo_Benoit

## Contexte
Nous nous sommes posées la question de la place de la musique classique dans le paysiage musical actuel. Y a-t-il des tendances qui se dégagent et que peuvent-elles nous apprendre sur notre fonctionnement en tant que société. <br>
_Le terme "musique classique" sera régulièrement utilisé dans ce projet pour désigner la "musique savante"._

## Description
Sources de données :
* Données compositeurs - [Open Opus](https://openopus.org/) : API contenant de nombreuses métadonnées concernant des compositeurs.trices de musique classique. Elle propose également deux catégories de compositeurs.trices et oeuvres : Populaires et Essentielles. Comme le projet est encore relativement récent, le catalogue mis à disposition est encore limité ; en particulier, seules des oeuvres du domaine public sont recensées et il peut donc manquer des compositeurs.trices récentes qui ont été ajoutés manuellement.
* Infos morceaux - [Wikipedia](https://fr.wikipedia.org/) : Cette librairie participative recense toutes les informations des morceaux que nous avons sélectionnés, nous avons récupéré manuellement la date de composition ainsi qu'un paragraphe descriptif de ceux-ci.
* Portrait compositeurs - [Wikimedia Commons](https://commons.wikimedia.org/wiki/Main_Page) : En complément des informations, nous sommes allé récupérer le liens des portraits des compositeurs sur wikimedia afin de les ajouter à nos données.
* Source des fichiers audio - [Spotify Api](https://developer.spotify.com/documentation/web-api) La collecte de fichiers audio est un sujet complexe car il est difficile de savoir ce que nous avons le droit d'utiliser ou non. Nous nous sommes finalement décidé à utiliser l'api de Spotify qui fourni un extrait gratuit de chacun de ses morceaux, nous étions donc garanti de tous les y trouver. De plus, Spotify propose une documentation complète de l'utilisation de son api.

Toutes ces données ont été rassemblées dans notre propre base de donnée créée pour ce projet.

## But
Le but de cette représentation est d'explorer l'impact de la musique savante, communément appelée musique classique, sur la société actuelle à travers le degré de connaissance de différentes oeuvres et compositeurs.trices classiques. Nous voulons comprendre la corrélation possible entre l'éducation musicale d'une personne ainsi que ses préférences musicales et le degré de connaissance de cette personne vis-à-vis de la musique savante.

## Références

* [Identifying Generational Gaps in Music](https://pudding.cool/2020/04/music-challenge/) : Utilise un fonctionnement similaire pour rassembler la data parmis les personnes qui visitent le site

## User Flow & Wireframe
[Lien du figma](https://www.figma.com/board/RgDgoJ2lp9OvmKoIbm7L47/VisualDon_UX?node-id=0-1&t=KX4CVLwm9DIAV8W0-1)

## Base de données
[UML de la DB](https://dbdiagram.io/d/visualDon_classique-69c50a5878c6c4bc7a735698)

# <!-- C'est juste pour avoir un séparateur -->
_[Consignes du projet](https://github.com/MediaComem/comem-visualdon/tree/main/projet#projet)_
