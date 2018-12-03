import { Meteor } from "meteor/meteor";
import { resetDatabase } from "meteor/xolvio:cleaner";
import { Factory } from "meteor/dburles:factory";
import { Patients } from "./patients.js";
import faker  from "faker";
import chai from 'chai';
import sinon from 'sinon';
import assert from "assert";

const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('1B5CF523A08CE35BAC7331D955F69723734C7BDF5C2A7A76570FAF5F3E0460C9');


if (Meteor.isServer) {
describe("patients", function () {
	describe("patients.buscarPaciente", function () {
    	
    	let clave = faker.internet.password(8);
		
    	let user = {
            nombre: faker.name.findName(); //genera un nombre completo para el usuario a crear,
            identificacion: faker.random.number({min:1000000000, max:9999999999}),
            correo: faker.internet.email(),
            celular: faker.random.number({min:1000000000, max:9999999999}),
            clave:  cryptr.encrypt(clave),
            rol: faker.random.objectElement({patient: "Paciente", doctor: "Doctor", nutritionist: "Nutricionista"});¿,
            fechaRegistro: moment().format('ddd MMM D YYYY')
        };


      beforeEach(() => {
				
        // Stud the user
        resetDatabase();
        Patients.insert({
			 user
		});
      });

      afterEach(() => {
        resetDatabase();
      });


//		it("should found the searched patient", function () {


//			let searched = Meteor.call("patients.buscarPaciente", u);
//			console.log(searched);
//    });

//			chai.assert.equal(searched, user);
//  });
//}

it("should found the searched patient", () => {


		// m1

        const searchPatient = Meteor.server.method_handlers["patients.buscarPaciente"];

        //const invocation = { token }; faltaría lo del token del que invoca el metodo?

        let searched = searchPatient.apply(user.identificacion);

	    chai.assert.equal(searched, user);


	    //m2
		const removeMedicine = Meteor.server.method_handlers["patients.removerMedicamento"];

        //const invocation = { token }; faltaría lo del token del que invoca el metodo?

        removeMedicine.apply(user.identificacion);

	    chai.assert.equal((Patients.findOne(user.identificacion).medicamentosAsignados.count(), 0);


      });
    });
  });
}
 