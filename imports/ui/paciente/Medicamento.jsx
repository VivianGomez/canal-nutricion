import React, { Component } from 'react';

class Medicamento extends Component {
  constructor(props) {
    super(props);

    this.state = {
      identificacionP: this.props.identificacionP,
      id: this.props.key,
      medicamento: this.props.medicamento,
      usuario: this.props.usuario,
      doctor:   this.props.doctor,
      actualizar: false
    };

    this.toggleFormActualizarMedicamento = this.toggleFormActualizarMedicamento.bind(this);

    this.posologiaActualizarInput = React.createRef();
    this.frecuenciaActualizarInput = React.createRef();
    this.cantidadActualizarInput = React.createRef();
  }


  componentWillReceiveProps(nextProps) {
    this.setState({
      identificacionP: nextPropss.identificacionP,
      id: nextProps.key,
      medicamento: nextProps.medicamento,
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
    const cantidad= Number(this.cantidadActualizarInput.current.value);
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

  // Toggles

  toggleFormActualizarMedicamento() {
    this.setState({
      actualizar: !this.state.actualizar
    });
  }

  // Forms

  formActualizarMedicamento() {
    if (this.state.actualizar) {
      return (
        <div className="col-12">
          <hr />
          <h5>Actualizar medicamento</h5>
          <form onSubmit={this.handleActualizarMedicamentoSubmit.bind(this)}>
            <div className="form-group">
              <label htmlFor="posologiaInput">Posología: </label>
              <input
                type="text"
                className="form-control"
                id={"posologiaInput"+ this.state.medicamento._id}
                ref={this.posologiaActualizarInput}
                minLength="10"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="frecuenciaInput">Frecuencia: </label>
              <input
                type="text"
                className="form-control"
                id={"frecuenciaInput"+ this.state.medicamento._id}
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
                min="0"
                pattern="\d+"
                required
              />
            </div>
            <button type="submit" className="btn btn-outline-warning mr-1">
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
          className="col-md-6 text-right col-12"
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
          <div className="col-lg-9 col-md-8 col-12">
            <p>
              {this.state.medicamento} <br />
              <b>Cantidad: </b>
              {this.state.cantidad}
            </p>
          </div>
          {this.formActualizarMedicamento()}
          {this.opcionesDoctor()}
        </div>
      </li>
    );
  }
}

export default Medicamento;