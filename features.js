import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const OWNER_EMAIL = 'yiannislappas8@gmail.com';
const language = () => {
  try { return localStorage.getItem('echo-language') === 'el' ? 'el' : 'en'; }
  catch (_) { return 'en'; }
};

const text = {
  en: {
    announcements:'Announcements', announcementsIntro:'Important updates from your professor.',
    title:'Announcement title', titlePlaceholder:'e.g. Schedule update', body:'Message',
    bodyPlaceholder:'Write your announcement...', professorOnly:'Only professors can publish announcements.',
    publish:'Publish announcement', emptyAnnouncements:'There are no announcements yet.',
    delete:'Delete', confirmDelete:'Delete this announcement?', published:'Announcement published.',
    deleted:'Announcement deleted.', failedAnnouncements:'Could not load announcements. Run the ECHO setup SQL first.',
    messages:'Private messages', messagesIntro:'A private conversation between you and your professor.',
    conversations:'CONVERSATIONS', selectConversation:'Choose a conversation',
    emptyMessages:'Your private messages will appear here.', messagePlaceholder:'Write a private message...',
    send:'Send', noContacts:'No eligible conversations are available yet.',
    failedMessages:'Could not load private messages. Run the ECHO setup SQL first.', sent:'Message sent.',
    owner:'Professor access', ownerIntro:'Grant or remove professor permissions for ECHO accounts.',
    ownerNotice:'Owner-only controls · Only the designated ECHO account can change roles.',
    makeProfessor:'Make professor', removeProfessor:'Remove professor access',
    student:'Student', professor:'Professor', noAccounts:'No other ECHO accounts have signed in yet.',
    failedOwner:'Could not load accounts. Run the ECHO setup SQL first.',
    roleUpdated:'Account permissions updated.', denied:'This account is not permitted to manage roles.',
    setup:'The ECHO database setup has not been completed yet.', signedIn:'Signed in'
  },
  el: {
    announcements:'Ανακοινώσεις', announcementsIntro:'Σημαντικές ενημερώσεις από τον καθηγητή σας.',
    title:'Τίτλος ανακοίνωσης', titlePlaceholder:'π.χ. Αλλαγή προγράμματος', body:'Μήνυμα',
    bodyPlaceholder:'Γράψτε την ανακοίνωσή σας...', professorOnly:'Μόνο οι καθηγητές μπορούν να δημοσιεύουν ανακοινώσεις.',
    publish:'Δημοσίευση ανακοίνωσης', emptyAnnouncements:'Δεν υπάρχουν ακόμη ανακοινώσεις.',
    delete:'Διαγραφή', confirmDelete:'Να διαγραφεί αυτή η ανακοίνωση;', published:'Η ανακοίνωση δημοσιεύτηκε.',
    deleted:'Η ανακοίνωση διαγράφηκε.', failedAnnouncements:'Δεν ήταν δυνατή η φόρτωση. Εκτελέστε πρώτα το SQL εγκατάστασης του ECHO.',
    messages:'Προσωπικά μηνύματα', messagesIntro:'Ιδιωτική συνομιλία ανάμεσα σε εσάς και τον καθηγητή σας.',
    conversations:'ΣΥΝΟΜΙΛΙΕΣ', selectConversation:'Επιλέξτε συνομιλία',
    emptyMessages:'Τα προσωπικά σας μηνύματα θα εμφανίζονται εδώ.', messagePlaceholder:'Γράψτε ένα προσωπικό μήνυμα...',
    send:'Αποστολή', noContacts:'Δεν υπάρχουν ακόμη διαθέσιμες συνομιλίες.',
    failedMessages:'Δεν ήταν δυνατή η φόρτωση των μηνυμάτων. Εκτελέστε πρώτα το SQL εγκατάστασης του ECHO.', sent:'Το μήνυμα στάλθηκε.',
    owner:'Πρόσβαση καθηγητών', ownerIntro:'Δώστε ή αφαιρέστε δικαιώματα καθηγητή από λογαριασμούς ECHO.',
    ownerNotice:'Μόνο για τον ιδιοκτήτη · Μόνο ο καθορισμένος λογαριασμός ECHO μπορεί να αλλάζει ρόλους.',
    makeProfessor:'Ορισμός ως καθηγητή', removeProfessor:'Αφαίρεση δικαιωμάτων καθηγητή',
    student:'Μαθητής', professor:'Καθηγητής', noAccounts:'Δεν έχουν συνδεθεί ακόμη άλλοι λογαριασμοί ECHO.',
    failedOwner:'Δεν ήταν δυνατή η φόρτωση λογαριασμών. Εκτελέστε πρώτα το SQL εγκατάστασης του ECHO.',
    roleUpdated:'Τα δικαιώματα του λογαριασμού ενημερώθηκαν.', denied:'Αυτός ο λογαριασμός δεν έχει δικαίωμα διαχείρισης ρόλων.',
    setup:'Η βάση δεδομένων του ECHO δεν έχει ρυθμιστεί ακόμη.', signedIn:'Συνδεδεμένος χρήστης'
  }
};
const tr = key => text[language()][key] || text.en[key] || key;
const dateText = value => {
  try { return new Date(value).toLocaleString(language() === 'el' ? 'el-GR' : 'en-GB', {dateStyle:'medium', timeStyle:'short'}); }
  catch (_) { return ''; }
};
const el = (tag, cls, value) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (value !== undefined) node.textContent = value;
  return node;
};

const css = document.createElement('link');
css.rel = 'stylesheet';
css.href = '/features.css';
document.head.append(css);

const nav = document.querySelector('.nav-tabs');
const joinPanel = document.getElementById('panel-join');
if (!nav || !joinPanel) throw new Error('ECHO dashboard layout was not found.');

const tabsMarkup = [
  ['announcements', 'announcements'],
  ['messages', 'messages'],
  ['owner', 'owner']
];
for (const [id, label] of tabsMarkup) {
  const button = el('button', 'tab' + (id === 'owner' ? ' hidden' : ''), tr(label));
  button.type = 'button';
  button.dataset.tab = id;
  button.dataset.featureTab = id;
  if (id === 'owner') button.id = 'owner-tab';
  nav.append(button);
}

const panelsMarkup = `
<section class="panel" id="panel-announcements">
  <div class="panel-heading"><div><h2 id="announcements-heading"></h2><p id="announcements-intro"></p></div></div>
  <div class="announcement-compose hidden" id="announcement-admin">
    <form id="announcement-form">
      <label for="announcement-title" id="announcement-title-label"></label>
      <input id="announcement-title" type="text" maxlength="120" required>
      <label for="announcement-body" id="announcement-body-label"></label>
      <textarea id="announcement-body" rows="4" maxlength="6000" required></textarea>
      <div class="compose-actions"><span class="compose-note" id="announcement-professor-only"></span><button class="btn btn-dark" id="announcement-submit" type="submit"></button></div>
    </form>
  </div>
  <div class="announcement-list" id="announcement-list" aria-live="polite"></div>
  <p class="data-status" id="announcement-status" role="status" aria-live="polite"></p>
</section>
<section class="panel" id="panel-messages">
  <div class="panel-heading"><div><h2 id="messages-heading"></h2><p id="messages-intro"></p></div></div>
  <div class="messages-layout">
    <aside class="message-contacts">
      <div class="message-contacts-heading" id="message-contacts-heading"></div>
      <div id="message-contacts-list"></div>
    </aside>
    <section class="message-conversation">
      <div class="message-thread-heading" id="message-thread-heading"></div>
      <div class="message-list" id="message-list" aria-live="polite"></div>
      <form class="message-compose" id="message-form">
        <textarea id="message-input" rows="2" maxlength="4000" required disabled></textarea>
        <button class="btn btn-dark" id="message-send" type="submit" disabled></button>
      </form>
    </section>
  </div>
  <p class="data-status" id="messages-status" role="status" aria-live="polite"></p>
</section>
<section class="panel" id="panel-owner">
  <div class="panel-heading"><div><h2 id="owner-heading"></h2><p id="owner-intro"></p></div></div>
  <div class="owner-notice" id="owner-notice"></div>
  <div class="owner-role-list" id="owner-role-list"></div>
  <p class="data-status" id="owner-status" role="status" aria-live="polite"></p>
</section>`;
joinPanel.insertAdjacentHTML('afterend', panelsMarkup);

function applyFeatureLanguage() {
  const set = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = value; };
  set('announcements-heading', tr('announcements'));
  set('announcements-intro', tr('announcementsIntro'));
  set('announcement-title-label', tr('title'));
  set('announcement-body-label', tr('body'));
  set('announcement-professor-only', tr('professorOnly'));
  set('announcement-submit', tr('publish'));
  document.getElementById('announcement-title').placeholder = tr('titlePlaceholder');
  document.getElementById('announcement-body').placeholder = tr('bodyPlaceholder');
  set('messages-heading', tr('messages'));
  set('messages-intro', tr('messagesIntro'));
  set('message-contacts-heading', tr('conversations'));
  set('message-thread-heading', tr('selectConversation'));
  document.getElementById('message-input').placeholder = tr('messagePlaceholder');
  set('message-send', tr('send'));
  set('owner-heading', tr('owner'));
  set('owner-intro', tr('ownerIntro'));
  set('owner-notice', tr('ownerNotice'));
  for (const button of nav.querySelectorAll('[data-feature-tab]')) {
    button.textContent = tr(button.dataset.featureTab);
  }
  document.querySelector('#tab-announcements');
}
function status(id, message, error = false) {
  const node = document.getElementById(id);
  node.textContent = message || '';
  node.classList.toggle('error', !!error);
}
function professorMode() { return isOwner || profile?.role === 'professor'; }
let supabase = null;
let user = null;
let profile = null;
let isOwner = false;
let contactId = null;
let contacts = [];
let messagePoller = null;

function renderContacts() {
  const list = document.getElementById('message-contacts-list');
  list.replaceChildren();
  for (const contact of contacts) {
    const button = el('button', 'message-contact' + (contact.id === contactId ? ' active' : ''), contact.display_name || 'ECHO user');
    button.type = 'button';
    button.addEventListener('click', () => openConversation(contact.id));
    list.append(button);
  }
}
async function loadAnnouncements() {
  const list = document.getElementById('announcement-list');
  list.replaceChildren();
  status('announcement-status', '');
  const {data, error} = await supabase.from('announcements')
    .select('id,title,body,created_at').order('created_at', {ascending:false});
  if (error) { status('announcement-status', tr('failedAnnouncements'), true); return; }
  if (!data?.length) { list.append(el('p', 'message-empty-note', tr('emptyAnnouncements'))); return; }
  for (const row of data) {
    const card = el('article', 'announcement-item');
    card.append(el('h3', '', row.title), el('time', '', dateText(row.created_at)), el('p', '', row.body));
    if (professorMode()) {
      const remove = el('button', 'announcement-delete', tr('delete'));
      remove.type = 'button';
      remove.addEventListener('click', async () => {
        if (!confirm(tr('confirmDelete'))) return;
        const {error: deleteError} = await supabase.from('announcements').delete().eq('id', row.id);
        if (deleteError) status('announcement-status', deleteError.message, true);
        else { status('announcement-status', tr('deleted')); await loadAnnouncements(); }
      });
      card.append(remove);
    }
    list.append(card);
  }
}
async function loadMessages() {
  const list = document.getElementById('message-list');
  list.replaceChildren();
  const contact = contacts.find(item => item.id === contactId);
  if (!contact) { list.append(el('p', 'message-empty', tr('noContacts'))); return; }
  const me = user.id, other = contact.id;
  const expression = 'and(sender_id.eq.' + me + ',recipient_id.eq.' + other + '),and(sender_id.eq.' + other + ',recipient_id.eq.' + me + ')';
  const {data, error} = await supabase.from('private_messages')
    .select('id,sender_id,recipient_id,body,created_at').or(expression).order('created_at', {ascending:true});
  if (error) { status('messages-status', tr('failedMessages'), true); return; }
  if (!data?.length) { list.append(el('p', 'message-empty', tr('emptyMessages'))); return; }
  for (const row of data) {
    const bubble = el('article', 'message-bubble' + (row.sender_id === me ? ' sent' : ''));
    bubble.append(el('p', '', row.body), el('time', '', dateText(row.created_at)));
    list.append(bubble);
  }
  list.scrollTop = list.scrollHeight;
}
async function openConversation(id) {
  contactId = id;
  renderContacts();
  const contact = contacts.find(item => item.id === id);
  document.getElementById('message-thread-heading').textContent = contact?.display_name || tr('selectConversation');
  document.getElementById('message-input').disabled = !contact;
  document.getElementById('message-send').disabled = !contact;
  await loadMessages();
}
async function loadContacts() {
  const {data, error} = await supabase.from('profiles').select('id,display_name,role').order('display_name');
  if (error) { status('messages-status', tr('failedMessages'), true); return; }
  const requiredRole = professorMode() ? 'student' : 'professor';
  contacts = (data || []).filter(item => item.id !== user.id && item.role === requiredRole);
  if (!contacts.some(item => item.id === contactId)) contactId = contacts[0]?.id || null;
  renderContacts();
  if (!contacts.length) {
    status('messages-status', tr('noContacts'));
    document.getElementById('message-thread-heading').textContent = tr('selectConversation');
    document.getElementById('message-list').replaceChildren(el('p', 'message-empty', tr('noContacts')));
    document.getElementById('message-input').disabled = true;
    document.getElementById('message-send').disabled = true;
    return;
  }
  status('messages-status', '');
  await openConversation(contactId);
}
async function loadOwnerAccounts() {
  const list = document.getElementById('owner-role-list');
  list.replaceChildren();
  if (!isOwner) { status('owner-status', tr('denied'), true); return; }
  const {data, error} = await supabase.rpc('get_echo_role_candidates');
  if (error) { status('owner-status', tr('failedOwner'), true); return; }
  const candidates = (data || []).filter(item => (item.email || '').toLowerCase() !== OWNER_EMAIL);
  if (!candidates.length) { list.append(el('p', 'message-empty-note', tr('noAccounts'))); return; }
  for (const account of candidates) {
    const row = el('div', 'owner-role-item');
    const details = el('div', 'owner-role-name');
    details.append(el('strong', '', account.display_name || account.email || 'ECHO user'));
    details.append(el('span', '', account.email || ''));
    details.append(el('span', 'role-chip', account.role === 'professor' ? tr('professor') : tr('student')));
    const action = el('button', 'role-toggle' + (account.role === 'professor' ? ' demote' : ''),
      account.role === 'professor' ? tr('removeProfessor') : tr('makeProfessor'));
    action.type = 'button';
    action.addEventListener('click', async () => {
      action.disabled = true;
      const {error: updateError} = await supabase.rpc('set_echo_professor', {
        target_user_id: account.user_id,
        make_professor: account.role !== 'professor'
      });
      action.disabled = false;
      if (updateError) { status('owner-status', updateError.message, true); return; }
      status('owner-status', tr('roleUpdated'));
      await loadOwnerAccounts();
      await loadContacts();
    });
    row.append(details, action);
    list.append(row);
  }
}
function startMessageRefresh() {
  if (messagePoller) window.clearInterval(messagePoller);
  messagePoller = window.setInterval(() => {
    if (user && contactId && !document.hidden) void loadMessages();
  }, 6000);
}
async function loadForSession(session) {
  if (!session?.user || !supabase) return;
  user = session.user;
  isOwner = (user.email || '').toLowerCase() === OWNER_EMAIL;
  document.getElementById('owner-tab').classList.toggle('hidden', !isOwner);
  const {data, error} = await supabase.from('profiles')
    .select('id,display_name,role').eq('id', user.id).maybeSingle();
  profile = data || {id:user.id, display_name:user.email, role:'student'};
  if (error) {
    status('announcement-status', tr('setup'), true);
    status('messages-status', tr('setup'), true);
    if (isOwner) status('owner-status', tr('setup'), true);
    return;
  }
  document.getElementById('announcement-admin').classList.toggle('hidden', !professorMode());
  await Promise.all([loadAnnouncements(), loadContacts()]);
  if (isOwner) await loadOwnerAccounts();
  startMessageRefresh();
}
function resetFeatureState() {
  if (messagePoller) { window.clearInterval(messagePoller); messagePoller = null; }
  user = null; profile = null; isOwner = false; contactId = null; contacts = [];
  document.getElementById('owner-tab').classList.add('hidden');
  document.getElementById('announcement-admin').classList.add('hidden');
}

document.getElementById('announcement-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (!professorMode() || !user) return;
  const title = document.getElementById('announcement-title').value.trim();
  const body = document.getElementById('announcement-body').value.trim();
  if (!title || !body) return;
  const button = document.getElementById('announcement-submit');
  button.disabled = true;
  const {error} = await supabase.from('announcements').insert({title, body, created_by:user.id});
  button.disabled = false;
  if (error) { status('announcement-status', error.message, true); return; }
  event.currentTarget.reset();
  status('announcement-status', tr('published'));
  await loadAnnouncements();
});
document.getElementById('message-form').addEventListener('submit', async event => {
  event.preventDefault();
  const body = document.getElementById('message-input').value.trim();
  if (!body || !contactId || !user) return;
  const button = document.getElementById('message-send');
  button.disabled = true;
  const {error} = await supabase.from('private_messages').insert({
    sender_id:user.id, recipient_id:contactId, body
  });
  button.disabled = false;
  if (error) { status('messages-status', error.message, true); return; }
  document.getElementById('message-input').value = '';
  status('messages-status', tr('sent'));
  await loadMessages();
});

function activateTab(name) {
  for (const button of nav.querySelectorAll('[data-tab]')) {
    const active = button.dataset.tab === name;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  }
  for (const panel of document.querySelectorAll('#app-shell .panel')) {
    panel.classList.toggle('active', panel.id === 'panel-' + name);
  }
}
nav.querySelectorAll('[data-tab]').forEach(button => {
  button.addEventListener('click', () => activateTab(button.dataset.tab));
});
for (const button of document.querySelectorAll('[data-go]')) {
  button.addEventListener('click', () => activateTab(button.dataset.go));
}
for (const id of ['login-language', 'app-language']) {
  document.getElementById(id)?.addEventListener('click', () => queueMicrotask(applyFeatureLanguage));
}
applyFeatureLanguage();

try {
  const response = await fetch('/config', {cache:'no-store'});
  if (!response.ok) throw new Error('Configuration unavailable');
  const config = await response.json();
  if (!config.supabaseUrl || !config.supabaseAnonKey) throw new Error('Supabase not configured');
  supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
  });
  const {data, error} = await supabase.auth.getSession();
  if (error) throw error;
  if (data.session) await loadForSession(data.session);
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) void loadForSession(session);
    else resetFeatureState();
  });
} catch (error) {
  status('announcement-status', tr('setup'), true);
  status('messages-status', tr('setup'), true);
}
