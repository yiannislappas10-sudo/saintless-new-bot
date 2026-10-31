import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const classroomStyle = document.createElement('link');
classroomStyle.rel = 'stylesheet';
classroomStyle.href = '/classroom.css';
document.head.append(classroomStyle);

const OWNER_EMAIL = 'yiannislappas8@gmail.com';
const ZONE = 'Europe/Athens';
const lang = () => localStorage.getItem('echo-language') === 'el' ? 'el' : 'en';
const words = {
  en:{
    tab:'Classes',title:'Class management',intro:'Create lessons, assign students and manage your teaching timetable.',startClass:'Start class',endClass:'End class',waitingProfessor:'Waiting for professor',prejoinTitle:'Prepare to join',joinNow:'Enter classroom',leave:'Leave classroom',microphone:'Microphone',camera:'Camera',speakerTest:'Test speakers',cameraUnavailable:'Camera unavailable — joining with audio only.',mediaDenied:'Microphone or camera permission was denied.',mediaReady:'Your devices are ready.',mediaConnecting:'Connecting to classroom…',mediaConnected:'Connected to live classroom.',mediaDisconnected:'Connection lost. Check your network.',mediaEnded:'The professor ended this class.',joined:'Joined',notJoined:'Not joined',mute:'Mute',unmute:'Unmute',cameraOff:'Camera off',cameraOn:'Camera on',materials:'Learning materials',
    create:'Create a class',edit:'Edit class',name:'Class name',subject:'Subject',description:'Description',
    image:'Image URL (optional)',start:'Starts',end:'Ends',students:'Assign students',save:'Save class',
    cancel:'Cancel',delete:'Delete class',cancelClass:'Cancel class',confirmCancel:'Cancel this class?',confirmDelete:'Delete this class and its assignments?',
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
    demoMode:'Demo classes are visible only to the Primary Owner.',demoStudents:'Demo participants (one name per line)',allowUnassigned:'Allow students not assigned to this class',noMaterials:'No learning materials added yet.',materialTitle:'Material title',materialURL:'Secure link (https://)',addMaterial:'Add material',attendance:'Attendance',noAttendance:'No attendance recorded yet.',
    testTab:'Testing Center',testTitle:'Platform checks',testIntro:'Checks report actual service responses. No test will change real classes.',
    authCheck:'Authentication session',dbCheck:'Class database access',roleCheck:'Owner permissions',demoCrudCheck:'Isolated demo create, read, update and delete',mediaCheck:'Camera and microphone permissions',
    runChecks:'Run checks',passed:'Passed',failed:'Failed',notTested:'Not tested',
    migration:'Classroom database migration is required before classes can be used.',
    liveUnavailable:'Live audio/video is not configured yet. The class schedule and attendance are separate and remain available.',
    rosterError:'Could not update the student list. Review the class and try again.'
  },
  el:{
    tab:'Μαθήματα',title:'Διαχείριση μαθημάτων',intro:'Δημιουργήστε μαθήματα, αναθέστε μαθητές και διαχειριστείτε το πρόγραμμά σας.',startClass:'Έναρξη μαθήματος',endClass:'Τερματισμός μαθήματος',waitingProfessor:'Αναμονή καθηγητή',prejoinTitle:'Προετοιμασία συμμετοχής',joinNow:'Είσοδος στην τάξη',leave:'Αποχώρηση από την τάξη',microphone:'Μικρόφωνο',camera:'Κάμερα',speakerTest:'Έλεγχος ηχείων',cameraUnavailable:'Η κάμερα δεν είναι διαθέσιμη — συμμετοχή μόνο με ήχο.',mediaDenied:'Δεν δόθηκε άδεια για μικρόφωνο ή κάμερα.',mediaReady:'Οι συσκευές είναι έτοιμες.',mediaConnecting:'Σύνδεση με την τάξη…',mediaConnected:'Συνδεθήκατε στη ζωντανή τάξη.',mediaDisconnected:'Η σύνδεση χάθηκε. Ελέγξτε το δίκτυό σας.',mediaEnded:'Ο καθηγητής τερμάτισε το μάθημα.',joined:'Συνδέθηκε',notJoined:'Δεν συνδέθηκε',mute:'Σίγαση',unmute:'Ενεργοποίηση μικροφώνου',cameraOff:'Κάμερα κλειστή',cameraOn:'Κάμερα ανοιχτή',materials:'Εκπαιδευτικό υλικό',
    create:'Δημιουργία μαθήματος',edit:'Επεξεργασία μαθήματος',name:'Όνομα μαθήματος',subject:'Αντικείμενο',description:'Περιγραφή',
    image:'Σύνδεσμος εικόνας (προαιρετικό)',start:'Έναρξη',end:'Λήξη',students:'Ανάθεση μαθητών',save:'Αποθήκευση',
    cancel:'Ακύρωση',delete:'Διαγραφή μαθήματος',cancelClass:'Ακύρωση μαθήματος',confirmCancel:'Να ακυρωθεί αυτό το μάθημα;',confirmDelete:'Να διαγραφεί αυτό το μάθημα και οι αναθέσεις του;',
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
    demoMode:'Οι δοκιμαστικές τάξεις είναι ορατές μόνο στον Κύριο Ιδιοκτήτη.',demoStudents:'Δοκιμαστικοί συμμετέχοντες (ένα όνομα ανά γραμμή)',allowUnassigned:'Επιτρέπονται μαθητές χωρίς ανάθεση',noMaterials:'Δεν έχουν προστεθεί εκπαιδευτικά αρχεία.',materialTitle:'Τίτλος υλικού',materialURL:'Ασφαλής σύνδεσμος (https://)',addMaterial:'Προσθήκη υλικού',attendance:'Παρουσίες',noAttendance:'Δεν υπάρχουν καταχωρημένες παρουσίες.',
    testTab:'Κέντρο δοκιμών',testTitle:'Έλεγχοι πλατφόρμας',testIntro:'Οι έλεγχοι βασίζονται σε πραγματικές απαντήσεις υπηρεσιών.',
    authCheck:'Συνεδρία σύνδεσης',dbCheck:'Πρόσβαση στη βάση μαθημάτων',roleCheck:'Δικαιώματα ιδιοκτήτη',demoCrudCheck:'Δημιουργία, ανάγνωση, επεξεργασία και διαγραφή demo',mediaCheck:'Άδειες κάμερας και μικροφώνου',
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
nav.querySelector('[data-tab="schedule"]')?.remove();
nav.querySelector('[data-tab="join"]')?.remove();
document.getElementById('panel-schedule')?.remove();
document.getElementById('panel-join')?.remove();
const tab=document.createElement('button');tab.className='tab';tab.type='button';tab.dataset.tab='classes';tab.textContent=t('tab');nav.insertBefore(tab,nav.children[1]||null);
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
  <div class="class-student-picker" id="class-real-student-picker"><strong>${t('students')}</strong><div id="class-student-options"></div></div>
  <div class="class-demo-picker hidden" id="class-demo-picker"><label>${t('demoStudents')}<textarea id="class-demo-names" rows="3" maxlength="1200" placeholder="Demo Student 1&#10;Demo Student 2"></textarea></label></div>
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
const roomOverlay=document.createElement('div');
roomOverlay.className='class-room-overlay hidden';
roomOverlay.id='class-room-overlay';
roomOverlay.innerHTML=`
 <section class="class-room-shell" role="dialog" aria-modal="true" aria-labelledby="class-room-title">
  <header class="class-room-header"><div><p class="class-room-eyebrow">ECHO · LIVE CLASSROOM</p><h2 id="class-room-title"></h2><p id="class-room-status" role="status"></p></div><button type="button" class="btn" id="class-room-close">${t('cancel')}</button></header>
  <div class="class-room-prejoin" id="class-room-prejoin">
   <div class="class-room-preview"><video id="class-preview-video" autoplay playsinline muted></video><div id="class-preview-placeholder"></div></div>
   <div class="class-room-controls"><button type="button" class="btn" id="class-mic-toggle">${t('microphone')}</button><button type="button" class="btn" id="class-camera-toggle">${t('camera')}</button><button type="button" class="btn" id="class-speaker-test">${t('speakerTest')}</button><button type="button" class="btn btn-dark" id="class-room-enter">${t('joinNow')}</button></div>
  </div>
  <div class="class-room-stage hidden" id="class-room-stage">
   <div class="class-room-videos" id="class-room-videos"></div>
   <aside class="class-room-roster"><strong>${t('roster')}</strong><div id="class-room-roster-list"></div></aside>
  </div>
  <footer class="class-room-footer hidden" id="class-room-footer"><span id="class-room-connection"></span><button type="button" class="btn btn-dark" id="class-room-leave">${t('leave')}</button></footer>
 </section>`;
document.body.append(roomOverlay);
let activeRoom=null,callJoinPending=false,roomAudioContext=null;
function activate(name){document.querySelectorAll('.nav-tabs [data-tab]').forEach(b=>{const on=b.dataset.tab===name;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on));});document.querySelectorAll('#app-shell .panel').forEach(p=>p.classList.toggle('active',p.id==='panel-'+name));}
nav.addEventListener('click',e=>{const b=e.target.closest('[data-tab="classes"],[data-tab="testing"]');if(b)activate(b.dataset.tab);});
document.getElementById('class-new').addEventListener('click',()=>openEditor());
document.getElementById('class-cancel').addEventListener('click',closeEditor);
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===b));renderClasses();}));
document.getElementById('class-prev').addEventListener('click',()=>moveCursor(-1));
document.getElementById('class-next').addEventListener('click',()=>moveCursor(1));
document.getElementById('class-form').addEventListener('submit',saveClass);
document.getElementById('class-demo').addEventListener('change',toggleDemoEditor);
document.getElementById('class-run-checks').addEventListener('click',runChecks);
document.getElementById('class-room-close').addEventListener('click',()=>{if(activeRoom)void leaveRoom();else closePrejoin();});
document.getElementById('class-room-enter').addEventListener('click',()=>{void enterRoom();});
document.getElementById('class-room-leave').addEventListener('click',()=>{void leaveRoom();});
document.getElementById('class-mic-toggle').addEventListener('click',toggleRoomMic);
document.getElementById('class-camera-toggle').addEventListener('click',toggleRoomCamera);
document.getElementById('class-speaker-test').addEventListener('click',testRoomSpeaker);
function toggleDemoEditor(){
 const demo=isOwner&&document.getElementById('class-demo').checked;
 document.getElementById('class-real-student-picker').classList.toggle('hidden',demo);
 document.getElementById('class-demo-picker').classList.toggle('hidden',!demo);
}
function moveCursor(n){cursor=new Date(cursor);if(view==='day')cursor.setDate(cursor.getDate()+n);else if(view==='week')cursor.setDate(cursor.getDate()+n*7);else cursor.setMonth(cursor.getMonth()+n);renderClasses();}
function periodBounds(){
 const d=new Date(cursor);let start=new Date(d),end=new Date(d);
 if(view==='day'){start.setHours(0,0,0,0);end.setHours(23,59,59,999);}
 if(view==='week'){const day=(d.getDay()+6)%7;start.setDate(d.getDate()-day);start.setHours(0,0,0,0);end=new Date(start);end.setDate(start.getDate()+7);}
 if(view==='month'){start=new Date(d.getFullYear(),d.getMonth(),1);end=new Date(d.getFullYear(),d.getMonth()+1,1);}
 return [start,end];
}
function classStatus(c){if(c.status==='cancelled')return 'cancelled';if(c.liveRoom?.status==='live')return 'live';if(Date.now()>new Date(c.ends_at).getTime())return 'completed';return 'upcoming';}
function dateKey(value){
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(value));
 const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));return p.year+'-'+p.month+'-'+p.day;
}
function makeClassCard(c){
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
 const action=document.createElement('button');action.type='button';action.className='btn class-open';action.textContent=t('details');action.addEventListener('click',()=>{void showDetail(c.id);});meta.append(action);
 card.append(when,main,meta);return card;
}
function makeCalendarEvent(c){
 const event=document.createElement('button');event.type='button';
 event.className='class-calendar-event '+classStatus(c);
 const time=new Intl.DateTimeFormat(lang()==='el'?'el-GR':'en-GB',{timeZone:ZONE,hour:'2-digit',minute:'2-digit'}).format(new Date(c.starts_at));
 event.textContent=time+' · '+c.title;event.title=c.title+' · '+fmt(c.starts_at);
 event.addEventListener('click',()=>{void showDetail(c.id);});return event;
}
function renderClasses(){
 const list=document.getElementById('class-list');list.replaceChildren();
 const [start,end]=periodBounds();
 document.getElementById('class-period').textContent=fmt(start.toISOString())+' — '+fmt(new Date(end.getTime()-1).toISOString());
 const rows=classes.filter(c=>new Date(c.starts_at)>=start&&new Date(c.starts_at)<end).sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
 if(view==='day'){
  if(!rows.length){const p=document.createElement('div');p.className='class-empty';p.textContent=t('empty');list.append(p);return;}
  for(const c of rows)list.append(makeClassCard(c));
  return;
 }
 const grid=document.createElement('div');grid.className=view==='week'?'class-week-grid':'class-month-grid';
 const headings=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
 for(let i=0;i<7;i++){const h=document.createElement('div');h.className='class-calendar-weekday';h.textContent=lang()==='el'?['Δευ','Τρί','Τετ','Πέμ','Παρ','Σάβ','Κυρ'][i]:headings[i];grid.append(h);}
 if(view==='week'){
  for(let i=0;i<7;i++){
   const day=new Date(start);day.setDate(start.getDate()+i);day.setHours(12,0,0,0);
   const cell=document.createElement('section');cell.className='class-calendar-cell';
   const head=document.createElement('div');head.className='class-calendar-day-title';head.textContent=new Intl.DateTimeFormat(lang()==='el'?'el-GR':'en-GB',{timeZone:ZONE,weekday:'short',day:'numeric',month:'short'}).format(day);cell.append(head);
   const key=dateKey(day);const dayRows=rows.filter(x=>dateKey(x.starts_at)===key);
   if(!dayRows.length){const empty=document.createElement('span');empty.className='class-calendar-none';empty.textContent='—';cell.append(empty);}
   else for(const item of dayRows)cell.append(makeCalendarEvent(item));
   grid.append(cell);
  }
 }else{
  const year=start.getFullYear(),month=start.getMonth(),days=new Date(year,month+1,0).getDate(),offset=(new Date(year,month,1).getDay()+6)%7;
  for(let i=0;i<offset;i++){const blank=document.createElement('div');blank.className='class-calendar-cell blank';grid.append(blank);}
  for(let dayNo=1;dayNo<=days;dayNo++){
   const day=new Date(year,month,dayNo,12);const cell=document.createElement('section');cell.className='class-calendar-cell';
   const head=document.createElement('div');head.className='class-calendar-day-title';head.textContent=String(dayNo);cell.append(head);
   for(const item of rows.filter(x=>dateKey(x.starts_at)===dateKey(day)))cell.append(makeCalendarEvent(item));
   grid.append(cell);
  }
 }
 list.append(grid);
}
async function loadStudents(){
 const {data,error}=await db.from('profiles').select('id,display_name,role').eq('role','student').order('display_name');
 if(error)throw error;students=data||[];
}
async function loadClasses(){
 const query=db.from('classes').select('id,title,subject,description,image_url,starts_at,ends_at,status,allow_unassigned,is_demo,created_by').order('starts_at',{ascending:true});
 const {data,error}=await query;if(error)throw error;
 const rows=data||[], ids=rows.map(x=>x.id);
 for(const row of rows){row.roster=[];row.liveRoom=null;}
 if(ids.length){
  const {data:liveRows,error:liveError}=await db.from('class_live_rooms').select('class_id,status,started_at').in('class_id',ids).eq('status','live');
  if(liveError)throw liveError;
  const liveMap=new Map((liveRows||[]).map(x=>[x.class_id,x]));
  for(const row of rows)row.liveRoom=liveMap.get(row.id)||null;
  const {data:rosters,error:rosterError}=await db.rpc('get_echo_class_rosters',{target_class_ids:ids});
  if(rosterError)throw rosterError;
  for(const person of rosters||[]){
   const row=rows.find(x=>x.id===person.class_id);
   if(row)row.roster.push({id:person.student_id,display_name:person.display_name||'Student'});
  }
  if(isOwner){
   const {data:demoRows,error:demoError}=await db.rpc('get_echo_demo_rosters',{target_class_ids:ids});
   if(demoError)throw demoError;
   for(const person of demoRows||[]){
    const row=rows.find(x=>x.id===person.class_id);
    if(row)row.roster.push({id:null,display_name:person.display_name});
   }
  }
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
 document.getElementById('class-demo-names').value=(c?.is_demo?(c.roster||[]).map(x=>x.display_name).join('\n'):'');
 toggleDemoEditor();
 const assigned=new Set((c?.roster||[]).map(x=>x.id).filter(Boolean));const opts=document.getElementById('class-student-options');opts.replaceChildren();
 if(!students.length){opts.textContent=t('noStudents');}
 for(const student of students){const label=document.createElement('label');label.className='class-student-option';const box=document.createElement('input');box.type='checkbox';box.value=student.id;box.checked=assigned.has(student.id);const span=document.createElement('span');span.textContent=student.display_name||'Student';label.append(box,span);opts.append(label);}
 document.getElementById('class-repeat').checked=false;document.getElementById('class-repeat').disabled=!!c;
 document.getElementById('class-repeat-count').disabled=!!c;
 document.getElementById('class-save').textContent=c?t('save'):t('create');
 document.getElementById('class-editor').scrollIntoView({behavior:'smooth',block:'start'});
}
function closeEditor(){document.getElementById('class-editor').classList.add('hidden');selected=null;}
function addWeeksLocal(value,weeks){
 const [date,time]=value.split('T'),[y,m,d]=date.split('-').map(Number);
 const next=new Date(Date.UTC(y,m-1,d+weeks*7));
 return next.toISOString().slice(0,10)+'T'+time;
}
async function saveClass(event){
 event.preventDefault();const status=document.getElementById('class-form-status');status.textContent='';
 const title=document.getElementById('class-title').value.trim(),subject=document.getElementById('class-subject').value.trim();
 if(!title){status.textContent=t('noTitle');return;}
 let starts_at,ends_at;try{starts_at=toAthensISO(document.getElementById('class-start').value);ends_at=toAthensISO(document.getElementById('class-end').value);}catch{status.textContent=t('invalidTime');return;}
 if(new Date(ends_at)<=new Date(starts_at)){status.textContent=t('invalidTime');return;}
 const demo=isOwner&&document.getElementById('class-demo').checked;
 const picked=demo?[]:[...document.querySelectorAll('#class-student-options input:checked')].map(x=>x.value);
 const demoNames=demo?[...new Set(document.getElementById('class-demo-names').value.split('\n').map(x=>x.trim()).filter(Boolean))]:[];
 const allow=document.getElementById('class-open').checked;
 if((demo?!demoNames.length:!picked.length)&&!allow){status.textContent=t('studentsRequired');return;}
 const base={title,subject,description:document.getElementById('class-description').value.trim(),image_url:document.getElementById('class-image').value.trim()||null,starts_at,ends_at,timezone:ZONE,allow_unassigned:allow,is_demo:demo,status:'scheduled',created_by:user.id};
 const button=document.getElementById('class-save');button.disabled=true;
 try{
  let savedRows=[];
  if(selected){
   const {data,error}=await db.from('classes').update({...base,created_by:undefined,updated_at:new Date().toISOString()}).eq('id',selected).select('id').single();
   if(error)throw error;savedRows=[data];
   const {error:delError}=await db.from('class_enrollments').delete().eq('class_id',selected);if(delError)throw delError;
   const {error:demoDelError}=await db.from('class_demo_participants').delete().eq('class_id',selected);if(demoDelError)throw demoDelError;
  }else{
   const repeat=document.getElementById('class-repeat').checked?Math.max(2,Math.min(16,Number(document.getElementById('class-repeat-count').value)||4)):1;
   const records=Array.from({length:repeat},(_,i)=>({...base,starts_at:toAthensISO(addWeeksLocal(document.getElementById('class-start').value,i)),ends_at:toAthensISO(addWeeksLocal(document.getElementById('class-end').value,i))}));
   const {data,error}=await db.from('classes').insert(records).select('id');if(error)throw error;savedRows=data||[];
  }
  if(demo&&demoNames.length){
   const demoRows=savedRows.flatMap(r=>demoNames.map(display_name=>({class_id:r.id,display_name})));
   const {error}=await db.from('class_demo_participants').insert(demoRows);if(error)throw error;
  }else if(picked.length){
   const enrollments=savedRows.flatMap(r=>picked.map(student_id=>({class_id:r.id,student_id,assigned_by:user.id,is_demo:false})));
   const {error}=await db.from('class_enrollments').insert(enrollments);if(error)throw error;
  }
  closeEditor();status.textContent=t('saved');await loadClasses();
 }catch(error){status.textContent=(error?.message||t('saveError'));status.classList.add('error');}
 finally{button.disabled=false;}
}

async function callApi(path,payload){
 const {data:{session},error}=await db.auth.getSession();
 if(error||!session?.access_token)throw new Error(t('mediaDenied'));
 const response=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+session.access_token},body:JSON.stringify(payload),cache:'no-store'});
 let data={};try{data=await response.json();}catch{}
 if(!response.ok)throw new Error(data.error||('Classroom service returned '+response.status));
 return data;
}
function waitForIceGathering(pc,timeout=8000){
 if(pc.iceGatheringState==='complete')return Promise.resolve();
 return new Promise(resolve=>{
  let done=false;const finish=()=>{if(done)return;done=true;pc.removeEventListener('icegatheringstatechange',check);clearTimeout(timer);resolve();};
  const check=()=>{if(pc.iceGatheringState==='complete')finish();};const timer=setTimeout(finish,timeout);
  pc.addEventListener('icegatheringstatechange',check);
 });
}
function setRoomStatus(message,error=false){
 const node=document.getElementById('class-room-status');if(node){node.textContent=message;node.classList.toggle('error',!!error);}
}
function closePrejoin(){
 if(activeRoom?.inClass)return;
 if(activeRoom?.previewStream)activeRoom.previewStream.getTracks().forEach(track=>track.stop());
 activeRoom=null;callJoinPending=false;roomOverlay.classList.add('hidden');
}
async function openPrejoin(classId){
 if(activeRoom||callJoinPending)return;
 const c=classes.find(item=>item.id===classId);if(!c||c.is_demo)return;
 callJoinPending=true;
 const room={classId,klass:c,previewStream:null,publisher:null,subscriptions:new Map(),poller:null,attendanceId:null,sessionId:null,inClass:false,syncing:false};
 activeRoom=room;
 document.getElementById('class-room-title').textContent=c.title;
 document.getElementById('class-room-prejoin').classList.remove('hidden');
 document.getElementById('class-room-stage').classList.add('hidden');
 document.getElementById('class-room-footer').classList.add('hidden');
 document.getElementById('class-room-enter').disabled=true;
 roomOverlay.classList.remove('hidden');setRoomStatus(t('mediaConnecting'));
 try{
  const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
  let cameraAvailable=false;
  try{
   const camera=await navigator.mediaDevices.getUserMedia({audio:false,video:{width:{ideal:1280},height:{ideal:720},facingMode:'user'}});
   const cameraTrack=camera.getVideoTracks()[0];
   if(cameraTrack){stream.addTrack(cameraTrack);cameraAvailable=true;}
  }catch(_){}
  if(activeRoom!==room){stream.getTracks().forEach(track=>track.stop());return;}
  room.previewStream=stream;
  const video=document.getElementById('class-preview-video'),hasVideo=cameraAvailable&&stream.getVideoTracks().length>0;
  video.srcObject=stream;video.classList.toggle('hidden',!hasVideo);
  document.getElementById('class-preview-placeholder').textContent=hasVideo?'':t('cameraUnavailable');
  document.getElementById('class-mic-toggle').textContent=t('mute');
  document.getElementById('class-camera-toggle').textContent=hasVideo?t('cameraOff'):t('camera');
  document.getElementById('class-camera-toggle').disabled=!hasVideo;
  setRoomStatus(hasVideo?t('mediaReady'):t('cameraUnavailable'));
  document.getElementById('class-room-enter').disabled=false;
 }catch(error){
  setRoomStatus(error?.name==='NotAllowedError'?t('mediaDenied'):(error?.message||t('mediaDenied')),true);
  document.getElementById('class-room-enter').disabled=true;
  document.getElementById('class-preview-placeholder').textContent=error?.message||t('mediaDenied');
 }finally{callJoinPending=false;}
}
function toggleRoomMic(){
 const track=activeRoom?.previewStream?.getAudioTracks()[0];if(!track)return;
 track.enabled=!track.enabled;document.getElementById('class-mic-toggle').textContent=track.enabled?t('mute'):t('unmute');
}
function toggleRoomCamera(){
 const track=activeRoom?.previewStream?.getVideoTracks()[0];if(!track)return;
 track.enabled=!track.enabled;document.getElementById('class-camera-toggle').textContent=track.enabled?t('cameraOff'):t('cameraOn');
}
async function testRoomSpeaker(){
 try{
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  if(!AudioContextClass)throw new Error('Audio output testing is not supported in this browser.');
  if(!roomAudioContext)roomAudioContext=new AudioContextClass();await roomAudioContext.resume();
  const oscillator=roomAudioContext.createOscillator(),gain=roomAudioContext.createGain();
  oscillator.frequency.value=660;gain.gain.value=0.12;oscillator.connect(gain);gain.connect(roomAudioContext.destination);
  oscillator.start();oscillator.stop(roomAudioContext.currentTime+0.65);setRoomStatus(t('speakerTest')+' · '+t('mediaReady'));
 }catch(error){setRoomStatus(error.message||t('callError'),true);}
}
function addRoomTile(userId,name,local=false){
 const grid=document.getElementById('class-room-videos');
 let tile=local?document.getElementById('class-room-local-tile'):[...grid.querySelectorAll('.class-room-tile')].find(x=>x.dataset.roomUser===userId);
 if(tile)return tile;
 tile=document.createElement('article');tile.className='class-room-tile';
 if(local)tile.id='class-room-local-tile';else tile.dataset.roomUser=userId;
 const video=document.createElement('video');video.autoplay=true;video.playsInline=true;video.muted=!!local;
 const label=document.createElement('div');label.className='class-room-tile-label';label.textContent=name;
 tile.append(video,label);grid.append(tile);return tile;
}
function renderRoomRoster(room,participants){
 const area=document.getElementById('class-room-roster-list');area.replaceChildren();
 const active=new Map(participants.filter(p=>p.status==='active').map(p=>[p.user_id,p]));
 const assigned=(room.klass.roster||[]).filter(p=>p.id);const seen=new Set();
 for(const person of assigned){
  const row=document.createElement('div');row.className='class-room-person';
  const name=document.createElement('span');name.textContent=person.display_name;
  const state=document.createElement('small');state.textContent=active.has(person.id)?t('joined'):t('notJoined');
  row.append(name,state);area.append(row);seen.add(person.id);
 }
 for(const person of participants.filter(p=>p.status==='active'&&!seen.has(p.user_id))){
  const row=document.createElement('div');row.className='class-room-person';
  const name=document.createElement('span');name.textContent=person.display_name;
  const state=document.createElement('small');state.textContent=t('joined');row.append(name,state);area.append(row);
 }
}
async function subscribeToParticipant(room,person){
 if(room.subscriptions.has(person.user_id)||person.status!=='active')return;
 const data=await callApi('/api/classroom/subscribe',{classId:room.classId,publisherId:person.user_id});
 const pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.cloudflare.com:3478'}]});
 const tile=addRoomTile(person.user_id,person.display_name||'Participant'),video=tile.querySelector('video'),stream=new MediaStream();
 pc.ontrack=event=>{
  const tracks=event.streams?.[0]?.getTracks()||[event.track];
  for(const track of tracks)if(!stream.getTracks().some(x=>x.id===track.id))stream.addTrack(track);
  video.srcObject=stream;void video.play().catch(()=>{});
 };
 pc.onconnectionstatechange=()=>{if(pc.connectionState==='failed')setRoomStatus(t('mediaDisconnected'),true);};
 try{
  await pc.setRemoteDescription(new RTCSessionDescription(data.sessionDescription));
  const answer=await pc.createAnswer();await pc.setLocalDescription(answer);await waitForIceGathering(pc);
  await callApi('/api/classroom/renegotiate',{classId:room.classId,sessionId:data.sessionId,sessionDescription:pc.localDescription});
  room.subscriptions.set(person.user_id,{pc,sessionId:data.sessionId,tile});
 }catch(error){pc.close();tile.remove();throw error;}
}
async function syncClassroom(room){
 if(activeRoom!==room||room.syncing)return;room.syncing=true;
 try{
  const {data:live,error:liveError}=await db.from('class_live_rooms').select('status').eq('class_id',room.classId).eq('status','live').limit(1);
  if(liveError)throw liveError;if(!live?.length){setRoomStatus(t('mediaEnded'));await leaveRoom({automatic:true});return;}
  const {data:participants,error}=await db.from('class_room_participants').select('user_id,display_name,session_id,status').eq('class_id',room.classId);
  if(error)throw error;
  const active=(participants||[]).filter(p=>p.status==='active'&&p.user_id!==user.id);
  renderRoomRoster(room,participants||[]);
  for(const person of active)if(!room.subscriptions.has(person.user_id)){
   try{await subscribeToParticipant(room,person);}catch(e){setRoomStatus(e.message||t('mediaConnecting'),true);}
  }
  const ids=new Set(active.map(p=>p.user_id));
  for(const [id,sub] of room.subscriptions)if(!ids.has(id)){sub.pc.close();sub.tile.remove();room.subscriptions.delete(id);}
 }catch(error){if(activeRoom===room)setRoomStatus(error.message||t('mediaDisconnected'),true);}
 finally{room.syncing=false;}
}
async function enterRoom(){
 const room=activeRoom;if(!room||!room.previewStream||room.inClass)return;
 const button=document.getElementById('class-room-enter');button.disabled=true;setRoomStatus(t('mediaConnecting'));
 try{
  const session=await callApi('/api/classroom/session',{classId:room.classId});
  room.sessionId=session.sessionId;room.attendanceId=session.attendanceId;
  const pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.cloudflare.com:3478'}]});room.publisher=pc;
  const transceivers=room.previewStream.getTracks().map(track=>({track,transceiver:pc.addTransceiver(track,{direction:'sendonly'})}));
  const offer=await pc.createOffer();await pc.setLocalDescription(offer);await waitForIceGathering(pc);
  const tracks=transceivers.map(item=>({location:'local',mid:item.transceiver.mid,trackName:item.track.kind}));
  if(tracks.some(item=>!item.mid))throw new Error('The browser did not assign a media track identifier.');
  const published=await callApi('/api/classroom/publish',{classId:room.classId,sessionId:room.sessionId,sessionDescription:pc.localDescription,tracks});
  if(published.sessionDescription?.type!=='answer')throw new Error('The media service did not finish publishing negotiation.');
  await pc.setRemoteDescription(new RTCSessionDescription(published.sessionDescription));
  room.inClass=true;
  document.getElementById('class-room-prejoin').classList.add('hidden');
  document.getElementById('class-room-stage').classList.remove('hidden');
  document.getElementById('class-room-footer').classList.remove('hidden');
  const localTile=addRoomTile(user.id,session.displayName||profile?.display_name||'You',true),localVideo=localTile.querySelector('video');
  localVideo.srcObject=room.previewStream;void localVideo.play().catch(()=>{});
  const until=Date.now()+16000;while(Date.now()<until&&pc.connectionState!=='connected'&&pc.connectionState!=='failed')await new Promise(resolve=>setTimeout(resolve,300));
  if(pc.connectionState==='failed')throw new Error(t('mediaDisconnected'));
  setRoomStatus(pc.connectionState==='connected'?t('mediaConnected'):t('mediaConnecting'));
  document.getElementById('class-room-connection').textContent=pc.connectionState==='connected'?t('mediaConnected'):t('mediaConnecting');
  room.poller=setInterval(()=>{void syncClassroom(room);},2500);await syncClassroom(room);
 }catch(error){
  setRoomStatus(error.message||t('callError'),true);
  if(room.sessionId)try{await callApi('/api/classroom/leave',{classId:room.classId,sessionId:room.sessionId,attendanceId:room.attendanceId});}catch{}
  if(room.publisher){room.publisher.close();room.publisher=null;}
  if(room.poller)clearInterval(room.poller);
  room.previewStream?.getTracks().forEach(track=>track.stop());room.previewStream=null;
  room.sessionId=null;room.attendanceId=null;room.inClass=false;
  document.getElementById('class-preview-video').srcObject=null;
  document.getElementById('class-room-videos').replaceChildren();
  document.getElementById('class-room-enter').disabled=true;
 }finally{if(activeRoom===room&&!room.inClass)button.disabled=true;}
}
async function leaveRoom({automatic=false}={}){
 const room=activeRoom;if(!room)return;activeRoom=null;callJoinPending=false;
 if(room.poller)clearInterval(room.poller);
 if(room.publisher){room.publisher.close();room.publisher=null;}
 for(const sub of room.subscriptions.values())sub.pc.close();room.subscriptions.clear();
 room.previewStream?.getTracks().forEach(track=>track.stop());
 if(room.sessionId)try{await callApi('/api/classroom/leave',{classId:room.classId,sessionId:room.sessionId,attendanceId:room.attendanceId});}catch(error){setRoomStatus(error.message||t('mediaDisconnected'),true);}
 document.getElementById('class-preview-video').srcObject=null;document.getElementById('class-room-videos').replaceChildren();
 roomOverlay.classList.add('hidden');if(!automatic)setRoomStatus(t('leave'));
 await loadClasses().catch(()=>{});
}

async function showDetail(id){
 const c=classes.find(x=>x.id===id);if(!c)return;
 const detail=document.getElementById('class-detail');detail.classList.remove('hidden');detail.replaceChildren();
 const head=document.createElement('div');head.className='class-detail-head';
 const title=document.createElement('h3');title.textContent=c.title;
 const close=document.createElement('button');close.className='btn';close.type='button';close.textContent=t('close');close.onclick=()=>detail.classList.add('hidden');head.append(title,close);
 if(c.image_url){
  try{const imageURL=new URL(c.image_url);if(imageURL.protocol==='https:'){const img=document.createElement('img');img.className='class-detail-image';img.src=imageURL.href;img.alt=c.title;img.loading='lazy';img.referrerPolicy='no-referrer';detail.append(img);}}catch{}
 }
 const desc=document.createElement('p');desc.textContent=c.description||c.subject;
 const state=classStatus(c),stateLine=document.createElement('p');stateLine.className='class-detail-meta';stateLine.textContent=t(state)+' · '+t('professor');
 const info=document.createElement('p');info.textContent=fmt(c.starts_at)+' – '+fmt(c.ends_at)+' · '+c.subject;
 const roster=document.createElement('div');roster.className='class-detail-roster';const rosterTitle=document.createElement('strong');rosterTitle.textContent=t('roster');roster.append(rosterTitle);
 for(const person of c.roster||[]){const p=document.createElement('p');p.textContent=person.display_name;roster.append(p);}
 if(!c.roster?.length){const p=document.createElement('p');p.textContent=t('noRoster');roster.append(p);}
 detail.append(head,info,stateLine,desc,roster);
 const materialArea=document.createElement('div');materialArea.className='class-detail-roster';const materialsTitle=document.createElement('strong');materialsTitle.textContent=t('materials');materialArea.append(materialsTitle);
 const {data:materials,error:materialsError}=await db.from('class_materials').select('id,title,description,resource_url,created_at').eq('class_id',c.id).order('created_at',{ascending:false});
 if(materialsError){const m=document.createElement('p');m.textContent=materialsError.message; m.className='class-form-status error';materialArea.append(m);}
 else if(!materials?.length){const m=document.createElement('p');m.textContent=t('noMaterials');materialArea.append(m);}
 else for(const item of materials){const p=document.createElement('p');const a=document.createElement('a');a.href=item.resource_url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=item.title;p.append(a);if(item.description)p.append(document.createTextNode(' — '+item.description));materialArea.append(p);}
 if(professorMode()){
  const add=document.createElement('form');add.className='class-material-form';
  const nm=document.createElement('input');nm.placeholder=t('materialTitle');nm.maxLength=160;nm.required=true;
  const url=document.createElement('input');url.type='url';url.placeholder=t('materialURL');url.required=true;
  const submit=document.createElement('button');submit.type='submit';submit.className='btn btn-dark';submit.textContent=t('addMaterial');
  add.append(nm,url,submit);add.addEventListener('submit',async ev=>{ev.preventDefault();let parsed;try{parsed=new URL(url.value)}catch{return;}if(parsed.protocol!=='https:')return;submit.disabled=true;const {error}=await db.from('class_materials').insert({class_id:c.id,title:nm.value.trim(),resource_url:parsed.href,created_by:user.id});submit.disabled=false;if(error){alert(error.message);return;}showDetail(c.id);});materialArea.append(add);
 }
 detail.append(materialArea);
 if(professorMode()){
  const attendance=document.createElement('div');attendance.className='class-detail-roster';const ah=document.createElement('strong');ah.textContent=t('attendance');attendance.append(ah);
  const {data:records,error:attendanceError}=await db.rpc('get_echo_class_attendance',{target_class_id:c.id});
  if(attendanceError){const p=document.createElement('p');p.textContent=attendanceError.message;attendance.append(p);}
  else if(!records?.length){const p=document.createElement('p');p.textContent=t('noAttendance');attendance.append(p);}
  else for(const record of records){const p=document.createElement('p');p.textContent=record.display_name+' · '+fmt(record.joined_at)+(record.left_at?' – '+fmt(record.left_at):' · '+t('live'));attendance.append(p);}
  detail.append(attendance);
 }
 const roomActions=document.createElement('div');roomActions.className='class-detail-actions';
 if(professorMode()){
  const start=document.createElement('button');start.type='button';start.className='btn btn-dark';start.textContent=c.liveRoom?t('join'):t('startClass');
  start.disabled=state==='cancelled'||state==='completed'||c.is_demo;
  start.addEventListener('click',async()=>{
   start.disabled=true;
   if(!c.liveRoom){
    const {error}=await db.rpc('start_echo_classroom',{target_class_id:c.id});
    if(error){start.disabled=false;const note=document.createElement('p');note.className='class-form-status error';note.textContent=error.message;detail.append(note);return;}
    await loadClasses();
   }
   await openPrejoin(c.id);
  });
  roomActions.append(start);
  if(c.liveRoom){
   const end=document.createElement('button');end.type='button';end.className='btn class-danger';end.textContent=t('endClass');
   end.addEventListener('click',async()=>{
    end.disabled=true;const {error}=await db.rpc('end_echo_classroom',{target_class_id:c.id});
    if(error){end.disabled=false;const note=document.createElement('p');note.className='class-form-status error';note.textContent=error.message;detail.append(note);return;}
    if(activeRoom?.classId===c.id)await leaveRoom({automatic:true});
    await loadClasses();void showDetail(c.id);
   });roomActions.append(end);
  }
 }else if(c.liveRoom){
  const join=document.createElement('button');join.type='button';join.className='btn btn-dark';join.textContent=t('join');join.disabled=state==='cancelled'||state==='completed'||c.is_demo;
  join.addEventListener('click',()=>{void openPrejoin(c.id);});roomActions.append(join);
 }else{
  const waiting=document.createElement('button');waiting.type='button';waiting.className='btn';waiting.textContent=t('waitingProfessor');waiting.disabled=true;roomActions.append(waiting);
 }
 detail.append(roomActions);
 if(professorMode()){
  const actions=document.createElement('div');actions.className='class-detail-actions';
  if(c.status!=='cancelled'&&state!=='completed'){
   const cancel=document.createElement('button');cancel.className='btn';cancel.type='button';cancel.textContent=t('cancelClass');
   cancel.onclick=async()=>{if(!confirm(t('confirmCancel')))return;cancel.disabled=true;const {error}=await db.from('classes').update({status:'cancelled',updated_at:new Date().toISOString()}).eq('id',c.id);if(error){alert(error.message);cancel.disabled=false;return;}await loadClasses();void showDetail(c.id);};
   actions.append(cancel);
  }
  const edit=document.createElement('button');edit.className='btn';edit.type='button';edit.textContent=t('edit');edit.onclick=()=>openEditor(c);
  const del=document.createElement('button');del.className='btn class-danger';del.type='button';del.textContent=t('delete');del.onclick=async()=>{if(!confirm(t('confirmDelete')))return;const {error}=await db.from('classes').delete().eq('id',c.id);if(error){alert(error.message);return;}detail.classList.add('hidden');await loadClasses();};
  actions.append(edit,del);detail.append(actions);
 }
 detail.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function professorMode(){return isOwner||profile?.role==='professor';}
async function runChecks(){
 const area=document.getElementById('class-test-results');area.replaceChildren();
 const tests=[
  {name:t('authCheck'),run:async()=>{const r=await db.auth.getSession();if(r.error)throw r.error;if(!r.data.session)throw new Error('No active session');return true;}},
  {name:t('dbCheck'),run:async()=>{const r=await db.from('classes').select('id').limit(1);if(r.error)throw r.error;return true;}},
  {name:t('roleCheck'),run:async()=>{const r=await db.rpc('is_echo_owner');if(r.error)throw r.error;if(!r.data)throw new Error('Owner permission check returned false');return true;}},
  {name:t('demoCrudCheck'),run:async()=>{
    const start=new Date(Date.now()+3600000),end=new Date(Date.now()+7200000);
    const row={title:'ECHO isolated system test',subject:'System check',description:'Temporary owner-only test record.',starts_at:start.toISOString(),ends_at:end.toISOString(),timezone:ZONE,is_demo:true,created_by:user.id};
    let id=null;
    try{
      const created=await db.from('classes').insert(row).select('id').single();if(created.error)throw created.error;id=created.data.id;
      const participant=await db.from('class_demo_participants').insert({class_id:id,display_name:'Demo Student'});if(participant.error)throw participant.error;
      const read=await db.from('classes').select('title').eq('id',id).single();if(read.error)throw read.error;if(read.data.title!==row.title)throw new Error('Saved record did not match.');
      const updated=await db.from('classes').update({title:'ECHO test updated'}).eq('id',id);if(updated.error)throw updated.error;
      const check=await db.from('classes').select('title').eq('id',id).single();if(check.error)throw check.error;if(check.data.title!=='ECHO test updated')throw new Error('Update did not persist.');
      return true;
    }finally{if(id){await db.from('class_demo_participants').delete().eq('class_id',id);await db.from('classes').delete().eq('id',id);}}
  }},
  {name:t('mediaCheck'),run:async()=>{
    if(!navigator.mediaDevices?.getUserMedia)throw new Error('Browser media APIs are unavailable.');
    const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:true});
    const tracks=stream.getTracks();const hasAudio=tracks.some(x=>x.kind==='audio'),hasVideo=tracks.some(x=>x.kind==='video');
    tracks.forEach(x=>x.stop());if(!hasAudio||!hasVideo)throw new Error('A camera or microphone track was not returned.');
    return true;
  }}
 ];
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
 const labels=panel.querySelectorAll('.class-form-grid label');
 const labelCopy=[t('name'),t('subject'),t('description'),t('image'),t('start'),t('end')];
 labels.forEach((node,i)=>{if(labelCopy[i])node.childNodes[0].textContent=labelCopy[i];});
 panel.querySelector('.class-student-picker strong').textContent=t('students');
 panel.querySelector('#class-demo-picker label').childNodes[0].textContent=t('demoStudents');
 document.getElementById('class-cancel').textContent=t('cancel');
 document.getElementById('class-save').textContent=t('save');
 document.querySelector('.class-inline #class-open').parentElement.childNodes[1].textContent=' '+t('allowUnassigned');
 document.querySelector('.class-inline #class-demo').parentElement.childNodes[1].textContent=' '+t('demo');
 document.querySelector('.class-inline #class-repeat').parentElement.childNodes[1].textContent=' '+t('recurrence')+' ';
 toggleDemoEditor();
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
