document.addEventListener("DOMContentLoaded", function () {
    fetchBooks(); // Load books when the page loads

    document.getElementById("bookForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Collect book details from the form
        const bookData = {
            name: document.getElementById("bookName").value,
            author: document.getElementById("author").value,
            category: document.getElementById("category").value,
            isbn: document.getElementById("isbn").value
        };

        try {
            // Send book details to the server
            const response = await fetch("https://neristconnect.onrender.com/books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookData)
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message); // Show success message
                document.getElementById("bookForm").reset(); // Reset form
                fetchBooks(); // Reload books
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error("Error adding book:", error);
            alert("Server error! Please try again later.");
        }
    });
});

// Function to Fetch and Display Books
async function fetchBooks() {
    try {
        const response = await fetch("https://neristconnect.onrender.com/books");
        const books = await response.json();
        const bookTable = document.getElementById("bookTable");
        bookTable.innerHTML = ""; // Clear previous entries

        books.forEach(book => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${book.name}</td>
                <td>${book.author}</td>
                <td>${book.category}</td>
                <td>${book.isbn}</td>
                <td><button class="delete-btn" onclick="deleteBook(${book.id})">Delete</button></td>
            `;
            bookTable.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

// Function to Delete a Book
async function deleteBook(id) {
    if (!confirm("Are you sure you want to delete this book?")) return; // Confirmation alert

    try {
        const response = await fetch(`https://neristconnect.onrender.com/books/${id}`, { method: "DELETE" });
        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            fetchBooks(); // Refresh book list
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error deleting book:", error);
        alert("Server error! Please try again later.");
    }
}
