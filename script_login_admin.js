/**const loginForm = document.getElementById('login-form')



// const handleLogin = () =>{    
//     console.log('clicked')
// }
const loginUser = async (username, password) => {
    result = false;
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
    e.preventDefault()
    const username = e.target[0].value
    const password = e.target[1].value
    const res = loginUser(username, password)
    res
        .then((response) => response.json())
        .then(json => {
            if(json.error){
                alert(json.error)
            }else{
         
                // redirect 
                console.log(json.user);
                localStorage.setItem("username",json.user.username)
                localStorage.setItem("password",json.user.password_hash)
                window.location.href = "/Admin/Dashboard.html"
            }
        })
        .catch(err => {
            console.log(err,"dskgn")
        })

    // console.log(e.target[0].value)
    // console.log(e.target[1].value)

}


// loginBtn.addEventListener('click',handleLogin)

loginForm.addEventListener('submit', (e) => handleLogin(e))
*/


const loginForm = document.getElementById('login-form');

const loginAdmin = async (username, password) => {
    const res = await fetch('https://neristconnect.onrender.com/admin-login', {
        method: "POST",
        body: JSON.stringify({ username: username, password_hash: password }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    return res;
};

const handleLogin = async (e) => {
    e.preventDefault();

    const username = e.target[0].value;
    const password = e.target[1].value;

    try {
        const response = await loginAdmin(username, password);
        const json = await response.json();

        if (json.error) {
            alert(json.error);
        } else {
            console.log(json.admin);

            // Save admin login details if needed
            localStorage.setItem("admin_username", json.admin.username);
            localStorage.setItem("admin_password", json.admin.password_hash);

            // Redirect to Admin Dashboard
            window.location.href = "/Admin/Dashboard.html";
        }
    } catch (err) {
        console.error("Admin login error:", err);
        alert("Something went wrong. Please try again.");
    }
};

loginForm.addEventListener('submit', handleLogin);


