async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const messageElement = document.getElementById("message");

  try {
    const response = await fetch("http://localhost:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("username",username)
      messageElement.innerText = "Login successful!";
      messageElement.style.color = "#2d6a4f";
      setTimeout(() => {
        window.location.href = "home.html";
      }, 1500);
    } else {
      messageElement.innerText = "Login failed: " + (data.detail || "Unknown error");
      messageElement.style.color = "#d62828";
      shakeForm();
    }
  } catch (error) {
    console.error("Error:", error);
    messageElement.innerText = "An error occurred. Please try again.";
    messageElement.style.color = "#d62828";
    shakeForm();
  }
}

function shakeForm() {
  const container = document.querySelector('.container');
  container.classList.add('shake');
  setTimeout(() => {
    container.classList.remove('shake');
  }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.querySelector('.button');
  loginButton.addEventListener('click', (e) => {
    const rect = loginButton.getBoundingClientRect();
    const effect = loginButton.querySelector('.button-effect');
    effect.style.left = `${e.clientX - rect.left}px`;
    effect.style.top = `${e.clientY - rect.top}px`;
  });
});