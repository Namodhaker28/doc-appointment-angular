import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateDoctorDialogComponent } from './create-doctor-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import allDoctors  from '../../assets/data/doctors.json';

@Component({
  standalone: true,
  selector: 'app-doctor-list',
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  template: `
    <div style="height: 100%; background-color: white;">
  <div
    style="display: flex; padding: 0 1rem; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid #ccc;"
  >
    <h3>Doctors</h3>
    <button
      style="background-color: white; border: 1px solid #ccc; padding: 0.5rem; border-radius: 4px;"
      color="primary"
      (click)="openCreateDoctorDialog()"
    >
      +
    </button>
  </div>

  <!-- Empty State -->
  <div *ngIf="doctors.length === 0" style="display: flex; height: 80%; justify-content: center; align-items: center; text-align: center;">
    <div>
      <p style="padding:4px" >No doctors available. Please create a new doctor to get started.</p>
    </div>
  </div>

  <!-- Doctor List -->
  <mat-list *ngIf="doctors.length > 0">
    <mat-list-item
      *ngFor="let doc of doctors; let i = index"
      (click)="onDoctorClick(doc)"
      [ngStyle]="{
        'background-color': selectedDoctor === doc ? '#e0f7fa' : '#fff'
      }"
    >
      <div
        style="display: flex; justify-content: space-between; width: 100%; align-items: center;"
      >
        <div>
          <div style="font-weight: bold;">{{ doc.name }}</div>
        </div>
        <button
          mat-icon-button
          color="warn"
          (click)="deleteDoctor(i); $event.stopPropagation()"
        >
          <mat-icon>delete</mat-icon>
        </button>
      </div>
    </mat-list-item>
  </mat-list>
</div>

  `,
})
export class DoctorListComponent {
  @Output() doctorSelected = new EventEmitter<any>();
  private snackBar = inject(MatSnackBar);
  @Input() selectedDoctor: any;

  doctors: any[] = allDoctors;

  constructor(private dialog: MatDialog) {}

  deleteDoctor(index: number): void {
    const deletedDoctor = this.doctors[index];
    this.doctors.splice(index, 1);

    if (this.selectedDoctor === deletedDoctor) {
      this.selectedDoctor = null;
      this.doctorSelected.emit(null);
    }
    this.openSnackBar(`Doctor ${deletedDoctor.name} deleted successfully.`);
  }

  openCreateDoctorDialog(): void {
    const dialogRef = this.dialog.open(CreateDoctorDialogComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe((doctor) => {
      if (doctor) {
        this.doctors.push(doctor);
        alert(`Doctor ${doctor.name} added successfully.`);
      }
    });
  }


  onDoctorClick(doc: any) {
    this.selectedDoctor = doc;
    this.doctorSelected.emit(doc);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
