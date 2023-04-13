import net from 'net';
import { exec } from 'child_process';

/** Creo el servidor y espera a que se le realice una conexión */
const servidor = net.createServer((conexion) => {
  conexion.on('data', (data) => {
    const datosRecibidos = JSON.parse(data.toString());
    const comando = datosRecibidos.comando;
    const argumentos = datosRecibidos.argumentos;

    exec(`${comando} ${argumentos}`, (error, stdout, stderr) => { /** https://nodejs.org/api/child_process.html#child_processexeccommand-options-callback */
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
