import { Funko } from "./Funko.js";
import chalk from "chalk";

const log = console.log;

/**
 * Clase para representar una colección de funkos
 */
export class Coleccion {
  private funkos: Funko[]
  /**
   * Constructor de la colección de funkos, inicializa un array vacio de Funkos
   */
  constructor() {
    this.funkos = [];
  }

  /**
   * Nos indica cuantos funkos tenemos en la colección
   */
  get getTamColeccion() {
    return this.funkos.length;
  }

  /**
   * Método que nos permite añadir un funko a la colección
   * @param funko 
   * @returns 
   */
  añadir(funko: Funko): boolean {
    let seAñade: boolean = true;
    this.funkos.forEach((funkoActual) => {
      if (funkoActual.getID === funko.getID) {
        seAñade = false;
      }
    })

    if (seAñade) {
      this.funkos.push(funko);  
    }
    return seAñade;
  }

  /**
   * Método que nos permite modificar un funko, es igual a añadir
   * pero comprueba que el funko que se modifica existe
   * @param funko 
   * @returns 
   */
  modificar(funko: Funko): boolean {
    let seModifica: boolean = false;
    let indice: number = 0;
    this.funkos.forEach((funkoActual) => {
      if (funkoActual.getID === funko.getID) {
        this.funkos[indice] = funko;
        seModifica = true;
      }
      indice++;
    })
    return seModifica;
  }

  /**
   * Método que nos permite eliminar el Funko indicando su ID
   * @param idFunko 
   * @returns 
   */
  eliminar(idFunko: number): boolean {
    let seElimina = false;
    let indice: number = 0;
    this.funkos.forEach((funkoActual) => {
      if (funkoActual.getID === idFunko) {
        this.funkos.splice(indice, 1);
        seElimina = true;
      }
      indice++;
    })
    return seElimina;
  }

  /**
   * Método que nos permite mostrar todos los funkos que tenemos en la
   * colección
   */
  listar() {
    if (this.getTamColeccion === 0) {
      log(chalk.green("Tu colección esta vacia"))
    } else {
      this.funkos.forEach((funkoActual) => {
        funkoActual.informacion();
      })
    }
  }

  /**
   * Método para mostrar un único Funko
   * @param idFunko 
   */
  mostrarFunko(idFunko: number): boolean {
    this.funkos.forEach((funkoActual) => {
      if (funkoActual.getID === idFunko) {
        funkoActual.informacion();
        return true;
      }
    })
    log(chalk.red("El Funko no existe"));
    return false;
  }
}