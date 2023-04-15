import 'mocha'
import { expect } from 'chai'
import { Funko } from '../../../src/Ejercicio-3/Funko-App/Funko.js'

const funko1 = new Funko(1, "Mario", "Mario Bros con una estrella", "Pop!", "Videojuegos", "Mario Bros", 12, false, "Cabeza XXL", 30)
const funko2 = new Funko(2, "Luigi", "Luigi con una estrella", "Pop! Rides", "Videojuegos", "Mario Bros", 10, false, "Cabeza XXL", 15)
const funko3 = new Funko(3, "Wario", "Wario con una estrella", "Pop!", "Videojuegos", "Mario Bros", 20, true, "Cabeza XXL", 100)
const funko4 = new Funko(4, "Bowser", "Bowser Enfadado", "Pop! Rides", "Videojuegos", "Mario Bros", 11, false, "Cabeza XXL", 60)

describe ("Test de la clase Funko", () => {
  it ("El constructor no debe devolver undefined", () => {
    expect(new Funko(1, "Mario", "Mario Bros con una estrella", "Pop!", "Videojuegos", "Mario Bros", 12, false, "Cabeza XXL", 30)).not.to.be.eql(undefined)
  });

  it ("Prueba del getID", () => {
    expect(funko1.getID).to.be.eql(1)
  });

  it ("Prueba del getNombre", () => {
    expect(funko1.getNombre).to.be.eql("Mario")
  });

  it ("Prueba del getDesc", () => {
    expect(funko1.getDesc).to.be.eql("Mario Bros con una estrella")
  });

  it ("Prueba del getTipo", () => {
    expect(funko1.getTipo).to.be.eql("Pop!")
  });

  it ("Prueba del getGenero", () => {
    expect(funko1.getGenero).to.be.eql("Videojuegos")
  });

  it ("Prueba del getFranquicia", () => {
    expect(funko1.getFranquicia).to.be.eql("Mario Bros")
  });

  it ("Prueba del getNumero", () => {
    expect(funko1.getNumero).to.be.eql(12)
  });

  it ("Prueba del getEsExclusivo", () => {
    expect(funko1.getEsExclusivo).to.be.eql(false)
    expect(funko3.getEsExclusivo).to.be.eql(true)
  });

  it ("Prueba del getCaracteristicas", () => {
    expect(funko1.getCaracteristicas).to.be.eql("Cabeza XXL")
  });

  it ("Prueba del getValor", () => {
    expect(funko1.getValor).to.be.eql(30)
  });

  it ("Prueba del valorMercado", () => {
    expect(funko1.valorMercado()).to.be.eql("Normal")
    expect(funko2.valorMercado()).to.be.eql("Bajo")
    expect(funko3.valorMercado()).to.be.eql("Muy Alto")
    expect(funko4.valorMercado()).to.be.eql("Alto")
  });
});
