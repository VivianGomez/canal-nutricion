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
import {
    Nutricionistas
} from './nutricionistas';

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
            }if (usuario.rol === "nutricionista") {
                return Pacientes.find({
                    $or: [{
                        nutricionista: usuario.identificacion
                    }, ],
                });
            }else {
                return Pacientes.find();
            }
        } else {
            throw new Meteor.Error("Debes haber iniciado sesión para acceder a esta funcionalidad.");
        }
    });

    Meteor.publish('pacientes.identificacion', function pacientesPublic(identificacion) {
        check(identificacion, String);
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
                    medicamentosAsignados: {
                        medicamento: medicamentoNombre
                    }
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
                        estado:"Activo",
                        fechaInicio: moment().format('DD/MM/YYYY'),
                        fechaFin: " "
                    }
                }
            });

            return "El medicamento " + medicamentoP + " se agregó correctamente";
        } catch (error) {
            throw new Meteor.Error("Se presentó un error agregando el medicamento " + medicamentoP + ", error: " + error);
        }

    },
    'pacientes.actualizarMedicamento'({
        identificacion,
        medicamento,
        posologia,
        frecuencia,
        cantidad,
        estado,
        usuario
    }) {
        check(identificacion, String);
        check(medicamento, String);
        check(posologia, String);
        check(frecuencia, String);
        check(cantidad, String);
        check(estado, String);
        check(usuario, Object);

        verificarPermisos(usuario.rol);

        try {
            Pacientes.update({
                identificacion: identificacion,
                "medicamentosAsignados.medicamento": medicamento
            }, {
                $set: {

                    "medicamentosAsignados.$.posologia": posologia,
                    "medicamentosAsignados.$.frecuencia": frecuencia,
                    "medicamentosAsignados.$.cantidad": cantidad,
                    "medicamentosAsignados.$.estado": estado,
                    "medicamentosAsignados.$.fechaFin":verificarEstadoMedicamento(estado)
                }
            });

            return "El medicamento " + medicamento + " se actualizó correctamente";
        } catch (error) {
            throw new Meteor.Error(error);
        }
    },
    'pacientes.alimentosConsumidosFecha'({
        identificacion,
        fecha
    }) {

        check(identificacion, String);
        check(fecha, String);


        const paciente = Pacientes.findOne({
            identificacion: identificacion,
        });

        let alimentosConsumidosFecha = [];

        if (paciente) {
            alimentosConsumidosFecha = paciente.alimentosConsumidos.filter(obj => {
                return obj.fecha === fecha
            });
        }

        return alimentosConsumidosFecha;

    },
    'pacientes.asignarNutricionista'({
        identificacionPaciente,
        identificacionNutricionista
    }) {
        check(identificacionPaciente, String);
        check(identificacionNutricionista, String);

        const paciente = Pacientes.findOne({
            identificacion: identificacionPaciente,
        });

        verificarExistenciaPaciente(paciente);

        const nutricionista = Nutricionistas.findOne({
            identificacion: identificacionNutricionista,
        });

        verificarExistenciaNutricionista(nutricionista);


        try {
            Pacientes.update({
                identificacion: identificacionPaciente
            }, {
                $set: {
                    nutricionista: identificacionNutricionista
                }
            });

            return "El paciente " + paciente.nombre + " fue asignado al nutricionista "+ nutricionista.nombre +" correctamente";
        } catch (error) {
            throw new Meteor.Error(error);
        }
    },
    'pacientes.registrarAlimento'({
        identificacion,
        alimento,
        porcion,
        tipoComida
    }) {
        check(identificacion, String);
        check(alimento, Object);
        check(porcion, Number);
        check(tipoComida, String);
        try {
            Pacientes.update({
                identificacion: identificacion
            }, {
                $addToSet: {
                    alimentosConsumidos: {
                        idAlimento: alimento.ndbno,
                        categoria: alimento.group,
                        alimento: alimento.name,
                        porcionConsumidaGramos: porcion,
                        tipoComida: tipoComida,
                        fechaConsumo: moment().format('ddd MMM D YYYY')
                    }
                }
            });

            return "Tu comida ha sido registrada exitosamente.";
        } catch (error) {
            throw new Meteor.Error("Se presentó un error registrando tu comida");
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

function verificarEstadoMedicamento(estado) {
    let fechaFin="";
    if (estado==="Inactivo") {
        fechaFin = moment().format('DD/MM/YYYY - h:mm:ss a');
    }
    return fechaFin;
}