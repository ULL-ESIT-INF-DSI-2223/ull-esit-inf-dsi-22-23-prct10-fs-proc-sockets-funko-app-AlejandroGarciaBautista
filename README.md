## Autor: Alejandro García Bautista

## Correo Electrónico: alu0101387604@ull.edu.es

# Tareas previas
1. [x] Aceptar la tarea
2. [x] Familiarizarse con la clase EventEmitter del módulo Events de Node.js
3. [x] Familiarizarse con el módulo fs de Node.js, en concreto, con su APi asíncrona basada en el uso de callback
4. [x] Familiarizarse con el módulo child_process de Node.js, en concreto, con su API de creación de procesos asíncrona
5. [x] Familiarizarse con el módulo net de Node.js
6. [x] Repasar yargs y chalk que volverán a ser necesarios en esta práctica

# Introducción a la Práctica
En esta práctica número 10 se plantean distintos ejercicios para trabajar con la API asíncrona de Node.js, así como trabajar con los sockets para crear clientes y servidores, la creación de procesos además de los conocimientos ya adquiridos anteriormente en la asignatura para desarrollar nuevos programas para esta semana. En resumen esta semana se han pedido 3 ejercicios para que fueran realizados de manera autónoma que han consistido en:
  
  1. Repasar y entender la traza de ejecución de la pila de llamadas, registro de eventos de la API, cola de manejadores de Node.js.
  2. Creación de procesos para ejecutar comandos Unix.
  3. Creación de sockets y el uso del módulo fs de la API asíncrona basado en callbacks.

También se ha realizado un único ejercicio de evaluación que ha trabajado mucho con los puntos 2 y 3 anteriormente nombrados.

# Ejercicios de la práctica
## Ejercicio 1
Antes de empezar la traza tener en cuenta lo siguiente: los console.log de dentro del callback de **access** se van a imprimir nada más iniciar el programa principal debido a que son llamadas ***sincronas***.

La traza de la ejecución paso a paso es la siguiente:

1. Se hace uso de la función **access** del módulo **fs** para comprobar si el archivo *helloworld.txt* existe. 

2. El manejador de la función **access** pasa a la API register.

3. Se agrega la llamada a la función **access** a la pila de llamadas cuando esta esta disponible, se ejecuta el callback. Si el archivo no existe, se imprime un mensaje en la consola indicando que el archivo no existe. Si el archivo existe, se inicia el estado de control de cambios sobre el archivo.

4. Si el archivo existe, se llama a la función **watch** del módulo **fs** para vigilar el archivo. 

5. Se agrega la llamada a la función **watch** a la pila de llamadas. La función **watch** esta pendiente de los cambios que se realicen en el archivo *helloworld.txt*.

6. Se agrega un manejador de eventos a la cola de manejadores para el evento **change** del objeto watcher. El manejador unicamente indica si se han realizado cambios en el fichero.

7. Se retira la llamada a la función **watch** de la pila de llamadas.

8. El programa se mantiene en ejecución, esperando que se produzcan cambios en el archivo.

9. Si se detecta un cambio en el archivo, se llama al manejador de eventos que se agregó en el paso 6.

10. Mientras el programa esta en ejecución se repetirán los pasos indicados desde el paso 6.

**¿Qué hace la función access? ¿Para qué sirve el objeto constants?**
**Access** prueba que un proceso tiene acceso a un archivo, en esta llamada se usan de manera opcional los objetos constants que son constantes que nos permiten realizar ciertas comprobaciones, algunos ejemplos son:
  - F_OK: Nos indica si el archivo esta visible para el proceso, útil para saber si el archivo existe.
  - R_OK: Nos indica si se puede leer por el proceso actual.
  - W_OK: Nos indica si se puede escribir por el proceso actual.
  - X_OK: Nos indica si se puede ejecutar por el proceso actual.

## Ejercicio 2
En el segundo ejercicio se nos pedía que se desarrollara una aplicación que proporcione información sobre un fichero, se pide que se pueda obtener información sobre el número de lineas, palabras o caracteres de un fichero asi como añadir una opción para obtener todos esos datos de una vez. Ejemplos de ejecución:

```bash
node dist/Ejercicio-2/Ejercicio-2.js contar --fichero src/Ejercicio-1/helloworld.txt --opcion Palabras
node dist/Ejercicio-2/Ejercicio-2.js contar --fichero src/Ejercicio-1/helloworld.txt --opcion Lineas
node dist/Ejercicio-2/Ejercicio-2.js contar --fichero src/Ejercicio-1/helloworld.txt --opcion Caracteres
node dist/Ejercicio-2/Ejercicio-2.js todo --fichero src/Ejercicio-1/helloworld.txt 
```

El programa se divide en dos ficheros que son Ejercicio-2.ts y Funcion.ts, en el primer fichero contamos con la lectura de la linea de comandos mediante yargs y llamada a la función principal del programa.

En el segundo fichero contamos con una función que recibe tres parámetros que son:
  - La ruta al fichero
  - La opción
  - Un callback en el que se le va a pasar una string

```ts
function Contar(fichero: string, opcion: string, callback: (s: string) => void) {
  access(fichero, constants.F_OK, (err) => { // Se comprueba que se tiene acceso al fichero
    if (err) { 
      callback("El fichero no existe"); // Se devuelve en el callback el mensaje se error
      return
    }

    // Con spawn generamos los dos comandos
    const cat = spawn('cat', [fichero]);
    const wc = spawn('wc', [opcion]);
    
    // Redirijo la salida de cat a wc
    cat.stdout.pipe(wc.stdin);
    
    // Guardo en una variable la salida del fichero
    let salidaWc = `${opcion}: `;
    wc.stdout.on("data", (datos) => {
      salidaWc += datos;
    });
    
    // Devuelvo en el callback el resultado de la ejecución
    wc.once("close", () => {
      callback(salidaWc);
    })
  })
}
```

## Ejercicio 3
En este tercer ejercicio se nos ha pedido que partiendo del programa realizado para la semana anterior de la gestión de los FunkoPops realizar una modificación para realizar un sistema cliente-servidor, en donde desde el cliente se ejecute como la semana pasada y toda la información sea enviada al servidor para que procese y haga toda la gestión de los JSON. Principalmente para diseñar el cliente he usado como plantilla, ya que necesita ser gestionado por yargs, el programa principal de la práctica 9 realizando unos pequeños cambios, el cliente para la opción de añadir ha quedado de la siguiente manera, las demás opciones son muy parecidas a esta pero ajustando los argumentos que hacen falta para cada opción que se permite en el programa:

```ts
import net from 'net'
import yargs from "yargs";
import { hideBin } from "yargs/helpers"
import { Funko } from './Funko-App/Funko.js';
import chalk from "chalk";

const log = console.log;

yargs(hideBin(process.argv))
  .command('añadir', 'Añade un funko a la coleccion', {
    usuario: {
      description: "Usuario que va a usar la APP",
      type: "string",
      demandOption: true
    },
    id: {
      description: "ID del Funko en tu collecion",
      type: "number",
      demandOption: true
    },
    nombre: {
      description: "Nombre del Funko",
      type: "string",
      demandOption: true
    },
    desc: {
      description: "Descripcion corta sobre el Funko",
      type: "string",
      demandOption: true
    },
    tipo: {
      description: "Tipo de Funko: Pop!, Pop! Rides, Vynil Soda, Vynil Gold, ...",
      type: "string",
      demandOption: true
    },
    genero: {
      description: "Genero del Funko: Animación, Películas y TV, Videojuegos, Deportes, Música o Ánime, ...",
      type: "string",
      demandOption: true
    },
    franquicia: {
      description: "Franquicia a la que pertenece el funko",
      type: "string",
      demandOption: true
    },
    numero: {
      description: "Número del Funko dentro de la colección de la franquicia",
      type: "number",
      demandOption: true
    },
    exclusivo: {
      description: "Indica si es exclusivo",
      type: "boolean",
      demandOption: true
    },
    caracteristica_esp: {
      description: "Caracteristicas especiales del Funko, que lo diferencien de los demas",
      type: "string",
      demandOption: true
    },
    valor: {
      description: "Valor en el mercado",
      type: "number",
      demandOption: true
    }
 }, (argv) => {

  const datos = {
    usuario: argv.usuario,
    id: argv.id,
    nombre: argv.nombre,
    desc: argv.desc,
    tipo: argv.tipo,
    genero: argv.genero,
    franquicia: argv.franquicia,
    numero: argv.numero,
    exclusivo: argv.exclusivo,
    caractetistica_esp: argv.caracteristica_esp,
    valor: argv.valor,
    accion: 0,
  }
  const cliente = net.createConnection({ port: 60300 }, () => {
    cliente.write(JSON.stringify(datos));

    cliente.on("data", (respuesta) => {
      const respuestaServidor = JSON.parse(respuesta.toString());
      if (respuestaServidor.resultado) {
        log(chalk.green(respuestaServidor.mensaje));
        cliente.end();
      } else {
        log(chalk.red(respuestaServidor.mensaje));
        cliente.end();
      }
    })
  })
 })
.help().argv;

```

En el servidor he hecho uso de las clases Usuario y Funko para poder aprovechar todo lo que realice la semana pasada, sobre todo la clase Usuario ya que era esta la que realizaba el manejo de los ficheros JSON de nuestro directorio de usuarios, entonces en el servidor solo tenia que leer la información enviada por el cliente y hacer llamadas a los métodos de Usuario:

```ts
let funcionEjecucion = false;

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
                case 0: {
                  usuario.añadirFunko(funko, (resultado) => {
                    if (resultado) {
                      const resultadoOk: Respuesta = {
                        resultado: true,
                        mensaje: "Se ha añadido un nuevo funko a tu coleccion"
                      }
                      conexion.write(JSON.stringify(resultadoOk));
                    } else {
                      const resultadoNotOk: Respuesta = {
                        resultado: false,
                        mensaje: "No se ha añadido un nuevo funko a tu coleccion"
                      }
                      conexion.write(JSON.stringify(resultadoNotOk));
                    }
                  })
                  break;
                }
                case 1: {
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
                case 2: {
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
                case 3: {
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
                case 4: {
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
```

Ademas como se indica que se deben usar métodos asíncronos del modulo **fs** de la API de Node.js he tenido que realizar ciertos cambios en la clase Usuario, los cambios ha sido principalmente en los métodos del Constructor, de los método añadir, modificar y eliminar un funko, estos métodos han quedado de la siguiente manera: 

**Constructor**:

```ts
constructor(nombreUsuario: string, callback: (err?: Error | null) => void) {
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
```

**Añadir**:

```ts
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
```

**Modificar**:

```ts
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
```

**Eliminar**:

```ts
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
```

## Ejercicio de Evaluación PE 103
El ejercicio planteado en la sesión de laboratorio era el siguiente, diseñar un cliente y un servidor en donde por linea de comandos se debe pasar un comando *Unix* y que este sea enviado mediante un JSON al servidor y este lo procese y envíe el resultado del comando, ya sea erróneo o no al, cliente usando nuevamente un JSON. En mi caso durante la sesión de laboratorio me dio tiempo para realizar un cliente-servidor funcional menos por un pequeño detalle, que es el recibir la información por partes y juntarla en el cliente usando la herencia del EventEmiter, que seria usar como plantilla el ejemplo que se encuentra en los apuntes. 

**El servidor**: Aunque para el ejercicio 2 he usado el método ***spawn*** para los comando, en la sesión de laboratorio use el ***exec*** ya que me pareció más sencillo de usar sobre todo porque en el callback puedo tener el error, la salida estándar y la salida del mensaje de error muy útil para enviar el mensaje de error al cliente.

```ts
import net from 'net';
import { exec } from 'child_process';

/** Creo el servidor y espera a que se le realice una conexión */
const servidor = net.createServer((conexion) => {
  conexion.on('data', (data) => {
    const datosRecibidos = JSON.parse(data.toString());
    const comando = datosRecibidos.comando;
    const argumentos = datosRecibidos.argumentos;

    exec(`${comando} ${argumentos}`, (error, stdout, stderr) => { 
      /* https://nodejs.org/api/child_process.html#child_processexeccommand-options-callback Referencia del Exec */
      const respuesta = {
        error: error,
        salida: stdout,
        salidaError: stderr
      }
      conexion.write(JSON.stringify(respuesta));
    })
  });
});

/** Mensaje en el servidor mientras espera una conexión */
servidor.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
```

**El cliente**:

```ts
import net from 'net'

/** Leo todo el argumento pasado por la linea de comandos */
const argumentos = process.argv.slice(2);

const comando = {
  comando: argumentos[0],
  argumentos: argumentos.slice(1).join(' ')
};

/** Creo el cliente y envio en formato JSON todo el argumento */
const cliente = net.createConnection({ port: 3000 }, () => {
  console.log(`Conectado al servidor en el puerto 3000`);
  cliente.write(JSON.stringify(comando));

  /** Cuando recibe datos se parsean el JSON y en caso de error se muestra el mensaje de error
   *  en caso contrario se muestra la salida del comando
   */
  cliente.on("data", (respuesta) => {
    const respuestaServidor = JSON.parse(respuesta.toString());

    if (respuestaServidor.error != null) { /** Hay error */
      console.log(respuestaServidor.salidaError)
    } else { /** No hay error */
      console.log(respuestaServidor.salida)
    }
    cliente.end();
  })
});

/** Mensaje que se muestra en el cliente cuando finaliza la conexión */
cliente.on("end", () => {
  console.log("Se ha terminado la conexión")
})
```

# Problemas a lo largo de la práctica
A lo largo de la práctica donde principalmente han surgido problemas, ha sido en el ejercicio 3, debido a que el cambio al código asíncrono me ha generado ciertos problemas, como puede ser que en un principio en el momento de si se tenia que crear una carpeta para un nuevo usuario y ademas la opción de trabajo era añadir un funko pues esto daba error, la solución principal a este problema ha sido añadir un **Timeout** de 2 segundos para que terminara de ejecutarse primero el constructor y así solucionar el problema.

Ademas otros problemas que me han surgido a lo largo de la realización de ejercicio 3 ha sido lo de finalizar la conexión y he tenido que forzar a que se use el **end** en el cliente para finalizar la conexión del cliente con el servidor debido a que no he conseguido implementar lo que se nombraba en el guion que es lo de emitir un **request**.

Ademas en el momentos de realizar los test de la clase Usuario que una vez realizada la clase hay partes que no puedo probar debido a que no se como forzar esos errores. 

# Conclusión
En conclusión en esta práctica se han puesto en conocimiento nuevos aspectos del lenguaje de programación, así como hacer uso de los conocimientos previos adquiridos. Ademas he repasado y profundizado en el uso de los callbacks, aspecto que hasta este momento siempre me han generado cierta duda de como usarlos. 
Aunque el ejercicio 3 no haya podido ser finalizado al 100%, he intentado que sea lo más estable posible y aproximado a lo que se pedía.

# Bibliografía
[Apuntes de clase parte 1](https://ull-esit-inf-dsi-2223.github.io/typescript-theory/)
[Apuntes de clase parte 2](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/)
[JSON](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON)
[API de Node de fs](https://nodejs.org/dist/latest-v18.x/docs/api/fs.html)
[API Asíncrona de Node y fs](https://nodejs.org/docs/latest-v19.x/api/fs.html#callback-api)
