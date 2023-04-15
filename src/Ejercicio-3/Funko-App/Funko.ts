import chalk from "chalk";

const log = console.log;

/**
 * Clase para representar a un FunkoPop
 */
export class Funko {
  /**
   * Constructor de un Funko
   * @param id 
   * @param nombre 
   * @param desc 
   * @param tipo 
   * @param genero 
   * @param franquicia 
   * @param numero 
   * @param exclusivo 
   * @param caracteristica_esp 
   * @param valor 
   */
  constructor(
    private id: number,
    private nombre: string,
    private desc: string,
    private tipo: string,
    private genero: string,
    private franquicia: string,
    private numero: number,
    private exclusivo: boolean,
    private caracteristica_esp: string,
    private valor: number
  ) {}

  /**
   * Método getter para obtener el ID
   */
  get getID() {
    return this.id;
  }

  /**
   * Método getter para obtener el nombre
   */
  get getNombre() {
    return this.nombre;
  }

  /**
   * Método getter para obtener la descripción del funko
   */
  get getDesc() {
    return this.desc;
  }

  /**
   * Método getter para obtener el tipo del funko
   */
  get getTipo() {
    return this.tipo;
  }

  /**
   * Método getter para obtener el genero del funko
   */
  get getGenero() {
    return this.genero;
  }

  /**
   * Método getter para obtener la franquicia a la que pertenece
   */
  get getFranquicia() {
    return this.franquicia;
  }

  /**
   * Método getter para obtener el número que tiene dentro de la franquicia
   */
  get getNumero() {
    return this.numero;
  }

  /**
   * Método getter para obtener si es exclusivo o no
   */
  get getEsExclusivo() {
    return this.exclusivo;
  }

  /**
   * Método getter para obtener las caracteristicas especiales del funko
   */
  get getCaracteristicas() {
    return this.caracteristica_esp;
  }

  /**
   * Método getter para obtener el valor de mercado
   */
  get getValor() {
    return this.valor;
  }

  /**
   * Método que nos indica si su valor es:
   *  - Muy Alto si su precio > 70
   *  - Alto si su precio es > 50
   *  - Normal si su precio es >= 25
   *  - Bajo si su precio es < 25
   */
  valorMercado(): string {
    if (this.valor > 70) {
      return "Muy Alto";
    }

    if (this.valor > 50 && this.valor <= 70) {
      return "Alto";
    }

    if (this.valor >= 25 && this.valor <= 50) {
      return "Normal";
    }

    return "Bajo";
  }

  /**
   * Método que nos permite mostrar toda la información sobre el funko
   */
  informacion() {
    log(chalk.blue(`------- Funko nº: ${this.getID} -------`));
    log(`Nombre: ` + chalk.greenBright(`${this.getNombre}`));
    log(`Descripcion: ` + chalk.greenBright(`${this.getDesc}`));
    log(`Tipo: ` + chalk.greenBright(`${this.getTipo}`));
    log(`Genero: ` + chalk.greenBright(`${this.getGenero}`));
    log(`Franquicia: ` + chalk.greenBright(`${this.getFranquicia}`));
    log(`Número: ` + chalk.greenBright(`${this.getNumero}`));
    log(`Exclusivo: ` + chalk.greenBright(`${this.getEsExclusivo}`));
    log(`Caracteristicas especiales: ` + chalk.greenBright(`${this.getCaracteristicas}`));
    
    if (this.valorMercado() === "Muy Alto") {
      log(`Valor de mercado: ` + chalk.red.bold("Muy Alto"));
    }

    if (this.valorMercado() === "Alto") {
      log(`Valor de mercado: ` + chalk.yellow.bold("Alto"));
    }

    if (this.valorMercado() === "Normal") {
      log(`Valor de mercado: ` + chalk.blue.bold("Normal"));
    }

    if (this.valorMercado() === "Bajo") {
      log(`Valor de mercado: ` + chalk.green.bold("Bajo"));
    }
    log(chalk.blue(`---------------------------`));
  }
}
