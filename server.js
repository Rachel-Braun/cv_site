const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const fs = require('fs');


// הגדרת תיקיית PDF
const pdfDirectory = path.join(__dirname, 'uploads');

// הגשת קבצים מתוך תיקיית PDF
app.use('/uploads', express.static(pdfDirectory));

// נתיב שמחזיר את שמות קבצי ה-PDF
app.get('/uploads', (req, res) => {
    fs.readdir(pdfDirectory, (err, files) => {
        if (err) {
            return res.status(500).send('שגיאה בקריאת הקבצים');
        }
        // החזרת רק קבצי PDF
        const pdfFiles = files.filter(file => file.endsWith('.pdf'));
        res.json(pdfFiles);
    });
});



// קביעת תיקיית העלאה
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // תיקייה שבה תשמור את הקבצים
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // שם הקובץ המקורי
    }
});

const upload = multer({ storage: storage });
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'pdfs'))); // הגשת קבצי PDF
// הגשת דף הבית
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'welcome.html')); // דף הבית
});

// הגשת דף ההעלאה
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload.html')); // דף ההעלאה
});

// טיפול בבקשת העלאה


app.post('/upload', upload.single('file'), (req, res) => {
    res.send(`
        <html>
        <head>
            <title>העלאה מוצלחת</title>
            <meta http-equiv="refresh" content="2; url=/" /> <!-- הפניית דף לאחר 3 שניות -->
        </head>
        <body>
            <h1>הקובץ הועלה בהצלחה!</h1>
            <p>בעוד 3 שניות תועבר לדף הבית.</p>
        </body>
        </html>
    `);
});


// התחלת השרת
app.listen(3000, () => {
    console.log('השרת פועל על http://localhost:3000');
});
