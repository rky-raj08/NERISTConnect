// frontend/js/leave.js

document.addEventListener('DOMContentLoaded', () => {
    // Scroll to the submit button when the page is loaded
    const submitButton = document.getElementById('submit-btn');
    if (submitButton) {
        submitButton.scrollIntoView({ behavior: 'smooth' });
    }

    const form = document.querySelector('form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // stop the form from refreshing the page
        // Gather all the form data
        const formData = {
            name: document.getElementById('name').value,
            designation: document.getElementById('designation').value,
            department: document.getElementById('department').value,
            no_of_days: document.getElementById('no_of_days').value,
            departure_date: document.getElementById('departure_date').value,
            arrival_date: document.getElementById('arrival_date').value,
            reason: document.getElementById('reason').value,
            email: document.getElementById('email').value,
            substitution: document.getElementById('substitution').value
        };

        try {
            const response = await fetch('http://localhost:5000/leave', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message); // Success message
                form.reset(); // Reset the form fields
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Something went wrong. Please try again later.');
        }
    });
});
