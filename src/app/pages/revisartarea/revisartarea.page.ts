import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { NetworkEngineService } from '../../services/network-engine.service';
import { BaseLocalService } from '../../services/base-local.service';
import { Router } from '@angular/router';
import { FuncionesService } from '../../services/funciones.service';

@Component({
  selector: 'app-revisartarea',
  templateUrl: './revisartarea.page.html',
  styleUrls: ['./revisartarea.page.scss'],
})
export class RevisartareaPage implements OnInit {

  @Input() id;
  @Input() tipo;
  @Input() descrip;

  cargando = false;
  grabando = false;
  cerrado = false;
  fechacierre = new Date().toISOString();
  obs = '';
  titulo = '';
  registro = { imagenes: [] };

  constructor( private modalCtrl: ModalController,
               private router: Router,
               private alertCtrl: AlertController,
               private netWork: NetworkEngineService,
               private baseLocal: BaseLocalService,
               public funciones: FuncionesService) {
  }

  ngOnInit() {
    if ( this.baseLocal.user === undefined ) {
      this.router.navigate(['/home']);
    } else {
      if ( this.tipo === 'R' ) {
        this.titulo = 'Encargo correctivo';
      } else if ( this.tipo === 'E' ) {
        this.titulo = 'Acción de experto';
      } else if ( this.tipo === '' ) {
        this.titulo = 'Cierre de tarea';
      }
      this.consultarReg();
    }
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  consultarReg() {
    this.cargando = true;
    this.netWork.consultaRegistro( { codigousr:   this.baseLocal.user.codigousr,
                                     empresa:     this.baseLocal.user.empresa,
                                     id:          this.id,
                                     responsable: ( (this.tipo === 'R') ? 'R' : undefined ),
                                     experto:     ( (this.tipo === 'E') ? 'E' : undefined )
                                   } )
      .subscribe( data => { this.revisaDatos( data );  },
                  err  => { this.cargando = false; this.funciones.msgAlert( 'ATENCION', err );  }
                );
  }
  revisaDatos( data ) {
    this.cargando = false;
    const rs = data.datos;
    if ( rs.length === 0 ) {
        this.funciones.msgAlert('', 'La tarea ( ' + this.id.toString() + ' ) no existe.');
      } else if ( data.resultado === 'ok' && rs.cerrado === 1 ) {
        this.funciones.msgAlert('', 'Este registro ya está cerrado.' );
        this.salir();
      } else if ( data.resultado === 'ok' ) {
        this.cerrado      = ( rs.cerrado === undefined ? false : rs.cerrado );
        this.fechacierre  = ( rs.fechacierre ? rs.fechacierre : (new Date().toISOString() ) );
        this.obs          = ( rs.reg_obs === undefined ? '' : rs.reg_obs );
    } else {
      this.funciones.msgAlert('', 'Ocurrió un error al intentar rescatar el registro ( ' + this.id.toString() + ' ). Intente luego.' );
    }
  }

  async preguntaCerrarReg() {
    // console.log(this.funciones.toType( this.fechacierre ), this.fechacierre.slice( 0, 10 ) );
    if ( this.cerrado === false || this.obs === '' ) {
      this.funciones.msgAlert('', 'Debe completar los datos antes de cerrar esta solicitud.' );
    } else {
      const confirm = await this.alertCtrl.create({
          message: 'Está seguro de querer cerrar esta solicitud?',
          buttons: [
            { text: 'No, aún no...',
              handler: () => {} },
            { text: 'Sí, estoy seguro !',
              handler: () => { this.retornaExito(); } }
          ]
        });
      await confirm.present();
      //
      }
  }
  retornaExito() {
    this.grabando = true;
    this.netWork.cerrarReg( { codigousr:    this.baseLocal.user.usuario.trim(),
                              empresa:      this.baseLocal.user.empresa,
                              fechacierre:  this.fechacierre.slice( 0, 10 ),
                              observacion:  this.obs.trim(),
                              id:           this.id,
                              responsable:  ( (this.tipo === 'R') ? 'R'       : undefined ),
                              experto:      ( (this.tipo === 'E') ? 'E'       : undefined ) },
                              this.tipo,
                              this.registro.imagenes.length === 0 ? undefined : JSON.stringify(this.registro.imagenes) )
      .subscribe( data => { this.revisaDato( data );  },
                  err  => { this.grabando = false;
                            this.funciones.msgAlert( '', err ); }
                );
  }
  revisaDato( data ) {
    // console.log('revisaDato()', data.datos );
    this.grabando = false;
    if ( data.datos.length === 0 ) {
      this.funciones.msgAlert('', 'El registro ( ' + this.id.toString() + ' ) no pudo ser actualizado. Intente luego.');
    } else if ( data.datos[0].resultado === 'ok' ) {
      //
      this.funciones.msgAlert('', 'El registro ( ' + this.id.toString() + ' ) fue actualizado exitosamente. Su lista ya fue actualizada.');
      this.funciones.cuantosTengo( 1, 'enviados' );
      this.modalCtrl.dismiss( { cerrado: 'ok', imgs: this.registro.imagenes.length } );
      //
    } else if ( data.resultado === 'falta' ) {
      this.funciones.msgAlert('', 'El regsitro ( ' + this.id.toString() + ' ) NO fue actualizado. Faltan datos del Experto y Responsable para cerrar.');
    } else {
      this.funciones.msgAlert('', 'Ocurrió un error al intentar actualizar el registro ( ' + this.id.toString() + ' ) ' );
    }
  }

}
