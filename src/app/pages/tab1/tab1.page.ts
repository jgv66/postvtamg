import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { BaseLocalService } from '../../services/base-local.service';
import { FuncionesService } from '../../services/funciones.service';
import { NetworkEngineService } from '../../services/network-engine.service';
import { RevisartareaPage } from '../revisartarea/revisartarea.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild( IonContent, {static: true} ) content: IonContent;

  lScrollInfinito = false;
  pendientes = [];
  offset = 0;
  cargando = false;

  constructor( private router: Router,
               public baseLocal: BaseLocalService,
               private funciones: FuncionesService,
               private netWork: NetworkEngineService,
               private modalCtrl: ModalController) {}

  ngOnInit() {
    if ( this.baseLocal.user === undefined ) {
      this.router.navigate(['/home']);
    } else {
      this.cargaTareas( 0 );
    }
  }

  ionViewDidLoad() {
    this.funciones.cuantosTengo( 1, 'enviados' );
  };

  cargaTareas( xdesde, infiniteScroll? ) {
    //
    if ( xdesde === 0 ) {
      this.cargando         = true;
      this.offset           = 0 ;
      this.lScrollInfinito  = true;
    } else {
      this.offset += 20 ;
    }
    //
    this.netWork.misTareas( { offset:   this.offset.toString(),
                              usuario:  this.baseLocal.user.usuario,
                              empresa:  this.baseLocal.user.empresa,
                              enviados: 'enviados'  } )
        .subscribe( data => {
                              this.revisarData( data, xdesde, infiniteScroll );
                            },
                    err  => { this.cargando = false;
                              this.funciones.msgAlert( 'ATENCION', err );
                            }
                  );
  }
  revisarData( data, xdesde, infiniteScroll ) {
    console.log('funciones.data', data.datos);
    console.log('this.baseLocal.user', this.baseLocal.user);
    // console.log('funciones.data[0]', data.datos[0]);
    const rs    = data.datos,
          largo = data.datos.length;
    this.cargando = false;
    if ( rs === undefined || largo === 0 ) {
      this.funciones.msgAlert('ATENCION', 'Su lista de Tareas Enviadas está vacía. Reintente.');
    } else if ( largo > 0 ) {
      this.pendientes = ( this.offset === 0 ) ? rs : this.pendientes.push(...rs);
      if ( infiniteScroll ) {
        infiniteScroll.complete();
      }
      //
      if ( largo < 20  ) {
        this.lScrollInfinito = false;
      } else if ( xdesde === 1 ) {
        this.lScrollInfinito = true ;
      }
      //
    }
  }

  masDatos( infiniteScroll ) {
    this.cargaTareas( 0, infiniteScroll );
    this.funciones.cuantosTengo( 1, 0 );
  }

  nuevaTarea() {
    // this.navCtrl.push( CreatareaPage, { usuario: this.usuario } );
  }

  cerrarTarea( codigousr, idregistro, tipo ) {
    if ( this.baseLocal.user.usuario !== codigousr ) {
      this.funciones.msgAlert('', 'Solicitud no corresponde al usuario');
    } else {
      console.log('cerrarTarea( codigousr, idregistro, tipo )');
      // this.navCtrl.push( RevisartareaPage, { callback: this.cerrarID, id: idregistro, usuario: this.usuario, tipo: tipo } );
      this.revisarModal( codigousr, idregistro, tipo )

    }
  }
  async revisarModal( codigousr, idregistro, tipo ) {
    const modal = await this.modalCtrl.create({
      component: RevisartareaPage,
      componentProps: { id: idregistro, tipo }
    });
    return await modal.present();

    const { data } = await modal.onWillDismiss();
    console.log(data);

  }
  cerrarID = ( xdata ) => {
    return new Promise( (resolve, reject) => {
          console.log( xdata );
          this.netWork.cerrarReg( { codigousr:    this.baseLocal.user.usuario,
                                    empresa:      this.baseLocal.user.empresa,
                                    fechacierre:  xdata.fechacierre,
                                    observacion:  xdata.obs,
                                    id:           xdata.id,
                                    img_base64:   ( (xdata.tipo === '')  ? undefined : xdata.img_base64 ),
                                    responsable:  ( (xdata.tipo === 'R') ? 'R'       : undefined ),
                                    experto:      ( (xdata.tipo === 'E') ? 'E'       : undefined )
                                  } )
            .subscribe( data => { this.revisaDato( xdata.id, data );  },
                        err  => { this.funciones.msgAlert( 'ATENCION', err ); }
                      );
          resolve( true );

       });
  };

  revisaDato( id, data ) {
    console.log('revisaDato()', data);
    const titulo = 'ATENCION ( ' + id.toString() + ' )';
    const rs = data[0][0]
    if ( rs.length === 0 ) {
      this.funciones.msgAlert(titulo, 'El registro no pudo ser actualizado. Intente luego.');
    } else if ( rs.resultado === 'ok' ) {
      this.funciones.msgAlert(titulo, 'El registro fue actualizado exitosamente. Refresque su lista y revise.');
      this.funciones.cuantosTengo( 1, 'enviados' );
    } else if ( rs.resultado === 'falta' ) {
      this.funciones.msgAlert(titulo, 'El regsitro NO fue actualizado. Faltan datos del Experto y Responsable para cerrar.');
    } else {
      this.funciones.msgAlert(titulo, 'Ocurrió un error al intentar actualizar el registro' );
    }
  }

  refrescaTareas() {
    this.pendientes = [];
    this.cargaTareas( 0 );
  }

  imagenes( tarea ) {
    if ( tarea.imagenes_i + tarea.imagenes_r + tarea.imagenes_e > 0 ) {
      console.log('imagenes');
      // this.navCtrl.push( ImagenProductoPage, { id: tarea.id_registro } );
    } else {
      this.funciones.msgAlert('', 'El registro no presenta imágenes para visualizar.');
    }
  }

  scrollToTop() {
    this.content.scrollToTop(1500);
  }

}
