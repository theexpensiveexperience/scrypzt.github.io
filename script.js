const $ = id => document.getElementById(id);
const GLITCH = '!@#$%^&*<>/\\|{}[]~?';
const gc = () => GLITCH[Math.random() * GLITCH.length | 0];

const BOOT = [
  { t: 'alfrednguyen.me — portfolio v2.1', c: 'b', ms: 0 },
  { t: '', c: 'd', ms: 0 },
  { t: '[ 0.001 ] Kernel: Systemstart...', c: 'd', ms: 0 },
  { t: '[ 0.041 ] CPU: Intel Core i7-1260P @ 2.10GHz', c: 'd', ms: 0 },
  { t: '[ 0.132 ] Aufklaerung  ... \x1bOK\x1b', c: 'ok', ms: 0 },
  { t: '[ 0.178 ] Verteidigung ... \x1bOK\x1b', c: 'ok', ms: 0 },
  { t: '[ 0.210 ] burpsuite · wireshark · nmap ... online', c: 'n', ms: 0 },
  { t: '[ 0.330 ] Ausbildung: Technische Assistenten — Lichtenfels', c: 'n', ms: 0 },
  { t: '[ 0.370 ] Zertifikat: Google Cybersecurity · Proofpoint', c: 'ok', ms: 0 },
  { t: '[ 0.400 ] Sprachen: vi:Muttersprache · en:C1 · de:B2', c: 'n', ms: 0 },
  { t: '', c: 'd', ms: 0 },
  { t: '[ 0.440 ] WARNUNG: Alle Aktivitaeten werden protokolliert', c: 'w', ms: 0 },
  { t: '[ 0.470 ] Ziel: Ausbildung zum Fachinformatiker Systemintegration/Anwendungsentwickler ', c: 'w', ms: 0 },
  { t: '', c: 'd', ms: 0 },
  { t: '[ 0.520 ] Alle Systeme betriebsbereit.', c: 'b', ms: 40 },
  { t: '> Portfolio wird gestartet...', c: 'c', ms: 0 },
];

let booting = true;

function typeLine(el, text, speed, cb) {
  const clean = text.replace(/\x1b(OK)\x1b/g, '$1');
  const hasOK = text.includes('\x1bOK\x1b');
  let i = 0;
  (function tick() {
    if (i <= clean.length) {
      let d = clean.slice(0, i);
      if (hasOK && i < clean.length) d += gc();
      el.textContent = d;
      i++;
      setTimeout(tick, speed);
    } else {
      el.textContent = clean;
      if (cb) cb();
    }
  })();
}

function runBoot(idx) {
  if (!booting) { doTransition(); return; }
  if (idx >= BOOT.length) { setTimeout(doTransition, 80); return; }
  const item = BOOT[idx];
  const c = $('blines');
  const el = document.createElement('div');
  el.className = 'bl ' + item.c;
  c.appendChild(el);
  window.scrollTo(0, document.body.scrollHeight);
  const spd = item.t.length > 0 ? 1 : 0;
  typeLine(el, item.t, spd, () => setTimeout(() => runBoot(idx + 1), item.ms));
}

function skipBoot() { booting = false; doTransition(); }

function doTransition() {
  $('skip-hint').style.display = 'none';
  const w = $('wipe');
  w.style.transition = 'transform 0.30s cubic-bezier(0.4,0,0.2,1)';
  w.style.transformOrigin = 'top';
  w.style.transform = 'scaleY(1)';
  setTimeout(() => {
    $('boot').style.display = 'none';
    const cv = $('cv');
    cv.style.display = 'block';
    w.style.transformOrigin = 'bottom';
    w.style.transition = 'transform 0.36s cubic-bezier(0.4,0,0.2,1)';
    requestAnimationFrame(() => {
      w.style.transform = 'scaleY(0)';
      setTimeout(() => {
        cv.style.opacity = '1';
        typeHero();
      }, 260);
    });
  }, 340);
}

function typeHero() {
  typeLine($('hero-name-el'), 'Minh Hieu Nguyen', 6, () => {
    $('hero-socials').classList.add('visible');
    typeLine($('hero-loc'), 'coburg, deutschland', 5, () => {
      typeLine($('hero-tag-el'),
        'IT-Schüler — Netzwerke/Systeme erkunden: Ausbildung zum Fachinformatiker Systemintegration/Anwendungsentwickler',
        4, () => { revealBody(); });
    });
  });
}


function revealBody() {
  $('cv-body').style.opacity = '1';
  const ids = ['s1', 's3'];
  ids.forEach((id, i) => setTimeout(() => {
    const el = $(id);
    if (el) el.classList.add('on');
  }, i * 150 + 60));
  setTimeout(() => {
    $('cmd-wrap').classList.add('on');
    $('cmd-in').focus();
    startAmbient();
  }, ids.length * 150 + 300);
}

function startAmbient() {
  setInterval(() => {
    if (Math.random() < 0.04) {
      const tags = document.querySelectorAll('.tag');
      const t = tags[Math.random() * tags.length | 0];
      const orig = t.textContent;
      t.textContent = orig.split('').map(c => Math.random() < 0.18 ? gc() : c).join('');
      setTimeout(() => t.textContent = orig, 140);
    }
  }, 2800);
}

const CMDS_DE = {
  whoami: `minh hieu nguyen  //  alfred
IT-Schueler — Coburg, Deutschland
E-Mail  →  nguyenhieu.231004@gmail.com
Web     →  alfrednguyen.me
Ziel: Ausbildung Fachinformatiker Systemintegration`,

  kontakt: `E-Mail   →  nguyenhieu.231004@gmail.com
github   →  github.com/scrypzt
linkedin →  linkedin.com/in/nguyen-minh-hieu-a3445121b
Web      →  alfrednguyen.me
Adresse  →  Kalenderweg, 96450 Coburg`,

  ausbildung: `[laufend]
  Technische Assistenten fuer Informatik
  → 09/2025 — heute · Lichtenfels, Bayern

[abgeschlossen]
  Studienkolleg — Hochschule Coburg
  → 08/2024 — 08/2025 · Coburg, Bayern

  Realschulabschluss — Le Quy Don Oberschule
  → 09/2019 — 09/2023 · Hanoi, Vietnam

Ziel:
  Ausbildung Fachinformatiker — Systemintegration`,

  werkzeuge: `Sicherheit:  burp suite · nmap · wireshark
Buero:       Microsoft Word · Excel · PowerPoint`,

  zertifikate: `Google Cybersecurity (Professional Certificate)
Proofpoint Certified AI Email Security
[laufend] PortSwigger Web Security Academy  68%`,

  sprachen: `Vietnamesisch  — Muttersprache
Englisch       — C1 / B2
Deutsch        — B2  (Ziel: C1)`,

  ehrenamt: `Plastikgreen — Mitbegruender
09/2023 — 12/2023 · Hanoi, Vietnam

Gemeinnuetzige Recycling-Initiative:
  · Plastikabfall gegen Pflanzen getauscht
  · Umweltbewusstsein in der Gemeinschaft gefoerdert
  · 50% der Erloese an Obdachlosenhilfe gespendet`,

  clear: '__clear__',

  hilfe: `Befehle:
  whoami · kontakt · ausbildung · werkzeuge
  zertifikate · sprachen · ehrenamt · clear`,
};

const CMDS_EN = {
  whoami: `minh hieu nguyen  //  alfred
IT Student — Coburg, Germany
Email   →  nguyenhieu.231004@gmail.com
Web     →  alfrednguyen.me
Goal: Vocational training IT Specialist System Integration`,

  contact: `Email    →  nguyenhieu.231004@gmail.com
GitHub   →  github.com/theexpensiveexperience
LinkedIn →  linkedin.com/in/nguyen-minh-hieu-a3445121b
Web      →  alfrednguyen.me
Address  →  Kalenderweg, 96450 Coburg`,

  education: `[ongoing]
  Technical IT Assistant
  → 09/2025 — present · Lichtenfels, Bavaria

[completed]
  Preparatory College — Coburg University
  → 08/2024 — 08/2025 · Coburg, Bavaria

  Secondary School — Le Quy Don High School
  → 09/2019 — 09/2023 · Hanoi, Vietnam

Goal:
  Vocational training — IT Specialist System Integration`,

  tools: `Security:  burp suite · nmap · wireshark
Office:    Microsoft Word · Excel · PowerPoint`,

  certs: `Google Cybersecurity (Professional Certificate)
Proofpoint Certified AI Email Security
[ongoing] PortSwigger Web Security Academy  68%`,

  languages: `Vietnamese  — Native
English     — C1 / B2
German      — B2  (Goal: C1)`,

  volunteer: `Plastikgreen — Co-Founder
09/2023 — 12/2023 · Hanoi, Vietnam

Non-profit recycling initiative:
  · Plastic waste exchanged for plants
  · Environmental awareness promoted in the community
  · 50% of proceeds donated to homeless aid`,

  clear: '__clear__',

  help: `Commands:
  whoami · contact · education · tools
  certs · languages · volunteer · clear`,
};

let activeCmds = CMDS_DE;

let currentLang = 'de';
const TRANS = {
  de: {
    'hero-name': 'Minh Hieu Nguyen',
    'hero-loc':  'coburg, deutschland',
    'hero-tag':  'IT-Schüler — Netzwerke/Systeme erkunden: Ausbildung zum Fachinformatiker Systemintegration/Anwendungsentwickler',
    'sec-skills': 'Kenntnisse', 'sec-edu': 'Ausbildung', 'sec-vol': 'Ehrenamtliche Tätigkeiten',
    'grp-prog': 'Programmiersprachen', 'grp-os': 'Betriebssysteme & Plattformen',
    'grp-tools': 'Software & Werkzeuge', 'grp-certs': 'Zertifikate', 'grp-lang': 'Sprachen',
    'tag-vi': 'Vietnamesisch — Muttersprache', 'tag-en': 'Englisch — C1/B2', 'tag-de': 'Deutsch — B2',
    'edu1-name': 'Technische Assistenten für Informatik', 'edu1-meta': '09/2025 — heute · Lichtenfels, Bayern',
    'edu1-desc1': 'Berufsschulausbildung mit Schwerpunkt Systemintegration, Netzwerktechnik und Softwareentwicklung.',
    'edu1-chip1': 'laufend',
    'edu2-name': 'Studienkolleg — Hochschule Coburg', 'edu2-meta': '08/2024 — 08/2025 · Coburg, Bayern',
    'edu2-desc1': 'Studienvorbereitendes Kolleg; abgeschlossenes Brückenjahr zwischen vietnamesischem Schulabschluss und deutschem Hochschulsystem.',
    'edu2-chip1': 'abgeschlossen',
    'edu3-name': 'Realschulabschluss — Le Quy Don Oberschule',
    'edu3-desc': 'Mittlerer Schulabschluss (Realschulabschluss).', 'edu3-chip1': 'abgeschlossen',
    'vol1-name': 'Plastikgreen — Mitbegründer',
    'vol1-desc': 'Gemeinnützige Recycling-Initiative: Plastikabfälle wurden gegen Pflanzen getauscht, um das Umweltbewusstsein zu fördern. 50 % der Erlöse wurden an lokale Obdachlosenhilfe gespendet.',
    'vol1-chip1': 'Mitbegründer', 'vol1-chip2': 'gemeinnützig',
    'cmd-hint-prefix': 'Befehle:', 'cmd-hint-cmds': 'whoami · kontakt · ausbildung · werkzeuge · zertifikate · sprachen · ehrenamt · clear',
  },
  en: {
    'hero-name': 'Minh Hieu Nguyen',
    'hero-loc':  'coburg, germany',
    'hero-tag':  'IT Student — Exploring networks/systems: Vocational training as IT Specialist (System Integration/Application Development)',
    'sec-skills': 'Skills', 'sec-edu': 'Education', 'sec-vol': 'Volunteer Work',
    'grp-prog': 'Programming Languages', 'grp-os': 'Operating Systems & Platforms',
    'grp-tools': 'Software & Tools', 'grp-certs': 'Certificates', 'grp-lang': 'Languages',
    'tag-vi': 'Vietnamese — Native', 'tag-en': 'English — C1/B2', 'tag-de': 'German — B2',
    'edu1-name': 'Technical IT Assistant', 'edu1-meta': '09/2025 — present · Lichtenfels, Bavaria',
    'edu1-desc1': 'Vocational school training with a focus on system integration, network technology, and software development.',
    'edu1-chip1': 'ongoing',
    'edu2-name': 'Preparatory College — Coburg University', 'edu2-meta': '08/2024 — 08/2025 · Coburg, Bavaria',
    'edu2-desc1': 'University preparatory college; completed bridging year between Vietnamese secondary education and the German university system.',
    'edu2-chip1': 'completed',
    'edu3-name': 'Secondary School Certificate — Le Quy Don High School',
    'edu3-desc': 'Secondary school graduation (Realschulabschluss equivalent).', 'edu3-chip1': 'completed',
    'vol1-name': 'Plastikgreen — Co-Founder',
    'vol1-desc': 'Non-profit recycling initiative: plastic waste exchanged for plants to raise environmental awareness. 50% of proceeds donated to local homeless aid.',
    'vol1-chip1': 'Co-Founder', 'vol1-chip2': 'non-profit',
    'cmd-hint-prefix': 'Commands:', 'cmd-hint-cmds': 'whoami · contact · education · tools · certs · languages · volunteer · clear',
  },
};

function toggleLang() {
  currentLang = currentLang === 'de' ? 'en' : 'de';
  const t = TRANS[currentLang];
  activeCmds = currentLang === 'de' ? CMDS_DE : CMDS_EN;

  const isEN = currentLang === 'en';
  document.querySelector('#lang-btn .lang-flag').textContent = isEN ? '🇬🇧' : '🇩🇪';
  $('lang-code').textContent = isEN ? 'EN' : 'DE';

  $('hero-name-el').textContent = t['hero-name'];
  $('hero-loc').textContent     = t['hero-loc'];
  $('hero-tag-el').textContent  = t['hero-tag'];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  $('cmd-history').innerHTML = '';
  $('cmd-out').textContent = '';
  $('cmd-out').className = '';
}

const cmdIn = $('cmd-in');
const cmdOut = $('cmd-out');
const cmdHistory = $('cmd-history');
let history = [];
let histIdx = -1;

cmdIn.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (histIdx < history.length - 1) { histIdx++; cmdIn.value = history[histIdx]; }
    return;
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (histIdx > 0) { histIdx--; cmdIn.value = history[histIdx]; }
    else { histIdx = -1; cmdIn.value = ''; }
    return;
  }
  if (e.key !== 'Enter') return;

  const val = cmdIn.value.trim().toLowerCase();
  cmdIn.value = '';
  cmdOut.className = '';
  cmdOut.textContent = '';

  if (!val) return;

  history.unshift(val);
  histIdx = -1;

  const echo = document.createElement('div');
  echo.className = 'cmd-history-line cmd-echo';
  echo.textContent = 'alfred@portfolio:~$ ' + val;
  cmdHistory.appendChild(echo);

  if (activeCmds[val] === '__clear__') {
    cmdHistory.innerHTML = '';
    cmdOut.textContent = '';
    return;
  }
  if (activeCmds[val]) {
    typeOutput(cmdOut, activeCmds[val]);
  } else {
    cmdOut.className = 'er';
    const tip = currentLang === 'de'
      ? `Befehl nicht gefunden: ${val}\nTipp: 'hilfe' fuer verfuegbare Befehle`
      : `Command not found: ${val}\nTip: type 'help' for available commands`;
    cmdOut.textContent = tip;
  }
  setTimeout(() => cmdHistory.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
});

function typeOutput(el, text) {
  let i = 0;
  el.textContent = '';
  (function tick() {
    if (i <= text.length) { el.textContent = text.slice(0, i); i++; setTimeout(tick, 8); }
  })();
}

runBoot(0);
