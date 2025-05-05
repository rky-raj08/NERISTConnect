/** 

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("complaintForm");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const responseDiv = document.getElementById("response");

        try {
            const response = await fetch("https://neristconnect.onrender.com/faculty-complaint", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                form.reset();
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Something went wrong. Please try again later.");
        }
    });
});
*/

document.getElementById('complaintForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect the form data
    const complaintData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        department: document.getElementById('department').value,
        category: document.getElementById('category').value,
        priority: document.getElementById('priority').value,
        details: document.getElementById('details').value
    };

    try {
        const response = await fetch('https://neristconnect.onrender.com/faculty-complaint/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(complaintData)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            document.getElementById('complaintForm').reset();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error submitting complaint:', error);
        alert('Server error! Try again later.');
    }
});
