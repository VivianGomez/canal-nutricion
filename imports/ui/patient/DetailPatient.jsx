import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Medicine from '../medicine/Medicine.jsx';
import { withTracker } from 'meteor/react-meteor-data';
import { Patients } from '../../api/patients.js';
import { withRouter } from 'react-router';

class DetailPatient extends Component {
  constructor(props) {
    super(props);

    if (!localStorage.getItem('foohealliStuff')) {
      this.props.history.push('/');
    }

    this.nombreMedInput = React.createRef();
    this.posologiaInput = React.createRef();
    this.frecuenciaInput = React.createRef();
    this.cantidadInput = React.createRef();
    this.viaInput = React.createRef();

    this.state = {
      token: localStorage.getItem('foohealliStuff'),
      identificacionP: this.props.match.params.id,
      paciente: this.props.paciente,
      botonAgregarMedicamento: false,
      formCrearMedicamento: false,
      doctor: false,
      usuario: null
    };

    this.toggleFormAgregarMedicamentos = this.toggleFormAgregarMedicamentos.bind(
      this
    );
  }

  componentDidMount() {
    Meteor.call('users.decodificar', this.state.token, (err, res) => {
      if (err) {
        alert(err.error);
      } else if (res) {
        if (res.rol === 'doctor') {
          if (!this.props.match.params.id) {
            this.props.history.push('/');
          } else {
            this.setState({
              botonAgregarMedicamento: true,
              doctor: true,
              usuario: res
            });
          }
        } else if (res.rol === 'paciente') {
          if (this.props.match.params.id) {
            this.props.history.push('/');
          } else {
            this.setState({
              usuario: res
            });
          }
        } else {
          this.props.history.push('/');
        }
      }
    });
  }

  renderMedicamentos() {
    if (
      this.props.paciente ||
      (this.state.usuario && this.state.usuario.rol === 'paciente')
    ) {
      let medicamentos = this.props.paciente
        ? this.props.paciente.medicamentosAsignados
        : this.state.usuario.medicamentosAsignados;

      if (!this.state.doctor) {
        medicamentos = medicamentos.filter(medicamento => {
          return medicamento.estado === 'Activo';
        });
      }

      if (medicamentos.length === 0) {
        return (
          <li key="noMedicamentosVacio" className="list-group-item">
            There are no assigned medicines
          </li>
        );
      }

      return medicamentos.map(medicamento => (
        <Medicine
          key={medicamento.medicamento}
          medicamento={medicamento}
          identificacionP={this.state.identificacionP}
          usuario={this.state.usuario}
          doctor={this.state.doctor}
        />
      ));
    } else {
      return (
        <li key="noMedicamentos" className="list-group-item">
          There are no assigned medicines
        </li>
      );
    }
  }

  renderInfoPaciente() {
    if (this.props.paciente) {
      let identificacion = this.props.paciente.identificacion;
      let nombre = this.props.paciente.nombre;
      let correo = this.props.paciente.correo;
      let celular = this.props.paciente.celular;
      let fechaR = this.props.paciente.fechaRegistro;

      return (
        <div className="col-12">
          <hr />
          <div className="bg-foohealli text-light">
            <br />
            <h2 className="text-center font-weight-bold">
              &nbsp;{nombre}
              &nbsp;
            </h2>
            <br />
          </div>
          <br />
          <div className="row">
            <div className="col-lg-2 " />
            <div className="col-lg-4  col-12">
              <i className="fas fa-id-card foohealli-text" />
              &nbsp;
              <b>Id: </b>
              {identificacion}
            </div>
            <div className="col-lg-4  col-12">
              <i className="fas fa-calendar-alt foohealli-text" />
              &nbsp;
              <b>Start date: </b>
              {fechaR}
            </div>
            <div className="col-lg-2" />
            <div className="col-lg-2 " />
            <div className="col-lg-4  col-12">
              <i className="fas fa-phone-volume foohealli-text" />
              &nbsp;
              <b>Phone: </b>
              <a href={'tel:' + celular}> {celular} &nbsp;</a>
            </div>
            <div className="col-lg-6 col-12">
              <i className="fas fa-envelope-open foohealli-text" />
              &nbsp;
              <b>Email: </b>
              <a href={'mailto:' + correo}>{correo}</a>
            </div>
          </div>
        </div>
      );
    } else {
      return <h1>...</h1>;
    }
  }

  handleCrearMedicamentoSubmit(event) {
    event.preventDefault();

    Meteor.call('patients.agregarMedicamento', {
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
    if (this.state.formCrearMedicamento && this.state.doctor) {
      return (
        <div className="col-12">
          <h5>Add a medicine</h5>
          <form onSubmit={this.handleCrearMedicamentoSubmit.bind(this)}>
            <div className="form-group">
              <div className="form-group">
                <label htmlFor="nombreMed">Name: </label>
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
              <label htmlFor="posologiaInput">Posology: </label>
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
              <label htmlFor="frecuenciaInput">Frequency: </label>
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
              <label htmlFor="cantidadInput">Dose</label>
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
              <label htmlFor="viaInput">Way of consumption</label>
              <select
                id="viaInput"
                className="form-control"
                ref={this.viaInput}
              >
                <option key="Oral" value="Oral">
                  Oral
                </option>
                <option key="Digestive" value="Digestive">
                  Digestive
                </option>
                <option key="Sublingual" value="Sublingual">
                  Sublingual
                </option>
                <option key="Gastroenteric" value="Gastroenteric">
                  Gastroenteric
                </option>
                <option key="Respiratory" value="Respiratory">
                  Respiratory
                </option>
              </select>
            </div>

            <center>
              <button type="submit" className="btn btn-foohealli mr-1">
                <i className="far fa-check-circle" />
                &nbsp;Add medicine
              </button>
              <button
                type="button"
                className="btn btn-danger ml-1"
                onClick={this.toggleFormAgregarMedicamentos}
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
    if (this.state.botonAgregarMedicamento && this.state.doctor) {
      botones.push(
        <button
          key="botonAgregarMedicamento"
          type="button"
          className="btn btn-foohealli-yellow mr-2 mb-2"
          onClick={this.toggleFormAgregarMedicamentos}
        >
          <i className="fas fa-plus" />
          &nbsp;Add medicine
        </button>
      );
      botones.push(<hr key="separadorBotones" />);
    }

    return botones;
  }

  render() {
    return (
      <div id="medicamentosPaciente" className="row">
        {this.state.doctor ? (
          <div className="col-12">{this.renderInfoPaciente()}</div>
        ) : (
          ''
        )}
        <div className="col-12">
          {this.state.doctor ? (
            <center>
              <hr />
              <h2 className="foohealli-text-yellow font-weight-bold">
                <i className="fas fa-pills foohealli-text-yellow" />
                &nbsp;Assigned medicines&nbsp;
              </h2>
            </center>
          ) : (
            <div className="bg-foohealli text-light mt-4">
              <br />
              <h2 className="text-center font-weight-bold">
                <i className="fas fa-pills" />
                &nbsp;Assigned medicines&nbsp;
              </h2>
              <br />
            </div>
          )}
          <hr />
        </div>
        <br />
        {this.state.doctor ? (
          <div className="col-12 text-center">{this.botonesDoctor()}</div>
        ) : (
          ''
        )}
        <br />
        {this.state.doctor ? this.formCrearMedicamento() : ''}
        <div className="col-12">
          <ul className="list-group">{this.renderMedicamentos()}</ul>
        </div>
      </div>
    );
  }
}

DetailPatient = withRouter(DetailPatient);

export default withTracker(props => {
  const identificacionP = '' + props.match.params.id;
  Meteor.subscribe('patients.identificacion', identificacionP);
  return {
    paciente: Patients.findOne({ identificacion: identificacionP })
  };
})(DetailPatient);
