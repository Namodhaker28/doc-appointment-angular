import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { WeatherService, ForecastData } from '../service/weather.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-forecast-modal',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="forecast-modal-container">
      <h1 mat-dialog-title>Weather Forecast for {{ data.city }}</h1>
      <mat-dialog-content>
        <div *ngIf="isLoading" class="spinner-container">
          <mat-spinner></mat-spinner>
        </div>
        <table mat-table [dataSource]="forecast" class="mat-elevation-z8" *ngIf="!isLoading">

          <!-- Date/Time Column -->
          <ng-container matColumnDef="datetime">
            <th mat-header-cell *matHeaderCellDef> Date/Time </th>
            <td mat-cell *matCellDef="let element"> {{element.datetime}} </td>
          </ng-container>

          <!-- Weather Column -->
          <ng-container matColumnDef="weather">
            <th mat-header-cell *matHeaderCellDef> Weather </th>
            <td mat-cell *matCellDef="let element"> {{element.weather}} </td>
          </ng-container>

          <!-- Temperature Column -->
          <ng-container matColumnDef="temperature">
            <th mat-header-cell *matHeaderCellDef> Temperature (°C) </th>
            <td mat-cell *matCellDef="let element"> {{element.temperature}} </td>
          </ng-container>

          <!-- Humidity Column -->
          <ng-container matColumnDef="humidity">
            <th mat-header-cell *matHeaderCellDef> Humidity (%) </th>
            <td mat-cell *matCellDef="let element"> {{element.humidity}} </td>
          </ng-container>

          <!-- Min Temp Column -->
          <ng-container matColumnDef="minTemp">
            <th mat-header-cell *matHeaderCellDef> Min Temp (°C) </th>
            <td mat-cell *matCellDef="let element"> {{element.minTemp}} </td>
          </ng-container>

          <!-- Max Temp Column -->
          <ng-container matColumnDef="maxTemp">
            <th mat-header-cell *matHeaderCellDef> Max Temp (°C) </th>
            <td mat-cell *matCellDef="let element"> {{element.maxTemp}} </td>
          </ng-container>

          <!-- Header and Row Declarations -->
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div *ngIf="!isLoading && forecast.length === 0" class="no-data">
          No forecast data available.
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Close</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .forecast-modal-container {
      width: 100%;
      max-width: 1200px;
      display: flex;
      flex-direction: column;
    }

    h1[mat-dialog-title] {
      margin-bottom: 20px;
      font-size: 1.75rem;
      text-align: center;
    }

    mat-dialog-content {
      flex: 1;
      overflow-y: auto;
    }

    table {
      width: 100%;
      margin-bottom: 20px;
    }

    th.mat-header-cell {
      background-color: #f5f5f5;
      font-weight: bold;
      text-align: left;
      padding: 12px;
    }

    td.mat-cell {
      padding: 12px;
    }

    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }

    .no-data {
      text-align: center;
      color: #888;
      font-style: italic;
      margin-top: 20px;
    }

    @media (max-width: 600px) {
      th.mat-header-cell, td.mat-cell {
        padding: 8px;
        font-size: 0.9rem;
      }

      h1[mat-dialog-title] {
        font-size: 1.25rem;
      }
    }
  `]
})
export class ForecastModalComponent implements OnInit {
  forecast: ForecastData[] = [];
  displayedColumns: string[] = ['datetime', 'weather', 'temperature', 'humidity', 'minTemp', 'maxTemp'];
  isLoading: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { city: string },
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    this.weatherService.getForecast().subscribe({
      next: (data: ForecastData[]) => {
        this.forecast = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching forecast data', err);
        this.isLoading = false;
      }
    });
  }
}
