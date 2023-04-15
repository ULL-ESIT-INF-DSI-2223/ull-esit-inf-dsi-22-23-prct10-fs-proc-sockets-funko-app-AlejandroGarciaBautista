import { Coleccion } from "./Coleccion.js";
import { Funko } from "./Funko.js";
import fs from "fs";
import { access } from "fs";
import { Sesion } from "./Sesion.js";

export const RUTAUSUARIOS = "./src/Ejercicio-3/Funko-App/Users/";

/**
 * Clase para representar a un usuario
 */
export class Usuario implements Sesion {
  private funkos: Coleccion
  private nombre: string

  /**
   * Constructor de la clase Usuario
   * @param nombreUsuario 
   */
  constructor(nombreUsuario: string, callback: (err: Error | null) => void) {
    this.funkos = new Coleccion();
    this.nombre = nombreUsuario;
    access(RUTAUSUARIOS + nombreUsuario, (err) => {
      if (err) {
        fs.mkdir(RUTAUSUARIOS + nombreUsuario, { recursive: false }, (errMkDir) => {
          if (errMkDir) {
            callback(errMkDir)
            return
          }
          callback(null)
        })
      } else {
        fs.readdir(RUTAUSUARIOS + nombreUsuario + '/', (err, ficherosUsuario) => {
          if (err) {
            callback(err);
            return
          }
          
          if (ficherosUsuario.length === 0) {
            callback(null);
            return
          }

          ficherosUsuario.forEach((ficheroActual) => {
            fs.readFile(RUTAUSUARIOS + nombreUsuario + "/" + ficheroActual, (errReadFile, informacion) => {
              if (errReadFile) {
                callback(errReadFile)
                return
              }
              const funkoJSON = JSON.parse(informacion.toString());
              this.funkos.añadir(new Funko(
                funkoJSON.id,
                funkoJSON.nombre,
                funkoJSON.desc,
                funkoJSON.tipo,
                funkoJSON.genero,
                funkoJSON.franquicia,
                funkoJSON.numero,
                funkoJSON.exclusivo,
                funkoJSON.caracteristica_esp,
                funkoJSON.valor
              ));
              callback(null);
            })
          })
        })
      }
    });
  }

  /**
   * Método getter que nos devuelve el nombre del usuario
   */
  get getNombre() {
    return this.nombre;
  }

  /**
   * Método getter que nos devuelve un array con todos los funkos del usuario
   */
  get getFunkos() {
    return this.funkos;
  }

  /**
   * Método que nos permite añadir un Funko a la colección
   * @param nuevoFunko 
   * @returns 
   */
  añadirFunko(nuevoFunko: Funko, callback: (ok: boolean) => void) {
    let resultado: boolean = true;
    
    if (this.funkos.añadir(nuevoFunko)) {
      const funkoInfo = JSON.stringify(nuevoFunko);
      fs.writeFile(RUTAUSUARIOS + this.getNombre + "/" + "funko" + nuevoFunko.getID + ".json", funkoInfo, (err) => {
        if (err) {
          resultado = false;
          return;
        }
        callback(resultado);
      });
    } else {
      callback(false)
    }
  }

  /**
   * Método que nos permite modificar un Funko de la colección
   * @param funko 
   * @returns 
   */
  modificarFunko(funko: Funko, callback: (ok: boolean) => void) {
    if (this.funkos.modificar(funko)) {
      const funkoInfo = JSON.stringify(funko);
      fs.writeFile(RUTAUSUARIOS + this.getNombre + "/" + "funko" + funko.getID + ".json", funkoInfo, (err) => {
        if (err) {
          callback(false);
          return
        }
        callback(true);
      });
    } else {
      callback(false);
    }
  }

  /**
   * Método que nos permite eliminar un Funko de la colección
   * @param idFunko 
   * @returns 
   */
  eliminarFunkoXID(idFunko: number, callback: (ok: boolean) => void) {
    if (this.funkos.eliminar(idFunko)) {
      fs.rm(RUTAUSUARIOS + this.getNombre + "/" + "funko" + idFunko + ".json", (err) => {
        if (err) {
          callback(false);
        } else {
          callback(true);
        }
      })
    } else {
      callback(false)
    }
  }

  /**
   * Método para mostrar por pantalla todos los funkos
   */
  listarTusFunkos() {
    this.funkos.listar();
  }

  /**
   * Método para mostrar un único Funko de la colección 
   * @param idFunko 
   */
  mostrarFunko(idFunko: number) {
    this.funkos.mostrarFunko(idFunko);
  }
}
