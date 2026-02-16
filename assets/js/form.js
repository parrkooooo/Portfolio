export function initializeForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const submitButton = document.getElementById('submit-btn');
    const formSuccess = document.getElementById('form-success');

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = "Transmitting...";

        try {
            const response = await fetch("https://formspree.io/f/xgooljlk", {
                method: "POST",
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                if (formSuccess) formSuccess.style.display = 'block';
                contactForm.reset();
                contactForm.style.display = 'none';
            } else {
                alert("Transmission failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Transmission failed.");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Send Message";
        }
    });
}