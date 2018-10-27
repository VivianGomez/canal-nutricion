import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import {
    check
} from 'meteor/check';

const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('1B5CF523A08CE35BAC7331D955F69723734C7BDF5C2A7A76570FAF5F3E0460C9');

export const Nutricionistas = new Mongo.Collection('nutricionistas');

Meteor.methods({
    'nutricionistas.validarNutricionista'({
        correo,
        clave
    }) {
        check(correo, String);
        check(clave, String);

        let nutricionista = null;

        nutricionista = Nutricionistas.findOne({
            correo: correo
        });

        if (!nutricionista) {
            throw new Meteor.Error('No existe un nutricionista con ese correo.');
        } else {
            if (cryptr.decrypt(nutricionista.clave) !== clave) {
                throw new Meteor.Error('La contraseña ingresada no es correcta.');
            }
        }

        delete nutricionista.clave;

        let token = jwt.sign(nutricionista, process.env.CODE_TOKEN);

        return token;
    }
});