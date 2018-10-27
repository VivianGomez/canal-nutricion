import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

class InfoPaciente extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paciente: this.props.paciente,
      nombre: this.props.nombre,
      identificacion: this.props.identificacion,
      celular: this.props.celular,
      correo: this.props.correo,
      usuarioLogueado: this.props.usuarioLogueado,
      actualizar: false
    };
    
    this.toggleFormActualizarMedicamento = this.toggleFormActualizarMedicamento.bind(this);
    this.actualizarEstadoInput = React.createRef();
    
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      paciente: nextProps.paciente,
      nombre: nextProps.nombre,
      identificacion: nextProps.identificacion,
      celular: nextProps.celular,
      correo: nextProps.correo,
    });
  }

  mostrarContactoUsuario() {
      return (
        <p>
          <b>Celular: </b>
          <a href={'tel:' + this.state.celular}>
            {this.state.usuario.celular}
            &nbsp;
          </a>
          <b>Correo: </b>
          <a href={'mailto:' + this.state.correo}>
            {this.state.usuario.correo}
          </a>
        </p>
      );
  }

  mostrarContenidoUsuario() {
      return (
        <li className="list-group-item">
          <div className="row">
            <div className="col-md-9 col-12">
              <p>
                <b>Paciente: </b>
                &nbsp;
                {this.state.nombre}
              </p>
              <p>
                <b>Identificacion: </b>
                &nbsp;
                {this.state.identificacion}
              </p>
              <b className="text-warning">Contacto: </b>
              {this.mostrarContactoUsuario()}
            </div>
          </div>
        </li>
      );
  }


  render() {
    return this.mostrarContenidoUsuario();
  }
}

export default InfoPaciente;
