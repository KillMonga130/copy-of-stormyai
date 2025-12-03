// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#signup' || href === '#demo') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// FAQ accordion functionality
document.querySelectorAll('.faq-item').forEach(item => {
    const summary = item.querySelector('.faq-question');
    
    summary.addEventListener('click', () => {
        const isOpen = item.hasAttribute('open');
        
        // Close all other items
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.removeAttribute('open');
            }
        });
    });
});

// Modal functionality
const signupModal = document.getElementById('signup-modal');
const demoModal = document.getElementById('demo-modal');

// Open modals
document.querySelectorAll('a[href="#signup"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

document.querySelectorAll('a[href="#demo"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        demoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close modals
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        closeModal(btn.closest('.modal'));
    });
});

// Close on backdrop click
[signupModal, demoModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
});

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (signupModal.classList.contains('active')) closeModal(signupModal);
        if (demoModal.classList.contains('active')) closeModal(demoModal);
    }
});

// Form submissions
document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
        name: document.getElementById('signup-name').value,
        email: document.getElementById('signup-email').value,
        company: document.getElementById('signup-company').value,
        password: document.getElementById('signup-password').value
    };
    console.log('Signup form submitted:', formData);
    alert('Thanks for signing up! We\'ll send you an email to get started.');
    closeModal(signupModal);
    e.target.reset();
});

document.getElementById('demo-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
        name: document.getElementById('demo-name').value,
        email: document.getElementById('demo-email').value,
        company: document.getElementById('demo-company').value,
        teamSize: document.getElementById('demo-team-size').value,
        message: document.getElementById('demo-message').value
    };
    console.log('Demo form submitted:', formData);
    alert('Thanks for your interest! Our team will reach out within 24 hours.');
    closeModal(demoModal);
    e.target.reset();
});
