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

export const Nutritionists = new Mongo.Collection('nutritionists');

Meteor.methods({
    'nutritionists.validarNutricionista'({
        correo,
        clave
    }) {
        check(correo, String);
        check(clave, String);

        let nutricionist = null;

        nutricionist = Nutritionists.findOne({
            correo: correo
        });

        if (!nutricionist) {
            throw new Meteor.Error('Does not exist a nutricionist with this email.');
        } else {
            if (cryptr.decrypt(nutricionist.clave) !== clave) {
                throw new Meteor.Error('Incorrect password.');
            }
        }

        delete nutricionist.clave;

        let token = jwt.sign(nutricionist, process.env.CODE_TOKEN);

        return token;
    }
});