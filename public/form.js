document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const newFormBtn = document.getElementById('newFormBtn');
    const contactError = document.getElementById('contactError');
    const charCount = document.getElementById('charCount');
    const enquiryField = document.getElementById('enquiry');
    const phoneField = document.getElementById('phone');
    const emailField = document.getElementById('email');

    // Character counter for the enquiry field
    enquiryField.addEventListener('input', function() {
        const currentLength = this.value.length;
        charCount.textContent = currentLength;
        
        // Change color when approaching the limit
        if (currentLength >= 450) {
            charCount.style.color = '#ef476f';
        } else {
            charCount.style.color = '#888';
        }
    });

    // Validate that at least one contact method is provided
    function validateContactFields() {
        const phoneValue = phoneField.value.trim();
        const emailValue = emailField.value.trim();
        
        if (phoneValue === '' && emailValue === '') {
            contactError.classList.remove('hidden');
            return false;
        } else {
            contactError.classList.add('hidden');
            return true;
        }
    }

    // Add blur event listeners to validate when leaving fields
    phoneField.addEventListener('blur', validateContactFields);
    emailField.addEventListener('blur', validateContactFields);
    
    // Add input event listeners to hide error message once valid
    phoneField.addEventListener('input', function() {
        if (this.value.trim() !== '' || emailField.value.trim() !== '') {
            contactError.classList.add('hidden');
        }
    });
    
    emailField.addEventListener('input', function() {
        if (this.value.trim() !== '' || phoneField.value.trim() !== '') {
            contactError.classList.add('hidden');
        }
    });

    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate that at least one contact method is provided
        if (!validateContactFields()) {
            return;
        }
        
        // Collect form data
        const formData = {
            name: document.getElementById('name').value,
            phone: phoneField.value,
            email: emailField.value,
            enquiry: enquiryField.value
        };
        
        // In a real application, you would send this data to your server
        console.log('Form submitted:', formData);
        
        // For demonstration purposes, we'll simulate a successful submission
        setTimeout(function() {
            contactForm.classList.add('hidden');
            successMessage.classList.remove('hidden');
        }, 1000);
    });
    
    // Reset form button
    newFormBtn.addEventListener('click', function() {
        contactForm.reset();
        charCount.textContent = '0';
        charCount.style.color = '#888';
        successMessage.classList.add('hidden');
        contactForm.classList.remove('hidden');
    });
});