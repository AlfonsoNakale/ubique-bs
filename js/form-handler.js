// Form validation and submission handler
document.addEventListener('DOMContentLoaded', function() {
    // Get both forms
    const contactForm = document.querySelector('#wf-form-Contact-Form');
    const demoForm = document.querySelector('.form-block.request #wf-form-Contact-Form');

    // Validation functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }

    function validateRequired(value) {
        return value.trim() !== '';
    }

    function showError(form, message) {
        const errorDiv = form.closest('.form-block').querySelector('.error-message');
        const errorText = errorDiv.querySelector('.text-block');
        errorText.textContent = message;
        errorDiv.style.display = 'block';
        
        // Hide success message if visible
        const successDiv = form.closest('.form-block').querySelector('.success-message');
        successDiv.style.display = 'none';
    }

    function showSuccess(form) {
        const successDiv = form.closest('.form-block').querySelector('.success-message');
        successDiv.style.display = 'block';
        
        // Hide error message if visible
        const errorDiv = form.closest('.form-block').querySelector('.error-message');
        errorDiv.style.display = 'none';
    }

    // Handle form submission
    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        
        // Get form fields
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate required fields
        if (!validateRequired(data.Name || data['req-Name-2'])) {
            showError(form, 'Please enter your name');
            return;
        }
        
        if (!validateEmail(data.Email || data['req-Email-2'])) {
            showError(form, 'Please enter a valid email address');
            return;
        }
        
        // Additional validation for demo form
        if (form === demoForm && !validateRequired(data['req-Company-Name-2'])) {
            showError(form, 'Please enter your company name');
            return;
        }

        try {
            // Disable submit button and show loading state
            const submitButton = form.querySelector('input[type="submit"]');
            const originalValue = submitButton.value;
            submitButton.value = 'Sending...';
            submitButton.disabled = true;

            // Here you would typically send the data to your backend
            // For demonstration, we'll simulate an API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message and reset form
            showSuccess(form);
            form.reset();
            
        } catch (error) {
            showError(form, 'Something went wrong. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            // Re-enable submit button and restore original text
            const submitButton = form.querySelector('input[type="submit"]');
            submitButton.value = originalValue;
            submitButton.disabled = false;
        }
    }

    // Add submit event listeners to both forms
    if (contactForm) {
        contactForm.addEventListener('submit', handleSubmit);
    }
    if (demoForm) {
        demoForm.addEventListener('submit', handleSubmit);
    }
}); 