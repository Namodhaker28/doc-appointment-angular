import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { interval, map } from 'rxjs';
import { WeatherService } from './service/weather.service';
import { ForecastModalComponent } from './component/forecast.component';
import { DoctorListComponent } from './component/doctor-list.component';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import slots from "../assets/data/slots.json"

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DoctorListComponent, CommonModule, MatSnackBarModule,],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private dialog = inject(MatDialog);
  private weatherService = inject(WeatherService);
  private snackBar = inject(MatSnackBar);

  city: string = 'Noida';
  currentTemp: number = 0;
  currentTime: string = '';
  selectedDoctor: any = null; // Selected doctor object
  selectedSlot: any = null;   // Selected slot object

  // Slot data
  slots = slots

  ngOnInit(): void {
    // Fetch the current weather for the city
    this.weatherService.getCurrentWeather().subscribe((data: any) => {
      this.currentTemp = data.temperature;
    });

    // Update the current time every second in HH:MM:SS AM/PM format
    interval(1000)
      .pipe(
        map(() =>
          new Date().toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        )
      )
      .subscribe((formattedTime) => {
        this.currentTime = formattedTime;
      });
  }


  // Show weather forecast modal
  showForecast() {
    this.dialog.open(ForecastModalComponent, {
      width: '70%',
      maxWidth:"100vw",
      minWidth:"50vw",
      data: { city: this.city },
    });
  }

  // Handle doctor selection from DoctorListComponent
  onDoctorSelected(doctor: any) {
    this.selectedDoctor = doctor;

      this.selectedSlot = null;

  }

  // Handle slot click (just selection, not booking)
  onSlotClick(slot: any) {
    if (!slot.isBooked) {
      this.selectedSlot = slot;
      this.openSnackBar(`Selected slot: ${slot.time}`);
    } else {
      this.openSnackBar('This slot is already booked.');
    }
  }

  // Book appointment when button is clicked
  bookAppointment() {
    if (!this.selectedDoctor) {
      this.openSnackBar('Please select a doctor first.');
      return;
    }

    if (!this.selectedSlot) {
      this.openSnackBar('Please select a slot first.');
      return;
    }

    // Perform booking logic here
    this.selectedSlot.isBooked = true;
    this.openSnackBar(`Appointment booked with ${this.selectedDoctor.name} at ${this.selectedSlot.time}`);

    // Reset the selected slot after booking
    this.selectedSlot = null;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
