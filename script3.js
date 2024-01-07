// Function to populate the timetable with data
function populateTimetable(eventData) {
    // Function to check for overlapping events
    function getOverlappingEvents(currentEvent) {
        return eventData.filter(event => (
            event.Stage === currentEvent.Stage &&
            (
                (event.StartTime <= currentEvent.StartTime && currentEvent.StartTime < event.EndTime) ||
                (event.StartTime < currentEvent.EndTime && currentEvent.EndTime <= event.EndTime) ||
                (currentEvent.StartTime <= event.StartTime && event.StartTime < currentEvent.EndTime) ||
                (currentEvent.StartTime < event.EndTime && event.EndTime <= currentEvent.EndTime)
            )
        ));
    }

    // Function to add event elements to represent events
    function addEventElements(cell, event) {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');

        if (event.StartTime instanceof Date) {
            eventElement.style.top = `${(event.StartTime.getHours() - 18) * 60 + event.StartTime.getMinutes()}px`;

            const durationInMinutes = (event.EndTime - event.StartTime) / (1000 * 60);
            eventElement.style.height = `${durationInMinutes}px`;

            eventElement.innerHTML = `<strong>${event.EventName}</strong><br>${event.StartTime.toLocaleTimeString()} - ${event.EndTime.toLocaleTimeString()}<br>${event.Description}`;
        } else {
            // Handle the case where StartTime is not a valid Date object
            eventElement.innerHTML = `<strong>${event.EventName}</strong><br>${event.Description}`;
        }

        cell.appendChild(eventElement);
    }

    // Function to show overlapping events in a popup
    function showPopup(event, overlappingEvents) {
        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.innerHTML = `<p>Overlapping Events:</p>
                           <ul>${overlappingEvents.map(event => `<li>${event.EventName}</li>`).join('')}</ul>`;

        const rect = event.target.getBoundingClientRect();
        popup.style.top = `${rect.bottom}px`;
        popup.style.left = `${rect.left}px`;

        document.body.appendChild(popup);

        // Hide popup when clicking outside the popup
        document.body.addEventListener('click', function hidePopup(e) {
            if (!popup.contains(e.target) && e.target !== event.target) {
                document.body.removeChild(popup);
                document.body.removeEventListener('click', hidePopup);
            }
        });
    }

    // Function to add event listeners for hover and tap effects
    function addEventListeners(cell, event) {
        cell.addEventListener('mouseenter', (e) => {
            const overlappingEvents = getOverlappingEvents(event);
            if (overlappingEvents.length > 0) {
                showPopup(e, overlappingEvents);
            }
        });

        cell.addEventListener('click', (e) => {
            const overlappingEvents = getOverlappingEvents(event);
            if (overlappingEvents.length > 0) {
                showPopup(e, overlappingEvents);
            }
        });
    }

    // Clear existing rows
    tbody.innerHTML = '';

    // Populate the timetable with data and add event elements
    eventData.forEach(event => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.StartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
            <!-- Add more columns for additional stages -->
        `;
        tbody.appendChild(row);

        // Add event elements to represent events
        const cell = row.querySelector('td');
        addEventElements(cell, event);

        // Add event listeners for hover and tap effects
        addEventListeners(cell, event);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const tbody = document.querySelector('#timetable tbody');
    const timetable = document.getElementById('timetable');

    // Use the JSON data instead of fetching from CSV
    const eventData = eventDataJSON; // Replace with your actual JSON data
    populateTimetable(eventData);
});
