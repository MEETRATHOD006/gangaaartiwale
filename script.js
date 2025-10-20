// 🪔 Smooth Custom Cursor
const cursor = document.querySelector(".cursor");
const follower = document.querySelector(".cursor-follower");

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

// Track mouse instantly
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

// Smooth follow animation
function animateFollower() {
  // Adjust the 0.15 for speed (lower = slower follow)
  followerX += (mouseX - followerX) * 0.15;
  followerY += (mouseY - followerY) * 0.15;

  follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
  requestAnimationFrame(animateFollower);
}

document.querySelectorAll("a, button").forEach(el => {
  el.addEventListener("mouseenter", () => {
    follower.style.transform += " scale(1.5)";
    cursor.style.opacity = 0.4;
  });
  el.addEventListener("mouseleave", () => {
    follower.style.transform = follower.style.transform.replace(" scale(1.5)", "");
    cursor.style.opacity = 1;
  });
});
animateFollower();



// Highlight active nav link
const navLinks = document.querySelectorAll(".nav-menu a");

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    navLinks.forEach(l => l.classList.remove("active"));
    e.target.classList.add("active");
  });
});

// 🌸 Top Bar Hide on Scroll + Sticky Nav
const topBar = document.querySelector('.top-bar');
const nav = document.querySelector('nav');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (currentScroll > 50) {
    topBar.classList.add('hide');
    nav.classList.add('sticky');
  } else {
    topBar.classList.remove('hide');
    nav.classList.remove('sticky');
  }

  lastScrollY = currentScroll;
});

// Stats counter animation
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      const target = entry.target.textContent.replace('+', '').replace('%', '');
      const suffix = entry.target.textContent.includes('%') ? '%' : '+';
      animateNumber(entry.target, 0, parseInt(target), suffix, 2000);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

function animateNumber(element, start, end, suffix, duration) {
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value + suffix;

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// Parallax effect on scroll
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const floatingIcons = document.querySelectorAll('.floating-icon');
  floatingIcons.forEach((icon, index) => {
    const speed = (index + 1) * 0.5;
    icon.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// Horizontal scroll for testimonials
const testimonialsScroll = document.querySelector('.testimonials-scroll');
let isTestimonialsDragging = false;
let testimonialStartX = 0;
let testimonialScrollLeft = 0;

testimonialsScroll.addEventListener('mousedown', (e) => {
  isTestimonialsDragging = true;
  testimonialStartX = e.pageX - testimonialsScroll.offsetLeft;
  testimonialScrollLeft = testimonialsScroll.scrollLeft;
  testimonialsScroll.style.cursor = 'grabbing';
});

testimonialsScroll.addEventListener('mouseleave', () => {
  isTestimonialsDragging = false;
  testimonialsScroll.style.cursor = 'grab';
});

testimonialsScroll.addEventListener('mouseup', () => {
  isTestimonialsDragging = false;
  testimonialsScroll.style.cursor = 'grab';
});

testimonialsScroll.addEventListener('mousemove', (e) => {
  if (!isTestimonialsDragging) return;
  e.preventDefault();
  const x = e.pageX - testimonialsScroll.offsetLeft;
  const walk = (x - testimonialStartX) * 2;
  testimonialsScroll.scrollLeft = testimonialScrollLeft - walk;
});

// Add grab cursor
testimonialsScroll.style.cursor = 'grab';



// Navbar background on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    nav.style.background = 'rgba(26, 10, 0, 0.95)';
  } else {
    nav.style.background = 'rgba(26, 10, 0, 0.8)';
  }
});

// 🪷 Adjust Hero Section Margin Dynamically
function adjustHeroOffset() {
  const topBar = document.querySelector(".top-bar");
  const nav = document.querySelector("nav");
  const hero = document.querySelector(".hero");

  if (!hero || !nav) return;

  const topBarHeight = topBar ? topBar.offsetHeight : 0;
  const navHeight = nav.offsetHeight;
  const totalOffset = topBarHeight + navHeight;

  hero.style.marginTop = `${totalOffset}px`;
}

// Run once and on resize
window.addEventListener("load", adjustHeroOffset);
window.addEventListener("resize", adjustHeroOffset);

// ⬆️ Back to Top Button Logic
const backToTopBtn = document.getElementById("backToTop");
const heroSection = document.querySelector(".hero");

// Show button only after hero section
window.addEventListener("scroll", () => {
  const heroBottom = heroSection.offsetHeight - 150; // adjust if needed
  if (window.scrollY > heroBottom) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

// Scroll to top smoothly when clicked
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});


// Mobile Menu
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// 🪔 HERO SCROLL — AUTO + DRAG + TOUCH + DOTS
const heroScroll = document.getElementById("heroScroll");
const progressDots = document.querySelectorAll(".progress-dot");
const totalPanels = document.querySelectorAll(".hero-panel").length;

let currentPanel = 0;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;
let isDragging = false;
let autoScrollInterval;

// --- Start Drag or Touch ---
heroScroll.addEventListener("mousedown", startDrag);
heroScroll.addEventListener("touchstart", startDrag);
window.addEventListener("mouseup", endDrag);
window.addEventListener("touchend", endDrag);
window.addEventListener("mousemove", moveDrag);
window.addEventListener("touchmove", moveDrag);

function startDrag(e) {
  isDragging = true;
  startX = getPositionX(e);
  heroScroll.style.transition = "none";
  cancelAutoScroll(); // pause auto when user interacts
  animationID = requestAnimationFrame(animation);
}

function moveDrag(e) {
  if (!isDragging) return;
  const currentX = getPositionX(e);
  const diff = currentX - startX;
  currentTranslate = prevTranslate + diff;
}

function endDrag() {
  cancelAnimationFrame(animationID);
  if (!isDragging) return;
  isDragging = false;

  const movedBy = currentTranslate - prevTranslate;
  if (movedBy < -100) currentPanel += 1;
  if (movedBy > 100) currentPanel -= 1;
  if (currentPanel < 0) currentPanel = 0;
  if (currentPanel >= totalPanels) currentPanel = totalPanels - 1;

  setPanelPosition();
  updateDots();
  restartAutoScroll(); // resume auto scroll
}

function animation() {
  heroScroll.style.transform = `translateX(${currentTranslate}px)`;
  if (isDragging) requestAnimationFrame(animation);
}

function setPanelPosition() {
  currentTranslate = -currentPanel * window.innerWidth;
  prevTranslate = currentTranslate;
  heroScroll.style.transition = "transform 0.8s cubic-bezier(0.77, 0, 0.175, 1)";
  heroScroll.style.transform = `translateX(${currentTranslate}px)`;
}

function getPositionX(e) {
  return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
}

function updateDots() {
  progressDots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentPanel);
  });
}

// --- Dot Click ---
progressDots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    currentPanel = i;
    setPanelPosition();
    updateDots();
    restartAutoScroll();
  });
});

// --- Auto Scroll ---
function startAutoScroll() {
  autoScrollInterval = setInterval(() => {
    currentPanel = (currentPanel + 1) % totalPanels;
    setPanelPosition();
    updateDots();
  }, 6000); // every 6 seconds
}

function cancelAutoScroll() {
  clearInterval(autoScrollInterval);
}

function restartAutoScroll() {
  cancelAutoScroll();
  startAutoScroll();
}

// --- On Resize ---
window.addEventListener("resize", () => {
  setPanelPosition();
});

// --- Initialize ---
setPanelPosition();
updateDots();
startAutoScroll();



// 🌸 Diya Particle Canvas Effect
const canvas = document.getElementById('diyaParticles');
const ctx = canvas.getContext('2d');
let particles = [];
let w, h;

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * w;
    this.y = h + Math.random() * 100;
    this.size = Math.random() * 3 + 1;
    this.speed = Math.random() * 0.5 + 0.2;
    this.alpha = Math.random() * 0.5 + 0.3;
  }
  update() {
    this.y -= this.speed;
    this.alpha -= 0.0008;
    if (this.alpha <= 0) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
    gradient.addColorStop(0, `rgba(255, 153, 51, ${this.alpha})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, w, h);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

gsap.to("#diyaParticles", {
  y: -50,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    scrub: true
  }
});

// 💬 WhatsApp Inquiry Integration
const inquiryForm = document.getElementById("inquiryForm");

inquiryForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const eventType = document.getElementById("eventType").value.trim();
  const message = document.getElementById("message").value.trim();

  const whatsappNumber = "917999223157"; // ✅ your WhatsApp number (without +)

  const finalMessage = `
Namaste 🙏
My name is ${name}.
Email: ${email}
Phone: ${phone}
Event Type: ${eventType || "Not specified"}
Message: ${message || "No additional details provided."}
  `.trim();

  const encodedMessage = encodeURIComponent(finalMessage);
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  window.open(whatsappURL, "_blank");
});


// 🎥 Auto Play / Pause Videos on Scroll
const videos = document.querySelectorAll(".video-card video");

const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.play();
        entry.target.style.opacity = "1";
      } else {
        entry.target.pause();
        entry.target.style.opacity = "0.3";
      }
    });
  },
  { threshold: 0.6 }
);

videos.forEach((vid) => videoObserver.observe(vid));
