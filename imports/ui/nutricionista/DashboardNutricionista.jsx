import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import InfoPaciente from '../paciente/InfoPaciente.jsx';
import { withTracker } from 'meteor/react-meteor-data';
import { Pacientes } from '../../api/pacientes.js';
import { withRouter } from 'react-router';

class DashboardNutricionista extends Component {
  constructor(props) {
    super(props);
    this.pacienteAAsignarInput = React.createRef();

    if (!localStorage.getItem('foohealliStuff')) {
      this.props.history.push('/');
    }

    this.state = {
      token: localStorage.getItem('foohealliStuff'),
      nutricionista: false,
      usuario: null,
      botonAgregarPaciente: false,
      formCrearPaciente: false
    };

    this.toggleFormAgregarPacientes = this.toggleFormAgregarPacientes.bind(
      this
    );
  }

  componentDidMount() {
    Meteor.call('usuarios.decodificar', this.state.token, (err, res) => {
      if (err) {
        alert(err.error);
      } else if (res) {
        if (res.rol === 'nutricionista') {
          this.setState({
            botonAgregarPaciente: true,
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
        nombre={paciente.nombre}
        identificacion={paciente.identificacion}
        correo={paciente.correo}
        celular={paciente.celular}
        nutricionista={true}
      />
    ));
  }

  handleAgregarPacienteSubmit(event) {
    event.preventDefault();

    Meteor.call('pacientes.asignarNutricionista', {
      identificacionPaciente: this.pacienteAAsignarInput.current.value,
      identificacionNutricionista: this.state.usuario.identificacion
    });

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
    if (this.state.formCrearPaciente && this.state.nutricionista) {
      return (
        <div className="col-12">
          <h5>Agregar nuevo paciente</h5>
          <form onSubmit={this.handleAgregarPacienteSubmit.bind(this)}>
            <div className="form-group">
              <div className="form-group">
                <label htmlFor="pacienteAAsignarInput">
                  Identificación del paciente a asignar:{' '}
                </label>
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
                &nbsp;Agregar
              </button>
              <button
                type="button"
                className="btn btn-danger ml-1"
                onClick={this.toggleFormAgregarPacientes}
              >
                <i className="far fa-times-circle" />
                &nbsp;Cancelar
              </button>
            </center>
          </form>
        </div>
      );
    }
  }

  botonesDoctor() {
    let botones = [];

    if (this.state.botonAgregarPaciente && this.state.nutricionista) {
      botones.push(
        <button
          key="botonAgregarPaciente"
          type="button"
          className="btn btn-foohealli-yellow mr-2 mb-2"
          onClick={this.toggleFormAgregarPacientes}
        >
          <i className="fas fa-user-plus" />
          &nbsp;Agregar paciente
        </button>
      );
      botones.push(<hr key="separadorBotones" />);
    }

    return botones;
  }

  render() {
    return (
      <div id="pacientes-nutricionista" className="row">
        <br />
        <div className="col-12">
          <br />
          <div className="bg-foohealli text-light">
            <br />
            <h3 className="text-center font-weight-bold">
              &nbsp;Tus Pacientes&nbsp;
            </h3>
            <br />
          </div>
          <hr />
        </div>
        <hr />
        <div className="col-12 text-center">{this.botonesDoctor()}</div>
        <hr />
        {this.formCrearPaciente()}
        <hr />
        <div className="col-12">
          <ul className="list-group">{this.renderPacientes()}</ul>
        </div>
      </div>
    );
  }
}

DashboardNutricionista = withRouter(DashboardNutricionista);

export default withTracker(() => {
  console.log('subscribe pacientes');
  Meteor.subscribe('pacientes', localStorage.getItem('foohealliStuff'));
  return {
    pacientes: Pacientes.find({}).fetch()
  };
})(DashboardNutricionista);
