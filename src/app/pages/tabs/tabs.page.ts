import { Component, OnInit } from '@angular/core';
import { FuncionesService } from '../../services/funciones.service';
import { BaseLocalService } from '../../services/base-local.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  public misMensajes: number;
  public mensajes: any;

  constructor( public funciones: FuncionesService,
               public baseLocal: BaseLocalService,
               private router: Router ) {
    this.misMensajes = 0;
    this.mensajes    = [];
  }

  ngOnInit() {
    if ( this.baseLocal.user.length === 0 ) {
      this.router.navigate(['/login']);
    } else {
      // console.log('tabs-> ', this.baseLocal.user);
      this.cuantosPendientesTengo( 1 ) ;
      this.cuantosRecibidosTengo( 1 );
    }
  }

  cuantosMensajesTengo() {
    return this.funciones.cuantosMensajesTengo();
  }

  cuantosPendientesTengo( releer ) {
    return this.funciones.cuantosTengo( releer, 'enviados' );
  }

  cuantosRecibidosTengo( releer ) {
    return this.funciones.cuantosTengo( releer, '' );
  }
}
