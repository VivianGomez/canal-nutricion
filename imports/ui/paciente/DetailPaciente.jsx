import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Medicamento } from './Medicamento.jsx';
import { withTracker } from 'meteor/react-meteor-data';
import { Pacientes } from '../../api/pacientes.js';
import { withRouter } from 'react-router';

class DetailPaciente extends Component {
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
      paciente: null,
      botonAgregarMedicamento: false,
      formCrearMedicamento: false,
      doctor: false,
      usuario: null,
      medicamentos:[]
    };

    this.toggleFormAgregarMedicamentos = this.toggleFormAgregarMedicamentos.bind(this);
  }


  componentDidMount() {
    this.buscarPaciente(this.state.identificacionP);
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

  buscarPaciente(identificacion) {
    Meteor.call(
      'pacientes.buscarPaciente',
      { identificacion: identificacion },
      (err, res) => {
        if (err) {
          alert(err.error);
        } else {
          this.setState({
            paciente: res,
            medicamentos: res.medicamentosAsignados      
          });
        }
      }
    );
  }

renderMedicamentos() {
    if (this.state.paciente) {
      console.log("MEDICAMENTOS", this.state.medicamentos);
      return this.state.medicamentos.map(medicamento => (
        //<Medicamento
        // key={medicamento._id}
        //   //   // usuario={this.state.usuario}
        // medicamento={medicamento.medicamento}
        //   //   // posologia={medicamento.posologia}
        //   //   // frecuencia={medicamento.frecuencia}
        //   //   // cantidad={medicamento.cantidad}
        //   //   // via={medicamento.via}
        // />
        <li key={medicamento._id} className="list-group-item">
         <div className="row">
          <div className="col-lg-9 col-md-8 col-12">
            <p>
              {medicamento.medicamento}
              <br />
              {/* <b>posologia: </b>
              {this.state.posologia} */}
            </p>
          </div>
         </div>
        </li>
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
      frecuenciaP:this.frecuenciaInput.current.value,
      cantidadP: this.cantidadInput.current.value,
      viaP:this.viaInput.current.value,
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
    if (this.state.formCrearMedicamento) {
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

    if (this.state.botonAgregarMedicamento) {
      botones.push(
        <button
          key="botonAgregarMedicamento"
          type="button"
          className="btn btn-foohealli mr-2 mb-2"
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
    return(
      <div id="medicamentosPaciente" className="row">
        <div className="col-12">
          <hr/>
          <div className="bg-foohealli-green text-light">
            <br />
            <h3 className="text-center font-weight-bold">
              &nbsp;Medicamentos asignados&nbsp;
            </h3>
            <br />
          </div>
          <hr />
        </div>
        <div className="col-12 text-center">{this.botonesDoctor()}</div>
        <hr/>
        {this.formCrearMedicamento()}
        <hr/>
        <div className="col-12">
          <ul className="list-group">{this.renderMedicamentos()}</ul>
        </div>
      </div>
    );
  }
}

DetailPaciente = withRouter(DetailPaciente);

export default withTracker(() => {
  console.log("subscribe pacientes");
  Meteor.subscribe('pacientes', localStorage.getItem('foohealliStuff'));
  return {
    pacientes: Pacientes.find({}).fetch()
  };
})(DetailPaciente);