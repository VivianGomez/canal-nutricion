import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import DetailPaciente from './DetailPaciente.jsx';


class InfoPaciente extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paciente: this.props.paciente,
      nombre: this.props.nombre,
      identificacion: this.props.identificacion,
      correo: this.props.correo,
      celular: this.props.celular,
      usuarioLogueado: this.props.usuarioLogueado,
      actualizar: false
    };

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      paciente: nextProps.paciente,
      nombre: nextProps.nombre,
      identificacion: nextProps.identificacion,
      correo: nextProps.correo,
      celular: nextProps.celular
    });
  }

  mostrarContactoUsuario() {
      return (
        <p>
          <b>Celular: </b>
          <a href={'tel:' + this.state.celular}>
            {this.state.celular}
            &nbsp;
          </a>
          <b>Correo: </b>
          <a href={'mailto:' + this.state.correo}>
            {this.state.correo}
          </a>
        </p>
      );
  }

    mostrarContenidoUsuario() {
      return (
        <Link to={'/DetailPaciente'} style={{ textDecoration: 'none' }}>
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
              <b className="foohealli-text">Contacto: </b>
              {this.mostrarContactoUsuario()}
            </div>
          </div>
        </li>
        </Link>
      );
  }


  render() {
    return this.mostrarContenidoUsuario();
  }
}

export default InfoPaciente;
