import { Component, inject, OnInit } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { Country, State } from 'country-state-city';
import { ICountry, IState, ICity } from 'country-state-city'

@Component({
  selector: 'app-regform',
  standalone: true,
  templateUrl : './regform.component.html',
  styleUrls: ['./regform.component.css'],
 
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
    MatCardModule,
    MatSelectModule
  ]
})
export class RegformComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);

  // Gender options
  genderOptions = [
    { value: 'Male', viewValue: 'Male' },
    { value: 'Female', viewValue: 'Female' },
    { value: 'Other', viewValue: 'Other' },
    { value: 'PreferNotToSay', viewValue: 'Prefer not to say' }
  ];

  // Country and state data
  countries: ICountry[] = [];
  states: IState[] = [];

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
    zip: ['', [Validators.required, Validators.pattern(/^\d{5,6}(-\d{4})?$/)]],
    country: ['IN', Validators.required] // Default to India
  });

  isLinear = false;
  combinedData: any = {};

  ngOnInit() {
    // Load all countries
    this.countries = Country.getAllCountries();

    // Initialize states for default country
    this.updateStates('IN');

    // Listen for country changes
    this.secondFormGroup.get('country')?.valueChanges.subscribe(countryCode => {
      if (countryCode) {
        this.updateStates(countryCode);
        // Reset state when country changes
        this.secondFormGroup.get('state')?.reset();
      }
    });
  }

  updateStates(countryCode: string) {
    this.states = State.getStatesOfCountry(countryCode);
  }

  onCountryChange(event: any) {
    const countryCode = event.value;
    this.updateStates(countryCode);
    this.secondFormGroup.get('state')?.reset();
  }

  getGenderLabel(value?: string): string {
    if (!value) return '';
    const option = this.genderOptions.find(opt => opt.value === value);
    return option ? option.viewValue : value;
  }

  getCountryName(countryCode?: string | null): string {
    if (!countryCode) return '';
    const country = Country.getCountryByCode(countryCode);
    return country ? country.name : countryCode || '';
  }

  getStateName(stateCode?: string | null): string {
    if (!stateCode) return '';
    const countryCode = this.secondFormGroup.get('country')?.value;
    if (!countryCode) return '';

    const state = State.getStateByCodeAndCountry(stateCode, countryCode);
    return state ? state.name : stateCode || '';
  }

  onSubmit() {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      const countryCode = this.secondFormGroup.get('country')?.value;
      const stateCode = this.secondFormGroup.get('state')?.value;

      this.combinedData = {
        ...this.firstFormGroup.value,
        ...this.secondFormGroup.value,
        countryName: this.getCountryName(countryCode),
        stateName: this.getStateName(stateCode)
      };

      console.log('Form submitted with data:', this.combinedData);
      alert('Form submitted successfully! Check the console for the submitted data.');
    } else {
      alert('Please fill out all required fields correctly.');
    }
  }
}