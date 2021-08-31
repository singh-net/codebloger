import { LoadingBarService } from '@ngx-loading-bar/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  busyRequestCount = 0; 
  constructor(private loadingService: LoadingBarService) {
    
  }
  busy() {
    const state = this.loadingService.useRef('router');
    //this.busyRequestCount++;
    //this.loadingService.start();
    state.start();
  }

  idle() {
    const state = this.loadingService.useRef('router');
    //this.busyRequestCount--;
    //this.loadingService.complete();
    state.complete();
  }
}
