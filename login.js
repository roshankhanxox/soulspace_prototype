async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

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
        document.getElementById("message").innerText = "Login successful!";
        window.location.href = "moodlog.html";
      } else {
        document.getElementById("message").innerText = "Login failed: " + (data.detail || "Unknown error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }