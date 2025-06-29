import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface StudentData {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  email: string;
  contact: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  genderName?: string;
  countryName?: string;
  stateName?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api'; // This will be our Node.js backend URL

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor() { }

  /**
   * Submit student registration data
   * @param studentData - The student form data
   * @returns Observable<ApiResponse>
   */
  submitStudentRegistration(studentData: StudentData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/students`, studentData, this.httpOptions)
      .pipe(
        map(response => {
          console.log('Registration successful:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get all students (for future use)
   * @returns Observable<ApiResponse>
   */
  getAllStudents(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/students`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get student by ID (for future use)
   * @param id - Student ID
   * @returns Observable<ApiResponse>
   */
  getStudentById(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/students/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update student data (for future use)
   * @param id - Student ID
   * @param studentData - Updated student data
   * @returns Observable<ApiResponse>
   */
  updateStudent(id: string, studentData: Partial<StudentData>): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/students/${id}`, studentData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Delete student (for future use)
   * @param id - Student ID
   * @returns Observable<ApiResponse>
   */
  deleteStudent(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/students/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors
   * @param error - HTTP error response
   * @returns Observable<never>
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }

    console.error('StudentService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
