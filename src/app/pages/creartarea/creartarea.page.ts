import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { NetworkEngineService } from '../../services/network-engine.service';
import { BaseLocalService } from '../../services/base-local.service';
import { FuncionesService } from '../../services/funciones.service';

@Component({
  selector: 'app-creartarea',
  templateUrl: './creartarea.page.html',
  styleUrls: ['./creartarea.page.scss'],
})
export class CreartareaPage implements OnInit {

  cargando = false;
  grabando = false;
  onoff = [ true, true, true, true, true ];
  clasificaciones = [ { codigo:  'M', nombre: 'Mayor'},
                      { codigo: 'm', nombre: 'Menor'}];
  registro = { sector: '',
               zona: '',
               fingreso: Date,
               cargo: '',
               imagenes: [],
               clasificacion: '',
               descripcion: '',
               solicitud: '',
               presupuesto: 0,
               resp_usuario: '',
               resp_fcompromiso:  Date,
               prev_usuario: '',
               prev_fcumplimien: Date
  };

  constructor( private modalCtrl: ModalController,
               private router: Router,
               private alertCtrl: AlertController,
               private camera: Camera,
               private netWork: NetworkEngineService,
               public baseLocal: BaseLocalService,
               private funciones: FuncionesService) {
  }

  ngOnInit() {
    if ( this.baseLocal.user === undefined ) {
      this.router.navigate(['/home']);
    }
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  async preguntaCrearReg() {
    if ( this.registro.zona === '' || this.registro.sector === '' || this.registro.descripcion === '' || this.registro.clasificacion === '' || this.registro.solicitud === '' || this.registro.resp_usuario === '' || this.registro.prev_usuario === '' ) {
      this.funciones.msgAlert('', 'Debe llenar todos los campos solicitados.' );
    } else {
      //
      const alert = await this.alertCtrl.create({
        message: 'Una nueva solicitud será creada. <strong> Continúa?</strong>',
        buttons: [
          {
            text: 'Abandonar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {}
          }, {
            text: 'Ok !',
            handler: () => {
              this.crearNuevoReg();
            }
          }
        ]
      });
      await alert.present();
    }
  }
  private crearNuevoReg() {
    this.grabando = true;
    this.netWork.crearNuevoReg( { codigousr:      this.baseLocal.user.codigousr,
                                  empresa:        this.baseLocal.user.empresa,
                                  sector:         this.registro.sector,
                                  zona:           this.registro.zona,
                                  clasificacion:  this.registro.clasificacion,
                                  descripcion_nc: this.registro.descripcion,
                                  solicitud:      this.registro.solicitud,
                                  presupuesto:    this.registro.presupuesto,
                                  responsable:    this.registro.resp_usuario.trim(),
                                  fcompromiso:    this.registro.resp_fcompromiso,
                                  prevencionista: this.registro.prev_usuario.trim(),
                                  fcumplimiento:  this.registro.prev_fcumplimien },
                                this.registro.imagenes.length === 0 ? undefined : JSON.stringify(this.registro.imagenes) )
      .subscribe( data => { this.revisaCrearTarea( data ); },
                  err  => { this.grabando = false; this.funciones.msgAlert( '', err );  }
                );
  }
  revisaCrearTarea( data ) {
    this.grabando = false;
    if ( data.length === 0 ) {
        this.funciones.msgAlert('', 'La solicitud de grabación no pudo crearse. Intente luego.');
    } else if ( data.resultado === 'ok' ) {
        this.funciones.msgAlert('', 'La solicitud (' + data.datos[0].id.toString() + ') fue creada exitosamente. Actualice sus solicitudes para refrescar la lista.');
        this.modalCtrl.dismiss({creado: 'ok'});
    } else {
      this.funciones.msgAlert('', 'Ocurrió un error al intentar crear una tarea.' );
    }
  }

  openCamera() {
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
                  this.registro.imagenes.push( { img: imageData } ); // img: a grabar, diplay: a gesplegar
              },  //
              (error)     => {
                  // ver el error....
              } );
  }

  openGallery() {
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
                  this.registro.imagenes.push( { img: imageData } ); // img: a grabar, diplay: a gesplegar
              },  //
              (error)     => {
                  // ver el error....
              } );
  }

}
