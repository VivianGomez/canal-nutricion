import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import InfoPaciente from '../paciente/InfoPaciente.jsx';
import { withTracker } from 'meteor/react-meteor-data';
import { Pacientes } from '../../api/pacientes.js';
import { withRouter } from 'react-router';

class DashboardNutricionista
 extends Component {
  constructor(props) {
    super(props);

    if (!localStorage.getItem('foohealliStuff')) {
      this.props.history.push('/');
    }

    this.state = {
      token: localStorage.getItem('foohealliStuff'),
      nutricionista: false, 
      usuario: null
    };
  }

  componentDidMount() {
    Meteor.call('usuarios.decodificar', this.state.token, (err, res) => {
      if (err) {
        alert(err.error);
      } else if (res) {
        if (res.rol === 'nutricionista') {
          this.setState({
            nutricionista: true,
            usuario: res
          });
        } else {
          this.props.history.push('/');
        }
      }
    });
  }


  renderPacientes() {
    let pacientes = this.props.pacientes;
    return pacientes.map(paciente => (
      <InfoPaciente
        key={paciente._id}
        paciente={paciente}
        nombre= {paciente.nombre}
        identificacion= {paciente.identificacion}
        correo= {paciente.correo}
        celular= {paciente.celular}
      />
    ));
  }

  render() {
    return (
      <div id="pacientes-nutricionista" className="row">
        <div className="col-12">
          <div className="bg-foohealli-green text-light">
            <br />
            <h3 className="text-center font-weight-bold">
              &nbsp;Tus Pacientes&nbsp;
            </h3>
            <br />
          </div>
          <hr />
        </div>
        <div className="col-12">
          <ul className="list-group">{this.renderPacientes()}</ul>
        </div>
      </div>
    );
  }
}

DashboardNutricionista
 = withRouter(DashboardNutricionista
);

export default withTracker(() => {
  console.log("subscribe pacientes");
  Meteor.subscribe('pacientes', localStorage.getItem('foohealliStuff'));
  return {
    pacientes: Pacientes.find({}).fetch()
  };
})(DashboardNutricionista);

