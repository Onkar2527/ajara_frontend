import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

window.onpopstate = function (e) {
  if(e.state.ɵrouterPageId == 3){
    alert("Pressing back button can lead to unexpected behaviour!");
    console.log("event",e)
    history.forward();
  }

 
}
