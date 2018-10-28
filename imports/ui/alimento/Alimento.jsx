import React, { Component } from 'react';

class Alimento extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alimento: this.props.alimento
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      alimento: nextProps.alimento
    });
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
        </div>
      </li>
    );
  }
}

export default Alimento;
