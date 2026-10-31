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
    profile:'Profile settings', profileIntro:'Manage your display name and language preference.',
    today:'Today', previous:'Previous month', next:'Next month', noClassesDay:'No classes scheduled for this day.',
    all:'All', upcoming:'Upcoming', live:'Live', completed:'Completed', cancelled:'Cancelled',
    noClasses:'No classes are available for your account yet.', refresh:'Refresh',
    email:'Sign-in email', displayName:'Display name', language:'Language', english:'English', greek:'Greek',
    saveProfile:'Save profile', profileSaved:'Profile settings saved.', profileFailed:'Could not save profile.',
    nameRequired:'Enter a display name between 2 and 60 characters.',
    unreadAnnouncements:'Unread announcements', unreadMessages:'Unread private messages',
    markRead:'Mark as read', markAllRead:'Mark all as read', pin:'Pin', unpin:'Unpin', pinned:'Pinned', readAllDone:'All notifications marked as read.', pinSaved:'Notification pin updated.', open:'Open', noNotifications:'You are all caught up.',
    upcomingLessons:'Upcoming lessons', noUpcoming:'No upcoming lessons.',
    newAnnouncement:'New announcement', newMessage:'New private message',
    announcementRead:'Announcement marked as read.', messageRead:'Message marked as read.',
    failedNotifications:'Could not load notifications.', failedClasses:'Could not load classes.',
    classChanged:'Class status', emailNote:'Your sign-in email cannot be changed here.',
    scheduled:'Scheduled'
  },
  el: {
    calendar:'Προσωπικό ημερολόγιο', calendarIntro:'Τα μαθήματά σας οργανωμένα ανά ημερομηνία.',
    statusTab:'Κατάσταση μαθημάτων', statusIntro:'Δείτε ποια μαθήματα είναι προσεχή, σε εξέλιξη, ολοκληρωμένα ή ακυρωμένα.',
    notifications:'Ειδοποιήσεις', notificationsIntro:'Μη αναγνωσμένες ανακοινώσεις και μηνύματα, καθώς και τα επόμενα μαθήματά σας.',
    profile:'Ρυθμίσεις προφίλ', profileIntro:'Διαχειριστείτε το όνομα εμφάνισης και τη γλώσσα σας.',
    today:'Σήμερα', previous:'Προηγούμενος μήνας', next:'Επόμενος μήνας', noClassesDay:'Δεν υπάρχουν μαθήματα για αυτή την ημέρα.',
    all:'Όλα', upcoming:'Προσεχή', live:'Σε εξέλιξη', completed:'Ολοκληρωμένα', cancelled:'Ακυρωμένα',
    noClasses:'Δεν υπάρχουν ακόμη διαθέσιμα μαθήματα για τον λογαριασμό σας.', refresh:'Ανανέωση',
    email:'Email σύνδεσης', displayName:'Όνομα εμφάνισης', language:'Γλώσσα', english:'Αγγλικά', greek:'Ελληνικά',
    saveProfile:'Αποθήκευση προφίλ', profileSaved:'Οι ρυθμίσεις αποθηκεύτηκαν.', profileFailed:'Δεν ήταν δυνατή η αποθήκευση.',
    nameRequired:'Πληκτρολογήστε όνομα εμφάνισης από 2 έως 60 χαρακτήρες.',
    unreadAnnouncements:'Μη αναγνωσμένες ανακοινώσεις', unreadMessages:'Μη αναγνωσμένα προσωπικά μηνύματα',
    markRead:'Σήμανση ως αναγνωσμένο', markAllRead:'Σήμανση όλων ως αναγνωσμένων', pin:'Καρφίτσωμα', unpin:'Ξεκαρφίτσωμα', pinned:'Καρφιτσωμένο', readAllDone:'Όλες οι ειδοποιήσεις σημειώθηκαν ως αναγνωσμένες.', pinSaved:'Η καρφίτσα ενημερώθηκε.', open:'Άνοιγμα', noNotifications:'Δεν υπάρχουν νέες ειδοποιήσεις.',
    upcomingLessons:'Επόμενα μαθήματα', noUpcoming:'Δεν υπάρχουν επόμενα μαθήματα.',
    newAnnouncement:'Νέα ανακοίνωση', newMessage:'Νέο προσωπικό μήνυμα',
    announcementRead:'Η ανακοίνωση σημειώθηκε ως αναγνωσμένη.', messageRead:'Το μήνυμα σημειώθηκε ως αναγνωσμένο.',
    failedNotifications:'Δεν ήταν δυνατή η φόρτωση ειδοποιήσεων.', failedClasses:'Δεν ήταν δυνατή η φόρτωση μαθημάτων.',
    classChanged:'Κατάσταση μαθήματος', emailNote:'Το email σύνδεσης δεν μπορεί να αλλάξει από εδώ.',
    scheduled:'Προγραμματισμένο'
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
  ['notifications', 'notifications', '<div class="panel-heading"><div><h2 id="personal-notifications-title"></h2><p id="personal-notifications-intro"></p></div><button class="btn" id="personal-notifications-refresh" type="button"></button></div><div class="personal-notification-toolbar"><button class="personal-action personal-action-primary" id="personal-mark-all-read" type="button" hidden></button></div><div id="personal-notification-list" aria-live="polite"></div><p class="personal-data-status" id="personal-notification-status" role="status"></p>'],
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
  set('personal-mark-all-read',t('markAllRead'));
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
  renderNotifications();
}

let db = null;
let user = null;
let profile = null;
let isTeaching = false;
let classes = [];
let liveClassIds = new Set();
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
function notificationCard(title,description,time,actions=[],pinned=false,read=false,onOpen=null) {
  const card = make('article','personal-notification'+(pinned?' is-pinned':'')+(read?' is-read':''));
  const main = make('div','personal-notification-main');
  main.append(make('strong','',title));
  if (pinned) main.append(make('span','personal-notification-pinned',t('pinned')));
  main.append(make('p','',description || ''));
  main.append(make('time','',fmtDate(time)+' · '+fmtTime(time)));
  if(onOpen){
    main.classList.add('personal-notification-openable');
    main.tabIndex=0;
    main.setAttribute('role','button');
    main.setAttribute('aria-label',t('open')+' '+title);
    main.addEventListener('click',onOpen);
    main.addEventListener('keydown',event=>{
      if(event.key==='Enter'||event.key===' '){event.preventDefault();onOpen();}
    });
  }
  const actionArea = make('div','personal-notification-actions');
  for (const action of actions) {
    const button = make('button','personal-action'+(action.primary?' personal-action-primary':''),action.label);
    button.type = 'button';
    button.disabled = !!action.disabled;
    button.addEventListener('click',action.onClick);
    actionArea.append(button);
  }
  card.append(main,actionArea);
  return card;
}
function openNotification(item) {
  if(item.kind==='announcement'){
    window.dispatchEvent(new CustomEvent('echo:open-announcement',{detail:{id:item.id}}));
  }else if(item.kind==='message'){
    window.dispatchEvent(new CustomEvent('echo:open-message',{detail:{senderId:item.sender_id,messageId:item.id}}));
  }
}
function renderNotifications() {
  const list = $('personal-notification-list');
  if (!list) return;
  list.replaceChildren();
  const rows = notificationRows;
  const unreadCount = rows.filter(x=>(x.kind==='announcement'||x.kind==='message')&&!x.read).length;
  const tab = tabButtons.get('notifications');
  if (tab) tab.textContent = t('notifications')+(unreadCount?' ('+unreadCount+')':'');
  const markAll = $('personal-mark-all-read');
  if (markAll) {
    markAll.textContent = t('markAllRead');
    markAll.hidden = unreadCount===0;
    markAll.disabled = unreadCount===0;
  }
  if (!rows.length) {
    list.append(make('div','personal-empty',t('noNotifications')));
    return;
  }
  for (const item of rows) {
    if (item.kind==='announcement'||item.kind==='message') {
      const actions = [{
        label:t('open'),
        primary:true,
        onClick:()=>openNotification(item)
      }];
      if (!item.read) actions.push({
        label:t('markRead'),
        primary:true,
        onClick:()=>{void markNotificationRead(item);}
      });
      actions.push({
        label:item.pinned?t('unpin'):t('pin'),
        onClick:()=>{void toggleNotificationPin(item);}
      });
      const title=item.kind==='announcement'?t('newAnnouncement'):t('newMessage');
      list.append(notificationCard(title,item.preview||item.title,item.created_at,actions,item.pinned,item.read,()=>openNotification(item)));
    } else {
      list.append(notificationCard(t('upcomingLessons'),item.title,item.starts_at,[{
        label:t('open'),onClick:()=>activate('class-status')
      }]));
    }
  }
}
async function markNotificationRead(item) {
  const status=$('personal-notification-status');
  status.textContent='';
  try {
    let result;
    if (item.kind==='announcement') {
      result=await db.from('announcement_reads').upsert(
        {announcement_id:item.id,user_id:user.id},
        {onConflict:'announcement_id,user_id',ignoreDuplicates:true}
      );
    } else {
      result=await db.from('private_messages').update({read_at:new Date().toISOString()})
        .eq('id',item.id).eq('recipient_id',user.id);
    }
    if (result.error) throw result.error;
    await loadNotifications();
  } catch(error) {
    status.textContent=error.message||t('failedNotifications');
  }
}
async function toggleNotificationPin(item) {
  const status=$('personal-notification-status');
  status.textContent='';
  try {
    const field=item.kind==='announcement'?'announcement_id':'message_id';
    let result;
    if (item.pinned) {
      result=await db.from('notification_pins').delete()
        .eq('user_id',user.id).eq(field,item.id);
    } else {
      result=await db.from('notification_pins').insert({user_id:user.id,[field]:item.id});
    }
    if (result.error) throw result.error;
    await loadNotifications();
    status.textContent=t('pinSaved');
  } catch(error) {
    status.textContent=error.message||t('failedNotifications');
  }
}
async function markAllNotificationsRead() {
  if (!db||!user) return;
  const button=$('personal-mark-all-read');
  const status=$('personal-notification-status');
  button.disabled=true;
  status.textContent='';
  try {
    const announcementIds=notificationRows
      .filter(x=>x.kind==='announcement'&&!x.read)
      .map(x=>x.id);
    const announcementPromise=announcementIds.length
      ? db.from('announcement_reads').upsert(
          announcementIds.map(id=>({announcement_id:id,user_id:user.id})),
          {onConflict:'announcement_id,user_id',ignoreDuplicates:true}
        )
      : Promise.resolve({error:null});
    const messagePromise=db.from('private_messages')
      .update({read_at:new Date().toISOString()})
      .eq('recipient_id',user.id).is('read_at',null);
    const [announcementResult,messageResult]=await Promise.all([announcementPromise,messagePromise]);
    if (announcementResult.error) throw announcementResult.error;
    if (messageResult.error) throw messageResult.error;
    await loadNotifications();
    status.textContent=t('readAllDone');
  } catch(error) {
    status.textContent=error.message||t('failedNotifications');
    button.disabled=false;
  }
}
async function loadNotifications() {
  if (!db || !user) return;
  const status = $('personal-notification-status');
  status.textContent = '';
  try {
    const [announcementResult,readResult,messageResult,pinResult] = await Promise.all([
      db.from('announcements').select('id,title,created_at,created_by').eq('published',true).order('created_at',{ascending:false}).limit(1000),
      db.from('announcement_reads').select('announcement_id').eq('user_id',user.id),
      db.from('private_messages').select('id,sender_id,recipient_id,body,created_at,read_at')
        .eq('recipient_id',user.id).is('read_at',null).order('created_at',{ascending:false}).limit(1000),
      db.from('notification_pins').select('announcement_id,message_id').eq('user_id',user.id)
    ]);
    if (announcementResult.error) throw announcementResult.error;
    if (readResult.error) throw readResult.error;
    if (messageResult.error) throw messageResult.error;
    if (pinResult.error) throw pinResult.error;

    const readIds = new Set((readResult.data||[]).map(x=>x.announcement_id));
    const pinnedAnnouncementIds = new Set((pinResult.data||[]).map(x=>x.announcement_id).filter(Boolean));
    const pinnedMessageIds = new Set((pinResult.data||[]).map(x=>x.message_id).filter(Boolean));

    const announcementMap=new Map((announcementResult.data||[]).map(x=>[x.id,x]));
    const missingAnnouncementIds=[...pinnedAnnouncementIds].filter(id=>!announcementMap.has(id));
    if(missingAnnouncementIds.length){
      const {data,error}=await db.from('announcements').select('id,title,created_at,created_by')
        .eq('published',true).in('id',missingAnnouncementIds);
      if(error)throw error;
      for(const row of data||[])announcementMap.set(row.id,row);
    }
    const unreadAnnouncements=[...announcementMap.values()]
      .filter(x=>((x.created_by!==user.id&&!readIds.has(x.id))||pinnedAnnouncementIds.has(x.id)))
      .map(x=>({...x,kind:'announcement',read:readIds.has(x.id),pinned:pinnedAnnouncementIds.has(x.id)}));

    const messageMap=new Map((messageResult.data||[]).map(x=>[x.id,x]));
    const missingMessageIds=[...pinnedMessageIds].filter(id=>!messageMap.has(id));
    if(missingMessageIds.length){
      const {data,error}=await db.from('private_messages')
        .select('id,sender_id,recipient_id,body,created_at,read_at')
        .eq('recipient_id',user.id).in('id',missingMessageIds);
      if(error)throw error;
      for(const row of data||[])messageMap.set(row.id,row);
    }
    const visibleMessages=[...messageMap.values()]
      .filter(x=>x.recipient_id===user.id&&(!x.read_at||pinnedMessageIds.has(x.id)));
    let senderNames = new Map();
    if (visibleMessages.length) {
      const ids = [...new Set(visibleMessages.map(x=>x.sender_id))];
      const {data:senders,error}=await db.from('profiles').select('id,display_name').in('id',ids);
      if(error)throw error;
      senderNames = new Map((senders||[]).map(x=>[x.id,x.display_name]));
    }
    const messageItems = visibleMessages.map(x=>({
      kind:'message',id:x.id,sender_id:x.sender_id,created_at:x.created_at,read:!!x.read_at,pinned:pinnedMessageIds.has(x.id),
      preview:(senderNames.get(x.sender_id)||t('professor'))+': '+String(x.body||'').slice(0,140)
    }));
    const upcoming = classes.filter(c=>classStatus(c)==='upcoming'&&new Date(c.starts_at).getTime()>Date.now())
      .sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at)).slice(0,3)
      .map(c=>({kind:'upcoming',title:c.title+' · '+classTimeLabel(c),starts_at:c.starts_at}));
    notificationRows = [
      ...unreadAnnouncements,
      ...messageItems,
      ...upcoming
    ].sort((a,b)=>(Number(!!b.pinned)-Number(!!a.pinned))||new Date(b.created_at||b.starts_at)-new Date(a.created_at||a.starts_at));
    renderNotifications();
  } catch (error) {
    status.textContent = error.message || t('failedNotifications');
  }
}
async function refreshPanel(id) {
  if (!db || !user) return;
  try {
    if (id==='personal-calendar'||id==='class-status') await loadClasses();
    if (id==='notifications') { await loadClasses(); await loadNotifications(); }
    if (id==='profile') {
      $('personal-profile-name').value = profile?.display_name || '';
      $('personal-profile-email').value = user.email || '';
      $('personal-profile-language').value = language();
    }
  } catch (error) {
    const target = id==='notifications'?'personal-notification-status':null;
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
  user=null;profile=null;classes=[];liveClassIds=new Set();notificationRows=[];
  renderCalendar();renderClassStatuses();renderNotifications();
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
  await loadNotifications();
  if (notificationTimer) clearInterval(notificationTimer);
  notificationTimer=setInterval(()=>{void loadNotifications();},45000);
}
$('personal-mark-all-read').addEventListener('click',()=>{void markAllNotificationsRead();});
for (const id of ['personal-calendar-refresh','class-status-refresh']) {
  $(id).addEventListener('click',()=>{void loadClasses().catch(e=>{$('class-status-title').textContent=t('failedClasses')+': '+e.message;});});
}
$('personal-month-prev').addEventListener('click',()=>{calendarCursor=new Date(Date.UTC(calendarCursor.getUTCFullYear(),calendarCursor.getUTCMonth()-1,1));renderCalendar();});
$('personal-month-next').addEventListener('click',()=>{calendarCursor=new Date(Date.UTC(calendarCursor.getUTCFullYear(),calendarCursor.getUTCMonth()+1,1));renderCalendar();});
$('personal-today').addEventListener('click',()=>{const now=new Date();calendarCursor=new Date(Date.UTC(now.getFullYear(),now.getMonth(),1));selectedDay=dateKey(now);renderCalendar();});
$('personal-notifications-refresh').addEventListener('click',()=>{void loadClasses().then(loadNotifications).catch(e=>{$('personal-notification-status').textContent=e.message;});});
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
