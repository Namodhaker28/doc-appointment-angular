import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-create-doctor-dialog',
  template: `
  <div style="padding: 1rem;" >
  <h2 mat-dialog-title style="font-size: 1.5rem; font-weight: 500; margin-bottom: 1rem;">
    Create Doctor
  </h2>
  <div mat-dialog-content style="display: flex; flex-direction: column; gap: 1rem; padding: 1rem 0;">
    <form [formGroup]="doctorForm" style="display: flex; flex-direction: column; gap: 1rem;">

      <mat-form-field appearance="outline" style="width: 100%;">
        <mat-label>Doctor Name</mat-label>
        <input style="border-radius:8px" matInput formControlName="name" placeholder="e.g. Dr. ABCD">
      </mat-form-field>

      <div style="display: flex; gap: 1rem; justify-content: space-between; align-items: flex-start;">
        <mat-form-field appearance="outline" style="flex: 1;">
          <mat-label>Qualifications</mat-label>
          <input style="border-radius:8px" matInput formControlName="qualifications" placeholder="e.g. MBBS, MD">
        </mat-form-field>

        <mat-form-field appearance="outline" style="flex: 1;">
          <mat-label>Image URL</mat-label>
          <input style="border-radius:8px" matInput formControlName="imageUrl" placeholder="https://example.com/photo.jpg">
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" style="width: 100%;">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description" placeholder="Short bio or description" style="min-height: 80px;"></textarea>
      </mat-form-field>
    </form>
  </div>

  <div mat-dialog-actions align="end" style="margin-top: 1rem;">
    <button mat-button (click)="onCancel()" style="margin-right: 1rem;">Cancel</button>
    <button mat-raised-button color="primary" (click)="onCreate()" [disabled]="doctorForm.invalid">Create Doctor</button>
  </div>
  </div>
`,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class CreateDoctorDialogComponent {
  doctorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateDoctorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.doctorForm = this.fb.group({
      name: [''],
      qualifications: [''],
      imageUrl: [''],
      description: ['']
    });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onCreate(): void {
    if (this.doctorForm.valid) {
      this.dialogRef.close(this.doctorForm.value);
    }
  }
}
