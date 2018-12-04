import { Meteor } from "meteor/meteor";
import { resetDatabase } from "meteor/xolvio:cleaner";
import { Nutritionists } from "../nutritionists.js";
import faker  from "faker";
import chai from 'chai';

const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('1B5CF523A08CE35BAC7331D955F69723734C7BDF5C2A7A76570FAF5F3E0460C9');


if (Meteor.isServer) {
    describe("Nutritionists", function () {
        describe("Methods", function () {

            let clave = faker.internet.password(8);
            let idNut = ""+faker.random.number({min:1000000000, max:9999999999});

            let nutritionist = {
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

                Nutritionists.insert(
                    nutritionist
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

    it("Should validate the current nutritionist", () => {

       let token = Meteor.call("nutritionists.validarNutricionista", {correo: nutritionist.correo, clave: clave});
       let currentNutritionist =  Nutritionists.findOne({correo: nutritionist.correo});
       let decodeNutritionist = jwt.verify(token, process.env.CODE_TOKEN);

      chai.assert.equal(currentNutritionist.nombre, decodeNutritionist.nombre);
      chai.assert.equal(currentNutritionist.identificacion, decodeNutritionist.identificacion);
      chai.assert.equal(currentNutritionist.correo, decodeNutritionist.correo);
      chai.assert.equal(currentNutritionist.celular, decodeNutritionist.celular);
      chai.assert.equal(currentNutritionist.rol, decodeNutritionist.rol);
      chai.assert.equal(currentNutritionist.fechaRegistro, decodeNutritionist.fechaRegistro);
   });
  });
 });
}
