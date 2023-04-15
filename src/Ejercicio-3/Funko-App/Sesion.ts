import { Funko } from "./Funko.js";

/**
 * Interfaz que sera implementada en Usuario con los métodos
 * que debe tener para poder llevar a cabo las acciones que se nos piden
 */
export interface Sesion {
  añadirFunko(nuevoFunko: Funko, callback: (ok: boolean) => void): void;
  modificarFunko(funko: Funko, callback: (ok: boolean) => void): void;
  eliminarFunkoXID(idFunko: number, callback: (ok: boolean) => void): void;
  listarTusFunkos(): void;
  mostrarFunko(idFunko: number): void;
}