// ================================================================
// STUDY LANGUAGE ACADEMY — SHARED DATA & UTILITIES v4.0
// ================================================================
const SEA_CONTACT = { email:"smartdestinydealers@gmail.com", phone:"+254735567826", name:"Study Language Academy", location:"Nairobi, Kenya" };

const CONFIG = {
  levelFees: {1: 99, 2: 120, 3: 120},
  enrollmentPct: 50, instalment2Pct: 25, instalment3Pct: 25,
  passMarkAllLevels: 70, recruiterCommissionPct: 10,
  gracePeriodDays: 14, examDurationMinutes: 120,
  maxStudentsPerClass: 20, termMonths: 3,
};
const levelFee = (level) => CONFIG.levelFees[level] || 99;
const enrollFee = (level=1) => parseFloat((levelFee(level) * CONFIG.enrollmentPct / 100).toFixed(2));
const instalment2Fee = (level=1) => parseFloat((levelFee(level) * CONFIG.instalment2Pct / 100).toFixed(2));
const instalment3Fee = (level=1) => parseFloat((levelFee(level) * CONFIG.instalment3Pct / 100).toFixed(2));

// ── 9 LANGUAGES ───────────────────────────────────────────────
const SLA_LANGUAGES = {
  english:    { id:'english',    name:'English',     native:'English',   flag:'🇬🇧', color:'#2a5c3f', cert:'CEFR' },
  swahili:    { id:'swahili',    name:'Swahili',     native:'Kiswahili', flag:'🌍',  color:'#1a5c2a', cert:'CEFR' },
  french:     { id:'french',     name:'French',      native:'Français',  flag:'🇫🇷', color:'#1a3a7a', cert:'DELF' },
  arabic:     { id:'arabic',     name:'Arabic',      native:'العربية',   flag:'🌙',  color:'#7a3a1a', cert:'CEFR' },
  german:     { id:'german',     name:'German',      native:'Deutsch',   flag:'🇩🇪', color:'#2c2c2c', cert:'Goethe'},
  spanish:    { id:'spanish',    name:'Spanish',     native:'Español',   flag:'🇪🇸', color:'#7a1a1a', cert:'DELE' },
  portuguese: { id:'portuguese', name:'Portuguese',  native:'Português', flag:'🇧🇷', color:'#1a5c4a', cert:'CELPE'},
  greek:      { id:'greek',      name:'Koine Greek', native:'Ἑλληνική', flag:'🏛️', color:'#4a3a7a', cert:'CEFR' },
  hebrew:     { id:'hebrew',     name:'Hebrew',      native:'עִבְרִית',  flag:'✡️', color:'#1a3a5c', cert:'CEFR' },
};

const SLA_TEACHING_LANGS = ['english','swahili','french'];

const SEA = {
  name: "Study Language Academy",
  tagline: "Your Gateway to the World's Languages",
  location: "Nairobi, Kenya",
  levels: [
    { id:1, name:"Level 1 – Foundation",   cefr:"A1–A2", color:"#2a5c3f", badge:"#d6ead9", units:6 },
    { id:2, name:"Level 2 – Intermediate", cefr:"B1",    color:"#1a5276", badge:"#d6e8fa", units:8 },
    { id:3, name:"Level 3 – Advanced",     cefr:"B2–C1", color:"#5b3fa0", badge:"#e4d9f5", units:9 },
  ],
};

const STAFF_ROLES = {
  chief_admin:   { label:"Chief Admin",        color:"#c0392b", pages:["dashboard","students","staff","finance","waivers","recruiters","reports","results","materials","notes_editor","certificates","student_questions","feedback","messages","contacts","activitylog","rec_letters","settings","classes","exams_admin","my_exams","registry","pending_apps"] },
  academic_dean: { label:"Academic Dean",      color:"#5b3fa0", pages:["dashboard","students","results","materials","notes_editor","certificates","student_questions","feedback","messages","contacts","classes","exams_admin","my_exams","registry"] },
  instructor:    { label:"Instructor",         color:"#2a5c3f", pages:["dashboard","my_students","my_classes","materials","notes_editor","my_exams","student_questions","feedback","results"] },
  finance:       { label:"Finance Officer",    color:"#1a5276", pages:["dashboard","finance","waivers","recruiters","reports","students","contacts"] },
  admissions:    { label:"Admissions & Comms", color:"#c98a1a", pages:["dashboard","registry","students","messages","contacts","feedback","pending_apps"] },
};

function generateAdmissionNumber() {
  const year = new Date().getFullYear();
  // Use a dedicated counter key — never based on array length (which can repeat after deletions)
  const counterKey = 'sea3_adm_counter_'+year;
  let counter = parseInt(localStorage.getItem(counterKey)||'0',10)+1;
  localStorage.setItem(counterKey, String(counter));
  const seq = String(counter).padStart(4,'0');
  const proposed = `SLA/${year}/${seq}`;
  // Safety: if by any chance this number exists, keep incrementing
  const existing = (JSON.parse(localStorage.getItem('sea3_students')||'[]')||[]).map(s=>s.admissionNumber);
  let final = proposed;
  while(existing.includes(final)){
    counter++;
    localStorage.setItem(counterKey, String(counter));
    final = `SLA/${year}/${String(counter).padStart(4,'0')}`;
  }
  return final;
}

// ── DATABASE ─────────────────────────────────────────────────
const DB = {
  save: (k,v) => { try{localStorage.setItem("sea3_"+k,JSON.stringify(v));}catch(e){} },
  load: (k,def) => { try{const v=localStorage.getItem("sea3_"+k);return v?JSON.parse(v):def;}catch(e){return def;} },
  getStudents: () => DB.load("students",[]),
  saveStudents: a => DB.save("students",a),
  getStudent: id => DB.getStudents().find(s=>s.id===id)||null,
  saveStudent: st => { const all=DB.getStudents(); const i=all.findIndex(s=>s.id===st.id); if(i>=0)all[i]=st; else all.push(st); DB.saveStudents(all); },
  deleteStudent: id => DB.saveStudents(DB.getStudents().filter(s=>s.id!==id)),
  getStaff: () => DB.load("staff",[]),
  saveStaff: a => DB.save("staff",a),
  getStaffById: id => DB.getStaff().find(s=>s.id===id)||null,
  saveStaffMember: st => { const all=DB.getStaff(); const i=all.findIndex(s=>s.id===st.id); if(i>=0)all[i]=st; else all.push(st); DB.saveStaff(all); },
  getRecruiters: () => DB.load("recruiters",[]),
  saveRecruiters: a => DB.save("recruiters",a),
  getRecruiter: id => DB.getRecruiters().find(r=>r.id===id)||null,
  getRecruiterByCode: code => DB.getRecruiters().find(r=>r.code===code?.toUpperCase())||null,
  saveRecruiter: r => { const all=DB.getRecruiters(); const i=all.findIndex(x=>x.id===r.id); if(i>=0)all[i]=r; else all.push(r); DB.saveRecruiters(all); },
  getLogs: () => DB.load("logs",[]),
  addLog: e => { const all=DB.getLogs(); all.unshift({...e,id:"log_"+Date.now(),timestamp:Date.now()}); if(all.length>1000)all.pop(); DB.save("logs",all); },
  getMessages: () => DB.load("messages",[]),
  addMessage: m => { const all=DB.getMessages(); all.unshift(m); DB.save("messages",all); },
  getResults: () => DB.load("results3",[]),
  addResult: r => { const all=DB.getResults(); all.push(r); DB.save("results3",all); },
  saveResults: a => DB.save("results3",a),
  getMaterials: () => DB.load("materials",[]),
  saveMaterials: a => DB.save("materials",a),
  getMaterial: id => DB.getMaterials().find(m=>m.id===id)||null,
  saveMaterial: m => { const all=DB.getMaterials(); const i=all.findIndex(x=>x.id===m.id); if(i>=0)all[i]=m; else all.push(m); DB.saveMaterials(all); },
  getClasses: () => DB.load("classes",[]),
  saveClasses: a => DB.save("classes",a),
  getClass: id => DB.getClasses().find(c=>c.id===id)||null,
  saveClass: c => { const all=DB.getClasses(); const i=all.findIndex(x=>x.id===c.id); if(i>=0)all[i]=c; else all.push(c); DB.saveClasses(all); },
  getCertTemplates: () => DB.load("cert_templates",[]),
  saveCertTemplates: a => DB.save("cert_templates",a),
  getExamWindows: () => DB.load("exam_windows",[]),
  saveExamWindows: a => DB.save("exam_windows",a),
  getExamWindow: (level,classId) => DB.getExamWindows().find(w=>w.level===level&&w.classId===classId)||null,
  saveExamWindow: w => { const all=DB.getExamWindows(); const i=all.findIndex(x=>x.id===w.id); if(i>=0)all[i]=w; else all.push(w); DB.saveExamWindows(all); },
  getCustomExams: () => DB.load("custom_exams",[]),
  saveCustomExam: e => { const all=DB.getCustomExams(); const i=all.findIndex(x=>x.id===e.id); if(i>=0)all[i]=e; else all.push(e); DB.save("custom_exams",all); },
  getLangRequests: () => DB.load("lang_requests",[]),
  saveLangRequest: r => { const all=DB.getLangRequests(); const i=all.findIndex(x=>x.id===r.id); if(i>=0)all[i]=r; else all.push(r); DB.save("lang_requests",all); },
  getNotifications: () => DB.load("staff_notifs",[]),
  addNotification: n => { const all=DB.getNotifications(); all.unshift({...n,id:"notif_"+Date.now(),read:false,date:Date.now()}); if(all.length>200)all.pop(); DB.save("staff_notifs",all); },
  currentUser: () => DB.load("sess3_student",null),
  setCurrentUser: id => DB.save("sess3_student",id),
  logoutStudent: () => localStorage.removeItem("sea3_sess3_student"),
  currentStaff: () => DB.load("sess3_staff",null),
  setCurrentStaff: id => DB.save("sess3_staff",id),
  logoutStaff: () => localStorage.removeItem("sea3_sess3_staff"),
  currentRecruiter: () => DB.load("sess3_recruiter",null),
  setCurrentRecruiter: id => DB.save("sess3_recruiter",id),
  logoutRecruiter: () => localStorage.removeItem("sea3_sess3_recruiter"),
  // ── PENDING APPLICATIONS (staff & recruiter self-registration) ──
  getPendingApps: () => DB.load("pending_apps",[]),
  savePendingApps: a => DB.save("pending_apps",a),
  addPendingApp: app => { const all=DB.getPendingApps(); all.unshift(app); DB.savePendingApps(all); },
  getPendingApp: id => DB.getPendingApps().find(a=>a.id===id)||null,
  updatePendingApp: app => { const all=DB.getPendingApps(); const i=all.findIndex(a=>a.id===app.id); if(i>=0)all[i]=app; else all.unshift(app); DB.savePendingApps(all); },
  removePendingApp: id => DB.savePendingApps(DB.getPendingApps().filter(a=>a.id!==id)),
};

// ── FEE HELPERS ──────────────────────────────────────────────
function makeFeeRecord(level=1){return{total:levelFee(level),paid:0,installments:[],waiver:null,gracePeriod:null,certPaid:false,certUploaded:false,history:[]};}
function studentFeeStatus(student,level){
  const f=student.fees?.[level]||makeFeeRecord(level);
  const now=Date.now();
  const inGrace=f.gracePeriod&&new Date(f.gracePeriod.until).getTime()>now;
  const totalPaid=f.paid; const waiver=f.waiver?f.waiver.amount:0;
  const total=levelFee(level); const balance=Math.max(0,total-totalPaid-waiver);
  const enrol=enrollFee(level); const inst2=instalment2Fee(level); const inst3=instalment3Fee(level);
  const effectivePaid=totalPaid+waiver; const hasAccess=effectivePaid>=enrol||inGrace;
  const firstPayDate=f.history?.find(h=>h.type==='enrollment'||h.type==='instalment')?.date||now;
  const monthsElapsed=Math.floor((now-firstPayDate)/(30*24*3600*1000));
  let expectedByNow=enrol;
  if(monthsElapsed>=1)expectedByNow=Math.min(enrol+inst2,total);
  if(monthsElapsed>=2)expectedByNow=total;
  const installmentOnTrack=effectivePaid>=expectedByNow||!hasAccess;
  let nextPayment=null;
  if(effectivePaid<enrol)nextPayment={amount:enrol,label:'Enrolment (50%)'};
  else if(effectivePaid<enrol+inst2)nextPayment={amount:inst2,label:'Instalment 2 (25%)'};
  else if(effectivePaid<total)nextPayment={amount:inst3,label:'Final Instalment (25%)'};
  return{total,paid:totalPaid,waiver,balance,enrollFee:enrol,inst2Fee:inst2,inst3Fee:inst3,monthlyFee:enrol,hasAccess,installmentOnTrack,inGrace,gracePeriod:f.gracePeriod,certPaid:f.certPaid,certUploaded:f.certUploaded,history:f.history||[],raw:f,nextPayment,recruiterCommissionDue:effectivePaid>=enrol};
}

function recordPayment(student,level,amount,type,ref="",staffId="system"){
  if(!student.fees)student.fees={};
  if(!student.fees[level])student.fees[level]=makeFeeRecord();
  const f=student.fees[level];
  f.paid=parseFloat((f.paid+amount).toFixed(2));
  f.history.push({date:Date.now(),amount,type,ref,approvedBy:staffId});
  if(type==="certificate")f.certPaid=true;
  if(student.recruiterCode){
    const rec=DB.getRecruiterByCode(student.recruiterCode);
    if(rec){
      const lvlFee=levelFee(level);
      const threshold=parseFloat((lvlFee*CONFIG.enrollmentPct/100).toFixed(2));
      const nowPaid=student.fees?.[level]?.paid||amount;
      const prevPaid=nowPaid-amount;
      const alreadyCommissioned=rec.earningsHistory?.some(e=>e.studentId===student.id&&e.level===level);
      if(!alreadyCommissioned&&prevPaid<threshold&&nowPaid>=threshold){
        const commission=parseFloat((lvlFee*CONFIG.recruiterCommissionPct/100).toFixed(2));
        if(!rec.earningsHistory)rec.earningsHistory=[];
        rec.earningsHistory.push({date:Date.now(),studentId:student.id,studentName:student.name,level,commission,status:'pending'});
        rec.totalEarned=parseFloat(((rec.totalEarned||0)+commission).toFixed(2));
        DB.saveRecruiter(rec);
      }
    }
  }
  DB.saveStudent(student);
  return student;
}

// ── UTILITIES ─────────────────────────────────────────────────
function generateId(prefix='id'){return`${prefix}_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;}
function formatDate(ts){if(!ts)return'—';return new Date(ts).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});}
function formatDateTime(ts){if(!ts)return'—';return new Date(ts).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});}
function fmtCurrency(n){return'$'+parseFloat(n||0).toFixed(2);}
function getInitials(name=''){return name.split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase()||'?';}
function logActivity(staffId,staffName,role,action,detail=''){DB.addLog({staffId,staffName,role,action,detail,timestamp:Date.now()});}
function showToast(msg,type='info'){
  const t=document.createElement('div');
  const bg=type==='error'?'#c0392b':type==='success'?'#2a5c3f':type==='warning'?'#c98a1a':'#1a5276';
  t.style.cssText=`position:fixed;bottom:24px;right:24px;z-index:9999;background:${bg};color:#fff;padding:12px 20px;border-radius:8px;font-family:'Nunito',sans-serif;font-size:.85rem;font-weight:700;max-width:340px;box-shadow:0 4px 20px rgba(0,0,0,.25);`;
  t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),4000);
}

function seedMaterials(){if(DB.getMaterials().length>0)return;DB.saveMaterials([]);}

// ── ALIASES (staff.html uses short names) ────────────────────────
const fmtDate     = formatDate;
const fmtDateTime = formatDateTime;

// pct(rawScore, totalQuestions) → integer percentage 0-100
function pct(score, total){ return total>0 ? Math.min(100, Math.round((score/total)*100)) : 0; }

// grade(pctScore) → grade label string
function grade(p){
  if(p>=90) return 'Distinction';
  if(p>=75) return 'Merit';
  if(p>=CONFIG.passMarkAllLevels) return 'Pass';
  return 'Fail';
}

// downloadCSV(arrayOfObjects, filename) — triggers browser download
function downloadCSV(rows, filename='export.csv'){
  if(!rows||!rows.length)return;
  const headers=Object.keys(rows[0]);
  const escape=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';
  const csv=[headers.map(escape).join(','),...rows.map(r=>headers.map(h=>escape(r[h])).join(','))].join('\n');
  const a=document.createElement('a');
  a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);
  a.download=filename;a.click();
}

// QUIZ_BANKS — alias for EXAM_QUESTIONS (staff.html uses this name)
// Defined after EXAM_QUESTIONS is declared below.

// UNIT_TITLES — per-level unit name arrays used in materials editor
const UNIT_TITLES = {
  1: ['Greetings & Introductions','Numbers, Time & Dates','Family & Home','Daily Routines','Food & Shopping','Health, Places & Community'],
  2: ['Talking About the Past','Experiences & Life Events','Plans & the Future','Describing & Comparing','Expressing Opinions','Workplace English','Academic Reading & Writing','Speaking Skills'],
  3: ['Complex Grammar','Critical Reading & Vocabulary','Academic Essay Writing','Debates & Discussion','Research & Presentations','Advanced Professional English','Literature & Media','IELTS/TOEFL Preparation','Independent Research Project'],
};


// ── LESSON CONTENT — 9 LANGUAGES ─────────────────────────────
const LESSON_CONTENT = {

// ══════════════════════════════════════════════════
// ENGLISH
// ══════════════════════════════════════════════════
english:{
 1:{
  1:{title:"Greetings & Introductions",objective:"Greet people politely and introduce yourself in English.",
   youtube:"https://www.youtube.com/embed/4TsFMqaan38",
   swahili_note:"Katika somo hili utajifunza jinsi ya kusalimu na kujitambulisha kwa Kiingereza.",
   french_note:"Dans cette leçon, vous apprendrez à saluer et à vous présenter en anglais.",
   content:`<h3>📖 What You Will Learn</h3><p>In this lesson you will learn how to greet people at different times of the day and introduce yourself confidently.</p>
<h3>🌅 Greetings by Time of Day</h3>
<div class="lesson-table"><table><tr><th>English</th><th>Kiswahili</th><th>When to Use</th></tr>
<tr><td><b>Good morning</b></td><td>Habari ya asubuhi</td><td>Before 12 noon</td></tr>
<tr><td><b>Good afternoon</b></td><td>Habari ya mchana</td><td>12 noon – 5 PM</td></tr>
<tr><td><b>Good evening</b></td><td>Habari ya jioni</td><td>After 5 PM</td></tr>
<tr><td><b>Good night</b></td><td>Usiku mwema</td><td>When going to sleep</td></tr>
<tr><td><b>Hello / Hi</b></td><td>Habari / Hujambo</td><td>Any time (informal)</td></tr></table></div>
<h3>🗣️ Common Questions & Answers</h3>
<div class="lesson-dialogue"><div class="dialogue-line coach">How are you?</div><div class="dialogue-line student">I am fine, thank you. And you?</div><div class="dialogue-line coach">I am well, thank you.</div></div>
<div class="lesson-table"><table><tr><th>Question</th><th>Answer</th></tr>
<tr><td>How are you?</td><td>I am fine / well / good, thank you.</td></tr>
<tr><td>What is your name?</td><td>My name is [Name].</td></tr>
<tr><td>Where are you from?</td><td>I am from Kenya / Nairobi.</td></tr>
<tr><td>Nice to meet you!</td><td>Nice to meet you too!</td></tr></table></div>
<h3>✍️ Sample Introduction</h3>
<div class="lesson-example"><p><em>"Hello! My name is Tom. I am from Nairobi, Kenya. I am a student at Study Language Academy. I am learning English. Nice to meet you!"</em></p></div>
<h3>📝 Grammar Point: The Verb "To Be"</h3>
<div class="lesson-grammar"><table><tr><th>Subject</th><th>Verb</th><th>Example</th></tr>
<tr><td>I</td><td><b>am</b></td><td>I <b>am</b> Tom.</td></tr>
<tr><td>You / We / They</td><td><b>are</b></td><td>You <b>are</b> a student.</td></tr>
<tr><td>He / She / It</td><td><b>is</b></td><td>She <b>is</b> a teacher.</td></tr></table></div>
<div class="lesson-tip">💡 <b>Cultural Tip:</b> In English, "How are you?" is often just a greeting. A simple "Fine, thanks!" is perfectly fine.</div>
<div class="lesson-exercise"><p><b>🎯 Practice:</b> Write a short introduction — your name, where you are from, what you do, and why you are learning English.</p></div>`},
  2:{title:"Numbers, Time & Dates",objective:"Count, tell the time, and say dates correctly in English.",
   youtube:"https://www.youtube.com/embed/QLGbWFm_-cw",
   swahili_note:"Somo hili linakufundisha nambari, wakati na tarehe kwa Kiingereza.",
   french_note:"Cette leçon vous apprend les chiffres, l'heure et les dates en anglais.",
   content:`<h3>📖 Numbers 1–20</h3>
<div class="lesson-table"><table><tr><th>Number</th><th>Word</th><th>Number</th><th>Word</th></tr>
<tr><td>1</td><td>one</td><td>11</td><td>eleven</td></tr>
<tr><td>2</td><td>two</td><td>12</td><td>twelve</td></tr>
<tr><td>3</td><td>three</td><td>13</td><td>thirteen</td></tr>
<tr><td>4</td><td>four</td><td>20</td><td>twenty</td></tr>
<tr><td>5</td><td>five</td><td>30</td><td>thirty</td></tr>
<tr><td>10</td><td>ten</td><td>100</td><td>one hundred</td></tr></table></div>
<h3>🕐 Telling the Time</h3>
<div class="lesson-table"><table><tr><th>Clock</th><th>English</th><th>Kiswahili</th></tr>
<tr><td>3:00</td><td>It is three o'clock.</td><td>Ni saa tisa.</td></tr>
<tr><td>3:15</td><td>It is quarter past three.</td><td>Ni saa tisa na robo.</td></tr>
<tr><td>3:30</td><td>It is half past three.</td><td>Ni saa tisa na nusu.</td></tr>
<tr><td>3:45</td><td>It is quarter to four.</td><td>Ni robo ya saa kumi.</td></tr></table></div>
<h3>📅 Days of the Week</h3>
<div class="lesson-table"><table><tr><th>Day</th><th>Kiswahili</th></tr>
<tr><td>Monday</td><td>Jumatatu</td></tr><tr><td>Tuesday</td><td>Jumanne</td></tr>
<tr><td>Wednesday</td><td>Jumatano</td></tr><tr><td>Thursday</td><td>Alhamisi</td></tr>
<tr><td>Friday</td><td>Ijumaa</td></tr><tr><td>Saturday</td><td>Jumamosi</td></tr>
<tr><td>Sunday</td><td>Jumapili</td></tr></table></div>
<div class="lesson-tip">💡 <b>Remember:</b> Ordinal numbers for dates: 1st (first), 2nd (second), 3rd (third), 4th (fourth)... "Today is the 5th of May, 2026."</div>`},
  3:{title:"Family & Home Vocabulary",objective:"Name family members and describe your home in English.",
   youtube:"https://www.youtube.com/embed/1cD5IfPj6Pg",
   swahili_note:"Jifunza maneno ya familia na nyumba kwa Kiingereza.",
   french_note:"Apprenez le vocabulaire de la famille et de la maison en anglais.",
   content:`<h3>👨‍👩‍👧‍👦 Family Members</h3>
<div class="lesson-table"><table><tr><th>English</th><th>Kiswahili</th></tr>
<tr><td>Father / Dad</td><td>Baba</td></tr><tr><td>Mother / Mum</td><td>Mama</td></tr>
<tr><td>Brother</td><td>Kaka</td></tr><tr><td>Sister</td><td>Dada</td></tr>
<tr><td>Grandfather</td><td>Babu</td></tr><tr><td>Grandmother</td><td>Bibi / Nyanya</td></tr>
<tr><td>Son</td><td>Mwana (m)</td></tr><tr><td>Daughter</td><td>Binti</td></tr></table></div>
<h3>🏠 Rooms in a House</h3>
<div class="lesson-table"><table><tr><th>English</th><th>Kiswahili</th></tr>
<tr><td>Bedroom</td><td>Chumba cha kulala</td></tr><tr><td>Kitchen</td><td>Jikoni</td></tr>
<tr><td>Living room</td><td>Sebule</td></tr><tr><td>Bathroom</td><td>Bafuni</td></tr>
<tr><td>Garden</td><td>Bustani</td></tr></table></div>
<h3>📝 Grammar: Possessive Adjectives</h3>
<div class="lesson-grammar"><table><tr><th>Subject</th><th>Possessive</th><th>Example</th></tr>
<tr><td>I</td><td><b>my</b></td><td><b>My</b> mother is a teacher.</td></tr>
<tr><td>You</td><td><b>your</b></td><td><b>Your</b> brother is tall.</td></tr>
<tr><td>He</td><td><b>his</b></td><td><b>His</b> father is from Mombasa.</td></tr>
<tr><td>She</td><td><b>her</b></td><td><b>Her</b> sister is a nurse.</td></tr>
<tr><td>We</td><td><b>our</b></td><td><b>Our</b> house has three rooms.</td></tr>
<tr><td>They</td><td><b>their</b></td><td><b>Their</b> family is big.</td></tr></table></div>`},
 },
 2:{
  1:{title:"Past Simple Tense",objective:"Talk about completed actions in the past.",
   youtube:"https://www.youtube.com/embed/ACz5Kl2H8TE",
   swahili_note:"Jifunza kuzungumza kuhusu mambo yaliyopita.",
   french_note:"Apprenez à parler des actions passées en anglais.",
   content:`<h3>📖 Regular Verbs: Add -ED</h3>
<div class="lesson-table"><table><tr><th>Base</th><th>Past</th><th>Example</th></tr>
<tr><td>walk</td><td>walked</td><td>I <b>walked</b> to school.</td></tr>
<tr><td>study</td><td>studied</td><td>She <b>studied</b> last night.</td></tr>
<tr><td>work</td><td>worked</td><td>He <b>worked</b> at the bank.</td></tr></table></div>
<h3>⚡ Irregular Verbs</h3>
<div class="lesson-table"><table><tr><th>Base</th><th>Past Simple</th><th>Kiswahili</th></tr>
<tr><td>go</td><td><b>went</b></td><td>kwenda</td></tr>
<tr><td>eat</td><td><b>ate</b></td><td>kula</td></tr>
<tr><td>buy</td><td><b>bought</b></td><td>kununua</td></tr>
<tr><td>see</td><td><b>saw</b></td><td>kuona</td></tr>
<tr><td>have</td><td><b>had</b></td><td>kuwa na</td></tr></table></div>
<h3>❌ Negative: Didn't + Base Verb</h3>
<div class="lesson-grammar"><p>She <b>didn't go</b> to Mombasa. &nbsp;|&nbsp; I <b>didn't eat</b> ugali.</p></div>
<h3>❓ Question: Did + Subject + Base Verb?</h3>
<div class="lesson-dialogue"><div class="dialogue-line coach">Did you go to the market?</div><div class="dialogue-line student">Yes, I did. / No, I didn't.</div></div>
<div class="lesson-tip">⏰ <b>Time Expressions:</b> yesterday · last week · last year · in 2020 · ago</div>`},
 },
},

// ══════════════════════════════════════════════════
// SWAHILI
// ══════════════════════════════════════════════════
swahili:{
 1:{
  1:{title:"Salamu na Utambulisho / Greetings & Introductions",
   objective:"Jifunza jinsi ya kusalimu na kujitambulisha kwa Kiswahili.",
   youtube:"https://www.youtube.com/embed/MFhMkLHxNaE",
   swahili_note:"Hii ndiyo mada yetu ya kwanza ya Kiswahili.",
   french_note:"C'est notre première leçon de swahili.",
   content:`<h3>📖 Salamu za Msingi</h3>
<div class="lesson-table"><table><tr><th>Kiswahili</th><th>English</th><th>Français</th></tr>
<tr><td><b>Hujambo?</b></td><td>How are you?</td><td>Comment allez-vous?</td></tr>
<tr><td><b>Sijambo.</b></td><td>I am fine.</td><td>Je vais bien.</td></tr>
<tr><td><b>Habari?</b></td><td>What's the news?</td><td>Quelles nouvelles?</td></tr>
<tr><td><b>Nzuri / Salama.</b></td><td>Good / Fine.</td><td>Bien.</td></tr>
<tr><td><b>Shikamoo.</b></td><td>Respectful greeting (elders)</td><td>Salutation respectueuse</td></tr>
<tr><td><b>Marahaba.</b></td><td>Reply to Shikamoo</td><td>Réponse à Shikamoo</td></tr>
<tr><td><b>Karibu!</b></td><td>Welcome!</td><td>Bienvenue!</td></tr>
<tr><td><b>Asante.</b></td><td>Thank you.</td><td>Merci.</td></tr></table></div>
<h3>🗣️ Mazungumzo / Conversation</h3>
<div class="lesson-dialogue">
<div class="dialogue-line coach">Hujambo! Jina lako nani?</div>
<div class="dialogue-line student">Sijambo! Jina langu ni Tom.</div>
<div class="dialogue-line coach">Unatoka wapi?</div>
<div class="dialogue-line student">Ninatoka Nairobi. Na wewe?</div>
<div class="dialogue-line coach">Ninatoka Mombasa. Karibu!</div></div>
<div class="lesson-tip">💡 "Shikamoo" inaonyesha heshima kwa wazee. Itumie daima unapowasalimu watu wakubwa.</div>`},
  2:{title:"Nambari na Rangi / Numbers and Colours",
   objective:"Jifunza kuhesabu na kutaja rangi kwa Kiswahili.",
   youtube:"https://www.youtube.com/embed/d-5zfayIXgg",
   swahili_note:"Tutajifunza nambari kutoka 1 hadi 20 na rangi za msingi.",
   french_note:"Nous allons apprendre les chiffres et les couleurs en swahili.",
   content:`<h3>🔢 Nambari / Numbers</h3>
<div class="lesson-table"><table><tr><th>Nambari</th><th>Kiswahili</th><th>English</th></tr>
<tr><td>1</td><td>moja</td><td>one</td></tr><tr><td>2</td><td>mbili</td><td>two</td></tr>
<tr><td>3</td><td>tatu</td><td>three</td></tr><tr><td>4</td><td>nne</td><td>four</td></tr>
<tr><td>5</td><td>tano</td><td>five</td></tr><tr><td>6</td><td>sita</td><td>six</td></tr>
<tr><td>7</td><td>saba</td><td>seven</td></tr><tr><td>8</td><td>nane</td><td>eight</td></tr>
<tr><td>9</td><td>tisa</td><td>nine</td></tr><tr><td>10</td><td>kumi</td><td>ten</td></tr>
<tr><td>20</td><td>ishirini</td><td>twenty</td></tr><tr><td>100</td><td>mia moja</td><td>one hundred</td></tr></table></div>
<h3>🌈 Rangi / Colours</h3>
<div class="lesson-table"><table><tr><th>Kiswahili</th><th>English</th></tr>
<tr><td>nyekundu</td><td>red</td></tr><tr><td>buluu / samawati</td><td>blue</td></tr>
<tr><td>kijani</td><td>green</td></tr><tr><td>njano</td><td>yellow</td></tr>
<tr><td>nyeupe</td><td>white</td></tr><tr><td>nyeusi</td><td>black</td></tr></table></div>`},
 },
},

// ══════════════════════════════════════════════════
// FRENCH
// ══════════════════════════════════════════════════
french:{
 1:{
  1:{title:"Salutations et Présentations",objective:"Apprendre à saluer et à se présenter en français.",
   youtube:"https://www.youtube.com/embed/ukFAaDa5A0Y",
   swahili_note:"Somo hili la Kifaransa linakufundisha jinsi ya kusalimu na kujitambulisha.",
   french_note:"Dans cette leçon, vous apprendrez les salutations de base en français.",
   content:`<h3>📖 Salutations de Base</h3>
<div class="lesson-table"><table><tr><th>Français</th><th>English</th><th>Kiswahili</th></tr>
<tr><td><b>Bonjour!</b></td><td>Good morning / Hello!</td><td>Habari ya asubuhi!</td></tr>
<tr><td><b>Bonsoir!</b></td><td>Good evening!</td><td>Habari ya jioni!</td></tr>
<tr><td><b>Salut!</b></td><td>Hi! (informal)</td><td>Habari! (kawaida)</td></tr>
<tr><td><b>Comment allez-vous?</b></td><td>How are you? (formal)</td><td>Habari yako? (rasmi)</td></tr>
<tr><td><b>Je vais bien, merci.</b></td><td>I am fine, thank you.</td><td>Niko sawa, asante.</td></tr>
<tr><td><b>Au revoir!</b></td><td>Goodbye!</td><td>Kwaheri!</td></tr>
<tr><td><b>Merci beaucoup.</b></td><td>Thank you very much.</td><td>Asante sana.</td></tr></table></div>
<h3>🗣️ Dialogue</h3>
<div class="lesson-dialogue">
<div class="dialogue-line coach">Bonjour! Je m'appelle Marie. Et vous?</div>
<div class="dialogue-line student">Bonjour! Je m'appelle Tom. Enchanté!</div>
<div class="dialogue-line coach">D'où venez-vous?</div>
<div class="dialogue-line student">Je viens du Kenya. Et vous?</div></div>
<h3>📝 Grammaire: Le Verbe ÊTRE</h3>
<div class="lesson-grammar"><table><tr><th>Sujet</th><th>Être</th><th>Exemple</th></tr>
<tr><td>Je</td><td><b>suis</b></td><td>Je <b>suis</b> étudiant(e).</td></tr>
<tr><td>Tu</td><td><b>es</b></td><td>Tu <b>es</b> professeur.</td></tr>
<tr><td>Il/Elle</td><td><b>est</b></td><td>Elle <b>est</b> médecin.</td></tr>
<tr><td>Nous</td><td><b>sommes</b></td><td>Nous <b>sommes</b> amis.</td></tr>
<tr><td>Vous</td><td><b>êtes</b></td><td>Vous <b>êtes</b> kenyan?</td></tr></table></div>`},
 },
},

// ══════════════════════════════════════════════════
// ARABIC
// ══════════════════════════════════════════════════
arabic:{
 1:{
  1:{title:"The Arabic Alphabet — الأبجدية العربية",
   objective:"Learn the Arabic script and pronounce the 28 letters correctly.",
   youtube:"https://www.youtube.com/embed/MNpWDGFT8EM",
   swahili_note:"Somo hili linakufundisha alfabeti ya Kiarabu — hatua ya kwanza.",
   french_note:"Cette leçon vous apprend l'alphabet arabe.",
   content:`<h3>📖 Introduction to Arabic</h3>
<p>Arabic is written <b>from right to left</b>. It is spoken by over <b>400 million people</b> across the Middle East and Africa, and is the language of the Quran.</p>
<h3>✍️ Key Arabic Letters & Phrases</h3>
<div class="lesson-table"><table><tr><th>Letter</th><th>Name</th><th>Sound</th></tr>
<tr><td style="font-size:1.5rem;direction:rtl;">أ</td><td>Alif</td><td>a / aa</td></tr>
<tr><td style="font-size:1.5rem;direction:rtl;">ب</td><td>Ba</td><td>b</td></tr>
<tr><td style="font-size:1.5rem;direction:rtl;">م</td><td>Mim</td><td>m</td></tr>
<tr><td style="font-size:1.5rem;direction:rtl;">س</td><td>Sin</td><td>s</td></tr>
<tr><td style="font-size:1.5rem;direction:rtl;">ن</td><td>Nun</td><td>n</td></tr></table></div>
<h3>🗣️ Essential Phrases</h3>
<div class="lesson-table"><table><tr><th>Arabic</th><th>Transliteration</th><th>English</th><th>Kiswahili</th></tr>
<tr><td style="direction:rtl;">السَّلامُ عَلَيْكُمْ</td><td>As-salamu alaykum</td><td>Peace be upon you</td><td>Amani iwe nanyi</td></tr>
<tr><td style="direction:rtl;">مَرحَبًا</td><td>Marhaban</td><td>Hello / Welcome</td><td>Karibu</td></tr>
<tr><td style="direction:rtl;">شُكرًا</td><td>Shukran</td><td>Thank you</td><td>Asante</td></tr>
<tr><td style="direction:rtl;">اسمِي...</td><td>Ismi...</td><td>My name is...</td><td>Jina langu ni...</td></tr></table></div>
<div class="lesson-tip">💡 Arabic letters change shape depending on their position in a word. This takes practice — be patient!</div>`},
 },
},

// ══════════════════════════════════════════════════
// GERMAN
// ══════════════════════════════════════════════════
german:{
 1:{
  1:{title:"Begrüßungen und Vorstellungen",objective:"Learn to greet and introduce yourself in German.",
   youtube:"https://www.youtube.com/embed/GUaOEWWJMDs",
   swahili_note:"Somo hili linakufundisha jinsi ya kusalimu kwa Kijerumani.",
   french_note:"Cette leçon vous apprend à saluer en allemand.",
   content:`<h3>📖 Greetings in German</h3>
<div class="lesson-table"><table><tr><th>Deutsch</th><th>English</th><th>When to Use</th></tr>
<tr><td><b>Guten Morgen!</b></td><td>Good morning!</td><td>Before 12 noon</td></tr>
<tr><td><b>Guten Tag!</b></td><td>Good day / Hello!</td><td>During the day</td></tr>
<tr><td><b>Guten Abend!</b></td><td>Good evening!</td><td>After 6 PM</td></tr>
<tr><td><b>Hallo!</b></td><td>Hello!</td><td>Informal, anytime</td></tr>
<tr><td><b>Tschüss!</b></td><td>Bye!</td><td>Informal farewell</td></tr>
<tr><td><b>Auf Wiedersehen!</b></td><td>Goodbye!</td><td>Formal farewell</td></tr></table></div>
<h3>🗣️ Introduction Dialogue</h3>
<div class="lesson-dialogue">
<div class="dialogue-line coach">Hallo! Wie heißen Sie?</div>
<div class="dialogue-line student">Ich heiße Tom. Und Sie?</div>
<div class="dialogue-line coach">Ich heiße Anna. Woher kommen Sie?</div>
<div class="dialogue-line student">Ich komme aus Kenia.</div></div>
<h3>📝 Key Phrases</h3>
<div class="lesson-table"><table><tr><th>Deutsch</th><th>English</th><th>Kiswahili</th></tr>
<tr><td>Ich heiße...</td><td>My name is...</td><td>Jina langu ni...</td></tr>
<tr><td>Ich komme aus...</td><td>I come from...</td><td>Ninatoka...</td></tr>
<tr><td>Danke, gut!</td><td>Fine, thanks!</td><td>Nzuri, asante!</td></tr>
<tr><td>Bitte.</td><td>Please / You're welcome.</td><td>Tafadhali / Karibu.</td></tr></table></div>`},
 },
},

// ══════════════════════════════════════════════════
// SPANISH
// ══════════════════════════════════════════════════
spanish:{
 1:{
  1:{title:"Saludos y Presentaciones",objective:"Learn to greet and introduce yourself in Spanish.",
   youtube:"https://www.youtube.com/embed/jmYO2SoGOKY",
   swahili_note:"Somo hili linakufundisha jinsi ya kusalimu kwa Kihispania.",
   french_note:"Cette leçon vous apprend à saluer en espagnol.",
   content:`<h3>📖 Greetings in Spanish</h3>
<div class="lesson-table"><table><tr><th>Español</th><th>English</th><th>Kiswahili</th></tr>
<tr><td><b>¡Buenos días!</b></td><td>Good morning!</td><td>Habari ya asubuhi!</td></tr>
<tr><td><b>¡Buenas tardes!</b></td><td>Good afternoon!</td><td>Habari ya mchana!</td></tr>
<tr><td><b>¡Hola!</b></td><td>Hello!</td><td>Habari!</td></tr>
<tr><td><b>¿Cómo estás?</b></td><td>How are you?</td><td>Habari yako?</td></tr>
<tr><td><b>Muy bien, gracias.</b></td><td>Very well, thank you.</td><td>Nzuri sana, asante.</td></tr>
<tr><td><b>¡Adiós!</b></td><td>Goodbye!</td><td>Kwaheri!</td></tr></table></div>
<h3>🗣️ Conversation</h3>
<div class="lesson-dialogue">
<div class="dialogue-line coach">¡Hola! ¿Cómo te llamas?</div>
<div class="dialogue-line student">Me llamo Tom. ¿Y tú?</div>
<div class="dialogue-line coach">Me llamo María. ¿De dónde eres?</div>
<div class="dialogue-line student">Soy de Kenia. ¡Mucho gusto!</div>
<div class="dialogue-line coach">¡Igualmente!</div></div>
<h3>📝 Grammar: Verb SER (To Be)</h3>
<div class="lesson-grammar"><table><tr><th>Pronoun</th><th>SER</th><th>Example</th></tr>
<tr><td>Yo (I)</td><td><b>soy</b></td><td>Yo <b>soy</b> estudiante.</td></tr>
<tr><td>Tú (you)</td><td><b>eres</b></td><td>Tú <b>eres</b> profesor.</td></tr>
<tr><td>Él/Ella</td><td><b>es</b></td><td>Ella <b>es</b> médica.</td></tr>
<tr><td>Nosotros</td><td><b>somos</b></td><td>Nosotros <b>somos</b> amigos.</td></tr></table></div>`},
 },
},

// ══════════════════════════════════════════════════
// PORTUGUESE
// ══════════════════════════════════════════════════
portuguese:{
 1:{
  1:{title:"Saudações e Apresentações",objective:"Learn to greet and introduce yourself in Portuguese.",
   youtube:"https://www.youtube.com/embed/ydSjGjLKWFY",
   swahili_note:"Somo hili linakufundisha jinsi ya kusalimu kwa Kireno.",
   french_note:"Cette leçon vous apprend à saluer en portugais.",
   content:`<h3>📖 Greetings in Portuguese</h3>
<div class="lesson-table"><table><tr><th>Português</th><th>English</th><th>Kiswahili</th></tr>
<tr><td><b>Bom dia!</b></td><td>Good morning!</td><td>Habari ya asubuhi!</td></tr>
<tr><td><b>Boa tarde!</b></td><td>Good afternoon!</td><td>Habari ya mchana!</td></tr>
<tr><td><b>Olá!</b></td><td>Hello!</td><td>Hujambo!</td></tr>
<tr><td><b>Como vai você?</b></td><td>How are you?</td><td>Habari yako?</td></tr>
<tr><td><b>Muito bem, obrigado/a.</b></td><td>Very well, thank you.</td><td>Nzuri sana, asante.</td></tr>
<tr><td><b>Tchau!</b></td><td>Bye!</td><td>Kwaheri!</td></tr></table></div>
<h3>🗣️ Conversation</h3>
<div class="lesson-dialogue">
<div class="dialogue-line coach">Olá! Como você se chama?</div>
<div class="dialogue-line student">Me chamo Tom. E você?</div>
<div class="dialogue-line coach">Me chamo Ana. De onde você é?</div>
<div class="dialogue-line student">Sou do Quênia. Prazer em conhecê-la!</div></div>
<div class="lesson-tip">💡 "Oi" is common in Brazil; "Olá" is used in Portugal. We teach Brazilian Portuguese at Study Language Academy.</div>`},
 },
},

// ══════════════════════════════════════════════════
// KOINE GREEK
// ══════════════════════════════════════════════════
greek:{
 1:{
  1:{title:"The Greek Alphabet — Ἡ Ἑλληνικὴ Ἀλφάβητος",
   objective:"Learn the 24 letters of the Koine Greek alphabet and their sounds.",
   youtube:"https://www.youtube.com/embed/h60HFZ4iLV0",
   swahili_note:"Koine Greek ni lugha ya Agano Jipya ya Biblia na maandishi ya falsafa ya kale.",
   french_note:"Le grec koiné est la langue du Nouveau Testament et des écrits philosophiques anciens.",
   content:`<h3>📖 What is Koine Greek?</h3>
<p><b>Koine Greek</b> (Κοινὴ Ἑλληνική) was spoken from approximately <b>300 BC to 300 AD</b>. It is the language of the <b>New Testament</b>, the Septuagint (Greek Old Testament), and major works of philosophy and history.</p>
<h3>✍️ The Greek Alphabet</h3>
<div class="lesson-table"><table><tr><th>Capital</th><th>Small</th><th>Name</th><th>Sound</th><th>Example</th></tr>
<tr><td>Α</td><td>α</td><td>Alpha</td><td>a (father)</td><td>ἀγάπη (agapē - love)</td></tr>
<tr><td>Β</td><td>β</td><td>Beta</td><td>b</td><td>βίβλος (biblos - book)</td></tr>
<tr><td>Γ</td><td>γ</td><td>Gamma</td><td>g</td><td>γῆ (gē - earth)</td></tr>
<tr><td>Δ</td><td>δ</td><td>Delta</td><td>d</td><td>δόξα (doxa - glory)</td></tr>
<tr><td>Ε</td><td>ε</td><td>Epsilon</td><td>e (short)</td><td>ἐκκλησία (ekklēsia - church)</td></tr>
<tr><td>Ζ</td><td>ζ</td><td>Zeta</td><td>z</td><td>ζωή (zōē - life)</td></tr>
<tr><td>Η</td><td>η</td><td>Eta</td><td>ē (long)</td><td>ἡμέρα (hēmera - day)</td></tr>
<tr><td>Θ</td><td>θ</td><td>Theta</td><td>th (think)</td><td>θεός (theos - God)</td></tr>
<tr><td>Ι</td><td>ι</td><td>Iota</td><td>i</td><td>Ἰησοῦς (Iēsous - Jesus)</td></tr>
<tr><td>Κ</td><td>κ</td><td>Kappa</td><td>k</td><td>κόσμος (kosmos - world)</td></tr>
<tr><td>Λ</td><td>λ</td><td>Lambda</td><td>l</td><td>λόγος (logos - word)</td></tr>
<tr><td>Μ</td><td>μ</td><td>Mu</td><td>m</td><td>μαθητής (mathētēs - disciple)</td></tr>
<tr><td>Ν</td><td>ν</td><td>Nu</td><td>n</td><td>νόμος (nomos - law)</td></tr>
<tr><td>Ξ</td><td>ξ</td><td>Xi</td><td>x (ks)</td><td>ξένος (xenos - stranger)</td></tr>
<tr><td>Ο</td><td>ο</td><td>Omicron</td><td>o (short)</td><td>ὁδός (hodos - way)</td></tr>
<tr><td>Π</td><td>π</td><td>Pi</td><td>p</td><td>πίστις (pistis - faith)</td></tr>
<tr><td>Ρ</td><td>ρ</td><td>Rho</td><td>r</td><td>ῥήμα (rhēma - word)</td></tr>
<tr><td>Σ</td><td>σ/ς</td><td>Sigma</td><td>s</td><td>σοφία (sophia - wisdom)</td></tr>
<tr><td>Τ</td><td>τ</td><td>Tau</td><td>t</td><td>τέκνον (teknon - child)</td></tr>
<tr><td>Υ</td><td>υ</td><td>Upsilon</td><td>u/y</td><td>υἱός (huios - son)</td></tr>
<tr><td>Φ</td><td>φ</td><td>Phi</td><td>ph (f)</td><td>φῶς (phōs - light)</td></tr>
<tr><td>Χ</td><td>χ</td><td>Chi</td><td>ch (Bach)</td><td>χάρις (charis - grace)</td></tr>
<tr><td>Ψ</td><td>ψ</td><td>Psi</td><td>ps</td><td>ψυχή (psychē - soul)</td></tr>
<tr><td>Ω</td><td>ω</td><td>Omega</td><td>ō (long)</td><td>ὥρα (hōra - hour)</td></tr></table></div>
<h3>📖 John 3:16 in Koine Greek</h3>
<div class="lesson-example" style="font-size:1.1rem;line-height:2.2;">Οὕτως γὰρ ἠγάπησεν ὁ θεὸς τὸν κόσμον, ὥστε τὸν υἱὸν τὸν μονογενῆ ἔδωκεν...</div>
<div class="lesson-example" style="font-size:.85rem;color:#666;"><em>"For God so loved the world that He gave His only begotten Son..." (John 3:16)</em></div>
<h3>🏛️ Greek Words You Already Know</h3>
<div class="lesson-table"><table><tr><th>Greek Word</th><th>Meaning</th><th>English Derivative</th></tr>
<tr><td>λόγος (logos)</td><td>word, reason</td><td>logic, biology, theology</td></tr>
<tr><td>θεός (theos)</td><td>God</td><td>theology, atheist</td></tr>
<tr><td>ἀγάπη (agapē)</td><td>unconditional love</td><td>agape</td></tr>
<tr><td>εὐαγγέλιον (euangelion)</td><td>good news</td><td>evangelical, evangelism</td></tr>
<tr><td>ἐκκλησία (ekklēsia)</td><td>assembly / church</td><td>ecclesiastical</td></tr></table></div>
<div class="lesson-tip">💡 <b>Study Tip:</b> Write each letter 10 times daily. Master the alphabet before moving to vocabulary. Use index cards!</div>`},
  2:{title:"Vowels, Diphthongs & Breathing Marks",
   objective:"Master Greek vowel sounds and the breathing mark system.",
   youtube:"https://www.youtube.com/embed/H1K4AiQJP_0",
   swahili_note:"Somo hili linafundisha sauti za vokali za Kigiriki.",
   french_note:"Cette leçon enseigne les voyelles grecques.",
   content:`<h3>📖 Greek Vowels</h3>
<div class="lesson-table"><table><tr><th>Letter</th><th>Name</th><th>Length</th><th>Sound</th></tr>
<tr><td>α</td><td>Alpha</td><td>Short or Long</td><td>Short: "cat"; Long: "father"</td></tr>
<tr><td>ε</td><td>Epsilon</td><td>Always Short</td><td>"e" in "pet"</td></tr>
<tr><td>η</td><td>Eta</td><td>Always Long</td><td>"e" in "they"</td></tr>
<tr><td>ι</td><td>Iota</td><td>Short or Long</td><td>"i" in "it" or "meet"</td></tr>
<tr><td>ο</td><td>Omicron</td><td>Always Short</td><td>"o" in "hot"</td></tr>
<tr><td>ω</td><td>Omega</td><td>Always Long</td><td>"o" in "go"</td></tr></table></div>
<h3>🔤 Common Diphthongs</h3>
<div class="lesson-table"><table><tr><th>Diphthong</th><th>Sound</th><th>Example</th></tr>
<tr><td>αι</td><td>"eye"</td><td>καί (kai - and)</td></tr>
<tr><td>ει</td><td>"ay"</td><td>εἰμί (eimi - I am)</td></tr>
<tr><td>ου</td><td>"oo"</td><td>οὐρανός (ouranos - heaven)</td></tr>
<tr><td>αυ</td><td>"ow"</td><td>αὐτός (autos - he)</td></tr></table></div>
<h3>💨 Breathing Marks</h3>
<div class="lesson-grammar">
<p><b>Smooth breathing (᾿):</b> No extra sound. Example: ἀπόστολος (apostolos)</p>
<p><b>Rough breathing (῾):</b> Add "h" sound. Example: ἡμέρα → sounds like "hāymera"</p></div>`},
 },
},

// ══════════════════════════════════════════════════
// BIBLICAL HEBREW
// ══════════════════════════════════════════════════
hebrew:{
 1:{
  1:{title:"The Hebrew Alphabet — האלף בית",
   objective:"Learn the 22 letters of the Hebrew alphabet and their sounds.",
   youtube:"https://www.youtube.com/embed/fNnRNraCwRM",
   swahili_note:"Kiebrania ni lugha ya Agano la Kale la Biblia — moja ya lugha za kale kabisa duniani.",
   french_note:"L'hébreu biblique est la langue de l'Ancien Testament.",
   content:`<h3>📖 Introduction to Biblical Hebrew</h3>
<p><b>Biblical Hebrew</b> (עִבְרִית בִּיבְלִית) is the language of the Old Testament / Tanakh. Written <b>from right to left</b>, it has <b>22 consonant letters</b>.</p>
<h3>✍️ The Hebrew Alphabet (אָלֶף-בֵּית)</h3>
<div class="lesson-table"><table><tr><th>Letter</th><th>Name</th><th>Sound</th><th>Example Word</th></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">א</td><td>Aleph</td><td>Silent</td><td>אֱלֹהִים (Elohim - God)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">ב</td><td>Bet</td><td>b / v</td><td>בְּרֵאשִׁית (Bereshit - In the beginning)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">ג</td><td>Gimel</td><td>g</td><td>גָּדוֹל (gadol - great)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">ד</td><td>Dalet</td><td>d</td><td>דָּבָר (davar - word)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">ה</td><td>He</td><td>h</td><td>הָאָרֶץ (ha-aretz - the earth)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">ו</td><td>Vav</td><td>v / w</td><td>וְ (ve - and)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">ז</td><td>Zayin</td><td>z</td><td>זָהָב (zahav - gold)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">ח</td><td>Chet</td><td>ch (Bach)</td><td>חַיִּים (chayyim - life)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">ט</td><td>Tet</td><td>t</td><td>טוֹב (tov - good)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">י</td><td>Yod</td><td>y</td><td>יהוה (YHWH - Lord)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">כ/ך</td><td>Kaf</td><td>k / ch</td><td>כָּבוֹד (kavod - glory)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">ל</td><td>Lamed</td><td>l</td><td>לֵב (lev - heart)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">מ/ם</td><td>Mem</td><td>m</td><td>מֶלֶךְ (melech - king)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">נ/ן</td><td>Nun</td><td>n</td><td>נְבִיא (navi - prophet)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">ס</td><td>Samech</td><td>s</td><td>סֵפֶר (sefer - book)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">ע</td><td>Ayin</td><td>Silent</td><td>עַם (am - people)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">פ/ף</td><td>Pe</td><td>p / f</td><td>פָּנִים (panim - face)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">צ/ץ</td><td>Tsade</td><td>ts</td><td>צֶדֶק (tsedek - justice)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">ק</td><td>Qof</td><td>q</td><td>קָדוֹשׁ (kadosh - holy)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">ר</td><td>Resh</td><td>r</td><td>רוּחַ (ruach - spirit/wind)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">שׂ/שׁ</td><td>Shin/Sin</td><td>sh / s</td><td>שָׁלוֹם (shalom - peace)</td></tr>
<tr><td style="font-size:1.8rem;direction:rtl;">ת</td><td>Tav</td><td>t</td><td>תּוֹרָה (Torah - law/instruction)</td></tr></table></div>
<h3>📖 Genesis 1:1 — The First Hebrew Sentence</h3>
<div class="lesson-example" style="text-align:right;font-size:1.5rem;direction:rtl;line-height:2.5;">בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ</div>
<div class="lesson-example" style="font-size:.85rem;color:#555;"><em>Bereshit bara Elohim et hashamayim ve'et ha'aretz.</em><br>"In the beginning, God created the heavens and the earth." (Genesis 1:1)</div>
<h3>🔤 Key Biblical Hebrew Words</h3>
<div class="lesson-table"><table><tr><th>Hebrew</th><th>Transliteration</th><th>English</th><th>Kiswahili</th></tr>
<tr><td style="direction:rtl;">שָׁלוֹם</td><td>Shalom</td><td>Peace / Hello / Goodbye</td><td>Amani</td></tr>
<tr><td style="direction:rtl;">אָמֵן</td><td>Amen</td><td>Truly / So be it</td><td>Kweli / Iwe hivyo</td></tr>
<tr><td style="direction:rtl;">הַלְלוּיָהּ</td><td>Hallelujah</td><td>Praise the Lord</td><td>Sifuni Bwana</td></tr>
<tr><td style="direction:rtl;">אַהֲבָה</td><td>Ahavah</td><td>Love</td><td>Upendo</td></tr>
<tr><td style="direction:rtl;">תּוֹדָה</td><td>Todah</td><td>Thank you</td><td>Asante</td></tr></table></div>
<div class="lesson-tip">💡 <b>Five letters have special final forms</b> when at the end of a word: כ→ך, מ→ם, נ→ן, פ→ף, צ→ץ</div>`},
  2:{title:"Hebrew Vowels (Niqqud)",
   objective:"Learn the Hebrew vowel pointing system and read simple words.",
   youtube:"https://www.youtube.com/embed/5LWi5mRbwwQ",
   swahili_note:"Somo hili linafundisha alama za vokali za Kiebrania — Niqqud.",
   french_note:"Cette leçon enseigne le système de vocalisation hébraïque — Niqqud.",
   content:`<h3>📖 What is Niqqud?</h3>
<p>Ancient Hebrew was written with consonants only. The <b>Masoretes</b> (600–900 AD) added dots and dashes to show vowel sounds — called <b>Niqqud (נִקּוּד)</b>.</p>
<h3>📍 Main Vowel Signs</h3>
<div class="lesson-table"><table><tr><th>Sign</th><th>Name</th><th>Sound</th></tr>
<tr><td style="font-size:1.5rem;">בָ</td><td>Qamats</td><td>Long "a" (father)</td></tr>
<tr><td style="font-size:1.5rem;">בַ</td><td>Patah</td><td>Short "a" (cat)</td></tr>
<tr><td style="font-size:1.5rem;">בֵ</td><td>Tsere</td><td>Long "e" (they)</td></tr>
<tr><td style="font-size:1.5rem;">בֶ</td><td>Segol</td><td>Short "e" (pet)</td></tr>
<tr><td style="font-size:1.5rem;">בִ</td><td>Hiriq</td><td>"i" (machine)</td></tr>
<tr><td style="font-size:1.5rem;">בֹ</td><td>Holam</td><td>Long "o" (go)</td></tr>
<tr><td style="font-size:1.5rem;">בוּ</td><td>Shuruq</td><td>Long "u" (moon)</td></tr>
<tr><td style="font-size:1.5rem;">בְ</td><td>Sheva</td><td>Very short "e" or silent</td></tr></table></div>
<h3>🗣️ Reading Practice</h3>
<div class="lesson-table"><table><tr><th>Hebrew</th><th>Transliteration</th><th>Meaning</th></tr>
<tr><td style="font-size:1.3rem;direction:rtl;">אַב</td><td>av</td><td>father</td></tr>
<tr><td style="font-size:1.3rem;direction:rtl;">אֵם</td><td>em</td><td>mother</td></tr>
<tr><td style="font-size:1.3rem;direction:rtl;">בֵּן</td><td>ben</td><td>son</td></tr>
<tr><td style="font-size:1.3rem;direction:rtl;">בַּת</td><td>bat</td><td>daughter</td></tr>
<tr><td style="font-size:1.3rem;direction:rtl;">טוֹב</td><td>tov</td><td>good</td></tr>
<tr><td style="font-size:1.3rem;direction:rtl;">שָׁלוֹם</td><td>shalom</td><td>peace</td></tr></table></div>`},
 },
},

};// end LESSON_CONTENT

// ── EXAM QUESTIONS (English — preserved from v3) ──────────────
const EXAM_QUESTIONS = {
 1:[
  {q:"'Habari yako?' in English?",opts:["How old are you?","How are you?","Where are you from?","What is your name?"],ans:1,unit:1,type:"mc"},
  {q:"Correct 'to be': 'She _____ a student.'",opts:["am","are","is","be"],ans:2,unit:1,type:"mc"},
  {q:"'My name _____ Tom.'",opts:["am","is","are","be"],ans:1,unit:1,type:"mc"},
  {q:"3:30 in words?",opts:["Three thirty","Half past three","Quarter past three","Quarter to four"],ans:1,unit:2,type:"mc"},
  {q:"'Tuesday' in Kiswahili?",opts:["Jumatatu","Jumanne","Jumatano","Alhamisi"],ans:1,unit:2,type:"mc"},
  {q:"'Brother' in Kiswahili?",opts:["Baba","Kaka","Mama","Dada"],ans:1,unit:3,type:"mc"},
  {q:"Correct present simple: 'She _____ English every evening.'",opts:["study","studys","studies","is study"],ans:2,unit:4,type:"mc"},
  {q:"'They _____ meat.' (negative)",opts:["doesn't eat","don't eat","not eat","isn't eat"],ans:1,unit:4,type:"mc"},
  {q:"Is 'rice' countable or uncountable?",opts:["Countable","Uncountable","Both","Neither"],ans:1,unit:5,type:"mc"},
  {q:"'There _____ a hospital near the bus stop.'",opts:["are","is","be","were"],ans:1,unit:6,type:"mc"},
 ],
 2:[
  {q:"Correct past simple: 'She _____ to Mombasa last year.'",opts:["go","goes","went","gone"],ans:2,unit:1,type:"mc"},
  {q:"Past simple of 'buy'?",opts:["buyed","buyied","bought","boughted"],ans:2,unit:1,type:"mc"},
  {q:"'I _____ never eaten Japanese food.'",opts:["have","has","had","did"],ans:0,unit:2,type:"mc"},
  {q:"'I have lived here _____ 2018.'",opts:["for","since","ago","at"],ans:1,unit:2,type:"mc"},
  {q:"Spontaneous decision: correct future form?",opts:["am going to","will","going","am"],ans:1,unit:3,type:"mc"},
  {q:"'Nairobi is _____ than Kisumu.' (large)",opts:["more large","larger","largest","most large"],ans:1,unit:4,type:"mc"},
  {q:"Passive: 'The manager approved the project.'",opts:["The project approved.","The project was approved by the manager.","The project were approved.","The project is approved."],ans:1,unit:6,type:"mc"},
  {q:"Connective showing RESULT?",opts:["Although","Furthermore","Therefore","Unless"],ans:2,unit:7,type:"mc"},
 ],
 3:[
  {q:"Type 2 conditional: 'If I _____ you, I would accept.'",opts:["am","was","were","would be"],ans:2,unit:1,type:"mc"},
  {q:"Type 3: 'If he had studied, he _____ passed.'",opts:["would","would have","will have","had"],ans:1,unit:1,type:"mc"},
  {q:"In PEEL, Evidence does what?",opts:["States main point","Provides facts/data","Links to thesis","Restates conclusion"],ans:1,unit:3,type:"mc"},
  {q:"Best hedging language example?",opts:["I think that...","It is clear that...","Research suggests that...","Obviously,..."],ans:2,unit:3,type:"mc"},
  {q:"IELTS Task 1 — you should?",opts:["Give opinion","Describe visual data objectively","Write 250-word argument","Summarise someone's essay"],ans:1,unit:8,type:"mc"},
 ],
};

// QUIZ_BANKS is the alias staff.html uses for EXAM_QUESTIONS
const QUIZ_BANKS = EXAM_QUESTIONS;

// ── WEEKLY CURRICULUM SCHEDULE (15 weeks = 4 months per level) ──
// Week 1-5: Units 1-5 (one unit per week)
// Week 6-10: Units 6-10 (review + deeper content)
// Week 11-14: Advanced practice + speaking
// Week 15: Revision + Final Exam Prep
const WEEK_SCHEDULE = {
  // level → array of 15 week descriptors
  1: [
    {week:1,  topic:"Greetings & Introductions",          unit:1, catMarks:20, type:"foundation"},
    {week:2,  topic:"Numbers, Time & Dates",              unit:2, catMarks:20, type:"foundation"},
    {week:3,  topic:"Family & Home Vocabulary",           unit:3, catMarks:20, type:"foundation"},
    {week:4,  topic:"Daily Routines & Present Simple",    unit:4, catMarks:20, type:"foundation"},
    {week:5,  topic:"Food, Shopping & Countables",        unit:5, catMarks:20, type:"foundation"},
    {week:6,  topic:"Health, Body & Directions",          unit:6, catMarks:22, type:"application"},
    {week:7,  topic:"Review: Grammar Structures 1–3",     unit:null, catMarks:22, type:"review"},
    {week:8,  topic:"Review: Vocabulary & Pronunciation", unit:null, catMarks:22, type:"review"},
    {week:9,  topic:"Speaking Practice: Dialogues",       unit:null, catMarks:25, type:"speaking"},
    {week:10, topic:"Writing Practice: Paragraphs",       unit:null, catMarks:25, type:"writing"},
    {week:11, topic:"Reading Comprehension",              unit:null, catMarks:25, type:"reading"},
    {week:12, topic:"Integrated Skills Test",             unit:null, catMarks:25, type:"integrated"},
    {week:13, topic:"Speaking Assessment",                unit:null, catMarks:30, type:"speaking_formal"},
    {week:14, topic:"Mock Exam + Corrections",            unit:null, catMarks:30, type:"mock"},
    {week:15, topic:"Final Exam Revision",                unit:null, catMarks:0,  type:"revision"},
  ],
  2: [
    {week:1,  topic:"Past Simple Tense",                     unit:1, catMarks:20, type:"foundation"},
    {week:2,  topic:"Present Perfect & Life Experiences",    unit:2, catMarks:20, type:"foundation"},
    {week:3,  topic:"Future Forms: will / going to",         unit:3, catMarks:20, type:"foundation"},
    {week:4,  topic:"Comparatives & Superlatives",           unit:4, catMarks:20, type:"foundation"},
    {week:5,  topic:"Expressing Opinions & Modal Verbs",     unit:5, catMarks:22, type:"foundation"},
    {week:6,  topic:"Passive Voice & Formal Writing",        unit:6, catMarks:22, type:"application"},
    {week:7,  topic:"Academic Reading & Paragraph Writing",  unit:7, catMarks:22, type:"application"},
    {week:8,  topic:"Speaking Skills & Presentations",       unit:8, catMarks:22, type:"application"},
    {week:9,  topic:"Review: Tenses & Structures",           unit:null, catMarks:25, type:"review"},
    {week:10, topic:"Review: Vocabulary & Formal Register",  unit:null, catMarks:25, type:"review"},
    {week:11, topic:"Extended Writing: Essay",               unit:null, catMarks:25, type:"writing"},
    {week:12, topic:"Oral Presentation Assessment",          unit:null, catMarks:25, type:"speaking_formal"},
    {week:13, topic:"Reading Comprehension & Analysis",      unit:null, catMarks:30, type:"reading"},
    {week:14, topic:"Mock Exam + Feedback",                  unit:null, catMarks:30, type:"mock"},
    {week:15, topic:"Final Exam Revision",                   unit:null, catMarks:0,  type:"revision"},
  ],
  3: [
    {week:1,  topic:"Complex Conditionals & Wish",           unit:1, catMarks:20, type:"foundation"},
    {week:2,  topic:"Critical Reading & Academic Vocab",     unit:2, catMarks:20, type:"foundation"},
    {week:3,  topic:"Academic Essay Writing (PEEL)",         unit:3, catMarks:20, type:"foundation"},
    {week:4,  topic:"Debates & Logical Arguments",           unit:4, catMarks:20, type:"foundation"},
    {week:5,  topic:"Research Skills & Citations",           unit:5, catMarks:22, type:"foundation"},
    {week:6,  topic:"Advanced Professional English",         unit:6, catMarks:22, type:"application"},
    {week:7,  topic:"Literature & Media Language",           unit:7, catMarks:22, type:"application"},
    {week:8,  topic:"IELTS/TOEFL: Reading & Listening",     unit:8, catMarks:22, type:"application"},
    {week:9,  topic:"Independent Research: Draft 1",         unit:9, catMarks:25, type:"project"},
    {week:10, topic:"Research: Peer Review Session",         unit:null, catMarks:25, type:"project"},
    {week:11, topic:"IELTS Writing Task 1 & 2 Practice",    unit:null, catMarks:25, type:"ielts"},
    {week:12, topic:"Oral Exam Preparation",                 unit:null, catMarks:25, type:"speaking_formal"},
    {week:13, topic:"Research Essay Submission",             unit:null, catMarks:30, type:"project"},
    {week:14, topic:"Mock Final Exam",                       unit:null, catMarks:30, type:"mock"},
    {week:15, topic:"Final Exam Revision",                   unit:null, catMarks:0,  type:"revision"},
  ],
};

// ── GRADING WEIGHTS ──────────────────────────────────────────────
const GRADE_WEIGHTS = {
  cats:       0.40,  // 40% — Continuous Assessment Tests (all 14 weeks combined)
  attendance: 0.10,  // 10% — Class attendance (logged by instructor)
  exam:       0.50,  // 50% — End-of-level examination
  passmark:   70,    // Must score 70%+ to certify
};

// ── CAT QUESTION BANKS — 15 weeks × 3 levels (English shown; apply to all languages) ─
// Format: {q, opts (MCQ) OR blanks (short answer) OR prompt (voice/explain), type, marks, ans}
const CAT_BANKS = {
  // ────────────────── LEVEL 1 ──────────────────
  1: {
    1: [ // Week 1: Greetings & Introductions
      {type:"mcq",    marks:2, q:"Which greeting is correct before noon?",                               opts:["Good evening","Good afternoon","Good morning","Good night"],         ans:2},
      {type:"mcq",    marks:2, q:"'My name is Tom.' — What verb is used?",                              opts:["have","do","am","is"],                                               ans:3},
      {type:"mcq",    marks:2, q:"How do you respond to 'Nice to meet you'?",                           opts:["See you later","Nice to meet you too","Good night","Thank you"],     ans:1},
      {type:"mcq",    marks:2, q:"Which is an informal greeting?",                                      opts:["Good morning","Good evening","Hi!","How do you do?"],                ans:2},
      {type:"mcq",    marks:2, q:"'I ___ a student.' Fill in:",                                         opts:["are","is","am","be"],                                                ans:2},
      {type:"short",  marks:2, q:"Write the correct form: 'She ___ (be) from Nairobi.'",               ans:"is"},
      {type:"short",  marks:2, q:"Translate to English: 'Habari ya asubuhi'",                          ans:"Good morning"},
      {type:"short",  marks:2, q:"Write ONE sentence introducing yourself (name + country).",           ans:"open"},
      {type:"explain",marks:4, q:"In 2–3 sentences, explain when you use 'Good evening' vs 'Good night' in English.", ans:"open"},
    ],
    2: [ // Week 2: Numbers, Time & Dates
      {type:"mcq",    marks:2, q:"How do you say 3:30 in English?",                                    opts:["Three thirty past","Half past three","Quarter to three","Three and half"], ans:1},
      {type:"mcq",    marks:2, q:"What is 40 in words?",                                               opts:["fourty","forty","fourtey","forthy"],                                  ans:1},
      {type:"mcq",    marks:2, q:"Which preposition: 'The class starts ___ Monday'?",                  opts:["in","at","on","by"],                                                  ans:2},
      {type:"mcq",    marks:2, q:"'It is quarter past six.' — What digital time is that?",             opts:["6:15","6:45","6:30","5:45"],                                           ans:0},
      {type:"mcq",    marks:2, q:"What comes after Wednesday?",                                        opts:["Tuesday","Friday","Thursday","Monday"],                               ans:2},
      {type:"short",  marks:2, q:"Write 47 in words.",                                                 ans:"forty-seven"},
      {type:"short",  marks:2, q:"What is today's date? Write in full English (e.g. Monday, 5th May 2026).", ans:"open"},
      {type:"short",  marks:2, q:"Use AT, ON or IN: 'I was born ___ 2005 ___ Nairobi.'",              ans:"in / in"},
      {type:"explain",marks:4, q:"Explain the difference between AT, ON and IN when talking about time. Give one example each.", ans:"open"},
    ],
    3: [ // Week 3: Family & Home Vocabulary
      {type:"mcq",    marks:2, q:"Your mother's mother is your:",                                       opts:["aunt","grandmother","sister","cousin"],                               ans:1},
      {type:"mcq",    marks:2, q:"'___ house is big.' (She) — correct possessive:",                    opts:["His","Her","Their","Our"],                                            ans:1},
      {type:"mcq",    marks:2, q:"Where do you cook food in a house?",                                 opts:["bedroom","living room","kitchen","bathroom"],                         ans:2},
      {type:"mcq",    marks:2, q:"'We ___ students.' — correct form of 'to be':",                      opts:["am","is","are","be"],                                                 ans:2},
      {type:"mcq",    marks:2, q:"Which word means 'baba' in English?",                                opts:["brother","uncle","father","grandfather"],                             ans:2},
      {type:"short",  marks:2, q:"Complete: 'John has a dog. ___ dog is black.'",                      ans:"His"},
      {type:"short",  marks:2, q:"Name 3 rooms in a typical house.",                                   ans:"open"},
      {type:"short",  marks:2, q:"Write a sentence about your family using 'our'.",                    ans:"open"},
      {type:"explain",marks:4, q:"Describe your family in 3–4 sentences. Mention at least 3 family members.", ans:"open"},
    ],
    4: [ // Week 4: Daily Routines & Present Simple
      {type:"mcq",    marks:2, q:"'She ___ (wake up) at 6am.' Correct form:",                          opts:["wake up","wakes up","waked up","is waking"],                          ans:1},
      {type:"mcq",    marks:2, q:"Negative of 'He goes to school': ",                                  opts:["He not go","He doesn't go","He don't go","He isn't go"],             ans:1},
      {type:"mcq",    marks:2, q:"Adverb for 100% frequency:",                                         opts:["sometimes","never","always","often"],                                 ans:2},
      {type:"mcq",    marks:2, q:"'___ you eat breakfast every day?' — correct question word:",        opts:["Is","Are","Do","Does"],                                               ans:2},
      {type:"mcq",    marks:2, q:"Correct sentence:",                                                  opts:["She study at night","She studies at night","She studys at night","She is studying always"], ans:1},
      {type:"short",  marks:2, q:"Write the correct form: 'He ___ (not eat) meat.'",                  ans:"doesn't eat"},
      {type:"short",  marks:2, q:"Put the adverb correctly: 'I / late / am / never'",                 ans:"I am never late"},
      {type:"short",  marks:2, q:"Write a question: your partner wakes up at 5:30. Ask them!",        ans:"open"},
      {type:"explain",marks:4, q:"Describe your own daily routine in 4–5 sentences using present simple and at least 2 frequency adverbs.", ans:"open"},
    ],
    5: [ // Week 5: Food, Shopping & Countables
      {type:"mcq",    marks:2, q:"'Rice' is:",                                                         opts:["countable","uncountable","plural","a verb"],                          ans:1},
      {type:"mcq",    marks:2, q:"'How ___ sugar do you need?'",                                       opts:["many","much","some","any"],                                           ans:1},
      {type:"mcq",    marks:2, q:"Correct shopping phrase for asking price:",                          opts:["How many is this?","How much is this?","What price are you?","Is it expensive?"], ans:1},
      {type:"mcq",    marks:2, q:"'I don't have ___ eggs.' (negative):",                               opts:["some","any","much","a few"],                                          ans:1},
      {type:"mcq",    marks:2, q:"'A few tomatoes' — tomatoes is:",                                    opts:["uncountable","a verb","countable","singular"],                        ans:2},
      {type:"short",  marks:2, q:"Fill in: 'She bought ___ bread and ___ avocados from the market.'", ans:"some / some"},
      {type:"short",  marks:2, q:"Write a sentence using 'How many' with eggs.",                      ans:"open"},
      {type:"short",  marks:2, q:"Is 'milk' countable or uncountable? Give a correct example sentence.", ans:"open"},
      {type:"explain",marks:4, q:"Write a short market dialogue (6 lines) between a buyer and a seller. Include greeting, price negotiation, and payment.", ans:"open"},
    ],
    6: [ // Week 6: Health, Body & Directions
      {type:"mcq",    marks:2, q:"'There ___ a hospital near here.' (singular):",                      opts:["are","is","be","am"],                                                 ans:1},
      {type:"mcq",    marks:2, q:"Correct health phrase:",                                             opts:["I have a headache","I has headache","My head hurts me a lot pain","I am headache"], ans:0},
      {type:"mcq",    marks:2, q:"'Turn left' means:",                                                 opts:["geuka kulia","nenda moja kwa moja","geuka kushoto","rudi nyuma"],     ans:2},
      {type:"mcq",    marks:2, q:"'There ___ any taxis.' (negative plural):",                         opts:["isn't","aren't","is not","am not"],                                   ans:1},
      {type:"mcq",    marks:2, q:"'My stomach ___.' (hurts — correct):",                              opts:["hurt","hurts","is hurting me bad","hurting"],                         ans:1},
      {type:"short",  marks:2, q:"Give directions: hospital → bank (use left, right, straight ahead)", ans:"open"},
      {type:"short",  marks:2, q:"Write: 'There is a school in this village.' as a question.",        ans:"Is there a school in this village?"},
      {type:"short",  marks:2, q:"Name 3 body parts and one health complaint for each.",              ans:"open"},
      {type:"explain",marks:4, q:"Write a short paragraph (5 sentences) describing your neighbourhood using 'there is / there are'.", ans:"open"},
    ],
    7: [ // Week 7: Grammar Review 1–3
      {type:"mcq",    marks:2, q:"Choose the correct verb: 'They ___ doctors.'",                       opts:["am","is","are","be"],                                                 ans:2},
      {type:"mcq",    marks:2, q:"Possessive for 'she':",                                              opts:["his","its","their","her"],                                            ans:3},
      {type:"mcq",    marks:2, q:"'My ___ is kind and hardworking.' (mother's mother):",               opts:["aunt","sister","grandmother","cousin"],                               ans:2},
      {type:"mcq",    marks:2, q:"'She is NOT a teacher.' is a:",                                     opts:["question","negative sentence","positive sentence","command"],         ans:1},
      {type:"mcq",    marks:2, q:"Which sentence is correct?",                                        opts:["He live in Nairobi","She live Nairobi","They lives here","We live in Mombasa"], ans:3},
      {type:"short",  marks:2, q:"Write a question for this answer: 'Yes, I am from Kenya.'",         ans:"Are you from Kenya?"},
      {type:"short",  marks:2, q:"Correct this: 'She is not from Mombasa? Yes, she is not.'",        ans:"open"},
      {type:"short",  marks:2, q:"Fill: 'We ___ students. ___ you a student too?'",                   ans:"are / Are"},
      {type:"explain",marks:4, q:"Write 4 sentences about yourself: name, age, country, occupation. Use 'to be' correctly.", ans:"open"},
    ],
    8: [ // Week 8: Vocabulary & Pronunciation Review
      {type:"mcq",    marks:2, q:"'Bibi' in English is:",                                              opts:["aunt","mother","grandmother","sister"],                               ans:2},
      {type:"mcq",    marks:2, q:"'Forty' is spelled correctly?",                                     opts:["fourty","forty","fourtee","fortee"],                                  ans:1},
      {type:"mcq",    marks:2, q:"Which is NOT a greeting?",                                          opts:["Good morning","How are you","Goodbye","Two plus two"],                ans:3},
      {type:"mcq",    marks:2, q:"'Habari ya mchana' in English:",                                    opts:["Good morning","Good night","Good afternoon","Good evening"],          ans:2},
      {type:"mcq",    marks:2, q:"'Ninakula kifungua kinywa' means:",                                 opts:["I eat lunch","I eat dinner","I eat breakfast","I am eating ugali"],   ans:2},
      {type:"short",  marks:2, q:"Write the English for 'ukumbi'.",                                   ans:"living room"},
      {type:"short",  marks:2, q:"Translate: 'Ninaenda kazini kwa matatu.'",                          ans:"I go to work by matatu."},
      {type:"short",  marks:2, q:"Write 3 food items in English with their Kiswahili translations.",  ans:"open"},
      {type:"explain",marks:4, q:"Why is learning vocabulary important? Explain in 3 sentences using examples from Level 1.", ans:"open"},
    ],
    9: [ // Week 9: Speaking Practice (voice-graded)
      {type:"voice",  marks:5, q:"Record yourself greeting your teacher in the morning and introducing yourself. (30–60 seconds)", ans:"open"},
      {type:"voice",  marks:5, q:"Record a short conversation asking for directions to the hospital from the market. (30–60 seconds)", ans:"open"},
      {type:"voice",  marks:5, q:"Record yourself describing your daily routine. Use at least 5 sentences and 2 frequency adverbs. (45–90 seconds)", ans:"open"},
      {type:"short",  marks:2, q:"Write 3 greetings for different times of day.",                     ans:"open"},
      {type:"short",  marks:3, q:"Write the meaning of these adverbs: always, sometimes, never.",     ans:"open"},
    ],
    10: [ // Week 10: Writing Practice
      {type:"explain",marks:5, q:"Write a paragraph (80–100 words) about your daily routine. Use present simple and frequency adverbs.", ans:"open"},
      {type:"explain",marks:5, q:"Write a market dialogue (10 lines) between a customer and a seller. Include price negotiation.", ans:"open"},
      {type:"mcq",    marks:2, q:"A 'paragraph' starts with a:",                                      opts:["conclusion","topic sentence","bibliography","title"],                 ans:1},
      {type:"mcq",    marks:2, q:"Correct punctuation: 'hello my name is tom'",                       opts:["Hello, my name is Tom.","Hello my name is Tom","hello, my name is tom.","Hello My Name Is Tom"], ans:0},
      {type:"short",  marks:4, q:"Describe your home in 4–5 sentences. Use 'there is / there are'.", ans:"open"},
      {type:"short",  marks:2, q:"Write your full name, admission number, and today's date in English.", ans:"open"},
    ],
    11: [ // Week 11: Reading Comprehension
      {type:"mcq",    marks:2, q:"'He is twenty-eight years old.' How old is he?",                    opts:["18","38","28","82"],                                                   ans:2},
      {type:"mcq",    marks:2, q:"'She goes to class on Tuesday and Thursday.' How many days?",       opts:["1","2","3","4"],                                                       ans:1},
      {type:"mcq",    marks:2, q:"'The class finishes at eight o'clock.' When does it finish?",       opts:["6:00","7:00","8:00","9:00"],                                           ans:2},
      {type:"mcq",    marks:2, q:"'I have a sore throat and a cough.' The person is:",               opts:["hungry","unwell","happy","travelling"],                               ans:1},
      {type:"short",  marks:3, q:"Read: 'My name is Brian. I live in Eastlands, Nairobi. I study English every evening.' — Where does Brian live?", ans:"Eastlands, Nairobi"},
      {type:"short",  marks:3, q:"From the same text: When does Brian study English?",               ans:"every evening"},
      {type:"explain",marks:4, q:"Why is reading in English important for your life or work? Write 3–4 sentences.", ans:"open"},
      {type:"short",  marks:2, q:"Find 3 adjectives in this sentence: 'She is a tall, kind, hardworking teacher.'", ans:"tall, kind, hardworking"},
    ],
    12: [ // Week 12: Integrated Skills
      {type:"mcq",    marks:2, q:"'Does she eat breakfast?' — correct short answer:",                 opts:["Yes, she do","Yes, she does","Yes, she is","Yes, she eats"],            ans:1},
      {type:"mcq",    marks:2, q:"Which is the most formal greeting?",                               opts:["Hey!","Yo!","Good morning, sir.","Wassup!"],                           ans:2},
      {type:"mcq",    marks:2, q:"Correct preposition: 'I was born ___ 1998.'",                      opts:["on","at","in","by"],                                                   ans:2},
      {type:"short",  marks:3, q:"Write a 3-sentence description of a person using adjectives.",     ans:"open"},
      {type:"short",  marks:3, q:"Complete the conversation: 'What time does the bus leave?' / '___ '", ans:"open"},
      {type:"voice",  marks:4, q:"Record: Describe a typical day in your life in English. (60 seconds minimum)", ans:"open"},
      {type:"explain",marks:4, q:"Write a formal letter of introduction (50–70 words) to a new English teacher.", ans:"open"},
    ],
    13: [ // Week 13: Speaking Assessment (formal)
      {type:"voice",  marks:8, q:"FORMAL SPEAKING TEST: Introduce yourself for 60–90 seconds. Include: name, age, country, occupation, family, and why you are learning English. Speak clearly and confidently.", ans:"open"},
      {type:"voice",  marks:7, q:"ROLE PLAY: You are a patient at a clinic. Record a conversation with the doctor. Describe your symptoms clearly. (60–90 seconds)", ans:"open"},
      {type:"voice",  marks:8, q:"NARRATIVE: Tell the story of your typical Saturday. Use present simple and at least 3 time expressions. (60–90 seconds)", ans:"open"},
      {type:"short",  marks:4, q:"Write 4 key vocabulary words from Level 1 with their Swahili translations.", ans:"open"},
      {type:"short",  marks:3, q:"Write the questions you would ask a new classmate on the first day of class.", ans:"open"},
    ],
    14: [ // Week 14: Mock Exam
      {type:"mcq",    marks:2, q:"Correct sentence:",                                                 opts:["She go to market","She goes to the market","She going market","She is go market"], ans:1},
      {type:"mcq",    marks:2, q:"'Good morning!' is used:",                                         opts:["After 6pm","Any time","Before noon","At night"],                      ans:2},
      {type:"mcq",    marks:2, q:"'There ___ two hospitals in our town.'",                           opts:["is","am","are","be"],                                                  ans:2},
      {type:"mcq",    marks:2, q:"'How ___ water do you drink daily?'",                              opts:["many","much","some","few"],                                            ans:1},
      {type:"mcq",    marks:2, q:"Possessive adjective for 'they':",                                 opts:["his","her","our","their"],                                             ans:3},
      {type:"short",  marks:3, q:"Write 3 sentences about your family using possessive adjectives.", ans:"open"},
      {type:"short",  marks:3, q:"Give directions from the school to the nearest market.",           ans:"open"},
      {type:"explain",marks:5, q:"Write a paragraph (80 words) about your neighbourhood. Use there is/are, adjectives, and prepositions.", ans:"open"},
      {type:"voice",  marks:5, q:"Mock Speaking: Greet, introduce yourself, and describe your home in 60 seconds.", ans:"open"},
    ],
  },

  // ────────────────── LEVEL 2 ──────────────────
  2: {
    1: [ // Week 1: Past Simple
      {type:"mcq",    marks:2, q:"'She ___ (go) to Mombasa last year.' Correct past:",               opts:["goed","gone","went","goes"],                                           ans:2},
      {type:"mcq",    marks:2, q:"Negative of 'He bought the book':",                               opts:["He didn't bought","He didn't buy","He doesn't bought","He not buy"],   ans:1},
      {type:"mcq",    marks:2, q:"Which is a past simple time expression?",                         opts:["since Monday","for 3 years","last week","already"],                   ans:2},
      {type:"mcq",    marks:2, q:"Past simple of 'teach':",                                         opts:["teached","taught","tought","teachd"],                                  ans:1},
      {type:"mcq",    marks:2, q:"Correct question:",                                               opts:["Did she went?","Did she go?","Does she went?","Was she go?"],          ans:1},
      {type:"short",  marks:2, q:"Write: 'They ___ (not travel) to Uganda last month.'",            ans:"didn't travel"},
      {type:"short",  marks:2, q:"Give the past simple of: eat, write, see, run, buy.",             ans:"ate, wrote, saw, ran, bought"},
      {type:"short",  marks:2, q:"Write 2 sentences about what you did last weekend.",              ans:"open"},
      {type:"explain",marks:4, q:"Write a paragraph (80–100 words) about one memorable day in your past. Use past simple throughout.", ans:"open"},
    ],
    2: [ // Week 2: Present Perfect
      {type:"mcq",    marks:2, q:"'I ___ never eaten sushi.' Correct:",                             opts:["have","has","had","am"],                                               ans:0},
      {type:"mcq",    marks:2, q:"'She ___ just arrived.' Correct:",                                opts:["have","had","has","is"],                                               ans:2},
      {type:"mcq",    marks:2, q:"'I lived in Kisumu for 5 years.' — This uses:",                  opts:["Present perfect","Past simple","Future simple","Present simple"],      ans:1},
      {type:"mcq",    marks:2, q:"'I ___ lived here since 2018.' Correct:",                        opts:["am","has","have","had"],                                               ans:2},
      {type:"mcq",    marks:2, q:"'___ you ever been to Uganda?'",                                  opts:["Did","Have","Has","Are"],                                              ans:1},
      {type:"short",  marks:2, q:"Write: 'She / go / to Uganda / twice.' Use present perfect.",    ans:"She has been to Uganda twice."},
      {type:"short",  marks:2, q:"Complete: 'I haven't finished ___ . Have you eaten ___?'",       ans:"yet / yet"},
      {type:"short",  marks:2, q:"What's the difference between FOR and SINCE? Give an example each.", ans:"open"},
      {type:"explain",marks:4, q:"Write 5 sentences about YOUR life experiences using have/has + past participle. Include ever, never, already, yet.", ans:"open"},
    ],
    3: [ // Week 3: Future Forms
      {type:"mcq",    marks:2, q:"Spontaneous decision — correct form:",                            opts:["I'm going to answer it","I'll answer it","I answer it","I was answering it"], ans:1},
      {type:"mcq",    marks:2, q:"'She already has her visa.' — use:",                             opts:["will study","is going to study","studies","studied"],                  ans:1},
      {type:"mcq",    marks:2, q:"Prediction with evidence (dark clouds):",                        opts:["It will rain","It's going to rain","It rains","It rained"],             ans:1},
      {type:"mcq",    marks:2, q:"'She ___ come — she hasn't decided.' — use:",                    opts:["will","might","must","shall"],                                          ans:1},
      {type:"mcq",    marks:2, q:"Fixed future arrangement (appointment booked):",                 opts:["will meet","going to meet","am meeting","shall meet"],                  ans:2},
      {type:"short",  marks:2, q:"'The phone rings. You say:' — write using WILL.",                ans:"I'll get it!"},
      {type:"short",  marks:2, q:"Write: you plan to apply for a job next week. Use GOING TO.",   ans:"open"},
      {type:"short",  marks:2, q:"Write a sentence using MIGHT for something uncertain this weekend.", ans:"open"},
      {type:"explain",marks:4, q:"Write a paragraph about your plans and predictions for the next 5 years. Use will, going to, and might (at least once each).", ans:"open"},
    ],
    4: [ // Week 4: Comparatives & Superlatives
      {type:"mcq",    marks:2, q:"Comparative of 'good':",                                          opts:["more good","gooder","better","best"],                                  ans:2},
      {type:"mcq",    marks:2, q:"Superlative of 'big':",                                           opts:["the most big","the bigger","the biggest","the bigest"],               ans:2},
      {type:"mcq",    marks:2, q:"Correct sentence:",                                              opts:["She is more tall than him","She is taller than him","She is tallest than him","She tall more"], ans:1},
      {type:"mcq",    marks:2, q:"Adverb of manner from 'careful':",                               opts:["carefully","careful","careness","more careful"],                       ans:0},
      {type:"mcq",    marks:2, q:"'Nairobi is not ___ expensive ___ Dubai.'",                      opts:["as/as","than/than","more/as","as/than"],                               ans:0},
      {type:"short",  marks:2, q:"Write comparative and superlative of: bad, far, interesting.",   ans:"worse/worst, further/furthest, more interesting/most interesting"},
      {type:"short",  marks:2, q:"Write: 'A matatu is cheaper than a taxi.' Use NOT AS...AS.",     ans:"A taxi is not as cheap as a matatu."},
      {type:"short",  marks:2, q:"Write 2 sentences comparing Nairobi and your hometown.",         ans:"open"},
      {type:"explain",marks:4, q:"Compare two cities, jobs, or people you know well. Write 80–100 words using comparatives, superlatives, and as...as.", ans:"open"},
    ],
    5: [ // Week 5: Modal Verbs & Opinions
      {type:"mcq",    marks:2, q:"'You ___ see a doctor — it's serious.' (advice):",               opts:["must","should","mustn't","don't have to"],                             ans:1},
      {type:"mcq",    marks:2, q:"'Students ___ cheat in exams.' (prohibition):",                 opts:["mustn't","don't have to","shouldn't must","might not"],                ans:0},
      {type:"mcq",    marks:2, q:"Formal opinion opener:",                                         opts:["I feel like...","I think...","In my opinion,...","You know what..."],  ans:2},
      {type:"mcq",    marks:2, q:"Polite disagreement:",                                           opts:["You are wrong!","I see your point, but...","No way!","Whatever!"],    ans:1},
      {type:"mcq",    marks:2, q:"MUST vs HAVE TO — MUST expresses:",                             opts:["external rule","personal strong obligation","suggestion","permission"], ans:1},
      {type:"short",  marks:2, q:"Give advice using SHOULD to someone who wants to learn English faster.", ans:"open"},
      {type:"short",  marks:2, q:"Write: 'You ___ drive without a licence.' (use mustn't).",      ans:"You mustn't drive without a licence."},
      {type:"short",  marks:2, q:"Write your opinion on this: 'Social media is good for students.'", ans:"open"},
      {type:"explain",marks:4, q:"Agree or disagree: 'University education should be free in Kenya.' Write 80 words. Use opinion phrases and modal verbs.", ans:"open"},
    ],
    // Weeks 6-14 for Level 2 follow same structure — abbreviated here, full in system
    6: [{type:"mcq",marks:2,q:"Passive voice: 'The manager signed the contract.' → ",opts:["The contract signed by manager","The contract was signed by the manager","The contract is signed","Manager was signing contract"],ans:1},{type:"mcq",marks:2,q:"Formal email opening (name known):",opts:["Hey Tom,","Dear Mr Kamau,","Hi there,","Yo!"],ans:1},{type:"mcq",marks:2,q:"Passive: 'They make Tusker beer in Kenya.' →",opts:["Tusker is making in Kenya","Tusker beer is made in Kenya","Tusker beer was made","Beer made Kenya"],ans:1},{type:"mcq",marks:2,q:"Formal email closing (name known):",opts:["Yours faithfully","See ya","Yours sincerely","Best wishes mate"],ans:2},{type:"mcq",marks:2,q:"Reported speech: 'I am tired,' she said. →",opts:["She said she is tired","She said she was tired","She says she tired","She told she was tired"],ans:1},{type:"short",marks:2,q:"Rewrite in passive: 'The government built a new hospital.'",ans:"A new hospital was built by the government."},{type:"short",marks:2,q:"Write a formal email subject line for a job application.",ans:"open"},{type:"short",marks:2,q:"Report: '\"I will help you,\" he promised.' →",ans:"He promised that he would help me."},{type:"explain",marks:4,q:"Write a formal email (80 words) applying for a position of your choice. Use formal language throughout.",ans:"open"}],
    7: [{type:"mcq",marks:2,q:"Topic sentence position in a paragraph:",opts:["last","middle","first","anywhere"],ans:2},{type:"mcq",marks:2,q:"'Although it was raining, they continued.' ALTHOUGH connects:",opts:["two similar ideas","contrasting ideas","cause and effect","time sequence"],ans:1},{type:"mcq",marks:2,q:"Relative pronoun for places:",opts:["who","which","that","where"],ans:3},{type:"mcq",marks:2,q:"'She studied hard. ___, she passed.' Best connective:",opts:["However","Therefore","Although","Despite"],ans:1},{type:"mcq",marks:2,q:"DESPITE is followed by:",opts:["a verb","a noun/ing form","a full clause","a conjunction"],ans:1},{type:"short",marks:2,q:"Join: 'I have a friend. She speaks five languages.' Use WHO.",ans:"I have a friend who speaks five languages."},{type:"short",marks:2,q:"Write a topic sentence for a paragraph about climate change in Africa.",ans:"open"},{type:"short",marks:2,q:"Write a sentence using FURTHERMORE.",ans:"open"},{type:"explain",marks:4,q:"Write a full PEEL paragraph (90–120 words) on: 'Technology has improved education in Africa.'",ans:"open"}],
    8: [{type:"mcq",marks:2,q:"Signposting language for moving to next point:",opts:["In conclusion","Moving on to...","For example","As I see it"],ans:1},{type:"mcq",marks:2,q:"In a presentation, what comes FIRST?",opts:["Main point","Conclusion","Introduction","Summary"],ans:2},{type:"mcq",marks:2,q:"If you forget a word in a presentation, you should:",opts:["Stop speaking","Apologise and sit down","Describe it: 'It's the thing that...'","Speak in Swahili"],ans:2},{type:"mcq",marks:2,q:"'th' in 'think' — tongue position:",opts:["Between teeth","Behind teeth","On lips","At throat"],ans:0},{type:"mcq",marks:2,q:"'Rarely' means:",opts:["always","sometimes","almost never","very often"],ans:2},{type:"voice",marks:5,q:"Record a 2-minute presentation on: 'Why I am learning this language.' Use signposting language and at least 3 main points.",ans:"open"},{type:"short",marks:2,q:"Write 2 signposting phrases you would use to introduce your second main point.",ans:"open"},{type:"explain",marks:3,q:"Write your presentation conclusion (40–60 words) for a talk on education in Kenya.",ans:"open"}],
    9: [{type:"voice",marks:5,q:"Record: Tell a 90-second story about a memorable past experience. Use past simple and present perfect.",ans:"open"},{type:"voice",marks:5,q:"Record: Compare two cities or countries you know. Use comparatives and superlatives. (60–90 seconds)",ans:"open"},{type:"explain",marks:5,q:"Write a response (100 words) to: 'Should English be the only language of instruction in East African schools?'",ans:"open"},{type:"mcq",marks:2,q:"Present perfect vs past simple: 'I ___ her yesterday.' —",opts:["have seen","saw","have saw","seen"],ans:1},{type:"short",marks:3,q:"Write 3 sentences contrasting Nairobi and a rural town using however, whereas, and in contrast.",ans:"open"}],
    10: [{type:"explain",marks:6,q:"Write a short essay (150 words) on: 'Technology has changed daily life in East Africa.' Include intro, body, conclusion. Use 3 connectives.",ans:"open"},{type:"mcq",marks:2,q:"'Despite the high cost, she bought it.' DESPITE is followed by:",opts:["a clause","a noun","a verb","a question"],ans:1},{type:"mcq",marks:2,q:"Correct essay structure:",opts:["Body → Introduction → Conclusion","Introduction → Body → Conclusion","Conclusion → Body → Introduction","Introduction → Conclusion → Body"],ans:1},{type:"short",marks:3,q:"Write your thesis statement for an essay on: 'Social media does more harm than good.'",ans:"open"},{type:"voice",marks:5,q:"Record: Give a 90-second argument FOR or AGAINST: 'Smartphones should be banned in classrooms.'",ans:"open"},{type:"short",marks:2,q:"Replace informal: 'a lot of people think that...'",ans:"A significant number of people believe that..."}],
    11: [{type:"mcq",marks:2,q:"'The Africa Rising narrative emerged in the early 2000s.' This sentence is:",opts:["an opinion","a question","a fact statement","a conclusion"],ans:2},{type:"mcq",marks:2,q:"Critical reading means:",opts:["reading very fast","judging if evidence is strong and arguments are valid","reading only main points","summarising texts"],ans:1},{type:"short",marks:3,q:"Read: 'Mobile technology has transformed life for millions of Africans.' — Is this a fact, opinion, or both? Justify.",ans:"open"},{type:"short",marks:3,q:"Write 2 questions you would ask when critically reading an article.",ans:"open"},{type:"explain",marks:5,q:"Write a 100-word critical response: Do you think Africa is 'rising'? Give 2 pieces of evidence.",ans:"open"},{type:"voice",marks:5,q:"Record: Summarise an article or news story you read recently. Give your opinion on it. (90 seconds)",ans:"open"}],
    12: [{type:"mcq",marks:2,q:"Active: 'They will announce the results.' Passive:",opts:["Results will announce","The results will be announced","Results are announced","The results were announced"],ans:1},{type:"mcq",marks:2,q:"'Have you ever eaten sushi?' uses:",opts:["Past simple","Present continuous","Present perfect","Future form"],ans:2},{type:"mcq",marks:2,q:"Modal for 50% possibility:",opts:["must","should","might","will"],ans:2},{type:"short",marks:3,q:"Write one example each of: will (promise), going to (plan), might (uncertainty).",ans:"open"},{type:"voice",marks:5,q:"Record a mock job interview answer to: 'Tell me about yourself and your greatest strength.' (90 seconds)",ans:"open"},{type:"explain",marks:5,q:"Write a paragraph arguing FOR or AGAINST: 'Learning English is more important than learning vocational skills.'",ans:"open"},{type:"short",marks:3,q:"Write 3 sentences in passive voice about your school or town.",ans:"open"}],
    13: [{type:"voice",marks:8,q:"FORMAL PRESENTATION (Level 2): Deliver a 3-minute presentation on a social issue in Kenya. Use signposting, examples, and a clear conclusion.",ans:"open"},{type:"voice",marks:7,q:"DEBATE PRACTICE: Record your opening statement FOR or AGAINST: 'University fees should be free in Kenya.' (2 minutes)",ans:"open"},{type:"explain",marks:8,q:"Write a formal email (100–120 words) to a company enquiring about a job vacancy. Include: purpose, your qualifications, a request for an interview.",ans:"open"},{type:"short",marks:4,q:"Convert to reported speech: '\"I am applying for the management position,\" Tom said.' and '\"We will call you next week,\" the interviewer promised.'",ans:"open"},{type:"short",marks:3,q:"Write 3 formal alternatives: instead of 'ask', 'help', and 'about'.",ans:"enquire / assist / regarding"}],
    14: [{type:"mcq",marks:2,q:"Superlative of 'far':",opts:["farer","more far","the furthest","the most far"],ans:2},{type:"mcq",marks:2,q:"'I have never ___ Japanese food.' Correct past participle of 'eat':",opts:["ate","eated","eaten","eating"],ans:2},{type:"mcq",marks:2,q:"Students ___ copy in exams. (prohibition)",opts:["mustn't","don't have to","shouldn't","might not"],ans:0},{type:"mcq",marks:2,q:"Passive: 'Someone has stolen the data.' →",opts:["Data has been stolen","Data was stolen","Data stolen has been","Data is stolen"],ans:0},{type:"mcq",marks:2,q:"Topic sentence should:",opts:["summarise the whole essay","state one main idea","provide evidence","begin with 'In conclusion'"],ans:1},{type:"short",marks:3,q:"Write a short PEEL paragraph (60–80 words) on: 'Reading improves English.'",ans:"open"},{type:"short",marks:3,q:"Write 3 sentences with: although, however, therefore.",ans:"open"},{type:"voice",marks:5,q:"Mock Speaking: Discuss this question for 90 seconds: 'Is technology making us less social?'",ans:"open"},{type:"explain",marks:5,q:"Mock Essay: Write an intro + 1 body paragraph (100 words) on: 'Technology has improved life in East Africa more than any other development.'",ans:"open"}],
  },

  // ────────────────── LEVEL 3 ──────────────────
  3: {
    1: [{type:"mcq",marks:2,q:"Type 3 conditional uses:",opts:["If + present, will + base","If + past simple, would + base","If + past perfect, would have + pp","If + present, present"],ans:2},{type:"mcq",marks:2,q:"'If I were you, I would accept.' WERE is used because:",opts:["Past tense","Formal subjunctive for all subjects","Only with plural subjects","Irregular verb"],ans:1},{type:"mcq",marks:2,q:"'I wish I ___ French.' (I don't speak it now)",opts:["spoke","had spoken","speak","would speak"],ans:0},{type:"mcq",marks:2,q:"Inversion trigger:",opts:["Always","Rarely","Sometimes","Usually"],ans:1},{type:"mcq",marks:2,q:"Cleft sentence for emphasis: 'DETERMINATION helped her.'",opts:["It was her who determination helped","It was determination that helped her","What helped was determined her","She was determination who helped"],ans:1},{type:"short",marks:2,q:"Write a Type 2 conditional about being president.",ans:"open"},{type:"short",marks:2,q:"Rewrite with inversion: 'I have never seen such talent.'",ans:"Never have I seen such talent."},{type:"short",marks:2,q:"Express a past regret using IF ONLY.",ans:"open"},{type:"explain",marks:4,q:"Write a paragraph (80 words) using at least: one conditional type 3, one wish + past perfect, and one inversion for emphasis.",ans:"open"}],
    2: [{type:"mcq",marks:2,q:"'Misrepresent' uses prefix meaning:",opts:["again","wrongly","between","too much"],ans:1},{type:"mcq",marks:2,q:"AWL: 'analyse' means:",opts:["to copy","to examine in detail","to summarise quickly","to translate"],ans:1},{type:"mcq",marks:2,q:"'Critical reading' primarily involves:",opts:["Reading fast","Judging arguments and evidence","Memorising vocabulary","Translating passages"],ans:1},{type:"mcq",marks:2,q:"'Overestimate' means:",opts:["to estimate too little","to estimate correctly","to estimate too much","to not estimate"],ans:2},{type:"mcq",marks:2,q:"'-tion' suffix creates a:",opts:["verb","adjective","noun","adverb"],ans:2},{type:"short",marks:2,q:"Use the word 'demonstrate' in an academic sentence.",ans:"open"},{type:"short",marks:2,q:"What does the prefix 'inter-' mean? Give 2 examples.",ans:"between; international, interpersonal"},{type:"short",marks:2,q:"Write the noun forms of: develop, achieve, possible.",ans:"development, achievement, possibility"},{type:"explain",marks:4,q:"In 80 words, explain what 'framing' means in language. Give an example using two sentences about the same event.",ans:"open"}],
    3: [{type:"mcq",marks:2,q:"PEEL stands for:",opts:["Point, Evidence, Explanation, Link","Plan, Edit, Evaluate, Launch","Purpose, Example, Explain, Link","Point, Essay, Evidence, Logic"],ans:0},{type:"mcq",marks:2,q:"Academic hedging phrase:",opts:["I think...","It is obvious that...","Research suggests that...","Everyone knows that..."],ans:2},{type:"mcq",marks:2,q:"Replace informal 'but' with academic alternative:",opts:["however","because","therefore","also"],ans:0},{type:"mcq",marks:2,q:"Essay thesis statement should be:",opts:["A question","A fact everyone agrees on","A clear, arguable position","A list of topics"],ans:2},{type:"mcq",marks:2,q:"'Furthermore' adds:",opts:["contrast","additional information","result","condition"],ans:1},{type:"short",marks:2,q:"Write an academic thesis statement for: 'Should Kenya make English its only official language?'",ans:"open"},{type:"short",marks:2,q:"Replace with academic language: 'a lot of people think that corruption is bad.'",ans:"open"},{type:"short",marks:2,q:"Write a hedging sentence using: 'research suggests'.",ans:"open"},{type:"explain",marks:4,q:"Write a complete PEEL paragraph (100–130 words) on: 'Access to the internet is a basic human right in the 21st century.'",ans:"open"}],
    4: [{type:"mcq",marks:2,q:"'Ad hominem' fallacy attacks:",opts:["evidence","the argument structure","the person, not the argument","data sources"],ans:2},{type:"mcq",marks:2,q:"Toulmin model: WARRANT is:",opts:["the claim","the main evidence","the logical reason connecting evidence to claim","the conclusion"],ans:2},{type:"mcq",marks:2,q:"'Either you agree or you are against us.' This is:",opts:["a valid argument","straw man","false dichotomy","appeal to authority"],ans:2},{type:"mcq",marks:2,q:"Polite disagreement in formal debate:",opts:["You are wrong!","I see your point; however...","No way!","That is ridiculous."],ans:1},{type:"mcq",marks:2,q:"To 'refute' an argument means:",opts:["to agree with it","to prove it wrong","to summarise it","to repeat it"],ans:1},{type:"short",marks:2,q:"Give a claim, warrant, and evidence for: 'English education should be compulsory in all African schools.'",ans:"open"},{type:"short",marks:2,q:"Identify the fallacy: 'She cannot comment on poverty — she grew up wealthy.'",ans:"Ad hominem"},{type:"short",marks:2,q:"Write a polite formal refutation of this claim: 'Social media has no educational value.'",ans:"open"},{type:"explain",marks:4,q:"Write your opening debate statement (90 words) FOR: 'Smartphones do more good than harm for students.'",ans:"open"}],
    5: [{type:"mcq",marks:2,q:"CRAAP stands for:",opts:["Currency, Relevance, Authority, Accuracy, Purpose","Content, Reading, Author, Article, Publication","Claim, Reason, Authority, Argument, Point","Currency, Research, Access, Author, Purpose"],ans:0},{type:"mcq",marks:2,q:"Plagiarism means:",opts:["citing sources correctly","presenting others' ideas as your own","paraphrasing accurately","writing original content"],ans:1},{type:"mcq",marks:2,q:"In-text citation (author-date): a book by Kariuki (2023) p.12:",opts:["(2023:12 Kariuki)","(Kariuki, 2023, p.12)","[Kariuki-2023]","Kariuki/2023/12"],ans:1},{type:"mcq",marks:2,q:"'The graph illustrates...' is used to:",opts:["express an opinion","describe visual data","give advice","make a prediction"],ans:1},{type:"mcq",marks:2,q:"A 'credible source' is one that is:",opts:["the first on Google","authored by an expert with verifiable credentials","the most popular","from social media"],ans:1},{type:"short",marks:2,q:"Paraphrase this (do NOT copy): 'The rapid urbanisation of East African cities has created unprecedented pressure on public infrastructure.'",ans:"open"},{type:"short",marks:2,q:"Write a reference list entry for a book: Author=Mutua T., Year=2024, Title=Language Policy in Africa, Publisher=Nairobi: Lakeview.",ans:"Mutua, T. (2024). Language Policy in Africa. Nairobi: Lakeview."},{type:"short",marks:2,q:"Write 2 phrases for introducing data from a chart.",ans:"open"},{type:"explain",marks:4,q:"Write a 90-word research paragraph with an in-text citation, evidence, and explanation on: 'Mobile technology has improved healthcare access in rural Kenya.'",ans:"open"}],
    6: [{type:"mcq",marks:2,q:"Executive summary is written:",opts:["before conducting research","first, but based on the full report","as a draft outline","after the introduction only"],ans:1},{type:"mcq",marks:2,q:"In negotiation, 'deferring a decision' means:",opts:["Agreeing immediately","Asking to consult colleagues first","Rejecting the offer","Making a counter-offer"],ans:1},{type:"mcq",marks:2,q:"Business report FINDINGS section should:",opts:["interpret data","present data objectively without opinion","recommend actions","summarise the report"],ans:1},{type:"mcq",marks:2,q:"'We are prepared to offer...' is used in:",opts:["cover letters","negotiations","executive summaries","academic essays"],ans:1},{type:"mcq",marks:2,q:"Professional email tone should be:",opts:["casual and informal","formal and precise","emotional and personal","vague and general"],ans:1},{type:"short",marks:2,q:"Write an executive summary opening sentence for a report on English training needs at a Nairobi company.",ans:"open"},{type:"short",marks:2,q:"Write a negotiation phrase to counter an offer of KES 300,000 when you need KES 400,000.",ans:"open"},{type:"short",marks:2,q:"List the 9 sections of a full business report.",ans:"open"},{type:"explain",marks:4,q:"Write an executive summary (120–150 words) for: A study found 65% of 120 staff need English training; costs $500,000 for year 1; projected ROI within 24 months.",ans:"open"}],
    7: [{type:"mcq",marks:2,q:"A metaphor:",opts:["uses 'like' or 'as'","is a direct comparison without 'like'","gives human qualities to objects","repeats initial consonants"],ans:1},{type:"mcq",marks:2,q:"Anaphora is:",opts:["repetition of a word at the start of successive clauses","a comparison using like","irony","a rhetorical question"],ans:0},{type:"mcq",marks:2,q:"Rhetorical question:",opts:["expects a specific answer","is asked for effect, not a real answer","is used only in newspapers","replaces the topic sentence"],ans:1},{type:"mcq",marks:2,q:"Editorial tone compared to academic essay:",opts:["more objective","more personal and direct","less opinionated","avoids evidence"],ans:1},{type:"mcq",marks:2,q:"'The wind whispered secrets.' This is:",opts:["simile","alliteration","personification","irony"],ans:2},{type:"short",marks:2,q:"Identify a metaphor in this: 'Life is a journey with no map.'",ans:"Life is a journey (life compared directly to a journey)"},{type:"short",marks:2,q:"Write a rhetorical question suitable for an editorial about education.",ans:"open"},{type:"short",marks:2,q:"Write a 3-sentence editorial hook for: 'English education is transforming East African careers.'",ans:"open"},{type:"explain",marks:4,q:"Write a persuasive editorial paragraph (80–100 words) on: 'Every East African professional must learn to speak English with confidence.' Use at least 2 rhetorical devices.",ans:"open"}],
    8: [{type:"mcq",marks:2,q:"IELTS Writing Task 1 requires:",opts:["a 250-word argument essay","a 150-word description of visual data","a 200-word story","a 100-word summary of a reading passage"],ans:1},{type:"mcq",marks:2,q:"IELTS Band 7 requires:",opts:["perfect grammar","wide range of structures with minor errors","only simple sentences","avoidance of complex vocabulary"],ans:1},{type:"mcq",marks:2,q:"IELTS Speaking Part 3 tests:",opts:["reading comprehension","abstract discussion on themes","vocabulary memorisation","translation"],ans:1},{type:"mcq",marks:2,q:"S.E.E. method stands for:",opts:["State, Explain, Example","Study, Edit, Evaluate","Sentence, Essay, Evidence","Summary, Expansion, Ending"],ans:0},{type:"mcq",marks:2,q:"'Figures declined sharply between 2020 and 2022.' This describes:",opts:["a stable trend","an upward trend","a downward trend","a fluctuating trend"],ans:2},{type:"short",marks:2,q:"Write an IELTS Task 1 overview sentence for: 'A chart showing rising smartphone use in Africa from 2010–2025.'",ans:"open"},{type:"short",marks:2,q:"Write a Band 7+ IELTS Speaking Part 3 answer (4–5 sentences) to: 'Has the internet had a positive effect on communication?'",ans:"open"},{type:"voice",marks:5,q:"IELTS Speaking Part 2: Describe a person who has inspired you. Use the S.E.E. method. Speak for 2 minutes.",ans:"open"},{type:"explain",marks:3,q:"Write an IELTS Task 2 introduction + thesis (50–60 words) for: 'Governments should invest more in education than defence.'",ans:"open"}],
    9: [{type:"voice",marks:8,q:"RESEARCH PRESENTATION: Deliver your 5-minute research presentation. State your research question, 3 main findings with evidence, and your recommendation.",ans:"open"},{type:"voice",marks:7,q:"ORAL EXAMINATION SIMULATION: Answer spontaneously: 'Summarise your essay in 3 sentences. What is the strongest counter-argument to your thesis?'",ans:"open"},{type:"explain",marks:8,q:"Submit your research essay introduction + first body paragraph (150–180 words) with in-text citation and clear thesis statement.",ans:"open"},{type:"short",marks:4,q:"What makes a research question STRONG? Write a strong and a weak research question on education in Kenya.",ans:"open"},{type:"short",marks:3,q:"Write 3 academic sentences using: notwithstanding, consequently, it could be argued that.",ans:"open"}],
  },
};

// Weeks 7–14 for Level 3 reuse the framework above (truncated for storage efficiency)
// The system dynamically generates review weeks from earlier CAT content
const CAT_QUESTIONS = {
  english: {
    1: [
      {q:"Which is the correct greeting before noon?",opts:["Good evening","Good afternoon","Good morning","Good night"],ans:2,unit:1},
      {q:"Fill in: 'She _____ a teacher.'",opts:["am","are","is","be"],ans:2,unit:1},
      {q:"'Asante' means what in English?",opts:["Please","Sorry","Thank you","Hello"],ans:2,unit:1},
      {q:"What is 7 in English?",opts:["six","eight","seven","five"],ans:2,unit:2},
      {q:"3:30 in words is?",opts:["Quarter past three","Half past three","Quarter to four","Three o'clock"],ans:1,unit:2},
      {q:"'Kaka' in English is?",opts:["Sister","Father","Mother","Brother"],ans:3,unit:3},
      {q:"'My _____ name is Tom.' (possession)",opts:["I","me","my","mine"],ans:2,unit:3},
      {q:"She _____ to school every day.",opts:["go","goes","going","gone"],ans:1,unit:4},
      {q:"'Rice' is what type of noun?",opts:["Countable","Uncountable","Proper","Plural"],ans:1,unit:5},
      {q:"'Turn left' in Kiswahili is?",opts:["Geuka kulia","Nenda mbele","Geuka kushoto","Simama"],ans:2,unit:6},
    ],
    2: [
      {q:"Past simple of 'go' is?",opts:["goed","gone","went","goes"],ans:2,unit:1},
      {q:"'I _____ never been to France.'",opts:["have","has","had","did"],ans:0,unit:2},
      {q:"'She is _____ than her sister.' (tall)",opts:["more tall","tallest","taller","most tall"],ans:2,unit:4},
      {q:"Negative past: 'He _____ eat meat.'",opts:["didn't","doesn't","wasn't","haven't"],ans:0,unit:1},
      {q:"'Therefore' shows?",opts:["Contrast","Reason","Result","Addition"],ans:2,unit:7},
    ],
    3: [
      {q:"'If I were you, I _____ study harder.'",opts:["will","would","should","must"],ans:1,unit:1},
      {q:"'Research suggests that...' is an example of?",opts:["Hedging language","Command","Question","Exclamation"],ans:0,unit:3},
      {q:"Prefix 'mis-' means?",opts:["again","badly/wrongly","before","after"],ans:1,unit:2},
    ],
  },
  swahili: {
    1: [
      {q:"'How are you?' kwa Kiswahili ni?",opts:["Asante","Karibu","Hujambo?","Kwaheri"],ans:2,unit:1},
      {q:"'Marahaba' ni jibu la?",opts:["Habari","Shikamoo","Asante","Karibu"],ans:1,unit:1},
      {q:"Nambari 7 kwa Kiswahili ni?",opts:["sita","tisa","saba","nane"],ans:2,unit:2},
      {q:"'Nyekundu' kwa Kiingereza ni?",opts:["blue","green","red","yellow"],ans:2,unit:2},
    ],
  },
  french: {
    1: [
      {q:"'Bonjour' is used when?",opts:["At night","Any time","Morning/daytime","Only evening"],ans:2,unit:1},
      {q:"'Je suis' means?",opts:["I have","I am","I go","I want"],ans:1,unit:1},
      {q:"Informal 'How are you?' in French?",opts:["Comment allez-vous?","Comment tu vas?","Ça suffit?","Bonsoir?"],ans:1,unit:1},
    ],
  },
  arabic: {
    1: [
      {q:"'As-salamu alaykum' means?",opts:["Thank you","Goodbye","Peace be upon you","Welcome"],ans:2,unit:1},
      {q:"'Shukran' means?",opts:["Hello","Sorry","Please","Thank you"],ans:3,unit:1},
    ],
  },
  german: {
    1: [
      {q:"'Guten Morgen' is used when?",opts:["At night","After 6pm","Before noon","Any time"],ans:2,unit:1},
      {q:"'Ich komme aus...' means?",opts:["I am going to...","I come from...","I live in...","I speak..."],ans:1,unit:1},
    ],
  },
  spanish: {
    1: [
      {q:"'¿Cómo te llamas?' means?",opts:["Where are you from?","How are you?","What is your name?","Where do you live?"],ans:2,unit:1},
      {q:"'Yo soy estudiante.' — verb used?",opts:["estar","tener","ser","ir"],ans:2,unit:1},
    ],
  },
  portuguese: {
    1: [
      {q:"'Bom dia' is used when?",opts:["Evening","Night","Morning","Afternoon"],ans:2,unit:1},
      {q:"'Me chamo...' means?",opts:["I live in...","My name is...","I come from...","I am..."],ans:1,unit:1},
    ],
  },
  greek: {
    1: [
      {q:"Which Greek letter makes the 'th' sound?",opts:["Α (Alpha)","Θ (Theta)","Π (Pi)","Σ (Sigma)"],ans:1,unit:1},
      {q:"'Θεός' (theos) means?",opts:["world","man","God","light"],ans:2,unit:1},
      {q:"'Λόγος' (logos) means?",opts:["love","word/reason","life","grace"],ans:1,unit:1},
      {q:"Smooth breathing mark means?",opts:["Add H sound","No extra sound","Double vowel","Silent letter"],ans:1,unit:2},
      {q:"'Ζωή' (zōē) means?",opts:["death","faith","life","hope"],ans:2,unit:1},
    ],
  },
  hebrew: {
    1: [
      {q:"Hebrew is written in which direction?",opts:["Left to right","Right to left","Top to bottom","Bottom to top"],ans:1,unit:1},
      {q:"'Shalom' (שָׁלוֹם) means?",opts:["Love","Peace","Faith","Joy"],ans:1,unit:1},
      {q:"'Tov' (טוֹב) means?",opts:["bad","holy","good","great"],ans:2,unit:1},
      {q:"'Aleph' (א) produces which sound?",opts:["a strong 'A'","a 'B'","silent/glottal stop","an 'S'"],ans:2,unit:1},
      {q:"The Niqqud system adds what to Hebrew?",opts:["Consonants","Vowel sounds","Punctuation","Numbers"],ans:1,unit:2},
    ],
  },
};

// Helper: get CAT questions for student's language and level
function getCATQuestions(lang, level){
  const langQ = CAT_QUESTIONS[lang||'english']||CAT_QUESTIONS['english'];
  return langQ[level]||langQ[1]||[];
}

// Weekly test availability check (opens every Monday)
function isCATWeekAvailable(){
  const day = new Date().getDay(); // 0=Sun, 1=Mon...5=Fri
  return true; // always available for self-paced students
}

