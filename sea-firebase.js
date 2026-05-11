// ================================================================
// STUDY LANGUAGE ACADEMY — Firebase / Auth Layer  v4.2
// ================================================================
// Works 100% with localStorage (no Firebase needed to run locally).
// To enable Firebase: fill in FIREBASE_CONFIG below and deploy.
// ================================================================

// ── STEP 1: Paste your Firebase project config here (optional) ──
// Get it from: Firebase Console → Project Settings → Your Apps → SDK setup
const FIREBASE_CONFIG = null;
// Example (uncomment and fill in to activate):
// const FIREBASE_CONFIG = {
//   apiKey: "AIzaSy...",
//   authDomain: "your-project.firebaseapp.com",
//   projectId: "your-project",
//   storageBucket: "your-project.appspot.com",
//   messagingSenderId: "123456789",
//   appId: "1:123456789:web:abcdef123456"
// };

// ── Internal ──
window._useFirebase = false;

// ── INIT ──────────────────────────────────────────────────────────
async function SEA_FIREBASE_INIT() {
  _seedDefaultAdmin();

  if (FIREBASE_CONFIG && typeof firebase !== 'undefined') {
    try {
      if (!firebase.apps || !firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      window._useFirebase = true;
      console.log('[SLA] Firebase connected.');
    } catch (e) {
      window._useFirebase = false;
      console.warn('[SLA] Firebase init failed — using localStorage.', e.message);
    }
  } else {
    window._useFirebase = false;
  }
}

// ── SEED / FORCE-UPDATE ADMIN ACCOUNTS ───────────────────────────
function _seedDefaultAdmin() {
  try {
    // Always force-write both accounts so credentials are never stale
    DB.saveStaffMember({
      id: 'staff_admin_001', name: 'Chief Admin',
      email: 'admin@studylanguage.ac.ke', phone: SEA_CONTACT.phone,
      pass: 'sla2025admin', role: 'chief_admin',
      isActive: true, isSuspended: false,
      assignedStudents: [], assignedClasses: [],
      joinDate: Date.now(), lastLogin: null,
    });
    DB.saveStaffMember({
      id: 'staff_owner_001', name: 'Administrator',
      email: 'musautom54@gmail.com', phone: SEA_CONTACT.phone,
      pass: 'sea2026admin', role: 'chief_admin',
      isActive: true, isSuspended: false,
      assignedStudents: [], assignedClasses: [],
      joinDate: Date.now(), lastLogin: null,
    });
  } catch (e) {
    console.warn('[SLA] Seed error:', e.message);
  }
}

// ── STUDENT SIGN UP ───────────────────────────────────────────────
async function SEA_SIGNUP(email, pass, studentData) {
  // Always check for duplicate email first
  const existing = DB.getStudents().find(s => s.email === email);
  if (existing) {
    throw new Error('An account with this email already exists. Please log in instead.');
  }

  if (window._useFirebase) {
    try {
      const cred = await firebase.auth().createUserWithEmailAndPassword(email, pass);
      studentData.uid = cred.user.uid;
      const clean = JSON.parse(JSON.stringify(studentData));
      await firebase.firestore().collection('students').doc(cred.user.uid).set(clean);
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        // Firebase says duplicate — still save to localStorage so local login works
        console.warn('[SLA] Firebase: email already in use — saving to localStorage only.');
      } else {
        throw new Error(e.message || 'Registration failed. Please try again.');
      }
    }
  }

  // ALWAYS persist to localStorage — this is the source of truth for login
  DB.saveStudent(studentData);
  return studentData;
}

// ── STUDENT LOGIN ─────────────────────────────────────────────────
async function SEA_STUDENT_LOGIN(email, pass) {
  // localStorage is always checked first — it's the authoritative store
  const student = DB.getStudents().find(s => s.email === email);

  if (!student) {
    throw new Error('No account found with this email address. Please apply for admission first.');
  }
  if (student.pass !== pass) {
    throw new Error('Incorrect password. Please check and try again.');
  }
  if (!student.isActive) {
    throw new Error('Your account has been suspended. Please contact the Academy.');
  }

  student.lastLogin = Date.now();
  DB.saveStudent(student);

  // If Firebase is on, also sign in there (silently — don't fail login if Firebase is down)
  if (window._useFirebase) {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, pass);
    } catch (_) { /* ignore Firebase auth errors — localStorage login already succeeded */ }
  }

  return student;
}

// ── STAFF LOGIN ───────────────────────────────────────────────────
async function SEA_STAFF_LOGIN(email, pass) {
  const member = DB.getStaff().find(s => s.email === email);

  if (!member) {
    throw new Error('No staff account found with this email address. Contact the chief admin.');
  }
  if (member.isSuspended) {
    throw new Error('This account has been suspended. Please contact the chief admin.');
  }
  if (!member.isActive) {
    throw new Error('This account is not yet active. Please contact the chief admin.');
  }
  if (member.pass !== pass) {
    throw new Error('Incorrect password. Please try again.');
  }

  member.lastLogin = Date.now();
  DB.saveStaffMember(member);
  return member;
}

// ── FORCE REFRESH (Firebase sync on page load) ────────────────────
async function SEA_FORCE_REFRESH() {
  if (!window._useFirebase || typeof firebase === 'undefined') return;
  // Silently re-sync current student from Firestore if logged in
  try {
    const uid = firebase.auth().currentUser?.uid;
    if (!uid) return;
    const doc = await firebase.firestore().collection('students').doc(uid).get();
    if (doc.exists) {
      const data = { ...doc.data() };
      data.id = data.id || uid;
      DB.saveStudent(data);
    }
  } catch (_) { /* offline — use localStorage cache */ }
}

// ── EMAIL NOTIFICATIONS (EmailJS stubs) ──────────────────────────
// Configure EmailJS at https://www.emailjs.com
// Then replace the stubs below with real emailjs.send() calls.
async function EMAIL_onClassAssigned(student, className, instrName, level) {
  console.log('[SLA Email stub] Class assigned:', student?.name, '→', className);
}
async function EMAIL_onExamResult(student, level, pctScore, gradeLabel) {
  console.log('[SLA Email stub] Exam result:', student?.name, gradeLabel, pctScore + '%');
}
async function EMAIL_onPaymentReceived(student, level, amount) {
  console.log('[SLA Email stub] Payment received:', student?.name, '$' + amount);
}
