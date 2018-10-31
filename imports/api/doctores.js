/**
*Los imports podrían ponerlos en una sola línea, utilizando Iner Line en sublime, por ejemplo.
*/
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

export const Doctores = new Mongo.Collection('doctores');

Meteor.methods({
    'doctores.validarDoctor'({
        correo,
        clave
    }) {
        check(correo, String);
        check(clave, String);

        let doctor = null;

        doctor = Doctores.findOne({
            correo: correo
        });

        if (!doctor) {
            throw new Meteor.Error('No existe un doctor con ese correo.');
        } else {
            if (cryptr.decrypt(doctor.clave) !== clave) {
                throw new Meteor.Error('La contraseña ingresada no es correcta.');
            }
        }

        delete doctor.clave;

        let token = jwt.sign(doctor, process.env.CODE_TOKEN);

        return token;
    }
});
