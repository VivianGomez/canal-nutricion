import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

class DetailPaciente extends Component {
  constructor(props) {
    super(props);

    this.state = {
      identificacionP: props.match.params.identificacion,
      paciente: null
    };

  }


  buscarPaciente(identificacion) {
    Meteor.call(
      'pacientes.buscarPaciente',
      { identificacion: identificacion },
      (err, res) => {
        if (err) {
          alert(err.error);
        } else {
          console.log(res);
          this.setState({
            paciente: res
          });
        }
      }
    );
  }


  renderMedicamentos() {
    this.buscarPaciente(this.state.identificacionP);
    console.log("EL PACIENTE", this.state.paciente);
    let medicamentos = this.state.paciente.medicamentosAsignados;
    return medicamentos.map(medicamento => (
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
    return this.renderMedicamentos();
  }
}

export default DetailPaciente;
