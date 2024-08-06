import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LoadingService } from './services/loading.service';
import { delay } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class AppComponent {
  public environmentInjector = inject(EnvironmentInjector);
  loading = false;
  // private hubConnectionBuilder!: HubConnection;
  // offers: any[] = [];
  constructor(
    private _loading: LoadingService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this._loading.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
        console.log('loading', this.loading);
      });

    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        const userStr = this.cookieService.get('avis-user');
        if (userStr) {
          var user = JSON.parse(atob(userStr));
          if (!user) this.router.navigate(['/']);
        }
      }
    });
  }
  //   ionViewDidEnter(): void {
  //     this.hubConnectionBuilder = new HubConnectionBuilder()
  //       .withUrl('https://localhost:7003/socket')
  //       .configureLogging(LogLevel.Information)
  //       .build();
  //     this.hubConnectionBuilder
  //       .start()
  //       .then(() => console.log('Connection started.......!'))
  //       .catch(err => console.log('Error while connect with server'));
  //     this.hubConnectionBuilder.on('LocationUpdate', (result: any) => {
  //       console.log("message",result)
  //       this.offers.push(result);
  //     });
  // }
}
