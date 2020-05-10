import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { BaseLocalService } from '../../services/base-local.service';
import { FuncionesService } from '../../services/funciones.service';
import { NetworkEngineService } from '../../services/network-engine.service';
import { GaleriaPage } from '../galeria/galeria.page';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  @ViewChild( IonContent, {static: true} ) content: IonContent;

  lScrollInfinito = false;
  recibidos = [];
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
    this.funciones.cuantosTengo( 1, 1 );
  }

  cargaTareas( xdesde, infiniteScroll?, event? ) {
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
                              cerradas: 'C' } )
        .subscribe( data => {
                              this.revisarData( data, xdesde, infiniteScroll, event );
                            },
                    err  => { this.cargando = false;
                              this.funciones.msgAlert( 'ATENCION', err );
                            }
                  );
  }
  revisarData( data, xdesde, infiniteScroll, event ) {
    const rs    = data.datos,
          largo = data.datos.length;
    this.cargando = false;
    if ( rs === undefined || largo === 0 ) {
      this.funciones.msgAlert('ATENCION', 'Su lista de Tareas Cerradas está vacía');
    } else if ( largo > 0 ) {
      this.recibidos = ( this.offset === 0 ) ? rs : this.recibidos.push(...rs);
      //
      if ( infiniteScroll ) {
        infiniteScroll.complete();
      }
      //
      if ( event ) {
        event.target.complete();
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
    this.funciones.cuantosTengo( 1, 1 );
  }
  doRefresh( event ) {
    this.cargaTareas( 0, undefined, event );
  }

  refrescaTareas() {
    this.recibidos = [];
    this.cargaTareas( 0 );
  }

  async imagenes( tarea ) {
    if ( tarea.imagenes_i + tarea.imagenes_r + tarea.imagenes_e === 0 ) {
      this.funciones.msgAlert('', 'El registro no presenta imágenes para visualizar.');
    } else {
      const modal = await this.modalCtrl.create({
        component: GaleriaPage,
        componentProps: { id: tarea.idregistro, descrip: tarea.nc_descrip }
      });
      await modal.present();
    }
  }

  scrollToTop() {
    this.content.scrollToTop(1500);
  }

}
