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
  standalone: true,
  selector: 'app-home',
  template: `
    <!-- <button mat-button (click)="isLinear = !isLinear" id="toggle-linear">
      {{ isLinear ? 'Disable linear mode' : 'Enable linear mode' }}
    </button> -->

    <mat-stepper orientation="vertical" [linear]="isLinear" #stepper>
      <!-- Step 1 -->
      <mat-step [stepControl]="firstFormGroup">
        <form [formGroup]="firstFormGroup">
          <ng-template matStepLabel>Personal Information</ng-template>

          <div class="form-container">
            <div class="form-row">
              <mat-form-field appearance="fill" class="form-field">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" required>
                <mat-error *ngIf="firstFormGroup.get('firstName')?.hasError('required')">
                  First name is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="fill" class="form-field">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" required>
                <mat-error *ngIf="firstFormGroup.get('lastName')?.hasError('required')">
                  Last name is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="fill" class="form-field">
                <mat-label>Date of Birth</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="dob" required>
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="firstFormGroup.get('dob')?.hasError('required')">
                  Date of birth is required
                </mat-error>
              </mat-form-field>

              <div class="form-field radio-group">
                <mat-label>Gender</mat-label>
                <mat-radio-group formControlName="gender" required>
                  <div class="radio-options">
                    <mat-radio-button value="Male" class="radio-option">Male</mat-radio-button>
                    <mat-radio-button value="Female" class="radio-option">Female</mat-radio-button>
                    <mat-radio-button value="Other" class="radio-option">Other</mat-radio-button>
                  </div>
                </mat-radio-group>
                <mat-error *ngIf="firstFormGroup.get('gender')?.hasError('required')">
                  Gender is required
                </mat-error>
              </div>
            </div>

            <div class="form-row">
              <mat-form-field appearance="fill" class="form-field">
                <mat-label>Email Address</mat-label>
                <input matInput type="email" placeholder="your.email@example.com" formControlName="email" required>
                <mat-error *ngIf="firstFormGroup.get('email')?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="firstFormGroup.get('email')?.hasError('email')">
                  Please enter a valid email
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="fill" class="form-field">
                <mat-label>Contact Number</mat-label>
                <input matInput type="tel" placeholder="+91 xxxxxxxxxx" formControlName="contact" required>
                <mat-error *ngIf="firstFormGroup.get('contact')?.hasError('required')">
                  Contact number is required
                </mat-error>
                <mat-error *ngIf="firstFormGroup.get('contact')?.hasError('pattern')">
                  Please enter a valid phone number
                </mat-error>
              </mat-form-field>
            </div>
          </div>

          <div class="button-row">
            <button mat-button type="button" (click)="firstFormGroup.reset()">Reset Form</button>
            <button mat-button matStepperNext>Next</button>
          </div>
        </form>
      </mat-step>

      <!-- Step 2 -->
      <mat-step [stepControl]="secondFormGroup">
        <form [formGroup]="secondFormGroup">
          <ng-template matStepLabel>Address Information</ng-template>

          <div class="form-container">
            <div class="form-row">
              <mat-form-field appearance="fill" class="form-field full-width">
                <mat-label>Street Address</mat-label>
                <input matInput formControlName="street" placeholder="123 Main St" required>
                <mat-error *ngIf="secondFormGroup.get('street')?.hasError('required')">
                  Street address is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="fill" class="form-field">
                <mat-label>City</mat-label>
                <input matInput formControlName="city" placeholder="Chennai" required>
                <mat-error *ngIf="secondFormGroup.get('city')?.hasError('required')">
                  City is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="fill" class="form-field">
                <mat-label>State</mat-label>
                <input matInput formControlName="state" placeholder="Tamil Nadu" required>
                <mat-error *ngIf="secondFormGroup.get('state')?.hasError('required')">
                  State is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="fill" class="form-field">
                <mat-label>Zip Code</mat-label>
                <input matInput formControlName="zip" placeholder="100011" required>
                <mat-error *ngIf="secondFormGroup.get('zip')?.hasError('required')">
                  Zip code is required
                </mat-error>
                <mat-error *ngIf="secondFormGroup.get('zip')?.hasError('pattern')">
                  Please enter a valid zip code
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="fill" class="form-field">
                <mat-label>Country</mat-label>
                <input matInput formControlName="country" placeholder="India" required>
                <mat-error *ngIf="secondFormGroup.get('country')?.hasError('required')">
                  Country is required
                </mat-error>
              </mat-form-field>
            </div>
          </div>

          <div class="button-row">
            <button mat-button matStepperPrevious>Back</button>
            <button mat-button matStepperNext>Next</button>
          </div>
        </form>
      </mat-step>

      <!-- Step 3 -->
      <mat-step>
        <ng-template matStepLabel>Review and Submit</ng-template>

        <div class="review-container">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Personal Information</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p><strong>First Name:</strong> {{ combinedData.firstName }}</p>
              <p><strong>Last Name:</strong> {{ combinedData.lastName }}</p>
              <p><strong>Date of Birth:</strong> {{ combinedData.dob | date }}</p>
              <p><strong>Gender:</strong> {{ combinedData.gender }}</p>
              <p><strong>Email:</strong> {{ combinedData.email }}</p>
              <p><strong>Contact Number:</strong> {{ combinedData.contact }}</p>
            </mat-card-content>
          </mat-card>

          <mat-card>
            <mat-card-header>
              <mat-card-title>Address Information</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p><strong>Street Address:</strong> {{ combinedData.street }}</p>
              <p><strong>City:</strong> {{ combinedData.city }}</p>
              <p><strong>State:</strong> {{ combinedData.state }}</p>
              <p><strong>Zip Code:</strong> {{ combinedData.zip }}</p>
              <p><strong>Country:</strong> {{ combinedData.country }}</p>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="button-row">
          <button mat-button matStepperPrevious>Back</button>
          <button mat-button (click)="stepper.reset()">Reset</button>
          <button mat-raised-button color="primary" (click)="onSubmit()">Submit</button>
        </div>
      </mat-step>
    </mat-stepper>
  `,
  styles: [`
    .mat-stepper-vertical {
      margin-top: 8px;
    }

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      width: 100%;
      margin-bottom: 20px;
    }

    .form-row {
      display: flex;
      gap: 20px;
      width: 100%;
    }

    .form-field {
      flex: 1;
      min-width: 0;
    }

    .full-width {
      width: 100%;
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      padding-top: 10px;
    }

    .radio-options {
      display: flex;
      gap: 20px;
      margin-top: 5px;
      flex-wrap: wrap;
    }

    .radio-option {
      margin-right: 0;
    }

    .button-row {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 10px;
    }

    .mat-mdc-form-field {
      width: 100%;
    }

    .mat-mdc-form-field-subscript-wrapper {
      margin-top: -10px;
    }

    .mat-step-content {
      overflow: visible;
    }

    .review-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 20px;
    }

    mat-card {
      width: 100%;
    }

    mat-card-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  `],
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
  ]
})
export class HomeComponent {
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
