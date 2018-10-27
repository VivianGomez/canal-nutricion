import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import {
    check
} from 'meteor/check';
import {
    Match
} from 'meteor/check';

const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CODE_CRYPTR);

export const Pacientes = new Mongo.Collection('pacientes');

//if (Meteor.isServer) {

//    Meteor.publish('pacientes.identificacion', function pacientesPublication(identificacion) {
//        return Pacientes.find({
//            identificacion: identificacion
//        });
//    });
//}


if (Meteor.isServer) {
    console. log("ENTRA COMO SERVER", process.env.CODE_CRYPTR);

    Meteor.publish('pacientes', function pacientesPublication(token) {

    console. log("PUBLISH", process.env.CODE_CRYPTR);
    console. log("hiii");

        let usuario = decodificarToken(token);

        if (usuario) {
            if (usuario.rol === "doctor") {
                return Pacientes.find({
                    $or: [{
                        doctor: usuario.identificacion
                    }, ],
                });
            } else {
                return pacientes.find();
            }
        } else {
            throw new Meteor.Error("Debes haber iniciado sesión para acceder a esta funcionalidad.");
        }
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