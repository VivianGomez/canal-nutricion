import { Meteor } from "meteor/meteor";
import { resetDatabase } from "meteor/xolvio:cleaner";
import { Factory } from "meteor/dburles:factory";
import { Patients } from "../patients.js";
import { Nutritionists } from "../nutritionists.js";
import faker  from "faker";
import chai from 'chai';
import sinon from 'sinon';
import assert from "assert";

const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('1B5CF523A08CE35BAC7331D955F69723734C7BDF5C2A7A76570FAF5F3E0460C9');


if (Meteor.isServer) {
    describe("patients", function () {
        describe("methods", function () {

            let clave = faker.internet.password(8);
            let id = ""+faker.random.number({min:1000000000, max:9999999999});

            let user = {
            nombre: faker.name.findName(), 
            identificacion: id,
            correo: faker.internet.email(),
            celular: faker.random.number({min:1000000000, max:9999999999}),
            clave:  cryptr.encrypt(clave),
            rol: "Paciente",
            fechaRegistro: moment().format('ddd MMM D YYYY'),
            nutricionista:"",
            alimentosConsumidos:[],
            examenesMedicos:[],
            medicamentosAsignados:[]

        };

            let idNut = ""+faker.random.number({min:1000000000, max:9999999999});
            let nut = {
            nombre: faker.name.findName(), 
            identificacion: idNut,
            correo: faker.internet.email(),
            celular: faker.random.number({min:1000000000, max:9999999999}),
            clave:  cryptr.encrypt(clave),
            rol: "Nutricionista",
            fechaRegistro: moment().format('ddd MMM D YYYY')
        };


        beforeEach(() => {              
            resetDatabase();
            try {

                Patients.insert(
                    user
                );

                Nutritionists.insert(
                    nut
                );

                return true;

            } catch (err) {
                            if (err) {
                if (err.code === 11000) {
                    throw new Meteor.Error("An existing user already have this identification or email.");
                } else {
                        throw new Meteor.Error("An error occurred in the user creation. Please try again "+ err);
                }
              }
            }
        });

        afterEach(() => {
            resetDatabase();
        });


    it("should found the searched patient", () => {

      let searched = Meteor.call("patients.buscarPaciente", {identificacion: user.identificacion});
    

      chai.assert.equal(searched.nombre, user.nombre);
      chai.assert.equal(searched.identificacion, user.identificacion);
      chai.assert.equal(searched.correo, user.correo);
      chai.assert.equal(searched.celular, user.celular);
      chai.assert.equal(searched.clave, user.clave);
      chai.assert.equal(searched.rol, user.rol);
      chai.assert.equal(searched.fechaRegistro, user.fechaRegistro);

   });


    it("should validate the current patient", () => {

       let token = Meteor.call("patients.validarPaciente", {correo: user.correo, clave: clave});
       let currentPatient = Meteor.call("patients.buscarPaciente", {identificacion: user.identificacion});
       let decodePatient = jwt.verify(token, process.env.CODE_TOKEN);

      chai.assert.equal(currentPatient.nombre, decodePatient.nombre);
      chai.assert.equal(currentPatient.identificacion, decodePatient.identificacion);
      chai.assert.equal(currentPatient.correo, decodePatient.correo);
      chai.assert.equal(currentPatient.celular, decodePatient.celular);
      chai.assert.equal(currentPatient.rol, decodePatient.rol);
      chai.assert.equal(currentPatient.fechaRegistro, decodePatient.fechaRegistro);
   });


    it("should add a medicine to the current patient", () => {

      let currentUser = Meteor.call("patients.buscarPaciente", {identificacion: user.identificacion});

      Meteor.call("patients.agregarMedicamento", {
        identificacionP:user.identificacion,
        medicamentoP:faker.lorem.words(num = 3, supplemental = false), 
        posologiaP:faker.lorem.words(num = 3, supplemental = false),
        frecuenciaP:faker.lorem.words(num = 3, supplemental = false), 
        cantidadP:"2", 
        viaP: faker.random.objectElement({oral: "Oral", otra: "Otra", nutritionist: "Nutricionista"}), 
        usuario:currentUser
      });
      
      chai.assert.equal(Patients.findOne({ identificacion:  user.identificacion }).medicamentosAsignados.length, 1);

   });
    it("should remove a medicine to the current patient", () => {

      let currentUser = Meteor.call("patients.buscarPaciente", {identificacion: user.identificacion});

      let medicineName = faker.lorem.words(num = 3, supplemental = false);

      Meteor.call("patients.agregarMedicamento", {
        identificacionP:currentUser.identificacion,
        medicamentoP:medicineName,
        posologiaP:faker.lorem.words(num = 3, supplemental = false),
        frecuenciaP:faker.lorem.words(num = 3, supplemental = false), 
        cantidadP:"2", 
        viaP: faker.random.objectElement({oral: "Oral", other: "Other"}), 
        usuario:currentUser
      });

      chai.assert.equal(Patients.findOne({ identificacion:  currentUser.identificacion }).medicamentosAsignados.length, 1);

      Meteor.call("patients.removerMedicamento", {identificacion:currentUser.identificacion, medicamentoNombre:medicineName, usuario:currentUser});
      
      chai.assert.equal(Patients.findOne({ identificacion:  user.identificacion }).medicamentosAsignados.length, 0);

   });

    it("should update a medicine to the current patient", () => {

      let currentUser = Meteor.call("patients.buscarPaciente", {identificacion: user.identificacion});

      let medicineName = faker.lorem.words(num = 3, supplemental = false);

      Meteor.call("patients.agregarMedicamento", {
        identificacionP:currentUser.identificacion,
        medicamentoP:medicineName,
        posologiaP:faker.lorem.words(num = 3, supplemental = false),
        frecuenciaP:faker.lorem.words(num = 3, supplemental = false), 
        cantidadP:"2", 
        viaP: faker.random.objectElement({oral: "Oral", other: "Other"}), 
        usuario:currentUser
      });

      chai.assert.equal(Patients.findOne({ identificacion:  currentUser.identificacion }).medicamentosAsignados[0].cantidad, "2");

      Meteor.call("patients.actualizarMedicamento", {
        identificacion:currentUser.identificacion,
        medicamento:medicineName,
        posologia:faker.lorem.words(num = 3, supplemental = false),
        frecuencia:faker.lorem.words(num = 3, supplemental = false), 
        cantidad:"5", 
        estado: faker.random.objectElement({oral: "One", other: "Two"}), 
        usuario:currentUser
      });
      
      chai.assert.equal(Patients.findOne({ identificacion:  currentUser.identificacion }).medicamentosAsignados[0].cantidad, "5");

   });

    it("should add a new consumed food to the current patient", () => {

      let currentUser = Meteor.call("patients.buscarPaciente", {identificacion: user.identificacion});

      let food = {
            idAlimento: ""+faker.random.number({min:1000000000, max:9999999999}),
            categoria: faker.lorem.words(num = 3, supplemental = false),
            alimento: faker.lorem.words(num = 3, supplemental = false),
        };

     let date = new Date();

      Meteor.call("patients.registrarAlimento", {
        identificacion: currentUser.identificacion,
        alimento: food,
        porcion: faker.random.number({min:100, max:1000}),
        tipoComida: faker.lorem.words(num = 3, supplemental = false),
        fechaConsumo: date
      });

      chai.assert.equal(Patients.findOne({ identificacion:  currentUser.identificacion }).alimentosConsumidos.length, 1);

   });

it("should show the food consumed by the patient in certain date", () => {
    
      let currentUser = Meteor.call("patients.buscarPaciente", {identificacion: user.identificacion});

      let food = {
            idAlimento: ""+faker.random.number({min:1000000000, max:9999999999}),
            categoria: faker.lorem.words(num = 3, supplemental = false),
            alimento: faker.lorem.words(num = 3, supplemental = false),
        };

     let date = new Date();

      Meteor.call("patients.registrarAlimento", {
        identificacion: currentUser.identificacion,
        alimento: food,
        porcion: faker.random.number({min:100, max:1000}),
        tipoComida: faker.lorem.words(num = 3, supplemental = false),
        fechaConsumo: date
      });

      chai.assert.equal(Patients.findOne({ identificacion:  currentUser.identificacion }).alimentosConsumidos.length, 1);

      let consumedFood = Meteor.call("patients.alimentosConsumidosFecha", {
        identificacion:currentUser.identificacion,
        fecha: date
      });


      let anio = date.getUTCFullYear().toString();
      date = date.toString();
      date = date.substring(0, date.indexOf(anio) + anio.length);

      chai.assert.equal(Patients.findOne({ identificacion:  currentUser.identificacion }).alimentosConsumidos[0].fechaConsumo, date);

   });


    it("should add a nutritionist to the current patient", () => {

      let currentUser = Meteor.call("patients.buscarPaciente", {identificacion: user.identificacion});

      chai.assert.equal(Patients.findOne({ identificacion:  user.identificacion }).nutritionist, undefined);

      Meteor.call("patients.asignarNutricionista", 
        currentUser.identificacion,
        nut.identificacion
      );
      
      let modifiedPatient = Patients.findOne({identificacion: currentUser.identificacion});
      chai.assert.equal(modifiedPatient.nutricionista, nut.identificacion);

   });

    it("should show the nitritional information of a certain food", () => {

      let ndbno = "14075";
      let res = Meteor.call("patients.foodNutrients", {
        ndbno: ndbno
      });
      
      chai.assert.notEqual(res, null);
      chai.assert.notEqual(res, undefined);
   });

  });
 });
}
