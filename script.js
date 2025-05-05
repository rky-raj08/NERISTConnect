const loginForm = document.getElementById('login-form')
// const handleLogin = () =>{    
//     console.log('clicked')
// }

// dfghjkl;
document.addEventListener('DOMContentLoaded', function(){
    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')
    if(username && password){
        window.location.href = "./W_page.html"
    }
})

const loginUser = async (username, password) => {
    // result = false;
    const res = await fetch('https://neristconnect.onrender.com/login', {
        method: "POST",
        body: JSON.stringify({ username: username, password_hash: password }),
        headers: {
            "Content-Type": "application/json",
        },
    })

    return res;
}


const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const password = e.target[1].value;

    try {
        const res = await loginUser(username, password);

        // Check if the response is JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await res.text(); // Read the plain error message
            throw new Error(`Unexpected response: ${text}`);
        }

        const json = await res.json();

        if (json.error) {
            alert(json.error);
        } else {
            localStorage.setItem("username", json.user.username);
            localStorage.setItem("password", json.user.password_hash);
            window.location.href = "./W_page.html";
        }
    } catch (err) {
        console.error("Login failed:", err.message);
        alert("Login failed: " + err.message);
    }
};



// loginBtn.addEventListener('click',handleLogin)

loginForm.addEventListener('submit', (e) => handleLogin(e))





