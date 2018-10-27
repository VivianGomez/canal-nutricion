import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import InfoPaciente from './InfoPaciente.jsx';
import { withTracker } from 'meteor/react-meteor-data';
import { Pacientes } from '../../api/pacientes.js';
import { withRouter } from 'react-router';

class Doctor extends Component {
  constructor(props) {
    super(props);

    if (!localStorage.getItem('foohealliStuff')) {
      this.props.history.push('/');
    }

    this.state = {
      token: localStorage.getItem('foohealliStuff'),
      doctor: false,
      usuario: null
    };
  }

  componentDidMount() {
    Meteor.call('usuarios.decodificar', this.state.token, (err, res) => {
      if (err) {
        alert(err.error);
      } else if (res) {
        if (res.rol === 'doctor') {
          this.setState({
            doctor: true,
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
        celular= {paciente.celular}
        correo= {paciente.correo}
      />
    ));
  }

  render() {
    return (
      <div id="pacientes-doctor" className="row">
        <div className="col-12">
          <div className="bg-foohealli text-light">
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

Doctor = withRouter(Doctor);

export default withTracker(() => {
  console.log("subscribe pacientes");
  Meteor.subscribe('pacientes', localStorage.getItem('foohealliStuff'));
  return {
    pacientes: Pacientes.find({}).fetch()
  };
})(Doctor);
