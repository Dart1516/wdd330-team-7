document.getElementById('newsletter-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = e.target.email.value;

    if (!email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }

    console.log('Subscribed with email:', email);
    alert('Thanks for subscribing!');
    e.target.reset();
});
