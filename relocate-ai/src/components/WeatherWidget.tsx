import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

interface WeatherWidgetProps {
  userContext: any;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ userContext }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Mock weather data (in real app, fetch from weather API)
  const mockWeatherData: Record<string, WeatherData> = {
    'Dubai, UAE': {
      temperature: 32,
      condition: 'Sunny',
      humidity: 45,
      windSpeed: 12,
      location: 'Dubai, UAE'
    },
    'Lagos, Nigeria': {
      temperature: 28,
      condition: 'Partly Cloudy',
      humidity: 78,
      windSpeed: 8,
      location: 'Lagos, Nigeria'
    },
    'London, UK': {
      temperature: 15,
      condition: 'Rainy',
      humidity: 82,
      windSpeed: 15,
      location: 'London, UK'
    },
    'New York, USA': {
      temperature: 22,
      condition: 'Cloudy',
      humidity: 65,
      windSpeed: 10,
      location: 'New York, USA'
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'snowy':
        return <CloudSnow className="w-8 h-8 text-blue-300" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-500" />;
    }
  };

  useEffect(() => {
    const fetchWeather = () => {
      setLoading(true);
      setTimeout(() => {
        const destinationWeather = mockWeatherData[userContext.destination] ||
          mockWeatherData[userContext.origin] ||
          mockWeatherData['Dubai, UAE'];
        setWeather(destinationWeather);
        setLoading(false);
      }, 1000);
    };

    fetchWeather();
  }, [userContext]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-4">
        <Thermometer className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-bold text-gray-900">Weather Forecast</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : weather ? (
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              {getWeatherIcon(weather.condition)}
            </div>
            <h4 className="text-xl font-bold text-gray-900">{weather.temperature}°C</h4>
            <p className="text-sm text-gray-600">{weather.condition}</p>
            <p className="text-xs text-gray-500 mt-1">{weather.location}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Cloud className="w-4 h-4 text-blue-600 mr-1" />
                <span className="text-xs text-gray-600">Humidity</span>
              </div>
              <div className="font-semibold text-blue-900">{weather.humidity}%</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Wind className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-xs text-gray-600">Wind</span>
              </div>
              <div className="font-semibold text-green-900">{weather.windSpeed} km/h</div>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Weather data unavailable</p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;