import { Component, signal} from '@angular/core';


@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css'
})
export class CounterComponent {
   Countervalue= signal(0);

  keyUpHandler(event:KeyboardEvent){
    console.log(event.key);


  }
  increment(){
    this.Countervalue.set(this.Countervalue()+1)
  }
  decrement(){
    this.Countervalue.update((value)=>{
    return value-1;
    })
  }
  reset(){
    this.Countervalue.set(0)
  }

}
