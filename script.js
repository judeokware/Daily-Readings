// Enhanced JavaScript code for the Daily Bible Readings website

// Function to fetch daily readings
async function fetchDailyReadings() {
    try {
        const response = await fetch('https://api.bible/readings/today');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        displayReadings(data);
    } catch (error) {
        console.error('Error fetching daily readings:', error);
    }
}

// Function to display readings on the webpage
function displayReadings(data) {
    const readingsContainer = document.getElementById('readings');
    readingsContainer.innerHTML = '';
    data.forEach(reading => {
        const readingElement = document.createElement('div');
        readingElement.textContent = `Scripture: ${reading.scripture}, Description: ${reading.description}`;
        readingsContainer.appendChild(readingElement);
    });
}

// Call the fetch function on page load
window.onload = fetchDailyReadings;