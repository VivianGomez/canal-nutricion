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

export const Pacientes = new Mongo.Collection('pacientes');

if (Meteor.isServer) {
    Meteor.publish('pacientes', function pacientesPublication(token) {

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
                console.log(paciente.clave);
                console.log(clave);
                throw new Meteor.Error('La contraseña ingresada no es correcta.');
            }
        }

        delete paciente.clave;

        let token = jwt.sign(paciente, process.env.CODE_TOKEN);

        return token;
    },
    'pacientes.removerMedicamento'({
        identificacion,
        medicamentoNombre,
        usuario
    }) {
        check(identificacion, String);
        check(medicamentoNombre, String);
        check(usuario, Object);

        verificarPermisos(usuario.rol);

        const paciente = Pacientes.findOne({
            identificacion: identificacion
        });

        verificarExistenciaPaciente(paciente);

        try {
            Pacientes.update({
                identificacion: identificacion
            }, {
                $pull: {
                    medicamentosAsignados: {medicamento: medicamentoNombre}
                }
            });

            return "El medicamento " + medicamentoNombre + " se eliminó correctamente";
        } catch (error) {
            throw new Meteor.Error("Se presentó un error eliminando el medicamento " + medicamentoNombre);
        }

    },
    'pacientes.agregarMedicamento'({
        identificacionP,
        medicamentoP,
        posologiaP,
        frecuenciaP,
        cantidadP,
        viaP,
        usuario
    }) {
        check(identificacionP, String);
        check(medicamentoP, String);
        check(posologiaP, String);
        check(frecuenciaP, String);
        check(cantidadP, String);
        check(viaP, String);
        check(usuario, Object);

        verificarPermisos(usuario.rol);

        try {
            Pacientes.update({
                identificacion: identificacionP
            }, {
                $addToSet: {
                    medicamentosAsignados: {
                        medicamento: medicamentoP,
                        posologia: posologiaP,
                        frecuencia: frecuenciaP,
                        cantidad: cantidadP,
                        via:viaP,
                        fechaInicio: moment().format('DD/MM/YYYY - h:mm:ss a')
                    }
                }
            });
            console.log("AGREGA");

            return "El medicamento " + medicamentoP + " se agregó correctamente";
        } catch (error) {
            throw new Meteor.Error("Se presentó un error agregando el medicamento " + medicamentoP +", error: "+ error);
        }

    },
    'pacientes.actualizarMedicamento'({
        identificacionP,
        medicamentoP,
        posologiaP,
        frecuenciaP,
        cantidadP,
        usuario
    }) {
        check(identificacionP, String);
        check(medicamentoP, String);
        check(posologiaP, String);
        check(frecuenciaP, String);
        check(cantidadP, String);
        check(usuario, Object);

        verificarPermisos(usuario.rol);

        try {
            Pacientes.updateOne({
                identificacion: identificacionP,
                "medicamentosAsignados.medicamento" : medicamentoP 
            }, {
                $set: {
                    
                    "medicamentosAsignados.$.posologia": posologiaP,
                    "medicamentosAsignados.$.frecuencia": frecuenciaP,
                    "medicamentosAsignados.$.cantidad": cantidadP
                }
            });

            return "El medicamento " + medicamentoP + " se actualizó correctamente";
        } catch (error) {
            throw new Meteor.Error(error);
        }
    },
    'pacientes.alimentosConsumidosFecha'({
        correo,
        fecha
    }) {
        check(correo, String);
        check(fecha, String);

        return Pacientes.find({
            identificacion: identificacion,
            "alimentosConsumidos": {
                fechaConsumo: fecha
            }
        });
    }
});

function decodificarToken(token) {
    return token ? jwt.verify(token, process.env.CODE_TOKEN) : null;
}

function verificarPermisos(rol) {
    if (rol !== "doctor") {
        throw new Meteor.Error('No se encuentra autorizado para realizar esta acción');
    }
}

function verificarExistenciaPaciente(paciente) {
    if (!paciente) {
        throw new Meteor.Error('No se encuentra el paciente.');
    }
}