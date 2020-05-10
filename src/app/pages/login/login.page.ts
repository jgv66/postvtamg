import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides, NavController } from '@ionic/angular';
import { NetworkEngineService } from '../../services/network-engine.service';
import { Router } from '@angular/router';
import { BaseLocalService } from '../../services/base-local.service';
import { FuncionesService } from '../../services/funciones.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('slidePrincipal', { static: true} ) slides: IonSlides;

  avatars = [
    { img: 'av-1.png', seleccionado: true  },
    { img: 'av-2.png', seleccionado: false },
    { img: 'av-3.png', seleccionado: false },
    { img: 'av-4.png', seleccionado: false },
    { img: 'av-5.png', seleccionado: false },
    { img: 'av-6.png', seleccionado: false },
    { img: 'av-7.png', seleccionado: false },
    { img: 'av-8.png', seleccionado: false },
  ];

  avatarSlide = {
    slidesPerView: 3.5
  };

  cargando = false;
  rutocorreo = '';
  clave = '';

  constructor( private netWork: NetworkEngineService,
               private baseLocal: BaseLocalService,
               private funciones: FuncionesService,
               private navCtrl: NavController,
               private router: Router ) { }

  ngOnInit() {
    this.slides.lockSwipes(true);
    this.baseLocal.obtenUltimoUsuario()
        .then( usr => {
          this.rutocorreo = usr.email;
          this.clave      = '' ;
        })
        .catch( err => console.log( 'Lectura de usuario con error->', err ) );
    // sectores
    if ( this.baseLocal.sectores.length === 0 ) {
      this.netWork.obtenTablas( 'sectores' )
          .subscribe( ( data: any ) => { this.baseLocal.guardaSectores( data.datos ); },
                      err  => { this.funciones.msgAlert( 'ATENCION' , 'Ocurrió un error al rescatar sectores -> ' + err ); }
          );
    }
    // zonas
    if ( this.baseLocal.zonas.length === 0 ) {
      this.netWork.obtenTablas( 'zonas' )
          .subscribe( ( data: any ) => { this.baseLocal.guardaZonas( data.datos ); },
                      err  => { this.funciones.msgAlert( 'ATENCION' , 'Ocurrió un error al rescatar zonas -> ' + err ); }
          );
    }
    // cargos
    if ( this.baseLocal.cargos.length === 0 ) {
      this.netWork.obtenTablas( 'cargos' )
          .subscribe( ( data: any ) => { this.baseLocal.guardaCargos( data.datos ); },
                      err  => { this.funciones.msgAlert( 'ATENCION' , 'Ocurrió un error al rescatar cargos -> ' + err ); }
          );
    }
    // usuarios
    if ( this.baseLocal.usuarios.length === 0 ) {
      this.netWork.obtenTablas( 'usuarios' )
          .subscribe( ( data: any ) => { this.baseLocal.guardaUsuarios( data.datos ); },
                      err  => { this.funciones.msgAlert( 'ATENCION' , 'Ocurrió un error al rescatar usuarios -> ' + err ); }
          );
    }
  }

  logear( fLogin: NgForm ) {
    // console.log( fLogin.valid );
    this.cargando = true;
    if ( fLogin.valid === true ) {
      //
      this.netWork.login( this.rutocorreo, this.clave )
          .subscribe( (data) => { this.revisaDatos( data ); },
                      ()     => { this.cargando = false;
                                  this.funciones.msgAlert( 'ATENCION', 'Sin conexion con el servidor. Reintente luego.' );
                                }
                    );
      //
    } else {
      //
      this.cargando = false;
      this.funciones.msgAlert('ATENCION', 'Ingrese correctamente los datos solicitados.');
    }
  }
  revisaDatos( data ) {
    this.cargando = false;
    const user = data.datos[0];
    if ( data.datos.length === 0 || data.resultado === 'error' ) {
        this.funciones.msgAlert('ATENCION', data.datos );
    } else {
        this.funciones.muestraySale( 'Hola ' + user.nombre + ', ' + this.funciones.textoSaludo() , 0.7 );
        this.baseLocal.guardaUltimoUsuario( user );
        // cambio el root y ademas pongo una pequeña animacion
        this.navCtrl.navigateRoot('/main/tabs/tab1', { animated: true });
        //
    }
  }

  noRecuerdo() {}
  darmeDeAlta() {}

  registro( fRegistro: NgForm ) {
    console.log( fRegistro.valid );
  }

  seleccionarAvatar( avatar ) {
    this.avatars.forEach( av => av.seleccionado = false );
    avatar.seleccionado = true;
  }

  mostrarRegistro() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }

  mostrarLogin() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }

}
