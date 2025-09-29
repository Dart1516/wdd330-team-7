// src/js/Alert.js

// Function to fetch the JSON data
async function getAlerts() {
    try {
        // NOTE: Adjust this path if your alerts.json is not in a /json/ folder
        const response = await fetch('/json/alerts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Could not fetch alerts:", error);
        return []; // Return an empty array on failure
    }
}

// The main Alert class, exported as default
export default class Alert {
    constructor() {
        // Selector for the main content area of the page
        this.mainElement = document.querySelector('main');
        this.init();
    }

    async init() {
        const alerts = await getAlerts();

        if (alerts.length > 0) {
            this.buildAlerts(alerts);
        }
    }

    buildAlerts(alerts) {
        // 1. Create the <section class="alert-list"> element
        const alertSection = document.createElement('section');
        alertSection.className = 'alert-list';

        // 2. Loop through the results and build a <p> for each alert
        alerts.forEach(alert => {
            const p = document.createElement('p');
            p.textContent = alert.message;

            // Apply background and foreground colors
            p.style.backgroundColor = alert.background;
            p.style.color = alert.color;

            alertSection.appendChild(p);
        });

        // 3. Prepend the <section> to the main element
        if (this.mainElement) {
            this.mainElement.prepend(alertSection);
        }
    }
}