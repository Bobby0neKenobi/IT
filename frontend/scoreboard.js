// const userNameContainer = document.getElementById('user-name');
// const scoreContainer = document.getElementById('score');
const urlParams = new URLSearchParams(window.location.search);

document.addEventListener('DOMContentLoaded', async () => {
  let score = null;
  let user_name = null;
  try {
    const response = await fetch(`https://localhost:3000/admin/score`);

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }

    const data = await response.json(); // Parse JSON response (assuming JSON format)

    // Display fetched data (modify based on your data structure)
    // userNameContainer.textContent = data['user_id'];
    // scoreContainer.textContent = data['score'];
    score = data['scores'][0]['score'];
    user_name = data['scores'][0]['user_name'];
  } catch (error) {
    console.error('Error fetching data:', error);
    userNameContainer.textContent = 'Error fetching data.';
  }
  
  const table = document.getElementById('table');
  table.innerHTML = `<tr><td>${score}</td><td>${user_name}</td></tr>`;
});