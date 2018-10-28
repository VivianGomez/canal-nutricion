import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Medicamento from '../medicamento/Medicamento.jsx';
import { withTracker } from 'meteor/react-meteor-data';
import { Pacientes } from '../../api/pacientes.js';
import { withRouter } from 'react-router';

class DetailPacienteNutricionista extends Component {
  constructor(props) {
    super(props);
    this.nombreMedInput = React.createRef();
    this.posologiaInput = React.createRef();
    this.frecuenciaInput = React.createRef();
    this.cantidadInput = React.createRef();
    this.viaInput = React.createRef();

    this.state = {
      token: localStorage.getItem('foohealliStuff'),
      identificacionP: props.match.params.identificacion,
      paciente: this.props.paciente,
      botonAgregarMedicamento: false,
      formCrearMedicamento: false,
      nutricionista: false,
      usuario: null
    };

    this.toggleFormAgregarMedicamentos = this.toggleFormAgregarMedicamentos.bind(
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
            botonAgregarMedicamento: true,
            nutricionista: true,
            usuario: res
          });
        } else {
          this.setState({
            usuario: res
          });
        }
      }
    });
  }

  renderMedicamentos() {
    if (this.props.paciente) {
      let medicamentos = this.props.paciente.medicamentosAsignados;

      return medicamentos.map(medicamento => (
        <Medicamento
          key={medicamento._id}
          medicamento={medicamento}
          identificacionP={this.state.identificacionP}
          usuario={this.state.usuario}
          nutricionista={this.state.nutricionista}
        />
      ));
    } else {
      return <h1>Cargando medicamentos...</h1>;
    }
  }

  handleCrearMedicamentoSubmit(event) {
    event.preventDefault();

    Meteor.call('pacientes.agregarMedicamento', {
      identificacionP: this.state.identificacionP,
      medicamentoP: this.nombreMedInput.current.value,
      posologiaP: this.posologiaInput.current.value,
      frecuenciaP: this.frecuenciaInput.current.value,
      cantidadP: this.cantidadInput.current.value,
      viaP: this.viaInput.current.value,
      usuario: this.state.usuario
    });

    this.nombreMedInput.current.value = '';
    this.posologiaInput.current.value = '';
    this.frecuenciaInput.current.value = '';
    this.cantidadInput.current.value = '';
    this.viaInput.current.value = '';
    this.toggleFormAgregarMedicamentos();
  }

  toggleFormAgregarMedicamentos() {
    this.setState({
      botonAgregarMedicamento: !this.state.botonAgregarMedicamento,
      formCrearMedicamento: !this.state.formCrearMedicamento
    });
  }

  formCrearMedicamento() {
    if (this.state.formCrearMedicamento && this.state.nutricionista) {
      return (
        <div className="col-12">
          <h5>Agregar un medicamento</h5>
          <form onSubmit={this.handleCrearMedicamentoSubmit.bind(this)}>
            <div className="form-group">
              <div className="form-group">
                <label htmlFor="nombreMed">Nombre del medicamento: </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombreMedInput"
                  ref={this.nombreMedInput}
                  minLength="5"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="posologiaInput">Posología: </label>
              <input
                type="text"
                className="form-control"
                id="posologiaInput"
                ref={this.posologiaInput}
                minLength="10"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="frecuenciaInput">Frecuencia: </label>
              <input
                type="text"
                className="form-control"
                id="frecuenciaInput"
                ref={this.frecuenciaInput}
                minLength="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cantidadInput">Cantidad</label>
              <input
                id="cantidadInput"
                className="form-control"
                type="number"
                ref={this.cantidadInput}
                min="0"
                pattern="\d+"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="viaInput">Vía de administración</label>
              <select
                id="viaInput"
                className="form-control"
                ref={this.viaInput}
              >
                <option key="Oral" value="Oral">
                  Oral
                </option>
                <option key="Digestiva" value="Digestiva">
                  Digestiva
                </option>
                <option key="Sublingual" value="Sublingual">
                  Sublingual
                </option>
                <option key="Gastroentérica" value="Gastroentérica">
                  Gastroentérica
                </option>
                <option key="Respiratoria" value="Respiratoria">
                  Respiratoria
                </option>
              </select>
            </div>

            <center>
              <button type="submit" className="btn btn-success mr-1">
                <i className="far fa-check-circle" />
                &nbsp;Asignar medicamento
              </button>
              <button
                type="button"
                className="btn btn-danger ml-1"
                onClick={this.toggleFormAgregarMedicamentos}
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
    console.log(this.state.nutricionista);
    if (this.state.botonAgregarMedicamento && this.state.nutricionista) {
      botones.push(
        <button
          key="botonAgregarMedicamento"
          type="button"
          className="btn btn-foohealli-yellow mr-2 mb-2"
          onClick={this.toggleFormAgregarMedicamentos}
        >
          <i className="fas fa-plus" />
          &nbsp;Agregar medicamento
        </button>
      );
      botones.push(<hr key="separadorBotones" />);
    }

    return botones;
  }

  render() {
    return (
      <div id="medicamentosPaciente" className="row">
        <div className="col-12">
          <div className="col-12 text-center mt-4 mb-3">
            <h1 className="foohealli-text-yellow">
              Paciente {this.props.paciente.nombre}
            </h1>
          </div>
          <div>
            <p>
              <b>Identificación: </b>
              {this.props.paciente.identificacion}
              <br />
              <b>Activo desde: </b>
              {this.props.paciente.fechaRegistro}
              <br />
              <b>Correo: </b>
              {this.props.paciente.correo}
              <br />
              <b>Celular: </b>
              {this.props.paciente.celular}
              <br />
            </p>
          </div>
          <hr />
          <div className="bg-foohealli text-light">
            <br />
            <h2 className="text-center font-weight-bold">
              <i className="fas fa-pills" />
              &nbsp;Medicamentos asignados&nbsp;
            </h2>
            <br />
          </div>
          <hr />
        </div>
        <hr />
        <div className="col-12 text-center">{this.botonesDoctor()}</div>
        <hr />
        {this.formCrearMedicamento()}
        <hr />
        <div className="col-12">
          <ul className="list-group">{this.renderMedicamentos()}</ul>
        </div>
      </div>
    );
  }
}

export default withTracker(props => {
  const identificacionP = '' + props.match.params.identificacion;
  Meteor.subscribe('pacientes.identificacion', identificacionP);
  return {
    paciente: Pacientes.findOne({ identificacion: identificacionP })
  };
})(DetailPacienteNutricionista);
