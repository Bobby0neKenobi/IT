const userNameContainer = document.getElementById('user-name');
const scoreContainer = document.getElementById('score');

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:3000/admin/score?user_id=1');

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }

    const data = await response.json(); // Parse JSON response (assuming JSON format)

    // Display fetched data (modify based on your data structure)
    userNameContainer.textContent = data['user_id'];
    scoreContainer.textContent = data['score'];
  } catch (error) {
    console.error('Error fetching data:', error);
    userNameContainer.textContent = 'Error fetching data.';
  }
});