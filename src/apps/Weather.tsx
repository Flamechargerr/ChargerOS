import { useState } from 'react';
import { Search, CloudSun, Sun, CloudRain, CloudLightning, Snowflake, Wind, Droplets, Eye, Gauge } from 'lucide-react';

const WEATHER_DATA: Record<string, any> = {
  'london': { name: 'London', country: 'UK', temp: 12, condition: 'Rainy', humidity: 82, wind: 18, visibility: 8, pressure: 1012, forecast: [
    { day: 'Mon', temp: 11, icon: 'rain' }, { day: 'Tue', temp: 13, icon: 'cloud' }, { day: 'Wed', temp: 14, icon: 'sun' },
    { day: 'Thu', temp: 10, icon: 'rain' }, { day: 'Fri', temp: 12, icon: 'cloud' },
  ]},
  'new york': { name: 'New York', country: 'US', temp: 22, condition: 'Sunny', humidity: 45, wind: 12, visibility: 16, pressure: 1020, forecast: [
    { day: 'Mon', temp: 23, icon: 'sun' }, { day: 'Tue', temp: 21, icon: 'sun' }, { day: 'Wed', temp: 19, icon: 'cloud' },
    { day: 'Thu', temp: 20, icon: 'sun' }, { day: 'Fri', temp: 22, icon: 'sun' },
  ]},
  'tokyo': { name: 'Tokyo', country: 'JP', temp: 18, condition: 'Cloudy', humidity: 65, wind: 8, visibility: 12, pressure: 1015, forecast: [
    { day: 'Mon', temp: 17, icon: 'cloud' }, { day: 'Tue', temp: 19, icon: 'rain' }, { day: 'Wed', temp: 20, icon: 'sun' },
    { day: 'Thu', temp: 18, icon: 'cloud' }, { day: 'Fri', temp: 21, icon: 'sun' },
  ]},
  'paris': { name: 'Paris', country: 'FR', temp: 15, condition: 'Partly Cloudy', humidity: 70, wind: 10, visibility: 10, pressure: 1018, forecast: [
    { day: 'Mon', temp: 14, icon: 'cloud' }, { day: 'Tue', temp: 16, icon: 'sun' }, { day: 'Wed', temp: 13, icon: 'rain' },
    { day: 'Thu', temp: 15, icon: 'sun' }, { day: 'Fri', temp: 17, icon: 'sun' },
  ]},
  'sydney': { name: 'Sydney', country: 'AU', temp: 25, condition: 'Sunny', humidity: 55, wind: 15, visibility: 20, pressure: 1022, forecast: [
    { day: 'Mon', temp: 26, icon: 'sun' }, { day: 'Tue', temp: 24, icon: 'sun' }, { day: 'Wed', temp: 22, icon: 'cloud' },
    { day: 'Thu', temp: 25, icon: 'sun' }, { day: 'Fri', temp: 27, icon: 'sun' },
  ]},
};

function WeatherIcon({ condition, size = 64 }: { condition: string; size?: number }) {
  const c = condition.toLowerCase();
  if (c.includes('sun')) return <Sun size={size} className="text-[#ff9800]" />;
  if (c.includes('rain')) return <CloudRain size={size} className="text-[#4a9eff]" />;
  if (c.includes('storm') || c.includes('lightning')) return <CloudLightning size={size} className="text-[#f7b731]" />;
  if (c.includes('snow')) return <Snowflake size={size} className="text-[#a8e6cf]" />;
  return <CloudSun size={size} className="text-[#ccc]" />;
}

export default function Weather() {
  const [search, setSearch] = useState('');
  const [weather, setWeather] = useState(WEATHER_DATA['london']);

  const handleSearch = () => {
    const key = search.toLowerCase();
    if (WEATHER_DATA[key]) {
      setWeather(WEATHER_DATA[key]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      {/* Search */}
      <div className="flex gap-2 p-4">
        <div className="flex-1 flex items-center bg-white/10 rounded-lg px-3">
          <Search size={14} className="text-white/30" />
          <input
            type="text"
            placeholder="Search city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-transparent text-white text-sm px-2 py-2 outline-none placeholder-white/30"
          />
        </div>
        <button onClick={handleSearch} className="px-4 py-2 bg-[#4a9eff] text-white text-sm rounded-lg hover:bg-[#3d8de6]">Search</button>
      </div>

      {/* Current weather */}
      <div className="flex-1 overflow-auto p-4">
        <div className="text-center mb-6">
          <p className="text-white/40 text-sm">{weather.name}, {weather.country}</p>
          <div className="flex items-center justify-center my-4">
            <WeatherIcon condition={weather.condition} size={80} />
          </div>
          <p className="text-5xl text-white font-light">{weather.temp}°C</p>
          <p className="text-white/60 text-sm mt-1">{weather.condition}</p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: Droplets, label: 'Humidity', value: `${weather.humidity}%`, color: '#4a9eff' },
            { icon: Wind, label: 'Wind', value: `${weather.wind} km/h`, color: '#4ecdc4' },
            { icon: Eye, label: 'Visibility', value: `${weather.visibility} km`, color: '#ff9800' },
            { icon: Gauge, label: 'Pressure', value: `${weather.pressure} hPa`, color: '#ff6b6b' },
          ].map(item => (
            <div key={item.label} className="bg-[#252526] rounded-lg p-3 flex items-center gap-3">
              <item.icon size={20} style={{ color: item.color }} />
              <div>
                <p className="text-white/40 text-[10px]">{item.label}</p>
                <p className="text-white text-sm">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Forecast */}
        <p className="text-white/40 text-xs uppercase mb-3">5-Day Forecast</p>
        <div className="space-y-2">
          {weather.forecast.map((day: any, i: number) => (
            <div key={i} className="flex items-center justify-between bg-[#252526] rounded-lg px-4 py-2.5">
              <span className="text-white text-sm w-12">{day.day}</span>
              <WeatherIcon condition={day.icon} size={20} />
              <span className="text-white/60 text-sm">{day.temp}°C</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
