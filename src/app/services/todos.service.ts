import { Injectable,inject } from '@angular/core';
import { Todo } from '../model/todo.type';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  http = inject(HttpClient); //access to get/post 
  // todoItems:Array<Todo> = [{
  //   id: 1,
  //   name: "Leanne Graham",
  //   username: "Bret",
  //   email: "Sincere@april.biz",
    
  //   phone: 1-770-736-8031 
    
  // }]
  
  // constructor() { }
  getinfoFromApi(){
    const url = `https://jsonplaceholder.typicode.com/users`;
    return this.http.get<Array<Todo>>(url);
  }
}
