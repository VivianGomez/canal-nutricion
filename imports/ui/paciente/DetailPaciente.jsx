import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Medicamento } from './Medicamento.jsx';

class DetailPaciente extends Component {
  constructor(props) {
    super(props);

    this.state = {
      identificacionP: props.match.params.identificacion,
      paciente: null
    };
  }

  componentDidMount() {
    this.buscarPaciente(this.state.identificacionP);
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
    if (this.state.paciente) {
      let medicamentos = this.state.paciente.medicamentosAsignados;
      return medicamentos.map(medicamento => (
        //   // <Medicamento
        //   //   key={medicamento._id}
        //   //   // usuario={this.state.usuario}
        //   //   medicamento={medicamento.medicamento}
        //   //   // posologia={medicamento.posologia}
        //   //   // frecuencia={medicamento.frecuencia}
        //   //   // cantidad={medicamento.cantidad}
        //   //   // via={medicamento.via}
        //   // />
        <h1 key={medicamento._id}>{medicamento.medicamento}</h1>
      ));
    } else {
      return <h1>Cargando medicamentos...</h1>;
    }
  }

  render() {
    return <div>{this.renderMedicamentos()}</div>;
  }
}

export default DetailPaciente;
