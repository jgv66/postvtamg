import { Injectable, OnInit } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { NetworkEngineService } from './network-engine.service';
import { BaseLocalService } from './base-local.service';
import { Usuario, Mensajes } from '../../model/modelos.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService implements OnInit {

  loader: any;
  usuario: Usuario;
  copiaPendientes: any;
  pendientes: number;
  recibidos: number;
  mensajes: Array<Mensajes>;
  misMensajes: number;

  constructor(  public netWork: NetworkEngineService,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public alertCtrl: AlertController,
                public camera: Camera,
                public baseLocal: BaseLocalService ) {
    console.log('<<< FuncionesProvider >>>');
    this.inicializaTodo();
  }

  ngOnInit() {
  }

  inicializaTodo() {
    this.usuario         = this.baseLocal.initUsuario();
    this.copiaPendientes = this.baseLocal.initTareaEncaDeta();
    this.pendientes      = 0;
    this.recibidos       = 0;
    this.mensajes        = this.baseLocal.initMensajes();
    this.misMensajes     = 0;
  }

  descargaEspera() {
    this.loader.dismiss();
  }

  async msgAlert( titulo, texto ) {
    const alert = await this.alertCtrl.create({
      // header: titulo,
      mode: 'md',
      message: texto,
      buttons: ['OK']
    });
    await alert.present();
  }

  async muestraySale( cTexto, segundos, posicion?, color? ) {
    const toast = await this.toastCtrl.create({
      message: cTexto,
      duration: 1500 * segundos,
      position: posicion || 'middle',
      color: ( color ) ? color : 'danger'
    });
    toast.present();
  }

  cuantosMensajesTengo() {
    if ( this.listaMensajesVacia() ) {
        this.misMensajes = 0;
    } else {
        this.misMensajes = this.mensajes.length;
    }
    return this.misMensajes;
  }

  listaMensajesVacia() {
    return ( this.mensajes.length === 1 && this.mensajes[0].from === '' );
  }

  eliminarMensaje( idmensaje ) {
    // this.netWork.eliminaMensajeDelServidor(id_mensaje);
  }

  cuantosTengo( releer: number, enviados ) {
    if ( releer === 1  ) {
      this.netWork.misTareas( { usuario:  this.baseLocal.user.usuario,
                                empresa:  this.baseLocal.user.empresa,
                                enviados,
                                contar:   'contar' } )
          .subscribe( data => {
                if ( enviados === 'enviados')  {
                  this.pendientes = this.revisarData( data );
                  return this.pendientes;
                } else {
                  this.recibidos = this.revisarData( data );
                  return this.recibidos;
                }
              }, err  => {
                  this.msgAlert( 'ATENCION', err );
                  if ( enviados === 'enviados') {
                    this.pendientes = 0;
                    return this.pendientes;
                  } else {
                    this.recibidos = 0;
                    return this.recibidos;
                  }
                  }
          );
        } else {
        return ( enviados === 'enviados' ) ? this.pendientes : this.recibidos;
    }
  }

  revisarData( data ) {
    const rs    = data.datos[0],
          largo = data.datos[0].length;
    if ( rs === undefined || largo === 0 ) {
      return 0;
    } else {
      return rs.cuantos;
    }
  }

  textoSaludo() {
    const dia   = new Date();
    if ( dia.getHours() >= 8  && dia.getHours() < 12 ) {
      return 'buenos días ';
    } else if ( dia.getHours() >= 12 && dia.getHours() < 19 ) {
      return 'buenas tardes ';
    } else {
      return 'buenas noches '; }
  }

  async cargaEspera( milisegundos? ) {
    this.loader = await this.loadingCtrl.create({
      duration: ( milisegundos != null && milisegundos !== undefined ? milisegundos : 3000 )
      });
    await this.loader.present();
  }

  hideTabs() {
    let estilo = '';
    // tslint:disable-next-line: no-angle-bracket-type-assertion
    const elem   = <HTMLElement> document.querySelector('.tabbar');
    if (elem != null) {
      estilo             = elem.style.display;  // se guarda
      elem.style.display = 'none';              // se anula
    }
    return estilo;
  }

  showTabs( estilo ) {
    // tslint:disable-next-line: no-angle-bracket-type-assertion
    const elem = <HTMLElement> document.querySelector('.tabbar');
    if (elem != null) {
      elem.style.display = estilo;
    }
  }

  openCamera( registro ) {
    // datos de la imagen y camarea
    const options: CameraOptions = {
      quality:            50,
      targetHeight:       1000,
      targetWidth:        1000,
      destinationType:    this.camera.DestinationType.DATA_URL,
      encodingType:       this.camera.EncodingType.JPEG,
      mediaType:          this.camera.MediaType.PICTURE,
      correctOrientation: true,
    };
    // abrir la camara
    this.camera.getPicture( options )
      .then(  (imageData) => {
                  registro.imagenes.push( { img: imageData } ); // img: a grabar, diplay: a gesplegar
              },  //
              (error)     => {
                  // ver el error....
              } );
  }

  openGallery( registro ) {
    // datos de la imagen y camarea
    const options: CameraOptions = {
      quality:            50,
      targetHeight:       1000,
      targetWidth:        1000,
      destinationType:    this.camera.DestinationType.DATA_URL,
      encodingType:       this.camera.EncodingType.JPEG,
      mediaType:          this.camera.MediaType.PICTURE,
      sourceType:         this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true,
    };
    // abrir la galeria
    this.camera.getPicture( options )
      .then(  (imageData) => {
                  registro.imagenes.push( { img: imageData } ); // img: a grabar, diplay: a gesplegar
              },  //
              (error)     => {
                  // ver el error....
              } );
  }

  toType( obj ) {
    return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
  }

}
