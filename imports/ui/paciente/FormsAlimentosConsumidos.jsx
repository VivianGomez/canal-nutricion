import React, { Component } from 'react';
import Emoji from 'react-emoji-render';
import axios from 'axios';

class FormsAlimentosConsumidos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      busqueda: '',
      resultados: [],
      seleccionado: false,
      seleccion: null
    };

    this.tipoComidaInput = React.createRef();

    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    alert('Tu comida ha sido registrada exitosamente.');
    document.getElementById('butonCerrarModalAlimentos').click();
  }

  reiniciarValores() {
    this.setState({
      busqueda: '',
      resultados: [],
      seleccionado: false,
      seleccion: null
    });
  }

  handleChange(event) {
    this.setState(
      {
        busqueda: event.target.value
      },
      () => {
        this.obtenerBusquedas();
        this.obtenerBusquedas();
      }
    );
  }

  seleccionar(alimento) {
    this.setState({
      seleccionado: true,
      seleccion: alimento,
      resultados: [],
      busqueda: ''
    });
  }

  renderBusquedas() {
    let resultados = this.state.resultados;
    if (!this.state.seleccionado && this.state.busqueda !== '') {
      if (resultados.length > 0) {
        return resultados.map(resultado => (
          <li
            key={resultado.ndbno}
            className="list-group-item"
            onClick={() => this.seleccionar(resultado)}
          >
            {resultado.name}
          </li>
        ));
      } else {
        return (
          <li className="list-group-item">
            <Emoji text="No hay resultados 😪" />
          </li>
        );
      }
    }
  }

  renderBarraBusqueda() {
    if (this.state.seleccionado) {
      return (
        <div className="row mb-2 align-items-center h-100">
          <div className="col-12">
            <label htmlFor="nombreComida">
              <b>Comida</b>
            </label>
          </div>
          <div className="col-9 ">{this.state.seleccion.name}</div>
          <div className="col-3 text-center">
            <button
              type="button"
              className="btn btn-foohealli-yellow pointer"
              onClick={() => this.reiniciarValores()}
            >
              <i className="fas fa-search" />
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="form-group">
          <label htmlFor="nombreComidaInput">
            <b>Comida</b>
          </label>
          <input
            type="text"
            className="form-control"
            id="nombreComidaInput"
            onChange={this.handleChange}
            minLength="2"
            placeholder="Busca una comida..."
            required
          />
          <ul className="list-group">{this.renderBusquedas()}</ul>
        </div>
      );
    }
  }

  obtenerBusquedas() {
    axios
      .get(
        'https://api.nal.usda.gov/ndb/search/?format=json&api_key=d88AhCQq0DlNsy2PSzi6IiixEpuKo6pMsEPnLVMK&max=5&offset=0&sort=r&ds=Standard Reference&q=' +
          this.state.busqueda
      )
      .then(({ data }) => {
        if (data.list) {
          this.setState({
            resultados: data.list.item
          });
        } else {
          this.setState({
            resultados: []
          });
        }
      });
  }

  render() {
    return (
      <div
        className="modal fade bd-example-modal-lg bg-foohealli-yellow"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myLargeModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content bg-foohealli">
            <div className="modal-header bg-foohealli text-light">
              <h5 className="modal-title" id="exampleModalLabel">
                <Emoji text="Dinos qué comiste 😋" />
              </h5>
              <button
                id="butonCerrarModalAlimentos"
                type="button"
                className="close text-light"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p className="small">
                Al llenar los valores podrás registrar tu comida.
              </p>
              <form onSubmit={this.handleSubmit.bind(this)}>
                <div className="form-group">
                  <label htmlFor="tipoComidaInput">
                    <b>Tipo de comida</b>
                  </label>
                  <select
                    type="text"
                    className="form-control"
                    id="tipoComidaInput"
                    ref={this.tipoComidaInput}
                  >
                    <option value="desayuno">Desayuno</option>
                    <option value="almuerzo">Almuerzo</option>
                    <option value="cena">Cena</option>
                    <option value="onces">Onces</option>
                  </select>
                </div>
                {this.renderBarraBusqueda()}
                <div className="form-group">
                  <label htmlFor="porcionComidaInput">
                    <b>Porción ingerida (gr)</b>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="porcionComidaInput"
                    ref={this.porcionDeComidaInput}
                    min="0"
                    placeholder="Ej: 200"
                    required
                  />
                </div>

                <center>
                  {this.state.seleccionado ? (
                    <button type="submit" className="btn btn-foohealli">
                      <i className="fas fa-utensils" />
                      &nbsp;Registrar comida
                    </button>
                  ) : (
                    <h1 />
                  )}
                </center>
                <br />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FormsAlimentosConsumidos;
