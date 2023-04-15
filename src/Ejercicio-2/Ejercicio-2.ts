import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { Contar } from "./Funcion.js";

/**
 * Leemos el comando contar en el que se tiene que indicar los siguientes parámetros:
 *  - fichero: ruta al fichero
 *  - opcion: que se quiere contar [Lineas | Caracteres | Palabras]
 */
yargs(hideBin(process.argv))
.command('contar', 'Cuenta el nº de lineas, palabras o caracteres de un fichero', {
  fichero: {
    description: "Ruta al fichero que quieres contar las palabras, lineas o caracteres",
    type: "string",
    demandOption: true
  },
  opcion: {
    description: "Opción que quieres usar: [Lineas | Palabras | Caracteres]",
    type: "string",
    demandOption: true
  }
}, (argv) => {
  /* Compruebo que la opción pasada sea correcta */
  if (argv.opcion === "Lineas" || argv.opcion === "Palabras" || argv.opcion === "Caracteres") {
    if (argv.opcion === "Lineas") {
      Contar(argv.fichero, "-l", (out: string) => {
        console.log(out);
      });
    }

    if (argv.opcion === "Palabras") {
      Contar(argv.fichero, "-w", (out: string) => {
        console.log(out);
      });
    }

    if (argv.opcion === "Caracteres") {
      Contar(argv.fichero, "-c", (out: string) => {
        console.log(out);
      });
    }
  } else { /* Si no es correcta indico el error */
    console.log("Error opción no valida")
  }
  
}).help().argv;

/**
 * Leemos el comando todo en el que se tiene que indicar el siguiente parámetro:
 *  - fichero: ruta al fichero
 * En este caso no hace falta indicar opción porque se van a ejecutar las tres opciones disponibles
 * en el comando anterior
 */
yargs(hideBin(process.argv))
.command("todo", "Hace el recuento de palabras, caracteres y lineas", {
  fichero: {
    description: "Ruta al fichero que quieres contar las palabras, lineas o caracteres",
    type: "string",
    demandOption: true
  }
}, (argv) => {
  Contar(argv.fichero, "-l", (out: string) => {
    console.log(out);
  })

  Contar(argv.fichero, "-w", (out: string) => {
    console.log(out);
  })
  Contar(argv.fichero, "-c", (out: string) => {
    console.log(out);
  })
}).help().argv;
