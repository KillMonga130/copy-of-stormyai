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

// Trap focus in modal
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    });
}

trapFocus(signupModal);
trapFocus(demoModal);

// Loading state helper
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.dataset.originalText = button.textContent;
        button.textContent = 'Processing...';
        button.disabled = true;
        button.classList.add('btn-loading');
    } else {
        button.textContent = button.dataset.originalText;
        button.disabled = false;
        button.classList.remove('btn-loading');
    }
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('notification-show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('notification-show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Form submissions with loading states
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    setButtonLoading(submitBtn, true);
    
    const formData = {
        name: document.getElementById('signup-name').value,
        email: document.getElementById('signup-email').value,
        company: document.getElementById('signup-company').value,
        password: document.getElementById('signup-password').value
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Signup form submitted:', formData);
    
    setButtonLoading(submitBtn, false);
    closeModal(signupModal);
    e.target.reset();
    
    showNotification('Account created successfully. Check your email to get started.');
});

document.getElementById('demo-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    setButtonLoading(submitBtn, true);
    
    const formData = {
        name: document.getElementById('demo-name').value,
        email: document.getElementById('demo-email').value,
        company: document.getElementById('demo-company').value,
        teamSize: document.getElementById('demo-team-size').value,
        message: document.getElementById('demo-message').value
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Demo form submitted:', formData);
    
    setButtonLoading(submitBtn, false);
    closeModal(demoModal);
    e.target.reset();
    
    showNotification('Demo request submitted. Our team will reach out within 24 hours.');
});
