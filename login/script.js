const form = document.getElementById('loginForm');
const message = document.getElementById('message');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Replace with your own credentials
  const validUsername = "jayson";
  const validPassword = "Flores";

  if (username === validUsername && password === validPassword) {
    message.style.color = "green";
    message.textContent = "Login successful!";
    // Redirect or do something
    setTimeout(() => {
      window.location.href = "https://example.com/dashboard"; // Replace as needed
    }, 1000);
  } else {
    message.style.color = "red";
    message.textContent = "Invalid username or password!";
  }
});
