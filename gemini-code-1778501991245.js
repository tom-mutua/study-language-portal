// ================================================================
// STUDY LANGUAGE ACADEMY — RECTIFIED FIREBASE LAYER v7
// ================================================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBrim8slBBAutaF3JKUJLBsztmLbUERQew",
  authDomain: "sea-portal-a0dc9.firebaseapp.com",
  projectId: "sea-portal-a0dc9",
  storageBucket: "sea-portal-a0dc9.firebasestorage.app",
  messagingSenderId: "636871653964",
  appId: "1:636871653964:web:903171c552463d243712e9"
};

// ── EMAILJS CONFIGURATION (UPDATED FROM YOUR DETAILS) ──────────
const EMAILJS_CONFIG = {
  publicKey:           "76sDmmTYiCsUds0GQ", 
  serviceId:           "service_gmail",
  studentTemplateId:   "template_76nscdr", // Welcome Template from screenshot
  adminTemplateId:     "template_76nscdr", // Using same for now, or update if you make a 2nd one
  adminEmail:          "smartdestinydealers@gmail.com"
};

// ── INITIALIZATION ──────────────────────────────────────────
let _FS;
if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
}
_FS = firebase.firestore();

// ── REGISTRATION LOGIC (Saves to 'students' collection) ──────
async function SEA_REGISTER_STUDENT(name, email, password, phone, language, level, recruiterCode = '') {
  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;
    const admissionNo = "SLA-" + Math.floor(1000 + Math.random() * 9000);

    const studentData = {
      id: uid,
      name: name,
      email: email,
      phone: phone,
      language: language,
      currentLevel: parseInt(level),
      admissionNumber: admissionNo,
      recruiterCode: recruiterCode || 'Direct',
      status: 'active',
      joinedDate: Date.now()
    };

    // This ensures the student is saved where the Staff Portal looks
    await _FS.collection('students').doc(uid).set(studentData);
    
    // Trigger Emails
    SEA_SEND_EMAILS(studentData);

    return { success: true };
  } catch (error) {
    console.error("Registration Error:", error);
    return { success: false, error: error.message };
  }
}

// ── FETCH LOGIC (Makes students appear in the table) ─────────
async function SEA_GET_ALL_STUDENTS() {
  try {
    const snapshot = await _FS.collection('students').get();
    const students = [];
    snapshot.forEach(doc => {
        students.push(doc.data());
    });
    console.log("Students loaded for staff:", students.length);
    return students;
  } catch (e) {
    console.error("Fetch Error:", e);
    return [];
  }
}

// ── EMAIL AUTOMATION ──────────────────────────────────────────
async function SEA_SEND_EMAILS(student) {
  try {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    
    // Send Welcome Email to Student
    await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.studentTemplateId, {
      to_name: student.name,
      to_email: student.email,
      admission_number: student.admissionNumber,
      level: student.currentLevel
    });
    
    console.log("✅ Automated emails sent successfully!");
  } catch(err) { 
    console.error("❌ Email failed to send:", err); 
  }
}