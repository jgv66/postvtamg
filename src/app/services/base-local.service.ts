import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class BaseLocalService {

  empresa: number;
  user: any = [];
  sectores: any = [];
  zonas: any = [];
  cargos: any = [];
  usuarios: any = [];

  constructor( public storage: Storage ) {
    console.log('<<< BaseLocalProvider >>>');
  }

  initUsuario() {
    return {  codigousr: '',
              empresa: 0,
              nombre: '',
              rut: '',
              creacion: null,
              activo: 'SI',
              clave: '',
              email: '',
              direccion: '',
              ciudad: '',
              telefono: '',
              imagen: '',
              codigorol: '' };
  }
  initTareaEncaDeta() {
    return [{ id_registro: 0,
              empresa: 0,
              codigousr: '',
              fechareg: null,
              obs: '',
              codigorol: '',
              roldescrip: '',
              id_detalle: 0,
              codigolabor: '',
              labdescrip: '',
              sino: false,
              fecha: null,
              cantidad: 0,
              obs_deta: '',
              textosino: '',
              textocantidad: '',
              textofecha: '',
              textoobs: '' }];
  }

  initMensajes() {
    return [{ from: '',
              emailfrom: '',
              to: '',
              emailto: '',
              descripcion: '',
              fecha: null,
              oculto: false,
              eliminado: false,
              leido: false,
              respondido: false,
              fecharesp: null }];
  }

  guardaUltimoUsuario( data ) {
    this.user     = data;
    this.storage.set( 'rncs_ultimo_usuario',  this.user );
  }

  obtenUltimoUsuario() {
    return this.storage.get('rncs_ultimo_usuario')
      .then( usr => {
          this.user = usr == null ? {} : usr;
          return this.user;
      });
  }

  cantidadSectores() { return this.sectores.length; }
  async guardaSectores( data ) {
    await this.storage.set( 'rncs_sectores', data );
    this.sectores = data;
  }

  cantidadCargos() { return this.cargos.length; }
  async guardaCargos( data ) {
    await this.storage.set( 'rncs_cargos', data );
    this.cargos = data;
  }

  cantidadUsuarios() { return this.usuarios.length; }
  async guardaUsuarios( data ) {
    await this.storage.set( 'rncs_usuarios', data );
    this.usuarios = data;
  }

  cantidadZonas() { return this.zonas.length; }
  async guardaZonas( data ) {
    await this.storage.set( 'rncs_zonas', data );
    this.zonas = data;
  }

}
