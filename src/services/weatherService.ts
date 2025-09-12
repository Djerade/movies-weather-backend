import axios from 'axios';
import { config } from '../config/env';

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  description: string;
  icon: string;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  timestamp: Date;
}

export class WeatherService {
  static async getCurrentWeather(city: string): Promise<WeatherData> {
    try {
      const response = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            q: city,
            appid: config.weather.apiKey,
            units: 'metric', // Celsius
          },
        }
      );

      const data = response.data;

      return {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp * 10) / 10,
        feelsLike: Math.round(data.main.feels_like * 10) / 10,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg || 0,
        visibility: Math.round((data.visibility || 0) / 1000), // Convert to km
        uvIndex: 0, // UV index not available in basic weather API
        sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
        sunset: new Date(data.sys.sunset * 1000).toISOString(),
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('OpenWeather API error:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`City "${city}" not found`);
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid OpenWeather API key');
        }
      }

      throw new Error('Failed to fetch weather data');
    }
  }

  static async getWeatherByCoordinates(
    lat: number,
    lon: number
  ): Promise<WeatherData> {
    try {
      const response = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            lat,
            lon,
            appid: config.weather.apiKey,
            units: 'metric',
          },
        }
      );

      const data = response.data;

      return {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp * 10) / 10,
        feelsLike: Math.round(data.main.feels_like * 10) / 10,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg || 0,
        visibility: Math.round((data.visibility || 0) / 1000), // Convert to km
        uvIndex: 0, // UV index not available in basic weather API
        sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
        sunset: new Date(data.sys.sunset * 1000).toISOString(),
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('OpenWeather API error:', error);
      throw new Error('Failed to fetch weather data');
    }
  }
}
