//consts
const scoreEl = document.querySelector("#scoreEl"); //score Element
const canvas = document.querySelector("canvas"); //game canvas
const c = canvas.getContext("2d"); //dimentions

//canvas settings
canvas.width = 1024; //width
canvas.height = 576; //height

//lets
let player = new Player(); //create player
let projectiles = []; //projectiles array
let grids = []; //grids array
let invaderProjectiles = []; //invader projectiles array
let particles = []; //particles array
let bombs = []; //bombs array
let powerUps = []; //powerups array
let lastShootTime = 0;
let keys = {
  //set used keys
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

let frames = 0; //every frame the game is active
let randomInterval = Math.floor(Math.random() * 500 + 500); //random interval
let game = {
  //game information
  over: false,
  active: true,
};
let score = 0; //score

let spawnBuffer = 500;
let fps = 60; //frames per second
let fpsInterval = 1000 / fps; //for how many seconds a frame passes
let msPrev = window.performance.now(); //previous miliseconds

//main process module
//restart all lets
function init() {
  player = new Player();
  projectiles = [];
  grids = [];
  invaderProjectiles = [];
  particles = [];
  bombs = [];
  powerUps = [];

  keys = {
    a: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
    space: {
      pressed: false,
    },
  };

  frames = 0;
  randomInterval = Math.floor(Math.random() * 500 + 500);
  game = {
    over: false,
    active: true,
  };
  score = 0;
  scoreEl.innerHTML = score; //make new(restarted) score to 0

  for (let i = 0; i < 100; i++) {
    //stars
    particles.push(
      new Particle({
        position: {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
        },
        velocity: {
          x: 0,
          y: 0.5,
        },
        radius: Math.random() * 2,
        color: "white",
      })
    );
  }
}
//game ends
function endGame() {
  audio.gameOver.play(); //audio
  if (audio.gameOver.volume === 0) {
    audio.gameOver.splice(i, 1);
  }

  setTimeout(() => {
    player.opacity = 0;
    game.over = true;
  }, 0); //remove player

  setTimeout(() => {
    game.active = false;
    document.querySelector("#restartScreen").style.display = "flex"; //show restart screen
    
    document.querySelector("#finalScore").innerHTML = score; //show final score
    console.log(new URLSearchParams(window.location.search).get("user_id"));
    fetch('https://localhost:3000/admin/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({"score": score, "user_id": new URLSearchParams(window.location.search).get("user_id")})
    });
  }, 1500);

  createParticles({
    //player explodes

    object: player,
    color: "yellow",
    fades: true,
  });
}
//animating
function animate() {
  if (!game.active) {
    return; //stop rendering
  }
  requestAnimationFrame(animate); //for every frame call animate

  const msNow = window.performance.now(); //miliseconds now
  const elapsed = msNow - msPrev; //change in miliseconds

  if (elapsed <= fpsInterval) {
    return;
  }

  msPrev = msNow - (elapsed % fpsInterval); //make fps 60 for every computer

  c.fillStyle = "black"; //canvas background color
  c.fillRect(0, 0, canvas.width, canvas.height); //the canvas

  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerUp = powerUps[i];
    if (powerUp.position.x - powerUp.radius >= canvas.width) {
      //powerup gets out of the border
      powerUps.splice(i, 1);
    } else {
      powerUp.update();
    }
  }
  //spawn powerUps
  if (frames % 500 === 0) {
    powerUps.push(
      new PowerUp({
        position: {
          x: 15,
          y: Math.random() * 300 + 15,
        },
        velocity: {
          x: 5,
          y: 0,
        },
      })
    );
  }
  //spawning bombs
  if (frames % 200 === 0 && bombs.length < 3) {
    bombs.push(
      new Bomb({
        position: {
          x: randomBetween(Bomb.radius, canvas.width - Bomb.radius),
          y: randomBetween(Bomb.radius, canvas.height - Bomb.radius),
        },
        velocity: {
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 6,
        },
      })
    );
  }
  //removing bombs after destroyed
  for (let i = bombs.length - 1; i >= 0; i--) {
    const bomb = bombs[i];
    if (bomb.opacity <= 0) {
      bombs.splice(i, 1);
    } else {
      bomb.update();
    }
  }

  player.update();

  //spawn player engine particles
  for (let i = player.engine.length - 1; i >= 0; i--) {
    const particle = player.engine[i];
    particle.update();
  }

  //removing player engine particles after disappearing
  if (particles.opacity === 0) {
    player.engine[i].splice(i, 1);
  }

  //
  particles.forEach((particle, index) => {
    if (particle.position.y >= canvas.height) {
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = -particle.radius;
    }
    //remove explosion particles
    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(index, 1);
      }, 0);
    } else {
      particle.update();
    }
  });

  invaderProjectiles.forEach((invaderProjectile, index) => {
    //remove invader projectile if it gets of screen
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
      canvas.height
    ) {
      invaderProjectiles.splice(index, 1);
    } else {
      invaderProjectile.update();
      //if invader projectile hits player
      if (
        rectangularCollision({
          rectangle1: invaderProjectile,
          rectangle2: player,
        })
      ) {
        //remove projectile
        invaderProjectiles.splice(index, 1);
        //end the game
        endGame();
      }
    }
  });

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const projectile = projectiles[i];
    for (let j = bombs.length - 1; j >= 0; j--) {
      const bomb = bombs[j];

      if (
        Math.hypot(
          projectile.position.x - bomb.position.x,
          projectile.position.y - bomb.position.y
        ) <
          projectile.radius + bomb.radius &&
        !bomb.active
      ) {
        projectiles.splice(i, 1);
        bomb.explode();
      }
    }

    for (let j = powerUps.length - 1; j >= 0; j--) {
      const powerUp = powerUps[j];

      if (
        Math.hypot(
          projectile.position.x - powerUp.position.x,
          projectile.position.y - powerUp.position.y
        ) <
        projectile.radius + powerUp.radius
      ) {
        projectiles.splice(i, 1);
        powerUps.splice(j, 1);
        player.powerUp = "MachineGun";
        audio.bonus.play();
        //remove audio
        if (audio.bonus.volume === 0) {
          audio.bonus.splice(i, 1);
        }
        setTimeout(() => {
          player.powerUp = null;
        }, 5000);
      }
    }

    if (projectile.position.y + projectile.radius <= 0) {
      projectiles.splice(i, 1);
    } else {
      projectile.update();
    }
  }

  grids.forEach((grid, gridIndex) => {
    grid.update();
    //spawn projectiles
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
      );
    }
    for (let i = grid.invaders.length - 1; i >= 0; i--) {
      const invader = grid.invaders[i];
      invader.update({ velocity: grid.velocity });

      for (let j = bombs.length - 1; j >= 0; j--) {
        const bomb = bombs[j];
        const invaderRadius = 15;

        if (
          Math.hypot(
            invader.position.x - bomb.position.x,
            invader.position.y - bomb.position.y
          ) <
            invaderRadius + bomb.radius &&
          bomb.active
        ) {
          score += 50;
          scoreEl.innerHTML = score;
          grid.invaders.splice(i, 1);
          if (grid.invaders.length > 0) {
            const firstInvader = grid.invaders[0];
            const lastInvader = grid.invaders[grid.invaders.length - 1];

            grid.width =
              lastInvader.position.x -
              firstInvader.position.x +
              lastInvader.width;
            grid.position.x = firstInvader.position.x;
          } else {
            grids.splice(gridIndex, 1);
          }
          createScoreLable({
            object: invader,
            score: 50,
          });
          createParticles({
            object: invader,
            fades: true,
          });
        }
      }

      projectiles.forEach((projectile, j) => {
        if (
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {
          setTimeout(() => {
            const invaderFound = grid.invaders.find(
              (invader2) => invader2 === invader
            );
            const projectileFound = projectiles.find(
              (projectile2) => projectile2 === projectile
            );

            // remove invader and projectile
            if (invaderFound && projectileFound) {
              score += 100;
              scoreEl.innerHTML = score;

              createScoreLable({
                object: invader,
              });

              createParticles({
                object: invader,
                fades: true,
              });
              audio.explode.play();
              //remove audio
              if (audio.explode.volume === 0) {
                audio.explode.splice(i, 1);
              }
              grid.invaders.splice(i, 1);
              projectiles.splice(j, 1);

              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0];
                const lastInvader = grid.invaders[grid.invaders.length - 1];

                grid.width =
                  lastInvader.position.x -
                  firstInvader.position.x +
                  lastInvader.width;
                grid.position.x = firstInvader.position.x;
              } else {
                grids.splice(gridIndex, 1);
              }
            }
          }, 0);
        }
      });
      if (
        rectangularCollision({
          rectangle1: invader,
          rectangle2: player,
        }) &&
        !game.over
      ) {
        endGame();
      }
    }
  });

  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -7;
    player.rotation = -0.15;
  } else if (
    keys.d.pressed &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = 7;
    player.rotation = 0.15;
  } else {
    player.velocity.x = 0;
    player.rotation = 0;
  }

  // spawning enemies
  if (frames % randomInterval === 0) {
    spawnBuffer = spawnBuffer < 100 ? 0 : spawnBuffer;
    grids.push(new Grid());
    randomInterval = Math.floor(Math.random() * 500 + spawnBuffer);
    frames = 0;
    spawnBuffer -= 100;
  }

  //spawning powerUps

  if (
    keys.space.pressed &&
    player.powerUp === "MachineGun" &&
    frames % 2 === 0 &&
    !game.over
  ) {
    if (frames % 6 === 0) {
      audio.shoot.play();
      //remove audio
      if (audio.shoot.volume === 0) {
        audio.shoot.splice(i, 1);
      }
    }
    projectiles.push(
      new Projectile({
        position: {
          x: player.position.x + player.width / 2,
          y: player.position.y,
        },
        velocity: {
          x: 0,
          y: -10,
        },
        color: "yellow",
      })
    );
  }

  frames++;
}

document.querySelector("#startButton").addEventListener("click", () => {
  audio.backgroundMusic.play();
  audio.start.play();
  //remove audio
  if (audio.start.volume === 0) {
    audio.start.splice(i, 1);
  }
  document.querySelector("#startScreen").style.display = "none";
  document.querySelector("#scoreContainer").style.display = "block";
  init();
  animate();
});

document.querySelector("#restartButton").addEventListener("click", () => {
  audio.select.play();
  //remove audio
  if (audio.select.volume === 0) {
    audio.select.splice(i, 1);
  }
  document.querySelector("#restartScreen").style.display = "none";
  init();
  animate();
});

document.querySelector("#exitButton").addEventListener("click", () => {
  audio.select.play();
  //remove audio
  if (audio.select.volume === 0) {
    audio.select.splice(i, 1);
  }
  window.location.href = '../homepage.html';
});

document.querySelector("#exitButton2").addEventListener("click", () => {
  audio.select.play();
  //remove audio
  if (audio.select.volume === 0) {
    audio.select.splice(i, 1);
  }
  window.location.href = '../homepage.html';
});

document.querySelector("#Score").addEventListener("click", () => {
  audio.select.play();
  //remove audio
  if (audio.select.volume === 0) {
    audio.select.splice(i, 1);
  }
  window.location.href = '../scoreboard.html';
});

document.querySelector("#Score2").addEventListener("click", () => {
  audio.select.play();
  //remove audio
  if (audio.select.volume === 0) {
    audio.select.splice(i, 1);
  }
  window.location.href = '../scoreboard.html';
});

addEventListener("keydown", ({ key }) => {
  if (game.over) {
    return;
  }
  switch (key) {
    case "a":
      keys.a.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
    case " ":
      keys.space.pressed = true;
      if (player.powerUp === "MachineGun") return;
      let currTime = Date.now();
      if (currTime - lastShootTime > 150) {
        lastShootTime = currTime
        audio.shoot.play();
        //remove audio
        if (audio.shoot.volume === 0) {
          audio.shoot.splice(i, 1);
        }
        projectiles.push(
          new Projectile({
            position: {
              x: player.position.x + player.width / 2,
              y: player.position.y,
            },
            velocity: {
              x: 0,
              y: -10,
            },
          })
        );
      }
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case " ":
      keys.space.pressed = false;
      break;
  }
});
