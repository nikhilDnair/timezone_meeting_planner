import { useState, useEffect, useMemo } from 'react'
import { DateTime } from 'luxon'
import './MeetingPlanner.css'

// Common cities with their timezone names
const COMMON_CITIES = [
  { name: 'New York', timezone: 'America/New_York' },
  { name: 'Los Angeles', timezone: 'America/Los_Angeles' },
  { name: 'Chicago', timezone: 'America/Chicago' },
  { name: 'Denver', timezone: 'America/Denver' },
  { name: 'London', timezone: 'Europe/London' },
  { name: 'Paris', timezone: 'Europe/Paris' },
  { name: 'Berlin', timezone: 'Europe/Berlin' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { name: 'Sydney', timezone: 'Australia/Sydney' },
  { name: 'Singapore', timezone: 'Asia/Singapore' },
  { name: 'Dubai', timezone: 'Asia/Dubai' },
  { name: 'Mumbai', timezone: 'Asia/Kolkata' },
  { name: 'Shanghai', timezone: 'Asia/Shanghai' },
  { name: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
  { name: 'Toronto', timezone: 'America/Toronto' },
  { name: 'Vancouver', timezone: 'America/Vancouver' },
  { name: 'São Paulo', timezone: 'America/Sao_Paulo' },
  { name: 'Mexico City', timezone: 'America/Mexico_City' },
  { name: 'Moscow', timezone: 'Europe/Moscow' },
  { name: 'Cairo', timezone: 'Africa/Cairo' },
  { name: 'Johannesburg', timezone: 'Africa/Johannesburg' },
  { name: 'Seoul', timezone: 'Asia/Seoul' },
  { name: 'Bangkok', timezone: 'Asia/Bangkok' },
  { name: 'Jakarta', timezone: 'Asia/Jakarta' },
]

function MeetingPlanner() {
  const [cities, setCities] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedHour, setSelectedHour] = useState(new Date().getHours())
  const [showDropdown, setShowDropdown] = useState(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.search-wrapper')) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown])

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return COMMON_CITIES
    const query = searchQuery.toLowerCase()
    return COMMON_CITIES.filter(
      city => city.name.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Add a city to the list
  const addCity = (city) => {
    if (!cities.find(c => c.timezone === city.timezone)) {
      setCities([...cities, city])
      setSearchQuery('')
      setShowDropdown(false)
    }
  }

  // Remove a city from the list
  const removeCity = (timezone) => {
    setCities(cities.filter(c => c.timezone !== timezone))
  }

  // Get time for a city at the selected hour (in UTC)
  const getCityTime = (timezone, baseHour) => {
    const now = DateTime.now()
    // Create UTC time with the selected hour
    const utcTime = DateTime.utc(now.year, now.month, now.day, baseHour, 0, 0)
    // Convert to city timezone
    const cityTime = utcTime.setZone(timezone)
    
    return cityTime
  }

  // Get color for a time slot
  const getTimeSlotColor = (hour) => {
    if (hour >= 9 && hour < 17) return 'working' // 9 AM - 5 PM
    if (hour >= 7 && hour < 23) return 'waking' // 7 AM - 11 PM
    return 'sleeping' // Others
  }

  // Copy meeting link
  const copyMeetingLink = () => {
    const now = DateTime.now()
    const utcTime = DateTime.utc(now.year, now.month, now.day, selectedHour, 0, 0)
    
    const times = cities.map(city => {
      const cityTime = getCityTime(city.timezone, selectedHour)
      return `${city.name}: ${cityTime.toFormat('h:mm a ZZZZ')}`
    }).join(' | ')
    
    const meetingString = `Meeting Time: ${utcTime.toFormat('MMMM dd, yyyy h:mm a')} UTC | ${times}`
    
    navigator.clipboard.writeText(meetingString).then(() => {
      alert('Meeting link copied to clipboard!')
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = meetingString
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      alert('Meeting link copied to clipboard!')
    })
  }

  return (
    <div className="meeting-planner">
      <h1>Multiple Timezone Meeting Planner</h1>
      
      {/* City Search */}
      <div className="city-search-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            className="city-search-input"
          />
          {showDropdown && filteredCities.length > 0 && (
            <div className="city-dropdown">
              {filteredCities.map(city => (
                <div
                  key={city.timezone}
                  className="city-option"
                  onClick={() => addCity(city)}
                >
                  {city.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Cities */}
      {cities.length > 0 && (
        <div className="cities-container">
          <h2>Selected Cities</h2>
          <div className="cities-list">
            {cities.map(city => (
              <div key={city.timezone} className="city-card">
                <div className="city-header">
                  <h3>{city.name}</h3>
                  <button
                    className="remove-city-btn"
                    onClick={() => removeCity(city.timezone)}
                    aria-label={`Remove ${city.name}`}
                  >
                    ×
                  </button>
                </div>
                <div className="city-time">
                  {getCityTime(city.timezone, selectedHour).toFormat('h:mm:ss a')}
                </div>
                <div className="city-date">
                  {getCityTime(city.timezone, selectedHour).toFormat('EEEE, MMMM dd, yyyy')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 24-Hour Slider */}
      {cities.length > 0 && (
        <div className="time-slider-container">
          <h2>Select Meeting Time</h2>
          <div className="slider-wrapper">
            <input
              type="range"
              min="0"
              max="23"
              value={selectedHour}
              onChange={(e) => setSelectedHour(parseInt(e.target.value))}
              className="time-slider"
            />
            <div className="slider-labels">
              <span>12 AM</span>
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>11 PM</span>
            </div>
            <div className="selected-hour-display">
              Selected: {DateTime.utc(DateTime.now().year, DateTime.now().month, DateTime.now().day, selectedHour, 0).toFormat('h:mm a')} UTC
            </div>
          </div>
        </div>
      )}

      {/* Time Grid */}
      {cities.length > 0 && (
        <div className="time-grid-container">
          <h2>24-Hour Time Grid</h2>
          <div className="time-grid">
            {cities.map(city => (
              <div key={city.timezone} className="city-time-row">
                <div className="city-label">{city.name}</div>
                <div className="hours-grid">
                  {Array.from({ length: 24 }, (_, hour) => {
                    const cityTime = getCityTime(city.timezone, hour)
                    const cityHour = cityTime.hour
                    const colorClass = getTimeSlotColor(cityHour)
                    const isSelected = hour === selectedHour
                    
                    return (
                      <div
                        key={hour}
                        className={`hour-slot ${colorClass} ${isSelected ? 'selected' : ''}`}
                        title={`UTC ${hour}:00 = ${city.name}: ${cityTime.toFormat('h:mm a')}`}
                        onClick={() => setSelectedHour(hour)}
                      >
                        <span className="hour-label">{hour}</span>
                        <span className="city-hour">{cityHour}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Copy Meeting Link Button */}
      {cities.length > 0 && (
        <div className="copy-button-container">
          <button className="copy-meeting-btn" onClick={copyMeetingLink}>
            Copy Meeting Link
          </button>
        </div>
      )}

      {/* Legend */}
      {cities.length > 0 && (
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color working"></div>
            <span>Working Hours (9 AM - 5 PM)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color waking"></div>
            <span>Waking Hours (7 AM - 9 PM)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color sleeping"></div>
            <span>Sleeping Hours</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MeetingPlanner
