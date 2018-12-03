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

export const Doctors = new Mongo.Collection('doctors');

Meteor.methods({
    'doctors.validarDoctor'({
        correo,
        clave
    }) {
        check(correo, String);
        check(clave, String);

        let doctor = null;

        doctor = Doctors.findOne({
            correo: correo
        });


        if (!doctor) {
            throw new Meteor.Error('Does not exist a doctor with this email.');
        } else {
            if (cryptr.decrypt(doctor.clave) !== clave) {
                throw new Meteor.Error('Incorrect password.');
            }
        }

        delete doctor.clave;

        let token = jwt.sign(doctor, process.env.CODE_TOKEN);

        return token;
    }
});