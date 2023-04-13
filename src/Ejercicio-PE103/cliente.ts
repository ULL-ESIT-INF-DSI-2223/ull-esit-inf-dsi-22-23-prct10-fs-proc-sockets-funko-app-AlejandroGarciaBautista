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
