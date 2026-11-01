import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const OWNER_EMAILS = new Set(['yiannislappas8@gmail.com', 'yiannislappas10@gmail.com']);
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
    deleted:'Announcement deleted.', updated:'Announcement updated.', edit:'Edit', pin:'Pin', unpin:'Unpin', pinned:'Pinned', update:'Save changes', cancelEdit:'Cancel edit', audience:'Audience', everyone:'Everyone', selectedStudents:'Selected students', chooseStudents:'Choose students', recipientsRequired:'Select at least one student.', newAnnouncement:'New', markRead:'Mark as read', markedRead:'Announcement marked as read.', unread:'Unread', failedAnnouncements:'Could not load announcements. Run the ECHO setup SQL first.',
    messages:'Private messages', messagesIntro:'A private conversation between you and your professor.',
    conversations:'CONVERSATIONS', selectConversation:'Choose a conversation',
    emptyMessages:'Your private messages will appear here.', messagePlaceholder:'Write a private message...',
    send:'Send', noContacts:'No eligible conversations are available yet.', unread:'Unread',
    call:'Call', endCall:'End call', incomingCall:'Incoming voice call', incomingSuffix:'is calling you.',
    accept:'Accept', decline:'Decline', ringing:'Calling…', connecting:'Connecting audio…', inCall:'Connected',
    callNoAnswer:'No answer. The call was ended.', callRejected:'The call was declined.', callEnded:'Call ended.',
    callPeerEnded:'The other person ended the call.', callExpired:'This call is no longer available.',
    callMicDenied:'Microphone permission is required for voice calls.', callMicMissing:'This browser cannot access a microphone.',
    callError:'Could not connect. Check your microphone and network, then try again.',
    callSecureError:'Could not open a private call channel. Run the updated ECHO SQL and disable public Realtime channel access.',
    failedMessages:'Could not load private messages. Run the ECHO setup SQL first.', sent:'Message sent.',
    owner:'Professor access', ownerIntro:'Choose which ECHO accounts can teach and manage classes.',
    ownerNotice:'Select an account below and choose “Make professor”. Professor access can be removed here at any time. Only designated ECHO owners can make these changes.',
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
    deleted:'Η ανακοίνωση διαγράφηκε.', updated:'Η ανακοίνωση ενημερώθηκε.', edit:'Επεξεργασία', pin:'Καρφίτσωμα', unpin:'Ξεκαρφίτσωμα', pinned:'Καρφιτσωμένο', update:'Αποθήκευση αλλαγών', cancelEdit:'Ακύρωση', audience:'Κοινό', everyone:'Όλοι', selectedStudents:'Επιλεγμένοι μαθητές', chooseStudents:'Επιλέξτε μαθητές', recipientsRequired:'Επιλέξτε τουλάχιστον έναν μαθητή.', newAnnouncement:'Νέο', markRead:'Σήμανση ως αναγνωσμένο', markedRead:'Η ανακοίνωση σημειώθηκε ως αναγνωσμένη.', unread:'Μη αναγνωσμένο', failedAnnouncements:'Δεν ήταν δυνατή η φόρτωση. Εκτελέστε πρώτα το SQL εγκατάστασης του ECHO.',
    messages:'Προσωπικά μηνύματα', messagesIntro:'Ιδιωτική συνομιλία ανάμεσα σε εσάς και τον καθηγητή σας.',
    conversations:'ΣΥΝΟΜΙΛΙΕΣ', selectConversation:'Επιλέξτε συνομιλία',
    emptyMessages:'Τα προσωπικά σας μηνύματα θα εμφανίζονται εδώ.', messagePlaceholder:'Γράψτε ένα προσωπικό μήνυμα...',
    send:'Αποστολή', noContacts:'Δεν υπάρχουν ακόμη διαθέσιμες συνομιλίες.', unread:'Μη αναγνωσμένο',
    call:'Κλήση', endCall:'Τερματισμός', incomingCall:'Εισερχόμενη φωνητική κλήση', incomingSuffix:'σας καλεί.',
    accept:'Αποδοχή', decline:'Απόρριψη', ringing:'Κλήση…', connecting:'Σύνδεση ήχου…', inCall:'Σε κλήση',
    callNoAnswer:'Δεν υπήρξε απάντηση. Η κλήση τερματίστηκε.', callRejected:'Η κλήση απορρίφθηκε.', callEnded:'Η κλήση τερματίστηκε.',
    callPeerEnded:'Ο άλλος χρήστης τερμάτισε την κλήση.', callExpired:'Η κλήση δεν είναι πλέον διαθέσιμη.',
    callMicDenied:'Απαιτείται άδεια μικροφώνου για τις φωνητικές κλήσεις.', callMicMissing:'Αυτός ο browser δεν έχει πρόσβαση σε μικρόφωνο.',
    callError:'Η σύνδεση απέτυχε. Ελέγξτε το μικρόφωνο και το δίκτυό σας και δοκιμάστε ξανά.',
    callSecureError:'Δεν ήταν δυνατή η δημιουργία ιδιωτικής σύνδεσης. Εκτελέστε το νέο SQL του ECHO και απενεργοποιήστε τη δημόσια πρόσβαση στα Realtime κανάλια.',
    failedMessages:'Δεν ήταν δυνατή η φόρτωση των μηνυμάτων. Εκτελέστε πρώτα το SQL εγκατάστασης του ECHO.', sent:'Το μήνυμα στάλθηκε.',
    owner:'Πρόσβαση καθηγητών', ownerIntro:'Επιλέξτε ποιοι λογαριασμοί ECHO μπορούν να διδάσκουν και να διαχειρίζονται μαθήματα.',
    ownerNotice:'Επιλέξτε έναν λογαριασμό και πατήστε «Ορισμός ως καθηγητή». Η πρόσβαση μπορεί να αφαιρεθεί από εδώ. Μόνο ο ιδιοκτήτης ECHO μπορεί να κάνει αλλαγές.',
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
  const button = el('button', 'tab', tr(label));
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
      <label for="announcement-audience" id="announcement-audience-label"></label>
      <select id="announcement-audience"><option value="everyone"></option><option value="selected"></option></select>
      <div class="announcement-recipients hidden" id="announcement-students"></div>
      <label class="announcement-pin-option"><input id="announcement-pinned" type="checkbox"> <span id="announcement-pinned-label"></span></label>
      <div class="compose-actions"><span class="compose-note" id="announcement-professor-only"></span><button class="btn hidden" id="announcement-cancel-edit" type="button"></button><button class="btn btn-dark" id="announcement-submit" type="submit"></button></div>
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
      <div class="message-thread-heading">
        <span id="message-thread-heading"></span>
        <div class="call-controls">
          <span class="call-status" id="call-status" role="status" aria-live="polite"></span>
          <button class="call-button" id="start-call" type="button" disabled></button>
          <button class="call-button call-button-end hidden" id="end-call" type="button"></button>
        </div>
      </div>
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
</section>
<div class="call-overlay hidden" id="incoming-call" role="dialog" aria-modal="true" aria-labelledby="incoming-call-title">
  <div class="call-dialog">
    <div class="call-symbol" aria-hidden="true">♪</div>
    <p class="call-eyebrow">ECHO · VOICE</p>
    <h2 id="incoming-call-title"></h2>
    <p class="call-incoming-copy"><strong id="incoming-caller"></strong> <span id="incoming-call-description"></span></p>
    <div class="call-actions">
      <button class="call-button call-button-accept" id="accept-call" type="button"></button>
      <button class="call-button call-button-end" id="decline-call" type="button"></button>
    </div>
  </div>
</div>
<audio id="remote-audio" autoplay playsinline></audio>`;
joinPanel.insertAdjacentHTML('afterend', panelsMarkup);

function applyFeatureLanguage() {
  const set = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = value; };
  set('announcements-heading', tr('announcements'));
  set('announcements-intro', tr('announcementsIntro'));
  set('announcement-title-label', tr('title'));
  set('announcement-body-label', tr('body'));
  set('announcement-professor-only', tr('professorOnly'));
  set('announcement-cancel-edit', tr('cancelEdit'));
  set('announcement-submit', editingAnnouncementId ? tr('update') : tr('publish'));
  set('announcement-audience-label', tr('audience'));
  const audience = document.getElementById('announcement-audience');
  audience.options[0].textContent = tr('everyone');
  audience.options[1].textContent = tr('selectedStudents');
  set('announcement-pinned-label', tr('pinned'));
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
  set('start-call', tr('call'));
  set('end-call', tr('endCall'));
  set('incoming-call-title', tr('incomingCall'));
  set('incoming-call-description', tr('incomingSuffix'));
  set('accept-call', tr('accept'));
  set('decline-call', tr('decline'));
  for (const button of nav.querySelectorAll('[data-feature-tab]')) {
    button.textContent = tr(button.dataset.featureTab);
  }
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
let unreadCounts = new Map();
let editingAnnouncementId = null;
let sendingPrivateMessage = false;
let announcementStudents = [];
let selectedAnnouncementStudents = new Set();
let messagePoller = null;
let incomingCallPoller = null;
let activeCallPoller = null;
let activeCall = null;
let incomingCall = null;
const remoteAudio = document.getElementById('remote-audio');
let initializedSessionUserId = null;

function showCallStatus(message, error = false) {
  const node = document.getElementById('call-status');
  if (node) {
    node.textContent = message || '';
    node.classList.toggle('error', !!error);
  }
  if (activeCall) activeCall.statusText = message || '';
}
function syncCallControls() {
  const start = document.getElementById('start-call');
  const end = document.getElementById('end-call');
  if (!start || !end) return;
  start.disabled = !user || !contactId || !contacts.some(item => item.id === contactId) || !!activeCall || !!incomingCall;
  end.classList.toggle('hidden', !activeCall);
  end.disabled = !activeCall;
  document.querySelectorAll('#message-contacts-list .message-contact').forEach(item => {
    item.disabled = !!activeCall;
  });
  nav.querySelectorAll('[data-tab]').forEach(item => {
    item.disabled = !!activeCall && item.dataset.tab !== 'messages';
  });
}
function hideIncomingCall() {
  document.getElementById('incoming-call')?.classList.add('hidden');
  syncCallControls();
}
async function subscribeToCall(callId) {
  const {data:{session}} = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error(tr('callSecureError'));
  await supabase.realtime.setAuth(session.access_token);
  return await new Promise((resolve, reject) => {
    const channel = supabase.channel('echo-call:' + callId, {
      config: { private: true, broadcast: { ack: true } }
    });
    channel.on('broadcast', {event:'signal'}, ({payload}) => {
      if (payload && payload.from !== user?.id) void receiveCallSignal(payload);
    });
    channel.subscribe((state, error) => {
      if (state === 'SUBSCRIBED') resolve(channel);
      else if (['CHANNEL_ERROR', 'TIMED_OUT', 'CLOSED'].includes(state)) {
        void supabase.removeChannel(channel);
        reject(error || new Error(tr('callSecureError')));
      }
    });
  });
}
async function sendCallSignal(type, data = {}) {
  const call = activeCall;
  if (!call?.channel) throw new Error(tr('callSecureError'));
  const result = await call.channel.send({
    type: 'broadcast',
    event: 'signal',
    payload: {type, from:user.id, ...data}
  });
  if (result !== 'ok') throw new Error(tr('callSecureError'));
}
async function fetchCallIceServers() {
  const {data:{session}} = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error(tr('callSecureError'));
  const response = await fetch('/api/turn-credentials', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + session.access_token,
      'Content-Type': 'application/json'
    },
    body: '{}',
    cache: 'no-store'
  });
  if (!response.ok) throw new Error(tr('callError'));
  const data = await response.json();
  if (!Array.isArray(data.iceServers) || !data.iceServers.length) throw new Error(tr('callError'));
  return data.iceServers;
}
async function ensureCallMicrophone(call) {
  if (call.localStream) return;
  if (!navigator.mediaDevices?.getUserMedia) throw new Error(tr('callMicMissing'));
  try {
    call.localStream = await navigator.mediaDevices.getUserMedia({
      audio: {echoCancellation:true, noiseSuppression:true, autoGainControl:true},
      video: false
    });
  } catch (error) {
    if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') {
      throw new Error(tr('callMicMissing'));
    }
    throw new Error(tr('callMicDenied'));
  }
}
async function createCallPeerConnection(call) {
  const iceServers = await fetchCallIceServers();
  if (activeCall !== call) return;
  const pc = new RTCPeerConnection({iceServers});
  call.pc = pc;
  for (const track of call.localStream.getTracks()) pc.addTrack(track, call.localStream);
  pc.ontrack = event => {
    if (activeCall !== call) return;
    const stream = event.streams?.[0] || new MediaStream([event.track]);
    remoteAudio.srcObject = stream;
    void remoteAudio.play().catch(() => showCallStatus(tr('connecting')));
    showCallStatus(tr('inCall'));
  };
  pc.onicecandidate = event => {
    if (event.candidate && activeCall === call) {
      void sendCallSignal('ice', {candidate:event.candidate.toJSON()}).catch(() => {});
    }
  };
  pc.onconnectionstatechange = () => {
    if (activeCall !== call) return;
    if (pc.connectionState === 'connected') showCallStatus(tr('inCall'));
    else if (pc.connectionState === 'connecting' || pc.connectionState === 'new') showCallStatus(tr('connecting'));
    else if (pc.connectionState === 'failed') {
      showCallStatus(tr('callError'), true);
      void finishCall({updateServer:true, signal:true, statusText:tr('callError')});
    }
  };
}
async function flushCallIce(call) {
  if (!call.pc?.remoteDescription) return;
  const queued = call.pendingCandidates.splice(0);
  for (const candidate of queued) {
    try { await call.pc.addIceCandidate(new RTCIceCandidate(candidate)); }
    catch (_) {}
  }
}
async function receiveCallSignal(payload) {
  const call = activeCall;
  if (!call || payload.from === user?.id) return;
  try {
    if (payload.type === 'ice' && payload.candidate) {
      if (call.pc?.remoteDescription) {
        await call.pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
      } else {
        call.pendingCandidates.push(payload.candidate);
      }
      return;
    }
    if (payload.type === 'offer' && call.role === 'callee' && !call.offerHandled) {
      call.offerHandled = true;
      if (!call.pc) {
        await ensureCallMicrophone(call);
        await createCallPeerConnection(call);
      }
      if (activeCall !== call || !call.pc) return;
      await call.pc.setRemoteDescription(new RTCSessionDescription(payload.description));
      await flushCallIce(call);
      const answer = await call.pc.createAnswer();
      await call.pc.setLocalDescription(answer);
      await sendCallSignal('answer', {description:call.pc.localDescription});
      showCallStatus(tr('connecting'));
      return;
    }
    if (payload.type === 'answer' && call.role === 'caller' && call.pc && !call.pc.remoteDescription) {
      await call.pc.setRemoteDescription(new RTCSessionDescription(payload.description));
      await flushCallIce(call);
      showCallStatus(tr('connecting'));
      return;
    }
    if (payload.type === 'hangup') {
      await finishCall({updateServer:false, signal:false, statusText:tr('callPeerEnded')});
    }
  } catch (error) {
    const message = error?.message || tr('callError');
    showCallStatus(message, true);
    await finishCall({updateServer:true, signal:true, statusText:message});
  }
}
async function makeCallerOffer(call) {
  if (activeCall !== call || call.offerSent || call.offerStarting) return;
  call.offerStarting = true;
  try {
    await ensureCallMicrophone(call);
    if (activeCall !== call) return;
    await createCallPeerConnection(call);
    if (activeCall !== call || !call.pc) return;
    const offer = await call.pc.createOffer();
    await call.pc.setLocalDescription(offer);
    await sendCallSignal('offer', {description:call.pc.localDescription});
    call.offerSent = true;
    showCallStatus(tr('connecting'));
  } catch (error) {
    const message = error?.message || tr('callError');
    showCallStatus(message, true);
    await finishCall({updateServer:true, signal:true, statusText:message});
  } finally {
    call.offerStarting = false;
  }
}
async function pollActiveCall() {
  const call = activeCall;
  if (!call) return;
  const {data, error} = await supabase.from('echo_calls')
    .select('status').eq('id', call.id).maybeSingle();
  if (error || activeCall !== call || !data) return;
  if (call.role === 'caller' && data.status === 'accepted') {
    if (call.timeoutId) { window.clearTimeout(call.timeoutId); call.timeoutId = null; }
    await makeCallerOffer(call);
  } else if (data.status === 'rejected') {
    await finishCall({updateServer:false, signal:false, statusText:tr('callRejected')});
  } else if (data.status === 'ended') {
    await finishCall({updateServer:false, signal:false, statusText:tr('callPeerEnded')});
  }
}
function startActiveCallRefresh() {
  if (activeCallPoller) window.clearInterval(activeCallPoller);
  activeCallPoller = window.setInterval(() => { void pollActiveCall(); }, 1200);
}
async function finishCall({updateServer=true, signal=true, statusText=tr('callEnded')} = {}) {
  const call = activeCall;
  if (!call) return;
  activeCall = null;
  if (activeCallPoller) { window.clearInterval(activeCallPoller); activeCallPoller = null; }
  if (call.timeoutId) window.clearTimeout(call.timeoutId);
  if (signal && call.channel) {
    try {
      await call.channel.send({
        type:'broadcast', event:'signal', payload:{type:'hangup', from:user?.id}
      });
    } catch (_) {}
  }
  if (updateServer && user) {
    try { await supabase.rpc('end_echo_call', {target_call_id:call.id}); } catch (_) {}
  }
  if (call.pc) {
    call.pc.ontrack = null;
    call.pc.onicecandidate = null;
    call.pc.onconnectionstatechange = null;
    call.pc.close();
  }
  call.localStream?.getTracks().forEach(track => track.stop());
  if (remoteAudio) {
    remoteAudio.pause();
    remoteAudio.srcObject = null;
  }
  if (call.channel) void supabase.removeChannel(call.channel);
  showCallStatus(statusText);
  syncCallControls();
}
async function startVoiceCall() {
  const peer = contacts.find(item => item.id === contactId);
  if (!user || !peer || activeCall || incomingCall) return;
  const button = document.getElementById('start-call');
  button.disabled = true;
  showCallStatus(tr('ringing'));
  const {data:callId, error} = await supabase.rpc('create_echo_call', {target_user_id:peer.id});
  if (error || !callId) {
    showCallStatus(error?.message || tr('callError'), true);
    syncCallControls();
    return;
  }
  const call = {
    id:callId, role:'caller', peerId:peer.id, peerName:peer.display_name || tr('signedIn'),
    channel:null, pc:null, localStream:null, pendingCandidates:[], offerSent:false, offerStarting:false
  };
  activeCall = call;
  syncCallControls();
  try {
    call.channel = await subscribeToCall(call.id);
    if (activeCall !== call) return;
    showCallStatus(tr('ringing'));
    startActiveCallRefresh();
    call.timeoutId = window.setTimeout(() => {
      if (activeCall === call && call.role === 'caller' && !call.offerSent) {
        void finishCall({updateServer:true, signal:true, statusText:tr('callNoAnswer')});
      }
    }, 45000);
  } catch (error) {
    const message = error?.message || tr('callSecureError');
    showCallStatus(message, true);
    await finishCall({updateServer:true, signal:false, statusText:message});
  }
}
async function pollIncomingCalls() {
  if (!user || activeCall) return;
  if (incomingCall) {
    const {data} = await supabase.from('echo_calls').select('status')
      .eq('id', incomingCall.id).maybeSingle();
    if (!data || data.status !== 'ringing') {
      incomingCall = null;
      hideIncomingCall();
      showCallStatus(tr('callExpired'));
    }
    return;
  }
  const cutoff = new Date(Date.now() - 60000).toISOString();
  const {data, error} = await supabase.from('echo_calls')
    .select('id,caller_id,created_at,status')
    .eq('callee_id', user.id).eq('status','ringing')
    .gte('created_at', cutoff).order('created_at', {ascending:false}).limit(1);
  if (error || !data?.length) return;
  const row = data[0];
  const peer = contacts.find(item => item.id === row.caller_id);
  const {data:profileData} = peer ? {data:peer} : await supabase.from('profiles')
    .select('id,display_name,role').eq('id', row.caller_id).maybeSingle();
  incomingCall = {...row, peerName:profileData?.display_name || tr('signedIn')};
  document.getElementById('incoming-caller').textContent = incomingCall.peerName;
  document.getElementById('incoming-call').classList.remove('hidden');
  syncCallControls();
}
function startIncomingCallRefresh() {
  if (incomingCallPoller) window.clearInterval(incomingCallPoller);
  void pollIncomingCalls();
  incomingCallPoller = window.setInterval(() => { void pollIncomingCalls(); }, 1800);
}
async function acceptIncomingCall() {
  const pending = incomingCall;
  if (!pending || activeCall) return;
  incomingCall = null;
  hideIncomingCall();
  const call = {
    id:pending.id, role:'callee', peerId:pending.caller_id, peerName:pending.peerName,
    channel:null, pc:null, localStream:null, pendingCandidates:[], offerHandled:false
  };
  activeCall = call;
  syncCallControls();
  activateTab('messages');
  await openConversation(pending.caller_id);
  showCallStatus(tr('connecting'));
  try {
    call.channel = await subscribeToCall(call.id);
    if (activeCall !== call) return;
    await ensureCallMicrophone(call);
    if (activeCall !== call) return;
    await createCallPeerConnection(call);
    if (activeCall !== call) return;
    const {error} = await supabase.rpc('accept_echo_call', {target_call_id:call.id});
    if (error) throw error;
    startActiveCallRefresh();
    showCallStatus(tr('connecting'));
  } catch (error) {
    const message = error?.message || tr('callError');
    showCallStatus(message, true);
    await finishCall({updateServer:true, signal:true, statusText:message});
  }
}
async function declineIncomingCall() {
  const pending = incomingCall;
  if (!pending) return;
  const {error} = await supabase.rpc('reject_echo_call', {target_call_id:pending.id});
  incomingCall = null;
  hideIncomingCall();
  showCallStatus(error?.message || tr('callRejected'), !!error);
}

function resetAnnouncementEditor() {
  const form = document.getElementById('announcement-form');
  if (!form) return;
  editingAnnouncementId = null;
  selectedAnnouncementStudents = new Set();
  form.reset();
  const audience = document.getElementById('announcement-audience');
  if (audience) audience.value = 'everyone';
  const cancel = document.getElementById('announcement-cancel-edit');
  cancel?.classList.add('hidden');
  const submit = document.getElementById('announcement-submit');
  if (submit) submit.textContent = tr('publish');
  renderAnnouncementStudents();
}

async function beginAnnouncementEdit(row) {
  try {
    editingAnnouncementId = row.id;
    document.getElementById('announcement-title').value = row.title || '';
    document.getElementById('announcement-body').value = row.body || '';
    document.getElementById('announcement-pinned').checked = !!row.pinned;
    document.getElementById('announcement-audience').value = row.audience === 'selected' ? 'selected' : 'everyone';
    selectedAnnouncementStudents = new Set();

    if (row.audience === 'selected') {
      const {data, error} = await supabase.from('announcement_recipients')
        .select('student_id').eq('announcement_id', row.id);
      if (error) throw error;
      selectedAnnouncementStudents = new Set((data || []).map(item => item.student_id));
    }

    renderAnnouncementStudents();
    document.getElementById('announcement-admin').classList.remove('hidden');
    document.getElementById('announcement-cancel-edit').classList.remove('hidden');
    document.getElementById('announcement-submit').textContent = tr('update');
    document.getElementById('announcement-title').focus();
    document.getElementById('announcement-admin').scrollIntoView({behavior:'smooth', block:'nearest'});
    status('announcement-status', '');
  } catch (error) {
    status('announcement-status', 'Could not open this announcement for editing: ' + (error?.message || error), true);
  }
}

async function loadAnnouncements() {
  const list = document.getElementById('announcement-list');
  list.replaceChildren(el('p', 'message-empty-note', 'Loading announcements…'));
  status('announcement-status', '');

  try {
    let result = await supabase.from('announcements')
      .select('id,title,body,created_at,pinned,audience,notify_in_notifications')
      .order('pinned', {ascending:false})
      .order('created_at', {ascending:false});

    if (result.error && /notify_in_notifications/i.test(result.error.message)) {
      result = await supabase.from('announcements')
        .select('id,title,body,created_at,pinned,audience')
        .order('pinned', {ascending:false})
        .order('created_at', {ascending:false});
    }
    if (result.error) throw result.error;

    let readSet = new Set();
    if (!professorMode()) {
      const reads = await supabase.from('announcement_reads')
        .select('announcement_id').eq('user_id', user.id);
      if (reads.error) throw reads.error;
      readSet = new Set((reads.data || []).map(item => item.announcement_id));
    }

    list.replaceChildren();
    if (!result.data?.length) {
      list.append(el('p', 'message-empty-note', tr('emptyAnnouncements')));
      return;
    }

    for (const row of result.data) {
      const card = el('article', 'announcement-item' + (row.pinned ? ' announcement-pinned' : ''));
      card.id = 'announcement-' + row.id;

      const heading = el('div', 'announcement-card-heading');
      heading.append(el('h3', '', row.title));
      if (row.pinned) heading.append(el('span', 'announcement-pill pinned', tr('pinned')));
      if (!professorMode() && row.notify_in_notifications !== false && !readSet.has(row.id)) {
        heading.append(el('span', 'announcement-pill new', tr('newAnnouncement')));
      }
      card.append(heading, el('time', '', dateText(row.created_at)), el('p', '', row.body));

      if (professorMode()) {
        const actions = el('div', 'announcement-actions');
        const edit = el('button', 'announcement-action', tr('edit'));
        edit.type = 'button';
        edit.addEventListener('click', () => { void beginAnnouncementEdit(row); });

        const pin = el('button', 'announcement-action', row.pinned ? tr('unpin') : tr('pin'));
        pin.type = 'button';
        pin.addEventListener('click', async () => {
          pin.disabled = true;
          try {
            const {error} = await supabase.from('announcements')
              .update({pinned:!row.pinned}).eq('id', row.id);
            if (error) throw error;
            await loadAnnouncements();
          } catch (error) {
            pin.disabled = false;
            status('announcement-status', 'Could not update announcement: ' + (error?.message || error), true);
          }
        });

        const remove = el('button', 'announcement-action danger', tr('delete'));
        remove.type = 'button';
        remove.addEventListener('click', async () => {
          if (!confirm(tr('confirmDelete'))) return;
          remove.disabled = true;
          try {
            const {error} = await supabase.from('announcements').delete().eq('id', row.id);
            if (error) throw error;
            if (editingAnnouncementId === row.id) resetAnnouncementEditor();
            status('announcement-status', tr('deleted'));
            await loadAnnouncements();
          } catch (error) {
            remove.disabled = false;
            status('announcement-status', 'Could not delete announcement: ' + (error?.message || error), true);
          }
        });

        actions.append(edit, pin, remove);
        card.append(actions);
      } else if (row.notify_in_notifications !== false && !readSet.has(row.id)) {
        const mark = el('button', 'announcement-action', tr('markRead'));
        mark.type = 'button';
        mark.addEventListener('click', async () => {
          mark.disabled = true;
          try {
            const {error} = await supabase.from('announcement_reads').upsert(
              {announcement_id:row.id, user_id:user.id},
              {onConflict:'announcement_id,user_id', ignoreDuplicates:true}
            );
            if (error) throw error;
            status('announcement-status', tr('markedRead'));
            await loadAnnouncements();
          } catch (error) {
            mark.disabled = false;
            status('announcement-status', 'Could not mark announcement as read: ' + (error?.message || error), true);
          }
        });
        card.append(mark);
      }
      list.append(card);
    }
  } catch (error) {
    list.replaceChildren(el('p', 'message-empty-note', 'Announcements could not be loaded.'));
    status('announcement-status', 'Announcements error: ' + (error?.message || error), true);
  }
}

async function loadAnnouncementStudents() {
  const container = document.getElementById('announcement-students');
  container.replaceChildren(el('p', 'message-empty-note', 'Loading students…'));
  try {
    const {data, error} = await supabase.rpc('get_echo_message_contacts');
    if (error) throw error;
    announcementStudents = (data || []).filter(item => item.role === 'student');
    renderAnnouncementStudents();
  } catch (error) {
    announcementStudents = [];
    container.replaceChildren(el('p', 'message-empty-note', 'Could not load students.'));
    status('announcement-status', 'Announcement recipient error: ' + (error?.message || error), true);
  }
}

function renderAnnouncementStudents() {
  const container = document.getElementById('announcement-students');
  if (!container) return;
  container.replaceChildren();
  const selectedAudience = document.getElementById('announcement-audience').value === 'selected';
  container.classList.toggle('hidden', !selectedAudience);
  if (!selectedAudience) return;

  if (!announcementStudents.length) {
    container.append(el('p', 'message-empty-note', 'No student accounts are available.'));
    return;
  }

  for (const student of announcementStudents) {
    const label = el('label', 'announcement-recipient');
    const checkbox = el('input');
    checkbox.type = 'checkbox';
    checkbox.value = student.user_id;
    checkbox.checked = selectedAnnouncementStudents.has(student.user_id);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) selectedAnnouncementStudents.add(student.user_id);
      else selectedAnnouncementStudents.delete(student.user_id);
    });
    label.append(checkbox, el('span', '', student.display_name || 'ECHO student'));
    container.append(label);
  }
}

async function loadUnreadCounts() {
  if (!user) return;
  try {
    const {data, error} = await supabase.from('private_messages')
      .select('sender_id').eq('recipient_id', user.id).is('read_at', null);
    if (error) throw error;
    unreadCounts = new Map();
    for (const row of data || []) {
      unreadCounts.set(row.sender_id, (unreadCounts.get(row.sender_id) || 0) + 1);
    }
    renderContacts();
  } catch (error) {
    status('messages-status', 'Could not load unread message counts: ' + (error?.message || error), true);
  }
}

function renderContacts() {
  const list = document.getElementById('message-contacts-list');
  list.replaceChildren();
  for (const contact of contacts) {
    const count = unreadCounts.get(contact.id) || 0;
    const button = el('button', 'message-contact' + (contact.id === contactId ? ' active' : ''));
    button.type = 'button';
    button.append(el('span', 'message-contact-name', contact.display_name || 'ECHO user'));
    if (count) {
      button.append(el('span', 'message-unread-count', count > 99 ? '99+' : String(count)));
      button.setAttribute('aria-label', (contact.display_name || 'ECHO user') + ', ' + count + ' ' + tr('unread'));
    }
    button.addEventListener('click', () => { void openConversation(contact.id); });
    list.append(button);
  }
  syncCallControls();
}

async function loadMessages() {
  const list = document.getElementById('message-list');
  list.replaceChildren();
  const contact = contacts.find(item => item.id === contactId);
  if (!contact || !user) {
    list.append(el('p', 'message-empty', tr('noContacts')));
    return;
  }

  try {
    const me = user.id;
    const other = contact.id;
    const expression = 'and(sender_id.eq.' + me + ',recipient_id.eq.' + other + '),and(sender_id.eq.' + other + ',recipient_id.eq.' + me + ')';
    const {data, error} = await supabase.from('private_messages')
      .select('id,sender_id,recipient_id,body,created_at,read_at')
      .or(expression).order('created_at', {ascending:true});
    if (error) throw error;

    list.replaceChildren();
    if (!data?.length) {
      list.append(el('p', 'message-empty', tr('emptyMessages')));
      await loadUnreadCounts();
      return;
    }

    const unreadIds = [];
    for (const row of data) {
      const bubble = el('article', 'message-bubble' + (row.sender_id === me ? ' sent' : ''));
      bubble.id = 'message-' + row.id;
      bubble.append(el('p', '', row.body), el('time', '', dateText(row.created_at)));
      list.append(bubble);
      if (row.sender_id === other && row.recipient_id === me && !row.read_at) unreadIds.push(row.id);
    }
    list.scrollTop = list.scrollHeight;

    if (unreadIds.length) {
      const marked = await supabase.from('private_messages')
        .update({read_at:new Date().toISOString()}).in('id', unreadIds);
      if (marked.error) throw marked.error;
      await loadUnreadCounts();
    }
    status('messages-status', '');
  } catch (error) {
    list.replaceChildren(el('p', 'message-empty', 'This conversation could not be loaded.'));
    status('messages-status', 'Private messages error: ' + (error?.message || error), true);
  }
}

async function openConversation(id) {
  const contact = contacts.find(item => item.id === id);
  if (!contact) return;
  contactId = id;
  renderContacts();
  document.getElementById('message-thread-heading').textContent = contact.display_name || tr('selectConversation');
  document.getElementById('message-input').disabled = false;
  document.getElementById('message-send').disabled = false;
  if (!activeCall) showCallStatus('');
  syncCallControls();
  await loadMessages();
}

async function loadContacts() {
  const list = document.getElementById('message-contacts-list');
  list.replaceChildren(el('p', 'message-empty-note', 'Loading conversations…'));
  try {
    const {data, error} = await supabase.rpc('get_echo_message_contacts');
    if (error) throw error;

    contacts = (data || []).map(item => ({
      id:item.user_id,
      display_name:item.display_name || 'ECHO user',
      role:item.role
    })).filter(item => item.id && item.id !== user?.id);

    if (!contacts.some(item => item.id === contactId)) contactId = contacts[0]?.id || null;
    await loadUnreadCounts();

    if (!contacts.length) {
      list.replaceChildren(el('p', 'message-empty-note', tr('noContacts')));
      document.getElementById('message-thread-heading').textContent = tr('selectConversation');
      document.getElementById('message-list').replaceChildren(el('p', 'message-empty', tr('noContacts')));
      document.getElementById('message-input').disabled = true;
      document.getElementById('message-send').disabled = true;
      status('messages-status', tr('noContacts'));
      syncCallControls();
      return;
    }

    status('messages-status', '');
    await openConversation(contactId);
  } catch (error) {
    contacts = [];
    contactId = null;
    renderContacts();
    list.replaceChildren(el('p', 'message-empty-note', 'Conversations could not be loaded.'));
    document.getElementById('message-list').replaceChildren(el('p', 'message-empty', tr('noContacts')));
    document.getElementById('message-input').disabled = true;
    document.getElementById('message-send').disabled = true;
    status('messages-status', 'Contacts error: ' + (error?.message || error), true);
  }
}

async function loadOwnerAccounts() {
  const list = document.getElementById('owner-role-list');
  list.replaceChildren(el('p', 'message-empty-note', 'Loading accounts…'));
  status('owner-status', '');

  if (!isOwner) {
    list.replaceChildren(el('p', 'message-empty-note', tr('denied')));
    status('owner-status', tr('denied'), true);
    return;
  }

  try {
    const {data, error} = await supabase.rpc('get_echo_role_candidates');
    if (error) throw error;
    const candidates = (data || []).filter(item =>
      !OWNER_EMAILS.has((item.email || '').trim().toLowerCase())
    );

    list.replaceChildren();
    if (!candidates.length) {
      list.append(el('p', 'message-empty-note', tr('noAccounts')));
      status('owner-status', '');
      return;
    }

    status('owner-status', candidates.length + (candidates.length === 1 ? ' eligible account.' : ' eligible accounts.'));
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
        try {
          const {error:updateError} = await supabase.rpc('set_echo_professor', {
            target_user_id:account.user_id,
            make_professor:account.role !== 'professor'
          });
          if (updateError) throw updateError;
          status('owner-status', tr('roleUpdated'));
          await loadOwnerAccounts();
          await Promise.allSettled([loadContacts(), loadAnnouncementStudents()]);
        } catch (error) {
          action.disabled = false;
          status('owner-status', 'Could not update permissions: ' + (error?.message || error), true);
        }
      });
      row.append(details, action);
      list.append(row);
    }
  } catch (error) {
    list.replaceChildren(el('p', 'message-empty-note', 'Account list could not be loaded.'));
    status('owner-status', 'Professor Access error: ' + (error?.message || error), true);
  }
}

function startMessageRefresh() {
  if (messagePoller) window.clearInterval(messagePoller);
  messagePoller = window.setInterval(() => {
    if (user && !document.hidden) {
      if (contactId) void loadMessages();
      void loadUnreadCounts();
    }
  }, 6000);
}
async function loadForSession(session) {
  if (!session?.user || !supabase) return;
  const sessionUser = session.user;
  if (initializedSessionUserId === sessionUser.id) return;
  initializedSessionUserId = sessionUser.id;
  user = sessionUser;

  const email = (user.email || '').trim().toLowerCase();
  const emailOwner = OWNER_EMAILS.has(email);
  isOwner = emailOwner;
  document.getElementById('owner-tab').classList.toggle('hidden', !emailOwner);
  status('owner-status', emailOwner ? 'Verifying owner access…' : '');

  // Owner identity is based on the authenticated email, with the database check
  // retained as a second confirmation for accounts granted owner status there.
  try {
    const {data, error} = await supabase.rpc('is_echo_owner');
    if (!error && data === true) isOwner = true;
    if (error && emailOwner) status('owner-status', 'Owner email recognized; database verification failed: ' + error.message, true);
  } catch (error) {
    if (emailOwner) status('owner-status', 'Owner email recognized; database verification failed: ' + (error?.message || error), true);
  }

  document.getElementById('owner-tab').classList.toggle('hidden', !isOwner);
  let profileError = null;
  try {
    const result = await supabase.from('profiles')
      .select('id,display_name,role').eq('id', user.id).maybeSingle();
    if (result.error) throw result.error;
    profile = result.data || {id:user.id, display_name:user.email, role:'student'};
  } catch (error) {
    profileError = error;
    profile = {id:user.id, display_name:user.email, role:'student'};
  }

  document.getElementById('announcement-admin').classList.toggle('hidden', !professorMode());
  if (profileError) {
    status('announcement-status', 'Profile lookup failed; announcement controls may be limited: ' + (profileError.message || profileError), true);
    status('messages-status', 'Profile lookup failed; message permissions may be limited: ' + (profileError.message || profileError), true);
  }

  const jobs = [
    ['announcement-status', loadAnnouncements],
    ['messages-status', loadContacts]
  ];
  if (isOwner) jobs.push(['owner-status', loadOwnerAccounts]);
  if (professorMode()) jobs.push(['announcement-status', loadAnnouncementStudents]);

  const results = await Promise.allSettled(jobs.map(([, task]) => task()));
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const target = jobs[index][0];
      status(target, 'Could not initialize this tab: ' + (result.reason?.message || result.reason || 'Unknown error'), true);
    }
  });
  startMessageRefresh();
  startIncomingCallRefresh();
}

function resetFeatureState() {
  if (messagePoller) { window.clearInterval(messagePoller); messagePoller = null; }
  if (incomingCallPoller) { window.clearInterval(incomingCallPoller); incomingCallPoller = null; }
  if (activeCall) void finishCall({updateServer:true, signal:false, statusText:tr('callEnded')});
  incomingCall = null;
  hideIncomingCall();
  initializedSessionUserId = null;
  user = null;
  profile = null;
  isOwner = false;
  contactId = null;
  contacts = [];
  unreadCounts = new Map();
  announcementStudents = [];
  selectedAnnouncementStudents = new Set();
  editingAnnouncementId = null;
  document.getElementById('owner-tab').classList.add('hidden');
  document.getElementById('announcement-admin').classList.add('hidden');
  document.getElementById('message-contacts-list').replaceChildren();
  document.getElementById('message-list').replaceChildren(el('p', 'message-empty', tr('selectConversation')));
  document.getElementById('message-input').disabled = true;
  document.getElementById('message-send').disabled = true;
  document.getElementById('owner-role-list').replaceChildren();
  document.getElementById('announcement-list').replaceChildren();
  resetAnnouncementEditor();
}

document.getElementById('announcement-audience').addEventListener('change', () => renderAnnouncementStudents());
document.getElementById('announcement-cancel-edit').addEventListener('click', () => resetAnnouncementEditor());

document.getElementById('announcement-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (!professorMode() || !user) {
    status('announcement-status', tr('professorOnly'), true);
    return;
  }

  const title = document.getElementById('announcement-title').value.trim();
  const body = document.getElementById('announcement-body').value.trim();
  const audience = document.getElementById('announcement-audience').value;
  const recipients = [...selectedAnnouncementStudents];
  if (!title || !body) return;
  if (audience === 'selected' && !recipients.length) {
    status('announcement-status', tr('recipientsRequired'), true);
    return;
  }

  const button = document.getElementById('announcement-submit');
  button.disabled = true;
  const wasEditing = !!editingAnnouncementId;
  try {
    const {error} = await supabase.rpc('save_echo_announcement', {
      announcement_title:title,
      announcement_body:body,
      announcement_pinned:document.getElementById('announcement-pinned').checked,
      announcement_audience:audience,
      recipient_ids:recipients,
      target_announcement_id:editingAnnouncementId
    });
    if (error) throw error;
    resetAnnouncementEditor();
    status('announcement-status', wasEditing ? tr('updated') : tr('published'));
    await loadAnnouncements();
  } catch (error) {
    status('announcement-status', 'Could not save announcement: ' + (error?.message || error), true);
  } finally {
    button.disabled = false;
  }
});

document.getElementById('message-form').addEventListener('submit', async event => {
  event.preventDefault();
  const body = document.getElementById('message-input').value.trim();
  const recipient = contacts.find(item => item.id === contactId);
  if (!body || !recipient || !user || sendingPrivateMessage) return;

  sendingPrivateMessage = true;
  const button = document.getElementById('message-send');
  button.disabled = true;
  try {
    const {error} = await supabase.from('private_messages').insert({
      sender_id:user.id,
      recipient_id:recipient.id,
      body
    });
    if (error) throw error;
    document.getElementById('message-input').value = '';
    status('messages-status', tr('sent'));
    await loadMessages();
  } catch (error) {
    status('messages-status', 'Could not send message: ' + (error?.message || error), true);
  } finally {
    sendingPrivateMessage = false;
    button.disabled = !contacts.some(item => item.id === contactId);
  }
});

document.getElementById('start-call').addEventListener('click', () => { void startVoiceCall(); });
document.getElementById('end-call').addEventListener('click', () => {
  void finishCall({updateServer:true, signal:true, statusText:tr('callEnded')});
});
document.getElementById('accept-call').addEventListener('click', () => { void acceptIncomingCall(); });
document.getElementById('decline-call').addEventListener('click', () => { void declineIncomingCall(); });

function activateTab(name) {
  document.getElementById('dashboard-welcome')?.classList.toggle('hidden', name !== 'lessons');
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
document.getElementById('owner-tab').addEventListener('click', () => { void loadOwnerAccounts(); });

// Notifications dispatch these events so the target item opens in its full panel.
window.addEventListener('echo:open-announcement', async event => {
  const id=event.detail?.id;
  if(!id)return;
  activateTab('announcements');
  let target=document.getElementById('announcement-'+id);
  if(!target){await loadAnnouncements();target=document.getElementById('announcement-'+id);}
  if(target){
    target.scrollIntoView({behavior:'smooth',block:'center'});
    target.classList.add('announcement-open-target');
    window.setTimeout(()=>target.classList.remove('announcement-open-target'),1800);
  }else{
    status('announcement-status','This announcement is no longer available.',true);
  }
});
window.addEventListener('echo:open-message', async event => {
  const {senderId,messageId}=event.detail||{};
  if(!senderId)return;
  activateTab('messages');
  if(!contacts.some(item=>item.id===senderId))await loadContacts();
  if(!contacts.some(item=>item.id===senderId)){
    status('messages-status','This sender is not an available conversation.',true);
    return;
  }
  await openConversation(senderId);
  if(messageId){
    const target=document.getElementById('message-'+messageId);
    target?.scrollIntoView({behavior:'smooth',block:'center'});
  }
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
