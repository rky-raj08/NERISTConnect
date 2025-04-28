// Redirect to the water complaint form page
function submitComplaint() {
    window.location.href = "Water_Complaints.html";
}

// Display alerts for water supply interruptions
function viewAlerts() {
    alert("🚱 Water supply will be interrupted in Block B and C from 2 PM to 5 PM due to maintenance.");
}

// Display water conservation tips
function viewTips() {
    const tips = [
        "💧 Turn off taps when brushing teeth.",
        "🚿 Take shorter showers.",
        "🪣 Use a bucket instead of a hose for washing.",
        "🔧 Fix leaking faucets immediately.",
        "🌧️ Harvest rainwater where possible.",
        "📦 Reuse greywater for gardening."
    ];
    
    let tipsMessage = "🌿 Water Conservation Tips:\n\n";
    tips.forEach((tip, index) => {
        tipsMessage += `${index + 1}. ${tip}\n`;
    });

    alert(tipsMessage);
}
