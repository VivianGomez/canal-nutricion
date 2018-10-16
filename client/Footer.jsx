import React, { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <footer className="footer raleway f-18 text-white">
        <div className="container container-fluid">
          <div className="row">
            <div className="col-lg-5 col-md-12 mt-4 col-12" id="desarrollado">
              <p className="text-justify font-weight-bold text-light">
                Desarrollado por Gabriel Pinto & Vivian Gómez
              </p>
            </div>
            <div className="col-12 text-center copyright-opacity">
              © 2018 - Foohealli. Todos los derechos reservados.
              <br />
              <br />
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
export default Footer;
