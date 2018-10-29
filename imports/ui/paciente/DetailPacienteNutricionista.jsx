import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Medicamento from '../medicamento/Medicamento.jsx';
import AlimentosConsumidos from '../paciente/AlimentosConsumidos.jsx';
import { withTracker } from 'meteor/react-meteor-data';
import { Pacientes } from '../../api/pacientes.js';
import { withRouter } from 'react-router';

class DetailPacienteNutricionista extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: localStorage.getItem('foohealliStuff'),
      identificacionP: props.match.params.identificacion,
      paciente: this.props.paciente,
      botonAgregarMedicamento: false,
      doctor: false,
      usuario: null
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      paciente: nextProps.paciente
    });
  }

  componentDidMount() {
    Meteor.call('usuarios.decodificar', this.state.token, (err, res) => {
      if (err) {
        alert(err.error);
      } else if (res) {
        if (res.rol === 'doctor') {
          this.setState({
            botonAgregarMedicamento: true,
            doctor: true,
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
    if (
      this.props.paciente ||
      (this.state.usuario && this.state.usuario.rol === 'paciente')
    ) {
      let medicamentos = this.props.paciente
        ? this.props.paciente.medicamentosAsignados
        : this.state.usuario.medicamentosAsignados;

      return medicamentos.map(medicamento => (
        <Medicamento
          key={medicamento._id}
          medicamento={medicamento}
          identificacionP={this.state.identificacionP}
          usuario={this.state.usuario}
          doctor={this.state.doctor}
        />
      ));
    } else {
      return <h1>Cargando medicamentos...</h1>;
    }
  }

  renderInfoPaciente() {
    if (this.props.paciente) {
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
              &nbsp;Información paciente {nombre}
              &nbsp;
            </h2>
            <br />
          </div>
          <hr />
          <br />
          <p>
            <i class="fas fa-phone-volume foohealli-text" />
            <b>Celular: </b>
            <a href={'tel:' + celular}> {celular} &nbsp;</a>
            <br />
            <i class="fas fa-envelope-open foohealli-text" />
            <b>Correo: </b>
            <a href={'mailto:' + correo}>{correo}</a>
            <br />
            <i class="fas fa-calendar-alt foohealli-text" />
            <b>En tratamiento desde : </b>
            {fechaR}
            <br />
          </p>
        </div>
      );
    } else {
      return <h1>Cargando info...</h1>;
    }
  }

  render() {
    return (
      <div id="medicamentosPaciente" className="row">
        <div className="col-12">
          {this.renderInfoPaciente()}
          <hr />
        </div>
        <div className="col-12">
          <div className="row">
            <div className="col-12">
              <ul className="nav nav-pills nav-fill" id="myTab" role="tablist">
                <li className="nav-item ">
                  <a
                    className="nav-link text-warning active"
                    id="tab-gratuitos"
                    data-toggle="tab"
                    href="#gratuitos"
                    role="tab"
                    aria-controls="beneficios-gratuitos"
                  >
                    Alimentos consumidos
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link text-warning"
                    id="tab-bronce"
                    data-toggle="tab"
                    href="#bronce"
                    role="tab"
                    aria-controls="beneficios-bronce"
                  >
                    Medicamentos asignados
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <hr />
          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="gratuitos"
              role="tabpanel"
              aria-labelledby="beneficios-tab"
            >
              <div className="col-12">
                {this.state.paciente ? (
                  <AlimentosConsumidos
                    nutricionista={true}
                    paciente={this.state.paciente}
                  />
                ) : (
                  ''
                )}
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="bronce"
              role="tabpanel"
              aria-labelledby="puntos-tab"
            >
              <div className="col-12">
                <center>
                  <h2 className="foohealli-text-yellow font-weight-bold">
                    <i className="fas fa-pills foohealli-text-yellow" />
                    &nbsp;Medicamentos asignados&nbsp;
                  </h2>
                </center>
                <hr />
                <ul className="list-group">{this.renderMedicamentos()}</ul>
              </div>
            </div>
          </div>
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
