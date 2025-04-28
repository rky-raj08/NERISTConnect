document.addEventListener("DOMContentLoaded", function () {
    // Get the form element
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Collect form data
        const name = document.getElementById("name").value.trim();
        const roll = document.getElementById("roll").value.trim();
        const email = document.getElementById("email").value.trim();
        const certificateType = document.getElementById("certificate").value.trim();
        const reason = document.getElementById("reason").value.trim();

        // Basic form validation
        if (!name || !roll || !email || !certificateType || !reason) {
            alert("All fields are required!");
            return;
        }

        // Construct the data object
        const certificateData = {
            name,
            roll,
            email,
            certificate_type: certificateType,
            reason,
        };

        try {
            // Sending data to the backend
            const response = await fetch("http://localhost:5000/certificate/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(certificateData),
            });

            let result;
            try {
                result = await response.json();
            } catch (jsonError) {
                throw new Error("Invalid JSON response from server.");
            }

            if (response.ok) {
                alert(result.message); // Show success message
                form.reset(); // Reset the form fields
            } else {
                alert("Error: " + (result.error || "Something went wrong"));
            }
        } catch (error) {
            console.error("Error submitting certificate request:", error);
            alert("Failed to connect to the server. Please try again later.");
        }
    });
});
