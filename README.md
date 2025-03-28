# 📦 Recruitment System – מערכת ניהול גיוס והשמה

מערכת Full Stack מלאה שפותחה לצורך ניהול תהליכי גיוס והשמה בין מגייסים למועמדים.  
כוללת מנגנוני הרשאות, פרסום משרות, הגשת מועמדות, סטטוסים, חיפוש חכם, סטטיסטיקות, וממשק משתמש מודרני.

---

## 🚀 מבנה הפרויקט

- `backend/` – שרת Express עם REST API, בסיס נתונים PostgreSQL, הרשאות JWT ו־Prisma ORM
- `frontend/` – אפליקציית React עם Tailwind CSS, חיבור ל־API, ניהול טוקן, ניווט מבוסס תפקיד

---

## ✨ תכונות קיימות

### 👥 Authentication
- הרשמה והתחברות
- תפקידים: מגייס / מועמד
- שמירה של טוקן JWT ב־localStorage

### 🧑‍💼 מגייסים
- פרסום משרות חדשות
- צפייה בהגשות למשרות שפורסמו
- שינוי סטטוס של מועמדות (pending / accepted / rejected)
- קבלת סטטיסטיקה לפי סטטוסי הגשה

### 👨‍💻 מועמדים
- צפייה ברשימת משרות
- חיפוש לפי מילות מפתח (כותרת, תיאור, מיקום, חברה)
- הגשת מועמדות למשרה
- מניעת הגשה כפולה
- צפייה ברשימת ההגשות שלו

---

## 🧰 טכנולוגיות

### 🔧 Backend
- Node.js + Express.js
- PostgreSQL
- Prisma ORM
- JWT + Bcrypt
- dotenv + nodemon

### 🎨 Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Axios
- Zustand או Context לניהול מצב
- localStorage לשמירת טוקן

---

## 🛠️ הפעלת המערכת

### 1. Clone & התקנת השרת

```bash
git clone https://github.com/DaniLankin/recruitment-system.git
cd recruitment-system/backend
npm install
