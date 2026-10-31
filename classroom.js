import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const OWNER_EMAIL = 'yiannislappas8@gmail.com';
const ZONE = 'Europe/Athens';
const lang = () => localStorage.getItem('echo-language') === 'el' ? 'el' : 'en';
const words = {
  en:{
    tab:'Classes',title:'Class management',intro:'Create lessons, assign students and manage your teaching timetable.',
    create:'Create a class',edit:'Edit class',name:'Class name',subject:'Subject',description:'Description',
    image:'Image URL (optional)',start:'Starts',end:'Ends',students:'Assign students',save:'Save class',
    cancel:'Cancel',delete:'Delete class',confirmDelete:'Delete this class and its assignments?',
    empty:'No classes have been scheduled yet.',loadError:'Could not load classes. Run the classroom database migration first.',
    saveError:'Could not save the class. Check the form and database permissions.',saved:'Class saved.',
    deleted:'Class deleted.',noStudents:'No student accounts are available yet.',
    schedule:'Timetable',day:'Day',week:'Week',month:'Month',all:'All classes',
    upcoming:'Upcoming',live:'Live',completed:'Completed',cancelled:'Cancelled',
    roster:'Assigned students',noRoster:'No students assigned',join:'Join class',joined:'Attendance recorded. The live classroom service is not configured yet.',
    notAssigned:'You are not assigned to this class.',tooEarly:'This class opens 15 minutes before it starts.',
    details:'Class details',close:'Close',demo:'Demo record (owner only)',recurrence:'Repeat weekly',
    occurrences:'Number of weeks',status:'Status',professor:'Professor',participants:'participants',
    noTitle:'Enter a class name.',invalidTime:'End time must be after start time.',
    studentsRequired:'Assign at least one student, or explicitly allow unassigned students.',
    demoMode:'Demo classes are visible only to the Primary Owner.',
    testTab:'Testing Center',testTitle:'Platform checks',testIntro:'Checks report actual service responses. No test will change real classes.',
    authCheck:'Authentication session',dbCheck:'Class database access',roleCheck:'Owner permissions',
    runChecks:'Run checks',passed:'Passed',failed:'Failed',notTested:'Not tested',
    migration:'Classroom database migration is required before classes can be used.',
    liveUnavailable:'Live audio/video is not configured yet. The class schedule and attendance are separate and remain available.',
    rosterError:'Could not update the student list. Review the class and try again.'
  },
  el:{
    tab:'Μαθήματα',title:'Διαχείριση μαθημάτων',intro:'Δημιουργήστε μαθήματα, αναθέστε μαθητές και διαχειριστείτε το πρόγραμμά σας.',
    create:'Δημιουργία μαθήματος',edit:'Επεξεργασία μαθήματος',name:'Όνομα μαθήματος',subject:'Αντικείμενο',description:'Περιγραφή',
    image:'Σύνδεσμος εικόνας (προαιρετικό)',start:'Έναρξη',end:'Λήξη',students:'Ανάθεση μαθητών',save:'Αποθήκευση',
    cancel:'Ακύρωση',delete:'Διαγραφή μαθήματος',confirmDelete:'Να διαγραφεί αυτό το μάθημα και οι αναθέσεις του;',
    empty:'Δεν έχουν προγραμματιστεί μαθήματα.',loadError:'Αδυναμία φόρτωσης. Εκτελέστε πρώτα τη μεταφορά της βάσης μαθημάτων.',
    saveError:'Δεν ήταν δυνατή η αποθήκευση. Ελέγξτε τη φόρμα και τα δικαιώματα.',saved:'Το μάθημα αποθηκεύτηκε.',
    deleted:'Το μάθημα διαγράφηκε.',noStudents:'Δεν υπάρχουν ακόμη λογαριασμοί μαθητών.',
    schedule:'Πρόγραμμα',day:'Ημέρα',week:'Εβδομάδα',month:'Μήνας',all:'Όλα τα μαθήματα',
    upcoming:'Προσεχές',live:'Σε εξέλιξη',completed:'Ολοκληρωμένο',cancelled:'Ακυρωμένο',
    roster:'Ανατεθειμένοι μαθητές',noRoster:'Δεν έχουν ανατεθεί μαθητές',join:'Συμμετοχή',joined:'Η παρουσία καταγράφηκε. Η υπηρεσία ζωντανής τάξης δεν έχει ρυθμιστεί ακόμη.',
    notAssigned:'Δεν έχετε ανατεθεί σε αυτό το μάθημα.',tooEarly:'Το μάθημα ανοίγει 15 λεπτά πριν από την έναρξη.',
    details:'Λεπτομέρειες μαθήματος',close:'Κλείσιμο',demo:'Δοκιμαστική εγγραφή (μόνο ιδιοκτήτης)',recurrence:'Επανάληψη κάθε εβδομάδα',
    occurrences:'Αριθμός εβδομάδων',status:'Κατάσταση',professor:'Καθηγητής',participants:'συμμετέχοντες',
    noTitle:'Συμπληρώστε το όνομα του μαθήματος.',invalidTime:'Η ώρα λήξης πρέπει να είναι μετά την έναρξη.',
    studentsRequired:'Αναθέστε τουλάχιστον έναν μαθητή ή επιτρέψτε ρητά τη συμμετοχή χωρίς ανάθεση.',
    demoMode:'Οι δοκιμαστικές τάξεις είναι ορατές μόνο στον Κύριο Ιδιοκτήτη.',
    testTab:'Κέντρο δοκιμών',testTitle:'Έλεγχοι πλατφόρμας',testIntro:'Οι έλεγχοι βασίζονται σε πραγματικές απαντήσεις υπηρεσιών.',
    authCheck:'Συνεδρία σύνδεσης',dbCheck:'Πρόσβαση στη βάση μαθημάτων',roleCheck:'Δικαιώματα ιδιοκτήτη',
    runChecks:'Εκτέλεση ελέγχων',passed:'Επιτυχία',failed:'Αποτυχία',notTested:'Δεν ελέγχθηκε',
    migration:'Απαιτείται η μεταφορά της βάσης μαθημάτων.',liveUnavailable:'Δεν έχει ρυθμιστεί ακόμη η ζωντανή κλήση ήχου/εικόνας.',
    rosterError:'Δεν ήταν δυνατή η ενημέρωση των μαθητών.'
  }
};
const t = key => words[lang()][key] || words.en[key] || key;
const athens = new Intl.DateTimeFormat(lang()==='el'?'el-GR':'en-GB',{timeZone:ZONE,dateStyle:'medium',timeStyle:'short'});
const fmt = value => { try{return athens.format(new Date(value));}catch{return '';} };
const esc = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const athensParts = date => Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date).map(p=>[p.type,p.value]));
function toAthensISO(value){
  const [d,tm]=value.split('T'); const [y,m,day]=d.split('-').map(Number); const [h,min]=tm.split(':').map(Number);
  const target=Date.UTC(y,m-1,day,h,min); let guess=target;
  for(let i=0;i<3;i++){const p=athensParts(new Date(guess));const represented=Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute);guess=target-(represented-guess);}
  const result=new Date(guess); const p=athensParts(result);
  if(+p.year!==y||+p.month!==m||+p.day!==day||+p.hour!==h||+p.minute!==min) throw new Error('Invalid local time');
  return result.toISOString();
}
function fromISO(value){const p=athensParts(new Date(value));return p.year+'-'+p.month+'-'+p.day+'T'+p.hour+':'+p.minute;}
let db=null,user=null,profile=null,isOwner=false,classes=[],students=[],selected=null,view='week',cursor=new Date();
const nav=document.querySelector('.nav-tabs');
const after=document.getElementById('owner-tab')||nav.lastElementChild;
const tab=document.createElement('button');tab.className='tab';tab.type='button';tab.dataset.tab='classes';tab.textContent=t('tab');nav.append(tab);
const testTab=document.createElement('button');testTab.className='tab hidden';testTab.type='button';testTab.dataset.tab='testing';testTab.textContent=t('testTab');nav.append(testTab);
const host=document.querySelector('.app-main');
const panel=document.createElement('section');panel.className='panel';panel.id='panel-classes';
panel.innerHTML=`
 <div class="panel-heading"><div><h2>${t('title')}</h2><p>${t('intro')}</p></div><button class="btn btn-dark class-primary-action" id="class-new">${t('create')}</button></div>
 <div class="class-toolbar"><div class="class-view-switch"><button type="button" data-view="day">${t('day')}</button><button type="button" data-view="week" class="active">${t('week')}</button><button type="button" data-view="month">${t('month')}</button></div><div class="class-date-nav"><button type="button" id="class-prev" aria-label="Previous period">‹</button><strong id="class-period"></strong><button type="button" id="class-next" aria-label="Next period">›</button></div></div>
 <div id="class-editor" class="class-editor hidden"><form id="class-form">
  <div class="class-form-grid">
   <label>${t('name')}<input id="class-title" maxlength="140" required></label>
   <label>${t('subject')}<input id="class-subject" maxlength="100" required></label>
   <label class="class-form-wide">${t('description')}<textarea id="class-description" rows="3" maxlength="5000"></textarea></label>
   <label class="class-form-wide">${t('image')}<input id="class-image" type="url" maxlength="2048"></label>
   <label>${t('start')}<input id="class-start" type="datetime-local" required></label>
   <label>${t('end')}<input id="class-end" type="datetime-local" required></label>
  </div>
  <div class="class-student-picker"><strong>${t('students')}</strong><div id="class-student-options"></div></div>
  <div class="class-form-options"><label class="class-inline"><input id="class-open" type="checkbox"> Allow students not assigned to this class</label>
   <label class="class-inline"><input id="class-demo" type="checkbox"> ${t('demo')}</label>
   <label class="class-inline"><input id="class-repeat" type="checkbox"> ${t('recurrence')} <input id="class-repeat-count" type="number" min="2" max="16" value="4" class="class-repeat-count"></label>
  </div>
  <p class="class-form-status" id="class-form-status" role="status"></p>
  <div class="class-form-actions"><button type="button" class="btn" id="class-cancel">${t('cancel')}</button><button type="submit" class="btn btn-dark" id="class-save">${t('save')}</button></div>
 </form></div>
 <div id="class-list" class="class-list" aria-live="polite"></div><p class="class-status" id="class-status" role="status"></p>
 <div id="class-detail" class="class-detail hidden"></div>`;
const testing=document.createElement('section');testing.className='panel';testing.id='panel-testing';
testing.innerHTML=`<div class="panel-heading"><div><h2>${t('testTitle')}</h2><p>${t('testIntro')}</p></div><button class="btn btn-dark" id="class-run-checks">${t('runChecks')}</button></div><div class="class-test-results" id="class-test-results"></div>`;
host.append(panel,testing);
function activate(name){document.querySelectorAll('.nav-tabs [data-tab]').forEach(b=>{const on=b.dataset.tab===name;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on));});document.querySelectorAll('#app-shell .panel').forEach(p=>p.classList.toggle('active',p.id==='panel-'+name));}
nav.addEventListener('click',e=>{const b=e.target.closest('[data-tab="classes"],[data-tab="testing"]');if(b)activate(b.dataset.tab);});
document.getElementById('class-new').addEventListener('click',()=>openEditor());
document.getElementById('class-cancel').addEventListener('click',closeEditor);
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===b));renderClasses();}));
document.getElementById('class-prev').addEventListener('click',()=>moveCursor(-1));
document.getElementById('class-next').addEventListener('click',()=>moveCursor(1));
document.getElementById('class-form').addEventListener('submit',saveClass);
document.getElementById('class-run-checks').addEventListener('click',runChecks);
function moveCursor(n){cursor=new Date(cursor);if(view==='day')cursor.setDate(cursor.getDate()+n);else if(view==='week')cursor.setDate(cursor.getDate()+n*7);else cursor.setMonth(cursor.getMonth()+n);renderClasses();}
function periodBounds(){
 const d=new Date(cursor);let start=new Date(d),end=new Date(d);
 if(view==='day'){start.setHours(0,0,0,0);end.setHours(23,59,59,999);}
 if(view==='week'){const day=(d.getDay()+6)%7;start.setDate(d.getDate()-day);start.setHours(0,0,0,0);end=new Date(start);end.setDate(start.getDate()+7);}
 if(view==='month'){start=new Date(d.getFullYear(),d.getMonth(),1);end=new Date(d.getFullYear(),d.getMonth()+1,1);}
 return [start,end];
}
function classStatus(c){const now=Date.now();if(c.status==='cancelled')return 'cancelled';if(now<new Date(c.starts_at).getTime())return 'upcoming';if(now<=new Date(c.ends_at).getTime())return 'live';return 'completed';}
function renderClasses(){
 const list=document.getElementById('class-list');list.replaceChildren();
 const [start,end]=periodBounds();
 document.getElementById('class-period').textContent=fmt(start.toISOString())+' — '+fmt(new Date(end.getTime()-1).toISOString());
 const rows=classes.filter(c=>new Date(c.starts_at)>=start&&new Date(c.starts_at)<end).sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
 if(!rows.length){const p=document.createElement('div');p.className='class-empty';p.textContent=t('empty');list.append(p);return;}
 for(const c of rows){
  const card=document.createElement('article');card.className='class-card';
  const st=classStatus(c),roster=(c.roster||[]).map(x=>x.display_name).filter(Boolean);
  const when=document.createElement('div');when.className='class-card-time';when.textContent=fmt(c.starts_at);
  const main=document.createElement('div');main.className='class-card-main';
  const h=document.createElement('h3');h.textContent=c.title;const sub=document.createElement('p');sub.textContent=c.subject+' · '+fmt(c.ends_at);
  const people=document.createElement('p');people.className='class-card-people';people.textContent=roster.length?roster.join(', '):t('noRoster');
  main.append(h,sub,people);
  const meta=document.createElement('div');meta.className='class-card-meta';
  const badge=document.createElement('span');badge.className='class-state '+st;badge.textContent=t(st);meta.append(badge);
  if(c.is_demo){const demo=document.createElement('span');demo.className='class-demo-tag';demo.textContent='DEMO';meta.append(demo);}
  const action=document.createElement('button');action.type='button';action.className='btn class-open';action.textContent=t('details');action.addEventListener('click',()=>showDetail(c.id));meta.append(action);
  card.append(when,main,meta);list.append(card);
 }
}
async function loadStudents(){
 const {data,error}=await db.from('profiles').select('id,display_name,role').eq('role','student').order('display_name');
 if(error)throw error;students=data||[];
}
async function loadClasses(){
 const query=db.from('classes').select('id,title,subject,description,image_url,starts_at,ends_at,status,allow_unassigned,is_demo,created_by').order('starts_at',{ascending:true});
 const {data,error}=await query;if(error)throw error;
 const rows=data||[];
 if(rows.length){
  const ids=rows.map(x=>x.id);
  const {data:enrollments,error:e}=await db.from('class_enrollments').select('class_id,student_id,is_demo').in('class_id',ids);
  if(e)throw e;
  const profiles=students.length?students:((await db.from('profiles').select('id,display_name,role')).data||[]);
  const names=new Map(profiles.map(p=>[p.id,p.display_name]));
  for(const row of rows)row.roster=(enrollments||[]).filter(x=>x.class_id===row.id).map(x=>({id:x.student_id,display_name:names.get(x.student_id)||'Student'}));
 }
 classes=rows;renderClasses();
}
function openEditor(c=null){
 selected=c?.id||null;const form=document.getElementById('class-form');form.reset();
 document.getElementById('class-editor').classList.remove('hidden');
 document.getElementById('class-form-status').textContent='';
 document.getElementById('class-title').value=c?.title||'';
 document.getElementById('class-subject').value=c?.subject||'';
 document.getElementById('class-description').value=c?.description||'';
 document.getElementById('class-image').value=c?.image_url||'';
 const now=new Date();const start=c?.starts_at?fromISO(c.starts_at):fromISO(new Date(now.getTime()+3600000).toISOString());
 const end=c?.ends_at?fromISO(c.ends_at):fromISO(new Date(now.getTime()+7200000).toISOString());
 document.getElementById('class-start').value=start;document.getElementById('class-end').value=end;
 document.getElementById('class-open').checked=!!c?.allow_unassigned;
 document.getElementById('class-demo').checked=!!c?.is_demo&&isOwner;
 document.getElementById('class-demo').disabled=!isOwner;
 const assigned=new Set((c?.roster||[]).map(x=>x.id));const opts=document.getElementById('class-student-options');opts.replaceChildren();
 if(!students.length){opts.textContent=t('noStudents');}
 for(const student of students){const label=document.createElement('label');label.className='class-student-option';const box=document.createElement('input');box.type='checkbox';box.value=student.id;box.checked=assigned.has(student.id);const span=document.createElement('span');span.textContent=student.display_name||'Student';label.append(box,span);opts.append(label);}
 document.getElementById('class-repeat').checked=false;document.getElementById('class-repeat').disabled=!!c;
 document.getElementById('class-repeat-count').disabled=!!c;
 document.getElementById('class-save').textContent=c?t('save'):t('create');
 document.getElementById('class-editor').scrollIntoView({behavior:'smooth',block:'start'});
}
function closeEditor(){document.getElementById('class-editor').classList.add('hidden');selected=null;}
async function saveClass(event){
 event.preventDefault();const status=document.getElementById('class-form-status');status.textContent='';
 const title=document.getElementById('class-title').value.trim(),subject=document.getElementById('class-subject').value.trim();
 if(!title){status.textContent=t('noTitle');return;}
 let starts_at,ends_at;try{starts_at=toAthensISO(document.getElementById('class-start').value);ends_at=toAthensISO(document.getElementById('class-end').value);}catch{status.textContent=t('invalidTime');return;}
 if(new Date(ends_at)<=new Date(starts_at)){status.textContent=t('invalidTime');return;}
 const picked=[...document.querySelectorAll('#class-student-options input:checked')].map(x=>x.value);
 const allow=document.getElementById('class-open').checked;
 if(!picked.length&&!allow){status.textContent=t('studentsRequired');return;}
 const demo=isOwner&&document.getElementById('class-demo').checked;
 const base={title,subject,description:document.getElementById('class-description').value.trim(),image_url:document.getElementById('class-image').value.trim()||null,starts_at,ends_at,timezone:ZONE,allow_unassigned:allow,is_demo:demo,status:'scheduled',created_by:user.id};
 const button=document.getElementById('class-save');button.disabled=true;
 try{
  let savedRows=[];
  if(selected){
   const {data,error}=await db.from('classes').update({...base,created_by:undefined,updated_at:new Date().toISOString()}).eq('id',selected).select('id').single();
   if(error)throw error;savedRows=[data];
   const {error:delError}=await db.from('class_enrollments').delete().eq('class_id',selected);if(delError)throw delError;
  }else{
   const repeat=document.getElementById('class-repeat').checked?Math.max(2,Math.min(16,Number(document.getElementById('class-repeat-count').value)||4)):1;
   const records=Array.from({length:repeat},(_,i)=>({...base,starts_at:new Date(new Date(starts_at).getTime()+i*7*86400000).toISOString(),ends_at:new Date(new Date(ends_at).getTime()+i*7*86400000).toISOString()}));
   const {data,error}=await db.from('classes').insert(records).select('id');if(error)throw error;savedRows=data||[];
  }
  if(picked.length){
   const enrollments=savedRows.flatMap(r=>picked.map(student_id=>({class_id:r.id,student_id,assigned_by:user.id,is_demo:demo})));
   const {error}=await db.from('class_enrollments').insert(enrollments);if(error)throw error;
  }
  closeEditor();status.textContent=t('saved');await loadClasses();
 }catch(error){status.textContent=(error?.message||t('saveError'));status.classList.add('error');}
 finally{button.disabled=false;}
}
function showDetail(id){
 const c=classes.find(x=>x.id===id);if(!c)return;
 const detail=document.getElementById('class-detail');detail.classList.remove('hidden');detail.replaceChildren();
 const head=document.createElement('div');head.className='class-detail-head';
 const title=document.createElement('h3');title.textContent=c.title;
 const close=document.createElement('button');close.className='btn';close.type='button';close.textContent=t('close');close.onclick=()=>detail.classList.add('hidden');head.append(title,close);
 const desc=document.createElement('p');desc.textContent=c.description||c.subject;
 const info=document.createElement('p');info.textContent=fmt(c.starts_at)+' – '+fmt(c.ends_at)+' · '+c.subject;
 const roster=document.createElement('div');roster.className='class-detail-roster';const rosterTitle=document.createElement('strong');rosterTitle.textContent=t('roster');roster.append(rosterTitle);
 for(const person of c.roster||[]){const p=document.createElement('p');p.textContent=person.display_name;roster.append(p);}
 if(!c.roster?.length){const p=document.createElement('p');p.textContent=t('noRoster');roster.append(p);}
 detail.append(head,info,desc,roster);
 const state=classStatus(c);const join=document.createElement('button');join.type='button';join.className='btn btn-dark';join.textContent=t('join');join.disabled=state==='cancelled'||state==='completed';
 join.addEventListener('click',async()=>{
  join.disabled=true;
  const {data,error}=await db.rpc('join_echo_class',{target_class_id:c.id});
  const note=document.createElement('p');note.className='class-form-status';note.textContent=error?(error.message||t('notAssigned')):t('joined');if(error)note.classList.add('error');
  detail.append(note);join.disabled=false;
 });
 detail.append(join);
 if(professorMode()){
  const actions=document.createElement('div');actions.className='class-detail-actions';
  const edit=document.createElement('button');edit.className='btn';edit.type='button';edit.textContent=t('edit');edit.onclick=()=>openEditor(c);
  const del=document.createElement('button');del.className='btn class-danger';del.type='button';del.textContent=t('delete');del.onclick=async()=>{if(!confirm(t('confirmDelete')))return;const {error}=await db.from('classes').delete().eq('id',c.id);if(error){alert(error.message);return;}detail.classList.add('hidden');await loadClasses();};
  actions.append(edit,del);detail.append(actions);
 }
 detail.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function professorMode(){return isOwner||profile?.role==='professor';}
async function runChecks(){
 const area=document.getElementById('class-test-results');area.replaceChildren();
 const tests=[{name:t('authCheck'),run:async()=>!!(await db.auth.getSession()).data.session},{name:t('dbCheck'),run:async()=>{const r=await db.from('classes').select('id').limit(1);if(r.error)throw r.error;return true;}},{name:t('roleCheck'),run:async()=>{const r=await db.rpc('is_echo_owner');if(r.error)throw r.error;if(!r.data)throw new Error('Owner permission check returned false');return true;}}];
 for(const test of tests){const row=document.createElement('div');row.className='class-test-row';const name=document.createElement('span');name.textContent=test.name;const result=document.createElement('strong');result.textContent=t('notTested');result.className='not-tested';row.append(name,result);area.append(row);
  try{const ok=await test.run();result.textContent=t(ok?'passed':'failed');result.className=ok?'passed':'failed';}
  catch(e){result.textContent=t('failed')+' · '+(e.message||'Error');result.className='failed';}
 }
}
function applyLanguage(){
 tab.textContent=t('tab');testTab.textContent=t('testTab');
 panel.querySelector('.panel-heading h2').textContent=t('title');panel.querySelector('.panel-heading p').textContent=t('intro');
 document.getElementById('class-new').textContent=t('create');
 document.querySelectorAll('[data-view]').forEach(b=>b.textContent=t(b.dataset.view));
 document.getElementById('class-run-checks').textContent=t('runChecks');
}
async function boot(session){
 user=session.user;isOwner=(user.email||'').toLowerCase()===OWNER_EMAIL;
 const {data,error}=await db.from('profiles').select('id,display_name,role').eq('id',user.id).maybeSingle();
 profile=data||{id:user.id,role:'student'};
 tab.classList.toggle('hidden',!user);testTab.classList.toggle('hidden',!isOwner);
 document.getElementById('class-new').classList.toggle('hidden',!professorMode());
 if(professorMode())await loadStudents();else students=[];
 await loadClasses().catch(e=>{document.getElementById('class-status').textContent=e.message||t('loadError');document.getElementById('class-status').classList.add('error');});
}
async function start(){
 try{
  const cfg=await fetch('/config',{cache:'no-store'}).then(r=>r.json());
  db=createClient(cfg.supabaseUrl,cfg.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  const {data}=await db.auth.getSession();if(data.session)await boot(data.session);
  db.auth.onAuthStateChange((_event,session)=>{if(session)void boot(session);else{user=null;profile=null;classes=[];renderClasses();}});
 }catch(e){document.getElementById('class-status').textContent=e.message||t('loadError');}
}
window.addEventListener('storage',e=>{if(e.key==='echo-language')applyLanguage();});
document.getElementById('app-language')?.addEventListener('click',()=>setTimeout(applyLanguage,0));
document.getElementById('login-language')?.addEventListener('click',()=>setTimeout(applyLanguage,0));
start();
