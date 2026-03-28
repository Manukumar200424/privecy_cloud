# 🔒 Privacy Cloud - End-to-End Encrypted File Storage

A privacy-first cloud storage application that encrypts files in your browser before they ever reach the server. Your password, your privacy, your control.

![Privacy Cloud Screenshot](docs/screenshot.png)

## ✨ Features

- **🔐 End-to-End Encryption**: Files are encrypted in your browser using your password before upload
- **🌐 Zero-Knowledge Architecture**: Server cannot access or decrypt your files
- **📱 Modern UI/UX**: Beautiful, responsive interface designed for all devices
- **🚀 Fast & Secure**: Drag-and-drop upload, instant decryption
- **🔑 PBKDF2 + AES-GCM**: Military-grade encryption standards
- **📂 Easy File Management**: View, download, and delete your encrypted files
- **⚡ Browser-Based**: No plugins required, works in all modern browsers

## 🛑 ⚠️ Important: Not for Production

This is a **learning and demo project**. Do **NOT** use in production without:
- HTTPS/TLS encryption
- Enhanced session management
- Two-factor authentication
- Security audit
- Proper key management
- GDPR/compliance review

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- MongoDB (local or remote)
- Git

### Installation

1. **Clone or download the project**
   ```bash
   cd privecy_cloud
   ```

2. **Create and activate a virtual environment**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   # Create a .env file
   # Windows
   echo # > .env

   # macOS/Linux
   touch .env
   ```

   Add to `.env`:
   ```
   FLASK_SECRET_KEY=your-random-secret-key-here
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=privacy_store
   FLASK_ENV=development
   ```

5. **Start MongoDB** (if running locally)
   ```bash
   # Windows (if installed via Chocolatey)
   mongod

   # or use MongoDB Atlas (cloud)
   ```

6. **Run the application**
   ```bash
   python appp/app.py
   ```

7. **Open in browser**
   ```
   http://127.0.0.1:5000/
   ```

## 📖 How It Works

### Registration

1. User creates an account with username and password
2. Server stores:
   - Username
   - Hashed password (bcrypt)
   - Random encryption salt

### Login

1. User enters credentials
2. Server verifies password hash
3. Server returns encryption salt
4. Client derives encryption key locally using PBKDF2

### Encryption Process

```
User Password + Server Salt
         ↓
    PBKDF2 (200,000 iterations)
         ↓
    256-bit AES key
         ↓
    AES-GCM encryption of file
         ↓
    Encrypted blob + IV
         ↓
    Upload to server
```

### File Upload

1. Browser encrypts file using derived key and random IV
2. Encrypted file sent to server
3. Server stores encrypted blob in MongoDB GridFS
4. Server cannot decrypt (no key)

### File Download

1. Browser requests encrypted file from server
2. Server sends encrypted blob + IV header
3. Browser decrypts locally with derived key
4. File saved to user's device

## 🗂️ Project Structure

```
privecy_cloud/
├── appp/
│   └── app.py                 # Flask backend, all APIs
├── static/
│   ├── style.css             # Modern, responsive styling
│   └── crypto.js             # Client-side encryption/decryption
├── templates/
│   ├── layout.html           # Base template
│   ├── login.html            # Login page
│   ├── register.html         # Registration page
│   └── dashboard.html        # File management dashboard
├── requirements.txt          # Python dependencies
├── .env.example             # Environment template
├── UI_UX_IMPROVEMENTS.md    # Detailed UI/UX changes
└── README.md               # This file
```

## 🎨 UI/UX Improvements

This version includes a complete redesign with:

- **Modern Design System**: Cohesive color palette and typography
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Improved Forms**: Better input styling with validation feedback
- **File Management**: Grid-based file display with drag-and-drop upload
- **Notifications**: Non-intrusive alert system
- **Loading States**: Clear feedback during operations
- **Accessibility**: Semantic HTML, keyboard navigation, contrast standards

See [UI_UX_IMPROVEMENTS.md](UI_UX_IMPROVEMENTS.md) for detailed changes.

## 📦 Dependencies

```
Flask==2.3.2           # Web framework
pymongo==4.4.0         # MongoDB driver
bcrypt==4.0.1          # Password hashing
python-dotenv==1.0.0   # Environment variables
```

## 🔐 Security Architecture

### Client-Side
- PBKDF2 key derivation (200,000 iterations)
- AES-GCM encryption (256-bit)
- All crypto happens in browser
- Password never sent to server after login

### Server-Side
- Bcrypt password hashing
- MongoDB GridFS for file storage
- User isolation (can only access own files)
- Session-based authentication

### Limitations
- Session stored in browser (use secure cookies in production)
- Key kept in memory (use better practices in production)
- No HTTPS enforcement (use HTTPS in production)
- No rate limiting (add in production)
- No audit logs (add in production)

## 📚 API Endpoints

### Authentication
```
POST /api/register          # Create new account
POST /api/login            # Login and get salt
POST /api/logout           # Logout and clear session
```

### Files
```
POST /api/upload           # Upload encrypted file
GET  /api/files           # List user's files
GET  /api/download/<id>   # Download encrypted file
POST /api/delete/<id>     # Delete file
```

## 🎯 Usage Example

### Register and Login
1. Open http://127.0.0.1:5000/
2. Click "Create Account"
3. Enter username and password
4. Login with your credentials

### Upload a File
1. Click on the upload area or drag-and-drop
2. Select a file
3. File is encrypted in browser and uploaded
4. Size and name stored on server (encrypted metadata coming)

### Download a File
1. Click "Download" on any file in your list
2. File is downloaded and automatically decrypted
3. Original filename and content restored

### Delete a File
1. Click "Delete" on any file
2. File is permanently removed from storage

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: Connection refused
```
- Ensure MongoDB is running
- Check MONGO_URI in .env
- Verify MongoDB is listening on correct port

### Files Not Appearing
```
No files displayed after upload
```
- Check browser console for errors (F12)
- Verify MongoDB is running
- Check .env variables
- Clear browser cache and refresh

### Decryption Failed
```
Decryption failed message
```
- Ensure you're using same password as upload
- Check browser console for detailed error
- Try re-login to refresh session

### Port Already in Use
```
Address already in use
```
- Flask default port is 5000
- Change in app.py: `app.run(port=5001)`
- Or kill process using port 5000

## 🚀 Deployment Considerations

### Before Going Live
1. **Use HTTPS/TLS** - Encrypt transport layer
2. **Secure Cookies** - HttpOnly, Secure, SameSite flags
3. **CORS Configuration** - Restrict allowed origins
4. **Rate Limiting** - Prevent brute force attacks
5. **Audit Logging** - Track user actions
6. **Database Authentication** - Secure MongoDB credentials
7. **Environment Variables** - Use proper secret management
8. **Security Headers** - CSP, X-Frame-Options, etc.
9. **GDPR Compliance** - Data deletion, privacy policy
10. **Security Audit** - Professional review

## 📖 Educational Resources

### Cryptography
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2)
- [AES-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode)

### Flask
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Flask Security Best Practices](https://flask.palletsprojects.com/)

### MongoDB
- [MongoDB Docs](https://docs.mongodb.com/)
- [GridFS](https://docs.mongodb.com/manual/core/gridfs/)

## 🤝 Contributing

This is a learning project. Improvements welcome:
1. Report bugs
2. Suggest features
3. Improve documentation
4. Enhance security
5. Optimize performance

## 📝 License

Educational project. Use freely for learning purposes.

## ⚠️ Disclaimer

This application is provided **AS-IS** for educational purposes. The authors are not responsible for:
- Data loss
- Security breaches
- Privacy violations
- Unauthorized access
- Any damages resulting from use

For production use, conduct a professional security audit and implement all recommended security measures.

## 🔗 Quick Links

- [UI/UX Improvements](UI_UX_IMPROVEMENTS.md)
- [Original README](readme/readme)
- [Environment Example](docs/.env.example)

## 📧 Support

For questions or issues:
1. Check the troubleshooting section
2. Review browser console (F12)
3. Check server logs
4. Verify environment configuration

---

**Remember**: This is a demo application. For real-world deployment, security is paramount. Conduct thorough testing, implement all security measures, and follow industry best practices.

🔐 Keep your privacy private. 🚀
