let canvas = document.querySelector('canvas'),
  ctx = canvas.getContext('2d'),
  W, H;

W = canvas.width = 900;
H = canvas.height = 900;

let particles = [];
let amount = 0;

let mouse = {x:0,y:0};
let radius = 1;

const img = document.createElement('img');
img.src = './img/face.jpg';
img.onload = () => {
  drawImage();
  createParticles();
  render();
};

window.addEventListener('resize', () => {
  resizeCanvas();
  render();
});

function render() {
  ctx.fillStyle = '#030303';
  ctx.clearRect(0, 0, W, H);
  for (var i = 0; i < amount; i++) {
    particles[i].render();
  }
  // for (let i = 0; i < amount; i++) {
  //   ctx.fillStyle = particles[i].ca;
  //   ctx.beginPath();
  //   ctx.arc(particles[i].dx, particles[i].dy, 2.5, Math.PI * 2, false);
  //   ctx.fill();
  //   ctx.fillStyle = particles[i].c;
  //   ctx.beginPath();
  //   ctx.arc(particles[i].dx, particles[i].dy, 1.5, Math.PI * 2, false);
  //   ctx.fill();
  //   // ctx.fillRect(particles[i].dx, particles[i].dy, 10, 10)
  // }
  requestAnimationFrame(render);
}

function drawImage() {
  const box = getImageBoundingBox(img);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.drawImage(img, box.x, box.y, box.w, box.h);
}

function drawParticles() {

}

function createParticles() {
  var data = ctx.getImageData(0, 0, W, H).data;
  ctx.globalCompositeOperation = "screen";
  // for (let x = 0; x < canvas.width; x += 4) {
  //   for (let y = 0; y < canvas.height; y += 4) {
  //     let idx = (x + y * W) * 4;
  //     let r = data[idx],
  //       g = data[idx + 1],
  //       b = data[idx + 2];
  //     if ((r + g + b) / 3 > 10) {
  //       // particles.push({
  //       //   dx: x,
  //       //   dy: y,
  //       //   c: `rgb(${r}, ${g}, ${b})`,
  //       //   ca: `rgba(${r}, ${g}, ${b}, .4)`,
  //       // });
  //       particles.push(new Particle(x, y, `rgb(${r}, ${g}, ${b})`));
  //     }
  //   }
  // }
  for (let x = 0; x < canvas.width; x += Math.round(W/130)) {
    for (let y = 0; y < canvas.height; y += Math.round(W/130)) {
      let idx = (x + y * W) * 4;
      let r = data[idx],
        g = data[idx + 1],
        b = data[idx + 2],
        a = data[idx + 3];
      if ((r + g + b) / 3 > 80) {
        particles.push(new Particle(x, y, `rgb(${r}, ${g}, ${b})`));
      }
    }
  }
  amount = particles.length;
  console.log(amount)
  ctx.clearRect(0, 0, W, H);
}

function resizeCanvas() {
  W = canvas.width;
  H = canvas.height;
}

function getImageBoundingBox(img) {
  let iw = img.width,
    ih = img.height,
    sw = getScale(iw, W),
    sh = getScale(ih, H);

  if (sw < sh) {
    return {
      w: iw * sh,
      h: H,
      x: -(iw * sh - W) / 2,
      y: 0
    };
  }
  return {
    w: W,
    h: ih * sw,
    x: 0,
    y: -(ih * sw - H) / 2,
  };
}

function getScale(a, b) {
  return b / a;
}

function Particle(x, y, c) {
  this.x = Math.random() * W;
  this.y = Math.random() * H;
  this.dest = {
    x: x,
    y: y
  };
  this.r = Math.random() * 2 + 1;
  this.vx = (Math.random() - 0.5) * 20;
  this.vy = (Math.random() - 0.5) * 20;
  this.accX = 0;
  this.accY = 0;
  this.friction = Math.random() * 0.05 + 0.94;

  this.color = c;
}

Particle.prototype.render = function () {
  this.accX = (this.dest.x - this.x) / 1000;
  this.accY = (this.dest.y - this.y) / 1000;
  this.vx += this.accX;
  this.vy += this.accY;
  this.vx *= this.friction;
  this.vy *= this.friction;

  this.x += this.vx;
  this.y += this.vy;

  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
  ctx.fill();

  var a = this.x - mouse.x;
  var b = this.y - mouse.y;

  var distance = Math.sqrt(a * a + b * b);
  if (distance < (radius * 70)) {
    this.accX = (this.x - mouse.x) / 500;
    this.accY = (this.y - mouse.y) / 500;
    this.vx += this.accX;
    this.vy += this.accY;
  }
}

function onMouseMove(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

function onTouchMove(e) {
  if (e.touches.length > 0) {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }
}

window.addEventListener("mousemove", onMouseMove);
requestAnimationFrame(render);