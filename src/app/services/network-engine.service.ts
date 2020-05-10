import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../model/modelos.model';
import { environment } from '../../environments/environment';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class NetworkEngineService {

  constructor( public http: HttpClient ) {
    console.log('<<< NetworkengineProvider >>>');
  }

  login( rutcorreo: string, clave: string ) {
    const accion = '/login';
    const body   = { rutcorreo, clave };
    return this.http.post( url + accion, body );
  }

  misTareas( data ) {
    const accion = '/mistareas';
    const body   = data;
    return this.http.post( url + accion, body );
  }

  obtenTablas( tabla ) {
    const accion = '/obtentablas';
    const body   = { tabla };
    return this.http.post( url + accion, body );
  }

  consultaRegistro( data ) {
    const accion = '/consultaid';
    const body   = data;
    return this.http.post( url + accion, body );
  }

  cerrarReg( data, tiporeg, imagenes ) {
    const accion = '/cerrarid';
    const body   = { data, imagenes, tiporeg };
    return this.http.post( url + accion, body );
  }

  getImages( id ) {
    const accion = '/getimages';
    const body   = { id };
    return this.http.post( url + accion, body );
  }

  traeUnaLista( cTabla: string, cOrderBy?: string, nTop?: number, cWhere?: string, cSelect?: string ) {
    const accion = '/tabla';
    const body   = { tabla: cTabla, orderby: cOrderBy, top: nTop, where: cWhere, select: cSelect };
    return this.http.post( url + accion, body );
  }

  crearUsuario( usuario: Usuario ) {
    const accion = '/insusr';
    const body   = usuario;
    return this.http.post( url + accion, body );
  }

  traeUnSP( cSP: string, nID: number, cUsuario?: string, abiertaOcerrada?: string ) {
    const accion = '/proalma';
    const body   = { sp: cSP, id: nID, usuario: cUsuario, cerrada: abiertaOcerrada };
    return this.http.post( url + accion, body );
  }

  crearNuevoReg( datos, tiporeg, imagenes ) {
    // console.log('a grabar: ', { data: datos, imagenes } );
    const accion = '/nuevatarea';
    const body   = { data: datos, imagenes, tiporeg };
    return this.http.post( url + accion, body );
  }

  sendMail( rutocorreo: string ) {
    const accion = '/sendmail';
    const body   = { rutocorreo };
    return this.http.post( url + accion, body );
  }

  enviarMensajeAlServidor( nEmpresa: number, pUsuario: string, pCarrito: string ) {
    // console.log(nEmpresa, pUsuario, pCarrito);
    const accion = '/mensaje';
    const body   = { empresa: nEmpresa, usuario: pUsuario, transaccion: pCarrito };
    return this.http.post( url + accion, body );
  }

  eliminaMensajeDelServidor( idpedido: number ) {
    const accion = '/xmensajex';
    const body   = { id_pedido: idpedido };
    return this.http.post( url + accion, body );
  }

  guardaIDLabor( labor: any ) {
    const accion = '/updlabor';
    const body   = labor;
    return this.http.post( url + accion, body );
  }

}
