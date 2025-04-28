document.getElementById('complaintForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect the form data
    const complaintData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value || 'N/A',
        category: document.getElementById('category').value,
        priority: document.getElementById('priority').value,
        details: document.getElementById('details').value
    };

    try {
        // console.log('here1')
        const response = await fetch('http://localhost:5000/complaint1/submit', {
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

