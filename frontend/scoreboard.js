// const userNameContainer = document.getElementById('user-name');
// const scoreContainer = document.getElementById('score');
// const urlParams = new URLSearchParams(window.location.search);

$(document).ready(async () => {
  // let score = null;
  // let user_name = null;
  
  const userData = JSON.parse(sessionStorage.getItem("loggedInUser"));
  $("#username").text(userData.user_name);

  let data = null;
  try {
    //const response = await fetch(`https://18.197.60.144/admin/score`);
    const response = await fetch(`https://localhost/admin/score`);

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }

    data = await response.json(); // Parse JSON response (assuming JSON format)
    console.log(data['scores']);
    // Display fetched data (modify based on your data structure)
    // userNameContainer.textContent = data['user_id'];
    // scoreContainer.textContent = data['score'];
    // score = data['scores'][0]['score'];
    // user_name = data['scores'][0]['user_name'];
  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('table').textContent = 'Error fetching data.';
  }
  
  const table = $('#table');
  table.append('<tr><th class="rank">Rank</th><th>User name</th><th>Score</th></tr>')
  for(i = 0; i < data['scores'].length; i++){
    table.append(`<tr><td class="rank">${i + 1}</td><td>${data['scores'][i]['user_name']}</td><td>${data['scores'][i]['score']}</td></tr>`);
  }
});

function logOut(){
  sessionStorage.removeItem("loggedInUser");
  window.location.href = "logIn.html";
}