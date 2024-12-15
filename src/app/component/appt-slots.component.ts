import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-appt-slots',
  imports: [CommonModule],
  template: `
    <div *ngFor="let session of slots">
      <h4>{{ session.name }}</h4>
      <div>
        <button
          *ngFor="let s of session.slots"
          [disabled]="s.isBooked"
          [ngClass]="{ selected: slotSelected === s }"
          (click)="selectSlot(s)"
        >
          {{ s.time }}
        </button>
      </div>
    </div>
  `,
  styles: `
    /* Style for each session block */
h4 {
  margin: 1rem 0 0.5rem;
  font-size: 1.2rem;
  color: #333;
}

/* Grid layout for slots */
div {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* Default slot button styling */
button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Hover effect for slot buttons */
button:hover {
  background-color: #e0f7fa;
  border-color: #00838f;
}

/* Disabled slots */
button:disabled {
  background-color: #ddd;
  border-color: #bbb;
  color: #888;
  cursor: not-allowed;
}

/* Selected slot */
button.selected {
  background-color: #4caf50;
  border-color: #388e3c;
  color: #fff;
}

/* Booked slots */
button.booked {
  background-color: #f44336;
  border-color: #d32f2f;
  color: #fff;
}

  `,
})
export class ApptSlotsComponent {
  @Input() slots: any[] = [];
  @Output() slotSelected = new EventEmitter<any>();

  selectSlot(slot: any) {
    this.slotSelected.emit(slot);
  }
}
