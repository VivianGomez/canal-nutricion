import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import InformationPatient from '../patient/InformationPatient.jsx';
import { withTracker } from 'meteor/react-meteor-data';
import { Patients } from '../../api/patients.js';
import { withRouter } from 'react-router';

class DashboardDoctor extends Component {
  constructor(props) {
    super(props);
    this.pacienteAAsignarInput = React.createRef();

    if (!localStorage.getItem('foohealliStuff')) {
      this.props.history.push('/');
    }

    this.state = {
      token: localStorage.getItem('foohealliStuff'),
      doctor: false,
      usuario: null,
      botonAgregarPaciente: false,
      formCrearPaciente: false
    };

    this.toggleFormAgregarPacientes = this.toggleFormAgregarPacientes.bind(
      this
    );
  }

  componentDidMount() {
    Meteor.call('users.decodificar', this.state.token, (err, res) => {
      if (err) {
        alert(err.error);
      } else if (res) {
        if (res.rol === 'doctor') {
          this.setState({
            botonAgregarPaciente: true,
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
      <InformationPatient
        key={paciente._id}
        paciente={paciente}
        nombre={paciente.nombre}
        identificacion={paciente.identificacion}
        correo={paciente.correo}
        celular={paciente.celular}
        nutricionista={false}
      />
    ));
  }

 handleAgregarPacienteSubmit(event) {
    event.preventDefault();

    Meteor.call(
      'patients.assignDoctor',
      this.pacienteAAsignarInput.current.value,
      this.state.usuario.identificacion,
      err => {
        if (err) {
          alert(err.error);
        }
      }
    );

    this.pacienteAAsignarInput.current.value = '';
    this.toggleFormAgregarPacientes();
  }

  toggleFormAgregarPacientes() {
    this.setState({
      botonAgregarPaciente: !this.state.botonAgregarPaciente,
      formCrearPaciente: !this.state.formCrearPaciente
    });
  }

  formCrearPaciente() {
    if (this.state.formCrearPaciente && this.state.doctor) {
      return (
        <div className="col-12">
          <h5>Add a new patient</h5>
          <form onSubmit={this.handleAgregarPacienteSubmit.bind(this)}>
            <div className="form-group">
              <div className="form-group">
                <label htmlFor="pacienteAAsignarInput">Patient's id: </label>
                <input
                  type="text"
                  className="form-control"
                  id="pacienteAAsignarInput"
                  ref={this.pacienteAAsignarInput}
                  minLength="5"
                  required
                />
              </div>
            </div>
            <center>
              <button type="submit" className="btn btn-success mr-1">
                <i className="far fa-check-circle" />
                &nbsp;Add
              </button>
              <button
                type="button"
                className="btn btn-danger ml-1"
                onClick={this.toggleFormAgregarPacientes}
              >
                <i className="far fa-times-circle" />
                &nbsp;Cancel
              </button>
            </center>
          </form>
          <hr />
        </div>
      );
    }
  }
 
  botonesDoctor() {
    let botones = [];

    if (this.state.botonAgregarPaciente && this.state.doctor) {
      botones.push(
        <button
          key="botonAgregarPaciente"
          type="button"
          className="btn btn-foohealli-yellow mr-2 mb-2"
          onClick={this.toggleFormAgregarPacientes}
        >
          <i className="fas fa-user-plus" />
          &nbsp;Add patient
        </button>
      );
      botones.push(<hr key="separadorBotones" />);
    }

    return botones;
  }

  render() {
    return (
      <div id="pacientes-doctor" className="row">
        <br />
        <div className="col-12">
          <br />
          <div className="bg-foohealli text-light">
            <br />
            <h3 className="text-center font-weight-bold">
              &nbsp;My patients&nbsp;
            </h3>
            <br />
          </div>
          <hr />
        </div>
        <div className="col-12 text-center">{this.botonesDoctor()}</div>
        {this.formCrearPaciente()}
        <div className="col-12">
          <ul className="list-group">{this.renderPacientes()}</ul>
        </div>
      </div>
    );
  }
}

DashboardDoctor = withRouter(DashboardDoctor);

export default withTracker(() => {
  Meteor.subscribe('patients', localStorage.getItem('foohealliStuff'));
  return {
    pacientes: Patients.find({}).fetch()
  };
})(DashboardDoctor);
