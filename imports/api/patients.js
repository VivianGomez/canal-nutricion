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
    Nutritionists
} from './nutritionists';
import axios from 'axios';

const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('1B5CF523A08CE35BAC7331D955F69723734C7BDF5C2A7A76570FAF5F3E0460C9');

const allowedNutrients = [
    '203', '208', '255', '269', '291', '301', '305', '306', '307', '324', '326', '401', '430', '601', '605'
]

export const Patients = new Mongo.Collection('patients');

if (Meteor.isServer) {
    Meteor.publish('patients', function pacientesPublication(token) {

        let usuario = decodificarToken(token);

        if (usuario) {
            if (usuario.rol === "doctor") {
                return Patients.find({
                    $or: [{
                        doctor: usuario.identificacion
                    }, ],
                });
            }
            if (usuario.rol === "nutricionista") {
                return Patients.find({
                    $or: [{
                        nutricionista: usuario.identificacion
                    }, ],
                });
            } else {
                return Patients.find();
            }
        } else {
            throw new Meteor.Error("Debes haber iniciado sesión para acceder a esta funcionalidad.");
        }
    });

    Meteor.publish('patients.identificacion', function pacientesPublic(identificacion) {
        check(identificacion, String);
        return Patients.find({
            identificacion: identificacion
        });
    });

}

Meteor.methods({
    'patients.buscarPaciente'({
        identificacion
    }) {        

        check(identificacion, String);

        const paciente = Patients.findOne({
            identificacion: identificacion
        });

        return paciente;
    },
    'patients.validarPaciente'({
        correo,
        clave
    }) {
        check(correo, String);
        check(clave, String);

        let paciente = null;

        paciente = Patients.findOne({
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
    },
    'patients.removerMedicamento'({
        identificacion,
        medicamentoNombre,
        usuario
    }) {
        check(identificacion, String);
        check(medicamentoNombre, String);
        check(usuario, Object);

        verificarPermisos(usuario.rol);

        const paciente = Patients.findOne({
            identificacion: identificacion
        });

        verificarExistenciaPaciente(paciente);

        try {
            Patients.update({
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
    'patients.agregarMedicamento'({
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
            Patients.update({
                identificacion: identificacionP
            }, {
                $addToSet: {
                    medicamentosAsignados: {
                        medicamento: medicamentoP,
                        posologia: posologiaP,
                        frecuencia: frecuenciaP,
                        cantidad: cantidadP,
                        via: viaP,
                        estado: "Activo",
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
    'patients.actualizarMedicamento'({
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
            Patients.update({
                identificacion: identificacion,
                "medicamentosAsignados.medicamento": medicamento
            }, {
                $set: {

                    "medicamentosAsignados.$.posologia": posologia,
                    "medicamentosAsignados.$.frecuencia": frecuencia,
                    "medicamentosAsignados.$.cantidad": cantidad,
                    "medicamentosAsignados.$.estado": estado,
                    "medicamentosAsignados.$.fechaFin": verificarEstadoMedicamento(estado)
                }
            });

            return "El medicamento " + medicamento + " se actualizó correctamente";
        } catch (error) {
            throw new Meteor.Error(error);
        }
    },
    'patients.alimentosConsumidosFecha'({
        identificacion,
        fecha
    }) {

        check(identificacion, String);

        const paciente = Patients.findOne({
            identificacion: identificacion,
        });


        let alimentosConsumidosFecha = [];

        fecha = procesarFecha(fecha);

        if (paciente) {
            let alimentosConsumidos = paciente.alimentosConsumidos;
            alimentosConsumidosFecha = alimentosConsumidos.filter(alimento => {
                return alimento.fechaConsumo === fecha
            });
        }

        return alimentosConsumidosFecha;

    },
    'patients.asignarNutricionista'(
        identificacionPaciente,
        identificacionNutricionista
    ) {
        check(identificacionPaciente, String);
        check(identificacionNutricionista, String);

        const paciente = Patients.findOne({
            identificacion: identificacionPaciente,
        });

        const nutricionista = Nutritionists.findOne({
            identificacion: identificacionNutricionista,
        });

        verificarExistenciaNutricionista(nutricionista);
        yaTieneNutricionista(paciente.nutricionista);
            // console.log(paciente);

        try {

            Patients.update({
                    identificacion: identificacionPaciente,
            }, {
                $set: {
                    nutricionista: identificacionNutricionista
                }
            });
           // console.log(paciente);

            return "El paciente " + paciente.nombre + " fue asignado al nutricionista " + nutricionista.nombre + " correctamente";
        } catch (error) {
            throw new Meteor.Error(error);
        }
    },
    'patients.registrarAlimento'({
        identificacion,
        alimento,
        porcion,
        tipoComida,
        fechaConsumo
    }) {
        check(identificacion, String);
        check(alimento, Object);
        check(porcion, Number);
        check(tipoComida, String);

        try {
            Patients.update({
                identificacion: identificacion
            }, {
                $addToSet: {
                    alimentosConsumidos: {
                        idAlimento: alimento.ndbno,
                        categoria: alimento.group,
                        alimento: alimento.name,
                        porcionConsumidaGramos: porcion,
                        tipoComida: tipoComida,
                        fechaConsumo: procesarFecha(fechaConsumo)
                    }
                }
            });

            return "Tu comida ha sido registrada exitosamente.";
        } catch (error) {
            throw new Meteor.Error("Se presentó un error registrando tu comida :" + error);
        }
    },
    'patients.removerAlimento'({
        identificacion,
        alimento
    }) {
        check(identificacion, String);
        check(alimento, Object);

        const paciente = Patients.findOne({
            identificacion: identificacion
        });

        verificarExistenciaPaciente(paciente);

        try {
            Patients.update({
                identificacion: identificacion
            }, {
                $pull: {
                    alimentosConsumidos: {
                        fechaConsumo: alimento.fechaConsumo,
                        idAlimento: alimento.idAlimento,
                        tipoComida: alimento.tipoComida,
                        porcionConsumidaGramos: alimento.porcionConsumidaGramos
                    }
                }
            });

            return "El alimento se eliminó correctamente";
        } catch (error) {
            throw new Meteor.Error("Se presentó un error eliminando el alimento");
        }

    },
    'patients.foodNutrients'({
        ndbno
    }) {
        check(ndbno, String);

        return new Promise((resolve, reject) => {
            axios
                .get(
                    'https://api.nal.usda.gov/ndb/reports/?type=s&format=json&api_key=d88AhCQq0DlNsy2PSzi6IiixEpuKo6pMsEPnLVMK&ndbno=' +
                    ndbno
                )
                .then(({
                    data
                }) => {
                    if (data.report && data.report.food) {
                        let food = data.report.food;
                        let nutrients = food.nutrients;
                        food.nutrients = nutrients.filter(nutrient => allowedNutrients.includes(nutrient.nutrient_id));
                        resolve(food);
                    } else {
                        reject("There is not a food with an id: " + ndbno);
                    }
                }).catch(err => {
                    reject("There is not a food with an id: " + ndbno);
                });
        });
    },
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

function yaTieneNutricionista(nutricionista) {
    console.log();
    if (nutricionista !== "") {
        throw new Meteor.Error('El paciente ya tiene un nutricionista asignado.');
    }
}

function verificarExistenciaNutricionista(nutricionista) {
    if (!nutricionista) {
        throw new Meteor.Error('No se encuentra el nutricionista.');
    }
}

function verificarEstadoMedicamento(estado) {
    let fechaFin = "";
    if (estado === "Inactivo") {
        fechaFin = moment().format('DD/MM/YYYY - h:mm:ss a');
    }
    return fechaFin;
}

function procesarFecha(fechaConsumo) {
    let anio = fechaConsumo.getUTCFullYear().toString();
    fechaConsumo = fechaConsumo.toString();
    fechaConsumo = fechaConsumo.substring(0, fechaConsumo.indexOf(anio) + anio.length);

    return fechaConsumo;
}