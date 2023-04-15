import 'mocha'
import { expect } from 'chai'
import { Contar } from '../../src/Ejercicio-2/Funcion.js'

const fichero: string = "./tests/Ejercicio-2/testText.txt";
const ficheroErroneo: string = "./tests/Ejercicio-2/prueba.txt";

describe ("Tests de la función Contar", () => {
  it ("Tests de de la función contar lineas con un fichero que existe", () => {
    Contar(fichero, "-l", (out: string) => {
      expect(out).to.equal("-l: 0\n")
    })
  })

  it ("Tests de de la función contar palabras con un fichero que existe", () => {
    Contar(fichero, "-w", (out: string) => {
      expect(out).to.equal("-w: 7\n")
    })
  })

  it ("Tests de de la función contar caracteres con un fichero que existe", () => {
    Contar(fichero, "-c", (out: string) => {
      expect(out).to.equal("-c: 36\n")
    })
  })

  it ("Tests de de la función contar lineas con un fichero que no existe", () => {
    Contar(ficheroErroneo, "-l", (out: string) => {
      expect(out).to.equal("El fichero no existe")
    })
  })
})
