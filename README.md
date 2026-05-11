# Study Language Academy — Portal v4.2

> **A complete multilingual language academy management system.**  
> Built by Mr Tom M. Mutua · Nairobi, Kenya · 2025–2026

---

## 📁 Project Files

| File | Purpose |
|------|---------|
| `index.html` | Public homepage — student apply, login, staff login |
| `student.html` | Student dashboard — materials, fees, exam, profile |
| `staff.html` | Staff dashboard — students, classes, finance, results |
| `exam.html` | Online exam engine — timed MCQ + speaking tasks |
| `recruiter.html` | Recruiter dashboard — referrals, commissions |
| `sea-shared.js` | Shared data layer — DB, helpers, config |
| `sea-firebase.js` | Firebase auth/Firestore integration layer |
| `firebase.json` | Firebase Hosting + Firestore config |
| `firestore.rules` | Firestore security rules |
| `firestore.indexes.json` | Firestore composite index definitions |
| `sla-logo.png` | Academy logo (favicon + nav) |

---

## 🚀 Quick Start — GitHub Pages (No Firebase)

The portal works **100% offline** using localStorage. No backend required to run it.

### 1. Create a GitHub repository

```bash
git init
git add .
git commit -m "Study Language Academy Portal v4.2"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sla-portal.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Source: **Deploy from a branch** → `main` → `/ (root)`
3. Click **Save**
4. Your site will be live at: `https://YOUR_USERNAME.github.io/sla-portal/`

### 3. Default Admin Login

On first load, the system automatically creates a default admin account:

| Field | Value |
|-------|-------|
| Email | `admin@studyenglish.ac.ke` |
| Password | `sea2025admin` |
| Role | Chief Admin |

> ⚠️ **Change this password immediately** after first login via Settings → Change My Password.

---

## 🔥 Firebase Setup (Optional — for real-time sync)

Use Firebase if you want data to sync across devices and staff members in real time.

### Step 1 — Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project** → name it `sla-portal` → Continue
3. Disable Google Analytics (optional) → **Create Project**

### Step 2 — Enable Authentication

1. In Firebase Console → **Authentication** → **Get Started**
2. Under **Sign-in method** → enable **Email/Password**
3. Click **Save**

### Step 3 — Enable Firestore Database

1. Firebase Console → **Firestore Database** → **Create database**
2. Choose **Start in production mode** → select your region (e.g. `europe-west1`)
3. Click **Enable**

### Step 4 — Get your Firebase Config

1. Firebase Console → **Project Settings** (gear icon) → **Your apps**
2. Click **Add app** → choose **Web** (</> icon)
3. Register the app → copy the `firebaseConfig` object

### Step 5 — Paste Config into sea-firebase.js

Open `sea-firebase.js` and replace the `FIREBASE_CONFIG = null` line:

```javascript
const FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",
  authDomain: "sla-portal.firebaseapp.com",
  projectId: "sla-portal",
  storageBucket: "sla-portal.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Step 6 — Install Firebase CLI and Deploy

```bash
# Install Firebase CLI (requires Node.js)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Link to your project
firebase use --add
# Select your project from the list

# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy the website
firebase deploy --only hosting
```

Your site is now live at: `https://sla-portal.web.app`

### Step 7 — Deploy Firestore Security Rules

The `firestore.rules` file is already configured. Rules summary:

| Collection | Public | Student | Staff | Chief Admin |
|-----------|--------|---------|-------|-------------|
| `students` | ✗ | Own doc only | ✓ Read/Write | ✓ Full |
| `staff` | ✗ | ✗ | ✓ Read | ✓ Full |
| `recruiters` | ✗ | ✗ | ✓ Full | ✓ Full |
| `classes` | ✗ | ✓ Read | ✓ Full | ✓ Full |
| `materials` | ✗ | ✓ Read | ✓ Full | ✓ Full |
| `pending_apps` | ✓ Create | ✗ | ✓ Read/Update | ✓ Full |
| `results` | ✗ | ✓ Create | ✓ Full | ✓ Full |

---

## 📱 Mobile Support

The portal is fully mobile-responsive:

- **Homepage** — hamburger menu + fixed bottom action bar (Apply / Login / Staff)
- **Student portal** — slide-in sidebar drawer, touch-friendly targets
- **Staff portal** — scrollable sidebar navigation, responsive tables
- **Exam page** — large tap targets for answer options, full-width buttons

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **Chief Admin** | Everything — only role that can create/delete staff accounts |
| **Academic Dean** | Students, materials, results, certificates, exams, classes |
| **Instructor** | My students, my classes, materials, exam sets, feedback |
| **Finance Officer** | Finance, payments, waivers, recruiters, reports |
| **Admissions & Comms** | Registry, students, messages, contacts, pending applications |
| **Student** | Dashboard, materials, fees, exam, profile, questions |
| **Recruiter** | Referral stats, commission history, appointment letter |

---

## 🌐 Languages Supported

The academy supports teaching in 9 languages:

| Language | Native Name | Cert |
|----------|------------|------|
| English | English | CEFR |
| Swahili | Kiswahili | CEFR |
| French | Français | DELF |
| Arabic | العربية | CEFR |
| German | Deutsch | Goethe |
| Spanish | Español | DELE |
| Portuguese | Português | CELPE |
| Koine Greek | Ἑλληνική | CEFR |
| Biblical Hebrew | עִבְרִית | CEFR |

---

## 💰 Fee Structure

| Level | CEFR | Total Fee | Duration |
|-------|------|-----------|----------|
| Level 1 — Foundation | A1–A2 | $99 | 3 months |
| Level 2 — Intermediate | B1 | $120 | 3 months |
| Level 3 — Advanced | B2–C1 | $120 | 3 months |

Payment is split: **50% enrolment** → **25% month 2** → **25% month 3**

---

## 📧 Contact

**Study Language Academy**  
Email: smartdestinydealers@gmail.com  
Phone: +254 735 567 826  
Location: Nairobi, Kenya

---

## 📄 Licence

© 2025–2026 Study Language Academy. All rights reserved.  
Built and maintained by Mr Tom M. Mutua.
