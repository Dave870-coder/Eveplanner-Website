// scripts.js — dynamic rendering and contact -> Gmail redirect

// Services data
const services = [
  { name: 'Wedding planning', desc: 'Comprehensive wedding planning services.' },
  { name: 'Birthday parties', desc: 'Fun and memorable birthday celebrations.' },
  { name: 'Corporate events', desc: 'Professional corporate event management.' },
  { name: 'Baby & bridal showers', desc: 'Elegant showers for special occasions.' },
  { name: 'Event decoration & styling', desc: 'Creative decorations and styling.' },
  { name: 'Venue selection', desc: 'Finding the perfect venue for your event.' },
  { name: 'Catering coordination', desc: 'Delicious catering services.' }
];

// Testimonials data
const testimonials = [
  { name: 'Jane D.', text: 'EvePlan made our wedding unforgettable. Professional and creative!' },
  { name: 'Mike R.', text: 'Great service for our corporate event. Highly recommend.' },
  { name: 'Sarah L.', text: 'Birthday party was a hit! Affordable and stress-free.' }
];

function renderServices() {
  const container = document.getElementById('services-container');
  if (!container) return;
  container.innerHTML = '';
  // Shuffle services for dynamism on reload
  const shuffled = [...services].sort(() => Math.random() - 0.5);
  shuffled.forEach(s => {
    const card = document.createElement('div');
    card.className = 'service-card';
    // Generate a relevant random image URL using Unsplash
    const keyword = s.name.toLowerCase().split(' ')[0]; // Take first word as keyword
    const randomImg = `https://source.unsplash.com/300x200/?${keyword}`;
    card.innerHTML = `
      <img src="${randomImg}" alt="${s.name}">
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
    `;
    container.appendChild(card);
  });
}

function renderTestimonials() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;
  container.innerHTML = '';
  testimonials.forEach(t => {
    const div = document.createElement('div');
    div.className = 'testimonial';
    div.innerHTML = `<p>"${t.text}"</p><cite>— ${t.name}</cite>`;
    container.appendChild(div);
  });
  // Simple slider logic
  let current = 0;
  const slides = container.querySelectorAll('.testimonial');
  slides.forEach((slide, i) => slide.style.display = i === 0 ? 'block' : 'none');
  setInterval(() => {
    slides[current].style.display = 'none';
    current = (current + 1) % slides.length;
    slides[current].style.display = 'block';
  }, 4000);
}

// Smooth scrolling for nav links
function setupSmoothScroll() {
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Scroll to top button
function setupScrollToTop() {
  const btn = document.createElement('button');
  btn.id = 'scroll-to-top';
  btn.innerHTML = '↑';
  btn.style.cssText = 'position:fixed;bottom:20px;right:20px;display:none;background:#f1c40f;color:#2c3e50;border:none;border-radius:50%;width:50px;height:50px;font-size:20px;cursor:pointer;z-index:1000;';
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Page load animations
function setupAnimations() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s, transform 0.5s';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 200);
  });
}

// Contact form: open Gmail compose with prefilled fields
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');
  const recipient = 'oikechukwu312@gmail.com'; // change if you want messages to another email

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = (document.getElementById('name') || {}).value || '';
    const email = (document.getElementById('email') || {}).value || '';
    const phone = (document.getElementById('phone') || {}).value || '';
    const eventType = (document.getElementById('eventType') || {}).value || '';
    const message = (document.getElementById('message') || {}).value || '';

    // Basic validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      if (feedback) {
        feedback.style.display = 'block';
        feedback.textContent = 'Please fill in your name, email and message.';
      } else {
        alert('Please fill in your name, email and message.');
      }
      return;
    }

    // UX: show small feedback
    if (feedback) {
      feedback.style.display = 'block';
      feedback.textContent = 'Opening Gmail compose...';
    }
    if (submitBtn) submitBtn.disabled = true;

    const subject = `EvePlan contact: ${name} — ${eventType || 'General'}`;
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Event type: ${eventType}`,
      '',
      message
    ];
    const body = bodyLines.join('\n');

    const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1'
      + '&to=' + encodeURIComponent(recipient)
      + '&su=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);

    // Open Gmail compose in a new tab. If blocked, fallback to setting location.
    const win = window.open(gmailUrl, '_blank');
    if (!win) {
      window.location.href = gmailUrl;
    }

    // Re-enable button after a short delay
    setTimeout(() => {
      if (submitBtn) submitBtn.disabled = false;
      if (feedback) {
        feedback.textContent = 'If Gmail did not open, check your popup blocker or sign in to Gmail.';
      }
    }, 1500);
  });
}

// Init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    renderServices();
    renderTestimonials();
    setupContactForm();
    setupSmoothScroll();
    setupScrollToTop();
    setupAnimations();
  });
} else {
  renderServices();
  renderTestimonials();
  setupContactForm();
  setupSmoothScroll();
  setupScrollToTop();
  setupAnimations();
}
