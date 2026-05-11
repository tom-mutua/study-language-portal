// ================================================================
// STUDY LANGUAGE ACADEMY — UNIVERSAL FIREBASE LAYER v8
// ================================================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBrim8slBBAutaF3JKUJLBsztmLbUERQew",
  authDomain: "sea-portal-a0dc9.firebaseapp.com",
  projectId: "sea-portal-a0dc9",
  storageBucket: "sea-portal-a0dc9.firebasestorage.app",
  messagingSenderId: "636871653964",
  appId: "1:636871653964:web:903171c552463d243712e9"
};

const EMAILJS_CONFIG = {
  publicKey: "76sDmmTYiCsUds0GQ", 
  serviceId: "service_gmail",
  studentTemplateId: "template_76nscdr",
  adminEmail: "smartdestinydealers@gmail.com"
};

if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
const _FS = firebase.firestore();
const _AUTH = firebase.auth();

// ── REGISTRATION (Saves to multiple places to ensure visibility) ──
async function SEA_REGISTER_STUDENT(name, email, password, phone, language, level, recruiterCode = '') {
  try {
    const userCredential = await _AUTH.createUserWithEmailAndPassword(email, password);
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
      role: 'student',
      joinedDate: Date.now()
    };

    // SAVE TO BOTH COLLECTIONS JUST IN CASE
    await _FS.collection('students').doc(uid).set(studentData);
    await _FS.collection('users').doc(uid).set(studentData);
    
    SEA_SEND_EMAILS(studentData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ── FETCH (Checks both locations) ──
async function SEA_GET_ALL_STUDENTS() {
  try {
    const snapshot = await _FS.collection('students').get();
    if (snapshot.empty) {
        // Fallback to 'users' collection if 'students' is empty
        const userSnap = await _FS.collection('users').where('role', '==', 'student').get();
        return userSnap.docs.map(doc => doc.data());
    }
    return snapshot.docs.map(doc => doc.data());
  } catch (e) {
    return [];
  }
}

async function SEA_SEND_EMAILS(student) {
  try {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.studentTemplateId, {
      to_name: student.name,
      to_email: student.email,
      admission_number: student.admissionNumber
    });
  } catch(err) { console.log("Email error"); }
}