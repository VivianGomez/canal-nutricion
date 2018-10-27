import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import Medicamento from './Medicamento.jsx';


class DetailPaciente extends Component {
  constructor(props) {
    super(props);

    this.state = {
      identificacion: props.match.params.identificacion,
      pacienteActual: null,
      medicamentosAsignados: []
    };

  }

    componentDidMount() {
    const identificacionP = this.state.identificacion;

    console.log("consultando:", identificacionP );

    Meteor.call('pacientes.buscarPaciente', identificacionP, (err, res) => {
      if (err) {
        alert(err.error);
      } else if (res) {
          this.setState({
            pacienteActual: res
          });
      }
    });
}

    buscarPaciente(identificacionP) {
    console.log("consultando ",identificacionP );
    Meteor.call(
      'pacientes.buscarPaciente',
      { identificacion: identificacionP },
      (err, res) => {
        if (err) {
          alert(err.error);
        } else {
            console.log("RRRRRRRRRREEEEEEEssssssssss", res);
            console.log("pacienteActual ANTES", this.state.pacienteActual);
          this.setState({
            pacienteActual: res
          });
           console.log("pacienteActual DSPS", this.state.pacienteActual);
        }
      }
    );
  }


  renderMedicamentos() {
    this.buscarPaciente(this.state.identificacion);
    console.log("EL PACIENTE", this.state.pacienteActual);
    let medicamentos = this.state.pacienteActual.medicamentosAsignados;
    return asignaciones.map(medicamento => (
      <Medicamento
        key={medicamento._id}
        usuario={this.state.usuario}
        medicamento={medicamento.medicamento}
        posologia={medicamento.posologia}
        frecuencia={medicamento.frecuencia}
        cantidad={medicamento.cantidad}
        via={medicamento.via}
      />
    ));
  }


  render() {
    return (
      <div className="row">
        <div className="col-12">
          <ul className="list-group">{this.renderMedicamentos()}</ul>
        </div>
      </div>
    );
  }
}

export default DetailPaciente;
