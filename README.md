# SisGPIE (Sistema Gestor de Proyectos de Innovacion y Emprendimiento)

## Descripcion

Es el Segundo proyecto de la materia de INF-281

El cual consta de un CMS para la gestion de proyectos

Esta aplicacion sera desarrollada con Angular como frontEnd. Flask en el BackEnd y MySql como base de datos, tambien se esta utilizando complementos como Cloudinary para el almacenamiento de imagenes.

La base de datos esta alojada en mysqlremote, el cual nos provee un servidor gratuito para usar la base de datos ademas de contar con phpmyadmin para su manejo de manera online.

## Requisitos

Estos son los requisitos basicos

* Python 3.9.3
* NodeJs
* Base de datos MySql

## Instalacion

Para poder ejecutar la app se necesita seguir los siguientes pasos en una terminal

### BackEnd

dentro de la carpeta backend se debe ejecutar las siguientes instrucciones:

Instalar librerias necesarias para python

```
pip install -r requirements.txt
```

una vez instaladas las librerias

```
python app.py
```

puede comprobar el funcionamiento con la siguiente ruta

`http://localhost:9999/api/`

### FrontEnd

De igual manera se necesita instalar librerias y sus dependencias, ejecutamos dentro de la carpeta frontend:

```
npm install
```

una vez instalado lo necesario, levantamos la app con:

```
ng serve
```

si no funciona, puede consultar la documentacion de angular

### Base de Datos

Sea donde sea que se encuentre su Base de datos, las variables se encuentran en el archivo configuration.py
