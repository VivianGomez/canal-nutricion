import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

class Medicamento extends Component {
  constructor(props) {
    super(props);

    this.state = {
      medicamento: this.props.medicamento,
      identificacionP: this.props.identificacionP,
      usuario: this.props.usuario,
      doctor:   this.props.doctor,
      actualizar: false
    };


    this.toggleFormActualizarMedicamento = this.toggleFormActualizarMedicamento.bind(this);

    this.posologiaActualizarInput = React.createRef();
    this.frecuenciaActualizarInput = React.createRef();
    this.cantidadActualizarInput = React.createRef();  
    this.estadoActualizarInput = React.createRef();  


  }

  componentWillReceiveProps(nextProps) {
      this.setState({
      medicamento: nextProps.medicamento,
      identificacionP: nextProps.identificacionP,
      usuario: nextProps.usuario,
      doctor: nextProps.doctor,
    });
  }

  eliminarMedicamento() {
    let confirmar = confirm('¿Está seguro que desea borrar este medicamento?');
    if (confirmar) {
      Meteor.call(
        'pacientes.removerMedicamento',
        {

          identificacion: this.state.identificacionP,
          medicamentoNombre: this.state.medicamento.medicamento,
          usuario: this.state.usuario
        },
        (err, res) => {
          if (err) {
            alert(err);
          } else {
            alert(res);
          }
        }
      );
    }
  }

  handleActualizarMedicamentoSubmit(event) {
    event.preventDefault();
    const posologia = this.posologiaActualizarInput.current.value;
    const frecuencia = this.frecuenciaActualizarInput.current.value;
    const cantidad= this.cantidadActualizarInput.current.value;
    const estado= this.estadoActualizarInput.current.value;
    if (
      posologia === this.state.medicamento.posologia &&
      frecuencia === this.state.medicamento.frecuencia &&
      cantidad === this.state.medicamento.cantidad &&
      estado === this.state.medicamento.estado
    ) {
      alert('Los valores del medicamento no han cambiado');
    } else {
      Meteor.call(
        'pacientes.actualizarMedicamento',
        {
          identificacion: this.state.identificacionP,
          medicamento:this.state.medicamento.medicamento,
          posologia: posologia,
          frecuencia: frecuencia,
          cantidad: cantidad,
          estado: estado,
          usuario: this.state.usuario
        },
        (err, res) => {
          if (err) {
            alert(err);
          } else {
            alert(res);
            this.toggleFormActualizarMedicamento();
          }
        }
      );
    }
  }


  toggleFormActualizarMedicamento() {
    this.setState({
      actualizar: !this.state.actualizar
    });
  }


  formActualizarMedicamento() {
    if (this.state.actualizar) {
      return (
        <div className="col-12">
          <hr />
          <h5>Actualizar medicamento  {this.state.medicamento.medicamento} </h5>
          <form onSubmit={this.handleActualizarMedicamentoSubmit.bind(this)}>
            <div className="form-group">
              <label htmlFor="posologiaInput">Posología: </label>
              <input
                type="text"
                className="form-control"
                id={"posologiaInput"+ this.state.medicamento._id}
                defaultValue={this.state.medicamento.posologia}
                ref={this.posologiaActualizarInput}
                minLength="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="frecuenciaInput">Frecuencia: </label>
              <input
                type="text"
                className="form-control"
                id={"frecuenciaInput"+ this.state.medicamento._id}
                defaultValue={this.state.medicamento.frecuencia}
                ref={this.frecuenciaActualizarInput}
                minLength="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cantidadInput">Cantidad</label>
              <input
                id={"cantidadInput"+ this.state.medicamento._id}
                className="form-control"
                type="number"
                ref={this.cantidadActualizarInput}
                defaultValue={this.state.medicamento.cantidad}
                min="0"
                pattern="\d+"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="estadoActualizarInput">Estado actual</label>
              (¿Sigue haciendo parte del tratamiento del usuario o no?)
              <select
                id="estadoActualizarInput"
                className="form-control"
                ref={this.estadoActualizarInput}
              >
                <option key="Activo" value="Activo">
                  Activo
                </option>
                <option key="Inactivo" value="Inactivo">
                  Inactivo
                </option>
              </select>
            </div>

            <button type="submit" className="btn btn-foohealli-yellow mr-1">
              <i className="far fa-edit" />
              &nbsp;Enviar
            </button>
            <button
              type="button"
              className="btn btn-danger ml-1"
              onClick={this.toggleFormActualizarMedicamento}
            >
              <i className="far fa-times-circle" />
              &nbsp;Cancelar
            </button>
          </form>
        </div>
      );
    }
  }

  botonEdicion() {
    if (!this.state.actualizar) {
      return (
        <button
          type="button"
          className="btn btn-uniandes mr-1 mb-2"
          onClick={this.toggleFormActualizarMedicamento.bind(this)}
        >
          <i className="far fa-edit" />
        </button>
      );
    }
  }

    opcionesDoctor() {
    let doctor = [];
    if (this.state.doctor) { 
      doctor.push(
        <div
          key="habilidadesEdicionAdmin"
          className="col-md-3 col-12  text-right"
        >
          {this.botonEdicion()}
          <button
            type="button"
            className="btn btn-danger ml-1 mb-2"
            onClick={this.eliminarMedicamento.bind(this)}
          >
            <i className="fas fa-trash-alt" />
          </button>
        </div>
      );
    }
    return doctor;
  }

  mostrarFechaFinMedicamento(){
    if(this.state.medicamento.estado==="Inactivo"){
      return (
        <p>
        <br />
          <b>Fecha en que se dejó de usar: </b>
          {this.state.medicamento.fechaFin}
        </p>
        )
    }
  }

  render() {
    return (
      <li className="list-group-item">
        <div className="row">
          <div className="col-lg-9 col-md-8 col-12">
            <p>
              <i className="fas fa-tablets foohealli-text"></i>
              &nbsp;&nbsp;{this.state.medicamento.medicamento}
              <br />
              <b>Posologia: </b>
              {this.state.medicamento.posologia}
              <br />
              <b>Frecuencia: </b>
              {this.state.medicamento.frecuencia}
              <br />
              <b>Cantidad a tomar: </b>
              {this.state.medicamento.cantidad}
              <br />
              <b>Via: </b>
              {this.state.medicamento.via}
              <br />
              <b>Tomado desde: </b>
              {this.state.medicamento.fechaInicio}
              <br />
              <b>Estado actual: </b>
              {this.state.medicamento.estado}
              </p> 
              {this.mostrarFechaFinMedicamento}        
            </div>
               {this.opcionesDoctor()}
          <hr/>
          {this.formActualizarMedicamento()}
        </div>
      </li>
    );
  }
}

export default Medicamento;
