# 📌 Recruitment System - Fullstack App

מערכת גיוס עובדים הכוללת ממשקים למגייסים, מועמדים ומנהל מערכת. פותחה ב־React (Frontend), Express ו־Prisma (Backend), עם מסד נתונים PostgreSQL.

---

## 🧰 טכנולוגיות

- 🔹 **Frontend:** React 19, TailwindCSS, Vite  
- 🔹 **Backend:** Node.js, Express, Prisma, JWT  
- 🔹 **Database:** PostgreSQL  
- 🔹 **Authentication:** JSON Web Token (JWT)

---

## ✨ תכונות עיקריות

- 🧑‍💼 מגייסים:
  - פרסום משרות
  - ניהול מועמדויות
  - צפייה בדשבורד עם סטטיסטיקות

- 👨‍💻 מועמדים:
  - הרשמה והתחברות
  - הצגת משרות עם חיפוש
  - שליחת קורות חיים בפורמט PDF בלבד
  - צפייה במועמדויות

- 👑 מנהל מערכת:
  - צפייה בכל המשתמשים
  - מחיקת משתמשים
  - שינוי תפקידים
  - סטטיסטיקות מערכת

---

## 🖼️ צילומי מסך

#### 🔐 התחברות:
![login](./screenshots/login.png)

#### 🏠 דשבורד מועמד:
![candidate](./screenshots/candidate_dashboard.png)

#### 📄 משרות:
![jobs](./screenshots/job_list.png)

#### 📥 הגשת מועמדות:
![apply](./screenshots/apply.png)

#### 📊 דשבורד מגייס:
![recruiter](./screenshots/recruiter_dashboard.png)

#### 👑 דשבורד מנהל:
![admin](./screenshots/admin_dashboard.png)

---

## ▶️ דמו אינטראקטיבי

![](./screenshots/demo.gif)

---

## ⚙️ התקנה מקומית

```bash
# 1. התקנת התלויות
npm install

# 2. יצירת קובץ .env
cp .env.example .env

# 3. הרצת מסד הנתונים (PostgreSQL) והרצת Prisma
npx prisma migrate dev --name init

# 4. הפעלת השרת
npm run dev
```

---

## 👤 משתמשים לדוגמה

| תפקיד      | אימייל                  | סיסמה          |
|------------|--------------------------|----------------|
| Admin      | admin@example.com        | admin123       |
| Recruiter  | recruiter@example.com    | recruiter123   |
| Candidate  | candidate@example.com    | candidate123   |

---

## 📄 הערות

- התמיכה ברספונסיביות מלאה
- כל הבקשות לשרת מאובטחות עם JWT
- הקוד ממודול ומסודר לפי תפקידים