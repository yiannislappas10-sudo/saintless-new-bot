import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const OWNER_EMAILS = new Set(['yiannislappas8@gmail.com','yiannislappas10@gmail.com']);
const BUCKET = 'echo-profile-photos';
const $ = id => document.getElementById(id);
const lang = () => {
  try { return localStorage.getItem('echo-language') === 'el' ? 'el' : 'en'; }
  catch (_) { return 'en'; }
};
const copy = {
  en: {
    openProfile:'Open profile', profile:'Profile', subtitle:'Personal details and your enrolled classes.',
    close:'Close', myProfile:'My profile', manageStudents:'Manage students', back:'Back to students',
    fullName:'Full name', picture:'Profile picture', changePicture:'Choose picture', birthday:'Birthday',
    age:'Age', gender:'Gender (optional)', email:'Email address', phone:'Phone (optional)',
    biography:'About me', studentId:'Student ID', enrollmentDate:'Enrollment date',
    notes:'Private staff notes', classes:'Assigned classes', noClasses:'No classes assigned yet.',
    privacy:'Profile visibility', privacyHelp:'Choose which details other ECHO users can see.',
    save:'Save changes', saving:'Saving…', saved:'Profile saved.', failed:'Could not save profile.',
    directory:'Student profiles', searchStudents:'Search students by name…', noStudents:'No student profiles are available to manage.',
    selectStudent:'Select a student to view and edit their profile.',
    permission:'You can edit your profile. Academic fields are managed by your professor.',
    private:'Private', visible:'Visible', noBirthday:'Not provided', years:'years old',
    avatarError:'Choose a PNG, JPEG, or WebP image up to 5 MB.',
    uploading:'Uploading picture…', uploaded:'Picture ready to save.',
    visAvatar:'Profile picture', visFullName:'Full name', visBirthday:'Birthday',
    visGender:'Gender', visEmail:'Email address', visPhone:'Phone number',
    visBiography:'Biography', visStudentId:'Student ID', visEnrollment:'Enrollment date', visClasses:'Assigned classes',
    noBio:'No biography added.', statusActive:'Active', statusUpcoming:'Upcoming', statusArchived:'Archived',
    assigned:'assigned classes', classProfessor:'Professor', location:'Location', schedule:'Schedule',
    student:'Student', professor:'Professor', owner:'Primary Owner', ageUnknown:'—'
  },
  el: {
    openProfile:'Άνοιγμα προφίλ', profile:'Προφίλ', subtitle:'Προσωπικά στοιχεία και τα μαθήματά σας.',
    close:'Κλείσιμο', myProfile:'Το προφίλ μου', manageStudents:'Διαχείριση μαθητών', back:'Πίσω στους μαθητές',
    fullName:'Ονοματεπώνυμο', picture:'Φωτογραφία προφίλ', changePicture:'Επιλογή φωτογραφίας', birthday:'Ημερομηνία γέννησης',
    age:'Ηλικία', gender:'Φύλο (προαιρετικό)', email:'Διεύθυνση email', phone:'Τηλέφωνο (προαιρετικό)',
    biography:'Σχετικά με εμένα', studentId:'Κωδικός μαθητή', enrollmentDate:'Ημερομηνία εγγραφής',
    notes:'Ιδιωτικές σημειώσεις προσωπικού', classes:'Ανατεθειμένα μαθήματα', noClasses:'Δεν έχουν ανατεθεί μαθήματα.',
    privacy:'Ορατότητα προφίλ', privacyHelp:'Επιλέξτε ποια στοιχεία μπορούν να βλέπουν οι υπόλοιποι χρήστες του ECHO.',
    save:'Αποθήκευση αλλαγών', saving:'Αποθήκευση…', saved:'Το προφίλ αποθηκεύτηκε.', failed:'Δεν ήταν δυνατή η αποθήκευση.',
    directory:'Προφίλ μαθητών', searchStudents:'Αναζήτηση μαθητών…', noStudents:'Δεν υπάρχουν προφίλ μαθητών για διαχείριση.',
    selectStudent:'Επιλέξτε μαθητή για προβολή και επεξεργασία του προφίλ του.',
    permission:'Μπορείτε να επεξεργαστείτε το προφίλ σας. Τα ακαδημαϊκά στοιχεία τα διαχειρίζεται ο καθηγητής σας.',
    private:'Ιδιωτικό', visible:'Ορατό', noBirthday:'Δεν έχει οριστεί', years:'ετών',
    avatarError:'Επιλέξτε εικόνα PNG, JPEG ή WebP έως 5 MB.',
    uploading:'Μεταφόρτωση φωτογραφίας…', uploaded:'Η φωτογραφία είναι έτοιμη για αποθήκευση.',
    visAvatar:'Φωτογραφία προφίλ', visFullName:'Ονοματεπώνυμο', visBirthday:'Ημερομηνία γέννησης',
    visGender:'Φύλο', visEmail:'Διεύθυνση email', visPhone:'Τηλέφωνο',
    visBiography:'Βιογραφικό', visStudentId:'Κωδικός μαθητή', visEnrollment:'Ημερομηνία εγγραφής', visClasses:'Ανατεθειμένα μαθήματα',
    noBio:'Δεν έχει προστεθεί βιογραφικό.', statusActive:'Ενεργό', statusUpcoming:'Προσεχές', statusArchived:'Αρχειοθετημένο',
    assigned:'ανατεθειμένα μαθήματα', classProfessor:'Καθηγητής', location:'Τοποθεσία', schedule:'Πρόγραμμα',
    student:'Μαθητής', professor:'Καθηγητής', owner:'Κύριος Ιδιοκτήτης', ageUnknown:'—'
  }
};
const t = key => copy[lang()][key] || copy.en[key] || key;
let db = null;
let user = null;
let authProfile = null;
let targetId = null;
let targetProfile = null;
let directoryRows = [];
let directoryOpen = false;
let pendingAvatarFile = null;
let headerAvatarToken = 0;

const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = '/profile.css?v=20261101-profile-class-manager';
document.head.append(style);

function make(tag, className='', text='') {
  const node=document.createElement(tag);
  if(className)node.className=className;
  if(text!==undefined&&text!==null)node.textContent=String(text);
  return node;
}
function dateValue(value) {
  if(!value)return '';
  try{return String(value).slice(0,10);}catch{return '';}
}
function ageFromBirthday(value) {
  if(!value)return null;
  const parts=String(value).slice(0,10).split('-').map(Number);
  if(parts.length!==3||!parts[0]||!parts[1]||!parts[2])return null;
  const now=new Date();
  let age=now.getFullYear()-parts[0];
  if(now.getMonth()+1<parts[1]||(now.getMonth()+1===parts[1]&&now.getDate()<parts[2]))age--;
  return age>=0&&age<=125?age:null;
}
function formatClassTime(value) {
  if(!value)return '';
  try{return new Intl.DateTimeFormat(lang()==='el'?'el-GR':'en-GB',{timeZone:'Europe/Athens',dateStyle:'medium',timeStyle:'short'}).format(new Date(value));}
  catch{return '';}
}
function isOwner() { return OWNER_EMAILS.has((user?.email||'').toLowerCase()); }
function isProfessor() { return isOwner() || authProfile?.role==='professor'; }
function mount() {
  if($('profile-overlay'))return;
  const overlay=make('div','echo-profile-overlay hidden');
  overlay.id='profile-overlay';
  overlay.innerHTML=`
    <section class="echo-profile-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-title">
      <header class="echo-profile-header">
        <div><p class="echo-profile-eyebrow">ECHO · ACCOUNT</p><h2 id="profile-title"></h2><p id="profile-subtitle"></p></div>
        <button type="button" class="echo-profile-close" id="profile-close" aria-label="Close">×</button>
      </header>
      <nav class="echo-profile-switch hidden" id="profile-switch">
        <button type="button" data-profile-view="mine" class="active" id="profile-mine-tab"></button>
        <button type="button" data-profile-view="directory" id="profile-directory-tab"></button>
      </nav>
      <div class="echo-profile-body">
        <section id="profile-main-view">
          <div class="echo-profile-editor-head">
            <div class="echo-profile-avatar-wrap"><div class="echo-profile-picture" id="profile-picture">E</div><label class="echo-profile-upload" for="profile-picture-file" id="profile-picture-label"></label><input type="file" id="profile-picture-file" accept="image/png,image/jpeg,image/webp" hidden></div>
            <div class="echo-profile-editor-heading"><span id="profile-role-chip" class="echo-profile-role"></span><p id="profile-permission-note"></p></div>
          </div>
          <form id="profile-form" novalidate>
            <div class="echo-profile-section"><h3 id="profile-personal-heading"></h3>
              <div class="echo-profile-grid">
                <label><span id="profile-label-full-name"></span><input id="profile-full-name" maxlength="100" autocomplete="name" required></label>
                <label><span id="profile-label-birthday"></span><input id="profile-birthday" type="date" max="${new Date().toISOString().slice(0,10)}"></label>
                <label><span id="profile-label-age"></span><input id="profile-age" readonly tabindex="-1"></label>
                <label><span id="profile-label-gender"></span><input id="profile-gender" maxlength="40"></label>
                <label><span id="profile-label-email"></span><input id="profile-email" type="email" readonly></label>
                <label><span id="profile-label-phone"></span><input id="profile-phone" type="tel" maxlength="40" autocomplete="tel"></label>
                <label class="echo-profile-wide"><span id="profile-label-biography"></span><textarea id="profile-biography" rows="3" maxlength="2000"></textarea></label>
              </div>
            </div>
            <div class="echo-profile-section hidden" id="profile-academic-section"><h3 id="profile-academic-heading"></h3>
              <div class="echo-profile-grid">
                <label><span id="profile-label-student-id"></span><input id="profile-student-id" maxlength="80"></label>
                <label><span id="profile-label-enrollment"></span><input id="profile-enrollment-date" type="date" max="${new Date().toISOString().slice(0,10)}"></label>
                <label class="echo-profile-wide"><span id="profile-label-notes"></span><textarea id="profile-notes" rows="3" maxlength="3000"></textarea></label>
              </div>
            </div>
            <div class="echo-profile-section"><h3 id="profile-classes-heading"></h3><div class="echo-profile-class-list" id="profile-classes"></div></div>
            <div class="echo-profile-section"><h3 id="profile-privacy-heading"></h3><p class="echo-profile-help" id="profile-privacy-help"></p><div class="echo-profile-privacy" id="profile-visibility"></div></div>
            <p class="echo-profile-status" id="profile-status" role="status" aria-live="polite"></p>
            <div class="echo-profile-actions"><button type="button" class="btn" id="profile-back" hidden></button><button type="submit" class="btn btn-dark" id="profile-save"></button></div>
          </form>
        </section>
        <section id="profile-directory-view" class="hidden">
          <div class="echo-profile-directory-head"><div><h3 id="profile-directory-heading"></h3><p id="profile-directory-help"></p></div><input id="profile-directory-search" type="search" autocomplete="off"></div>
          <div id="profile-directory-list" class="echo-profile-directory-list"></div>
          <p class="echo-profile-status" id="profile-directory-status" role="status"></p>
        </section>
      </div>
    </section>`;
  document.body.append(overlay);
  $('avatar')?.addEventListener('click',openOwnProfile);
  $('profile-close').addEventListener('click',closeModal);
  overlay.addEventListener('click',event=>{if(event.target===overlay)closeModal();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!overlay.classList.contains('hidden'))closeModal();});
  $('profile-form').addEventListener('submit',saveProfile);
  $('profile-birthday').addEventListener('input',updateAge);
  $('profile-picture-file').addEventListener('change',event=>{
    const file=event.target.files?.[0]||null;
    if(!file)return;
    if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5*1024*1024){
      $('profile-status').textContent=t('avatarError');event.target.value='';pendingAvatarFile=null;return;
    }
    pendingAvatarFile=file;
    const reader=new FileReader();
    reader.onload=()=>{const picture=$('profile-picture');picture.replaceChildren();const img=make('img');img.src=String(reader.result);img.alt='Profile picture';picture.append(img);};
    reader.readAsDataURL(file);
    $('profile-status').textContent=t('uploaded');
  });
  $('profile-directory-search').addEventListener('input',renderDirectory);
  document.querySelectorAll('[data-profile-view]').forEach(button=>button.addEventListener('click',()=>{
    if(button.dataset.profileView==='directory')void openDirectory();else void openOwnProfile();
  }));
  $('profile-back').addEventListener('click',()=>void openDirectory());
  window.addEventListener('storage',event=>{if(event.key==='echo-language')applyLanguage();});
  $('app-language')?.addEventListener('click',()=>setTimeout(applyLanguage,0));
  $('login-language')?.addEventListener('click',()=>setTimeout(applyLanguage,0));
  applyLanguage();
}
function initials(name) {
  const words=String(name||user?.email||'E').trim().split(/\s+/).filter(Boolean);
  return words.slice(0,2).map(x=>x[0]?.toUpperCase()||'').join('')||'E';
}
async function signedAvatar(path) {
  if(!db||!path)return null;
  const {data,error}=await db.storage.from(BUCKET).createSignedUrl(path,3600);
  if(error)throw error;
  return data?.signedUrl||null;
}
async function updateHeaderAvatar() {
  const button=$('avatar');
  if(!button||!user)return;
  const token=++headerAvatarToken;
  button.title=t('openProfile');
  button.setAttribute('aria-label',t('openProfile'));
  const name=authProfile?.full_name||authProfile?.display_name||user.email;
  button.textContent=initials(name);
  if(!authProfile?.avatar_path)return;
  try{
    const url=await signedAvatar(authProfile.avatar_path);
    if(token!==headerAvatarToken||!url)return;
    const img=make('img');img.src=url;img.alt='';img.draggable=false;
    button.replaceChildren(img);
  }catch(error){console.warn('ECHO profile picture could not be loaded:',error?.message||error);}
}
function applyLanguage() {
  const set=(id,key)=>{const node=$(id);if(node)node.textContent=t(key);};
  set('profile-title','profile');set('profile-subtitle','subtitle');
  set('profile-mine-tab','myProfile');set('profile-directory-tab','manageStudents');
  set('profile-picture-label','changePicture');
  set('profile-personal-heading','myProfile');set('profile-academic-heading','manageStudents');
  set('profile-label-full-name','fullName');set('profile-label-birthday','birthday');
  set('profile-label-age','age');set('profile-label-gender','gender');set('profile-label-email','email');
  set('profile-label-phone','phone');set('profile-label-biography','biography');
  set('profile-label-student-id','studentId');set('profile-label-enrollment','enrollmentDate');set('profile-label-notes','notes');
  set('profile-classes-heading','classes');set('profile-privacy-heading','privacy');set('profile-privacy-help','privacyHelp');
  set('profile-save','save');set('profile-back','back');set('profile-directory-heading','directory');
  set('profile-directory-help','selectStudent');
  const search=$('profile-directory-search');if(search)search.placeholder=t('searchStudents');
  const close=$('profile-close');if(close)close.setAttribute('aria-label',t('close'));
  renderVisibility();
  if(targetProfile)renderClasses(targetProfile.assigned_classes||[]);
}
function updateAge() {
  const age=ageFromBirthday($('profile-birthday')?.value);
  $('profile-age').value=age===null?t('ageUnknown'):age+' '+t('years');
}
const VISIBILITY = [
  ['avatar','visAvatar'],['full_name','visFullName'],['birthday','visBirthday'],['gender','visGender'],
  ['email','visEmail'],['phone','visPhone'],['biography','visBiography'],['student_id','visStudentId'],
  ['enrollment_date','visEnrollment'],['classes','visClasses']
];
function renderVisibility() {
  const area=$('profile-visibility');if(!area)return;
  area.replaceChildren();
  const values=targetProfile?.profile_visibility||{};
  for(const [key,label] of VISIBILITY){
    const row=make('label','echo-profile-visibility-row');
    const text=make('span','',t(label));
    const box=make('input');box.type='checkbox';box.checked=values[key]===undefined?(['avatar','full_name','biography','classes'].includes(key)):!!values[key];box.dataset.visibility=key;
    row.append(text,box);area.append(row);
  }
}
function renderClasses(items) {
  const area=$('profile-classes');if(!area)return;
  area.replaceChildren();
  if(!items?.length){area.append(make('div','echo-profile-empty',t('noClasses')));return;}
  for(const item of items){
    const card=make('article','echo-profile-class-card');
    const main=make('div','echo-profile-class-main');
    main.append(make('strong','',item.title||'ECHO class'),make('span','',item.subject||''));
    const meta=make('div','echo-profile-class-meta');
    meta.append(make('span','',t('classProfessor')+': '+(item.professor_name||'ECHO')));
    if(item.location)meta.append(make('span','',t('location')+': '+item.location));
    if(item.starts_at)meta.append(make('span','',t('schedule')+': '+formatClassTime(item.starts_at)));
    const state=make('span','echo-profile-class-state '+(item.status||'upcoming'),t('status'+(item.status||'upcoming').charAt(0).toUpperCase()+(item.status||'upcoming').slice(1)));
    card.append(main,meta,state);area.append(card);
  }
}
function setView(view) {
  $('profile-main-view').classList.toggle('hidden',view!=='mine');
  $('profile-directory-view').classList.toggle('hidden',view!=='directory');
  $('profile-mine-tab').classList.toggle('active',view==='mine');
  $('profile-directory-tab').classList.toggle('active',view==='directory');
}
async function loadProfile(targetUserId) {
  targetId=targetUserId;
  pendingAvatarFile=null;
  $('profile-picture-file').value='';
  $('profile-status').textContent='';
  $('profile-save').disabled=true;
  $('profile-save').textContent=t('saving');
  $('profile-form').classList.add('echo-profile-loading');
  try{
    const {data,error}=await db.rpc('get_echo_profile',{target_user_id:targetUserId});
    if(error)throw error;
    const record=Array.isArray(data)?data[0]:data;
    if(!record)throw new Error('Profile was not returned.');
    targetProfile=record;
    const currentTarget=targetUserId===user.id;
    const staff= isOwner() || authProfile?.role==='professor';
    const academicEditable=staff&&(isOwner()||!currentTarget);
    $('profile-role-chip').textContent=(isOwner()&&currentTarget)?t('owner'):(record.role==='professor'?t('professor'):t('student'));
    $('profile-permission-note').textContent=academicEditable?'':(currentTarget?t('permission'):'');
    $('profile-full-name').value=record.full_name||record.display_name||'';
    $('profile-birthday').value=dateValue(record.birthday);
    $('profile-gender').value=record.gender||'';
    $('profile-email').value=record.email||'';
    $('profile-email').placeholder=record.email?'':'Private';
    $('profile-phone').value=record.phone||'';
    $('profile-biography').value=record.biography||'';
    $('profile-student-id').value=record.student_id||'';
    $('profile-enrollment-date').value=dateValue(record.enrollment_date);
    $('profile-notes').value=record.additional_notes||'';
    $('profile-academic-section').classList.toggle('hidden',!(record.can_manage&&(isOwner()||(staff&&!currentTarget))));
    $('profile-student-id').readOnly=!academicEditable;
    $('profile-enrollment-date').readOnly=!academicEditable;
    $('profile-notes').readOnly=!(isOwner()||(staff&&!currentTarget));
    ['profile-full-name','profile-birthday','profile-gender','profile-phone','profile-biography'].forEach(id=>$(id).disabled=!record.can_manage);
    $('profile-picture-file').disabled=!(record.can_manage&&currentTarget);
    $('profile-visibility').classList.toggle('hidden',!record.can_manage);
    $('profile-save').classList.toggle('hidden',!record.can_manage);
    $('profile-save').disabled=false;$('profile-save').textContent=t('save');
    $('profile-back').hidden=currentTarget;
    updateAge();renderVisibility();renderClasses(record.assigned_classes||[]);
    const picture=$('profile-picture');picture.textContent=initials(record.full_name||record.display_name);
    if(record.avatar_path){
      try{const url=await signedAvatar(record.avatar_path);if(url){const img=make('img');img.src=url;img.alt='Profile picture';picture.replaceChildren(img);}}
      catch(error){$('profile-status').textContent=error.message||t('failed');}
    }
    if(currentTarget){
      authProfile={...authProfile,full_name:record.full_name,display_name:record.display_name,avatar_path:record.avatar_path};
      void updateHeaderAvatar();
    }
  }catch(error){
    $('profile-status').textContent=error?.message||t('failed');
  }finally{
    $('profile-form').classList.remove('echo-profile-loading');
    $('profile-save').disabled=false;
    $('profile-save').textContent=t('save');
  }
}
async function saveProfile(event) {
  event.preventDefault();
  if(!db||!user||!targetProfile?.can_manage)return;
  const status=$('profile-status'),button=$('profile-save');
  status.textContent='';button.disabled=true;button.textContent=t('saving');
  try{
    let avatarPath=targetProfile.avatar_path||null;
    if(pendingAvatarFile){
      const ext=pendingAvatarFile.type==='image/png'?'png':pendingAvatarFile.type==='image/webp'?'webp':'jpg';
      avatarPath=user.id+'/avatar-'+Date.now()+'.'+ext;
      const {error:uploadError}=await db.storage.from(BUCKET).upload(avatarPath,pendingAvatarFile,{upsert:false,contentType:pendingAvatarFile.type,cacheControl:'3600'});
      if(uploadError)throw uploadError;
    }
    const profileData={
      full_name:$('profile-full-name').value.trim(),
      avatar_path:avatarPath,
      birthday:$('profile-birthday').value||null,
      gender:$('profile-gender').value.trim()||null,
      phone:$('profile-phone').value.trim()||null,
      biography:$('profile-biography').value,
      additional_notes:$('profile-notes').value
    };
    if(!$('profile-student-id').readOnly)profileData.student_id=$('profile-student-id').value.trim()||null;
    if(!$('profile-enrollment-date').readOnly)profileData.enrollment_date=$('profile-enrollment-date').value||null;
    const visibility={};
    document.querySelectorAll('#profile-visibility [data-visibility]').forEach(box=>visibility[box.dataset.visibility]=box.checked);
    const {error}=await db.rpc('save_echo_profile',{target_user_id:targetId,profile_data:profileData,visibility_data:visibility});
    if(error)throw error;
    status.textContent=t('saved');pendingAvatarFile=null;
    await loadProfile(targetId);
    status.textContent=t('saved');
  }catch(error){
    status.textContent=error?.message||t('failed');
  }finally{
    button.disabled=false;button.textContent=t('save');
  }
}
function renderDirectory() {
  const list=$('profile-directory-list');if(!list)return;
  const search=($('profile-directory-search').value||'').trim().toLowerCase();
  const rows=directoryRows.filter(row=>(row.display_name||'').toLowerCase().includes(search));
  list.replaceChildren();
  if(!rows.length){list.append(make('div','echo-profile-empty',t('noStudents')));return;}
  for(const row of rows){
    const button=make('button','echo-profile-directory-card');
    button.type='button';button.append(make('strong','',row.display_name||'ECHO student'));
    button.append(make('span','',row.class_count+' '+t('assigned')));
    button.addEventListener('click',async()=>{$('profile-back').hidden=false;setView('mine');await loadProfile(row.profile_id);});
    list.append(button);
  }
}
async function openDirectory() {
  if(!isProfessor())return;
  setView('directory');
  $('profile-directory-status').textContent='';
  $('profile-directory-list').replaceChildren(make('div','echo-profile-empty','Loading…'));
  try{
    const {data,error}=await db.rpc('get_echo_profile_directory');
    if(error)throw error;
    directoryRows=data||[];
    renderDirectory();
  }catch(error){$('profile-directory-status').textContent=error?.message||t('failed');}
}
async function openOwnProfile() {
  if(!db||!user)return;
  directoryOpen=false;
  $('profile-overlay').classList.remove('hidden');
  document.body.classList.add('echo-profile-open');
  setView('mine');
  $('profile-back').hidden=true;
  await loadProfile(user.id);
  if(isProfessor()){
    $('profile-switch').classList.remove('hidden');
  }else{
    $('profile-switch').classList.add('hidden');
  }
  $('avatar')?.blur();
}
async function closeModal() {
  $('profile-overlay')?.classList.add('hidden');
  document.body.classList.remove('echo-profile-open');
  pendingAvatarFile=null;
}
async function start() {
  mount();
  try{
    const config=await fetch('/config',{cache:'no-store'}).then(response=>{if(!response.ok)throw new Error('ECHO configuration could not be loaded.');return response.json();});
    db=createClient(config.supabaseUrl,config.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    const {data,error}=await db.auth.getSession();
    if(error)throw error;
    if(data.session){
      user=data.session.user;
      await loadAuthProfile();
    }
    db.auth.onAuthStateChange((_event,session)=>{
      user=session?.user||null;
      authProfile=null;targetProfile=null;
      if(!user){
        headerAvatarToken++;const avatar=$('avatar');if(avatar)avatar.textContent='E';
        closeModal();return;
      }
      void loadAuthProfile().catch(error=>console.warn('ECHO profile initialization failed:',error?.message||error));
    });
  }catch(error){console.error('ECHO profile manager failed to initialize:',error?.message||error);}
}
async function loadAuthProfile() {
  if(!db||!user)return;
  const {data,error}=await db.from('profiles').select('id,display_name,role').eq('id',user.id).maybeSingle();
  if(error)throw error;
  authProfile={...(data||{id:user.id,display_name:user.email||'ECHO user',role:'student'})};
  await updateHeaderAvatar();
}
window.echoOpenProfile = async profileId => {
  if(!profileId||profileId===user?.id){await openOwnProfile();return;}
  if(!db||!user)return;
  $('profile-overlay').classList.remove('hidden');
  document.body.classList.add('echo-profile-open');
  $('profile-switch').classList.toggle('hidden',!isProfessor());
  $('profile-back').hidden=false;
  setView('mine');
  await loadProfile(profileId);
};
start();
