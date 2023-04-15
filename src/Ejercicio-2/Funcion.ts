import { spawn } from "child_process";
import { access, constants } from "fs";

/**
 * Función que realiza el conteo de palabras o lineas o caracteres o todo de un fichero
 * que se pase por parametros
 * @param fichero: ruta al fichero
 * @param opcion: opcion que se va a ejecutar en el comando wc
 */
export function Contar(fichero: string, opcion: string, callback: (s: string) => void) {
  /* Compruebo si el fichero existe y tengo acceso */
  access(fichero, constants.F_OK, (err) => {
    if (err) { /* En caso de error indico que el fichero no existe */
      callback("El fichero no existe");
      return
    }
    /*
     * Si no hay error ejecuto el comando cat para ver el fichero y uso un 
     * pipe para que la salida de ese comando sea la entrada del comando que 
     * cuente lo que se ha pedido 
     */

    const cat = spawn('cat', [fichero]);
    const wc = spawn('wc', [opcion]);
    
    cat.stdout.pipe(wc.stdin);
    
    let salidaWc = `${opcion}: `;
    wc.stdout.on("data", (datos) => {
      salidaWc += datos;
    });
    
    wc.once("close", () => {
      callback(salidaWc);
    })
  })
}