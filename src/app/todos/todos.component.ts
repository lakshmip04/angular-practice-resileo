import { Component } from '@angular/core';
import { CounterComponent } from '../components/counter/counter.component';

@Component({
  selector: 'app-todos',
  imports: [ CounterComponent],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css'
})
export class TodosComponent {
  //   To study type script angular basics:
// 1.Map
// 2.Filter
// 3.forEach
// 4.Reduce
// 5.Find
// 6. Chaining - Filter & Map Combined
// 7.sort
// 8.every
// 9.some
// Practice exercises on 

  

ngOnit(){

 const formData = [
    { name: 'Anu', age: 10, gender: 'F' },
    { name: 'Raj', age: 17, gender: 'M' },
    { name: 'Divya', age: 5, gender: 'F' }
  ];
  console.log(formData);
// - Filter out students younger than 6.
  const underSix = formData.filter((data)=>data.age<6);
  console.log(underSix);
// -Count how many boys and girls.
let boys = 0;
let girls = 0;
formData.forEach((data)=>{
  if(data.gender=='F'){
    girls++;
  }else{
    boys++;
  }
}

  
);
console.log('Boys:',boys);
console.log('Girls:',girls);

// - Create an array of { id, name } where id is index + 1.
let index=0;
const idNames = formData.map((data,index)=>({id:index++,name:data.name}));
console.log(idNames);
// - filter - Get students aged 10 or above
const aboveTen = formData.filter((data)=> data.age>10);
console.log(aboveTen);
// - map - Add title "Master" or "Miss" based on gender
const title = formData.map((data)=>({
  ...data ,
  title: data.gender=='F'?'Miss':'Master'
 }
))
console.log(title);
// - forEach - Print name and age
formData.forEach((data)=>{
  console.log(`Name: ${data.name}, age:${data.age}`)
})
// - reduce - Total age of all students
const totalAge = formData.reduce((sum,data)=> sum+data.age,0);
console.log(totalAge);
// - find - Find the student named "Divya"
const divya = formData.find((student)=> student.name ==='Divya')
// -some - Is any student under age 6?
const underSix1 = formData.some((data)=>data.age<6);
console.log(underSix1);
// -every - Are all students older than 4?
const olderThanFour = formData.every((data)=> data.age >4)
console.log(olderThanFour);
// -filter + map - Names of girls only
const girlNames = formData.filter(data => data.gender === 'F').map(data=>(data.name))
console.log(girlNames);

// -sort - Sort students by age (ascending)
const sortedByAge = [...formData].sort((a, b) => a.age - b.age);
  console.log('Sorted by Age:', sortedByAge);
// -map - Assign unique student IDs
let id = 1001;
const studentIds = formData.map((data,id)=>({...data,id:id++}))
console.log(studentIds);

}

}
