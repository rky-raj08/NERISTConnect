document.getElementById("waterComplaintForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent page refresh on submit

    // Get input values
    const student_name = document.getElementById("name").value.trim();
    const block_name = document.getElementById("block").value.trim();
    const department = document.getElementById("dept").value.trim();
    const room_number = document.getElementById("room").value.trim();
    const issue_description = document.getElementById("description").value.trim();

    // Validate required fields
    if (!student_name || !block_name || !department || !room_number || !issue_description) {
        alert("All fields are required!");
        return;
    }

    // Prepare data to send
    const complaintData = {
        student_name,
        block_name,
        department,
        room_number,
        issue_description
    };

    try {
        // Send POST request to the backend
        const response = await fetch("http://localhost:5000/FWcomplaints", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(complaintData)
        });

        const result = await response.json();

        if (response.ok) {
            // Show success message
            const successMsg = document.getElementById("successMessage");
            successMsg.style.display = "block";

            // Hide message after 3 seconds
            setTimeout(() => {
                successMsg.style.display = "none";
            }, 3000);

            this.reset(); // Reset form
        } else {
            alert(result.error || "Failed to submit complaint.");
        }
    } catch (error) {
        console.error("Submission error:", error);
        alert("Something went wrong. Please try again later.");
    }
});
