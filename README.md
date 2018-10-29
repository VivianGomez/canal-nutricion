# Foohealli (Food, health, life)
Esta aplicación busca crear un canal de comunicación entre médicos, nutricionistas y personas con enfermedades que dependen de un tratamiento nutricional, como por ejemplo las enfermedades crónicas. Dicho canal se crea con el fin de ayudar tanto a los pacientes como a los médicos y nutricionistas. Por un lado, se quiere poder permitirle a los pacientes llevar un mejor tratamiento y mejorar su calidad de vida. Por otro lado, se busca ayudar a los médicos y nutricionistas a poder diagnosticar y tratar mejor a sus pacientes, al permitirles ver el día a día de los mismos mediante la plataforma

## Integrantes del equipo
- Gabriel Pinto

  **Página personal:** https://gabrielpinto.me

- Vivian Gómez

  **Página personal:** https://viviangomez.github.io/viviangomez

## Links de importancia

**Desplegada en:** https://foohealli-app.herokuapp.com/

## Descripción
Foohealli es una plataforma en la cual las personas que quieren y/o necesitan llevar un tratamiento nutricional, como los que padecen de IRC (Insuficiencia Renal Crónica), pueden llevar el registro de su tratamiento en términos de medicamentos y dieta. De tal forma que los médicos y nutricionistas que llevan el caso de dicho paciente, puedan acceder a dicha información, en tiempo real y ayudar a la persona durante el tratamiento y proponer mejores alternativas en los controles. 

## Objetivos

- Buscamos permitir a las personas con enfermedades crónicas mejorar su calidad de vida al poder llevar un tratamiento correcto.
- Queremos ayudar a los médicos y nutricionistas a poder diagnosticar y tratar mejor a sus pacientes, al permitirles ver el día a día de los mismos mediante la plataforma

## Screenshots

- Vista del dashboard de un paciente
##
![Screenshot de la página](https://raw.githubusercontent.com/VivianGomez/canal-nutricion/master/public/dashboardPaciente.PNG?style=centerme)
##

##
- Vista de un Doctor sobre la información de un Paciente
##
![Screenshot de la página](https://raw.githubusercontent.com/VivianGomez/canal-nutricion/master/public/medicamentosPaciente.PNG?style=centerme)

## Tecnologías utilizadas

- **Mongo DB**: Se utilizo una base de datos no relacional de MongoDB que está desplegada en https://mlab.com/
- **Meteor**: Una infraestructura web basada en JavaScript, que automatiza y simplifica el desarrollo de aplicaciones web que actúan en tiempo real. 
Maneja toda la lógica y despliegue tanto del cliente como del servidor. https://www.meteor.com
- **React JS**: Una librería que permite cosas increíbles y que fue utilizada para la creación del front de la aplicación de manera integrada con Meteor https://reactjs.org/

A su vez, se usaron varias dependencias instaladas por medio de NPM.

- JSON Web Token
- React-router-dom
- Bootstrap

Entre otras que pueden ser observadas en los package.json de la aplicación.

## API utilizado

El API utilizado se puede visualizar en https://ndb.nal.usda.gov/ndb/doc/apilist/API-SEARCH.md y fue utilizado para obtener en tiempo real datos sobre los alimentos a partir de las busquedas realizadas por los pacientes al momento de agregar un alimento consumido. 


Finalmente, la aplicación se encuentra despleagada en https://heroku.com/ , para acceder a ella se puede ingresar a https://foohealli-app.herokuapp.com/

## Instructivo para ejecución

### Requisitos

- **Meteor** 

Verificar que este instalado ejecutando "meteor --version" en el CMD o descargarlo de https://www.meteor.com/install (versión LTS).
Nota: Para usar Meteor en tu cmd necesitarás installar Chocolately, puedes hacerlo desde https://chocolatey.org/install

- **Mongo DB**

Es necesario tenerlo para correr la aplicación localmente. Se puede descargar de https://www.mongodb.com/download-center?jmp=nav#community


### Pasos para ejecutar

1) Abrir la carpeta raíz en un CMD.
2) Ejecutar "npm install" para instalar todas las dependencias necesarias.
3) Generar 2 hash diferentes usando alguna página para esto tal como https://passwordsgenerator.net/sha256-hash-generator/. 
3.1) Definir una variable de entorno de esta forma (windows): SET CODE_CRYPTR={HASH1}
3.2) Definir una variable de entorno de esta forma (windows): SET CODE_TOKEN={HASH2}
4) Ejecutar "meteor", que despliega el cliente y el servidor en los puertos 3000 y 3001, respectivamente
4.1) Tener en cuenta que la base de datos que corre Meteor es su propia base de datos de Mongo, la corre localmente y
no es la base de datos real.
4) La aplicación será abierta de forma automática en http://localhost:3000/


Esta página fue desarrollada por Gabriel Pinto Pineda y Vivian Gómez Cubillos y está listada bajo la licencia del MIT (ver archivo [LICENSE](https://github.com/VivianGomez/canal-nutricion/blob/master/LICENSE) )
