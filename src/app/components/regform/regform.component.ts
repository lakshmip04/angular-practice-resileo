// src/app/regform/regform.component.ts

import { Component, inject, OnInit, ViewChild } from '@angular/core'; // Import 'ViewChild' and 'inject'
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule, MatStepper } from '@angular/material/stepper'; // Import MatStepper
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { Country, State } from 'country-state-city';
import { ICountry, IState } from 'country-state-city';

import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; // Keep MAT_DIALOG_DATA for the token
import { StudentService, StudentData } from '../../services/student.service';



// 1. Generic Alert/Confirmation Dialog Component
@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CommonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
      <div *ngIf="data.details">
        <ul>
          <li *ngFor="let detail of data.details">{{ detail }}</li>
        </ul>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button *ngIf="data.type === 'confirmation'" (click)="dialogRef.close(false)">Cancel</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true" cdkFocusInitial>
        {{ data.type === 'confirmation' ? 'Confirm' : 'OK' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .mat-dialog-title { color:rgb(6, 8, 20); }
    .mat-dialog-content { padding-bottom: 20px; font-size: 2em}
    .mat-dialog-content ul { list-style-type: disc; margin-left: 20px; }
  `]
})
export class AlertDialogComponent {
  // Use inject() directly for MAT_DIALOG_DATA
  public data: { title: string; message: string; type?: 'alert' | 'confirmation'; details?: string[] } = inject(MAT_DIALOG_DATA);
  public dialogRef: MatDialogRef<AlertDialogComponent> = inject(MatDialogRef);

  constructor() {} // Empty constructor when using inject()
}


// 2. Data Preview Dialog Component
@Component({
  selector: 'app-preview-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatCardModule, CommonModule, DatePipe],
  template: `
    <h2 mat-dialog-title>Review Your Information</h2>
    <mat-dialog-content class="preview-content">
      <mat-card class="preview-card">
        <mat-card-header>
          <mat-card-title>Personal Information</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p><strong>First Name:</strong> {{ data.firstName }}</p>
          <p><strong>Last Name:</strong> {{ data.lastName }}</p>
          <p><strong>Date of Birth:</strong> {{ data.dob | date:'mediumDate' }}</p>
          <p><strong>Gender:</strong> {{ data.genderName }}</p>
          <p><strong>Email:</strong> {{ data.email }}</p>
          <p><strong>Contact Number:</strong> {{ data.contact }}</p>
        </mat-card-content>
      </mat-card>

      <mat-card class="preview-card">
        <mat-card-header>
          <mat-card-title>Address Information</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p><strong>Street Address:</strong> {{ data.street }}</p>
          <p><strong>City:</strong> {{ data.city }}</p>
          <p><strong>Country:</strong> {{ data.countryName }}</p>
          <p><strong>State/Province:</strong> {{ data.stateName }}</p>
          <p><strong>Zip/Postal Code:</strong> {{ data.zip }}</p>
        </mat-card-content>
      </mat-card>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Edit</button>
      <button mat-raised-button color="primary" (click)="dialogRef.close(true)">Confirm & Submit</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .preview-content {
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 10px 0;
    }
    .preview-card {
      width: 100%;
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px 0px rgba(0, 0, 0, 0.06);
      border: 1px solid #e0e0e0;
    }
    .preview-card mat-card-content p {
      margin: 5px 0;
    }
    .preview-card mat-card-title {
      font-size: 1.1em;
      color: #3f51b5;
    }
  `]
})
export class PreviewDialogComponent {
  // Use inject() directly for MAT_DIALOG_DATA
  public data: any = inject(MAT_DIALOG_DATA);
  public dialogRef: MatDialogRef<PreviewDialogComponent> = inject(MatDialogRef);

  constructor() {} // Empty constructor when using inject()
}



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
    MatSelectModule,
    MatDialogModule // IMPORTANT: Add MatDialogModule here
  ]
})
export class RegformComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog); // Inject MatDialog service
  private studentService = inject(StudentService); // Inject StudentService

  @ViewChild('stepper') stepper!: MatStepper; // Get reference to the stepper

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
    dob: ['', [Validators.required, this.ageValidator(5, 18)]],
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

    // Subscribe to form value changes to keep combinedData updated for review
    // Using a more robust way to combine data
    this.firstFormGroup.valueChanges.subscribe(values => {
      this.updateCombinedData();
    });
    this.secondFormGroup.valueChanges.subscribe(values => {
      this.updateCombinedData();
    });
  }

  // New method to update combinedData
  private updateCombinedData(): void {
    this.combinedData = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      // Ensure names are resolved when data is combined for review
      genderName: this.getGenderLabel(this.firstFormGroup.get('gender')?.value),
      countryName: this.getCountryName(this.secondFormGroup.get('country')?.value),
      stateName: this.getStateName(this.secondFormGroup.get('state')?.value)
    };
  }

  updateStates(countryCode: string) {
    this.states = State.getStatesOfCountry(countryCode);
  }

  // Corrected type for value parameter to include null
  onCountryChange(event: { value: string | null }) {
    const countryCode = event.value;
    if (countryCode) {
        this.updateStates(countryCode);
        this.secondFormGroup.get('state')?.reset();
    }
  }

  // Corrected parameter type to accept null, and ensure it's handled
  getGenderLabel(value: string | null | undefined): string {
    if (value === null || value === undefined) return ''; // Handle null explicitly
    const option = this.genderOptions.find(opt => opt.value === value);
    return option ? option.viewValue : value;
  }

  getCountryName(countryCode: string | null | undefined): string { // Accept null and undefined
    if (countryCode === null || countryCode === undefined) return ''; // Handle null explicitly
    const country = Country.getCountryByCode(countryCode);
    return country ? country.name : countryCode || '';
  }

  getStateName(stateCode: string | null | undefined): string { // Accept null and undefined
    if (stateCode === null || stateCode === undefined) return ''; // Handle null explicitly
    const countryCode = this.secondFormGroup.get('country')?.value;
    if (!countryCode) return '';

    const state = State.getStateByCodeAndCountry(stateCode, countryCode);
    return state ? state.name : stateCode || '';
  }

  // Custom Validator for Age (between minAge and maxAge)
  ageValidator(minAge: number, maxAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dob = control.value;
      if (!dob) {
        return null; // Don't validate empty field, Validators.required handles it
      }

      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
         age--; // Adjust age if birth month/day hasn't occurred yet this year
      }

      if (age < minAge || age > maxAge) {
        return { invalidAge: true };
      }
      return null;
    };
  }

  // Method to open the validation error dialog
  openValidationErrorDialog(errors: string[]): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        title: 'Validation Errors',
        message: 'Please correct the following issues before proceeding:',
        type: 'alert',
        details: errors
      }
    });
  }

  // Method to open the confirmation dialog (e.g., before final submit)
  openConfirmationDialog(): Promise<boolean> {
    return new Promise(resolve => {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        width: '350px',
        data: {
          title: 'Confirm Submission',
          message: 'Are you sure you want to submit this data?',
          type: 'confirmation'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        resolve(result === true); // Resolve with true if confirmed, false otherwise
      });
    });
  }

  // Modified onSubmit to use the preview dialog
  async onSubmit() {
    // Mark all controls as touched for immediate feedback
    this.firstFormGroup.markAllAsTouched();
    this.secondFormGroup.markAllAsTouched();

    if (this.firstFormGroup.invalid || this.secondFormGroup.invalid) {
      const errors: string[] = [];
      // Function to push error if control has error
      const addError = (control: AbstractControl | null, errorName: string, message: string) => {
        if (control?.hasError(errorName)) {
          errors.push(message);
        }
      };

      // Collect errors from firstFormGroup
      addError(this.firstFormGroup.get('firstName'), 'required', 'First Name is required.');
      addError(this.firstFormGroup.get('lastName'), 'required', 'Last Name is required.');
      addError(this.firstFormGroup.get('dob'), 'required', 'Date of Birth is required.');
      addError(this.firstFormGroup.get('dob'), 'invalidAge', 'Age must be between 5 and 18 years.');
      addError(this.firstFormGroup.get('gender'), 'required', 'Gender is required.');
      addError(this.firstFormGroup.get('email'), 'required', 'Email is required.');
      addError(this.firstFormGroup.get('email'), 'email', 'Invalid email format.');
      addError(this.firstFormGroup.get('contact'), 'required', 'Contact Number is required.');
      addError(this.firstFormGroup.get('contact'), 'pattern', 'Invalid contact number format.');

      // Collect errors from secondFormGroup
      addError(this.secondFormGroup.get('street'), 'required', 'Street Address is required.');
      addError(this.secondFormGroup.get('city'), 'required', 'City is required.');
      addError(this.secondFormGroup.get('country'), 'required', 'Country is required.');
      addError(this.secondFormGroup.get('state'), 'required', 'State/Province is required.');
      addError(this.secondFormGroup.get('zip'), 'required', 'Zip/Postal Code is required.');
      addError(this.secondFormGroup.get('zip'), 'pattern', 'Invalid Zip/Postal Code format.');

      this.openValidationErrorDialog(errors);
      return;
    }

    // Ensure combinedData is up-to-date before opening preview
    this.updateCombinedData();

    const dialogRef = this.dialog.open(PreviewDialogComponent, {
      width: '650px',
      data: this.combinedData, // Pass the already updated combinedData
      disableClose: true
    });

    const result = await dialogRef.afterClosed().toPromise(); // Use .toPromise() for async/await

         if (result === true) {
       const confirmed = await this.openConfirmationDialog();

       if (confirmed) {
         // Prepare data for API submission
         const studentData: StudentData = {
           firstName: this.combinedData.firstName,
           lastName: this.combinedData.lastName,
           dob: this.combinedData.dob,
           gender: this.combinedData.gender,
           email: this.combinedData.email,
           contact: this.combinedData.contact,
           street: this.combinedData.street,
           city: this.combinedData.city,
           state: this.combinedData.state,
           zip: this.combinedData.zip,
           country: this.combinedData.country,
           genderName: this.combinedData.genderName,
           countryName: this.combinedData.countryName,
           stateName: this.combinedData.stateName
         };

         try {
           console.log('Submitting data to API:', studentData);
           
           // Call the student service to submit data
           const response = await this.studentService.submitStudentRegistration(studentData).toPromise();
           
           if (response?.success) {
             // Show success dialog
             this.dialog.open(AlertDialogComponent, {
               width: '400px',
               data: {
                 title: 'Success!',
                 message: 'Student registration submitted successfully!',
                 type: 'alert'
               }
             });

             console.log('API Response:', response);
             
             // Reset forms after successful submission
             this.stepper.reset();
             this.firstFormGroup.reset();
             this.secondFormGroup.reset();
             this.combinedData = {};
           } else {
             throw new Error(response?.message || 'Submission failed');
           }
         } catch (error) {
           console.error('Submission error:', error);
           
           // Show error dialog
           this.dialog.open(AlertDialogComponent, {
             width: '400px',
             data: {
               title: 'Submission Failed',
               message: 'There was an error submitting your registration. Please try again.',
               type: 'alert',
               details: [error instanceof Error ? error.message : 'Unknown error occurred']
             }
           });
         }
       } else {
         console.log('Final submission cancelled by user.');
       }
     } else {
       console.log('Preview closed, user may want to edit.');
     }
  }
}