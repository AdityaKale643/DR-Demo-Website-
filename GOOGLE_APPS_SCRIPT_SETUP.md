# 🚀 Google Apps Script Integration Guide

Complete setup guide for connecting your medical website form to Google Sheets (Free, No coding required!)

---

## 📊 What You'll Get

✅ Automatic appointment form submission to Google Sheets
✅ Email notification when patient books
✅ Complete audit trail of all inquiries
✅ Easy to export and manage
✅ Free forever (Google provides this)

---

## ⏱️ Setup Time: 5-10 Minutes

### Step 1: Create Google Sheet (2 min)

1. Go to **[sheets.google.com](https://sheets.google.com)**
2. Click **"+ New"** → **Spreadsheet**
3. Name it: `Medical Appointments` (or your clinic name)
4. In the first row, add these column headers:
   - **A1**: `Timestamp`
   - **B1**: `Name`
   - **C1**: `Email`
   - **D1**: `Phone`
   - **E1**: `Date`
   - **F1**: `Service`
   - **G1**: `Message`

**Result**: Your sheet is ready to receive data!

---

### Step 2: Create Google Apps Script (2 min)

1. In your Google Sheet, click **Extensions** (top menu)
2. Click **Apps Script**
3. A new tab opens - **Delete all the default code**
4. **Copy and paste this code** (entire code block):

```javascript
// Handle form submissions from website
function doPost(e) {
  try {
    // Get the spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Get form data
    const data = e.parameter;
    
    // Create row with all data
    const row = [
      data.timestamp,
      data.name,
      data.email,
      data.phone,
      data.date,
      data.service,
      data.message || ""
    ];
    
    // Add row to sheet
    sheet.appendRow(row);
    
    // Log for debugging
    console.log('✅ New appointment:', data.name, data.email);
    
    // Send notification email (optional - see below)
    sendNotificationEmail(data);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Form submitted successfully!'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // If error occurs, log it
    console.error('Error processing form:', error);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Send email notification to doctor
function sendNotificationEmail(data) {
  try {
    // Email subject line
    const subject = `New Appointment Request from ${data.name}`;
    
    // Email body with all details
    const body = `
New Appointment Request:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Preferred Date: ${data.date}
Service: ${data.service}
Message: ${data.message || 'No additional message'}

---
This form was submitted at: ${data.timestamp}
    `;
    
    // ⚠️ IMPORTANT: Replace with your email address
    const doctorEmail = 'your-email@gmail.com';
    
    // Send email
    GmailApp.sendEmail(doctorEmail, subject, body);
    
    console.log('✅ Notification email sent to:', doctorEmail);
    
  } catch (error) {
    // If email fails, log it (form still submitted successfully)
    console.error('Email notification failed:', error);
  }
}
```

5. **Click Save** (Ctrl+S or Cmd+S)
6. Name your project: `Medical Appointment Form Handler`
7. Click **Save** button

---

### Step 3: Deploy Web App (2 min)

1. Click the **Deploy** button (top right)
2. Click **New Deployment**
3. Click the dropdown next to "Select type"
4. Choose **Web app**
5. Fill in:
   - **Execute as**: Your email (dropdown)
   - **Who has access**: "Anyone" (dropdown)
6. Click **Deploy**
7. A dialog appears with your **Web App URL**
8. **COPY THIS URL** (click the copy icon)

**Your URL looks like:**
```
https://script.google.com/macros/d/1a2b3c4d5e6f7g8h9i/usercontent.html
```

---

### Step 4: Connect Website to Google Apps Script (1 min)

1. Open your website's **`script.js`** file (in your code editor)
2. **Find this line** (should be near the very top, around line 1):
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'YOUR_WEB_APP_URL_HERE';
   ```
3. **Replace** `'YOUR_WEB_APP_URL_HERE'` with your copied URL:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/d/1a2b3c4d5e6f7g8h9i/usercontent.html';
   ```
4. **Save the file** (Ctrl+S)

---

### Step 5: Enable Email Notifications (Optional - 1 min)

In Google Apps Script:

1. Find this line in the code:
   ```javascript
   const doctorEmail = 'your-email@gmail.com';
   ```
2. Replace `'your-email@gmail.com'` with **your actual Gmail address**
3. Save

Now you'll get an email every time someone books an appointment!

---

### Step 6: Test Your Integration (2 min)

1. **Open your website** in browser
2. **Fill out the appointment form:**
   - Name: Your Name
   - Email: your-email@example.com
   - Phone: 555-1234
   - Date: Pick tomorrow
   - Service: Pick any service
3. **Click "Book Appointment"**
4. You should see a **✅ Success message**
5. **Check your Google Sheet** - The data should appear!
6. **Check your email** (if you set it up) - You should get a notification

---

## 🎉 You're Done!

Your form is now fully connected to Google Sheets!

### What Happens Now:

✅ When a patient submits the form:
1. Their data goes to Google Sheets (automatic)
2. You get an email notification (if enabled)
3. Form resets and shows success message
4. Patient sees professional success message

✅ In your Google Sheet:
- All submissions auto-save
- Timestamp added automatically
- Easy to sort, filter, export
- Share with your staff

---

## 📱 Advanced Setup Options

### Option 1: Send Thank You Email to Patient

In Google Apps Script, add this to the `doPost` function:

```javascript
// Send thank you email to patient
try {
  GmailApp.sendEmail(
    data.email,
    "Thank You for Your Appointment Request!",
    "Dear " + data.name + ",\n\nThank you for booking with us. We will contact you soon to confirm your appointment.\n\nBest regards,\nDr. [Your Name]"
  );
} catch (e) {
  console.error('Thank you email failed:', e);
}
```

### Option 2: Add More Form Fields

**To add a new field (e.g., Age):**

1. In your Google Sheet: Add column header (e.g., "Age" in H1)
2. In HTML form (index.html): Add new input field
3. In Google Apps Script: Add field to the `row` array

Example adding Age field:
```javascript
// In the row array, add:
data.age

// In HTML form, add:
<input type="number" name="age" placeholder="Your age">
```

### Option 3: Create Automatic Responses

Add this in Google Apps Script to log responses:

```javascript
// Save successful submissions to another sheet
const successSheet = SpreadsheetApp.getSheetByName('Successful') || 
                     SpreadsheetApp.getActiveSpreadsheet().insertSheet('Successful');
successSheet.appendRow(row);
```

---

## 🔧 Troubleshooting

### Error: "Google Apps Script URL not configured"
- You forgot to replace `YOUR_WEB_APP_URL_HERE` in script.js
- Copy your URL again from Apps Script Deploy section
- Make sure to save the file

### Form submits but data doesn't appear in Sheet
- Check browser console (F12) for errors
- Verify your URL is exactly correct (copy-paste again)
- Check that Google Sheet has correct column headers
- Make sure Apps Script is deployed as "Web app" with "Anyone" access

### Email notification not sending
- Check the email address is correct in Apps Script
- Make sure you're using a Gmail account (Gmail sends email)
- Check spam folder

### CORS error in browser console
- This is **normal** - Google Apps Script returns CORS headers
- The data still gets saved successfully
- You can ignore this error

---

## 🚀 What's Next?

✅ Your form is live and working!

Now you can:
1. Share the website with doctors
2. Monitor appointments in Google Sheet
3. Export data to Excel
4. Create charts/reports
5. Share access with staff
6. Customize the email template

---

## 📞 Quick Reference

| Task | Solution |
|------|----------|
| Change email address | Update in Google Apps Script |
| Add new form field | Add column in Sheet + code in script |
| Send thank you email | Add GmailApp code in Apps Script |
| Change email subject | Edit `subject` variable in code |
| Backup data | Download Google Sheet as Excel |
| Share with staff | Share Google Sheet folder |

---

## 💡 Pro Tips

1. **Keep backups** - Google Sheets has version history
2. **Share wisely** - Only share Sheet with trusted staff
3. **Monitor regularly** - Check for patient inquiries daily
4. **Respond quickly** - Call/email patients within 24 hours
5. **Add notes** - You can add notes in Google Sheet for each submission

---

## ✅ Verification Checklist

Before you finish:
- [ ] Google Sheet created with headers
- [ ] Apps Script code pasted and saved
- [ ] Web app deployed successfully
- [ ] URL copied correctly
- [ ] URL pasted in script.js
- [ ] script.js file saved
- [ ] Website tested - form submitted
- [ ] Data appears in Google Sheet
- [ ] (Optional) Email notification received

---

## 🎯 Common Customizations

**Change notifications recipient:**
```javascript
const doctorEmail = 'your-email@gmail.com'; // Change this
```

**Change email subject:**
```javascript
const subject = 'New Patient Inquiry - ' + data.name;
```

**Change email body:**
```javascript
const body = 'Custom message here...';
```

**Add appointment confirmation:**
```javascript
GmailApp.sendEmail(data.email, "Appointment Confirmed", 
  "Your appointment is confirmed for " + data.date);
```

---

## 🎓 Learning Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets)
- [Gmail API](https://developers.google.com/gmail)

---

## 🔐 Security Notes

✅ Your data is secure:
- Stored in your Google account
- Only you can access
- Google has strong encryption
- You control who sees it
- Complete audit trail
- Can delete anytime

---

## 🎉 You're All Set!

Your medical website form is now **production-ready** with full Google Sheets integration!

**Next steps:**
1. Test the form thoroughly
2. Share website with doctors
3. Monitor appointments daily
4. Respond to inquiries quickly

---

**Need help?** Check the troubleshooting section above or the main README.md file.

**Ready to go live?** Follow the deployment guide in QUICK_START.md!

---

**Happy booking! 🏥**
