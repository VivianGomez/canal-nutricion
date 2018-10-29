import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Medicamento from '../medicamento/Medicamento.jsx';
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
      formCrearMedicamento: false,
      nutricionista: false,
      usuario: null
    };

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
        identificacionP= {this.state.identificacionP}
        usuario= {this.state.usuario}
        nutricionista= {this.state.nutricionista}      
        />
      ));
    } else {
      return <h1>Cargando medicamentos...</h1>;
    }
  }


  render() {
    return(
      <div id="medicamentosPaciente" className="row">
        <div className="col-12">
          <hr/>
          <div className="bg-foohealli text-light">
            <br />
            <h2 className="text-center font-weight-bold">
              <i className="fas fa-pills"></i>
              &nbsp;Medicamentos asignados&nbsp;
            </h2>
            <br />
          </div>
          <hr />
        </div>
        <hr/>
        <div className="col-12">
          <ul className="list-group">{this.renderMedicamentos()}</ul>
        </div>
      </div>
    );
  }
}


export default withTracker( props => {

  const identificacionP = "" + props.match.params.identificacion;
  Meteor.subscribe('pacientes.identificacion', identificacionP);
  return {
    paciente: Pacientes.findOne({ identificacion:identificacionP })
  };
})(DetailPacienteNutricionista);