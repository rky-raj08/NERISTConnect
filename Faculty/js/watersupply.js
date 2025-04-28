// Function for submitting a complaint
function submitComplaint() {
    window.location.href = "/Faculty/pages/watercomplaint.html";
}

// Function for viewing water supply alerts
function viewAlerts() {
    const alerts = [
        "🚰 Water supply will be disrupted in Zone 1 from 10 AM - 12 PM.",
        "⚠️ Emergency water maintenance in Zone 3 from 2 PM - 4 PM.",
        "💧 Normal water supply will resume at 6 PM in Zone 5."
    ];
    alert("Water Supply Alerts:\n\n" + alerts.join("\n"));
}

// Function for viewing water conservation tips
function viewTips() {
    const tips = [
        "✅ Fix leaks promptly to save water.",
        "✅ Turn off the tap while brushing your teeth.",
        "✅ Use water-efficient appliances.",
        "✅ Collect rainwater for watering plants."
    ];
    alert("Water Conservation Tips:\n\n" + tips.join("\n"));
}