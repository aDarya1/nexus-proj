import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface DateTimeData {
  datetime: string;
  timezone: string;
  day_of_week: number;
  day_of_year: number;
  week_number: number;
}

export function DateTimeDisplay() {
  const [dateTime, setDateTime] = useState<DateTimeData | null>(null);
  const [localTime, setLocalTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial time from API
  useEffect(() => {
    const fetchDateTime = async () => {
      try {
        // Using WorldTimeAPI (free, no API key needed)
        const response = await fetch('https://worldtimeapi.org/api/timezone/Europe/Warsaw');
        if (!response.ok) throw new Error('Failed to fetch time');
        const data: DateTimeData = await response.json();
        setDateTime(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching time:', err);
        setError('Unable to fetch time');
        // Fallback to local time
        setDateTime({
          datetime: new Date().toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          day_of_week: new Date().getDay(),
          day_of_year: Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000),
          week_number: Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86400000 / 7),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDateTime();
    
    // Update local time every second
    const interval = setInterval(() => {
      setLocalTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time from API datetime
  const formatTime = (datetime: string | null) => {
    if (!datetime) return localTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
    
    const date = new Date(datetime);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  // Format date
  const formatDate = (datetime: string | null) => {
    if (!datetime) return localTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const date = new Date(datetime);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const timeString = formatTime(dateTime?.datetime || null);
  const dateString = formatDate(dateTime?.datetime || null);

  return (
    <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-2.5 py-1 md:py-1.5 rounded-lg border transition-all" 
         style={{ 
           backgroundColor: 'var(--hover)', 
           borderColor: 'var(--border)' 
         }}>
      {/* Clock Icon */}
      <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" style={{ color: 'var(--primary)' }} />
      
      {/* Time and Date */}
      <div className="flex items-center gap-1.5 md:gap-2">
        <span 
          className="text-xs md:text-sm font-mono font-semibold whitespace-nowrap" 
          style={{ color: 'var(--text-primary)' }}
        >
          {isLoading ? '--:--:--' : timeString}
        </span>
        <span 
          className="text-[10px] md:text-xs font-medium hidden md:inline whitespace-nowrap" 
          style={{ color: 'var(--text-secondary)' }}
        >
          {isLoading ? '...' : new Date(dateTime?.datetime || localTime).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })}
        </span>
        <span 
          className="text-[10px] font-medium md:hidden whitespace-nowrap" 
          style={{ color: 'var(--text-secondary)' }}
        >
          {isLoading ? '...' : new Date(dateTime?.datetime || localTime).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })}
        </span>
      </div>
      
      {error && (
        <span className="text-[10px] text-red-400 hidden md:inline" title={error}>
          ⚠
        </span>
      )}
    </div>
  );
}

