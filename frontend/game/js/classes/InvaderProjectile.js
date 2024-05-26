class InvaderProjectile {
    constructor({ position, velocity }) {
      this.position = position;
      this.velocity = velocity;
  
      this.width = 3
      this.height = 10 
    }
  
    draw() {
      c.fillStyle= 'yellow'
      c.fillRect(this.position.x, this.position.y, this.width, this.height)
      // c.beginPath();
      // c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      // c.fillStyle = "red";
      // c.fill();
      // c.closePath();
    }
  
    update() {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }