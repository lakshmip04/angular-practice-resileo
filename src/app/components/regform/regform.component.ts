
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-regform',
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatCardModule
  ],
  templateUrl: './regform.component.html',
  styleUrl: './regform.component.css'
})
export class RegformComponent {
  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    contact: ['', [Validators.required, Validators.pattern(/^[\d+\-\s()]+$/)]]
  });

  secondFormGroup = this._formBuilder.group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', [Validators.required, Validators.pattern(/^\d{6}(-\d{5})?$/)]],
    country: ['', Validators.required]
  });

  isLinear = false;
  combinedData: any = {};

  onSubmit() {
    // Combine data from both form groups
    this.combinedData = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value
    };

    // Here you would typically send the data to a server
    console.log('Form submitted with data:', this.combinedData);

    // For demonstration, we'll just show an alert
    alert('Form submitted successfully! Check the console for the submitted data.');
  }

}
