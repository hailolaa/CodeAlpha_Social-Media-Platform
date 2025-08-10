import { getCurrentUser } from './utils.js';

import { saveAuth } from './utils.js';



  document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser(); // Should return { _id: "...", ... }
    const profileLink = document.getElementById('profile-link');

    if (currentUser && currentUser._id) {
      profileLink.href = `profile.html?id=${currentUser._id}`;
    } else {
      profileLink.href = 'auth.html'; // fallback if not logged in
    }
  });


document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log("Submitting:", { username, email, password }); // <-- TEMP log

  const res = await fetch("http://localhost:5000/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });

  const data = await res.json();
  alert("Registered successfully!");
  window.location.href = "login.html";
});




document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const res = await fetch("http://localhost:5000/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  });

  const data = await res.json();

  if (res.ok) {
    saveAuth(data.token, data.user);
    window.location.href = "feed.html";
    

  } else {
    alert(data.msg);
  }
});



document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});



const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');

    showRegister.addEventListener('click', () => {
      loginForm.style.transform = 'translateX(-100%)';
      registerForm.style.transform = 'translateX(0)';
    });

    showLogin.addEventListener('click', () => {
      loginForm.style.transform = 'translateX(0)';
      registerForm.style.transform = 'translateX(100%)';
    });





