const canvas = document.getElementById("particle-canvas"),
  ctx = canvas.getContext("2d");
let particlesArray;
const particleSettings = {
  number: 1000,
  minSize: 0.3,
  maxSize: 1.5,
  speed: 0.5,
  interactionRadius: 75,
  color: { r: 0, g: 255, b: 0 },
};
function resizeCanvas() {
  ((canvas.width = window.innerWidth), (canvas.height = window.innerHeight));
}
(window.addEventListener("resize", resizeCanvas), resizeCanvas());
let mouse = {
  x: null,
  y: null,
  radius: (canvas.height / 80) * (canvas.width / 80),
};
(window.addEventListener("mousemove", function (t) {
  ((mouse.x = t.x), (mouse.y = t.y));
}),
  window.addEventListener("mouseout", function () {
    ((mouse.x = void 0), (mouse.y = void 0));
  }));
class Particle {
  constructor(t, e, i, s, a, r) {
    ((this.x = t),
      (this.y = e),
      (this.directionX = i),
      (this.directionY = s),
      (this.size = a),
      (this.color = r));
  }
  draw() {
    (ctx.beginPath(),
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, !1),
      (ctx.fillStyle = this.color),
      ctx.fill());
  }
  update() {
    ((this.x > canvas.width || this.x < 0) &&
      (this.directionX = -this.directionX),
      (this.y > canvas.height || this.y < 0) &&
      (this.directionY = -this.directionY));
    let t = mouse.x - this.x,
      e = mouse.y - this.y;
    (Math.sqrt(t * t + e * e) < mouse.radius + this.size &&
      (mouse.x < this.x &&
        this.x < canvas.width - 10 * this.size &&
        (this.x += 10),
        mouse.x > this.x && this.x > 10 * this.size && (this.x -= 10),
        mouse.y < this.y &&
        this.y < canvas.height - 10 * this.size &&
        (this.y += 10),
        mouse.y > this.y && this.y > 10 * this.size && (this.y -= 10)),
      (this.x += this.directionX),
      (this.y += this.directionY),
      this.draw());
  }
}
function init() {
  particlesArray = [];
  let t = (canvas.height * canvas.width) / 9e3;
  for (let e = 0; e < 2 * t; e++) {
    let t = Math.random() * particleSettings.maxSize + particleSettings.minSize,
      e = Math.random() * (innerWidth - 2 * t - 2 * t) + 2 * t,
      i = Math.random() * (innerHeight - 2 * t - 2 * t) + 2 * t,
      s = Math.random() * particleSettings.speed - particleSettings.speed / 2,
      a = Math.random() * particleSettings.speed - particleSettings.speed / 2,
      r = "#fff";
    particlesArray.push(new Particle(e, i, s, a, t, r));
  }
}
function connect() {
  let t = 1;
  for (let e = 0; e < particlesArray.length; e++)
    for (let i = e; i < particlesArray.length; i++) {
      let s =
        (particlesArray[e].x - particlesArray[i].x) *
        (particlesArray[e].x - particlesArray[i].x) +
        (particlesArray[e].y - particlesArray[i].y) *
        (particlesArray[e].y - particlesArray[i].y);
      if (s < (canvas.width / 7) * (canvas.height / 7)) {
        t = 1 - s / 2e4;
        let a = mouse.x - particlesArray[e].x,
          r = mouse.y - particlesArray[e].y;
        Math.sqrt(a * a + r * r) < 150 &&
          ((ctx.strokeStyle =
            `rgba(${particleSettings.color.r},${particleSettings.color.g},${particleSettings.color.b},` +
            t +
            ")"),
            (ctx.lineWidth = 1),
            ctx.beginPath(),
            ctx.moveTo(particlesArray[e].x, particlesArray[e].y),
            ctx.lineTo(particlesArray[i].x, particlesArray[i].y),
            ctx.stroke());
      }
    }
}
function animate() {
  (requestAnimationFrame(animate),
    ctx.clearRect(0, 0, innerWidth, innerHeight));
  for (let t = 0; t < particlesArray.length; t++) particlesArray[t].update();
  connect();
}
(init(),
  animate(),
  window.addEventListener("resize", () => {
    ((canvas.width = innerWidth),
      (canvas.height = innerHeight),
      (mouse.radius = (canvas.height / 80) * (canvas.height / 80)),
      init());
  }));
const cursor = document.createElement("div");
((cursor.id = "custom-cursor"), document.body.appendChild(cursor));
const trail = document.createElement("div");
((trail.className = "cursor-trail"),
  document.body.appendChild(trail),
  document.addEventListener("mousemove", (t) => {
    ((cursor.style.left = t.clientX + "px"),
      (cursor.style.top = t.clientY + "px"),
      (trail.style.left = t.clientX + "px"),
      (trail.style.top = t.clientY + "px"));
  }),
  document.addEventListener("mouseover", (t) => {
    ("A" === t.target.tagName ||
      "BUTTON" === t.target.tagName ||
      t.target.classList.contains("hover-text")) &&
      document.body.classList.add("hovering");
  }),
  document.addEventListener("mouseout", (t) => {
    ("A" === t.target.tagName ||
      "BUTTON" === t.target.tagName ||
      t.target.classList.contains("hover-text")) &&
      document.body.classList.remove("hovering");
  }));
