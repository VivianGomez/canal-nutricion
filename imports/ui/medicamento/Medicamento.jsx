import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

class Medicamento extends Component {
  constructor(props) {
    super(props);

    this.state = {
      medicamento: this.props.medicamento,
      identificacionP: this.props.identificacionP,
      usuario: this.props.usuario,
      doctor: this.props.doctor,
      actualizar: false,
      opcionesDoctor: this.props.opcionesDoctor
    };

    this.toggleFormActualizarMedicamento = this.toggleFormActualizarMedicamento.bind(
      this
    );

    this.posologiaActualizarInput = React.createRef();
    this.frecuenciaActualizarInput = React.createRef();
    this.cantidadActualizarInput = React.createRef();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      medicamento: nextProps.medicamento,
      identificacionP: nextProps.identificacionP,
      usuario: nextProps.usuario,
      doctor: nextProps.doctor,
      opcionesDoctor: nextProps.opcionesDoctor
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
    const cantidad = this.cantidadActualizarInput.current.value;
    if (
      posologia === this.state.medicamento.posologia &&
      frecuencia === this.state.medicamento.frecuencia &&
      cantidad === this.state.medicamento.cantidad
    ) {
      alert('Los valores del medicamento no han cambiado');
    } else {
      Meteor.call(
        'pacientes.actualizarMedicamento',
        {
          identificacion: this.state.identificacionP,
          medicamento: this.state.medicamento.medicamento,
          posologia: posologia,
          frecuencia: frecuencia,
          cantidad: cantidad,
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
          <h5>Actualizar medicamento {this.state.medicamento.medicamento} </h5>
          <form onSubmit={this.handleActualizarMedicamentoSubmit.bind(this)}>
            <div className="form-group">
              <label htmlFor="posologiaInput">Posología: </label>
              <input
                type="text"
                className="form-control"
                id={'posologiaInput' + this.state.medicamento._id}
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
                id={'frecuenciaInput' + this.state.medicamento._id}
                defaultValue={this.state.medicamento.frecuencia}
                ref={this.frecuenciaActualizarInput}
                minLength="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cantidadInput">Cantidad</label>
              <input
                id={'cantidadInput' + this.state.medicamento._id}
                className="form-control"
                type="number"
                ref={this.cantidadActualizarInput}
                defaultValue={this.state.medicamento.cantidad}
                min="0"
                pattern="\d+"
                required
              />
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

    return doctor;
  }
  render() {
    return (
      <li className="list-group-item">
        <div className="row">
          <div
            className={
              'col-12 ' + this.state.opcionesDoctor ? 'col-lg-9 col-md-8' : ''
            }
          >
            <p>
              <i className="fas fa-tablets foohealli-text" />
              &nbsp;&nbsp;
              {this.state.medicamento.medicamento}
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
            </p>
          </div>
          {this.state.opcionesDoctor ? this.opcionesDoctor() : ''}
          {this.state.opcionesDoctor ? this.formActualizarMedicamento() : ''}
        </div>
      </li>
    );
  }
}

export default Medicamento;
