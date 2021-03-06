import { Meteor } from "meteor/meteor";
import { resetDatabase } from "meteor/xolvio:cleaner";
import { Doctors } from "../doctors.js";
import faker  from "faker";
import chai from 'chai';

const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('1B5CF523A08CE35BAC7331D955F69723734C7BDF5C2A7A76570FAF5F3E0460C9');


if (Meteor.isServer) {
    describe("Doctors", function () {
        describe("Methods", function () {

            let clave = faker.internet.password(8);
            let idDoc = ""+faker.random.number({min:1000000000, max:9999999999});

            let doctor = {
            nombre: faker.name.findName(), 
            identificacion: idDoc,
            correo: faker.internet.email(),
            celular: faker.random.number({min:1000000000, max:9999999999}),
            clave:  cryptr.encrypt(clave),
            rol: "Nutricionista",
            fechaRegistro: moment().format('ddd MMM D YYYY')
        };


        beforeEach(() => {              
            resetDatabase();
            try {

                Doctors.insert(
                    doctor
                );

                return true;

            } catch (err) {
                if (err) {
                    if (err.code === 11000) {
                        throw new Meteor.Error("The user with this identification or name already exists.");
                    } else {
                        throw new Meteor.Error("An error occurred in the user creation. Please try again "+ err);
                    }
                }
            }
        });

        afterEach(() => {
            resetDatabase();
        });

    it("Should validate the current doctor", () => {

       let token = Meteor.call("doctors.validarDoctor", {correo: doctor.correo, clave: clave});
       let currentDoctor =  Doctors.findOne({correo: doctor.correo});
       let decodeDoctor = jwt.verify(token, process.env.CODE_TOKEN);

      chai.assert.equal(currentDoctor.nombre, decodeDoctor.nombre);
      chai.assert.equal(currentDoctor.identificacion, decodeDoctor.identificacion);
      chai.assert.equal(currentDoctor.correo, decodeDoctor.correo);
      chai.assert.equal(currentDoctor.celular, decodeDoctor.celular);
      chai.assert.equal(currentDoctor.rol, decodeDoctor.rol);
      chai.assert.equal(currentDoctor.fechaRegistro, decodeDoctor.fechaRegistro);
   });
  });
 });
}
