document.getElementById("waterComplaintForm").addEventListener("submit", async function(event) {
  event.preventDefault(); // Prevent page refresh on form submission

  // Get form values
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const department = document.getElementById("dept").value.trim();
  const address = document.getElementById("address").value.trim();
  const issue_description = document.getElementById("description").value.trim();

  // Validate inputs
  if (!name || !email || !department || !address || !issue_description) {
      alert("All fields are required!");
      return;
  }

  // Prepare data to send
  const complaintData = {
      name,
      email,
      department,
      address,
      issue_description
  };

  try {
      // Send data to backend
      const response = await fetch("https://neristconnect.onrender.com/FWcomplaints/submit", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(complaintData)
      });

      const result = await response.json();

      if (response.ok) {
          document.getElementById("successMessage").style.display = "block"; // Show success message
          this.reset(); // Clear form fields
      } else {
          alert(result.error || "Failed to submit complaint.");
      }
  } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Error submitting complaint. Try again later.");
  }
});
