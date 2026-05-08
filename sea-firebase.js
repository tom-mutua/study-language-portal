// ================================================================
// STUDY LANGUAGE ACADEMY — Firebase Integration Layer v4 (FIXED)
// ================================================================
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBrim8slBBAutaF3JKUJLBsztmLbUERQew",
  authDomain:        "sea-portal-a0dc9.firebaseapp.com",
  projectId:         "sea-portal-a0dc9",
  storageBucket:     "sea-portal-a0dc9.firebasestorage.app",
  messagingSenderId: "636871653964",
  appId:             "1:636871653964:web:903171c552463d243712e9"
};

const EMAILJS_CONFIG = {
  publicKey:           "YOUR_EMAILJS_PUBLIC_KEY",
  serviceId:           "YOUR_EMAILJS_SERVICE_ID",
  studentTemplateId:   "YOUR_STUDENT_WELCOME_TEMPLATE_ID",
  adminTemplateId:     "YOUR_ADMIN_ALERT_TEMPLATE_ID",
  adminEmail:          "smartdestinydealers@gmail.com"
};

// ── FIREBASE INIT ─────────────────────────────────────────────
let _AUTH, _FS, _FIREBASE_READY = false;
function SEA_INIT_FIREBASE() {
  try {
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    _AUTH = firebase.auth();
    _FS   = firebase.firestore();
    _FS.settings({ merge: true });
    _FIREBASE_READY = true;
    console.log('[SEA Firebase] Initialised');
  } catch(e) {
    console.warn('[SEA Firebase] Init failed — falling back to localStorage', e);
    _FIREBASE_READY = false;
  }
}

// ── IN-MEMORY CACHE ───────────────────────────────────────────
const _C = {
  students:[], staff:[], results:[], materials:[],
  classes:[], recruiters:[], messages:[], logs:[],
  examWindows:[], customExams:[], loaded:false
};
const _COL = {
  students:'students', staff:'staff', results:'results3',
  materials:'materials', classes:'classes', recruiters:'recruiters',
  messages:'messages', logs:'logs', examWindows:'exam_windows',
  customExams:'custom_exams', langRequests:'lang_requests'
};
const _LS = k => 'sea3_' + k;

function _lsLoad(col) {
  try { return JSON.parse(localStorage.getItem(_LS(col)) || '[]'); } catch(e) { return []; }
}
function _lsSave(col, arr) {
  try { localStorage.setItem(_LS(col), JSON.stringify(arr)); } catch(e) {}
}

// ── REAL-TIME LISTENERS (students + logs sync across all devices)
function SEA_START_REALTIME() {
  if (!_FIREBASE_READY) return;
  // Live student sync — staff dashboard updates instantly when new student registers
  _FS.collection('students').onSnapshot(snap => {
    _C.students = snap.docs.map(d => { const data = d.data(); if (!data.id) data.id = d.id; return data; });
    _lsSave('students', _C.students);
    console.log('[SEA Firebase] Students live-synced:', _C.students.length);
  }, e => console.warn('[SEA Firebase] Student listener error:', e));
  // Live log sync — activity logs update across all devices
  _FS.collection('logs').onSnapshot(snap => {
    _C.logs = snap.docs.map(d => { const data = d.data(); if (!data.id) data.id = d.id; return data; });
    _C.logs.sort((a,b) => (b.timestamp||0) - (a.timestamp||0));
    _lsSave('logs', _C.logs);
  }, e => console.warn('[SEA Firebase] Log listener error:', e));
}

// ── LOAD ALL DATA FROM FIRESTORE ──────────────────────────────
async function SEA_LOAD_ALL() {
  if (_C.loaded) return;
  if (_FIREBASE_READY) {
    try {
      const keys  = Object.keys(_COL);
      const snaps = await Promise.allSettled(
        Object.values(_COL).map(col => _FS.collection(col).get())
      );
      snaps.forEach((res, i) => {
        const key = keys[i];
        if (res.status === 'fulfilled') {
          _C[key] = res.value.docs.map(d => {
            const data = d.data();
            if (!data.id) data.id = d.id;
            return data;
          });
          _lsSave(_COL[key], _C[key]);
        } else {
          _C[key] = _lsLoad(_COL[key]);
        }
      });
      console.log('[SEA Firebase] All collections loaded');
    } catch(e) {
      console.warn('[SEA Firebase] Firestore load failed, using localStorage', e);
      Object.keys(_COL).forEach(k => { _C[k] = _lsLoad(_COL[k]); });
    }
  } else {
    Object.keys(_COL).forEach(k => { _C[k] = _lsLoad(_COL[k]); });
  }
  _C.loaded = true;
}

// ── FORCE REFRESH (bypasses cache) ───────────────────────────
async function SEA_FORCE_REFRESH() {
  _C.loaded = false;
  await SEA_LOAD_ALL();
  console.log('[SEA Firebase] Force refresh done');
}

// ── FIRESTORE WRITE ───────────────────────────────────────────
function _fsSet(col, id, data) {
  if (_FIREBASE_READY) {
    _FS.collection(col).doc(id).set(data).catch(e => console.warn('[SEA Firebase] Write failed:', e));
  }
}
function _fsDel(col, id) {
  if (_FIREBASE_READY) {
    _FS.collection(col).doc(id).delete().catch(e => console.warn('[SEA Firebase] Delete failed:', e));
  }
}

// ── OVERRIDE DB WITH FIREBASE-BACKED VERSIONS ─────────────────
function SEA_OVERRIDE_DB() {
  // Students
  DB.getStudents   = ()  => _C.students;
  DB.getStudent    = id  => _C.students.find(s => s.id === id) || null;
  DB.saveStudents  = arr => { _C.students = arr; arr.forEach(s => _fsSet('students', s.id, s)); _lsSave('students', arr); };
  DB.saveStudent   = s   => { const i = _C.students.findIndex(x => x.id === s.id); i >= 0 ? _C.students[i] = s : _C.students.push(s); _fsSet('students', s.id, s); _lsSave('students', _C.students); };
  DB.deleteStudent = id  => { _C.students = _C.students.filter(s => s.id !== id); _fsDel('students', id); _lsSave('students', _C.students); };
  // Staff
  DB.getStaff       = ()  => _C.staff;
  DB.getStaffById   = id  => _C.staff.find(s => s.id === id) || null;
  DB.saveStaff      = arr => { _C.staff = arr; arr.forEach(s => _fsSet('staff', s.id, s)); _lsSave('staff', arr); };
  DB.saveStaffMember= s   => { const i = _C.staff.findIndex(x => x.id === s.id); i >= 0 ? _C.staff[i] = s : _C.staff.push(s); _fsSet('staff', s.id, s); _lsSave('staff', _C.staff); };
  // Results
  DB.getResults  = ()  => _C.results;
  DB.addResult   = r   => { _C.results.push(r); _fsSet('results3', r.id || generateId('res'), r); _lsSave('results3', _C.results); };
  DB.saveResults = arr => { _C.results = arr; arr.forEach(r => _fsSet('results3', r.id || generateId('res'), r)); _lsSave('results3', arr); };
  // Materials
  DB.getMaterials  = ()  => _C.materials;
  DB.getMaterial   = id  => _C.materials.find(m => m.id === id) || null;
  DB.saveMaterials = arr => { _C.materials = arr; arr.forEach(m => _fsSet('materials', m.id, m)); _lsSave('materials', arr); };
  DB.saveMaterial  = m   => { const i = _C.materials.findIndex(x => x.id === m.id); i >= 0 ? _C.materials[i] = m : _C.materials.push(m); _fsSet('materials', m.id, m); _lsSave('materials', _C.materials); };
  // Classes
  DB.getClasses  = ()  => _C.classes;
  DB.getClass    = id  => _C.classes.find(c => c.id === id) || null;
  DB.saveClass   = c   => { const i = _C.classes.findIndex(x => x.id === c.id); i >= 0 ? _C.classes[i] = c : _C.classes.push(c); _fsSet('classes', c.id, c); _lsSave('classes', _C.classes); };
  DB.saveClasses = arr => { _C.classes = arr; arr.forEach(c => _fsSet('classes', c.id, c)); _lsSave('classes', arr); };
  // Recruiters
  DB.getRecruiters     = ()   => _C.recruiters;
  DB.getRecruiter      = id   => _C.recruiters.find(r => r.id === id) || null;
  DB.getRecruiterByCode= code => _C.recruiters.find(r => r.code === code?.toUpperCase()) || null;
  DB.saveRecruiter     = r    => { const i = _C.recruiters.findIndex(x => x.id === r.id); i >= 0 ? _C.recruiters[i] = r : _C.recruiters.push(r); _fsSet('recruiters', r.id, r); _lsSave('recruiters', _C.recruiters); };
  DB.saveRecruiters    = arr  => { _C.recruiters = arr; arr.forEach(r => _fsSet('recruiters', r.id, r)); _lsSave('recruiters', arr); };
  // Messages
  DB.getMessages = ()  => _C.messages;
  DB.addMessage  = m   => { _C.messages.unshift(m); _fsSet('messages', m.id, m); _lsSave('messages', _C.messages); };
  // Logs
  DB.getLogs  = ()  => _C.logs;
  DB.addLog   = e   => {
    const log = {...e, id: 'log_'+Date.now()+Math.random().toString(36).slice(2,5)};
    _C.logs.unshift(log);
    if(_C.logs.length > 500) _C.logs = _C.logs.slice(0,500);
    _fsSet('logs', log.id, log);
    _lsSave('logs', _C.logs);
  };
  // Exam Windows
  DB.getExamWindows  = ()  => _C.examWindows;
  DB.getExamWindow   = (level, classId) => _C.examWindows.find(w => w.level === level && w.classId === classId) || null;
  DB.saveExamWindow  = w   => { const i = _C.examWindows.findIndex(x => x.id === w.id); i >= 0 ? _C.examWindows[i] = w : _C.examWindows.push(w); _fsSet('exam_windows', w.id, w); _lsSave('exam_windows', _C.examWindows); };
  DB.saveExamWindows = arr => { _C.examWindows = arr; arr.forEach(w => _fsSet('exam_windows', w.id, w)); };
  // Custom Exams
  DB.getCustomExams  = ()  => _C.customExams;
  DB.saveCustomExam  = e   => { const i = _C.customExams.findIndex(x => x.id === e.id); i >= 0 ? _C.customExams[i] = e : _C.customExams.push(e); _fsSet('custom_exams', e.id, e); _lsSave('custom_exams', _C.customExams); };
  // Session
  DB.currentUser    = ()   => localStorage.getItem('sea3_sess3_student');
  DB.setCurrentUser = id   => localStorage.setItem('sea3_sess3_student', id);
  DB.logoutStudent  = ()   => { localStorage.removeItem('sea3_sess3_student'); if(_AUTH) _AUTH.signOut().catch(()=>{}); };
  DB.currentStaff   = ()   => localStorage.getItem('sea3_sess3_staff');
  DB.setCurrentStaff= id   => localStorage.setItem('sea3_sess3_staff', id);
  DB.logoutStaff    = ()   => { localStorage.removeItem('sea3_sess3_staff'); if(_AUTH) _AUTH.signOut().catch(()=>{}); };
  DB.save           = (k,v)=> { _lsSave(k, v); };

  // Seed staff if empty
  if (_C.staff.length === 0) {
    const adminRecord = {
      id:'staff_001', name:'Administrator', email:'musautom54@gmail.com',
      phone:'+254735567826', pass:'sea2026admin', role:'chief_admin',
      isActive:true, isSuspended:false, assignedStudents:[], assignedClasses:[],
      joinDate:Date.now(), lastLogin:null
    };
    _C.staff.push(adminRecord);
    _fsSet('staff', adminRecord.id, adminRecord);
    _lsSave('staff', _C.staff);
  }
  // Seed materials if empty
  if (_C.materials.length === 0) {
    seedMaterials();
    _C.materials = JSON.parse(localStorage.getItem('sea3_materials') || '[]');
    _C.materials.forEach(m => _fsSet('materials', m.id, m));
  }
}

// ── FIREBASE AUTH — STUDENT SIGNUP (FIXED) ────────────────────
async function SEA_SIGNUP(email, password, studentData) {
  if (_FIREBASE_READY) {
    try {
      const cred = await _AUTH.createUserWithEmailAndPassword(email, password);
      studentData.firebaseUid = cred.user.uid;
      await cred.user.sendEmailVerification().catch(() => {});
    } catch(fbErr) {
      if (fbErr.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists.');
      }
      throw fbErr;
    }
    // Save directly to Firestore and wait — ensures data is there before redirect
    await _FS.collection('students').doc(studentData.id).set(studentData);
    const i = _C.students.findIndex(x => x.id === studentData.id);
    if (i >= 0) _C.students[i] = studentData; else _C.students.push(studentData);
    _lsSave('students', _C.students);
  } else {
    DB.saveStudent(studentData);
  }
  await SEA_SEND_WELCOME_EMAIL(studentData);
  await SEA_NOTIFY_ADMIN(studentData);
}

// ── FIREBASE AUTH — STUDENT LOGIN (FIXED) ─────────────────────
async function SEA_STUDENT_LOGIN(email, password) {
  // Always fetch fresh from Firestore to avoid stale cache
  let student = null;
  if (_FIREBASE_READY) {
    const snap = await _FS.collection('students').where('email','==',email.toLowerCase()).limit(1).get();
    if (!snap.empty) {
      student = snap.docs[0].data();
      if (!student.id) student.id = snap.docs[0].id;
      const i = _C.students.findIndex(x => x.id === student.id);
      if (i >= 0) _C.students[i] = student; else _C.students.push(student);
    }
  } else {
    student = _C.students.find(s => s.email === email.toLowerCase()) || null;
  }
  if (!student) throw new Error('No account found with this email.');
  // Authenticate via Firebase Auth, fallback to stored pass
  if (_FIREBASE_READY) {
    try {
      await _AUTH.signInWithEmailAndPassword(email, password);
    } catch(e) {
      if (student.pass && student.pass !== password) throw new Error('Incorrect password.');
    }
  } else {
    if (student.pass !== password) throw new Error('Incorrect password.');
  }
  if (!student.isActive) throw new Error('Your account has been suspended. Contact: ' + SEA_CONTACT.email);
  student.lastLogin = Date.now();
  DB.saveStudent(student);
  return student;
}

// ── FIREBASE AUTH — STAFF LOGIN ───────────────────────────────
async function SEA_STAFF_LOGIN(email, password) {
  await SEA_LOAD_ALL();
  let staff = _C.staff.find(s => s.email === email.toLowerCase() && s.pass === password);
  if (!staff && _FIREBASE_READY) {
    const snap = await _FS.collection('staff').where('email','==',email.toLowerCase()).limit(1).get();
    if (!snap.empty) {
      const data = snap.docs[0].data();
      if (!data.id) data.id = snap.docs[0].id;
      if (data.pass !== password) throw new Error('Incorrect password.');
      staff = data;
      const i = _C.staff.findIndex(x => x.id === staff.id);
      if (i >= 0) _C.staff[i] = staff; else _C.staff.push(staff);
    }
  }
  if (!staff) throw new Error('Incorrect email or password.');
  if (staff.isSuspended) throw new Error('Account suspended. Contact the Chief Admin.');
  staff.lastLogin = Date.now();
  DB.saveStaffMember(staff);
  return staff;
}

// ── EMAIL NOTIFICATIONS ───────────────────────────────────────
async function SEA_SEND_WELCOME_EMAIL(student) {
  try {
    if (typeof emailjs === 'undefined' || EMAILJS_CONFIG.publicKey.startsWith('YOUR_')) return;
    emailjs.init(EMAILJS_CONFIG.publicKey);
    await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.studentTemplateId, {
      to_name:          student.name,
      to_email:         student.email,
      admission_number: student.admissionNumber,
      level:            'Level ' + student.currentLevel,
      fee_due:          '$' + enrollFee(student.currentLevel).toFixed(2),
      academy_email:    SEA_CONTACT.email,
      academy_phone:    SEA_CONTACT.phone,
    });
  } catch(e) { console.warn('[SEA Email] Welcome email failed:', e); }
}

async function SEA_NOTIFY_ADMIN(student) {
  try {
    if (typeof emailjs === 'undefined' || EMAILJS_CONFIG.publicKey.startsWith('YOUR_')) return;
    emailjs.init(EMAILJS_CONFIG.publicKey);
    await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.adminTemplateId, {
      student_name:     student.name,
      student_email:    student.email,
      student_phone:    student.phone || '—',
      admission_number: student.admissionNumber,
      level:            'Level ' + student.currentLevel,
      join_date:        new Date().toLocaleDateString('en-GB'),
      recruiter_code:   student.recruiterCode || 'None',
    });
  } catch(e) { console.warn('[SEA Email] Admin notification failed:', e); }
}

// ── MASTER INIT FUNCTION ──────────────────────────────────────
async function SEA_FIREBASE_INIT() {
  SEA_INIT_FIREBASE();
  await SEA_LOAD_ALL();
  SEA_OVERRIDE_DB();
  SEA_START_REALTIME(); // Start live sync after data is loaded
}
