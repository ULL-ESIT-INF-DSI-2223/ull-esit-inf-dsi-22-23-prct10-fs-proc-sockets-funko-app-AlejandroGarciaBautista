import net from 'net'
import yargs from "yargs";
import { hideBin } from "yargs/helpers"
import { Funko } from './Funko-App/Funko.js';
import chalk from "chalk";

const log = console.log;

/**
 * Gestión del comando añadir 
 */
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

/**
 * Gestión del comando actualizar 
 */
yargs(hideBin(process.argv))
  .command('actualizar', 'Actualiza la información de un Funko', {
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
    accion: 1,
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

/**
 * Gestión del comando eliminar
 */
yargs(hideBin(process.argv))
  .command('eliminar', 'Elimina un Funko haciendo uso de su ID', {
    usuario: {
      description: "Usuario que va a usar la APP",
      type: "string",
      demandOption: true
    },
    id: {
      description: "ID del Funko",
      type: "number",
      demandOption: true
    }
 }, (argv) => {
  const datos = {
    usuario: argv.usuario,
    id: argv.id,
    accion: 2
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

/**
 * Gestión del comando listar
 */
yargs(hideBin(process.argv))
  .command('listar', 'Muestra todos los Funkos', {
    usuario: {
      description: "Usuario que va a usar la APP",
      type: "string",
      demandOption: true
    }
 }, (argv) => {
  const datos = {
    usuario: argv.usuario,
    accion: 3
  }
  const cliente = net.createConnection({ port: 60300 }, () => {
    cliente.write(JSON.stringify(datos));
    cliente.on("data", (respuesta) => {
      const respuestaServidor = JSON.parse(respuesta.toString());
      const funko = new Funko(
        respuestaServidor.id,
        respuestaServidor.nombre,
        respuestaServidor.desc,
        respuestaServidor.tipo,
        respuestaServidor.genero,
        respuestaServidor.franquicia,
        respuestaServidor.numero,
        respuestaServidor.exclusivo,
        respuestaServidor.caracteristica_esp,
        respuestaServidor.valor
      )
      funko.informacion()
    })
  })
 })
.help().argv;

/**
 * Gestión del comando mostrar
 */
yargs(hideBin(process.argv))
  .command('mostrar', 'Muestra el Funko que se indique con su id', {
    usuario: {
      description: "Usuario que va a usar la APP",
      type: "string",
      demandOption: true
    },
    id: {
      description: "ID del Funko",
      type: "number",
      demandOption: true
    }
 }, (argv) => {
  const datos = {
    usuario: argv.usuario,
    id: argv.id,
    accion: 4
  }
  const cliente = net.createConnection({ port: 60300 }, () => {
    cliente.write(JSON.stringify(datos));
    cliente.on("data", (respuesta) => {
      const respuestaServidor = JSON.parse(respuesta.toString());
      const funko = new Funko(
        respuestaServidor.id,
        respuestaServidor.nombre,
        respuestaServidor.desc,
        respuestaServidor.tipo,
        respuestaServidor.genero,
        respuestaServidor.franquicia,
        respuestaServidor.numero,
        respuestaServidor.exclusivo,
        respuestaServidor.caracteristica_esp,
        respuestaServidor.valor
        )
        funko.informacion()
        cliente.end();
    })
  })
 })
.help().argv;
