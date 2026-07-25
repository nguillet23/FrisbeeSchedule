// Category Configuration
const categories = {
  Category1: "category-1",
  Category2: "category-2",
  Category3: "category-3"
};

// Schedule Data
const schedule = {
  Monday: [
    {
      category: "Category1",
      start: "1:00 PM",
      end: "5:00 PM"
    },
    {
      category: "Category2",
      start: "6:00 PM",
      end: "7:30 PM"
    }
  ],
  Tuesday: [
    {
      category: "Category2",
      start: "12:00 PM",
      end: "2:00 PM"
    }
  ],
  Wednesday: [],
  Thursday: [
    {
      category: "Category1",
      start: "1:00 PM",
      end: "5:00 PM"
    }
  ],
  Friday: [],
  Saturday: [
    {
      category: "Category2",
      start: "2:00 PM",
      end: "4:00 PM"
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
        entryElement.style.height = Math.max(height, 30) + "px"; // Min height of 30px for visibility

        const categoryBadge = document.createElement("span");
        categoryBadge.className = "category-badge";
        categoryBadge.textContent = entry.category;

        const timeText = document.createElement("span");
        timeText.className = "time";
        timeText.textContent = `${entry.start} – ${entry.end}`;

        entryElement.appendChild(categoryBadge);
        entryElement.appendChild(timeText);
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