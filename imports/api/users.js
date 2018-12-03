import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import {
    Patients
} from './patients';
import {
    Doctors
} from './doctors';
import {
    Nutritionists
} from './nutritionists';

const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('1B5CF523A08CE35BAC7331D955F69723734C7BDF5C2A7A76570FAF5F3E0460C9');

export const Users = new Mongo.Collection('users');

Meteor.methods({
    'users.insert'({
        nombre,
        identificacion,
        correo,
        celular,
        clave,
        rol
    }) {

        let usuario = {
            nombre: nombre,
            identificacion: identificacion,
            correo: correo,
            celular: celular,
            clave: cryptr.encrypt(clave),
            rol: rol,
            fechaRegistro: moment().format('ddd MMM D YYYY')
        };

        try {

            if (rol === 'paciente') {

                usuario.doctor = "";
                usuario.nutricionista = "";
                usuario.alimentosConsumidos = [];
                usuario.examenesMedicos = [];
                usuario.medicamentosAsignados = [];

                Patients.insert(
                    usuario
                );
            } else if (rol === 'doctor') {
                usuario.pacientes = [];

                Doctors.insert(
                    usuario
                );
            } else if (rol === 'nutricionista') {
                usuario.nutricionistas = [];

                Nutritionists.insert(
                    usuario
                );
            }

            return true;
        } catch (err) {
            if (err) {
                if (err.code === 11000) {
                    throw new Meteor.Error("Ya existe un usuario con ese número de identificación o correo asociado.");
                } else {
                    throw new Meteor.Error("Se presentó un error al crear el usuario. Por favor intenta nuevamente");
                }
            }
        }

    },
    'users.decodificar'(token) {
        let usuario = decodificarToken(token);
        if (usuario) {

            let nUsuario = null;

            if (usuario.rol === 'paciente') {
                nUsuario = Patients.findOne({
                    _id: usuario._id
                });
            } else if (usuario.rol === 'doctor') {
                nUsuario = Doctors.findOne({
                    _id: usuario._id
                });
            } else if (usuario.rol === 'nutricionista') {
                nUsuario = Nutritionists.findOne({
                    _id: usuario._id
                });
            }


            if (nUsuario) {
                delete nUsuario.alimentosConsumidos
                delete nUsuario.clave;
                return nUsuario;
            } else {
                return null
            }
        } else {
            return null;
        }
    }
});

function decodificarToken(token) {
    return token ? jwt.verify(token, process.env.CODE_TOKEN) : null;
}

function verificarPermisos(rol) {
    if (rol === "paciente") {
        throw new Meteor.Error('No se encuentra autorizado para realizar esta acción');
    }
}

function verificarExistenciaPaciente(paciente) {
    if (!paciente) {
        throw new Meteor.Error('No se encuentra el paciente.');
    }
}

function verificarExistenciaNutricionista(nutricionista) {
    if (!nutricionista) {
        throw new Meteor.Error('No se encuentra el nutricionista.');
    }
}