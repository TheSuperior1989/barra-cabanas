# Email Setup Guide for SkillAxis Website

## ⚠️ IMPORTANT: Email Forms Are Not Working Yet!

The contact form and quote request form are currently **NOT sending actual emails**. You need to set up an email service to make them work. Here are your options:

## Option 1: EmailJS (Recommended - Free & Easy)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. **Copy the Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Templates
Create two templates:

#### Template 1: Contact Form
- Go to "Email Templates" → "Create New Template"
- Template Name: `Contact Form Submission`
- Subject: `New Contact Form Submission from {{from_name}}`
- Content:
```
New contact form submission:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Subject: {{subject}}
Service Interest: {{service}}

Message:
{{message}}

---
This email was sent from the SkillAxis website contact form.
```
- **Copy the Template ID** (e.g., `template_contact123`)

#### Template 2: Quote Request
- Create another template
- Template Name: `Quote Request`
- Subject: `New Quote Request from {{from_name}}`
- Content:
```
New quote request:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Company: {{company}}

Services Requested:
{{services_list}}

Total Estimated Amount: {{total_amount}}

Additional Message:
{{message}}

---
This email was sent from the SkillAxis website quoting tool.
```
- **Copy the Template ID** (e.g., `template_quote123`)

### Step 4: Get Public Key
1. Go to "Account" → "General"
2. **Copy your Public Key** (e.g., `user_abc123xyz`)

### Step 5: Update Configuration
Edit `src/services/emailService.js` and replace:
```javascript
const EMAILJS_SERVICE_ID = 'your_service_id_here';
const EMAILJS_TEMPLATE_ID_CONTACT = 'your_contact_template_id_here';
const EMAILJS_TEMPLATE_ID_QUOTE = 'your_quote_template_id_here';
const EMAILJS_PUBLIC_KEY = 'your_public_key_here';
```

## Option 2: Formspree (Alternative)

### Step 1: Create Formspree Account
1. Go to [https://formspree.io/](https://formspree.io/)
2. Sign up for a free account

### Step 2: Create Forms
1. Create a new form for contact
2. **Copy the form endpoint** (e.g., `https://formspree.io/f/abc123`)

### Step 3: Update Configuration
If you prefer Formspree, modify the email service to use the `sendFormspreeContact` function instead.

## Option 3: Custom Backend (Advanced)

If you want full control, you can:
1. Create a backend API (Node.js, PHP, Python, etc.)
2. Set up SMTP email sending
3. Update the email service to call your API

## Testing the Setup

1. After configuring EmailJS or Formspree
2. Test both forms:
   - Contact form at `/contact`
   - Quote request at `/quote`
3. Check your email inbox for test messages
4. Verify all form fields are being sent correctly

## Current Status

- ✅ Forms are visually complete and functional
- ✅ Form validation is working
- ✅ Loading states and error handling implemented
- ❌ **Email sending is NOT configured** (needs setup above)
- ❌ Forms currently show fake success messages

## What Happens Now

Until you set up the email service:
- Forms will show "sending..." state
- Then show an error message
- No actual emails will be sent
- Contact information will be lost

## Need Help?

If you need assistance setting up the email service:
1. Follow the EmailJS guide above (easiest option)
2. Contact your developer for custom backend setup
3. Consider hiring a developer if you're not comfortable with the setup

## Security Notes

- Never expose your private keys in the frontend code
- EmailJS public keys are safe to use in frontend
- Always validate form data on the server side
- Consider adding CAPTCHA for spam protection
