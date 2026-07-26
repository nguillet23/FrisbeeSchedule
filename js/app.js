// Category Configuration
const categories = {
  Practice: "category-1",
  Throws: "category-2",
  Tournament: "category-3",
  Scrimmage: "category-4",
  "Frisbee Friday": "category-5"
};

// Schedule Data
const schedule = {
  Monday: [
    {
      category: "Practice",
      start: "5:00 PM",
      end: "7:00 PM",
      location: "Pike Field"
    }
  ],
  Tuesday: [
    {
      category: "Throws",
      start: "5:00 PM",
      end: "5:30 PM",
      location: "Outside Drosdick"
    }
  ],
  Wednesday: [
    {
      category: "Practice",
      start: "5:00 PM",
      end: "7:00 PM",
      location: "Pike Field"
    }
  ],
  Thursday: [
    {
      category: "Throws",
      start: "6:00 PM",
      end: "7:00 PM",
      location: "Sheehan Beach"
    }
  ],
  Friday: [
    {
      category: "Throws",
      start: "12:00 PM",
      end: "4:00 PM",
      location: "Where Ever"
    }, 
    {
      category: "Frisbee Friday",
      start: "5:00 PM",
      end: "7:00 PM",
      location: "Where Ever"
    }
  ],
  Saturday: [
    {
      category: "Throws",
      start: "2:00 PM",
      end: "4:00 PM",
      location: "Where Ever"
    }
  ],
  Sunday: []
};

// Convert time string to minutes from midnight
function timeToMinutes(timeStr) {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
}

// Generate time axis
function renderTimeAxis() {
  const timeAxis = document.getElementById("timeAxis");
  timeAxis.innerHTML = "";
  
  const startHour = 12; // 12 PM
  const endHour = 22; // 10 PM
  const hourHeight = 60; // pixels per hour
  
  for (let hour = startHour; hour <= endHour; hour++) {
    const timeLabel = document.createElement("div");
    timeLabel.className = "time-label";
    timeLabel.style.height = hourHeight + "px";
    
    let displayHour = hour;
    let period = "PM";
    if (hour > 12) {
      displayHour = hour - 12;
    }
    
    timeLabel.textContent = `${displayHour}:00 ${period}`;
    timeAxis.appendChild(timeLabel);
  }
}

// Render Schedule
function renderSchedule() {
  const scheduleElement = document.getElementById("schedule");
  scheduleElement.innerHTML = "";

  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const startHour = 12; // 12 PM (noon)
  const endHour = 22; // 10 PM
  const hourHeight = 60; // pixels per hour
  const totalHours = endHour - startHour;
  const totalHeight = totalHours * hourHeight;

  dayOrder.forEach(day => {
    const entries = schedule[day];
    const dayColumn = document.createElement("div");
    dayColumn.className = "day-column";

    if (!entries || entries.length === 0) {
      const unavailable = document.createElement("div");
      unavailable.className = "unavailable";
      unavailable.textContent = "Unavailable";
      dayColumn.appendChild(unavailable);
    } else {
      // Create a grid for positioning entries
      const gridContainer = document.createElement("div");
      gridContainer.className = "time-grid";
      gridContainer.style.height = totalHeight + "px";

      entries.forEach(entry => {
        const startMinutes = timeToMinutes(entry.start);
        const endMinutes = timeToMinutes(entry.end);
        
        // Calculate position as offset from startHour
        const minutesFromStart = startMinutes - (startHour * 60);
        const topOffset = (minutesFromStart / 60) * hourHeight;
        
        // Calculate height based on duration
        const durationMinutes = endMinutes - startMinutes;
        const height = (durationMinutes / 60) * hourHeight;

        const entryElement = document.createElement("div");
        entryElement.className = `entry ${categories[entry.category]}`;
        entryElement.style.top = topOffset + "px";
        const boxHeight = Math.max(height, 30);
        entryElement.style.height = boxHeight + "px"; // Min height of 30px for visibility

        // Calculate dynamic font sizes based on box height
        let badgeFontSize = 0.7;
        let timeFontSize = 0.75;
        let locationFontSize = 0.65;
        let padding = 8;
        let gap = 2;

        if (boxHeight < 45) {
          // Very small box - minimal sizing
          badgeFontSize = 0.55;
          timeFontSize = 0.6;
          locationFontSize = 0.5;
          padding = 4;
          gap = 1;
        } else if (boxHeight < 60) {
          // Small box - reduced sizing
          badgeFontSize = 0.6;
          timeFontSize = 0.65;
          locationFontSize = 0.55;
          padding = 5;
          gap = 1;
        } else if (boxHeight < 90) {
          // Medium box - standard sizing
          badgeFontSize = 0.68;
          timeFontSize = 0.72;
          locationFontSize = 0.62;
          padding = 6;
          gap = 2;
        }

        entryElement.style.padding = padding + "px";
        entryElement.style.gap = gap + "px";

        const categoryBadge = document.createElement("span");
        categoryBadge.className = "category-badge";
        categoryBadge.textContent = entry.category;
        categoryBadge.style.fontSize = badgeFontSize + "rem";

        const timeText = document.createElement("span");
        timeText.className = "time";
        timeText.textContent = `${entry.start} – ${entry.end}`;
        timeText.style.fontSize = timeFontSize + "rem";

        entryElement.appendChild(categoryBadge);
        entryElement.appendChild(timeText);

        // Location subtitle (only rendered if a location is provided)
        if (entry.location) {
          const locationText = document.createElement("span");
          locationText.className = "location";
          locationText.textContent = entry.location;
          locationText.style.fontSize = locationFontSize + "rem";
          entryElement.appendChild(locationText);
        }

        gridContainer.appendChild(entryElement);
      });

      dayColumn.appendChild(gridContainer);
    }

    scheduleElement.appendChild(dayColumn);
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  renderTimeAxis();
  renderSchedule();
});