/** 

document.addEventListener('DOMContentLoaded', function () {
  const fileTypeSelect = document.getElementById("fileType");
  const fileTrackingTable = document.getElementById("fileTrackingTable").getElementsByTagName("tbody")[0];

  // Function to fetch file tracking data based on selected file type
  async function fetchFileTrackingData(fileType) {
    try {
      const response = await fetch(`http://localhost:5000/get-file-tracking?fileType=${fileType}`);
      const data = await response.json();

      // Clear previous table data
      fileTrackingTable.innerHTML = '';

      // Populate table with fetched data
      data.forEach(item => {
        const row = fileTrackingTable.insertRow();
        row.insertCell(0).innerText = item.name;
        row.insertCell(1).innerText = item.email;
        row.insertCell(2).innerText = item.location;
        row.insertCell(3).innerText = item.details;
        row.insertCell(4).innerText = item.status;
        row.insertCell(5).innerText = new Date(item.created_at).toLocaleString();
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Initially fetch all file types
  fetchFileTrackingData('all');

  // Add event listener to the dropdown to fetch data based on selected file type
  fileTypeSelect.addEventListener('change', function () {
    const selectedFileType = fileTypeSelect.value;
    fetchFileTrackingData(selectedFileType);
  });
});



// Handle the upload form
document.getElementById('uploadForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const fileInput = document.getElementById('file');

  if (!title || !description || fileInput.files.length === 0) {
    alert('Please fill in all fields and select a file.');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('file', fileInput.files[0]);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      alert(`File uploaded successfully!\nReference Number:\n${result.reference}`);
      document.getElementById('uploadForm').reset();
    } else {
      alert(`Upload failed: ${result.error}`);
    }
  } catch (err) {
    console.error('Upload Error:', err);
    alert('Something went wrong while uploading the file.');
  }
});
*/

// Upload File
document.getElementById('uploadForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const fileInput = document.getElementById('file');

  if (!title || !description || fileInput.files.length === 0) {
    alert('Please fill in all fields and select a file.');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('file', fileInput.files[0]);

  try {
    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      alert(`File uploaded successfully!\nReference Number:\n${result.reference}`);
      document.getElementById('uploadForm').reset();
    } else {
      alert(`Upload failed: ${result.error}`);
    }
  } catch (err) {
    console.error('Upload Error:', err);
    alert('Error uploading file.');
  }
});

// Track file by reference number
document.getElementById('trackForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const ref = document.getElementById('ref').value.trim();
  const trackResult = document.getElementById('trackResult');

  try {
    const response = await fetch(`http://localhost:5000/track-file?reference=${ref}`);
    const data = await response.json();

    if (response.ok && data) {
      trackResult.innerHTML = `
        <p><strong>Title:</strong> ${data.title}</p>
        <p><strong>Description:</strong> ${data.description}</p>
        <p><strong>Status:</strong> ${data.status}</p>
        <p><strong>Current Location:</strong> ${data.location}</p>
        <p><strong>Uploaded At:</strong> ${new Date(data.created_at).toLocaleString()}</p>
      `;
    } else {
      trackResult.textContent = 'No file found for this reference.';
    }
  } catch (err) {
    console.error(err);
    trackResult.textContent = 'Error retrieving file info.';
  }
});
