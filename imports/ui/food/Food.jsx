import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

class Food extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alimento: this.props.alimento,
      nutricionista: this.props.nutricionista,
      identificacion: this.props.identificacion
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      alimento: nextProps.alimento,
      nutricionista: nextProps.nutricionista
    });
  }

  removerAlimento() {
    Meteor.call(
      'patients.removerAlimento',
      {
        identificacion: this.state.identificacion,
        alimento: this.state.alimento
      },
      (err, res) => {
        if (err) {
          alert(err);
        } else {
          alert(res);
          document.getElementById('botonActualizarConsumo').click();
        }
      }
    );
  }

  render() {
    let alimento = this.state.alimento;
    return (
      <li className="list-group-item">
        <div className="row">
          <div className="col-md-8 col-12">
            {alimento.alimento}
            <br />
            <b>Porción: </b> {alimento.porcionConsumidaGramos} gr
          </div>
          <div className="col-md-4 col-12">
            <b>Categoría: </b> {alimento.categoria}
          </div>
          {!this.state.nutricionista ? (
            <div className="col-12 text-right">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => this.removerAlimento()}
              >
                <i className="fas fa-trash-alt" />
              </button>
            </div>
          ) : (
            ''
          )}
        </div>
      </li>
    );
  }
}

export default Food;
