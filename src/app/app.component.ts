import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if ( this.platform.is ('android')) {
        // console.log('hacer cosas de Android');
      }
      if (this.platform.is ('ios')) {
        // console.log('hacer cosas de Apple');
      }
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
