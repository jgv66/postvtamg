import { Component, OnInit, Input } from '@angular/core';
import { BaseLocalService } from '../../services/base-local.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FuncionesService } from '../../services/funciones.service';
import { NetworkEngineService } from '../../services/network-engine.service';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
})
export class GaleriaPage implements OnInit {

  @Input() id;
  @Input() descrip;

  cargando = false;
  imagenes: Array<any>;

  constructor( private baseLocal: BaseLocalService,
               private funciones: FuncionesService,
               private netWork: NetworkEngineService,
               private router: Router,
               private modalCtrl: ModalController ) { }

  ngOnInit() {
    if ( this.baseLocal.user === undefined ) {
      this.router.navigate(['/home']);
    } else {
      // console.log(this.id);
      this.getImages();
    }
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  getImages() {
    this.cargando = true;
    this.netWork.getImages( this.id )
      .subscribe( data => { this.revisaDatos( data );  },
                  err  => { this.cargando = false; this.funciones.msgAlert( 'ATENCION', err );  }
                );
  }

  revisaDatos( data ) {
    // console.log(data);
    this.cargando = false;
    const rs = JSON.parse(data.datos);
    if ( rs.length === 0 ) {
        this.funciones.msgAlert('', 'El registro ( ' + this.id.toString() + ' ) no existe.');
      } else if ( data.resultado === 'ok' ) {
        this.imagenes = rs;
    } else {
      this.funciones.msgAlert('', 'Ocurrió un error al intentar rescatar las imágenes del registro ( ' + this.id.toString() + ' ).' );
    }

  }

}
