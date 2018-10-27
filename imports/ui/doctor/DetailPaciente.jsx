import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';


class DetailPaciente extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pacienteActual: null
    };

  }

  buscarPaciente(idPaciente) {
    Meteor.call(
      'pacientes.buscarPaciente',
      { identificacion: idPaciente },
      (err, res) => {
        if (err) {
          alert(err.error);
        } else {
          this.setState({
            pacienteActual: res
          });
        }
      }
    );
  }


  render() {
    return (
      <div className="row">
            HOLA!
      </div>
    );
  }
}

export default DetailPaciente;

