document.getElementById("complaintForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent page refresh on form submission

    // Get form values
    const student_name = document.getElementById("name").value.trim();
    const block_name = document.getElementById("block").value.trim();
    const department = document.getElementById("dept").value.trim();
    const room_number = document.getElementById("room").value.trim();
    const issue_description = document.getElementById("description").value.trim();

    // Validate inputs
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
        // Send data to backend
        const response = await fetch("http://localhost:5000/Ecomplaints/submit", {
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
