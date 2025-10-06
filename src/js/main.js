import { loadHeaderFooter } from './utils.mjs';

// Only load shared chrome for the home page.
// No product-list logic here anymore.
loadHeaderFooter();

document.getElementById('newsletterForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = e.target.email.value;

    // Example: Send to backend or external service
    fetch('/api/newsletter-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })
        .then(res => res.json())
        .then(data => {
            alert('Thanks for subscribing!');
        })
        .catch(err => {
            console.error('Signup error:', err);
            alert('Something went wrong. Please try again.');
        });
});
