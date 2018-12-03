import { Meteor } from "meteor/meteor";
import { resetDatabase } from "meteor/xolvio:cleaner";
import { Factory } from "meteor/dburles:factory";
import { Patients } from "./patients.js";
import { Users } from "./users.js";
import { Nutritionists } from "./nutritionists.js";
import faker  from "faker";
import chai from 'chai';
import sinon from 'sinon';
import assert from "assert";

const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('1B5CF523A08CE35BAC7331D955F69723734C7BDF5C2A7A76570FAF5F3E0460C9');


if (Meteor.isServer) {
    describe("users", function () {
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
                        throw new Meteor.Error("Ya existe un usuario con ese número de identificación o correo asociado.");
                    } else {
                        throw new Meteor.Error("Se presentó un error al crear el usuario. Por favor intenta nuevamente"+ err);
                    }
                }
            }
        });

        afterEach(() => {
            resetDatabase();
        });


    it("should insert a new user", () => {

      let idNewNutritionist = ""+faker.random.number({min:1000000000, max:9999999999});

      Meteor.call("users.insert",             
            {
            nombre: faker.name.findName(), 
            identificacion: idNewNutritionist,
            correo: faker.internet.email(),
            celular: faker.random.number({min:1000000000, max:9999999999}),
            clave:  cryptr.encrypt(clave),
            rol: "nutricionista"
        });

      chai.assert(Nutritionists.findOne({ identificacion: idNewNutritionist})!=null);

   });
  });
 });
}
