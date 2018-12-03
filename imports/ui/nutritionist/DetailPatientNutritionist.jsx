import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Medicine from '../medicine/Medicine.jsx';
import ConsumedFood from '../patient/ConsumedFood.jsx';
import DailyReport from '../nutritionist/DailyReport.jsx';
import { withTracker } from 'meteor/react-meteor-data';
import { Patients } from '../../api/patients.js';
import { withRouter } from 'react-router';

class DetailPatientNutritionist extends Component {
  constructor(props) {
    super(props);

    if (!localStorage.getItem('foohealliStuff')) {
      this.props.history.push('/');
    }

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
    Meteor.call('users.decodificar', this.state.token, (err, res) => {
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

      if (medicamentos.length === 0) {
        return (
          <li className="list-group-item">There are no assigned medicines.</li>
        );
      }

      return medicamentos.map(medicamento => (
        <Medicine
          key={medicamento._id}
          medicamento={medicamento}
          identificacionP={this.state.identificacionP}
          usuario={this.state.usuario}
          doctor={this.state.doctor}
        />
      ));
    } else {
      return (
        <li className="list-group-item">There are no assigned medicines.</li>
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
      return (
        <div className="container text-center">
          <div className="spinner">
            <div className="double-bounce1" />
            <div className="double-bounce2" />
          </div>
        </div>
      );
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
                    className="nav-link  bg-foohealli-yellow-dark text-text-white active"
                    id="tab-gratuitos"
                    data-toggle="tab"
                    href="#gratuitos"
                    role="tab"
                    aria-controls="beneficios-gratuitos"
                  >
                    Consumed food
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link bg-foohealli-yellow-dark text-text-white"
                    id="tab-bronce"
                    data-toggle="tab"
                    href="#bronce"
                    role="tab"
                    aria-controls="beneficios-bronce"
                  >
                    Assigned medicine
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link bg-foohealli-yellow-dark text-text-white"
                    id="tab-bronce"
                    data-toggle="tab"
                    href="#dailyReport"
                    role="tab"
                    aria-controls="daily-report"
                  >
                    Daily report
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
                  <ConsumedFood
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
                    &nbsp;Assigned medicine&nbsp;
                  </h2>
                </center>
                <hr />
                <ul className="list-group">{this.renderMedicamentos()}</ul>
              </div>
            </div>
            <div
              className="tab-pane fade show active"
              id="dailyReport"
              role="tabpanel"
              aria-labelledby="daily-report-tab"
            >
              <div className="col-12">
                {this.state.paciente ? (
                  <DailyReport
                    nutritionist={true}
                    patient={this.state.paciente}
                  />
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DetailPatientNutritionist = withRouter(DetailPatientNutritionist);

export default withTracker(props => {
  const identificacionP = '' + props.match.params.identificacion;
  Meteor.subscribe('patients.identificacion', identificacionP);
  return {
    paciente: Patients.findOne({ identificacion: identificacionP })
  };
})(DetailPatientNutritionist);
