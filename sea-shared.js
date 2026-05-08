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
  chief_admin:   { label:"Chief Admin",        color:"#c0392b", pages:["dashboard","students","staff","finance","waivers","recruiters","reports","results","materials","certificates","student_questions","feedback","messages","contacts","activitylog","rec_letters","settings","classes","exams_admin","my_exams","registry"] },
  academic_dean: { label:"Academic Dean",      color:"#5b3fa0", pages:["dashboard","students","results","materials","certificates","student_questions","feedback","messages","contacts","classes","exams_admin","my_exams","registry"] },
  instructor:    { label:"Instructor",         color:"#2a5c3f", pages:["dashboard","my_students","my_classes","materials","my_exams","student_questions","feedback","results"] },
  finance:       { label:"Finance Officer",    color:"#1a5276", pages:["dashboard","finance","waivers","recruiters","reports","students","contacts"] },
  admissions:    { label:"Admissions & Comms", color:"#c98a1a", pages:["dashboard","registry","students","messages","contacts","feedback"] },
};

function generateAdmissionNumber() {
  const year = new Date().getFullYear();
  const seq = String((DB.getStudents().length || 0) + 1).padStart(4, '0');
  return `SLA/${year}/${seq}`;
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

// ── WEEKLY CAT QUIZ BANKS (per language, per level) ───────────
// These are used for weekly continuous assessment tests (40% of grade)
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

