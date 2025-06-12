import { Component } from '@angular/core';
import { CounterComponent } from '../components/counter/counter.component';

@Component({
  selector: 'app-todos',
  imports: [ CounterComponent],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css'
})
export class TodosComponent {

}
