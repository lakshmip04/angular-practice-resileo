import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { StudentService, StudentData, ApiResponse } from '../../services/student.service';

interface StudentWithActions extends StudentData {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  // Table configuration
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'contact',
    'dob',
    'gender',
    'location',
    'createdAt',
    'actions'
  ];

  // Data properties
  students: StudentWithActions[] = [];
  filteredStudents: StudentWithActions[] = [];
  loading = false;
  error: string | null = null;

  // Pagination
  totalStudents = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions = [5, 10, 25, 50];

  // Search
  searchTerm = '';

  ngOnInit(): void {
    this.loadStudents();
  }

  /**
   * Load students from the API
   */
  async loadStudents(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const response = await this.studentService.getAllStudents().toPromise();
      
      if (response?.success && response.data) {
        this.students = response.data;
        this.totalStudents = response.data.length;
        this.applyFilter();
        
        this.snackBar.open(`Loaded ${this.students.length} students`, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      } else {
        throw new Error(response?.message || 'Failed to load students');
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Unknown error occurred';
      this.snackBar.open('Failed to load students: ' + this.error, 'Close', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    } finally {
      this.loading = false;
    }
  }

  /**
   * Apply search filter
   */
  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredStudents = [...this.students];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredStudents = this.students.filter(student =>
        student.firstName?.toLowerCase().includes(searchLower) ||
        student.lastName?.toLowerCase().includes(searchLower) ||
        student.email?.toLowerCase().includes(searchLower) ||
        student.contact?.toLowerCase().includes(searchLower) ||
        student.city?.toLowerCase().includes(searchLower) ||
        student.country?.toLowerCase().includes(searchLower)
      );
    }
    
    // Reset pagination when filtering
    this.currentPage = 0;
    this.totalStudents = this.filteredStudents.length;
  }

  /**
   * Handle search input
   */
  onSearchChange(): void {
    this.applyFilter();
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  /**
   * Handle pagination change
   */
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  /**
   * Get paginated students for display
   */
  getPaginatedStudents(): StudentWithActions[] {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredStudents.slice(startIndex, endIndex);
  }

  /**
   * Format full name
   */
  getFullName(student: StudentWithActions): string {
    return `${student.firstName || ''} ${student.lastName || ''}`.trim();
  }

  /**
   * Format location
   */
  getLocation(student: StudentWithActions): string {
    const parts = [student.city, student.stateName, student.countryName]
      .filter(part => part && part.trim());
    return parts.join(', ');
  }

  /**
   * Format date
   */
  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  }

  /**
   * Format date and time
   */
  formatDateTime(dateString?: string): string {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  }

  /**
   * View student details
   */
  viewStudent(student: StudentWithActions): void {
    this.dialog.open(StudentDetailDialogComponent, {
      width: '600px',
      data: student,
      disableClose: false
    });
  }

  /**
   * Delete student
   */
  async deleteStudent(student: StudentWithActions): Promise<void> {
    if (!student.id) {
      this.snackBar.open('Cannot delete student: No ID found', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Confirmation dialog would go here
    const confirmed = confirm(`Are you sure you want to delete ${this.getFullName(student)}?`);
    
    if (!confirmed) return;

    try {
      const response = await this.studentService.deleteStudent(student.id).toPromise();
      
      if (response?.success) {
        this.snackBar.open('Student deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        
        // Reload the list
        await this.loadStudents();
      } else {
        throw new Error(response?.message || 'Failed to delete student');
      }
    } catch (error) {
      this.snackBar.open('Failed to delete student: ' + (error instanceof Error ? error.message : 'Unknown error'), 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    }
  }

  /**
   * Refresh the student list
   */
  refresh(): void {
    this.loadStudents();
  }

  /**
   * Export students (future feature)
   */
  exportStudents(): void {
    // This would implement CSV/Excel export functionality
    this.snackBar.open('Export feature coming soon!', 'Close', {
      duration: 3000
    });
  }
}

// Student Detail Dialog Component
@Component({
  selector: 'app-student-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>person</mat-icon>
      Student Details
    </h2>
    
    <mat-dialog-content class="dialog-content">
      <div class="student-info">
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>Personal Information</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-row">
              <strong>Full Name:</strong> 
              <span>{{ data.firstName }} {{ data.lastName }}</span>
            </div>
            <div class="info-row">
              <strong>Date of Birth:</strong> 
              <span>{{ formatDate(data.dob) }}</span>
            </div>
            <div class="info-row">
              <strong>Gender:</strong> 
              <span>{{ data.genderName || data.gender }}</span>
            </div>
            <div class="info-row">
              <strong>Email:</strong> 
              <span>{{ data.email }}</span>
            </div>
            <div class="info-row">
              <strong>Contact:</strong> 
              <span>{{ data.contact }}</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>Address Information</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-row">
              <strong>Street:</strong> 
              <span>{{ data.street }}</span>
            </div>
            <div class="info-row">
              <strong>City:</strong> 
              <span>{{ data.city }}</span>
            </div>
            <div class="info-row">
              <strong>State/Province:</strong> 
              <span>{{ data.stateName || data.state }}</span>
            </div>
            <div class="info-row">
              <strong>Country:</strong> 
              <span>{{ data.countryName || data.country }}</span>
            </div>
            <div class="info-row">
              <strong>Zip/Postal Code:</strong> 
              <span>{{ data.zip }}</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="info-card" *ngIf="data.createdAt">
          <mat-card-header>
            <mat-card-title>System Information</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-row">
              <strong>Student ID:</strong> 
              <span>{{ data.id }}</span>
            </div>
            <div class="info-row">
              <strong>Registration Date:</strong> 
              <span>{{ formatDateTime(data.createdAt) }}</span>
            </div>
            <div class="info-row" *ngIf="data.updatedAt && data.updatedAt !== data.createdAt">
              <strong>Last Updated:</strong> 
              <span>{{ formatDateTime(data.updatedAt) }}</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
      <button mat-raised-button color="primary" (click)="printDetails()">
        <mat-icon>print</mat-icon>
        Print
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }
    .student-info {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .info-card {
      width: 100%;
    }
    .info-row {
      display: flex;
      margin-bottom: 8px;
    }
    .info-row strong {
      min-width: 140px;
      color: #666;
    }
    .info-row span {
      flex: 1;
      color: #333;
    }
    mat-card-title {
      color: #3f51b5;
      font-size: 1.1em;
    }
  `]
})
export class StudentDetailDialogComponent {
  public dialogRef = inject(MatDialogRef<StudentDetailDialogComponent>);
  public data: StudentWithActions = inject(MAT_DIALOG_DATA);

  constructor() {}

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  }

  formatDateTime(dateString?: string): string {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  }

  printDetails(): void {
    window.print();
  }
}
