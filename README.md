# Foohealli (Food, health, life)
This application seeks to create a communication channel between doctors, nutritionists and people who are dependent on a nutritional treatment, such as patients of chronic diseases. This channel is created in order to help the patients and doctors and nutritionists. On the one hand, we want to allow patients to take better treatments and improve their quality of life. On the other hand, we seek to help doctors and nutritionists to diagnose and treat their patients better, by allowing them to see their daily lives through the platform


## Team
- Gabriel Pinto

  **Personal web page:** https://gabrielpinto.me

- Vivian Gómez

  **Personal web page:** https://viviangomez.github.io

## Important links

**Deploy in:** https://foohealli-app.herokuapp.com/

## Description
Foohealli is a platform in which people who want and / or need to take nutritional treatment, such as those who suffer from CDK (Chronic Kidney Disease), can keep track of their treatment in terms of medications and diet. In this way that the doctors and nutritionists who take the case of this patient, can access to him/her information, in real time, help the person during the treatment and propose better alternatives in the controls.

## Goals

-To develop a web application that allow to the doctors, nutritionists and patients, to create an effective communication channel during the control of the treatment of certain patient. 

-To allow the people with need of diets for their treatments of diseases or health in general, to have a correct and successful treatment. 

-To help the doctors and nutritionists to diagnose and treat their patients better, throughout the access in real time to the treatment information of them. 


## Screenshots

- Patient dashboard
##
![Screenshot](https://raw.githubusercontent.com/VivianGomez/canal-nutricion/master/public/DashboardPatient.PNG?style=centerme)
##

##
- Detail information of a patient seen by a nutritionist
##
![Screenshot](https://raw.githubusercontent.com/VivianGomez/canal-nutricion/master/public/DashboardNutritionist.PNG?style=centerme)

## Technologies

- **Mongo DB **: We used a non-relational database of MongoDB that is deployed at https://mlab.com/
- **Meteor **: A web infrastructure based on JavaScript, which automates and simplifies the development of web applications that act in real time.
It handles all the logic and deployment of both the client and the server. https://www.meteor.com
- **React JS **: A library that allows incredible things and that was used for the creation of the front-end of the application in an integrated way with Meteor https://reactjs.org/

In turn, several dependencies installed through NPM were used. 

- JSON Web Token
- React-router-dom
- Bootstrap

Among others that can be observed in the package.json of the application.


## API 

The used API can be viewed at https://ndb.nal.usda.gov/ndb/doc/apilist/API-SEARCH.md 
This API was used to obtain, in real time, the data of food based on the searches carried out by the patients at the time of adding a consumed food.


Finally, the application is deployed at https://heroku.com/, to access it, you can enter into https://foohealli-app.herokuapp.com/

## Instructions for execution

### Requirements

- **Meteor** 

Verify that it is installed, by running "meteor --version" in the CMD, or download it from https://www.meteor.com/install (LTS version).
Note: To use Meteor in your cmd you will need to install Chocolately, you can do it from https://chocolatey.org/install

- **Mongo DB **

It is necessary to have it to run the application locally. It can be downloaded from https://www.mongodb.com/download-center?jmp=nav#community

### Steps to execute

1. Open the root folder in a CMD.

2. Run "npm install" to install all the necessary dependencies.

3. Generate 2 different hashes using some page for this, such as https://passwordsgenerator.net/sha256-hash-generator/.

3.1. Define an environment variable in this way (windows): SET CODE_CRYPTR = {HASH1}

3.2. Define an environment variable in this way (windows): SET CODE_TOKEN = {HASH2}

4. Run "meteor", which displays the client and the server on ports 3000 and 3001, respectively

4.1. Tener en cuenta que la base de datos que corre Meteor es su propia base de datos de Mongo, la corre localmente y no es la base de datos real.

5. La aplicación será abierta de forma automática en http://localhost:3000/


Esta página fue desarrollada por Gabriel Pinto Pineda y Vivian Gómez Cubillos y está listada bajo la licencia del MIT (ver archivo [LICENSE](https://github.com/VivianGomez/canal-nutricion/blob/master/LICENSE) )
