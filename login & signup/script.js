const loginToggleBtn = document.getElementById('login_toggle_btn');
const signupToggleBtn = document.getElementById('signup_toggle_btn');
const loginForm = document.getElementById('login_form');
const signupForm = document.getElementById('signup_form');
let check = localStorage.getItem('startShopping');

function authMode() {
    let authMode = localStorage.getItem('authMode');

    if (authMode === 'login') {
        loginToggleBtn.classList.add('active');
        signupToggleBtn.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    } else if (authMode === 'signup') {
        signupToggleBtn.classList.add('active');
        loginToggleBtn.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    }

}

authMode();

loginToggleBtn.addEventListener('click', () => {
    loginToggleBtn.classList.add('active');
    signupToggleBtn.classList.remove('active');
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
});

signupToggleBtn.addEventListener('click', () => {
    signupToggleBtn.classList.add('active');
    loginToggleBtn.classList.remove('active');
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
});


// === SUBMIT LOGIN FORM ===
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login_email').value;
    const password = document.getElementById('login_password').value;

    if (!email.trim() || !password.trim()) {
        alert('Please fill in both email and password fields.');
        return;
    }

    const userData = JSON.parse(localStorage.getItem('signupData'));

    if (!userData) {
        alert('No account found. Please sign up first.');
        return;
    }

    if (userData.email === email && userData.password === password) {
        alert(`Welcome back! Logged in as: ${userData.name}`);
        if (check === 'true') {
            location.href = '../Website/Products/products.html';
        } else {
            location.href = '../Website/Home/home.html';
        }
    } else {
        alert('Invalid email or password.');
    }
});

// === SUBMIT SIGN UP FORM ===
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signup_name').value;
    const email = document.getElementById('signup_email').value;
    const password = document.getElementById('signup_password').value;

    if (!name.trim() || !email.trim() || !password.trim()) {
        alert('Please fill in all fields.');
        return;
    }else{
        if (check === 'true') {
            location.href = '../Website/Products/products.html';
        } else {
            location.href = '../Website/Home/home.html';
        }
    }

    const signupData = {
        name: name,
        email: email,
        password: password
    };
    localStorage.setItem('signupData', JSON.stringify(signupData));

    alert(`Account created successfully for ${name}!`);

});