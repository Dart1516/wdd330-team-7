document.querySelector('.newsletter-signup').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = e.target.email.value;

    if (!email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }

    // Simulate successful subscription
    console.log('Subscribed with email:', email);
    alert('Thanks for subscribing to our newsletter!');
    e.target.reset(); // Clear the form
});
