import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const OWNER_EMAILS = new Set(['yiannislappas8@gmail.com', 'yiannislappas10@gmail.com']);
const ZONE = 'Europe/Athens';
const $ = id => document.getElementById(id);
const language = () => {
  try { return localStorage.getItem('echo-language') === 'el' ? 'el' : 'en'; }
  catch (_) { return 'en'; }
};
const words = {
  en: {
    calendar:'Personal calendar', calendarIntro:'Your assigned lessons, arranged by date.',
    statusTab:'Class status', statusIntro:'See which lessons are upcoming, live, completed, or cancelled.',
    notifications:'Notifications', notificationsIntro:'Unread announcements and messages, plus your next lessons.',
    attendance:'Attendance history', attendanceIntro:'A record of your lesson attendance.',
    profile:'Profile settings', profileIntro:'Manage your display name and language preference.',
    today:'Today', previous:'Previous month', next:'Next month', noClassesDay:'No classes scheduled for this day.',
    all:'All', upcoming:'Upcoming', live:'Live', completed:'Completed', cancelled:'Cancelled',
    noClasses:'No classes are available for your account yet.', refresh:'Refresh',
    email:'Sign-in email', displayName:'Display name', language:'Language', english:'English', greek:'Greek',
    saveProfile:'Save profile', profileSaved:'Profile settings saved.', profileFailed:'Could not save profile.',
    nameRequired:'Enter a display name between 2 and 60 characters.',
    unreadAnnouncements:'Unread announcements', unreadMessages:'Unread private messages',
    markRead:'Mark as read', open:'Open', noNotifications:'You are all caught up.',
    upcomingLessons:'Upcoming lessons', noUpcoming:'No upcoming lessons.',
    newAnnouncement:'New announcement', newMessage:'New private message',
    announcementRead:'Announcement marked as read.', messageRead:'Message marked as read.',
    failedNotifications:'Could not load notifications.', failedClasses:'Could not load classes.',
    failedAttendance:'Could not load attendance history.', noAttendance:'No attendance records are available yet.',
    joined:'Joined', left:'Left', inProgress:'In progress', duration:'Duration',
    student:'Student', class:'Class', date:'Date', time:'Time',
    professorView:'Showing attendance for your classes.', studentView:'Showing your personal attendance.',
    classChanged:'Class status', emailNote:'Your sign-in email cannot be changed here.',
    scheduled:'Scheduled', attendanceCount:'attendance records'
  },
  el: {
    calendar:'Προσωπικό ημερολόγιο', calendarIntro:'Τα μαθήματά σας οργανωμένα ανά ημερομηνία.',
    statusTab:'Κατάσταση μαθημάτων', statusIntro:'Δείτε ποια μαθήματα είναι προσεχή, σε εξέλιξη, ολοκληρωμένα ή ακυρωμένα.',
    notifications:'Ειδοποιήσεις', notificationsIntro:'Μη αναγνωσμένες ανακοινώσεις και μηνύματα, καθώς και τα επόμενα μαθήματά σας.',
    attendance:'Ιστορικό παρουσιών', attendanceIntro:'Καταγραφή της συμμετοχής σας στα μαθήματα.',
    profile:'Ρυθμίσεις προφίλ', profileIntro:'Διαχειριστείτε το όνομα εμφάνισης και τη γλώσσα σας.',
    today:'Σήμερα', previous:'Προηγούμενος μήνας', next:'Επόμενος μήνας', noClassesDay:'Δεν υπάρχουν μαθήματα για αυτή την ημέρα.',
    all:'Όλα', upcoming:'Προσεχή', live:'Σε εξέλιξη', completed:'Ολοκληρωμένα', cancelled:'Ακυρωμένα',
    noClasses:'Δεν υπάρχουν ακόμη διαθέσιμα μαθήματα για τον λογαριασμό σας.', refresh:'Ανανέωση',
    email:'Email σύνδεσης', displayName:'Όνομα εμφάνισης', language:'Γλώσσα', english:'Αγγλικά', greek:'Ελληνικά',
    saveProfile:'Αποθήκευση προφίλ', profileSaved:'Οι ρυθμίσεις αποθηκεύτηκαν.', profileFailed:'Δεν ήταν δυνατή η αποθήκευση.',
    nameRequired:'Πληκτρολογήστε όνομα εμφάνισης από 2 έως 60 χαρακτήρες.',
    unreadAnnouncements:'Μη αναγνωσμένες ανακοινώσεις', unreadMessages:'Μη αναγνωσμένα προσωπικά μηνύματα',
    markRead:'Σήμανση ως αναγνωσμένο', open:'Άνοιγμα', noNotifications:'Δεν υπάρχουν νέες ειδοποιήσεις.',
    upcomingLessons:'Επόμενα μαθήματα', noUpcoming:'Δεν υπάρχουν επόμενα μαθήματα.',
    newAnnouncement:'Νέα ανακοίνωση', newMessage:'Νέο προσωπικό μήνυμα',
    announcementRead:'Η ανακοίνωση σημειώθηκε ως αναγνωσμένη.', messageRead:'Το μήνυμα σημειώθηκε ως αναγνωσμένο.',
    failedNotifications:'Δεν ήταν δυνατή η φόρτωση ειδοποιήσεων.', failedClasses:'Δεν ήταν δυνατή η φόρτωση μαθημάτων.',
    failedAttendance:'Δεν ήταν δυνατή η φόρτωση παρουσιών.', noAttendance:'Δεν υπάρχουν ακόμη καταχωρήσεις παρουσιών.',
    joined:'Συμμετοχή', left:'Αποχώρηση', inProgress:'Σε εξέλιξη', duration:'Διάρκεια',
    student:'Μαθητής', class:'Μάθημα', date:'Ημερομηνία', time:'Ώρα',
    professorView:'Εμφανίζονται οι παρουσίες των μαθημάτων σας.', studentView:'Εμφανίζονται οι προσωπικές σας παρουσίες.',
    classChanged:'Κατάσταση μαθήματος', emailNote:'Το email σύνδεσης δεν μπορεί να αλλάξει από εδώ.',
    scheduled:'Προγραμματισμένο', attendanceCount:'καταχωρήσεις παρουσιών'
  }
};
const t = key => words[language()][key] || words.en[key] || key;
const locale = () => language() === 'el' ? 'el-GR' : 'en-GB';
const fmtDate = value => {
  try { return new Intl.DateTimeFormat(locale(), {timeZone:ZONE,dateStyle:'medium'}).format(new Date(value)); }
  catch (_) { return ''; }
};
const fmtTime = value => {
  try { return new Intl.DateTimeFormat(locale(), {timeZone:ZONE,hour:'2-digit',minute:'2-digit'}).format(new Date(value)); }
  catch (_) { return ''; }
};
const dateKey = value => {
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(value));
  const p = Object.fromEntries(parts.map(x => [x.type,x.value]));
  return p.year + '-' + p.month + '-' + p.day;
};
const make = (tag, cls, value) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (value !== undefined) node.textContent = value;
  return node;
};
const css = document.createElement('link');
css.rel = 'stylesheet';
css.href = '/personal.css';
document.head.append(css);

const nav = document.querySelector('.nav-tabs');
const host = document.querySelector('.app-main');
if (!nav || !host) throw new Error('ECHO personal dashboard layout was not found.');

const panelMarkup = [
  ['personal-calendar', 'calendar', '<div class="panel-heading"><div><h2 id="personal-calendar-title"></h2><p id="personal-calendar-intro"></p></div><button class="btn" id="personal-calendar-refresh" type="button"></button></div><div class="personal-calendar-toolbar"><button class="personal-month-nav" id="personal-month-prev" type="button" aria-label="Previous month">‹</button><strong id="personal-month-label"></strong><button class="personal-month-nav" id="personal-month-next" type="button" aria-label="Next month">›</button><button class="personal-today" id="personal-today" type="button"></button></div><div class="personal-weekdays" id="personal-weekdays"></div><div class="personal-calendar-grid" id="personal-calendar-grid"></div><section class="personal-day-detail"><h3 id="personal-selected-day"></h3><div id="personal-day-classes"></div></section>'],
  ['class-status', 'statusTab', '<div class="panel-heading"><div><h2 id="class-status-title"></h2><p id="class-status-intro"></p></div><button class="btn" id="class-status-refresh" type="button"></button></div><div class="personal-status-filters" id="personal-status-filters"></div><div class="personal-status-list" id="personal-status-list"></div>'],
  ['notifications', 'notifications', '<div class="panel-heading"><div><h2 id="personal-notifications-title"></h2><p id="personal-notifications-intro"></p></div><button class="btn" id="personal-notifications-refresh" type="button"></button></div><div id="personal-notification-list" aria-live="polite"></div><p class="personal-data-status" id="personal-notification-status" role="status"></p>'],
  ['attendance', 'attendance', '<div class="panel-heading"><div><h2 id="personal-attendance-title"></h2><p id="personal-attendance-intro"></p></div><button class="btn" id="personal-attendance-refresh" type="button"></button></div><p class="personal-attendance-note" id="personal-attendance-note"></p><div id="personal-attendance-list"></div><p class="personal-data-status" id="personal-attendance-status" role="status"></p>'],
  ['profile', 'profile', '<div class="panel-heading"><div><h2 id="personal-profile-title"></h2><p id="personal-profile-intro"></p></div></div><form class="personal-profile-card" id="personal-profile-form"><label for="personal-profile-name" id="personal-profile-name-label"></label><input id="personal-profile-name" type="text" minlength="2" maxlength="60" autocomplete="name" required><label for="personal-profile-email" id="personal-profile-email-label"></label><input id="personal-profile-email" type="email" readonly><p class="personal-profile-note" id="personal-profile-email-note"></p><label for="personal-profile-language" id="personal-profile-language-label"></label><select id="personal-profile-language"><option value="en"></option><option value="el"></option></select><button class="btn btn-dark" id="personal-profile-save" type="submit"></button><p class="personal-data-status" id="personal-profile-status" role="status"></p></form>']
];

const tabButtons = new Map();
for (const [id,label] of panelMarkup) {
  const button = make('button', 'tab personal-tab', t(label));
  button.type = 'button';
  button.dataset.tab = id;
  button.addEventListener('click', () => {
    activate(id);
    void refreshPanel(id);
  });
  const before = nav.querySelector('[data-tab="announcements"]');
  nav.insertBefore(button, before || null);
  tabButtons.set(id, button);
}
for (const [id] of panelMarkup) {
  const section = make('section', 'panel');
  section.id = 'panel-' + id;
  section.innerHTML = panelMarkup.find(x => x[0] === id)[2];
  const testingPanel = $('panel-testing');
  host.insertBefore(section, testingPanel || null);
}

function activate(name) {
  nav.querySelectorAll('[data-tab]').forEach(button => {
    const active = button.dataset.tab === name;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('#app-shell .panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === 'panel-' + name);
  });
}

function applyLanguage() {
  const set = (id, value) => { const node = $(id); if (node) node.textContent = value; };
  for (const [id,label] of panelMarkup) tabButtons.get(id).textContent = t(label);
  set('personal-calendar-title',t('calendar'));
  set('personal-calendar-intro',t('calendarIntro'));
  set('personal-calendar-refresh',t('refresh'));
  set('personal-today',t('today'));
  set('class-status-title',t('statusTab'));
  set('class-status-intro',t('statusIntro'));
  set('class-status-refresh',t('refresh'));
  set('personal-notifications-title',t('notifications'));
  set('personal-notifications-intro',t('notificationsIntro'));
  set('personal-notifications-refresh',t('refresh'));
  set('personal-attendance-title',t('attendance'));
  set('personal-attendance-intro',t('attendanceIntro'));
  set('personal-attendance-refresh',t('refresh'));
  set('personal-profile-title',t('profile'));
  set('personal-profile-intro',t('profileIntro'));
  set('personal-profile-name-label',t('displayName'));
  set('personal-profile-email-label',t('email'));
  set('personal-profile-email-note',t('emailNote'));
  set('personal-profile-language-label',t('language'));
  set('personal-profile-save',t('saveProfile'));
  const select = $('personal-profile-language');
  if (select) {
    select.options[0].textContent = t('english');
    select.options[1].textContent = t('greek');
    select.value = language();
  }
  renderCalendar();
  renderClassStatuses();
  renderAttendance();
  renderNotifications();
}

let db = null;
let user = null;
let profile = null;
let isTeaching = false;
let classes = [];
let liveClassIds = new Set();
let attendanceRows = [];
let notificationRows = [];
let notificationTimer = null;
let calendarCursor = new Date(Date.UTC(new Date().getFullYear(),new Date().getMonth(),1));
let selectedDay = dateKey(new Date());
let statusFilter = 'all';

function classStatus(klass) {
  if (klass.status === 'cancelled') return 'cancelled';
  if (new Date(klass.ends_at).getTime() < Date.now()) return 'completed';
  if (liveClassIds.has(klass.id)) return 'live';
  return 'upcoming';
}
function classTimeLabel(klass) {
  return fmtDate(klass.starts_at) + ' · ' + fmtTime(klass.starts_at) + ' – ' + fmtTime(klass.ends_at);
}
function classRow(klass, compact = false) {
  const row = make('article', compact ? 'personal-class-row compact' : 'personal-class-row');
  const info = make('div','personal-class-info');
  info.append(make('strong','',klass.title || 'ECHO class'));
  info.append(make('span','', (klass.subject || '') + ' · ' + classTimeLabel(klass)));
  const state = classStatus(klass);
  const badge = make('span','personal-state '+state,t(state));
  row.append(info,badge);
  return row;
}
async function loadClasses() {
  const {data,error} = await db.from('classes')
    .select('id,title,subject,starts_at,ends_at,status,is_demo')
    .eq('is_demo',false)
    .order('starts_at',{ascending:true});
  if (error) throw error;
  classes = data || [];
  liveClassIds = new Set();
  if (classes.length) {
    const {data:rooms,error:roomError} = await db.from('class_live_rooms')
      .select('class_id').in('class_id',classes.map(x=>x.id)).eq('status','live');
    if (roomError) throw roomError;
    liveClassIds = new Set((rooms || []).map(x=>x.class_id));
  }
  renderCalendar();
  renderClassStatuses();
}
function renderCalendar() {
  const grid = $('personal-calendar-grid');
  if (!grid) return;
  const year = calendarCursor.getUTCFullYear();
  const month = calendarCursor.getUTCMonth();
  const first = new Date(Date.UTC(year,month,1));
  const offset = (first.getUTCDay()+6)%7;
  const start = new Date(Date.UTC(year,month,1-offset));
  $('personal-month-label').textContent = new Intl.DateTimeFormat(locale(),{month:'long',year:'numeric',timeZone:ZONE}).format(new Date(Date.UTC(year,month,15,12)));
  const weekdays = $('personal-weekdays');
  weekdays.replaceChildren();
  const monday = new Date(Date.UTC(2024,0,1,12));
  for (let i=0;i<7;i++) {
    const day = new Date(monday.getTime()+i*86400000);
    weekdays.append(make('span','',new Intl.DateTimeFormat(locale(),{weekday:'short',timeZone:ZONE}).format(day)));
  }
  grid.replaceChildren();
  const todayKey = dateKey(new Date());
  for (let i=0;i<42;i++) {
    const date = new Date(start.getTime()+i*86400000);
    const key = date.toISOString().slice(0,10);
    const sameMonth = date.getUTCMonth() === month;
    const events = classes.filter(c=>dateKey(c.starts_at)===key);
    const cell = make('button','personal-calendar-day'+(sameMonth?'':' outside')+(key===selectedDay?' selected':'')+(key===todayKey?' today':''));
    cell.type = 'button';
    cell.setAttribute('aria-label',key+' · '+events.length+' classes');
    cell.append(make('span','personal-day-number',String(date.getUTCDate())));
    if (events.length) cell.append(make('span','personal-day-count',String(events.length)+' '+(events.length===1?'class':'classes')));
    cell.addEventListener('click',()=>{selectedDay=key;renderCalendar();});
    grid.append(cell);
  }
  const selectedDate = new Date(selectedDay+'T12:00:00Z');
  $('personal-selected-day').textContent = fmtDate(selectedDate);
  const list = $('personal-day-classes');
  list.replaceChildren();
  const dayClasses = classes.filter(c=>dateKey(c.starts_at)===selectedDay).sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
  if (!dayClasses.length) list.append(make('p','personal-empty',t('noClassesDay')));
  else dayClasses.forEach(c=>list.append(classRow(c,true)));
}
function renderClassStatuses() {
  const filterArea = $('personal-status-filters');
  const list = $('personal-status-list');
  if (!filterArea || !list) return;
  const filters = ['all','upcoming','live','completed','cancelled'];
  filterArea.replaceChildren();
  for (const key of filters) {
    const button = make('button','personal-filter'+(statusFilter===key?' active':''),t(key));
    button.type = 'button';
    button.addEventListener('click',()=>{statusFilter=key;renderClassStatuses();});
    filterArea.append(button);
  }
  list.replaceChildren();
  const rows = classes.filter(c=>statusFilter==='all'||classStatus(c)===statusFilter);
  if (!rows.length) list.append(make('div','personal-empty',t('noClasses')));
  else rows.forEach(c=>list.append(classRow(c)));
}
function renderAttendance() {
  const list = $('personal-attendance-list');
  if (!list) return;
  list.replaceChildren();
  const note = $('personal-attendance-note');
  note.textContent = isTeaching ? t('professorView') : t('studentView');
  if (!attendanceRows.length) {
    list.append(make('div','personal-empty',t('noAttendance')));
    return;
  }
  for (const item of attendanceRows) {
    const card = make('article','personal-attendance-row');
    const top = make('div','personal-attendance-top');
    const title = make('strong','',item.classTitle);
    const badge = make('span','personal-attendance-badge',item.left_at?t('left'):t('inProgress'));
    top.append(title,badge);
    const meta = make('p','',fmtDate(item.joined_at)+' · '+fmtTime(item.joined_at)+(item.left_at?' – '+fmtTime(item.left_at):''));
    const duration = item.left_at ? Math.max(1,Math.round((new Date(item.left_at)-new Date(item.joined_at))/60000))+' min' : t('inProgress');
    const detail = make('p','personal-attendance-meta',t('duration')+': '+duration+(isTeaching&&item.studentName?' · '+t('student')+': '+item.studentName:''));
    card.append(top,meta,detail);
    list.append(card);
  }
}
function notificationCard(kind,title,description,time,actionText,action) {
  const card = make('article','personal-notification');
  const main = make('div','personal-notification-main');
  main.append(make('strong','',title));
  main.append(make('p','',description || ''));
  main.append(make('time','',fmtDate(time)+' · '+fmtTime(time)));
  const button = make('button','personal-action',actionText);
  button.type = 'button';
  button.addEventListener('click',action);
  card.append(main,button);
  return card;
}
function renderNotifications() {
  const list = $('personal-notification-list');
  if (!list) return;
  list.replaceChildren();
  const rows = notificationRows;
  const unreadCount = rows.filter(x=>x.kind==='announcement'||x.kind==='message').length;
  const tab = tabButtons.get('notifications');
  if (tab) tab.textContent = t('notifications')+(unreadCount?' ('+unreadCount+')':'');
  if (!rows.length) {
    list.append(make('div','personal-empty',t('noNotifications')));
    return;
  }
  for (const item of rows) {
    if (item.kind==='announcement') {
      list.append(notificationCard(item.kind,t('newAnnouncement'),item.title,item.created_at,t('markRead'),async()=>{
        const {error} = await db.from('announcement_reads').upsert(
          {announcement_id:item.id,user_id:user.id},
          {onConflict:'announcement_id,user_id',ignoreDuplicates:true}
        );
        if (error) { $('personal-notification-status').textContent=error.message; return; }
        await loadNotifications();
      }));
    } else if (item.kind==='message') {
      list.append(notificationCard(item.kind,t('newMessage'),item.preview,item.created_at,t('markRead'),async()=>{
        const {error} = await db.from('private_messages').update({read_at:new Date().toISOString()})
          .eq('id',item.id).eq('recipient_id',user.id);
        if (error) { $('personal-notification-status').textContent=error.message; return; }
        await loadNotifications();
      }));
    } else {
      list.append(notificationCard(item.kind,t('upcomingLessons'),item.title,item.starts_at,t('open'),()=>activate('class-status')));
    }
  }
}
async function loadNotifications() {
  if (!db || !user) return;
  const status = $('personal-notification-status');
  status.textContent = '';
  try {
    const [announcementResult,readResult,messageResult] = await Promise.all([
      db.from('announcements').select('id,title,created_at').eq('published',true).order('created_at',{ascending:false}).limit(30),
      db.from('announcement_reads').select('announcement_id').eq('user_id',user.id),
      db.from('private_messages').select('id,sender_id,body,created_at').eq('recipient_id',user.id).is('read_at',null).order('created_at',{ascending:false}).limit(30)
    ]);
    if (announcementResult.error) throw announcementResult.error;
    if (readResult.error) throw readResult.error;
    if (messageResult.error) throw messageResult.error;
    const readIds = new Set((readResult.data||[]).map(x=>x.announcement_id));
    const unreadAnnouncements = (announcementResult.data||[]).filter(x=>!readIds.has(x.id)).map(x=>({...x,kind:'announcement'}));
    const unreadMessages = messageResult.data||[];
    let senderNames = new Map();
    if (unreadMessages.length) {
      const ids = [...new Set(unreadMessages.map(x=>x.sender_id))];
      const {data:senders} = await db.from('profiles').select('id,display_name').in('id',ids);
      senderNames = new Map((senders||[]).map(x=>[x.id,x.display_name]));
    }
    const messageItems = unreadMessages.map(x=>({
      kind:'message',id:x.id,created_at:x.created_at,
      preview:(senderNames.get(x.sender_id)||t('professor'))+': '+String(x.body||'').slice(0,140)
    }));
    const upcoming = classes.filter(c=>classStatus(c)==='upcoming'&&new Date(c.starts_at).getTime()>Date.now())
      .sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at)).slice(0,3)
      .map(c=>({kind:'upcoming',title:c.title+' · '+classTimeLabel(c),starts_at:c.starts_at}));
    notificationRows = [
      ...unreadAnnouncements.map(x=>({...x,kind:'announcement'})),
      ...messageItems,
      ...upcoming
    ].sort((a,b)=>new Date(b.created_at||b.starts_at)-new Date(a.created_at||a.starts_at));
    renderNotifications();
  } catch (error) {
    status.textContent = error.message || t('failedNotifications');
  }
}
async function loadAttendance() {
  const status = $('personal-attendance-status');
  status.textContent = '';
  const query = db.from('class_attendance').select('id,class_id,student_id,joined_at,left_at')
    .order('joined_at',{ascending:false}).limit(100);
  if (!isTeaching) query.eq('student_id',user.id);
  const {data,error} = await query;
  if (error) {
    status.textContent = error.message || t('failedAttendance');
    attendanceRows = [];
    renderAttendance();
    return;
  }
  const records = data || [];
  const studentIds = [...new Set(records.map(x=>x.student_id))];
  const nameMap = new Map();
  if (isTeaching && studentIds.length) {
    const {data:names} = await db.from('profiles').select('id,display_name').in('id',studentIds);
    for (const person of names||[]) nameMap.set(person.id,person.display_name);
  }
  const classMap = new Map(classes.map(x=>[x.id,x]));
  attendanceRows = records.map(item=>{
    const klass=classMap.get(item.class_id);
    return {...item,classTitle:klass?.title||'ECHO class',studentName:nameMap.get(item.student_id)||''};
  });
  renderAttendance();
}
async function refreshPanel(id) {
  if (!db || !user) return;
  try {
    if (id==='personal-calendar'||id==='class-status') await loadClasses();
    if (id==='notifications') { await loadClasses(); await loadNotifications(); }
    if (id==='attendance') { await loadClasses(); await loadAttendance(); }
    if (id==='profile') {
      $('personal-profile-name').value = profile?.display_name || '';
      $('personal-profile-email').value = user.email || '';
      $('personal-profile-language').value = language();
    }
  } catch (error) {
    const target = id==='notifications'?'personal-notification-status':id==='attendance'?'personal-attendance-status':null;
    if (target) $(target).textContent = error.message || t('failedClasses');
  }
}
async function saveProfile(event) {
  event.preventDefault();
  if (!db || !user) return;
  const name = $('personal-profile-name').value.trim();
  const status = $('personal-profile-status');
  if (name.length<2||name.length>60) { status.textContent=t('nameRequired'); return; }
  const button=$('personal-profile-save');
  button.disabled=true;status.textContent='';
  const {error}=await db.rpc('update_echo_profile',{new_display_name:name});
  button.disabled=false;
  if (error) { status.textContent=error.message||t('profileFailed'); return; }
  profile.display_name=name;
  const initials=name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0].toUpperCase()).join('');
  if ($('avatar')) $('avatar').textContent=initials||'E';
  status.textContent=t('profileSaved');
}
function changeLanguage(value) {
  const current=language();
  if (value===current) return;
  const button=$('app-language');
  if (button) button.click();
  else {
    try { localStorage.setItem('echo-language',value); } catch (_) {}
  }
  window.setTimeout(applyLanguage,0);
}
function reset() {
  if (notificationTimer) { clearInterval(notificationTimer); notificationTimer=null; }
  user=null;profile=null;classes=[];liveClassIds=new Set();attendanceRows=[];notificationRows=[];
  renderCalendar();renderClassStatuses();renderAttendance();renderNotifications();
}
async function boot(session) {
  if (!session?.user) { reset(); return; }
  user=session.user;
  const {data,error}=await db.from('profiles').select('id,display_name,role').eq('id',user.id).maybeSingle();
  if (error) throw error;
  profile=data||{id:user.id,display_name:user.email||'ECHO user',role:'student'};
  isTeaching=OWNER_EMAILS.has((user.email||'').toLowerCase())||profile.role==='professor';
  $('personal-profile-name').value=profile.display_name||'';
  $('personal-profile-email').value=user.email||'';
  $('personal-profile-language').value=language();
  await loadClasses();
  await Promise.all([loadAttendance(),loadNotifications()]);
  if (notificationTimer) clearInterval(notificationTimer);
  notificationTimer=setInterval(()=>{void loadNotifications();},45000);
}
for (const id of ['personal-calendar-refresh','class-status-refresh']) {
  $(id).addEventListener('click',()=>{void loadClasses().catch(e=>{$('class-status-title').textContent=t('failedClasses')+': '+e.message;});});
}
$('personal-month-prev').addEventListener('click',()=>{calendarCursor=new Date(Date.UTC(calendarCursor.getUTCFullYear(),calendarCursor.getUTCMonth()-1,1));renderCalendar();});
$('personal-month-next').addEventListener('click',()=>{calendarCursor=new Date(Date.UTC(calendarCursor.getUTCFullYear(),calendarCursor.getUTCMonth()+1,1));renderCalendar();});
$('personal-today').addEventListener('click',()=>{const now=new Date();calendarCursor=new Date(Date.UTC(now.getFullYear(),now.getMonth(),1));selectedDay=dateKey(now);renderCalendar();});
$('personal-notifications-refresh').addEventListener('click',()=>{void loadClasses().then(loadNotifications).catch(e=>{$('personal-notification-status').textContent=e.message;});});
$('personal-attendance-refresh').addEventListener('click',()=>{void loadClasses().then(loadAttendance).catch(e=>{$('personal-attendance-status').textContent=e.message;});});
$('personal-profile-language').addEventListener('change',event=>changeLanguage(event.target.value));
$('personal-profile-form').addEventListener('submit',saveProfile);
$('app-language')?.addEventListener('click',()=>window.setTimeout(applyLanguage,0));
$('login-language')?.addEventListener('click',()=>window.setTimeout(applyLanguage,0));
window.addEventListener('storage',event=>{if(event.key==='echo-language')applyLanguage();});

async function start() {
  try {
    const cfg=await fetch('/config',{cache:'no-store'}).then(r=>r.json());
    db=createClient(cfg.supabaseUrl,cfg.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    const {data,error}=await db.auth.getSession();
    if(error)throw error;
    if(data.session)await boot(data.session);
    db.auth.onAuthStateChange((_event,session)=>{
      if(session)void boot(session).catch(e=>{$('personal-notification-status').textContent=e.message;});
      else reset();
    });
    applyLanguage();
  } catch(error) {
    $('personal-profile-status').textContent=error.message||t('profileFailed');
  }
}
start();
