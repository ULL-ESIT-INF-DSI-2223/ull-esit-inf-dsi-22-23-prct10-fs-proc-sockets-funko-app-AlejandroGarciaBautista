import 'mocha'
import { expect } from 'chai'
import { Funko } from "../../../src/Ejercicio-3/Funko-App/Funko.js"
import { Usuario } from "../../../src/Ejercicio-3/Funko-App/Usuario.js"
import { Coleccion } from "../../../src/Ejercicio-3/Funko-App/Coleccion.js"

const funko1 = new Funko(1, "Mario", "Mario Bros con una estrella", "Pop!", "Videojuegos", "Mario Bros", 12, false, "Cabeza XXL", 30)
const funko1_2 = new Funko(1, "Mario", "Mario Bros con una estrella", "Pop!", "Videojuegos", "Mario Bros", 22, false, "Cabeza XXL", 30)
const funko2 = new Funko(2, "Luigi", "Luigi con una estrella", "Pop! Rides", "Videojuegos", "Mario Bros", 10, false, "Cabeza XXL", 15)

describe("Tests de la clase Usuario", () => {
  it ("El constructor debe devolver null", () => {
    new Usuario("test", (resultado) => {
      expect(resultado).to.be.eql(null);
    })
  });

  // it ("El constructor debe devolver null", () => {
  //   new Usuario("test2", (resultado) => {
  //     expect(resultado).to.be.eql(null);
  //   })
  // });

  it ("Prueba del getNombre", () => {
    const usuario = new Usuario("testUsuario", (resultado) => {
      if (resultado === null) {
        expect(usuario.getNombre).to.be.eql("testUsuario")
      }
    })
  });

  it ("Prueba de getFunkos", () => {
    const usuario = new Usuario("testUsuario", (resultado) => {
      if (resultado === null) {
        expect(usuario.getFunkos).to.deep.equal(new Coleccion())
      }
    })
  });

  it ("Prueba de añadirFunko", () => {
    const usuario = new Usuario("testUsuario", (resultado) => {
      if (resultado === null) {
        usuario.añadirFunko(funko1, (ok) => {
          expect(ok).to.be.eql(true);
        })
        
        usuario.añadirFunko(funko1, (ok) => {
          expect(ok).to.be.eql(false);
        })

        const coleccion = new Coleccion();
        coleccion.añadir(funko1);

        expect(usuario.getFunkos).to.be.eql(coleccion)
      }
    })
  });

  it ("Prueba de modificar un funko", () => {
    const usuario = new Usuario("testUsuario", (resultado) => {
      if (resultado === null) {
        usuario.añadirFunko(funko1, (err) => {
          if (err === null) {
            usuario.modificarFunko(funko1_2, (ok) => {
              expect(ok).to.be.eql(true);
            })
            
            usuario.modificarFunko(funko2, (ok) => {
              expect(ok).to.be.eql(false);
            })
    
            const coleccion = new Coleccion();
            coleccion.añadir(funko1);
    
            expect(usuario.getFunkos).to.be.eql(coleccion)
          }
        })
      }
    })
  });

  it ("Prueba eliminarFunko", () => {
    const usuario = new Usuario("testUsuario", (resultado) => {
      if (resultado === null) {
        usuario.eliminarFunkoXID(2, (ok) => {
          expect(ok).to.be.eql(false);
        })
        
        usuario.eliminarFunkoXID(1, (ok) => {
          expect(ok).to.be.eql(true);
        })

        const coleccion = new Coleccion();

        expect(usuario.getFunkos).to.be.eql(coleccion)
      }
    })
  })
});