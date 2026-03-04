// Network Canvas Animation
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.radius = Math.random() * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 204, 0.5)';
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const numParticles = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}
initParticles();

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.hypot(dx, dy);

            if (distance < 120) {
                ctx.beginPath();
                // Dynamic opacity based on distance
                const opacity = 1 - (distance / 120);
                ctx.strokeStyle = `rgba(0, 255, 204, ${opacity * 0.2})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const particle of particles) {
        particle.update();
        particle.draw();
    }
    connectParticles();
}
animate();

// Intersection Observer for scroll animations (fade in)
const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

// Stats counter animation
const counters = document.querySelectorAll('.counter');
const speed = 200;

const countOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const targetCounter = entry.target;

        const updateCount = () => {
            const target = +targetCounter.getAttribute('data-target');
            const count = +targetCounter.innerText;
            const inc = target / speed;

            if (count < target) {
                targetCounter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                targetCounter.innerText = target;
            }
        };
        updateCount();
        observer.unobserve(targetCounter);
    });
}, appearOptions);

counters.forEach(counter => {
    countOnScroll.observe(counter);
});

// Mobile Burger Nav
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

if (burger) {
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });
}
