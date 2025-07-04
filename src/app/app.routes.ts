import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch:'full',
        loadComponent:()=>{
            return import('./components/login/login.component').then(
                m => m.LoginComponent
            )
        
        }
    },{
        path: 'regform',
        
        loadComponent:()=>{
            return import('./components/regform/regform.component').then(
                m => m.RegformComponent
            )
        
        }
    },
    {
        path: 'todos',
        loadComponent() {
            return import('./todos/todos.component').then(m=>m.TodosComponent)
        },
    },
    {
        path: 'students',
        loadComponent() {
            return import('./components/student-list/student-list.component').then(m=>m.StudentListComponent)
        },
    },
    {
        path: 'counter',
        loadComponent() {
            return import('./components/counter/counter.component').then(m=>m.CounterComponent)
        },
    }
];
