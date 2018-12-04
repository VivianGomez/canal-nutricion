import {
  Meteor
} from "meteor/meteor";
import {
  resetDatabase
} from "meteor/xolvio:cleaner";
import {
  Factory
} from "meteor/dburles:factory";
import {
  Patients
} from "../patients.js";
import {
  Nutritionists
} from "../nutritionists.js";
import faker from "faker";
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
      let id = "" + faker.random.number({
        min: 1000000000,
        max: 9999999999
      });

      let user = {
        nombre: faker.name.findName(),
        identificacion: id,
        correo: faker.internet.email(),
        celular: faker.random.number({
          min: 1000000000,
          max: 9999999999
        }),
        clave: cryptr.encrypt(clave),
        rol: "Paciente",
        fechaRegistro: moment().format('ddd MMM D YYYY'),
        nutricionista: "",
        alimentosConsumidos: [],
        examenesMedicos: [],
        medicamentosAsignados: []

      };

      let idNut = "" + faker.random.number({
        min: 1000000000,
        max: 9999999999
      });
      let nut = {
        nombre: faker.name.findName(),
        identificacion: idNut,
        correo: faker.internet.email(),
        celular: faker.random.number({
          min: 1000000000,
          max: 9999999999
        }),
        clave: cryptr.encrypt(clave),
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
              throw new Meteor.Error("An error occurred in the user creation. Please try again " + err);
            }
          }
        }
      });

      afterEach(() => {
        resetDatabase();
      });


      it("Should found the searched patient", () => {

        Meteor.call("patients.buscarPaciente", {
          identificacion: user.identificacion
        }, (err, res) => {
          chai.assert.equal(res.nombre, user.nombre);
          chai.assert.equal(res.identificacion, user.identificacion);
          chai.assert.equal(res.correo, user.correo);
          chai.assert.equal(res.celular, user.celular);
          chai.assert.equal(res.clave, user.clave);
          chai.assert.equal(res.rol, user.rol);
          chai.assert.equal(res.fechaRegistro, user.fechaRegistro);
        });
      });


      it("Should validate the current patient", () => {

        let token = Meteor.call("patients.validarPaciente", {
          correo: user.correo,
          clave: clave
        });
        let currentPatient = Meteor.call("patients.buscarPaciente", {
          identificacion: user.identificacion
        });
        let decodePatient = jwt.verify(token, process.env.CODE_TOKEN);

        chai.assert.equal(currentPatient.nombre, decodePatient.nombre);
        chai.assert.equal(currentPatient.identificacion, decodePatient.identificacion);
        chai.assert.equal(currentPatient.correo, decodePatient.correo);
        chai.assert.equal(currentPatient.celular, decodePatient.celular);
        chai.assert.equal(currentPatient.rol, decodePatient.rol);
        chai.assert.equal(currentPatient.fechaRegistro, decodePatient.fechaRegistro);
      });


      it("Should add a medicine to the current patient", () => {

        let currentUser = Meteor.call("patients.buscarPaciente", {
          identificacion: user.identificacion
        });

        Meteor.call("patients.agregarMedicamento", {
          identificacionP: user.identificacion,
          medicamentoP: faker.lorem.words(num = 3, supplemental = false),
          posologiaP: faker.lorem.words(num = 3, supplemental = false),
          frecuenciaP: faker.lorem.words(num = 3, supplemental = false),
          cantidadP: "2",
          viaP: faker.random.objectElement({
            oral: "Oral",
            otra: "Otra",
            nutritionist: "Nutricionista"
          }),
          usuario: currentUser
         });

          chai.assert.equal(Patients.findOne({
            identificacion: user.identificacion
          }).medicamentosAsignados.length, 1);
      });

      it("Should remove a medicine to the current patient", () => {

        let medicineName = faker.lorem.words(num = 3, supplemental = false);

        Meteor.call("patients.agregarMedicamento", {
          identificacionP: user.identificacion,
          medicamentoP: medicineName,
          posologiaP: faker.lorem.words(num = 3, supplemental = false),
          frecuenciaP: faker.lorem.words(num = 3, supplemental = false),
          cantidadP: "2",
          viaP: faker.random.objectElement({
            oral: "Oral",
            other: "Other"
          }),
          usuario: user
        });

        chai.assert.equal(Patients.findOne({
          identificacion: user.identificacion
        }).medicamentosAsignados.length, 1);

        Meteor.call("patients.removerMedicamento", {
          identificacion: user.identificacion,
          medicamentoNombre: medicineName,
          usuario: user
        });

          chai.assert.equal(Patients.findOne({
            identificacion: user.identificacion
          }).medicamentosAsignados.length, 0);
      });

      it("Should update a medicine to the current patient", () => {

        let medicineName = faker.lorem.words(num = 3, supplemental = false);

        Meteor.call("patients.agregarMedicamento", {
          identificacionP: user.identificacion,
          medicamentoP: medicineName,
          posologiaP: faker.lorem.words(num = 3, supplemental = false),
          frecuenciaP: faker.lorem.words(num = 3, supplemental = false),
          cantidadP: "2",
          viaP: faker.random.objectElement({
            oral: "Oral",
            other: "Other"
          }),
          usuario: user
        });

        chai.assert.equal(Patients.findOne({
          identificacion: user.identificacion
        }).medicamentosAsignados[0].cantidad, "2");

        Meteor.call("patients.actualizarMedicamento", {
          identificacion: user.identificacion,
          medicamento: medicineName,
          posologia: faker.lorem.words(num = 3, supplemental = false),
          frecuencia: faker.lorem.words(num = 3, supplemental = false),
          cantidad: "5",
          estado: faker.random.objectElement({
            oral: "One",
            other: "Two"
          }),
          usuario: user
        });

        chai.assert.equal(Patients.findOne({
          identificacion: user.identificacion
        }).medicamentosAsignados[0].cantidad, "5");

      });

      it("Should add a new consumed food to the current patient", () => {

        let currentUser = Meteor.call("patients.buscarPaciente", {
          identificacion: user.identificacion
        });

        let food = {
          idAlimento: "" + faker.random.number({
            min: 1000000000,
            max: 9999999999
          }),
          categoria: faker.lorem.words(num = 3, supplemental = false),
          alimento: faker.lorem.words(num = 3, supplemental = false),
        };

        let date = new Date();

        Meteor.call("patients.registrarAlimento", {
          identificacion: currentUser.identificacion,
          alimento: food,
          porcion: faker.random.number({
            min: 100,
            max: 1000
          }),
          tipoComida: faker.lorem.words(num = 3, supplemental = false),
          fechaConsumo: date
        });

        chai.assert.equal(Patients.findOne({
          identificacion: currentUser.identificacion
        }).alimentosConsumidos.length, 1);

      });

      it("Should show the food consumed by the patient in certain date", () => {

        let food = {
          idAlimento: "" + faker.random.number({
            min: 1000000000,
            max: 9999999999
          }),
          categoria: faker.lorem.words(num = 3, supplemental = false),
          alimento: faker.lorem.words(num = 3, supplemental = false),
        };

        let date = new Date();
        let anio = date.getUTCFullYear().toString();
        dateF = date.toString();
        dateF = dateF.substring(0, dateF  .indexOf(anio) + anio.length);

        Meteor.call("patients.registrarAlimento", {
          identificacion: user.identificacion,
          alimento: food,
          porcion: faker.random.number({
            min: 100,
            max: 1000
          }),
          tipoComida: faker.lorem.words(num = 3, supplemental = false),
          fechaConsumo: date
        });

        chai.assert.equal(Patients.findOne({
          identificacion: user.identificacion
        }).alimentosConsumidos.length, 1);

        let consumedFood = Meteor.call("patients.alimentosConsumidosFecha", {
          identificacion: user.identificacion,
          fecha: date
        }, (err, res) => {
          chai.assert.equal(res.length, 1);
          chai.assert.equal(res.fechaConsumo, dateF);
        });
      });


      it("Should add a nutritionist to the current patient", () => {

        chai.assert.equal(Patients.findOne({
          identificacion: user.identificacion
        }).nutritionist, undefined);

        Meteor.call("patients.asignarNutricionista",
          user.identificacion,
          nut.identificacion
          );

        let modifiedPatient = Patients.findOne({
          identificacion: user.identificacion
        });
        chai.assert.equal(modifiedPatient.nutricionista, nut.identificacion);

      });

      it("Should show the nutritional information of a certain food", () => {

        let ndbno = "14075";
        Meteor.call("patients.foodNutrients", {
          ndbno: ndbno
        }, (err, res) => {
          chai.assert.notEqual(res, null);
          chai.assert.notEqual(res, undefined);
        });
      });

    });
});
}