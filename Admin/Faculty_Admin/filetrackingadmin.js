/** 

document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('#fileTable tbody');
  
    async function fetchFiles() {
      const response = await fetch('http://localhost:5000/admin/files');
      const files = await response.json();
      tableBody.innerHTML = '';
      files.forEach(file => {
        const row = tableBody.insertRow();
        row.innerHTML = `
          <td>${file.reference}</td>
          <td>${file.title}</td>
          <td>${file.description}</td>
          <td>${file.location}</td>
          <td>${file.status}</td>
          <td><input type="text" value="${file.location}" class="locInput" /></td>
          <td><input type="text" value="${file.status}" class="statusInput" /></td>
          <td><button class="updateBtn">Update</button></td>
        `;
  
        row.querySelector('.updateBtn').addEventListener('click', async () => {
          const newLoc = row.querySelector('.locInput').value;
          const newStatus = row.querySelector('.statusInput').value;
          const ref = file.reference;
  
          const res = await fetch('http://localhost:5000/admin/update-file', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference: ref, location: newLoc, status: newStatus })
          });
  
          const result = await res.json();
          if (res.ok) {
            alert('Updated successfully!');
            fetchFiles(); // refresh table
          } else {
            alert(`Error: ${result.error}`);
          }
        });
      });
    }
  
    fetchFiles();
  });
  
  */

  document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('#fileTable tbody');
  
    async function fetchFiles() {
      const response = await fetch('http://localhost:5000/admin/files');
      const files = await response.json();
      tableBody.innerHTML = '';
  
      files.forEach(file => {
        const row = tableBody.insertRow();
        row.innerHTML = `
          <td>${file.reference}</td>
          <td>${file.title}</td>
          <td>${file.description}</td>
          <td>${file.location}</td>
          <td>${file.status}</td>
  
          <!-- ✅ Added view/download file link -->
          <td><a href="http://localhost:5000${file.filepath}" target="_blank">View File</a></td>
  
          <td><input type="text" value="${file.location}" class="locInput" /></td>
          <td><input type="text" value="${file.status}" class="statusInput" /></td>
          <td><button class="updateBtn">Update</button></td>
        `;
  
        // Update button event
        row.querySelector('.updateBtn').addEventListener('click', async () => {
          const newLoc = row.querySelector('.locInput').value;
          const newStatus = row.querySelector('.statusInput').value;
          const ref = file.reference;
  
          const res = await fetch('http://localhost:5000/admin/update-file', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference: ref, location: newLoc, status: newStatus })
          });
  
          const result = await res.json();
          if (res.ok) {
            alert('Updated successfully!');
            fetchFiles(); // refresh table
          } else {
            alert(`Error: ${result.error}`);
          }
        });
      });
    }
  
    fetchFiles();
  });
  