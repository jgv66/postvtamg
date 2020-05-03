import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-revisartarea',
  templateUrl: './revisartarea.page.html',
  styleUrls: ['./revisartarea.page.scss'],
})
export class RevisartareaPage implements OnInit {

  @Input() id: number;
  @Input() tipo: string;

  cargando = false;
  regcerrado = false;
  regfechacierre: Date;
  regobs = '';
  titulo = '';
  regimagenr = undefined;
  regimagenr01 = undefined;

  constructor( private modalCtrl: ModalController) {
    if ( this.tipo === 'R' ) {
      this.titulo = 'Encargo correctivo';
    } else if ( this.tipo === 'E' ) {
      this.titulo = 'Acción de experto';
    } else if ( this.tipo === '' ) {
      this.titulo = 'RNCS';
    }
  }

  ngOnInit() {
  }

  salir() {
    this.modalCtrl.dismiss();
  }
  
  openCamera() {}
  openGallery() {}
  preguntaCerrarReg() {}

}
