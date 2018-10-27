import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';


class Medicamento extends Component {
  constructor(props) {
    super(props);

    this.state = {
        id: this.props.key,
        usuario:this.props.usuario,
        medicamento:this.props.medicamento,
        posologia:this.props.posologia,
        frecuencia:this.props.frecuencia,
        cantidad:this.props.cantidad,
        via:this.props.via
    };


  }

  componentWillReceiveProps(nextProps) {
    this.setState({
        id: nextProps.key,
        usuario:nextProps.usuario,
        medicamento:nextProps.medicamento,
        posologia:nextProps.posologia,
        frecuencia:nextProps.frecuencia,
        cantidad:nextProps.cantidad,
        via:nextProps.via
    });
  }

  render() {
    return (
      <li className="list-group-item">
        <div className="row">
          <div className="col-lg-9 col-md-8 col-12">
            <p>
              {this.state.medicamento} <br />
              <b>posologia: </b>
              {this.state.posologia}
            </p>
          </div>
        </div>
      </li>
    );
  }
}

export default Medicamento;