import 'mocha'
import { expect } from 'chai'
import { Funko } from "../../../src/Ejercicio-3/Funko-App/Funko.js"
import { Coleccion } from "../../../src/Ejercicio-3/Funko-App/Coleccion.js"

const funko1 = new Funko(1, "Mario", "Mario Bros con una estrella", "Pop!", "Videojuegos", "Mario Bros", 12, false, "Cabeza XXL", 30)
const funko1_2 = new Funko(1, "Mario", "Mario Bros con una estrella", "Pop!", "Videojuegos", "Mario Bros", 22, false, "Cabeza XXL", 30)
const funko2 = new Funko(2, "Luigi", "Luigi con una estrella", "Pop! Rides", "Videojuegos", "Mario Bros", 10, false, "Cabeza XXL", 15)
const coleccion = new Coleccion();

describe ("Tests de la clase Coleccion", () => {
  it ("El constructor no debe devolver undefined", () => {
    expect(new Coleccion()).not.to.be.eql(undefined)
  });

  it ("Prueba del getTamColeccion", () => {
    expect(coleccion.getTamColeccion).to.be.eql(0)
  });

  it ("Prueba añadir", () => {
    expect(coleccion.añadir(funko1)).to.be.eql(true);
    expect(coleccion.getTamColeccion).to.be.eql(1)
    expect(coleccion.añadir(funko1)).to.be.eql(false);
    expect(coleccion.getTamColeccion).to.be.eql(1)
  });

  it ("Prueba modificar", () => {
    expect(coleccion.modificar(funko2)).to.be.eql(false);
    expect(coleccion.modificar(funko1_2)).to.be.eql(true);
    expect(coleccion.getTamColeccion).to.be.eql(1)
  });

  it ("Prueba eliminar", () => {
    expect(coleccion.eliminar(3)).to.be.eql(false);
    expect(coleccion.eliminar(1)).to.be.eql(true);
  });
});