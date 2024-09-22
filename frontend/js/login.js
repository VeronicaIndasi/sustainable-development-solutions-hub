document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
      const response = await fetch('http://localhost:4000/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (response.ok) {
          alert('Login successful!');
      } else {
          alert(result.error || 'Login failed');
      }
  } catch (error) {
      console.error('Error logging in:', error);
  }
});
