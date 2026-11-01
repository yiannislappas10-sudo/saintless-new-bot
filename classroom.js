import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const classroomStyle = document.createElement('link');
classroomStyle.rel = 'stylesheet';
classroomStyle.href = '/classroom.css?v=20261101-student-search';
document.head.append(classroomStyle);

const OWNER_EMAILS = new Set(['yiannislappas8@gmail.com', 'yiannislappas10@gmail.com']);
const ZONE = 'Europe/Athens';
const lang = () => localStorage.getItem('echo-language') === 'el' ? 'el' : 'en';
const words = {
  en:{
    tab:'Classes',title:'Class management',intro:'Create lessons, assign students and manage your teaching timetable.',speakerOutput:'Speaker output test',sfuCheck:'Live media server API connection',announcementCheck:'Announcements database access',messageCheck:'Private messaging database access',profileCheck:'Your profile access',speakerQuestion:'Did you hear the test tone clearly?',startClass:'Start class',endClass:'End class',waitingProfessor:'Waiting for professor',prejoinTitle:'Prepare to join',joinNow:'Enter classroom',leave:'Leave classroom',microphone:'Microphone',camera:'Camera',speakerTest:'Test speakers',cameraUnavailable:'Camera unavailable — joining with audio only.',mediaDenied:'Microphone or camera permission was denied.',mediaReady:'Your devices are ready.',mediaConnecting:'Connecting to classroom…',mediaConnected:'Connected to live classroom.',mediaDisconnected:'Connection lost or timed out. Check your network, permissions and device, then retry.',mediaEnded:'The professor ended this class.',tapUnmute:'Tap a participant video to enable audio playback.',joined:'Joined',notJoined:'Not joined',mute:'Mute',unmute:'Unmute',cameraOff:'Camera off',cameraOn:'Camera on',materials:'Learning materials',
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
    demoMode:'Demo classes are visible only to the Primary Owner.',demoStudents:'Demo participants (one name per line)',classProfessor:'Professor',previewStudent:'Preview student view',previewProfessor:'Preview professor view',endPreview:'Exit preview',previewBanner:'Preview only. Database permissions and real accounts are unchanged.',allowUnassigned:'Allow students not assigned to this class',noMaterials:'No learning materials added yet.',materialTitle:'Material title',materialURL:'Secure link (https://)',addMaterial:'Add material',attendance:'Attendance',noAttendance:'No attendance recorded yet.',
    testTab:'Testing Center',testTitle:'Platform checks',testIntro:'Checks report actual service responses. No test will change real classes.',
    authCheck:'Authentication session',dbCheck:'Class database access',roleCheck:'Owner permissions',demoCrudCheck:'Isolated demo create, read, update and delete',mediaCheck:'Camera and microphone permissions',
    runChecks:'Run checks',passed:'Passed',failed:'Failed',notTested:'Not tested',
    migration:'Classroom database migration is required before classes can be used.',
    liveUnavailable:'Live audio/video is not configured yet. The class schedule and attendance are separate and remain available.',
    rosterError:'Could not update the student list. Review the class and try again.',
    list:'List',searchClasses:'Search classes…',allStatuses:'All statuses',lifecycleStatus:'Class status',activeStatus:'Active',upcomingStatus:'Upcoming',archivedStatus:'Archived',location:'Classroom / meeting location',capacity:'Maximum students (optional)',assignedProfessor:'Assigned professor',studentSearch:'Search students…',selectedCount:'selected',studentCount:'students assigned',noMatchingStudents:'No matching students.',archive:'Archive class',unarchive:'Restore class',classArchived:'This class is archived.',saveRoster:'Save class and roster',statusLabel:'Status',scheduleLabel:'Schedule',classLocation:'Location',capacityReached:'Selected groups exceed this lesson capacity.',
    lessonsTab:'Lessons',groupsTab:'Class Groups',myLessons:'My Lessons',myClasses:'My Classes',groupsIntro:'Create private student groups and manage their membership.',myClassesIntro:'Groups you are currently enrolled in.',newGroup:'Create group',editGroup:'Edit group',groupName:'Group name',groupDescription:'Description (optional)',members:'Members',memberSearch:'Search students…',groupSearch:'Search groups…',groupSaved:'Group saved.',groupSaveError:'Could not save this group.',noGroups:'No class groups have been created yet.',noMatchingGroups:'No matching groups.',assignToClasses:'Assign to Classes',selectedGroups:'Selected classes',groupsStudentCount:'students will receive access',selectGroups:'Choose one or more groups',groupsRequired:'Assign at least one class group before publishing.',draft:'Draft',published:'Published',saveDraft:'Save draft',publishLesson:'Publish lesson',studentCountLabel:'students',noGroupsAvailable:'Create a class group before assigning this lesson.',memberCount:'members',groupManagerTitle:'Class group management',studentMember:'You are a member of this class.',groupCreated:'Group created.',lessonAccess:'Lesson access',
    fullScreen:'Full screen',exitFullScreen:'Exit full screen',shareScreen:'Share screen',stopSharing:'Stop sharing',screenShareUnavailable:'Screen sharing is not available in this browser.',screenShareDenied:'Screen sharing permission was denied.',raiseHand:'Raise hand',lowerHand:'Lower hand',handRaised:'Hand raised',reactions:'Reactions',muteParticipant:'Mute participant',unmuteParticipant:'Allow microphone',turnCameraOff:'Turn camera off',allowCamera:'Allow camera',stopParticipantShare:'Stop screen share',removeParticipant:'Remove from meeting',readmit:'Restore meeting access',removedFromMeeting:'The teacher removed you from this meeting.',mutedByTeacher:'Your microphone was muted by the teacher.',teacherMuted:'The teacher has muted your microphone.',teacherCameraOff:'The teacher turned off your camera.',reactionSent:'Reaction sent',meetingControls:'Meeting controls',sharing:'Sharing screen',noScreenShare:'No one is sharing a screen.',
  },
  el:{
    tab:'Μαθήματα',title:'Διαχείριση μαθημάτων',intro:'Δημιουργήστε μαθήματα, αναθέστε μαθητές και διαχειριστείτε το πρόγραμμά σας.',speakerOutput:'Έλεγχος ήχου ηχείων',sfuCheck:'Σύνδεση με τον διακομιστή ζωντανής μετάδοσης',announcementCheck:'Πρόσβαση στη βάση ανακοινώσεων',messageCheck:'Πρόσβαση στη βάση μηνυμάτων',profileCheck:'Πρόσβαση στο προφίλ σας',speakerQuestion:'Ακούσατε καθαρά τον δοκιμαστικό ήχο;',startClass:'Έναρξη μαθήματος',endClass:'Τερματισμός μαθήματος',waitingProfessor:'Αναμονή καθηγητή',prejoinTitle:'Προετοιμασία συμμετοχής',joinNow:'Είσοδος στην τάξη',leave:'Αποχώρηση από την τάξη',microphone:'Μικρόφωνο',camera:'Κάμερα',speakerTest:'Έλεγχος ηχείων',cameraUnavailable:'Η κάμερα δεν είναι διαθέσιμη — συμμετοχή μόνο με ήχο.',mediaDenied:'Δεν δόθηκε άδεια για μικρόφωνο ή κάμερα.',mediaReady:'Οι συσκευές είναι έτοιμες.',mediaConnecting:'Σύνδεση με την τάξη…',mediaConnected:'Συνδεθήκατε στη ζωντανή τάξη.',mediaDisconnected:'Η σύνδεση χάθηκε ή έληξε. Ελέγξτε το δίκτυο, τις άδειες και τη συσκευή σας.',mediaEnded:'Ο καθηγητής τερμάτισε το μάθημα.',tapUnmute:'Πατήστε στο βίντεο ενός συμμετέχοντα για ενεργοποίηση του ήχου.',joined:'Συνδέθηκε',notJoined:'Δεν συνδέθηκε',mute:'Σίγαση',unmute:'Ενεργοποίηση μικροφώνου',cameraOff:'Κάμερα κλειστή',cameraOn:'Κάμερα ανοιχτή',materials:'Εκπαιδευτικό υλικό',
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
    demoMode:'Οι δοκιμαστικές τάξεις είναι ορατές μόνο στον Κύριο Ιδιοκτήτη.',demoStudents:'Δοκιμαστικοί συμμετέχοντες (ένα όνομα ανά γραμμή)',classProfessor:'Καθηγητής',previewStudent:'Προεπισκόπηση μαθητή',previewProfessor:'Προεπισκόπηση καθηγητή',endPreview:'Έξοδος από προεπισκόπηση',previewBanner:'Μόνο προεπισκόπηση. Τα δικαιώματα βάσης και οι πραγματικοί λογαριασμοί δεν αλλάζουν.',allowUnassigned:'Επιτρέπονται μαθητές χωρίς ανάθεση',noMaterials:'Δεν έχουν προστεθεί εκπαιδευτικά αρχεία.',materialTitle:'Τίτλος υλικού',materialURL:'Ασφαλής σύνδεσμος (https://)',addMaterial:'Προσθήκη υλικού',attendance:'Παρουσίες',noAttendance:'Δεν υπάρχουν καταχωρημένες παρουσίες.',
    testTab:'Κέντρο δοκιμών',testTitle:'Έλεγχοι πλατφόρμας',testIntro:'Οι έλεγχοι βασίζονται σε πραγματικές απαντήσεις υπηρεσιών.',
    authCheck:'Συνεδρία σύνδεσης',dbCheck:'Πρόσβαση στη βάση μαθημάτων',roleCheck:'Δικαιώματα ιδιοκτήτη',demoCrudCheck:'Δημιουργία, ανάγνωση, επεξεργασία και διαγραφή demo',mediaCheck:'Άδειες κάμερας και μικροφώνου',
    runChecks:'Εκτέλεση ελέγχων',passed:'Επιτυχία',failed:'Αποτυχία',notTested:'Δεν ελέγχθηκε',
    migration:'Απαιτείται η μεταφορά της βάσης μαθημάτων.',liveUnavailable:'Δεν έχει ρυθμιστεί ακόμη η ζωντανή κλήση ήχου/εικόνας.',
    rosterError:'Δεν ήταν δυνατή η ενημέρωση των μαθητών.',
    list:'Λίστα',searchClasses:'Αναζήτηση μαθημάτων…',allStatuses:'Όλες οι καταστάσεις',lifecycleStatus:'Κατάσταση μαθήματος',activeStatus:'Ενεργό',upcomingStatus:'Προσεχές',archivedStatus:'Αρχειοθετημένο',location:'Αίθουσα / τοποθεσία',capacity:'Μέγιστος αριθμός μαθητών (προαιρετικό)',assignedProfessor:'Ανατεθειμένος καθηγητής',studentSearch:'Αναζήτηση μαθητών…',selectedCount:'επιλεγμένοι',studentCount:'μαθητές',noMatchingStudents:'Δεν βρέθηκαν μαθητές.',archive:'Αρχειοθέτηση',unarchive:'Επαναφορά',classArchived:'Αυτό το μάθημα είναι αρχειοθετημένο.',saveRoster:'Αποθήκευση μαθήματος και μαθητών',statusLabel:'Κατάσταση',scheduleLabel:'Πρόγραμμα',classLocation:'Τοποθεσία',capacityReached:'Οι επιλεγμένες ομάδες υπερβαίνουν τη χωρητικότητα του μαθήματος.',
    lessonsTab:'Μαθήματα',groupsTab:'Τμήματα',myLessons:'Τα μαθήματά μου',myClasses:'Τα τμήματά μου',groupsIntro:'Δημιουργήστε ιδιωτικά τμήματα μαθητών και διαχειριστείτε τα μέλη τους.',myClassesIntro:'Τα τμήματα στα οποία συμμετέχετε.',newGroup:'Δημιουργία τμήματος',editGroup:'Επεξεργασία τμήματος',groupName:'Όνομα τμήματος',groupDescription:'Περιγραφή (προαιρετικά)',members:'Μέλη',memberSearch:'Αναζήτηση μαθητών…',groupSearch:'Αναζήτηση τμημάτων…',groupSaved:'Το τμήμα αποθηκεύτηκε.',groupSaveError:'Δεν ήταν δυνατή η αποθήκευση του τμήματος.',noGroups:'Δεν έχουν δημιουργηθεί ακόμη τμήματα.',noMatchingGroups:'Δεν βρέθηκαν τμήματα.',assignToClasses:'Ανάθεση σε τμήματα',selectedGroups:'Επιλεγμένα τμήματα',groupsStudentCount:'μαθητές θα αποκτήσουν πρόσβαση',selectGroups:'Επιλέξτε ένα ή περισσότερα τμήματα',groupsRequired:'Αναθέστε τουλάχιστον ένα τμήμα πριν από τη δημοσίευση.',draft:'Πρόχειρο',published:'Δημοσιευμένο',saveDraft:'Αποθήκευση πρόχειρου',publishLesson:'Δημοσίευση μαθήματος',studentCountLabel:'μαθητές',noGroupsAvailable:'Δημιουργήστε ένα τμήμα πριν αναθέσετε αυτό το μάθημα.',memberCount:'μέλη',groupManagerTitle:'Διαχείριση τμημάτων',studentMember:'Συμμετέχετε σε αυτό το τμήμα.',groupCreated:'Το τμήμα δημιουργήθηκε.',lessonAccess:'Πρόσβαση μαθήματος',
    fullScreen:'Πλήρης οθόνη',exitFullScreen:'Έξοδος πλήρους οθόνης',shareScreen:'Κοινή χρήση οθόνης',stopSharing:'Διακοπή κοινής χρήσης',screenShareUnavailable:'Η κοινή χρήση οθόνης δεν υποστηρίζεται σε αυτό το πρόγραμμα περιήγησης.',screenShareDenied:'Δεν δόθηκε άδεια για κοινή χρήση οθόνης.',raiseHand:'Σήκωμα χεριού',lowerHand:'Κατέβασμα χεριού',handRaised:'Σηκωμένο χέρι',reactions:'Αντιδράσεις',muteParticipant:'Σίγαση συμμετέχοντα',unmuteParticipant:'Ενεργοποίηση μικροφώνου',turnCameraOff:'Απενεργοποίηση κάμερας',allowCamera:'Ενεργοποίηση κάμερας',stopParticipantShare:'Διακοπή κοινής χρήσης οθόνης',removeParticipant:'Αφαίρεση από τη συνάντηση',readmit:'Επαναφορά πρόσβασης στη συνάντηση',removedFromMeeting:'Ο καθηγητής σας αφαίρεσε από τη συνάντηση.',mutedByTeacher:'Ο καθηγητής έκανε σίγαση στο μικρόφωνό σας.',teacherMuted:'Ο καθηγητής έχει κάνει σίγαση στο μικρόφωνό σας.',teacherCameraOff:'Ο καθηγητής απενεργοποίησε την κάμερά σας.',reactionSent:'Η αντίδραση στάλθηκε',meetingControls:'Έλεγχος συνάντησης',sharing:'Κοινή χρήση οθόνης',noScreenShare:'Κανείς δεν μοιράζεται την οθόνη του.'
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
let db=null,user=null,profile=null,isOwner=false,classes=[],students=[],professors=[],groups=[],groupMemberships=[],selected=null,selectedDemo=false,selectedGroup=null,view='week',classSection='lessons',cursor=new Date(),ownerPreviewRole=null,waitingRoomTimer=null;
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
 <div class="class-section-tabs"><button type="button" id="class-lessons-tab" class="active">${t('lessonsTab')}</button><button type="button" id="class-groups-tab">${t('groupsTab')}</button></div>
 <section id="class-lessons-section">
 <div class="class-toolbar class-manager-toolbar"><div class="class-view-switch"><button type="button" data-view="day">${t('day')}</button><button type="button" data-view="week" class="active">${t('week')}</button><button type="button" data-view="month">${t('month')}</button><button type="button" data-view="list">${t('list')}</button></div><div class="class-date-nav"><button type="button" id="class-prev" aria-label="Previous period">‹</button><strong id="class-period"></strong><button type="button" id="class-next" aria-label="Next period">›</button></div></div>
 <div class="class-management-filters"><input id="class-search" type="search" placeholder="${t('searchClasses')}" autocomplete="off"><select id="class-lifecycle-filter" aria-label="${t('lifecycleStatus')}"><option value="">${t('allStatuses')}</option><option value="active">${t('activeStatus')}</option><option value="upcoming">${t('upcomingStatus')}</option><option value="archived">${t('archivedStatus')}</option></select></div>
 <div id="class-editor" class="class-editor hidden"><form id="class-form">
  <div class="class-form-grid">
   <label>${t('name')}<input id="class-title" maxlength="140" required></label>
   <label>${t('subject')}<input id="class-subject" maxlength="100" required></label>
   <label class="class-form-wide">${t('description')}<textarea id="class-description" rows="3" maxlength="5000"></textarea></label>
   <label class="class-form-wide">${t('image')}<input id="class-image" type="url" maxlength="2048"></label>
   <label>${t('start')}<input id="class-start" type="datetime-local" required></label>
   <label>${t('end')}<input id="class-end" type="datetime-local" required></label>
   <label id="class-professor-wrap">${t('assignedProfessor')}<select id="class-professor"></select></label>
   <label>${t('location')}<input id="class-location" maxlength="160"></label>
   <label>${t('capacity')}<input id="class-capacity" type="number" min="1" max="5000" step="1"></label>
   <label>${t('lifecycleStatus')}<select id="class-lifecycle"><option value="upcoming">${t('upcomingStatus')}</option><option value="active">${t('activeStatus')}</option><option value="archived">${t('archivedStatus')}</option></select></label>
   <label>${t('published')}<select id="class-publication"><option value="draft">${t('draft')}</option><option value="published">${t('published')}</option></select></label>
  </div>
  <div class="class-student-picker" id="class-group-picker"><div class="class-picker-heading"><strong>${t('assignToClasses')}</strong><span id="class-group-count"></span></div><div id="class-group-selection" class="class-student-selection"></div><div class="class-student-search-wrap"><input id="class-group-search" type="search" placeholder="${t('groupSearch')}" autocomplete="off" aria-autocomplete="list" aria-controls="class-group-options"><div id="class-group-options" role="listbox" aria-multiselectable="true"></div></div><p id="class-group-summary" class="class-form-status"></p></div>
  <div class="class-demo-picker hidden" id="class-demo-picker"><label>${t('demoStudents')}<textarea id="class-demo-names" rows="3" maxlength="1200" placeholder="Demo Student 1&#10;Demo Student 2"></textarea></label></div>
  <div class="class-form-options">
   <label class="class-inline"><input id="class-demo" type="checkbox"> ${t('demo')}</label>
   <label class="class-inline"><input id="class-repeat" type="checkbox"> ${t('recurrence')} <input id="class-repeat-count" type="number" min="2" max="16" value="4" class="class-repeat-count"></label>
  </div>
  <p class="class-form-status" id="class-form-status" role="status"></p>
  <div class="class-form-actions"><button type="button" class="btn" id="class-cancel">${t('cancel')}</button><button type="submit" class="btn btn-dark" id="class-save">${t('save')}</button></div>
 </form></div>
 <div id="class-list" class="class-list" aria-live="polite"></div><p class="class-status" id="class-status" role="status"></p>
 <div id="class-detail" class="class-detail hidden"></div>
 </section>
 <section id="class-groups-section" class="hidden">
  <div class="class-groups-heading"><div><h3 id="class-groups-title">${t('groupManagerTitle')}</h3><p id="class-groups-intro">${t('groupsIntro')}</p></div><button type="button" class="btn btn-dark" id="class-group-new">${t('newGroup')}</button></div>
  <input id="class-group-search-filter" class="class-group-search-filter" type="search" placeholder="${t('groupSearch')}" autocomplete="off">
  <div id="class-group-editor" class="class-group-editor hidden">
   <form id="class-group-form">
    <div class="class-form-grid"><label>${t('groupName')}<input id="class-group-name" maxlength="100" required></label><label class="class-form-wide">${t('groupDescription')}<textarea id="class-group-description" rows="2" maxlength="2000"></textarea></label><label id="class-group-professor-wrap">${t('assignedProfessor')}<select id="class-group-professor"></select></label></div>
    <div class="class-student-picker" id="class-group-member-picker"><div class="class-picker-heading"><strong>${t('members')}</strong><span id="class-group-member-count"></span></div><div id="class-group-member-selection" class="class-student-selection"></div><div class="class-student-search-wrap"><input id="class-group-member-search" type="search" placeholder="${t('memberSearch')}" autocomplete="off" aria-autocomplete="list" aria-controls="class-group-member-options"><div id="class-group-member-options" role="listbox" aria-multiselectable="true"></div></div></div>
    <p id="class-group-form-status" class="class-form-status" role="status"></p>
    <div class="class-form-actions"><button type="button" class="btn" id="class-group-cancel">${t('cancel')}</button><button type="submit" class="btn btn-dark" id="class-group-save">${t('save')}</button></div>
   </form>
  </div>
  <div id="class-group-list" class="class-group-list" aria-live="polite"></div>
  <p class="class-status" id="class-group-status" role="status"></p>
 </section>`;
const testing=document.createElement('section');testing.className='panel';testing.id='panel-testing';
testing.innerHTML=`<div class="panel-heading"><div><h2>${t('testTitle')}</h2><p>${t('testIntro')}</p></div><div class="class-test-actions"><button class="btn" id="class-speaker-check">${t('speakerOutput')}</button><button class="btn btn-dark" id="class-run-checks">${t('runChecks')}</button></div></div><div class="class-preview-controls"><button type="button" class="btn" id="class-preview-student">${t('previewStudent')}</button><button type="button" class="btn" id="class-preview-professor">${t('previewProfessor')}</button><button type="button" class="btn hidden" id="class-preview-end">${t('endPreview')}</button><p id="class-preview-banner" class="hidden">${t('previewBanner')}</p></div><div class="class-test-results" id="class-test-results"></div>`;
host.append(panel,testing);
const roomOverlay=document.createElement('div');
roomOverlay.className='class-room-overlay hidden';
roomOverlay.id='class-room-overlay';
roomOverlay.innerHTML=`
 <section class="class-room-shell" role="dialog" aria-modal="true" aria-labelledby="class-room-title">
  <header class="class-room-header">
   <div class="class-room-heading"><p class="class-room-eyebrow">ECHO · LIVE CLASSROOM</p><h2 id="class-room-title"></h2><p id="class-room-status" role="status"></p></div>
   <div class="class-room-header-actions"><span class="class-room-live-indicator">LIVE</span><button type="button" class="btn" id="class-room-fullscreen">${t('fullScreen')}</button><button type="button" class="btn" id="class-room-close">${t('cancel')}</button></div>
  </header>
  <div class="class-room-prejoin" id="class-room-prejoin">
   <div class="class-room-preview"><video id="class-preview-video" autoplay playsinline muted></video><div id="class-preview-placeholder"></div></div>
   <div class="class-room-controls"><button type="button" class="btn" id="class-mic-toggle">${t('microphone')}</button><button type="button" class="btn" id="class-camera-toggle">${t('camera')}</button><button type="button" class="btn" id="class-speaker-test">${t('speakerTest')}</button><button type="button" class="btn btn-dark" id="class-room-enter">${t('joinNow')}</button></div>
  </div>
  <div class="class-room-stage hidden" id="class-room-stage">
   <div class="class-room-videos" id="class-room-videos"></div>
   <aside class="class-room-roster"><div class="class-room-roster-heading"><strong>${t('roster')}</strong><span id="class-room-participant-count">0</span></div><div id="class-room-roster-list"></div></aside>
  </div>
  <footer class="class-room-footer hidden" id="class-room-footer">
   <span id="class-room-connection"></span>
   <div class="class-room-primary-controls">
    <button type="button" class="btn" id="class-live-mic">${t('mute')}</button>
    <button type="button" class="btn" id="class-live-camera">${t('cameraOff')}</button>
    <button type="button" class="btn" id="class-share-screen">${t('shareScreen')}</button>
    <button type="button" class="btn" id="class-raise-hand">${t('raiseHand')}</button>
   </div>
   <div class="class-room-reaction-controls" aria-label="${t('reactions')}">
    <button type="button" class="class-room-emoji" data-reaction="👍" aria-label="👍">👍</button>
    <button type="button" class="class-room-emoji" data-reaction="❤️" aria-label="❤️">❤️</button>
    <button type="button" class="class-room-emoji" data-reaction="😂" aria-label="😂">😂</button>
    <button type="button" class="class-room-emoji" data-reaction="👏" aria-label="👏">👏</button>
    <button type="button" class="class-room-emoji" data-reaction="🎉" aria-label="🎉">🎉</button>
    <button type="button" class="class-room-emoji" data-reaction="👀" aria-label="👀">👀</button>
   </div>
   <button type="button" class="btn btn-danger" id="class-room-leave">${t('leave')}</button>
  </footer>
 </section>`;
document.body.append(roomOverlay);
let activeRoom=null,callJoinPending=false,roomAudioContext=null;
const ROOM_REACTIONS=new Set(['👍','❤️','😂','👏','🎉','👀']);
function activate(name){document.getElementById('dashboard-welcome')?.classList.toggle('hidden',name!=='lessons');document.querySelectorAll('.nav-tabs [data-tab]').forEach(b=>{const on=b.dataset.tab===name;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on));});document.querySelectorAll('#app-shell .panel').forEach(p=>p.classList.toggle('active',p.id==='panel-'+name));}
nav.addEventListener('click',e=>{const b=e.target.closest('[data-tab="classes"],[data-tab="testing"]');if(b)activate(b.dataset.tab);});
document.getElementById('class-new').addEventListener('click',()=>void openEditor());
document.getElementById('class-cancel').addEventListener('click',closeEditor);
document.getElementById('class-lessons-tab').addEventListener('click',()=>showClassSection('lessons'));
document.getElementById('class-groups-tab').addEventListener('click',()=>showClassSection('groups'));
document.getElementById('class-group-new').addEventListener('click',()=>openGroupEditor());
document.getElementById('class-group-cancel').addEventListener('click',closeGroupEditor);
document.getElementById('class-group-form').addEventListener('submit',saveGroup);
document.getElementById('class-group-search-filter').addEventListener('input',renderGroups);
document.getElementById('class-group-member-search').addEventListener('input',filterGroupMemberPicker);
document.getElementById('class-group-search').addEventListener('input',filterLessonGroupPicker);
document.getElementById('class-publication').addEventListener('change',updateLessonSaveLabel);
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===b));renderClasses();}));
document.getElementById('class-prev').addEventListener('click',()=>moveCursor(-1));
document.getElementById('class-next').addEventListener('click',()=>moveCursor(1));
document.getElementById('class-form').addEventListener('submit',saveClass);
document.getElementById('class-search').addEventListener('input',renderClasses);
document.getElementById('class-lifecycle-filter').addEventListener('change',renderClasses);
document.getElementById('class-demo').addEventListener('change',toggleDemoEditor);
document.getElementById('class-run-checks').addEventListener('click',runChecks);
document.getElementById('class-preview-student').addEventListener('click',()=>setPreview('student'));
document.getElementById('class-preview-professor').addEventListener('click',()=>setPreview('professor'));
document.getElementById('class-preview-end').addEventListener('click',()=>setPreview(null));
document.getElementById('class-speaker-check').addEventListener('click',runSpeakerCheck);
document.getElementById('class-live-mic').addEventListener('click',toggleRoomMic);
document.getElementById('class-live-camera').addEventListener('click',toggleRoomCamera);
document.getElementById('class-share-screen').addEventListener('click',()=>{void toggleScreenShare();});
document.getElementById('class-raise-hand').addEventListener('click',()=>{void toggleRaiseHand();});
document.getElementById('class-room-fullscreen').addEventListener('click',()=>{void toggleRoomFullscreen();});
document.addEventListener('fullscreenchange',()=>{const button=document.getElementById('class-room-fullscreen');if(button)button.textContent=document.fullscreenElement?t('exitFullScreen'):t('fullScreen');});
document.querySelectorAll('.class-room-emoji').forEach(button=>button.addEventListener('click',()=>{void sendRoomReaction(button.dataset.reaction);}));
document.getElementById('class-room-close').addEventListener('click',()=>{if(activeRoom)void leaveRoom();else closePrejoin();});
document.getElementById('class-room-enter').addEventListener('click',()=>{void enterRoom();});
document.getElementById('class-room-leave').addEventListener('click',()=>{void leaveRoom();});
document.getElementById('class-mic-toggle').addEventListener('click',toggleRoomMic);
document.getElementById('class-camera-toggle').addEventListener('click',toggleRoomCamera);
document.getElementById('class-speaker-test').addEventListener('click',testRoomSpeaker);
function showClassSection(name){
 classSection=name;
 const lessons=name==='lessons';
 document.getElementById('class-lessons-section').classList.toggle('hidden',!lessons);
 document.getElementById('class-groups-section').classList.toggle('hidden',lessons);
 document.getElementById('class-lessons-tab').classList.toggle('active',lessons);
 document.getElementById('class-groups-tab').classList.toggle('active',!lessons);
 document.getElementById('class-new').classList.toggle('hidden',!lessons||!professorMode());
 document.getElementById('class-group-new').classList.toggle('hidden',lessons||!professorMode());
 if(!lessons)void loadGroups();
}
function toggleDemoEditor(){
 const demo=isOwner&&document.getElementById('class-demo').checked;
 document.getElementById('class-group-picker').classList.toggle('hidden',demo);
 document.getElementById('class-demo-picker').classList.toggle('hidden',!demo);
 document.getElementById('class-publication').disabled=demo;
 if(demo)document.getElementById('class-publication').value='draft';
 updateLessonSaveLabel();
}
function shiftAthensDate(value,days){
 const [y,m,d]=value.split('-').map(Number);
 return new Date(Date.UTC(y,m-1,d+days)).toISOString().slice(0,10);
}
function moveCursor(n){
 const p=athensParts(cursor);let date=p.year+'-'+p.month+'-'+p.day;
 if(view==='month'){
  const next=new Date(Date.UTC(Number(p.year),Number(p.month)-1+n,15));
  date=next.toISOString().slice(0,10);
 }else date=shiftAthensDate(date,n*(view==='week'?7:1));
 cursor=new Date(toAthensISO(date+'T12:00'));renderClasses();
}
function periodBounds(){
 const p=athensParts(cursor),date=p.year+'-'+p.month+'-'+p.day;
 if(view==='day')return [new Date(toAthensISO(date+'T00:00')),new Date(toAthensISO(shiftAthensDate(date,1)+'T00:00'))];
 if(view==='week'){
  const utcDay=new Date(Date.UTC(Number(p.year),Number(p.month)-1,Number(p.day))).getUTCDay();
  const monday=shiftAthensDate(date,-((utcDay+6)%7));
  return [new Date(toAthensISO(monday+'T00:00')),new Date(toAthensISO(shiftAthensDate(monday,7)+'T00:00'))];
 }
 const first=p.year+'-'+p.month+'-01';
 const next=new Date(Date.UTC(Number(p.year),Number(p.month),1)).toISOString().slice(0,10);
 return [new Date(toAthensISO(first+'T00:00')),new Date(toAthensISO(next+'T00:00'))];
}
function classStatus(c){if(c.status==='cancelled')return 'cancelled';if(Date.now()>new Date(c.ends_at).getTime())return 'completed';if(c.liveRoom?.status==='live')return 'live';return 'upcoming';}
function dateKey(value){
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(value));
 const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));return p.year+'-'+p.month+'-'+p.day;
}
function canManageClass(c){
 if(!c||!user)return false;
 if(isOwner)return ownerPreviewRole!=='student';
 return profile?.role==='professor'&&c.professor_id===user.id;
}
function makeClassCard(c){
 const card=document.createElement('article');card.className='class-card';
 const st=classStatus(c),life=c.lifecycle_status||'upcoming',roster=(c.roster||[]).map(x=>x.display_name).filter(Boolean);
 const when=document.createElement('div');when.className='class-card-time';when.textContent=fmt(c.starts_at);
 const main=document.createElement('div');main.className='class-card-main';
 const h=document.createElement('h3');h.textContent=c.title;
 const sub=document.createElement('p');sub.textContent=(c.subject||'')+' · '+fmt(c.ends_at);
 const people=document.createElement('p');people.className='class-card-people';people.textContent=(c.student_count??roster.length)+' '+t('studentCount')+(c.capacity?' · '+(c.student_count??roster.length)+'/'+c.capacity:'');
 const professor=document.createElement('p');professor.className='class-card-professor';professor.textContent=t('classProfessor')+': '+(c.professorName||'ECHO');
 main.append(h,sub,professor,people);
 if(c.groupNames?.length){const groupsLine=document.createElement('p');groupsLine.className='class-card-groups';groupsLine.textContent=t('assignedGroups')+': '+c.groupNames.join(', ');main.append(groupsLine);}
 const meta=document.createElement('div');meta.className='class-card-meta';
 const badge=document.createElement('span');badge.className='class-state '+st;badge.textContent=t(st);meta.append(badge);
 const lifeBadge=document.createElement('span');lifeBadge.className='class-state lifecycle-'+life;lifeBadge.textContent=t(life==='active'?'activeStatus':life==='archived'?'archivedStatus':'upcomingStatus');meta.append(lifeBadge);
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
 const list=document.getElementById('class-list');if(!list)return;list.replaceChildren();
 const search=(document.getElementById('class-search')?.value||'').trim().toLowerCase();
 const lifeFilter=document.getElementById('class-lifecycle-filter')?.value||'';
 const [start,end]=periodBounds();
 document.getElementById('class-period').textContent=view==='list'?t('all'):fmt(start.toISOString())+' — '+fmt(new Date(end.getTime()-1).toISOString());
 const visibleClasses=isOwner&&ownerPreviewRole?classes.filter(c=>c.is_demo):classes;
 const searched=visibleClasses.filter(c=>
   (!lifeFilter||(c.lifecycle_status||'upcoming')===lifeFilter)
   &&(!search||[c.title,c.subject,c.description,c.professorName,...(c.groupNames||[]),...(c.roster||[]).map(x=>x.display_name)].some(v=>String(v||'').toLocaleLowerCase().includes(search)))
 );
 const rows=searched.filter(c=>view==='list'||(new Date(c.starts_at)>=start&&new Date(c.starts_at)<end)).sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
 if(view==='list'||view==='day'){
  if(!rows.length){const p=document.createElement('div');p.className='class-empty';p.textContent=t('empty');list.append(p);return;}
  for(const c of rows)list.append(makeClassCard(c));
  return;
 }
 const grid=document.createElement('div');grid.className=view==='week'?'class-week-grid':'class-month-grid';
 const headings=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
 for(let i=0;i<7;i++){const h=document.createElement('div');h.className='class-calendar-weekday';h.textContent=lang()==='el'?['Δευ','Τρί','Τετ','Πέμ','Παρ','Σάβ','Κυρ'][i]:headings[i];grid.append(h);}
 if(view==='week'){
  for(let i=0;i<7;i++){
   const startDate=dateKey(start),dayDate=shiftAthensDate(startDate,i),day=new Date(toAthensISO(dayDate+'T12:00'));
   const cell=document.createElement('section');cell.className='class-calendar-cell';
   const head=document.createElement('div');head.className='class-calendar-day-title';head.textContent=new Intl.DateTimeFormat(lang()==='el'?'el-GR':'en-GB',{timeZone:ZONE,weekday:'short',day:'numeric',month:'short'}).format(day);cell.append(head);
   const key=dayDate;const dayRows=rows.filter(x=>dateKey(x.starts_at)===key);
   if(!dayRows.length){const empty=document.createElement('span');empty.className='class-calendar-none';empty.textContent='—';cell.append(empty);}
   else for(const item of dayRows)cell.append(makeCalendarEvent(item));
   grid.append(cell);
  }
 }else{
  const parts=athensParts(start),year=Number(parts.year),month=Number(parts.month),days=new Date(Date.UTC(year,month,0)).getUTCDate(),offset=(new Date(Date.UTC(year,month-1,1)).getUTCDay()+6)%7;
  for(let i=0;i<offset;i++){const blank=document.createElement('div');blank.className='class-calendar-cell blank';grid.append(blank);}
  for(let dayNo=1;dayNo<=days;dayNo++){
   const day=new Date(toAthensISO(String(year).padStart(4,'0')+'-'+String(month).padStart(2,'0')+'-'+String(dayNo).padStart(2,'0')+'T12:00'));const cell=document.createElement('section');cell.className='class-calendar-cell';
   const head=document.createElement('div');head.className='class-calendar-day-title';head.textContent=String(dayNo);cell.append(head);
   for(const item of rows.filter(x=>dateKey(x.starts_at)===dateKey(day)))cell.append(makeCalendarEvent(item));
   grid.append(cell);
  }
 }
 list.append(grid);
}
async function loadStudents(){
 const {data,error}=await db.rpc('get_echo_student_directory');
 if(error)throw error;
 students=(data||[]).map(row=>({id:row.user_id,display_name:row.display_name||'Student'}));
}
async function loadProfessors(){
 if(!isOwner){professors=[];return;}
 const {data,error}=await db.rpc('get_echo_professor_directory');
 if(error)throw error;
 professors=(data||[]).map(row=>({id:row.user_id,display_name:row.display_name||'Professor'}));
}
async function loadClasses(){
 const {data,error}=await db.from('classes')
  .select('id,title,subject,description,image_url,starts_at,ends_at,status,allow_unassigned,is_demo,created_by,professor_id,classroom_location,capacity,lifecycle_status,publication_status')
  .order('starts_at',{ascending:true});
 if(error)throw error;
 const rows=data||[],ids=rows.map(row=>row.id);
 for(const row of rows){row.roster=[];row.liveRoom=null;row.groupIds=[];row.groupNames=[];row.student_count=0;row.group_count=0;}
 if(ids.length){
  const [liveResult,rosterResult,assignmentResult,countResult]=await Promise.all([
   db.from('class_live_rooms').select('class_id,status,started_at').in('class_id',ids).eq('status','live'),
   db.rpc('get_echo_class_rosters',{target_class_ids:ids}),
   db.rpc('get_echo_lesson_group_assignments',{target_lesson_ids:ids}),
   db.rpc('get_echo_lesson_group_counts',{target_lesson_ids:ids})
  ]);
  if(liveResult.error)throw liveResult.error;
  if(rosterResult.error)throw rosterResult.error;
  if(assignmentResult.error)throw assignmentResult.error;
  if(countResult.error)throw countResult.error;
  const liveMap=new Map((liveResult.data||[]).map(item=>[item.class_id,item]));
  const countMap=new Map((countResult.data||[]).map(item=>[item.lesson_id,item]));
  for(const row of rows){
   row.liveRoom=liveMap.get(row.id)||null;
   const counts=countMap.get(row.id);
   if(counts){row.group_count=Number(counts.group_count)||0;row.student_count=Number(counts.student_count)||0;}
  }
  for(const person of rosterResult.data||[]){
   const row=rows.find(item=>item.id===person.class_id);
   if(row)row.roster.push({id:person.student_id,display_name:person.display_name||'Student'});
  }
  for(const assignment of assignmentResult.data||[]){
   const row=rows.find(item=>item.id===assignment.lesson_id);
   if(!row)continue;
   row.groupIds.push(assignment.group_id);
   row.groupNames.push(assignment.group_name);
  }
  if(isOwner){
   const {data:demoRows,error:demoError}=await db.rpc('get_echo_demo_rosters',{target_class_ids:ids});
   if(demoError)throw demoError;
   for(const person of demoRows||[]){
    const row=rows.find(item=>item.id===person.class_id);
    if(row)row.roster.push({id:null,display_name:person.display_name});
   }
  }
 }
 if(rows.length){
  const professorIds=[...new Set(rows.map(row=>row.professor_id||row.created_by).filter(Boolean))];
  const {data:professorRows,error:professorError}=await db.from('profiles').select('id,display_name').in('id',professorIds);
  if(professorError)throw professorError;
  const professorNames=new Map((professorRows||[]).map(item=>[item.id,item.display_name]));
  for(const row of rows){
   row.professorName=professorNames.get(row.professor_id||row.created_by)||'ECHO';
   if(!row.group_count&&!row.student_count)row.student_count=(row.roster||[]).filter(person=>person.id).length;
  }
 }
 classes=rows;renderClasses();
}
function groupCanManage(group){
 return !!group&&(isOwner|| (profile?.role==='professor'&&group.professor_id===user?.id));
}
async function loadGroups(){
 const status=document.getElementById('class-group-status');
 if(status)status.textContent='';
 try{
  const {data,error}=await db.rpc('get_echo_group_directory');
  if(error)throw error;
  groups=(data||[]).map(row=>({...row,member_count:Number(row.member_count)||0}));
  const ids=groups.map(group=>group.group_id);
  if(professorMode()&&ids.length){
   const {data:members,error:memberError}=await db.from('class_group_members')
    .select('group_id,student_id').in('group_id',ids);
   if(memberError)throw memberError;
   groupMemberships=members||[];
  }else{
   groupMemberships=groups.filter(group=>group.is_member).map(group=>({group_id:group.group_id,student_id:user?.id}));
  }
  renderGroups();
  buildLessonGroupPicker(selected?classes.find(item=>item.id===selected)?.groupIds||[]:[]);
 }catch(error){
  groups=[];groupMemberships=[];
  renderGroups();
  if(status)status.textContent=error?.message||t('groupSaveError');
  throw error;
 }
}
function showGroupEmpty(message){
 const node=document.createElement('p');node.className='class-empty';node.textContent=message;return node;
}
function renderGroups(){
 const list=document.getElementById('class-group-list');if(!list)return;
 list.replaceChildren();
 const query=(document.getElementById('class-group-search-filter')?.value||'').trim().toLocaleLowerCase();
 const rows=groups.filter(group=>[group.name,group.description,group.professor_name].some(value=>String(value||'').toLocaleLowerCase().includes(query)));
 if(!rows.length){list.append(showGroupEmpty(groups.length?t('noMatchingGroups'):t('noGroups')));return;}
 for(const group of rows){
  const card=document.createElement('article');card.className='class-group-card';
  const top=document.createElement('div');top.className='class-group-card-top';
  const heading=document.createElement('div');heading.className='class-group-card-main';
  const name=document.createElement('h3');name.textContent=group.name;
  const description=document.createElement('p');description.textContent=group.description||'';
  const meta=document.createElement('span');meta.className='class-group-card-meta';
  meta.textContent=group.member_count+' '+t('memberCount')+' · '+t('classProfessor')+': '+(group.professor_name||'ECHO');
  heading.append(name);if(group.description)heading.append(description);heading.append(meta);top.append(heading);
  if(groupCanManage(group)){
   const edit=document.createElement('button');edit.type='button';edit.className='btn class-group-edit';edit.textContent=t('edit');
   edit.addEventListener('click',()=>openGroupEditor(group));top.append(edit);
  }
  card.append(top);
  if(groupCanManage(group)){
   const roster=document.createElement('div');roster.className='class-group-roster';
   const groupStudents=groupMemberships.filter(member=>member.group_id===group.group_id);
   for(const member of groupStudents){
    const student=students.find(item=>item.id===member.student_id);
    if(!student)continue;
    const chip=document.createElement('button');chip.type='button';chip.className='class-group-member-chip';
    chip.textContent=student.display_name;chip.addEventListener('click',()=>window.echoOpenProfile?.(student.id));
    roster.append(chip);
   }
   card.append(roster);
  }
  list.append(card);
 }
}
function buildGroupMemberPicker(assignedIds=[]){
 const options=document.getElementById('class-group-member-options');if(!options)return;
 options.replaceChildren();
 const search=document.getElementById('class-group-member-search');if(search)search.value='';
 const assigned=new Set(assignedIds);
 for(const student of students){
  const label=document.createElement('label');label.className='class-student-option';
  label.dataset.search=(student.display_name||'Student').toLocaleLowerCase();
  const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.value=student.id;checkbox.checked=assigned.has(student.id);
  checkbox.addEventListener('change',updateGroupMemberSelection);
  const name=document.createElement('span');name.textContent=student.display_name||'Student';
  label.append(checkbox,name);options.append(label);
 }
 updateGroupMemberSelection();filterGroupMemberPicker();
}
function updateGroupMemberSelection(){
 const checked=[...document.querySelectorAll('#class-group-member-options input:checked')];
 const count=document.getElementById('class-group-member-count');
 if(count)count.textContent=checked.length+' '+t('selectedCount')+' · '+students.length+' '+t('students').toLowerCase();
 const selectedArea=document.getElementById('class-group-member-selection');if(!selectedArea)return;
 selectedArea.replaceChildren();
 const names=checked.map(box=>students.find(student=>student.id===box.value)?.display_name||'Student');
 names.slice(0,5).forEach(name=>{const chip=document.createElement('span');chip.className='class-student-selected-chip';chip.textContent=name;selectedArea.append(chip);});
 if(names.length>5){const more=document.createElement('span');more.className='class-student-selected-chip more';more.textContent='+'+(names.length-5);selectedArea.append(more);}
}
function filterGroupMemberPicker(){
 const input=document.getElementById('class-group-member-search');if(!input)return;
 const query=input.value.trim().toLocaleLowerCase();
 const options=document.querySelectorAll('#class-group-member-options .class-student-option');
 let visible=0;
 options.forEach(option=>{const show=option.dataset.search.includes(query);option.classList.toggle('hidden',!show);if(show)visible++;});
 let empty=document.getElementById('class-group-member-no-match');
 if(!visible){
  if(!empty){empty=document.createElement('p');empty.id='class-group-member-no-match';empty.className='class-form-status';document.getElementById('class-group-member-options').append(empty);}
  empty.textContent=t('noMatchingStudents');
 }else empty?.remove();
}
function buildLessonGroupPicker(assignedIds=[]){
 const options=document.getElementById('class-group-options');if(!options)return;
 options.replaceChildren();
 const search=document.getElementById('class-group-search');if(search)search.value='';
 const assigned=new Set(assignedIds);
 for(const group of groups){
  if(!groupCanManage(group))continue;
  const label=document.createElement('label');label.className='class-student-option';
  label.dataset.search=(group.name+' '+(group.description||'')).toLocaleLowerCase();
  const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.value=group.group_id;checkbox.checked=assigned.has(group.group_id);
  checkbox.addEventListener('change',updateLessonGroupSelection);
  const name=document.createElement('span');name.textContent=group.name+' · '+group.member_count+' '+t('studentCountLabel');
  label.append(checkbox,name);options.append(label);
 }
 updateLessonGroupSelection();filterLessonGroupPicker();
}
function updateLessonGroupSelection(){
 const checked=[...document.querySelectorAll('#class-group-options input:checked')];
 const ids=checked.map(box=>box.value);
 const count=document.getElementById('class-group-count');
 if(count)count.textContent=ids.length+' '+t('selectedCount');
 const area=document.getElementById('class-group-selection');
 if(area){
  area.replaceChildren();
  const names=ids.map(id=>groups.find(group=>group.group_id===id)?.name).filter(Boolean);
  names.slice(0,5).forEach(name=>{const chip=document.createElement('span');chip.className='class-student-selected-chip';chip.textContent=name;area.append(chip);});
  if(names.length>5){const more=document.createElement('span');more.className='class-student-selected-chip more';more.textContent='+'+(names.length-5);area.append(more);}
 }
 const studentIds=new Set(groupMemberships.filter(member=>ids.includes(member.group_id)).map(member=>member.student_id));
 const summary=document.getElementById('class-group-summary');
 if(summary)summary.textContent=studentIds.size+' '+t('groupsStudentCount');
}
function filterLessonGroupPicker(){
 const input=document.getElementById('class-group-search');if(!input)return;
 const query=input.value.trim().toLocaleLowerCase();
 const options=document.querySelectorAll('#class-group-options .class-student-option');
 let visible=0;
 options.forEach(option=>{const show=option.dataset.search.includes(query);option.classList.toggle('hidden',!show);if(show)visible++;});
 let empty=document.getElementById('class-group-no-match');
 if(!visible){
  if(!empty){empty=document.createElement('p');empty.id='class-group-no-match';empty.className='class-form-status';document.getElementById('class-group-options').append(empty);}
  empty.textContent=t('noMatchingGroups');
 }else empty?.remove();
}
function updateLessonSaveLabel(){
 const button=document.getElementById('class-save');if(!button)return;
 const draft=document.getElementById('class-publication')?.value==='draft';
 button.textContent=draft?t('saveDraft'):t('publishLesson');
}
function fillGroupProfessorPicker(group=null){
 const wrap=document.getElementById('class-group-professor-wrap'),select=document.getElementById('class-group-professor');
 if(!isOwner){wrap.classList.add('hidden');select.replaceChildren();return;}
 wrap.classList.remove('hidden');select.replaceChildren();
 const choices=professors.length?professors:[{id:user.id,display_name:profile?.display_name||'Primary Owner'}];
 for(const item of choices){const option=document.createElement('option');option.value=item.id;option.textContent=item.display_name;select.append(option);}
 const wanted=group?.professor_id||user.id;
 select.value=choices.some(item=>item.id===wanted)?wanted:(choices[0]?.id||user.id);
}
function openGroupEditor(group=null){
 if(!professorMode())return;
 selectedGroup=group?.group_id||null;
 document.getElementById('class-group-form').reset();
 document.getElementById('class-group-form-status').textContent='';
 document.getElementById('class-group-editor').classList.remove('hidden');
 document.getElementById('class-group-name').value=group?.name||'';
 document.getElementById('class-group-description').value=group?.description||'';
 const memberIds=groupMemberships.filter(member=>member.group_id===group?.group_id).map(member=>member.student_id);
 fillGroupProfessorPicker(group);buildGroupMemberPicker(memberIds);
 document.getElementById('class-group-save').textContent=group?t('save'):t('newGroup');
 document.getElementById('class-group-editor').scrollIntoView({behavior:'smooth',block:'start'});
}
function closeGroupEditor(){
 document.getElementById('class-group-editor').classList.add('hidden');
 selectedGroup=null;
}
async function saveGroup(event){
 event.preventDefault();
 if(!professorMode())return;
 const status=document.getElementById('class-group-form-status');status.textContent='';status.classList.remove('error');
 const name=document.getElementById('class-group-name').value.trim();
 if(!name){status.textContent=t('groupName');return;}
 const studentIds=[...document.querySelectorAll('#class-group-member-options input:checked')].map(box=>box.value);
 const groupData={name,description:document.getElementById('class-group-description').value.trim()};
 if(isOwner)groupData.professor_id=document.getElementById('class-group-professor').value;
 const button=document.getElementById('class-group-save');button.disabled=true;
 try{
  const {data,error}=await db.rpc('save_echo_group',{target_group_id:selectedGroup,group_data:groupData,student_ids:studentIds});
  if(error)throw error;
  status.textContent=t('groupSaved');
  closeGroupEditor();
  await loadGroups();await loadClasses();
 }catch(error){status.textContent=error?.message||t('groupSaveError');status.classList.add('error');}
 finally{button.disabled=false;}
}
function fillProfessorPicker(c=null){
 const wrap=document.getElementById('class-professor-wrap'),select=document.getElementById('class-professor');
 if(!isOwner){wrap.classList.add('hidden');select.replaceChildren();return;}
 wrap.classList.remove('hidden');select.replaceChildren();
 const choices=professors.length?professors:[{id:user.id,display_name:profile?.display_name||'Primary Owner'}];
 for(const item of choices){const option=document.createElement('option');option.value=item.id;option.textContent=item.display_name;select.append(option);}
 const wanted=c?.professor_id||user.id;
 select.value=choices.some(x=>x.id===wanted)?wanted:(choices[0]?.id||user.id);
}
async function openEditor(c=null){
 if(!professorMode())return;
 if(!groups.length)await loadGroups();
 selected=c?.id||null;selectedDemo=!!c?.is_demo;
 const form=document.getElementById('class-form');form.reset();
 document.getElementById('class-editor').classList.remove('hidden');
 document.getElementById('class-form-status').textContent='';
 document.getElementById('class-title').value=c?.title||'';
 document.getElementById('class-subject').value=c?.subject||'';
 document.getElementById('class-description').value=c?.description||'';
 document.getElementById('class-image').value=c?.image_url||'';
 const now=new Date();
 const start=c?.starts_at?fromISO(c.starts_at):fromISO(new Date(now.getTime()+3600000).toISOString());
 const end=c?.ends_at?fromISO(c.ends_at):fromISO(new Date(now.getTime()+7200000).toISOString());
 document.getElementById('class-start').value=start;document.getElementById('class-end').value=end;
 document.getElementById('class-location').value=c?.classroom_location||'';
 document.getElementById('class-capacity').value=c?.capacity??'';
 document.getElementById('class-lifecycle').value=c?.lifecycle_status||'upcoming';
 document.getElementById('class-publication').value=c?.publication_status||'draft';
 const professorDemoPreview=isOwner&&ownerPreviewRole==='professor';
 document.getElementById('class-demo').checked=professorDemoPreview||!!c?.is_demo&&isOwner;
 document.getElementById('class-demo').disabled=!isOwner||professorDemoPreview;
 document.getElementById('class-demo-names').value=(c?.is_demo?(c.roster||[]).map(x=>x.display_name).join('\n'):'');
 document.getElementById('class-repeat').checked=false;document.getElementById('class-repeat').disabled=!!c;
 document.getElementById('class-repeat-count').disabled=!!c;
 fillProfessorPicker(c);
 buildLessonGroupPicker(c?.groupIds||[]);
 toggleDemoEditor();
 updateLessonSaveLabel();
 document.getElementById('class-editor').scrollIntoView({behavior:'smooth',block:'start'});
}
function closeEditor(){document.getElementById('class-editor').classList.add('hidden');selected=null;selectedDemo=false;}
function addWeeksLocal(value,weeks){
 const [date,time]=value.split('T'),[y,m,d]=date.split('-').map(Number);
 const next=new Date(Date.UTC(y,m-1,d+weeks*7));
 return next.toISOString().slice(0,10)+'T'+time;
}
async function saveClass(event){
 event.preventDefault();
 const status=document.getElementById('class-form-status');status.textContent='';status.classList.remove('error');
 const title=document.getElementById('class-title').value.trim();
 const subject=document.getElementById('class-subject').value.trim();
 if(!title){status.textContent=t('noTitle');return;}
 let starts_at,ends_at;
 try{starts_at=toAthensISO(document.getElementById('class-start').value);ends_at=toAthensISO(document.getElementById('class-end').value);}
 catch{status.textContent=t('invalidTime');return;}
 if(new Date(ends_at)<=new Date(starts_at)){status.textContent=t('invalidTime');return;}
 const demo=isOwner&&document.getElementById('class-demo').checked;
 const picked=demo?[]:[...document.querySelectorAll('#class-student-options input:checked')].map(x=>x.value);
 const demoNames=demo?[...new Set(document.getElementById('class-demo-names').value.split('\n').map(x=>x.trim()).filter(Boolean))]:[];
 const allow=document.getElementById('class-open').checked;
 if((demo?!demoNames.length:!picked.length)&&!allow){status.textContent=t('studentsRequired');return;}
 const capInput=document.getElementById('class-capacity').value.trim();
 const capacity=capInput?Number(capInput):null;
 if(capacity!==null&&(!Number.isInteger(capacity)||capacity<1||capacity>5000)){status.textContent=t('capacityReached');return;}
 if(capacity!==null&&!demo&&picked.length>capacity){status.textContent=t('capacityReached');return;}
 const base={
  title,subject,
  description:document.getElementById('class-description').value.trim(),
  image_url:document.getElementById('class-image').value.trim()||null,
  starts_at,ends_at,timezone:ZONE,allow_unassigned:allow,
  is_demo:demo,status:'scheduled',created_by:user.id,
  professor_id:demo?user.id:(isOwner?document.getElementById('class-professor').value:user.id),
  classroom_location:document.getElementById('class-location').value.trim(),
  capacity,lifecycle_status:document.getElementById('class-lifecycle').value
 };
 const button=document.getElementById('class-save');button.disabled=true;
 try{
  if(demo){
   let savedRows=[];
   if(selected){
    const update={...base,updated_at:new Date().toISOString()};delete update.created_by;
    const {data,error}=await db.from('classes').update(update).eq('id',selected).select('id').single();
    if(error)throw error;savedRows=[data];
    const {error:delError}=await db.from('class_enrollments').delete().eq('class_id',selected);if(delError)throw delError;
    const {error:demoDelError}=await db.from('class_demo_participants').delete().eq('class_id',selected);if(demoDelError)throw demoDelError;
   }else{
    const repeat=document.getElementById('class-repeat').checked?Math.max(2,Math.min(16,Number(document.getElementById('class-repeat-count').value)||4)):1;
    const records=Array.from({length:repeat},(_,i)=>({...base,starts_at:toAthensISO(addWeeksLocal(document.getElementById('class-start').value,i)),ends_at:toAthensISO(addWeeksLocal(document.getElementById('class-end').value,i))}));
    const {data,error}=await db.from('classes').insert(records).select('id');if(error)throw error;savedRows=data||[];
   }
   if(demoNames.length){
    const demoRows=savedRows.flatMap(row=>demoNames.map(display_name=>({class_id:row.id,display_name})));
    const {error}=await db.from('class_demo_participants').insert(demoRows);if(error)throw error;
   }
  }else{
   const repeat=selected?1:(document.getElementById('class-repeat').checked?Math.max(2,Math.min(16,Number(document.getElementById('class-repeat-count').value)||4)):1);
   const classData={...base};
   const {error}=await db.rpc('save_echo_class',{
    target_class_id:selected,
    class_data:classData,
    student_ids:picked,
    recurrence_weeks:repeat
   });
   if(error)throw error;
  }
  closeEditor();status.textContent=t('saved');await loadClasses();
 }catch(error){status.textContent=error?.message||t('saveError');status.classList.add('error');}
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
function waitForPeerConnection(pc,{requireTrack=false,timeout=16000}={}){
 return new Promise((resolve,reject)=>{
  let gotTrack=!requireTrack||pc.getReceivers().some(receiver=>receiver.track?.readyState==='live'),done=false;
  const finish=(error)=>{if(done)return;done=true;clearTimeout(timer);pc.removeEventListener('connectionstatechange',check);pc.removeEventListener('track',track);error?reject(error):resolve();};
  const check=()=>{if(pc.connectionState==='connected'&&gotTrack)finish();else if(pc.connectionState==='failed'||pc.connectionState==='closed')finish(new Error(t('mediaDisconnected')));};
  const track=()=>{gotTrack=true;check();};
  const timer=setTimeout(()=>finish(new Error(t('mediaDisconnected'))),timeout);
  pc.addEventListener('connectionstatechange',check);pc.addEventListener('track',track);check();
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
 const room={classId,klass:c,previewStream:null,publisher:null,subscriptions:new Map(),poller:null,attendanceId:null,sessionId:null,inClass:false,syncing:false,channel:null,screenStream:null,screenSender:null,screenTransceiver:null,screenStopping:false,teacherMuted:false,teacherCameraOff:false,localMicMuted:false,localCameraOff:false,handRaised:false,controlsMap:new Map(),sharingUsers:new Set()};
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
 const room=activeRoom,track=room?.previewStream?.getAudioTracks()[0];if(!track)return;
 if(room.teacherMuted){setRoomStatus(t('teacherMuted'),true);return;}
 room.localMicMuted=!room.localMicMuted;track.enabled=!room.localMicMuted;
 const label=track.enabled?t('mute'):t('unmute');document.getElementById('class-mic-toggle').textContent=label;document.getElementById('class-live-mic').textContent=label;
}
function setTeacherMuted(muted){
 const room=activeRoom;if(!room)return;room.teacherMuted=!!muted;
 const track=room.previewStream?.getAudioTracks()[0];if(track)track.enabled=!room.teacherMuted&&!room.localMicMuted;
 const button=document.getElementById('class-live-mic');if(button){button.textContent=room.teacherMuted?t('mutedByTeacher'):(room.localMicMuted?t('unmute'):t('mute'));button.disabled=room.teacherMuted;}
 if(room.teacherMuted)setRoomStatus(t('mutedByTeacher'),true);
 else setRoomStatus(t('mediaConnected'));
}
function toggleRoomCamera(){
 const room=activeRoom,track=room?.previewStream?.getVideoTracks()[0];if(!track)return;
 if(room.teacherCameraOff){setRoomStatus(t('teacherCameraOff'),true);return;}
 room.localCameraOff=!room.localCameraOff;track.enabled=!room.localCameraOff;
 const label=track.enabled?t('cameraOff'):t('cameraOn');
 document.getElementById('class-camera-toggle').textContent=label;document.getElementById('class-live-camera').textContent=label;
}
function setTeacherCameraOff(disabled){
 const room=activeRoom;if(!room)return;room.teacherCameraOff=!!disabled;
 const track=room.previewStream?.getVideoTracks()[0];if(track)track.enabled=!room.teacherCameraOff&&!room.localCameraOff;
 const button=document.getElementById('class-live-camera');
 if(button){button.textContent=room.teacherCameraOff?t('cameraOff'):(room.localCameraOff?t('cameraOn'):t('cameraOff'));button.disabled=room.teacherCameraOff||!track;}
 if(room.teacherCameraOff)setRoomStatus(t('teacherCameraOff'),true);
 else setRoomStatus(t('mediaConnected'));
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
 let tile=local?document.getElementById('class-room-local-tile'):[...grid.querySelectorAll('.class-room-camera-tile')].find(x=>x.dataset.roomUser===userId);
 if(tile)return tile;
 tile=document.createElement('article');tile.className='class-room-tile class-room-camera-tile';
 if(local)tile.id='class-room-local-tile';else tile.dataset.roomUser=userId;
 const video=document.createElement('video');video.autoplay=true;video.playsInline=true;video.muted=!!local;
 const label=document.createElement('div');label.className='class-room-tile-label';label.textContent=name;
 tile.append(video,label);grid.append(tile);return tile;
}
function addRoomScreenTile(userId,name,local=false){
 const grid=document.getElementById('class-room-videos');
 let tile=local?document.getElementById('class-room-local-screen-tile'):[...grid.querySelectorAll('.class-room-screen-tile')].find(x=>x.dataset.screenUser===userId);
 if(tile)return tile;
 tile=document.createElement('article');tile.className='class-room-tile class-room-screen-tile';
 if(local)tile.id='class-room-local-screen-tile';else tile.dataset.screenUser=userId;
 const video=document.createElement('video');video.autoplay=true;video.playsInline=true;video.muted=!!local;
 const label=document.createElement('div');label.className='class-room-tile-label';label.textContent=name+' · '+t('sharing');
 tile.append(video,label);grid.prepend(tile);return tile;
}
function removeRoomRemoteTiles(userId){
 const grid=document.getElementById('class-room-videos');
 [...grid.querySelectorAll('.class-room-camera-tile,.class-room-screen-tile')].filter(tile=>
  tile.dataset.roomUser===userId||tile.dataset.screenUser===userId
 ).forEach(tile=>tile.remove());
}
function addRosterAction(row,label,callback,danger=false){
 const button=document.createElement('button');button.type='button';button.className='class-room-person-action'+(danger?' danger':'');button.textContent=label;
 button.addEventListener('click',callback);row.append(button);return button;
}
function renderRoomRoster(room,participants){
 const area=document.getElementById('class-room-roster-list');area.replaceChildren();
 const active=new Map(participants.filter(p=>p.status==='active'&&Date.now()-new Date(p.last_seen_at||p.joined_at).getTime()<90000).map(p=>[p.user_id,p]));
 const assigned=(room.klass.roster||[]).filter(p=>p.id);const seen=new Set();const teacher=professorMode();
 document.getElementById('class-room-participant-count').textContent=String(active.size);
 const renderPerson=(id,displayName,person)=>{
  const row=document.createElement('div');row.className='class-room-person';row.dataset.userId=id;
  const details=document.createElement('div');details.className='class-room-person-details';
  const name=document.createElement('span');name.textContent=displayName||'Participant';
  const state=document.createElement('small');state.textContent=person?.status==='active'&&active.has(id)?t('joined'):t('notJoined');
  details.append(name,state);
  if(person?.hand_raised){const hand=document.createElement('span');hand.className='class-room-hand-badge';hand.textContent='✋ '+t('handRaised');details.append(hand);}
  if(room.sharingUsers.has(id)){const sharing=document.createElement('span');sharing.className='class-room-sharing-badge';sharing.textContent='▣ '+t('sharing');details.append(sharing);}
  row.append(details);
  if(teacher&&id!==user.id){
   const control=room.controlsMap.get(id)||{};
   if(control.removed){
    addRosterAction(row,t('readmit'),()=>{void moderateParticipant(id,'readmit');});
   }else if(active.has(id)){
    addRosterAction(row,control.teacher_muted?t('unmuteParticipant'):t('muteParticipant'),()=>{void moderateParticipant(id,control.teacher_muted?'unmute':'mute');});
    addRosterAction(row,control.teacher_camera_off?t('allowCamera'):t('turnCameraOff'),()=>{void moderateParticipant(id,control.teacher_camera_off?'camera-on':'camera-off');});
    if(room.sharingUsers.has(id))addRosterAction(row,t('stopParticipantShare'),()=>{void moderateParticipant(id,'stop-share');},true);
    if(person?.hand_raised)addRosterAction(row,t('lowerHand'),()=>{void moderateParticipant(id,'lower-hand');});
    addRosterAction(row,t('removeParticipant'),()=>{void moderateParticipant(id,'remove');},true);
   }
  }
  area.append(row);
 };
 for(const person of assigned){const live=participants.find(p=>p.user_id===person.id);renderPerson(person.id,live?.display_name||person.display_name,live);seen.add(person.id);}
 for(const person of participants.filter(p=>!seen.has(p.user_id)&&(p.status!=='left'||room.controlsMap.get(p.user_id)?.removed)))renderPerson(person.user_id,person.display_name,person);
}
async function subscribeToParticipant(room,person,publications){
 if(room.subscriptions.has(person.user_id)||person.status!=='active')return;
 const rows=(publications||[]).filter(p=>p.user_id===person.user_id&&['audio','video','screen'].includes(p.track_name));
 if(!rows.length)return;
 const key=rows.map(p=>p.track_name+'@'+p.session_id).sort().join('|');
 const data=await callApi('/api/classroom/subscribe',{classId:room.classId,publisherId:person.user_id});
 const pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.cloudflare.com:3478'}]});
 const name=person.display_name||'Participant';
 const tile=addRoomTile(person.user_id,name),video=tile.querySelector('video'),cameraStream=new MediaStream();
 let screenTile=null,screenVideo=null,screenStream=new MediaStream();
 const trackMeta=new Map((data.tracks||[]).map(item=>[String(item.mid),item.trackName]));
 pc.ontrack=event=>{
  const trackName=trackMeta.get(String(event.transceiver?.mid))||(event.track.kind==='audio'?'audio':(rows.length===1?rows[0].track_name:'video'));
  if(trackName==='screen'){
   if(!screenTile){screenTile=addRoomScreenTile(person.user_id,name);screenVideo=screenTile.querySelector('video');}
   if(!screenStream.getTracks().some(x=>x.id===event.track.id))screenStream.addTrack(event.track);
   screenVideo.srcObject=screenStream;void screenVideo.play().catch(()=>{});
   event.track.addEventListener('ended',()=>{screenTile?.remove();screenTile=null;screenVideo=null;screenStream=new MediaStream();},{once:true});
  }else{
   if(!cameraStream.getTracks().some(x=>x.id===event.track.id))cameraStream.addTrack(event.track);
   video.srcObject=cameraStream;void video.play().catch(()=>{setRoomStatus(t('tapUnmute'));});
   video.addEventListener('click',()=>{void video.play().catch(()=>{});});
  }
 };
 pc.onconnectionstatechange=()=>{if(pc.connectionState==='failed')setRoomStatus(t('mediaDisconnected'),true);};
 try{
  await pc.setRemoteDescription(new RTCSessionDescription(data.sessionDescription));
  const answer=await pc.createAnswer();await pc.setLocalDescription(answer);await waitForIceGathering(pc);
  await callApi('/api/classroom/renegotiate',{classId:room.classId,sessionId:data.sessionId,sessionDescription:pc.localDescription});
  await waitForPeerConnection(pc,{requireTrack:true,timeout:18000});
  room.subscriptions.set(person.user_id,{pc,sessionId:data.sessionId,tile,screenTile,key});
 }catch(error){pc.close();tile.remove();screenTile?.remove();throw error;}
}
async function subscribeToClassRoom(room){
 const {data:{session},error}=await db.auth.getSession();if(error||!session?.access_token)throw new Error(t('mediaDenied'));
 await db.realtime.setAuth(session.access_token);
 return await new Promise((resolve,reject)=>{
  const channel=db.channel('echo-class:'+room.classId,{config:{private:true,broadcast:{ack:true}}});
  channel.on('broadcast',{event:'class-event'},({payload})=>{if(payload&&payload.from!==user.id)void receiveRoomEvent(room,payload);});
  channel.subscribe((state,error)=>{
   if(state==='SUBSCRIBED'){room.channel=channel;resolve(channel);}
   else if(['CHANNEL_ERROR','TIMED_OUT','CLOSED'].includes(state)){void db.removeChannel(channel);reject(error||new Error(t('mediaDisconnected')));}
  });
 });
}
async function broadcastRoomEvent(payload){
 const room=activeRoom;if(!room?.channel)return false;
 const result=await room.channel.send({type:'broadcast',event:'class-event',payload:{...payload,from:user.id}});
 return result==='ok';
}
function showRoomReaction(emoji,name){
 const node=document.createElement('div');node.className='class-room-reaction';node.textContent=emoji+' '+(name||'');
 document.querySelector('.class-room-shell')?.append(node);
 window.setTimeout(()=>node.remove(),2600);
}
async function receiveRoomEvent(room,payload){
 if(activeRoom!==room)return;
 if(payload.type==='reaction'){showRoomReaction(payload.emoji,payload.name);return;}
 if(payload.type==='moderation'&&payload.targetUserId===user.id){
  if(payload.action==='mute')setTeacherMuted(true);
  if(payload.action==='unmute')setTeacherMuted(false);
  if(payload.action==='camera-off')setTeacherCameraOff(true);
  if(payload.action==='camera-on')setTeacherCameraOff(false);
  if(payload.action==='remove'){setRoomStatus(t('removedFromMeeting'),true);await leaveRoom({automatic:true});return;}
  if(payload.action==='stop-share')await stopScreenShare(room,{serverAlreadyStopped:true,remoteEnded:true});
 }
 if(payload.type==='hand')setRoomStatus(payload.raised?t('handRaised'):t('mediaConnected'));
}
async function toggleRaiseHand(){
 const room=activeRoom;if(!room?.inClass)return;
 const next=!room.handRaised;
 const {error}=await db.from('class_room_participants').update({hand_raised:next,hand_raised_at:next?new Date().toISOString():null}).eq('class_id',room.classId).eq('user_id',user.id);
 if(error){setRoomStatus(error.message,true);return;}
 room.handRaised=next;document.getElementById('class-raise-hand').textContent=next?t('lowerHand'):t('raiseHand');
 try{await broadcastRoomEvent({type:'hand',raised:next,targetUserId:user.id,name:profile?.display_name||'Participant'});}catch{}
}
async function sendRoomReaction(emoji){
 const room=activeRoom;if(!room?.inClass||!ROOM_REACTIONS.has(emoji))return;
 const name=profile?.display_name||'Participant';showRoomReaction(emoji,name);
 try{await broadcastRoomEvent({type:'reaction',emoji,name});}catch(error){setRoomStatus(error.message||t('mediaDisconnected'),true);}
}
async function moderateParticipant(targetUserId,action){
 const room=activeRoom;if(!room?.inClass||!professorMode())return;
 try{
  const result=action==='stop-share'
   ? await callApi('/api/classroom/stop-share',{classId:room.classId,targetUserId})
   : await callApi('/api/classroom/moderate',{classId:room.classId,targetUserId,action});
  if(action==='mute'||action==='unmute'||action==='camera-off'||action==='camera-on'||action==='remove'||action==='stop-share'){
   await broadcastRoomEvent({type:'moderation',action,targetUserId});
  }
  if(action==='lower-hand')setRoomStatus(t('lowerHand'));
  else setRoomStatus(action==='remove'?t('removeParticipant'):action==='readmit'?t('readmit'):action==='stop-share'?t('stopParticipantShare'):action==='camera-off'?t('turnCameraOff'):action==='camera-on'?t('allowCamera'):action==='mute'?t('muteParticipant'):t('unmuteParticipant'));
  await syncClassroom(room);
  return result;
 }catch(error){setRoomStatus(error.message||t('mediaDisconnected'),true);}
}
async function toggleScreenShare(){
 const room=activeRoom;if(!room?.inClass||room.screenStream)return room?.screenStream?stopScreenShare(room):undefined;
 if(!navigator.mediaDevices?.getDisplayMedia){setRoomStatus(t('screenShareUnavailable'),true);return;}
 let display=null;
 try{
  display=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:{ideal:24,max:30}},audio:false});
  const track=display.getVideoTracks()[0];if(!track)throw new Error(t('screenShareUnavailable'));
  const transceiver=room.publisher.addTransceiver(track,{direction:'sendonly'});
  const offer=await room.publisher.createOffer();await room.publisher.setLocalDescription(offer);await waitForIceGathering(room.publisher);
  const result=await callApi('/api/classroom/publish',{classId:room.classId,sessionId:room.sessionId,sessionDescription:room.publisher.localDescription,tracks:[{location:'local',mid:transceiver.mid,trackName:'screen'}]});
  if(result.sessionDescription?.type!=='answer')throw new Error('The media service did not accept screen sharing.');
  await room.publisher.setRemoteDescription(new RTCSessionDescription(result.sessionDescription));
  room.screenStream=display;room.screenTransceiver=transceiver;room.screenSender=transceiver.sender;
  const local=addRoomScreenTile(user.id,profile?.display_name||'You',true),video=local.querySelector('video');video.srcObject=display;void video.play().catch(()=>{});
  document.getElementById('class-share-screen').textContent=t('stopSharing');
  track.addEventListener('ended',()=>{if(activeRoom===room)void stopScreenShare(room,{remoteEnded:true});},{once:true});
  setRoomStatus(t('sharing'));
 }catch(error){
  if(display&&room.sessionId){try{await callApi('/api/classroom/stop-share',{classId:room.classId,targetUserId:user.id});}catch{}}
  display?.getTracks().forEach(track=>track.stop());
  setRoomStatus(error?.name==='NotAllowedError'?t('screenShareDenied'):(error.message||t('screenShareDenied')),true);
 }
}
async function stopScreenShare(room,{remoteEnded=false,serverAlreadyStopped=false}={}){
 if(!room||room.screenStopping)return;room.screenStopping=true;
 try{
  if(room.screenStream&&!serverAlreadyStopped){
   try{await callApi('/api/classroom/stop-share',{classId:room.classId,targetUserId:user.id});}catch(error){if(!remoteEnded)throw error;}
  }
  room.screenStream?.getTracks().forEach(track=>{if(track.readyState==='live')track.stop();});
  try{await room.screenSender?.replaceTrack(null);}catch{}
  if(room.screenTransceiver)room.screenTransceiver.direction='inactive';
  room.screenStream=null;room.screenSender=null;room.screenTransceiver=null;
  document.getElementById('class-room-local-screen-tile')?.remove();
  document.getElementById('class-share-screen').textContent=t('shareScreen');
  if(activeRoom===room&&!remoteEnded)setRoomStatus(t('mediaConnected'));
 }catch(error){setRoomStatus(error.message||t('mediaDisconnected'),true);}
 finally{room.screenStopping=false;}
}
async function toggleRoomFullscreen(){
 const shell=document.querySelector('.class-room-shell');if(!shell)return;
 try{
  if(document.fullscreenElement){await document.exitFullscreen();}
  else if(shell.requestFullscreen){await shell.requestFullscreen();}
  else if(shell.webkitRequestFullscreen){shell.webkitRequestFullscreen();}
 }catch(error){setRoomStatus(error.message||t('mediaDisconnected'),true);}
}
async function syncClassroom(room){
 if(activeRoom!==room||room.syncing)return;room.syncing=true;
 try{
  const {data:live,error:liveError}=await db.from('class_live_rooms').select('status').eq('class_id',room.classId).eq('status','live').limit(1);
  if(liveError)throw liveError;if(!live?.length){setRoomStatus(t('mediaEnded'));await leaveRoom({automatic:true});return;}
  const [participantResult,publicationResult,controlResult]=await Promise.all([
   db.from('class_room_participants').select('user_id,display_name,session_id,status,joined_at,last_seen_at,hand_raised,hand_raised_at').eq('class_id',room.classId),
   db.from('class_room_publications').select('user_id,session_id,track_name').eq('class_id',room.classId),
   db.from('class_room_controls').select('user_id,teacher_muted,teacher_camera_off,removed').eq('class_id',room.classId)
  ]);
  if(participantResult.error)throw participantResult.error;if(publicationResult.error)throw publicationResult.error;if(controlResult.error)throw controlResult.error;
  const participants=participantResult.data||[],publications=publicationResult.data||[],controls=controlResult.data||[];
  room.controlsMap=new Map(controls.map(row=>[row.user_id,row]));
  room.sharingUsers=new Set(publications.filter(row=>row.track_name==='screen').map(row=>row.user_id));
  const ownControl=room.controlsMap.get(user.id);
  if(ownControl?.removed){setRoomStatus(t('removedFromMeeting'),true);await leaveRoom({automatic:true});return;}
  if(ownControl?.teacher_muted!==room.teacherMuted)setTeacherMuted(!!ownControl?.teacher_muted);
  if(ownControl?.teacher_camera_off!==room.teacherCameraOff)setTeacherCameraOff(!!ownControl?.teacher_camera_off);
  const self=participants.find(p=>p.user_id===user.id);
  if(self?.status==='left'){await leaveRoom({automatic:true});return;}
  room.handRaised=!!self?.hand_raised;document.getElementById('class-raise-hand').textContent=room.handRaised?t('lowerHand'):t('raiseHand');
  renderRoomRoster(room,participants);
  const active=participants.filter(p=>p.status==='active'&&p.user_id!==user.id&&Date.now()-new Date(p.last_seen_at||p.joined_at).getTime()<90000);
  for(const person of active){
   const rows=publications.filter(p=>p.user_id===person.user_id);
   const signature=rows.map(p=>p.track_name+'@'+p.session_id).sort().join('|');
   const existing=room.subscriptions.get(person.user_id);
   if(existing&&existing.key!==signature){
    existing.pc.close();removeRoomRemoteTiles(person.user_id);room.subscriptions.delete(person.user_id);
    try{await callApi('/api/classroom/unsubscribe',{classId:room.classId,publisherId:person.user_id});}catch{}
   }
   if(!room.subscriptions.has(person.user_id)&&rows.length){
    try{await subscribeToParticipant(room,person,rows);}catch(error){setRoomStatus(error.message||t('mediaConnecting'),true);}
   }
  }
  const ids=new Set(active.map(p=>p.user_id));
  for(const [id,sub] of room.subscriptions)if(!ids.has(id)){
   sub.pc.close();removeRoomRemoteTiles(id);room.subscriptions.delete(id);
   try{await callApi('/api/classroom/unsubscribe',{classId:room.classId,publisherId:id});}catch(error){setRoomStatus(error.message||t('mediaDisconnected'),true);}
  }
 }catch(error){if(activeRoom===room)setRoomStatus(error.message||t('mediaDisconnected'),true);}
 finally{room.syncing=false;}
}
async function enterRoom(){
 const room=activeRoom;if(!room||!room.previewStream||room.inClass)return;
 const button=document.getElementById('class-room-enter');button.disabled=true;setRoomStatus(t('mediaConnecting'));
 try{
  const session=await callApi('/api/classroom/session',{classId:room.classId});
  room.sessionId=session.sessionId;room.attendanceId=session.attendanceId;room.teacherMuted=!!session.teacherMuted;room.teacherCameraOff=!!session.teacherCameraOff;
  const microphone=room.previewStream.getAudioTracks()[0];if(microphone)microphone.enabled=!room.teacherMuted&&!room.localMicMuted;
  const camera=room.previewStream.getVideoTracks()[0];if(camera)camera.enabled=!room.teacherCameraOff&&!room.localCameraOff;
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
  await waitForPeerConnection(pc,{timeout:18000});
  setRoomStatus(t('mediaConnected'));
  document.getElementById('class-room-connection').textContent=t('mediaConnected');document.getElementById('class-live-mic').textContent=room.teacherMuted?t('mutedByTeacher'):(room.localMicMuted?t('unmute'):t('mute'));document.getElementById('class-live-mic').disabled=room.teacherMuted;document.getElementById('class-live-camera').textContent=room.previewStream.getVideoTracks().length?t('cameraOff'):t('camera');document.getElementById('class-live-camera').disabled=!room.previewStream.getVideoTracks().length||room.teacherCameraOff;
  try{await subscribeToClassRoom(room);}catch(error){setRoomStatus(error.message||t('mediaDisconnected'),true);}
  room.poller=setInterval(()=>{void syncClassroom(room);},2500);
  room.heartbeat=setInterval(()=>{void db.from('class_room_participants').update({last_seen_at:new Date().toISOString()}).eq('class_id',room.classId).eq('user_id',user.id);},12000);
  await syncClassroom(room);
 }catch(error){
  setRoomStatus(error.message||t('callError'),true);
  if(room.sessionId)try{await callApi('/api/classroom/leave',{classId:room.classId,sessionId:room.sessionId,attendanceId:room.attendanceId});}catch{}
  if(room.publisher){room.publisher.close();room.publisher=null;}
  if(room.poller)clearInterval(room.poller);if(room.heartbeat)clearInterval(room.heartbeat);
  room.previewStream?.getTracks().forEach(track=>track.stop());room.previewStream=null;
  room.sessionId=null;room.attendanceId=null;room.inClass=false;
  document.getElementById('class-preview-video').srcObject=null;
  document.getElementById('class-room-videos').replaceChildren();
  document.getElementById('class-room-enter').disabled=true;
 }finally{if(activeRoom===room&&!room.inClass)button.disabled=true;}
}
async function leaveRoom({automatic=false}={}){
 const room=activeRoom;if(!room)return;activeRoom=null;callJoinPending=false;
 if(document.fullscreenElement)try{await document.exitFullscreen();}catch{}
 if(room.poller)clearInterval(room.poller);if(room.heartbeat)clearInterval(room.heartbeat);
 if(room.channel){void db.removeChannel(room.channel);room.channel=null;}
 if(room.publisher){room.publisher.close();room.publisher=null;}
 for(const sub of room.subscriptions.values())sub.pc.close();room.subscriptions.clear();
 room.screenStream?.getTracks().forEach(track=>track.stop());
 room.previewStream?.getTracks().forEach(track=>track.stop());
 if(room.sessionId)try{await callApi('/api/classroom/leave',{classId:room.classId,sessionId:room.sessionId,attendanceId:room.attendanceId});}catch(error){setRoomStatus(error.message||t('mediaDisconnected'),true);}
 document.getElementById('class-preview-video').srcObject=null;document.getElementById('class-room-videos').replaceChildren();
 roomOverlay.classList.add('hidden');if(!automatic)setRoomStatus(t('leave'));
 await loadClasses().catch(()=>{});
}

async function showDetail(id){
 const c=classes.find(x=>x.id===id);if(!c)return;
 const canManage=canManageClass(c);
 const detail=document.getElementById('class-detail');detail.classList.remove('hidden');detail.replaceChildren();
 const head=document.createElement('div');head.className='class-detail-head';
 const title=document.createElement('h3');title.textContent=c.title;
 const close=document.createElement('button');close.className='btn';close.type='button';close.textContent=t('close');close.onclick=()=>detail.classList.add('hidden');head.append(title,close);
 if(c.image_url){
  try{const imageURL=new URL(c.image_url);if(imageURL.protocol==='https:'){const img=document.createElement('img');img.className='class-detail-image';img.src=imageURL.href;img.alt=c.title;img.loading='lazy';img.referrerPolicy='no-referrer';detail.append(img);}}catch{}
 }
 const desc=document.createElement('p');desc.textContent=c.description||c.subject;
 const state=classStatus(c),stateLine=document.createElement('p');stateLine.className='class-detail-meta';stateLine.textContent=t(state)+' · '+t('classProfessor')+': '+(c.professorName||'ECHO');
 const info=document.createElement('p');info.textContent=t('scheduleLabel')+': '+fmt(c.starts_at)+' – '+fmt(c.ends_at)+' · '+c.subject;
 const details=document.createElement('p');details.textContent=(c.classroom_location?t('classLocation')+': '+c.classroom_location+' · ':'')+(c.capacity?t('capacity')+': '+(c.student_count??(c.roster||[]).filter(x=>x.id).length)+'/'+c.capacity+' · ':'')+t(c.lifecycle_status==='active'?'activeStatus':c.lifecycle_status==='archived'?'archivedStatus':'upcomingStatus');
 if(c.groupNames?.length){const assigned=document.createElement('p');assigned.className='class-detail-meta';assigned.textContent=t('assignedGroups')+': '+c.groupNames.join(', ');detail.append(assigned);}
 const roster=document.createElement('div');roster.className='class-detail-roster';const rosterTitle=document.createElement('strong');rosterTitle.textContent=t('roster');roster.append(rosterTitle);
 for(const person of c.roster||[]){
  const p=document.createElement('p');
  if(person.id){
   const button=document.createElement('button');button.type='button';button.className='class-roster-member';button.textContent=person.display_name;
   button.addEventListener('click',()=>window.echoOpenProfile?.(person.id));p.append(button);
  }else p.textContent=person.display_name;
  roster.append(p);
 }
 if(!c.roster?.length){const p=document.createElement('p');p.textContent=t('noRoster');roster.append(p);}
 detail.append(head,info,details,stateLine,desc,roster);
 const materialArea=document.createElement('div');materialArea.className='class-detail-roster';const materialsTitle=document.createElement('strong');materialsTitle.textContent=t('materials');materialArea.append(materialsTitle);
 const {data:materials,error:materialsError}=await db.from('class_materials').select('id,title,description,resource_url,created_at').eq('class_id',c.id).order('created_at',{ascending:false});
 if(materialsError){const m=document.createElement('p');m.textContent=materialsError.message; m.className='class-form-status error';materialArea.append(m);}
 else if(!materials?.length){const m=document.createElement('p');m.textContent=t('noMaterials');materialArea.append(m);}
 else for(const item of materials){const p=document.createElement('p');const a=document.createElement('a');a.href=item.resource_url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=item.title;p.append(a);if(item.description)p.append(document.createTextNode(' — '+item.description));materialArea.append(p);}
 if(canManage){
  const add=document.createElement('form');add.className='class-material-form';
  const nm=document.createElement('input');nm.placeholder=t('materialTitle');nm.maxLength=160;nm.required=true;
  const url=document.createElement('input');url.type='url';url.placeholder=t('materialURL');url.required=true;
  const submit=document.createElement('button');submit.type='submit';submit.className='btn btn-dark';submit.textContent=t('addMaterial');
  add.append(nm,url,submit);add.addEventListener('submit',async ev=>{ev.preventDefault();let parsed;try{parsed=new URL(url.value)}catch{return;}if(parsed.protocol!=='https:')return;submit.disabled=true;const {error}=await db.from('class_materials').insert({class_id:c.id,title:nm.value.trim(),resource_url:parsed.href,created_by:user.id});submit.disabled=false;if(error){alert(error.message);return;}showDetail(c.id);});materialArea.append(add);
 }
 detail.append(materialArea);
 if(canManage){
  const attendance=document.createElement('div');attendance.className='class-detail-roster';const ah=document.createElement('strong');ah.textContent=t('attendance');attendance.append(ah);
  const {data:records,error:attendanceError}=await db.rpc('get_echo_class_attendance',{target_class_id:c.id});
  if(attendanceError){const p=document.createElement('p');p.textContent=attendanceError.message;attendance.append(p);}
  else if(!records?.length){const p=document.createElement('p');p.textContent=t('noAttendance');attendance.append(p);}
  else for(const record of records){const p=document.createElement('p');p.textContent=record.display_name+' · '+fmt(record.joined_at)+(record.left_at?' – '+fmt(record.left_at):' · '+t('live'));attendance.append(p);}
  detail.append(attendance);
 }
 const roomActions=document.createElement('div');roomActions.className='class-detail-actions';
 if(canManage){
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
    end.disabled=true;
    try{await callApi('/api/classroom/end',{classId:c.id});}
    catch(error){end.disabled=false;const note=document.createElement('p');note.className='class-form-status error';note.textContent=error.message;detail.append(note);return;}
    if(activeRoom?.classId===c.id)await leaveRoom({automatic:true});
    await loadClasses();void showDetail(c.id);
   });roomActions.append(end);
  }
 }else if(c.liveRoom){
  const join=document.createElement('button');join.type='button';join.className='btn btn-dark';join.textContent=t('join');join.disabled=state==='cancelled'||state==='completed'||c.is_demo;
  join.addEventListener('click',()=>{void openPrejoin(c.id);});roomActions.append(join);
 }else{
  const waiting=document.createElement('button');waiting.type='button';waiting.className='btn';waiting.textContent=t('waitingProfessor');
  waiting.addEventListener('click',()=>{
   if(waitingRoomTimer)clearInterval(waitingRoomTimer);
   const until=Date.now()+5*60*1000;
   const note=document.createElement('p');note.className='class-form-status';note.textContent=t('waitingProfessor');detail.append(note);
   const check=async()=>{
    if(Date.now()>until){clearInterval(waitingRoomTimer);waitingRoomTimer=null;note.textContent=t('waitingProfessor');return;}
    const {data,error}=await db.from('class_live_rooms').select('status').eq('class_id',c.id).eq('status','live').limit(1);
    if(error){note.textContent=error.message;note.classList.add('error');clearInterval(waitingRoomTimer);waitingRoomTimer=null;return;}
    if(data?.length){
     clearInterval(waitingRoomTimer);waitingRoomTimer=null;
     await loadClasses();void showDetail(c.id);
    }
   };
   waiting.disabled=true;void check();
   waitingRoomTimer=setInterval(()=>{void check();},5000);
  });
  roomActions.append(waiting);
 }
 detail.append(roomActions);
 if(canManage){
  const actions=document.createElement('div');actions.className='class-detail-actions';
  if(c.status!=='cancelled'&&state!=='completed'){
   const cancel=document.createElement('button');cancel.className='btn';cancel.type='button';cancel.textContent=t('cancelClass');
   cancel.onclick=async()=>{
    if(!confirm(t('confirmCancel')))return;cancel.disabled=true;
    if(c.liveRoom){
     try{await callApi('/api/classroom/end',{classId:c.id});}
     catch(error){alert(error.message);cancel.disabled=false;return;}
     if(activeRoom?.classId===c.id)await leaveRoom({automatic:true});
    }
    const {error}=await db.from('classes').update({status:'cancelled',updated_at:new Date().toISOString()}).eq('id',c.id);
    if(error){alert(error.message);cancel.disabled=false;return;}
    await loadClasses();void showDetail(c.id);
   };
   actions.append(cancel);
  }
  const archive=document.createElement('button');archive.className='btn';archive.type='button';archive.textContent=c.lifecycle_status==='archived'?t('unarchive'):t('archive');
  archive.onclick=async()=>{
   archive.disabled=true;
   const nextStatus=c.lifecycle_status==='archived'?'upcoming':'archived';
   const {error}=await db.from('classes').update({lifecycle_status:nextStatus,updated_at:new Date().toISOString()}).eq('id',c.id);
   if(error){archive.disabled=false;alert(error.message);return;}
   if(nextStatus==='archived'&&c.liveRoom){
    try{await callApi('/api/classroom/end',{classId:c.id});if(activeRoom?.classId===c.id)await leaveRoom({automatic:true});}
    catch(error){alert(error.message);}
   }
   await loadClasses();void showDetail(c.id);
  };
  const edit=document.createElement('button');edit.className='btn';edit.type='button';edit.textContent=t('edit');edit.onclick=()=>openEditor(c);
  const del=document.createElement('button');del.className='btn class-danger';del.type='button';del.textContent=t('delete');del.onclick=async()=>{if(!confirm(t('confirmDelete')))return;const {error}=await db.from('classes').delete().eq('id',c.id);if(error){alert(error.message);return;}detail.classList.add('hidden');await loadClasses();};
  actions.append(archive,edit,del);detail.append(actions);
 }
 detail.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function professorMode(){if(isOwner&&ownerPreviewRole==='student')return false;return isOwner||profile?.role==='professor';}
function setPreview(role){
 if(!isOwner)return;
 ownerPreviewRole=role;
 document.getElementById('class-preview-banner').classList.toggle('hidden',!role);
 document.getElementById('class-preview-end').classList.toggle('hidden',!role);
 document.getElementById('class-preview-student').classList.toggle('active',role==='student');
 document.getElementById('class-preview-professor').classList.toggle('active',role==='professor');
 if(role){activate('classes');document.getElementById('class-status').textContent=t('previewBanner');}
 else document.getElementById('class-status').textContent='';
 document.getElementById('class-new').classList.toggle('hidden',!professorMode());
 renderClasses();
}
async function runSpeakerCheck(){
 const button=document.getElementById('class-speaker-check');button.disabled=true;
 const area=document.getElementById('class-test-results');
 const row=document.createElement('div');row.className='class-test-row';
 const name=document.createElement('span');name.textContent=t('speakerOutput');
 const result=document.createElement('strong');result.className='not-tested';result.textContent=t('notTested');
 row.append(name,result);area.prepend(row);
 try{
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  if(!AudioContextClass)throw new Error('Audio output testing is not supported in this browser.');
  const context=new AudioContextClass();await context.resume();
  const oscillator=context.createOscillator(),gain=context.createGain();
  oscillator.frequency.value=660;gain.gain.value=0.12;oscillator.connect(gain);gain.connect(context.destination);
  oscillator.start();oscillator.stop(context.currentTime+0.8);
  await new Promise(resolve=>setTimeout(resolve,950));
  const heard=confirm(t('speakerQuestion'));
  result.textContent=t(heard?'passed':'failed');result.className=heard?'passed':'failed';
  await context.close();
 }catch(error){result.textContent=t('failed')+' · '+(error.message||'Error');result.className='failed';}
 finally{button.disabled=false;}
}
async function runChecks(){
 const area=document.getElementById('class-test-results');area.replaceChildren();
 const tests=[
  {name:t('authCheck'),run:async()=>{const r=await db.auth.getSession();if(r.error)throw r.error;if(!r.data.session)throw new Error('No active session');return true;}},
  {name:t('dbCheck'),run:async()=>{const r=await db.from('classes').select('id').limit(1);if(r.error)throw r.error;return true;}},
  {name:t('roleCheck'),run:async()=>{const r=await db.rpc('is_echo_owner');if(r.error)throw r.error;if(!r.data)throw new Error('Owner permission check returned false');return true;}},
  {name:t('profileCheck'),run:async()=>{const r=await db.from('profiles').select('id').eq('id',user.id).single();if(r.error)throw r.error;if(r.data.id!==user.id)throw new Error('Profile does not match the signed-in account.');return true;}},
  {name:t('announcementCheck'),run:async()=>{const r=await db.from('announcements').select('id').limit(1);if(r.error)throw r.error;return true;}},
  {name:t('messageCheck'),run:async()=>{const r=await db.from('private_messages').select('id').limit(1);if(r.error)throw r.error;return true;}},
  {name:t('sfuCheck'),run:async()=>{const r=await callApi('/api/classroom/health',{});if(!r.reachable||!r.sessionInspected)throw new Error('SFU API health check did not complete.');return true;}},
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
    }finally{
      if(id){
        const removedParticipants=await db.from('class_demo_participants').delete().eq('class_id',id);
        if(removedParticipants.error)throw removedParticipants.error;
        const removedClass=await db.from('classes').delete().eq('id',id);
        if(removedClass.error)throw removedClass.error;
      }
    }
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
 document.getElementById('class-preview-student').textContent=t('previewStudent');
 document.getElementById('class-preview-professor').textContent=t('previewProfessor');
 document.getElementById('class-preview-end').textContent=t('endPreview');
 document.getElementById('class-preview-banner').textContent=t('previewBanner');
 document.getElementById('class-speaker-check').textContent=t('speakerOutput');
document.getElementById('class-speaker-check').textContent=t('speakerOutput');
 const labels=panel.querySelectorAll('.class-form-grid label');
 const labelCopy=[t('name'),t('subject'),t('description'),t('image'),t('start'),t('end'),t('assignedProfessor'),t('location'),t('capacity'),t('lifecycleStatus')];
 labels.forEach((node,i)=>{if(labelCopy[i])node.childNodes[0].textContent=labelCopy[i];});
 document.getElementById('class-search').placeholder=t('searchClasses');
 document.getElementById('class-student-search').placeholder=t('studentSearch');
 const lifecycleFilter=document.getElementById('class-lifecycle-filter');
 lifecycleFilter.options[0].textContent=t('allStatuses');
 lifecycleFilter.options[1].textContent=t('activeStatus');
 lifecycleFilter.options[2].textContent=t('upcomingStatus');
 lifecycleFilter.options[3].textContent=t('archivedStatus');
 const lifecycle=document.getElementById('class-lifecycle');
 lifecycle.options[0].textContent=t('upcomingStatus');
 lifecycle.options[1].textContent=t('activeStatus');
 lifecycle.options[2].textContent=t('archivedStatus');
 panel.querySelector('.class-student-picker strong').textContent=t('students');
 panel.querySelector('#class-demo-picker label').childNodes[0].textContent=t('demoStudents');
 document.getElementById('class-cancel').textContent=t('cancel');
 document.getElementById('class-save').textContent=t('save');
 document.querySelector('.class-inline #class-open').parentElement.childNodes[1].textContent=' '+t('allowUnassigned');
 document.querySelector('.class-inline #class-demo').parentElement.childNodes[1].textContent=' '+t('demo');
 document.querySelector('.class-inline #class-repeat').parentElement.childNodes[1].textContent=' '+t('recurrence')+' ';
 toggleDemoEditor();
 document.getElementById('class-room-close').textContent=t('cancel');
 document.getElementById('class-room-enter').textContent=t('joinNow');
 document.getElementById('class-room-leave').textContent=t('leave');
 document.getElementById('class-room-fullscreen').textContent=document.fullscreenElement?t('exitFullScreen'):t('fullScreen');
 document.getElementById('class-share-screen').textContent=activeRoom?.screenStream?t('stopSharing'):t('shareScreen');
 document.getElementById('class-raise-hand').textContent=activeRoom?.handRaised?t('lowerHand'):t('raiseHand');
 document.getElementById('class-mic-toggle').textContent=t('mute');
 document.getElementById('class-camera-toggle').textContent=t('cameraOff');
 document.getElementById('class-speaker-test').textContent=t('speakerTest');
 document.getElementById('class-live-mic').textContent=activeRoom?.previewStream?.getAudioTracks()[0]?.enabled===false?t('unmute'):t('mute');
 document.getElementById('class-live-camera').textContent=activeRoom?.teacherCameraOff?t('cameraOff'):(activeRoom?.localCameraOff?t('cameraOn'):t('cameraOff'));
 document.getElementById('class-live-camera').disabled=!!activeRoom?.teacherCameraOff||!activeRoom?.previewStream?.getVideoTracks().length;
}
async function boot(session){
 if(waitingRoomTimer){clearInterval(waitingRoomTimer);waitingRoomTimer=null;}
 ownerPreviewRole=null;
 user=session.user;isOwner=OWNER_EMAILS.has((user.email||'').toLowerCase());
 const {data,error}=await db.from('profiles').select('id,display_name,role').eq('id',user.id).maybeSingle();
 profile=data||{id:user.id,role:'student'};
 tab.classList.toggle('hidden',!user);testTab.classList.toggle('hidden',!isOwner);
 document.getElementById('class-new').classList.toggle('hidden',!professorMode());
 if(professorMode()){await loadStudents();if(isOwner)await loadProfessors();}else{students=[];professors=[];}
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
