// Function to handle Bill Payment
function payBill() {
    // Simulating redirect to the payment gateway
    window.location.href = "paymentPage.html"; // Redirect to a payment page (create this page separately)
}

// Function to handle Usage Tracking
function trackUsage() {
    // Simulating displaying usage details
    const usageData = "Your electricity usage: \n- Daily: 10 kWh\n- Weekly: 70 kWh\n- Monthly: 300 kWh";
    alert(usageData);
}

// Function to handle Complaint Submission
function submitComplaint() {
     // Redirect to the complaint submission page
     window.location.href = "Electric_Complaint.html"; // Ensure this file exists
}

// Function to handle Alerts
function viewAlerts() {
    // Simulating displaying power outage alerts
    const alerts = "Upcoming Power Outages:\n- 25th Oct, 10:00 AM - 12:00 PM\n- 27th Oct, 3:00 PM - 5:00 PM";
    alert(alerts);
}

// Function to handle Viewing Energy Saving Tips
function viewTips() {
    const tips = [
        "1. Turn off lights when not in use.",
        "2. Use energy-efficient LED bulbs.",
        "3. Unplug devices when they’re not being used.",
        "4. Use a programmable thermostat to control cooling or heating."
    ];
    alert("Energy Saving Tips:\n" + tips.join("\n"));
}
