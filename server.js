const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from 'public' directory
// Move your HTML, CSS, and client-side JS to a 'public' folder

// Form submission endpoint
app.post('/api/submit-form', (req, res) => {
    const { name, phone, email, enquiry } = req.body;
    
    // Validate data
    const errors = [];
    
    if (!name || name.trim() === '') {
        errors.push('Name is required');
    }
    
    if ((!phone || phone.trim() === '') && (!email || email.trim() === '')) {
        errors.push('Either phone or email is required');
    }
    
    if (email && email.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Invalid email format');
        }
    }
    
    if (!enquiry || enquiry.trim() === '') {
        errors.push('Enquiry is required');
    } else if (enquiry.length > 500) {
        errors.push('Enquiry must not exceed 500 characters');
    }
    
    // If validation fails, return errors
    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors });
    }
    
    // Store the submission
    const timestamp = new Date().toISOString();
    const formData = { name, phone, email, enquiry, timestamp };
    
    // Option 1: Save to a CSV file
    const csvWriter = createObjectCsvWriter({
        path: 'submissions.csv',
        header: [
            { id: 'name', title: 'NAME' },
            { id: 'phone', title: 'PHONE' },
            { id: 'email', title: 'EMAIL' },
            { id: 'enquiry', title: 'ENQUIRY' },
            { id: 'timestamp', title: 'TIMESTAMP' }
        ],
        append: true
    });
    
    csvWriter.writeRecords([formData])
        .then(() => {
            console.log('Data written to CSV');
        })
        .catch(err => {
            console.error('Error writing to CSV:', err);
        });
    
    // Option 2: Send email notification
    // Uncomment to enable email sending
    /*
    const transporter = nodemailer.createTransport({
        service: 'gmail',  // or another service
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-app-password'  // use app password if using Gmail
        }
    });
    
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'recipient@example.com',
        subject: 'New Form Submission',
        text: `
            Name: ${name}
            Phone: ${phone || 'Not provided'}
            Email: ${email || 'Not provided'}
            Enquiry: ${enquiry}
            Submitted: ${timestamp}
        `
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
    */
    
    // Option 3: Store in a database
    // This would be where you'd connect to a database like MongoDB or MySQL
    
    // Send successful response
    res.status(200).json({ success: true, message: 'Form submitted successfully' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});