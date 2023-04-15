import net from 'net'
import { RUTAUSUARIOS, Usuario } from './Funko-App/Usuario.js';
import { Funko } from './Funko-App/Funko.js';
import { Respuesta } from './Respuesta.js';
import fs from "fs";

/* Flag para evitar errores de que se ejecute la acción más de una vez */
let funcionEjecucion = false;

/* Creo el servidor */
const servidor = net.createServer((conexion) => {
  conexion.on("data", (peticion) => {
    console.log("Recibo una peticion")
    // Guardo los datos recibidos en una variable
    const datosRecibidos = JSON.parse(peticion.toString())
    // Si la accion a realizar necesita que se cree un nuevo funko lo creo ya
    let funko: Funko;
    if (datosRecibidos.accion === 0 || datosRecibidos.accion === 1) {
      funko = new Funko(
        datosRecibidos.id,
        datosRecibidos.nombre,
        datosRecibidos.desc,
        datosRecibidos.tipo,
        datosRecibidos.genero,
        datosRecibidos.franquicia,
        datosRecibidos.numero,
        datosRecibidos.exclusivo,
        datosRecibidos.caracteristica_esp,
        datosRecibidos.valor
      )
    }

    // Creo el usuario con el que se va a trabajar
    const usuario = new Usuario(datosRecibidos.usuario, (err) => {
      if (err) { /* Si hay un error envion una respuesta que contiene el mensaje de error */
        const respuesta: Respuesta = {
          resultado: false,
          mensaje: "Error al momento de iniciar tu usuario"
        }
        conexion.write(JSON.stringify(respuesta));
      } else { /* En el caso de que no se haya producido un error espero 2 segundo y entro en un switch */
        if(!funcionEjecucion) {
          funcionEjecucion = true;
          setTimeout(() => {
            switch (datosRecibidos.accion) {
                case 0: { /* Añadir funko */
                  usuario.añadirFunko(funko, (resultado) => {
                    if (resultado) {
                      const resultadoOk: Respuesta = {
                        resultado: true,
                        mensaje: "Se ha añadido un nuevo funko a tu colección"
                      }
                      conexion.write(JSON.stringify(resultadoOk));
                    } else {
                      const resultadoNotOk: Respuesta = {
                        resultado: false,
                        mensaje: "No se ha añadido el funko a tu colección"
                      }
                      conexion.write(JSON.stringify(resultadoNotOk));
                    }
                  })
                  break;
                }
                case 1: { /* Modificar funko */
                  usuario.modificarFunko(funko, (resultado) => {
                    if (resultado) {
                      const respuesta: Respuesta = {
                        resultado: true,
                        mensaje: `Funko modificado correctamente en la colección de ${usuario.getNombre}`
                      }
                      conexion.write(JSON.stringify(respuesta));
                    } else {
                      const respuesta: Respuesta = {
                        resultado: false,
                        mensaje: `Error en el proceso de modificación del funko, posiblemente el funko no exista en la colección`
                      }
                      conexion.write(JSON.stringify(respuesta));
                    }
                  })
                  break;
                }
                case 2: { /* Eliminar funko */
                  usuario.eliminarFunkoXID(datosRecibidos.id, (resultado) => {
                    let respuesta;
                    if (resultado) {
                      respuesta = {
                        resultado: true,
                        mensaje: "Funko eliminado correctamente en tu colección"
                      }
                    } else {
                      respuesta = {
                        resultado: false,
                        mensaje: "Error en el proceso de eliminación del funko, posiblemente el funko no exista en la colección"
                      }
                    }
                    conexion.write(JSON.stringify(respuesta));
                  })
                  break;
                }
                case 3: { /* Mostrar funkos */
                  fs.readdir(RUTAUSUARIOS + usuario.getNombre + "/", (err, ficheros) => {
                    if (err) {
                      const respuesta: Respuesta = {
                        resultado: false,
                        mensaje: "Error al leer los Funkos"
                      }
                      conexion.write(JSON.stringify(respuesta));
                    }

                    if (ficheros.length === 0) {
                      const respuesta: Respuesta = {
                        resultado: false,
                        mensaje: "No hay Funkos"
                      }
                      conexion.write(JSON.stringify(respuesta));
                    }

                    ficheros.forEach((ficheroActual) => {
                      fs.readFile(RUTAUSUARIOS + usuario.getNombre + "/" + ficheroActual, (err, info) => {
                        if (err) {
                          const respuesta: Respuesta = {
                            resultado: false,
                            mensaje: "Error al leer el Funko"
                          }
                          conexion.write(JSON.stringify(respuesta));
                        }
                        
                        conexion.write(info);
                      })
                    })
                  })
                  break;
                }
                case 4: { /* Mostrar funko */
                  fs.readdir(RUTAUSUARIOS + usuario.getNombre + "/", (err, ficheros) => {
                    if (err) {
                      const respuesta: Respuesta = {
                        resultado: false,
                        mensaje: "Error al leer los Funkos"
                      }
                      conexion.write(JSON.stringify(respuesta));
                    }

                    if (ficheros.length === 0) {
                      const respuesta: Respuesta = {
                        resultado: false,
                        mensaje: "No hay Funkos"
                      }
                      conexion.write(JSON.stringify(respuesta));
                    }

                    ficheros.forEach((ficheroActual) => {
                      fs.readFile(RUTAUSUARIOS + usuario.getNombre + "/" + ficheroActual, (err, info) => {
                        if (err) {
                          const respuesta: Respuesta = {
                            resultado: false,
                            mensaje: "Error al leer el Funko"
                          }
                          conexion.write(JSON.stringify(respuesta));
                        }
                        const funkoJSON = JSON.parse(info.toString())
                        if (funkoJSON.id === datosRecibidos.id) {
                          conexion.write(info);
                        }
                      })
                    })
                  })
                  
                  break;
                }
              }
              funcionEjecucion = false;
          }, 2000)
        }
      }
    });
  })
});

servidor.listen(60300, () => {
  console.log("Servidor escuchando en el puerto 60300")
})
