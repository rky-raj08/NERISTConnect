let adminEmail = "";

function showStep(stepId) {
  const steps = document.querySelectorAll('.step');
  steps.forEach(step => step.classList.remove('active'));
  document.getElementById(stepId).classList.add('active');
  document.getElementById("message").textContent = "";
  document.getElementById("error").textContent = "";
}

async function sendAdminOTP() {
  adminEmail = document.getElementById("email").value;

  const res = await fetch('http://localhost:5000/admin/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail })
  });

  const data = await res.json();
  if (res.ok) {
    showStep("otp-step");
    document.getElementById("message").textContent = data.message;
  } else {
    document.getElementById("error").textContent = data.error || "Something went wrong.";
  }
}

async function verifyAdminOTP() {
  const otp = document.getElementById("otp").value;

  const res = await fetch('http://localhost:5000/admin/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, otp })
  });

  const data = await res.json();
  if (res.ok) {
    showStep("reset-step");
    document.getElementById("message").textContent = data.message;
  } else {
    document.getElementById("error").textContent = data.error || "Invalid OTP.";
  }
}

async function resetAdminPassword() {
  const newPassword = document.getElementById("new-password").value;
  const otp = document.getElementById("otp").value;

  const res = await fetch('http://localhost:5000/admin/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, otp, newPassword })
  });

  const data = await res.json();
  if (res.ok) {
    alert("✅ Admin password reset successful!");
    document.getElementById("message").textContent = data.message;
    setTimeout(() => {
      showStep("email-step");
    }, 1500);
  } else {
    document.getElementById("error").textContent = data.error || "Reset failed.";
  }
}
