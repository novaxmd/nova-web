// Menu toggle
const drawer = document.getElementById("drawer");
const toggle = document.getElementById("menu-toggle");
const close = document.getElementById("close-menu");
toggle.onclick = () => drawer.style.left = "0";
close.onclick = () => drawer.style.left = "-100%";
function closeMenu() { drawer.style.left = "-100%"; }

// Reveal on scroll
const reveals = document.querySelectorAll(".reveal");
function revealOnScroll() {
  const trigger = window.innerHeight * 0.9;
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < trigger) el.classList.add("active");
  });
}
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// Current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// GitHub stats fetch
async function fetchGitHubStats() {
  try {
    const response = await fetch("https://api.github.com/repos/novaxmd/NOVA-XMD");
    const data = await response.json();
    document.getElementById("stars").textContent = data.stargazers_count || 0;
    document.getElementById("forks").textContent = data.forks_count || 0;
    const followersResp = await fetch("https://api.github.com/users/novaxmd");
    const followersData = await followersResp.json();
    document.getElementById("followers").textContent = followersData.followers || 0;
  } catch (err) { console.error(err); }
}
fetchGitHubStats();

// Background canvas particles
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let width, height, particles=[];
function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createParticles(num=100) {
  particles = [];
  for(let i=0;i<num;i++){
    particles.push({
      x:Math.random()*width,
      y:Math.random()*height,
      vx:(Math.random()-0.5)*0.5,
      vy:(Math.random()-0.5)*0.5,
      size:Math.random()*2+1
    });
  }
}
createParticles(120);

function animateParticles(){
  ctx.clearRect(0,0,width,height);
  ctx.fillStyle="rgba(0,255,170,0.7)";
  for(let p of particles){
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fill();
    p.x+=p.vx;
    p.y+=p.vy;
    if(p.x<0||p.x>width) p.vx*=-1;
    if(p.y<0||p.y>height) p.vy*=-1;
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();
