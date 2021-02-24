## Table of contents
* [General info](#general-info)
* [Installation](#installation)
* [Technologies](#technologies)
* [Screenshots](#screenshots)

## General info
Web based visualisation app which generates chess heatmaps.
Data is gathered from around 13k games and around 1M positions, every heatmap visualizes the location of pieces or the location of certain game events.

## Installation
install front-end depenencies
```
npm install
```
run local server
```
ng serve
```

## Technologies
Project is created using:
* Angular 11
* heatmap.js - https://www.patrick-wied.at/static/heatmapjs/
* chessboardjs - https://chessboardjs.com/

## Screenshots
**Most popular first moves from the white side**
![Heatmap1](src/assets/img/screen1.png)
**Most popular first moves from the black side**
![Heatmap2](src/assets/img/screen2.png)
**Last move king position from the both sides**
![Heatmap3](src/assets/img/screen3.png)
**En passant captures from the both sides**
![Heatmap4](src/assets/img/screen4.png)
**All pieces capture location from the both sides**
![Heatmap5](src/assets/img/screen5.png)
