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

export const Pacientes = new Mongo.Collection('pacientes');

if (Meteor.isServer) {

    Meteor.publish('pacientes.identificacion', function pacientesPublication(identificacion) {
        return Pacientes.find({
            identificacion: identificacion
        });
    });
}

Meteor.methods({
    'pacientes.buscarPaciente'({
        identificacion
    }) {
        check(identificacion, String);

        const paciente = Pacientes.findOne({
            identificacion: identificacion
        });
        return paciente;
    },
    'pacientes.validarPaciente'({
        correo,
        clave
    }) {
        check(correo, String);
        check(clave, String);

        let paciente = null;

        paciente = Pacientes.findOne({
            correo: correo
        });

        if (!paciente) {
            throw new Meteor.Error('No existe un usuario con ese correo.');
        } else {
            if (cryptr.decrypt(paciente.clave) !== clave) {
                throw new Meteor.Error('La contraseña ingresada no es correcta.');
            }
        }

        delete paciente.clave;

        let token = jwt.sign(paciente, process.env.CODE_TOKEN);

        return token;
    }
});

function decodificarToken(token) {
    return token ? jwt.verify(token, process.env.CODE_TOKEN) : null;
}