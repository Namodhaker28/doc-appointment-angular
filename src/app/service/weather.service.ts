import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import axios from 'axios';

export interface ForecastData {
  datetime: string;
  weather: string;
  temperature: number;
  humidity: number;
  minTemp: number;
  maxTemp: number;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private apiKey = 'edc955e6cbd12873e3421b8c347f707f';
  private lat = 28.57;
  private lon = 77.32;

  getCurrentWeather(): Observable<{ temperature: number }> {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&units=metric&appid=${this.apiKey}`;

    return from(axios.get(url)).pipe(
      map((response: any) => {
        const data = response.data;
        return { temperature: data.main?.temp ?? 0 };
      })
    );
  }

  getForecast(): Observable<ForecastData[]> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.lat}&lon=${this.lon}&units=metric&appid=${this.apiKey}`;

    return from(axios.get(url)).pipe(
      map((response: any) => {
        const data = response.data;
        if (!data.list || !Array.isArray(data.list)) {
          return [];
        }

        return data.list.map((item: any) => {
          const weatherDescription =
            item.weather && item.weather.length > 0
              ? item.weather[0].description
              : 'N/A';
          return {
            datetime: this.convertUnixToDateTime(item.dt),
            weather: weatherDescription,
            temperature: item.main?.temp ?? 0,
            humidity: item.main?.humidity ?? 0,
            minTemp: item.main?.temp_min ?? 0,
            maxTemp: item.main?.temp_max ?? 0,
          } as ForecastData;
        });
      })
    );
  }

  private convertUnixToDateTime(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month} ${hours}:${minutes}`; // e.g., "15/12 17:30"
  }
}
