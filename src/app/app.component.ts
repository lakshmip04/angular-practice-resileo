import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { RegformComponent } from './components/regform/regform.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent,  RegformComponent],
  template: `
    
    <app-header/>
    <app-regform/>

    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'sample-project';
}
