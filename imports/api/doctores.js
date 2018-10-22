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
const cryptr = new Cryptr(process.env.CODE_CRYPTR);

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