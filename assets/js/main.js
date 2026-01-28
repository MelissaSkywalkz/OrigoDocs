const IS_OFFLINE_FILE = window.location.protocol === 'file:';
const OFFLINE_SEARCH_INDEX = [
  {
    id: 'index',
    title: 'Start',
    url: 'index.html',
    content: 'startsida översikt snabbstart länkar guide recept',
  },
  {
    id: 'json-101',
    title: 'JSON 101',
    url: 'pages/page.html',
    content: 'json objekt arrayer datatyper exempel validering felsökning',
  },
  {
    id: 'origo-guide',
    title: 'Origo – guide',
    url: 'pages/origo-guide.html',
    content: 'origo init konfiguration wms wfs wmts lager controls clustering prestanda epsg 3008 vanliga fel',
  },
  {
    id: 'layermanager',
    title: 'Layermanager',
    url: 'pages/layermanager.html',
    content: 'layermanager katalog sök lager plugin',
  },
  {
    id: 'geoserver',
    title: 'GeoServer 101',
    url: 'pages/geoserver.html',
    content: 'geoserver wms wfs datakällor postgis geopackage publicera lager',
  },
  {
    id: 'geoserver-styles',
    title: 'GeoServer – styles',
    url: 'pages/geoserver-styles.html',
    content: 'sld se 1.1 styling symbolizer etiketter filter skalstyrning',
  },
  {
    id: 'geowebcache',
    title: 'GeoWebCache',
    url: 'pages/geowebcache.html',
    content: 'tile cache gridset grid misalignment epsg 3008 seed truncate metatiles prestanda felsökning',
  },
  {
    id: 'origo-server',
    title: 'Origo Server',
    url: 'pages/origo-server.html',
    content: 'origo server proxy state elevation backend endpoints drift felsökning localhost',
  },
  {
    id: 'git-vscode',
    title: 'Git & VS Code',
    url: 'pages/git-vscode.html',
    content: 'git versionering vscode grunder arbetsflöde',
  },
  {
    id: 'examples',
    title: 'Origo-recept',
    url: 'pages/examples.html',
    content: 'recept kopiera konfig wms wfs wmts controls',
  },
  {
    id: 'try-it',
    title: 'Try it-lab',
    url: 'pages/try-it.html',
    content: 'try it json validera url builder bbox sld styling',
  },
  {
    id: 'faq-gis',
    title: 'FAQ GIS',
    url: 'pages/faq-gis.html',
    content: 'vanliga frågor gis begrepp crs',
  },
  {
    id: 'npm',
    title: 'npm & plugins',
    url: 'pages/npm.html',
    content: 'npm paket plugin installera versionslåsning',
  },
  {
    id: 'troubleshooting',
    title: 'Felsökning',
    url: 'pages/troubleshooting.html',
    content: 'felsökning cors crs 404 cache problem',
  },
  {
    id: 'release-playbook',
    title: 'Release‑playbook',
    url: 'pages/release-playbook.html',
    content: 'release checklista geoserver geowebcache origo deploy cache styles data',
  },
];

const initNavigation = () => {
  const body = document.body;
  const nav = document.getElementById('sidenav');
  const navContent = nav ? nav.querySelector('.nav-content') : null;
  const toggleButtons = document.querySelectorAll('[data-nav-toggle]');
  const mediaQuery = window.matchMedia('(max-width: 900px)');
  let backdrop = document.querySelector('.nav-backdrop');
  let lastToggle = null;

  const markActiveLink = () => {
    if (!nav) {
      return;
    }

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = Array.from(nav.querySelectorAll('.accordion-panel a'));

    navLinks.forEach((link) => {
      if (link.getAttribute('href')?.startsWith('http')) {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        return;
      }

      if (link.getAttribute('href')?.startsWith('#')) {
        link.classList.add('nav-sub');
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        return;
      }

      const linkPath = link.getAttribute('href') || '';
      const normalized = linkPath === '/' ? 'index.html' : linkPath;
      if (normalized === currentPath) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  };

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.hidden = true;
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }

  const setExpanded = (expanded) => {
    toggleButtons.forEach((button) => {
      button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      if (!button.getAttribute('aria-controls')) {
        button.setAttribute('aria-controls', 'sidenav');
      }
    });
  };

  const openNav = (triggerButton) => {
    if (!mediaQuery.matches) {
      return;
    }
    lastToggle = triggerButton || lastToggle;
    body.classList.add('nav-open');
    backdrop.hidden = false;
    setExpanded(true);
    if (nav) {
      const firstLink = nav.querySelector('a, button');
      if (firstLink) {
        firstLink.focus();
      } else {
        nav.setAttribute('tabindex', '-1');
        nav.focus();
      }
    }
    if (navContent) {
      const activeLink = navContent.querySelector('a.active');
      if (activeLink) {
        activeLink.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  };

  const closeNav = () => {
    if (!mediaQuery.matches) {
      return;
    }
    body.classList.remove('nav-open');
    backdrop.hidden = true;
    setExpanded(false);
    if (lastToggle) {
      lastToggle.focus();
    }
  };

  const toggleNav = (event) => {
    if (!mediaQuery.matches) {
      body.classList.toggle('nav-collapsed');
      return;
    }

    if (body.classList.contains('nav-open')) {
      closeNav();
    } else {
      openNav(event?.currentTarget);
    }
  };

  toggleButtons.forEach((button) => {
    button.addEventListener('click', toggleNav);
  });

  backdrop.addEventListener('click', closeNav);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && body.classList.contains('nav-open')) {
      closeNav();
    }
  });

  const handleMediaChange = () => {
    body.classList.remove('nav-open');
    body.classList.remove('nav-collapsed');
    backdrop.hidden = true;
    setExpanded(!mediaQuery.matches);
  };

  markActiveLink();
  handleMediaChange();
  mediaQuery.addEventListener('change', handleMediaChange);
};

const WIZARD_DATA = {
  geowebcache: {
    title: 'Felsökningswizard',
    symptoms: [
      {
        key: 'stale-tiles',
        label: 'Jag ser gamla tiles',
        startHere: [
          'Kör truncate för lagret i GeoWebCache.',
          'Testa lagret i GeoServer Layer Preview.',
          'Ladda om kartan med hård refresh.',
        ],
        links: [
          { label: 'Seed / Truncate / Bypass – skillnaden', href: '#seed-truncate-bypass' },
          { label: 'Praktisk checklista', href: '#checklista' },
          { label: 'Stale tiles', href: '#stale-tiles' },
        ],
        escalate: [
          'Felet kvarstår efter truncate och ny seed.',
          'Loggar visar återkommande renderingsfel.',
        ],
      },
      {
        key: 'offset-tiles',
        label: 'Tiles hamnar fel / offset',
        startHere: [
          'Kontrollera gridset och CRS (EPSG:3008).',
          'Verifiera origin och matrixset i gridset.',
          'Testa samma lager i WMS 1.1.1.',
        ],
        links: [
          { label: 'CRS & gridsets', href: '#crs-gridset' },
          { label: 'Grid misalignment', href: '#grid-misalignment' },
          { label: 'Gridset, origin och matrixset', href: '#gridset-origin' },
          { label: 'Begrepp (enkelt)', href: '#begrepp' },
        ],
        escalate: ['Offset kvarstår efter gridset/CRS-kontroll.'],
      },
      {
        key: 'holes-tiles',
        label: 'Tomma tiles eller “hål”',
        startHere: [
          'Testa annan zoomnivå i klienten.',
          'Kontrollera datatäckning och BBOX.',
          'Se om lagret ritar i Layer Preview.',
        ],
        links: [
          { label: 'Tile cache 101', href: '#tile-cache-101' },
          { label: 'Seeding och REST-anrop', href: '#seeding-rest' },
          { label: 'Praktisk checklista', href: '#checklista' },
        ],
        escalate: ['Tomma tiles även i Layer Preview.'],
      },
      {
        key: 'slow-seed',
        label: 'Långsam rendering / seeding',
        startHere: [
          'Seeda mindre område och färre zoomnivåer.',
          'Kontrollera datakällans prestanda.',
          'Granska om stilen är tung.',
        ],
        links: [
          { label: 'Seeding och REST-anrop', href: '#seeding-rest' },
          { label: 'Metastore och disk quota', href: '#metastore-disk' },
          { label: 'Vanliga misstag', href: '#vanliga-misstag' },
        ],
        escalate: ['Seeding är fortsatt långsam på små ytor.'],
      },
      {
        key: 'slow-external',
        label: 'Extern WMS är långsam',
        startHere: [
          'Mät svarstid direkt mot WMS-url.',
          'Cachea som proxy-lager om möjligt.',
          'Begränsa BBOX och zoomnivåer.',
        ],
        links: [
          { label: 'Cacheability och parametrar', href: '#cacheability' },
          { label: 'Hur GeoWebCache hänger ihop med GeoServer', href: '#geoserver-koppling' },
          { label: 'Klientperspektiv', href: '#klientperspektiv' },
        ],
        escalate: ['Extern tjänst är långsam även utan cache.'],
      },
      {
        key: 'client-or-server',
        label: 'Osäker om felet är klient eller server',
        startHere: [
          'Testa lagret i GeoServer Layer Preview.',
          'Testa WMS direkt i webbläsaren.',
          'Jämför resultat i Origo och preview.',
        ],
        links: [
          { label: 'Klientperspektiv', href: '#klientperspektiv' },
          { label: 'Hur GeoWebCache hänger ihop med GeoServer', href: '#geoserver-koppling' },
          { label: 'Tile cache 101', href: '#tile-cache-101' },
        ],
        escalate: ['Skillnaden mellan klient och server går inte att isolera.'],
      },
    ],
  },
  'geoserver-styles': {
    title: 'Felsökningswizard',
    symptoms: [
      {
        key: 'sld-import-fail',
        label: 'SLD importeras inte',
        startHere: [
          'Validera XML och namespaces.',
          'Testa import av en minimal SLD.',
          'Kontrollera att formatet är SE 1.1.',
        ],
        links: [
          { label: 'Import och namespaces', href: '#sld-import' },
          { label: 'SLD Cookbook', href: '#sld-cookbook' },
          { label: 'Välj rätt format', href: '#format' },
        ],
        escalate: ['Import misslyckas även med minimal SLD.'],
      },
      {
        key: 'sld-no-render',
        label: 'SLD importeras men syns inte',
        startHere: [
          'Verifiera datatyp mot symbolizer.',
          'Kontrollera Min/MaxScaleDenominator.',
          'Testa en enkel style utan filter.',
        ],
        links: [
          { label: 'SLD Cookbook', href: '#sld-cookbook' },
          { label: 'Skala och synlighet', href: '#sld-scale' },
          { label: 'Parameterguide', href: '#parameterguide' },
        ],
        escalate: ['Inget syns i preview efter förenklad style.'],
      },
      {
        key: 'labels-missing',
        label: 'Labels syns inte / ligger fel',
        startHere: [
          'Kontrollera attributnamn i Label.',
          'Justera fontstorlek och placement.',
          'Testa en enkel label utan halo.',
        ],
        links: [
          { label: 'Labels – enkel etikett', href: '#labels' },
          { label: 'Skala och synlighet', href: '#sld-scale' },
          { label: 'Parameterguide', href: '#parameterguide' },
        ],
        escalate: ['Labels syns inte trots förenklad label.'],
      },
      {
        key: 'rules-fail',
        label: 'Filter-regler fungerar inte',
        startHere: [
          'Kontrollera filter-syntax och attributnamn.',
          'Testa en regel i taget.',
          'Verifiera datatyper i attributen.',
        ],
        links: [
          { label: 'SLD‑felsökning', href: '#sld-felsokning' },
          { label: 'Parameterguide', href: '#parameterguide' },
          { label: 'SLD Cookbook', href: '#sld-cookbook' },
        ],
        escalate: ['Filter ger fel även med enkel regel.'],
      },
      {
        key: 'style-cache',
        label: 'Jag ser gamla stilar',
        startHere: [
          'Rensa cache för lagret i GeoWebCache.',
          'Gör hård refresh i webbläsaren.',
          'Bekräfta att rätt style är aktiv.',
        ],
        links: [
          { label: 'Cache och uppdatering', href: '#sld-cache' },
          { label: 'Översikt', href: '#oversikt' },
          { label: 'Hur detta påverkar kartklienten', href: '#origo-impact' },
        ],
        escalate: ['Stilen uppdateras inte efter cache‑rensing.'],
      },
    ],
  },
};

const initAccordions = () => {
  const accordions = document.querySelectorAll('.accordion-button');

  accordions.forEach((button) => {
    const panelId = button.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;

    if (!panel) {
      return;
    }

    const syncPanelState = (expanded) => {
      button.setAttribute('aria-expanded', expanded.toString());
      panel.hidden = !expanded;
    };

    syncPanelState(button.getAttribute('aria-expanded') === 'true');

    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      syncPanelState(!expanded);
    });
  });
};

const initOfflineNotice = () => {
  if (!IS_OFFLINE_FILE) {
    return;
  }

  const main = document.querySelector('main');
  if (!main || main.querySelector('.offline-note')) {
    return;
  }

  const note = document.createElement('div');
  note.className = 'offline-note';
  note.textContent =
    'Offline-läge: vissa funktioner är begränsade. Rekommenderat: python -m http.server 8000';

  const topbar = main.querySelector('.topbar');
  if (topbar) {
    topbar.insertAdjacentElement('afterend', note);
  } else {
    main.insertAdjacentElement('afterbegin', note);
  }
};

const initSearch = () => {
  const input = document.getElementById('navSearch');
  const results = document.getElementById('searchResults');

  if (!input || !results) {
    return;
  }

  let searchIndex = IS_OFFLINE_FILE ? OFFLINE_SEARCH_INDEX : [];

  if (!IS_OFFLINE_FILE) {
    const searchIndexUrl = new URL('../search/search-index.json', document.baseURI).href;
    fetch(searchIndexUrl)
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          searchIndex = data;
        }
      })
      .catch(() => {
        searchIndex = [];
      });
  }

  const clearResults = () => {
    results.innerHTML = '';
    results.classList.add('hidden');
  };

  const renderResults = (items) => {
    results.innerHTML = '';

    if (!items.length) {
      results.classList.add('hidden');
      return;
    }

    items.forEach((item) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = item.url;
      link.textContent = item.title;
      li.appendChild(link);
      results.appendChild(li);
    });

    results.classList.remove('hidden');
  };

  const handleInput = () => {
    const query = input.value.trim().toLowerCase();

    if (!query) {
      clearResults();
      return;
    }

    const matches = searchIndex.filter((item) => {
      const haystack = `${item.title} ${item.content}`.toLowerCase();
      return haystack.includes(query);
    });

    renderResults(matches.slice(0, 8));
  };

  input.addEventListener('input', handleInput);
  input.addEventListener('focus', handleInput);

  results.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (link) {
      results.classList.add('hidden');
    }
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-search')) {
      results.classList.add('hidden');
    }
  });

  document.addEventListener('keydown', (event) => {
    const isCmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
    const activeTag = document.activeElement?.tagName?.toLowerCase();
    const isTyping =
      activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable;

    if ((isCmdK || (event.key === '/' && !isTyping)) && document.activeElement !== input) {
      event.preventDefault();
      input.focus();
      input.select();
    }
  });
};

const initPageMeta = () => {
  const header = document.querySelector('.topbar');
  const h1 = document.querySelector('.topbar-title h1');
  if (!header || !h1) return;

  const meta = document.createElement('div');
  meta.className = 'page-meta';

  const crumbs = document.createElement('nav');
  crumbs.className = 'breadcrumbs';
  crumbs.setAttribute('aria-label', 'Brödsmulor');

  const isInPages = window.location.pathname.includes('/pages/');
  const homeHref = isInPages ? '../index.html' : 'index.html';

  const aHome = document.createElement('a');
  aHome.href = homeHref;
  aHome.textContent = 'Start';

  const sep = document.createElement('span');
  sep.className = 'sep';
  sep.textContent = '/';

  const current = document.createElement('span');
  current.textContent = h1.textContent?.trim() || 'Sida';

  crumbs.appendChild(aHome);
  crumbs.appendChild(sep);
  crumbs.appendChild(current);

  meta.appendChild(crumbs);

  const renderLastUpdated = async () => {
  let dateStr = null;

  try {
    const res = await fetch(window.location.href, { method: 'HEAD', cache: 'no-cache' });
    const lastMod = res.headers.get('last-modified');
    if (lastMod) {
      const d = new Date(lastMod);
      dateStr = new Intl.DateTimeFormat('sv-SE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(d);
    }
  } catch {
  }

  if (!dateStr) {
    const manual = document
      .querySelector('meta[name="last-updated"]')
      ?.getAttribute('content');
    if (manual) dateStr = manual;
  }

  if (dateStr) {
    const updated = document.createElement('span');
    updated.className = 'last-updated';
    updated.textContent = `Uppdaterad: ${dateStr}`;
    meta.appendChild(updated);
  }
};

renderLastUpdated();

  header.insertAdjacentElement('afterend', meta);
};

const getExplicitLanguage = (codeBlock, pre) => {
  const explicit = [
    codeBlock?.dataset?.lang,
    pre?.dataset?.lang,
    codeBlock?.closest('[data-lang]')?.dataset?.lang,
    pre?.closest('[data-lang]')?.dataset?.lang,
  ].find(Boolean);

  if (explicit) {
    return explicit.toLowerCase();
  }

  const classMatch = (node) => {
    if (!node || !node.className) {
      return null;
    }
    const match = node.className.match(/language-([a-z0-9-]+)/i);
    return match ? match[1].toLowerCase() : null;
  };

  return classMatch(codeBlock) || classMatch(pre);
};

const normalizeLanguageLabel = (lang) => {
  if (!lang) {
    return null;
  }

  const map = {
    bash: 'CLI',
    cli: 'CLI',
    shell: 'CLI',
    sh: 'CLI',
    xml: 'XML',
    json: 'JSON',
    js: 'JavaScript',
    javascript: 'JavaScript',
    css: 'CSS',
    mbstyle: 'MBStyle',
  };

  return map[lang] || null;
};

const detectLanguageBadge = (codeBlock, pre) => {
  const explicitLang = normalizeLanguageLabel(getExplicitLanguage(codeBlock, pre));
  if (explicitLang) {
    return explicitLang;
  }

  const codeText = codeBlock.textContent.trim();
  const firstLines = codeText.split(/\r?\n/).slice(0, 6).join('\n');

  if (
    /^<\\?xml/i.test(codeText) ||
    /<se:StyledLayerDescriptor/i.test(codeText) ||
    /<StyledLayerDescriptor/i.test(codeText)
  ) {
    return 'XML';
  }

  if (
    /^(\\$ )/m.test(firstLines) ||
    /(^|\\n)\\s*(npm |git |python )/m.test(firstLines) ||
    /npm install|python -m http\\.server/.test(firstLines)
  ) {
    return 'CLI';
  }

  if (/^[{[]/.test(codeText)) {
    if (
      /"layers"\\s*:/.test(codeText) &&
      (/"paint"\\s*:/.test(codeText) || /"layout"\\s*:/.test(codeText))
    ) {
      return 'MBStyle';
    }
    return 'JSON';
  }

  if (
    /(@media|@font-face)/i.test(codeText) ||
    /(mark-size:|stroke-width:|\\bmark:)/i.test(codeText)
  ) {
    return 'CSS';
  }

  if (/^[\\s]*[.#*:@].*\\{/.test(firstLines) && /:/.test(firstLines)) {
    return 'CSS';
  }

  if (/\\b(const|let|var|function)\\b|=>|document\\.|window\\./.test(codeText)) {
    return 'JavaScript';
  }

  return 'Kod';
};

const escapeHTML = (str) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const detectLangFromBadge = (badgeLabel) => {
  const v = (badgeLabel || '').toLowerCase();
  if (v === 'json' || v === 'mbstyle') return 'json';
  if (v === 'xml' || v === 'sld') return 'xml';
  if (v === 'css') return 'css';
  if (v === 'js' || v === 'javascript') return 'js';
  if (v === 'cli' || v === 'bash' || v === 'shell') return 'cli';
  return '';
};

const detectLangFromClasses = (codeEl) => {
  const cls = (codeEl.className || '').toLowerCase();
  if (cls.includes('language-json')) return 'json';
  if (cls.includes('language-xml') || cls.includes('language-sld')) return 'xml';
  if (cls.includes('language-css')) return 'css';
  if (cls.includes('language-js') || cls.includes('language-javascript')) return 'js';
  if (cls.includes('language-bash') || cls.includes('language-shell') || cls.includes('language-cli')) return 'cli';
  return '';
};

const autoDetectLang = (text) => {
  const t = (text || '').trim();
  if (!t) return '';
  if (t.startsWith('{') || t.startsWith('[')) return 'json';
  if (t.startsWith('<')) return 'xml';
  if (t.includes('{') && t.includes(':')) return 'css';
  return '';
};

const highlightJSON = (text) => {
  let s = escapeHTML(text);
  s = s.replace(/"(\\.|[^"\\])*"/g, (m) => `<span class="tok-string">${m}</span>`);
  s = s.replace(
    /<span class="tok-string">("(?:\\.|[^"\\])*")<\/span>\s*:/g,
    (m, g1) => `<span class="tok-key">${g1}</span><span class="tok-punct">:</span>`
  );
  s = s.replace(/(-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)/gi, `<span class="tok-number">$1</span>`);
  s = s.replace(/\btrue\b|\bfalse\b/g, (m) => `<span class="tok-boolean">${m}</span>`);
  s = s.replace(/\bnull\b/g, `<span class="tok-null">null</span>`);
  s = s.replace(/[{}\[\],]/g, (m) => `<span class="tok-punct">${m}</span>`);
  return s;
};

const highlightXML = (text) => {
  let s = escapeHTML(text);
  s = s.replace(/&lt;!--[\s\S]*?--&gt;/g, (m) => `<span class="tok-comment">${m}</span>`);
  s = s.replace(/(&lt;\/?)([A-Za-z0-9:_-]+)([^&]*?)(\/?&gt;)/g, (full, open, tag, attrs, close) => {
    const attrsHL = attrs.replace(
      /([A-Za-z0-9:_-]+)(=)(&quot;[^&]*?&quot;)/g,
      (m, a, eq, v) =>
        `<span class="tok-attr">${a}</span><span class="tok-punct">${eq}</span><span class="tok-value">${v}</span>`
    );
    return `${open}<span class="tok-tag">${tag}</span>${attrsHL}${close}`;
  });
  return s;
};

const highlightCSS = (text) => {
  let s = escapeHTML(text);
  s = s.replace(/\/\*[\s\S]*?\*\//g, (m) => `<span class="tok-comment">${m}</span>`);
  s = s.replace(/"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/g, (m) => `<span class="tok-string">${m}</span>`);
  s = s.replace(/(^|[{\s;])([a-zA-Z-]+)(\s*:)/g, (m, p1, prop, p3) => {
    return `${p1}<span class="tok-key">${prop}</span><span class="tok-punct">:</span>`;
  });
  s = s.replace(/(-?\b\d+(?:\.\d+)?)(px|rem|em|%|vh|vw)?\b/g, (m, n, u) => {
    const unit = u ? u : '';
    return `<span class="tok-number">${n}</span>${unit ? `<span class="tok-punct">${unit}</span>` : ''}`;
  });
  s = s.replace(/[{}();,]/g, (m) => `<span class="tok-punct">${m}</span>`);
  return s;
};

const highlightJS = (text) => {
  let s = escapeHTML(text);
  s = s.replace(/\/\/[^\n]*/g, (m) => `<span class="tok-comment">${m}</span>`);
  s = s.replace(/\/\*[\s\S]*?\*\//g, (m) => `<span class="tok-comment">${m}</span>`);
  s = s.replace(/"(\\.|[^"\\])*"|'(\\.|[^'\\])*'|`([\s\S]*?)`/g, (m) => `<span class="tok-string">${m}</span>`);
  s = s.replace(
    /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|import|export|from|try|catch|finally|throw|await|async)\b/g,
    `<span class="tok-keyword">$1</span>`
  );
  s = s.replace(/(-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)/gi, `<span class="tok-number">$1</span>`);
  s = s.replace(/[{}()[\],.;:+\-*/=<>!&|?]/g, (m) => `<span class="tok-operator">${m}</span>`);
  return s;
};

const highlightCLI = (text) => {
  let s = escapeHTML(text);
  s = s.replace(/(^|\n)\s*([$>])\s?/g, (m, p1, p2) => `${p1}<span class="tok-prompt">${p2}</span> `);
  s = s.replace(/(\s|^)(--[a-zA-Z0-9_-]+|-[a-zA-Z]+)/g, (m, p1, flag) => `${p1}<span class="tok-flag">${flag}</span>`);
  s = s.replace(/(\s|^)(\.{0,2}\/[A-Za-z0-9._/-]+)/g, (m, p1, path) => `${p1}<span class="tok-path">${path}</span>`);
  return s;
};

const highlightCode = (lang, text) => {
  switch (lang) {
    case 'json':
      return highlightJSON(text);
    case 'xml':
      return highlightXML(text);
    case 'css':
      return highlightCSS(text);
    case 'js':
      return highlightJS(text);
    case 'cli':
      return highlightCLI(text);
    default:
      return null;
  }
};

const applyCodeHighlighting = (codeEl, badgeLabel) => {
  const lang =
    detectLangFromClasses(codeEl) ||
    detectLangFromBadge(badgeLabel) ||
    autoDetectLang(codeEl.textContent);
  if (!lang) return;

  const raw = codeEl.textContent;
  const html = highlightCode(lang, raw);
  if (!html) return;

  codeEl.innerHTML = html;
};

const initCodeCopy = () => {
  const codeBlocks = document.querySelectorAll('pre code');
  let codeIndex = 0;

  codeBlocks.forEach((codeBlock) => {
    const pre = codeBlock.parentElement;

    if (!pre || pre.closest('.code-block')) {
      return;
    }

    codeIndex += 1;
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const badgeLabel = detectLanguageBadge(codeBlock, pre);
    applyCodeHighlighting(codeBlock, badgeLabel);

    const badge = document.createElement('span');
    badge.className = 'code-badge';
    badge.textContent = badgeLabel;
    badge.setAttribute('aria-hidden', 'true');
    wrapper.appendChild(badge);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-btn';
    button.textContent = 'Kopiera';
    button.setAttribute('aria-label', 'Kopiera kod');
    button.setAttribute('aria-live', 'polite');

    const resetLabel = () => {
      button.textContent = 'Kopiera';
      button.classList.remove('copied');
    };

    button.addEventListener('click', async () => {
      const text = codeBlock.textContent;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.setAttribute('readonly', '');
          textarea.style.position = 'absolute';
          textarea.style.left = '-9999px';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        button.textContent = 'Kopierat';
        button.classList.add('copied');
        setTimeout(resetLabel, 1500);
      } catch (error) {
        button.textContent = 'Kopiera';
        button.classList.remove('copied');
      }
    });

    wrapper.appendChild(button);
    
    const troubleshootButton = document.createElement('button');
    const troubleshootPanel = document.createElement('div');
    const troubleshootId = `code-troubleshoot-${codeIndex}`;
    const troubleshootList = document.createElement('ul');
    const troubleshootTitle = document.createElement('h4');

    troubleshootButton.type = 'button';
    troubleshootButton.className = 'troubleshoot-toggle';
    troubleshootButton.textContent = 'Felsök';
    troubleshootButton.setAttribute('aria-expanded', 'false');
    troubleshootButton.setAttribute('aria-controls', troubleshootId);

    troubleshootPanel.className = 'troubleshoot-panel';
    troubleshootPanel.id = troubleshootId;
    troubleshootPanel.hidden = true;

    if (badgeLabel === 'XML') {
      troubleshootTitle.textContent = 'Felsök: SLD';
      troubleshootList.innerHTML = `
        <li>Kontrollera att du laddar upp i GeoServer → Styles och väljer rätt format (SLD/SE).</li>
        <li>Kontrollera namespaces och att filen är välformad XML (inga extra tecken).</li>
        <li>Om stilen laddas men inte syns: kontrollera datatyp (point/line/polygon) och skala (Min/MaxScaleDenominator).</li>
        <li>Om du ser gamla resultat: rensa/seed cache i GeoWebCache vid behov (inte alltid).</li>
      `;
    } else if (badgeLabel === 'JSON' || badgeLabel === 'MBStyle') {
      troubleshootTitle.textContent = 'Felsök: Origo-konfig';
      troubleshootList.innerHTML = `
        <li>Validera JSON (kommatecken, citattecken, trailing commas).</li>
        <li>Kontrollera att layer/source-namn matchar GeoServer (workspace:layer, URL).</li>
        <li>Om inget syns: kontrollera projectionCode (EPSG:3008) och extent/center.</li>
        <li>Om WFS är segt: testa WMS för rendering och använd WFS bara när attribut/klientlogik krävs.</li>
      `;
    } else if (badgeLabel === 'CLI') {
      troubleshootTitle.textContent = 'Felsök: Kommando';
      troubleshootList.innerHTML = `
        <li>Kör från rätt mapp (repo-root).</li>
        <li>Om "command not found": kontrollera att python/node/git är installerat och ligger i PATH.</li>
        <li>Om port upptagen: byt port (t.ex. 8001).</li>
      `;
    } else {
      troubleshootTitle.textContent = 'Felsök';
      troubleshootList.innerHTML = `
        <li>Kontrollera att sidan laddas utan JS-fel (F12 → Console).</li>
        <li>Uppdatera sidan med hård refresh (Ctrl+F5).</li>
      `;
    }

    troubleshootPanel.appendChild(troubleshootTitle);
    troubleshootPanel.appendChild(troubleshootList);

    troubleshootButton.addEventListener('click', () => {
      const expanded = troubleshootButton.getAttribute('aria-expanded') === 'true';
      troubleshootButton.setAttribute('aria-expanded', (!expanded).toString());
      troubleshootPanel.hidden = expanded;
    });

    wrapper.appendChild(troubleshootButton);
    wrapper.appendChild(troubleshootPanel);
  });

  document.querySelectorAll('.code-block').forEach((wrapper) => {
    const badge = wrapper.querySelector('.code-badge');
    const button = wrapper.querySelector('.copy-btn');

    if (badge && button && !wrapper.querySelector('.code-header')) {
      const header = document.createElement('div');
      header.className = 'code-header';

      const langSpan = document.createElement('span');
      langSpan.className = 'code-lang';
      langSpan.textContent = badge.textContent;
      langSpan.setAttribute('aria-hidden', 'true');

      header.appendChild(langSpan);
      header.appendChild(button);

      wrapper.insertBefore(header, wrapper.firstChild);
    }
  });
};

const copyText = async (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};

const initResolutionsTryIt = (block) => {
  const input = block.querySelector('#res-input');
  const report = block.querySelector('#res-report');
  const output = block.querySelector('#res-output');
  const status = block.querySelector('#res-status');
  const buttons = block.querySelectorAll('[data-res-action]');

  if (!input || !report || !output || !status) {
    return;
  }

  const addReportLine = (text, type = 'normal') => {
    const line = document.createElement('div');
    if (type === 'ok') {
      line.style.color = '#28a745';
      text = '✓ ' + text;
    } else if (type === 'error') {
      line.style.color = '#dc3545';
      text = '✗ ' + text;
    } else if (type === 'warning') {
      line.style.color = '#ffc107';
      text = '⚠ ' + text;
    }
    line.textContent = text;
    report.appendChild(line);
  };

  const clearReport = () => {
    report.innerHTML = '';
  };

  const updateStatus = (message) => {
    if (status) {
      status.textContent = message;
    }
  };

  const parseResolutions = () => {
    const lines = input.value
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const resolutions = [];
    const parseErrors = [];

    lines.forEach((line, idx) => {
      const val = parseFloat(line);
      if (isNaN(val)) {
        parseErrors.push(`Rad ${idx + 1}: "${line}" är inte ett tal`);
      } else {
        resolutions.push(val);
      }
    });

    return { resolutions, parseErrors };
  };

  const validate = () => {
    clearReport();
    output.value = '';
    updateStatus('');

    const { resolutions, parseErrors } = parseResolutions();

    if (parseErrors.length > 0) {
      addReportLine('Parse errors:', 'error');
      parseErrors.forEach((err) => addReportLine(err, 'error'));
      return;
    }

    if (resolutions.length === 0) {
      addReportLine('Ingen input.');
      return;
    }

    addReportLine(`Antal: ${resolutions.length}`, 'ok');

    let allPositive = true;
    resolutions.forEach((res, idx) => {
      if (res <= 0) {
        addReportLine(`Rad ${idx + 1}: ${res} är inte > 0`, 'error');
        allPositive = false;
      }
    });
    if (allPositive) {
      addReportLine('Alla värden > 0', 'ok');
    }

    let validOrder = true;
    for (let i = 0; i < resolutions.length - 1; i++) {
      if (resolutions[i] <= resolutions[i + 1]) {
        addReportLine(`Rad ${i + 1}→${i + 2}: ${resolutions[i]} ≤ ${resolutions[i + 1]} (måste vara fallande)`, 'error');
        validOrder = false;
      }
    }
    if (validOrder) {
      addReportLine('Strikt fallande ordning', 'ok');
    }

    const unique = new Set(resolutions);
    if (unique.size === resolutions.length) {
      addReportLine('Inga dubbletter', 'ok');
    } else {
      addReportLine(`Dubbletter hittade (${resolutions.length} rader, ${unique.size} unika)`, 'error');
    }

    let tooSimilar = [];
    for (let i = 0; i < resolutions.length - 1; i++) {
      const diff = resolutions[i] - resolutions[i + 1];
      const pctDiff = (diff / resolutions[i]) * 100;
      if (pctDiff < 0.1) {
        tooSimilar.push(`Rad ${i + 1}→${i + 2}: ${resolutions[i]} och ${resolutions[i + 1]} skiljer < 0.1%`);
      }
    }
    if (tooSimilar.length > 0) {
      tooSimilar.forEach((warn) => addReportLine(warn, 'warning'));
    } else {
      addReportLine('Tillräckliga avstånd mellan värdena', 'ok');
    }

    const isValid = allPositive && validOrder && unique.size === resolutions.length && tooSimilar.length === 0;
    if (isValid) {
      addReportLine('STATUS: Giltigt', 'ok');
      updateStatus('Validering OK.');
    } else {
      addReportLine('STATUS: Fel hittade', 'error');
      updateStatus('Fel hittade. Se rapport ovan.');
    }

    return resolutions;
  };

  const exportOrigo = () => {
    const { resolutions, parseErrors } = parseResolutions();

    if (parseErrors.length > 0) {
      updateStatus('Parse error. Validera först.');
      output.value = '';
      return;
    }

    if (resolutions.length === 0) {
      updateStatus('Ingen input.');
      output.value = '';
      return;
    }

    const json = JSON.stringify(resolutions);
    output.value = json;
    clearReport();
    addReportLine('Origo resolutions array:', 'ok');
    updateStatus('Exporterad som Origo JSON.');
  };

  const exportGwc = () => {
    const { resolutions, parseErrors } = parseResolutions();

    if (parseErrors.length > 0) {
      updateStatus('Parse error. Validera först.');
      output.value = '';
      return;
    }

    if (resolutions.length === 0) {
      updateStatus('Ingen input.');
      output.value = '';
      return;
    }

    const lines = resolutions.map((res) => `    <resolution>${res}</resolution>`).join('\n');
    const gwcXml = `  <resolutions>\n${lines}\n  </resolutions>`;
    output.value = gwcXml;
    clearReport();
    addReportLine('GeoWebCache gridset format:', 'ok');
    updateStatus('Exporterad som GWC XML.');
  };

  const clearAll = () => {
    input.value = '';
    output.value = '';
    clearReport();
    updateStatus('');
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.resAction;
      if (action === 'validate') {
        validate();
      } else if (action === 'export-origo') {
        exportOrigo();
      } else if (action === 'export-gwc') {
        exportGwc();
      } else if (action === 'clear') {
        clearAll();
      }
    });
  });
};

const initGridCalcTryIt = (block) => {
  const resolution = block.querySelector('#gridcalc-resolution');
  const scale = block.querySelector('#gridcalc-scale');
  const tile = block.querySelector('#gridcalc-tile');
  const meta = block.querySelector('#gridcalc-meta');
  const bboxwidth = block.querySelector('#gridcalc-bboxwidth');
  const bboxheight = block.querySelector('#gridcalc-bboxheight');
  const output = block.querySelector('#gridcalc-output');
  const status = block.querySelector('#gridcalc-status');
  const buttons = block.querySelectorAll('[data-gridcalc-action]');

  if (!resolution || !scale || !tile || !meta || !bboxwidth || !bboxheight || !output || !status) {
    return;
  }

  const PIXEL_SIZE_M = 0.00028;

  const updateStatus = (message) => {
    if (status) {
      status.textContent = message;
    }
  };

  const calculate = () => {
    const resVal = parseFloat(resolution.value);
    const scaleVal = parseFloat(scale.value);
    const tileVal = parseFloat(tile.value);
    const metaVal = parseFloat(meta.value);
    const bboxwVal = parseFloat(bboxwidth.value);
    const bboxhVal = parseFloat(bboxheight.value);

    if (isNaN(resVal) || isNaN(tileVal) || isNaN(metaVal) || isNaN(bboxwVal) || isNaN(bboxhVal)) {
      updateStatus('Alle värden måste vara tal.');
      return;
    }

    if (resVal <= 0 || tileVal <= 0 || metaVal <= 0 || bboxwVal <= 0 || bboxhVal <= 0) {
      updateStatus('Alla värden måste vara större än 0.');
      return;
    }

    const tileSpanM = resVal * tileVal;
    const metaSpanM = tileSpanM * metaVal;

    const tilesX = Math.ceil(bboxwVal / tileSpanM);
    const tilesY = Math.ceil(bboxhVal / tileSpanM);
    const approxTiles = tilesX * tilesY;

    let seedRec = '';
    if (approxTiles < 5000) {
      seedRec = 'Seed hela området på denna zoom.';
    } else if (approxTiles <= 50000) {
      seedRec = 'Seed selektivt (prioritera kärnområde).';
    } else {
      seedRec = 'Seed bara vid behov, dela upp bbox och/eller minska zoomintervall.';
    }

    const outText = [
      `Resolution: ${resVal.toFixed(4)} m/px`,
      `Scale: 1:${scaleVal.toFixed(0)}`,
      `Tile span (${tileVal}px): ${tileSpanM.toFixed(2)} m`,
      `Meta span (${metaVal}×${metaVal}): ${metaSpanM.toFixed(2)} m`,
      `Approx tiles for bbox: ${approxTiles.toLocaleString('sv-SE')}`,
      `Rekommendation: ${seedRec}`,
    ].join('\n');

    output.value = outText;
    updateStatus('Beräknad.');
  };

  const fromResolution = () => {
    const resVal = parseFloat(resolution.value);
    if (isNaN(resVal) || resVal <= 0) {
      updateStatus('Resolution måste vara ett tal > 0.');
      return;
    }
    const scaleVal = resVal / PIXEL_SIZE_M;
    scale.value = scaleVal.toFixed(0);
    calculate();
  };

  const fromScale = () => {
    const scaleVal = parseFloat(scale.value);
    if (isNaN(scaleVal) || scaleVal <= 0) {
      updateStatus('Scale måste vara ett tal > 0.');
      return;
    }
    const resVal = scaleVal * PIXEL_SIZE_M;
    resolution.value = resVal.toFixed(4);
    calculate();
  };

  const setPreset = () => {
    resolution.value = '100';
    scale.value = (100 / PIXEL_SIZE_M).toFixed(0);
    tile.value = '256';
    meta.value = '4';
    bboxwidth.value = '100000';
    bboxheight.value = '100000';
    output.value = '';
    updateStatus('');
    calculate();
  };

  const copyOutput = async () => {
    const text = output.value.trim();
    if (!text) {
      updateStatus('Beräkna först.');
      return;
    }
    try {
      await copyText(text);
      updateStatus('Kopierat.');
    } catch (error) {
      updateStatus('Kunde inte kopiera.');
    }
  };

  const clearAll = () => {
    resolution.value = '100';
    scale.value = (100 / PIXEL_SIZE_M).toFixed(0);
    tile.value = '256';
    meta.value = '4';
    bboxwidth.value = '100000';
    bboxheight.value = '100000';
    output.value = '';
    updateStatus('');
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.gridcalcAction;
      if (action === 'from-resolution') {
        fromResolution();
      } else if (action === 'from-scale') {
        fromScale();
      } else if (action === 'preset') {
        setPreset();
      } else if (action === 'copy') {
        copyOutput();
      } else if (action === 'clear') {
        clearAll();
      }
    });
  });

  calculate();
};

const initBboxTryIt = (block) => {
  const base = block.querySelector('#bbox-base');
  const layer = block.querySelector('#bbox-layer');
  const format = block.querySelector('#bbox-format');
  const width = block.querySelector('#bbox-width');
  const height = block.querySelector('#bbox-height');
  const minx = block.querySelector('#bbox-minx');
  const maxx = block.querySelector('#bbox-maxx');
  const miny = block.querySelector('#bbox-miny');
  const maxy = block.querySelector('#bbox-maxy');
  const output = block.querySelector('#bbox-output');
  const urlOutput = block.querySelector('#bbox-url-output');
  const status = block.querySelector('#bbox-status');
  const buttons = block.querySelectorAll('[data-bbox-action]');

  if (!base || !layer || !format || !width || !height || !minx || !maxx || !miny || !maxy || !output || !urlOutput || !status) {
    return;
  }

  const presets = {
    'preset-1': { minx: 100000, miny: 6400000, maxx: 200000, maxy: 6500000 },
    'preset-2': { minx: 200000, miny: 6500000, maxx: 350000, maxy: 6650000 },
    'preset-3': { minx: 350000, miny: 6650000, maxx: 500000, maxy: 6800000 },
  };

  const updateStatus = (message) => {
    if (status) {
      status.textContent = message;
    }
  };

  const validateBbox = () => {
    const minxVal = parseFloat(minx.value);
    const maxxVal = parseFloat(maxx.value);
    const minyVal = parseFloat(miny.value);
    const maxyVal = parseFloat(maxy.value);

    if (isNaN(minxVal) || isNaN(maxxVal) || isNaN(minyVal) || isNaN(maxyVal)) {
      updateStatus('Alla koordinater måste vara tal.');
      return null;
    }

    if (minxVal >= maxxVal) {
      updateStatus('Min X måste vara mindre än Max X.');
      return null;
    }

    if (minyVal >= maxyVal) {
      updateStatus('Min Y måste vara mindre än Max Y.');
      return null;
    }

    if (minxVal < 0 || maxxVal > 1500000) {
      updateStatus('X-värden måste ligga mellan 0 och 1,500,000.');
      return null;
    }

    if (minyVal < 5500000 || maxyVal > 8000000) {
      updateStatus('Y-värden måste ligga mellan 5,500,000 och 8,000,000.');
      return null;
    }

    return { minx: minxVal, maxx: maxxVal, miny: minyVal, maxy: maxyVal };
  };

  const generate = () => {
    const bbox = validateBbox();
    if (!bbox) {
      output.value = '';
      urlOutput.value = '';
      return;
    }

    const bboxStr = `${bbox.minx},${bbox.miny},${bbox.maxx},${bbox.maxy}`;
    output.value = bboxStr;

    const baseValue = base.value.trim();
    if (!baseValue) {
      updateStatus('Fyll i en bas‑URL för WMS-anropet.');
      urlOutput.value = '';
      return;
    }

    try {
      const url = new URL(baseValue, window.location.href);
      const params = new URLSearchParams();
      params.set('service', 'WMS');
      params.set('version', '1.1.1');
      params.set('request', 'GetMap');
      params.set('layers', layer.value.trim());
      params.set('styles', '');
      params.set('format', format.value.trim());
      params.set('bbox', bboxStr);
      params.set('width', width.value.trim());
      params.set('height', height.value.trim());
      params.set('srs', 'EPSG:3008');

      url.search = params.toString();
      urlOutput.value = url.toString();
      updateStatus('Klar.');
    } catch (error) {
      updateStatus('Ogiltig bas‑URL.');
      urlOutput.value = '';
    }
  };

  const setBboxPreset = (preset) => {
    minx.value = preset.minx;
    miny.value = preset.miny;
    maxx.value = preset.maxx;
    maxy.value = preset.maxy;
    output.value = '';
    urlOutput.value = '';
    updateStatus('');
  };

  const copyBbox = async () => {
    const text = output.value.trim();
    if (!text) {
      updateStatus('Generera en BBOX först.');
      return;
    }
    try {
      await copyText(text);
      updateStatus('BBOX kopierad.');
    } catch (error) {
      updateStatus('Kunde inte kopiera.');
    }
  };

  const copyUrl = async () => {
    const text = urlOutput.value.trim();
    if (!text) {
      updateStatus('Generera en URL först.');
      return;
    }
    try {
      await copyText(text);
      updateStatus('URL kopierad.');
    } catch (error) {
      updateStatus('Kunde inte kopiera.');
    }
  };

  const clearBbox = () => {
    minx.value = '100000';
    miny.value = '6400000';
    maxx.value = '200000';
    maxy.value = '6500000';
    output.value = '';
    urlOutput.value = '';
    updateStatus('');
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.bboxAction;
      if (action === 'preset-1' || action === 'preset-2' || action === 'preset-3') {
        setBboxPreset(presets[action]);
      } else if (action === 'generate') {
        generate();
      } else if (action === 'copy-bbox') {
        copyBbox();
      } else if (action === 'copy-url') {
        copyUrl();
      } else if (action === 'send-to-urlbuilder') {
        const bboxText = output.value.trim();
        if (!bboxText) {
          updateStatus('Generera en BBOX först.');
          return;
        }

        const urlBbox = document.getElementById('urlbuilder-bbox');
        const urlCrs = document.getElementById('urlbuilder-crs');

        if (urlBbox) urlBbox.value = bboxText;
        if (urlCrs) urlCrs.value = 'EPSG:3006';

        updateStatus('Skickade BBOX till URL builder.');
        const target = document.getElementById('url-builder') || document.getElementById('urlbuilder-base');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (action === 'clear') {
        clearBbox();
      }
    });
  });
};

const initSldPreviewTryIt = (block) => {
  const input = block.querySelector('#sldp-input');
  const preview = block.querySelector('#sldp-preview');
  const summary = block.querySelector('#sldp-summary');
  const status = block.querySelector('#sldp-status');
  const buttons = block.querySelectorAll('[data-sldp-action]');

  if (!input || !preview || !summary || !status) {
    return;
  }

  const findFirst = (node, localName) => {
    if (!node || !node.childNodes) return null;
    for (let child of node.childNodes) {
      if (child.localName === localName) return child;
      const found = findFirst(child, localName);
      if (found) return found;
    }
    return null;
  };

  const findAll = (node, localName) => {
    const results = [];
    const traverse = (n) => {
      if (!n || !n.childNodes) return;
      for (let child of n.childNodes) {
        if (child.localName === localName) results.push(child);
        traverse(child);
      }
    };
    traverse(node);
    return results;
  };

  const textOf = (el) => (el ? el.textContent?.trim() || '' : '');

  const getParamValue = (parent, paramName) => {
    if (!parent || !parent.childNodes) return null;
    for (let child of parent.childNodes) {
      if (child.localName === 'CssParameter' || child.localName === 'SvgParameter') {
        const name = child.getAttribute('name');
        if (name === paramName) return textOf(child);
      }
    }
    return null;
  };

  const getCssColor = (val) => val || '#000000';

  const samplePointSld = `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.1.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>points</Name>
    <UserStyle>
      <FeatureTypeStyle>
        <Rule>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#0066ff</CssParameter>
                  <CssParameter name="fill-opacity">0.8</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#003399</CssParameter>
                  <CssParameter name="stroke-width">2</CssParameter>
                </Stroke>
              </Mark>
              <Size>12</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;

  const sampleLineSld = `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.1.0" xmlns="http://www.opengis.net/sld">
  <NamedLayer>
    <Name>lines</Name>
    <UserStyle>
      <FeatureTypeStyle>
        <Rule>
          <LineSymbolizer>
            <Stroke>
              <CssParameter name="stroke">#ff6600</CssParameter>
              <CssParameter name="stroke-width">3</CssParameter>
              <CssParameter name="stroke-opacity">0.9</CssParameter>
            </Stroke>
          </LineSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;

  const samplePolygonSld = `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.1.0" xmlns="http://www.opengis.net/sld">
  <NamedLayer>
    <Name>polygons</Name>
    <UserStyle>
      <FeatureTypeStyle>
        <Rule>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#99ff33</CssParameter>
              <CssParameter name="fill-opacity">0.6</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#339900</CssParameter>
              <CssParameter name="stroke-width">2</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;

  const generateSvgMarker = (wellKnownName, size, fill, stroke, strokeWidth, opacity) => {
    const centerX = 24;
    const centerY = 24;
    const fillOpacity = opacity || 1;

    let path = '';
    const r = (size / 2) || 8;

    if (wellKnownName === 'square') {
      return `<rect x="${centerX - r}" y="${centerY - r}" width="${r * 2}" height="${r * 2}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${fillOpacity}"/>`;
    } else if (wellKnownName === 'triangle') {
      const h = r * Math.sqrt(3);
      path = `M ${centerX} ${centerY - h} L ${centerX + r} ${centerY + h / 2} L ${centerX - r} ${centerY + h / 2} Z`;
      return `<path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${fillOpacity}"/>`;
    } else if (wellKnownName === 'star') {
      const points = [];
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const rad = i % 2 === 0 ? r : r / 2;
        points.push(centerX + rad * Math.cos(angle) + ',' + (centerY + rad * Math.sin(angle)));
      }
      path = `M ${points.join(' L ')} Z`;
      return `<path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${fillOpacity}"/>`;
    } else if (wellKnownName === 'cross') {
      return `<g opacity="${fillOpacity}"><line x1="${centerX - r}" y1="${centerY}" x2="${centerX + r}" y2="${centerY}" stroke="${stroke}" stroke-width="${strokeWidth}"/><line x1="${centerX}" y1="${centerY - r}" x2="${centerX}" y2="${centerY + r}" stroke="${stroke}" stroke-width="${strokeWidth}"/></g>`;
    } else if (wellKnownName === 'x') {
      return `<g opacity="${fillOpacity}"><line x1="${centerX - r}" y1="${centerY - r}" x2="${centerX + r}" y2="${centerY + r}" stroke="${stroke}" stroke-width="${strokeWidth}"/><line x1="${centerX + r}" y1="${centerY - r}" x2="${centerX - r}" y2="${centerY + r}" stroke="${stroke}" stroke-width="${strokeWidth}"/></g>`;
    } else {
      return `<circle cx="${centerX}" cy="${centerY}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${fillOpacity}"/>`;
    }
  };

  const parseAndPreview = () => {
    const xmlText = input.value.trim();
    if (!xmlText) {
      status.textContent = 'Ingen SLD-input.';
      preview.innerHTML = '';
      summary.textContent = '';
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');

    if (doc.querySelector('parsererror')) {
      status.textContent = 'XML-fel i SLD.';
      preview.innerHTML = '';
      summary.textContent = 'Felaktig XML.';
      return;
    }

    let symbolizerType = null;
    let symbolizer = null;
    let symbolInfo = {};

    const pointSym = findFirst(doc, 'PointSymbolizer');
    const lineSym = findFirst(doc, 'LineSymbolizer');
    const polySym = findFirst(doc, 'PolygonSymbolizer');

    if (pointSym) {
      symbolizerType = 'Point';
      symbolizer = pointSym;

      const graphic = findFirst(symbolizer, 'Graphic');
      const mark = findFirst(graphic, 'Mark');
      const wkn = findFirst(mark, 'WellKnownName');
      const wellKnownName = textOf(wkn) || 'circle';

      const sizeEl = findFirst(graphic, 'Size');
      const size = parseInt(textOf(sizeEl)) || 10;

      const fillEl = findFirst(mark, 'Fill');
      const fill = getCssColor(getParamValue(fillEl, 'fill'));
      const fillOpacity = getParamValue(fillEl, 'fill-opacity') || '1';

      const strokeEl = findFirst(mark, 'Stroke');
      const stroke = getCssColor(getParamValue(strokeEl, 'stroke') || '#000000');
      const strokeWidth = getParamValue(strokeEl, 'stroke-width') || '1';
      const strokeOpacity = getParamValue(strokeEl, 'stroke-opacity') || '1';

      symbolInfo = { wellKnownName, size, fill, fillOpacity, stroke, strokeWidth, strokeOpacity };
    } else if (lineSym) {
      symbolizerType = 'Line';
      symbolizer = lineSym;

      const strokeEl = findFirst(symbolizer, 'Stroke');
      const stroke = getCssColor(getParamValue(strokeEl, 'stroke') || '#000000');
      const strokeWidth = parseFloat(getParamValue(strokeEl, 'stroke-width') || '2');
      const strokeOpacity = getParamValue(strokeEl, 'stroke-opacity') || '1';

      symbolInfo = { stroke, strokeWidth, strokeOpacity };
    } else if (polySym) {
      symbolizerType = 'Polygon';
      symbolizer = polySym;

      const fillEl = findFirst(symbolizer, 'Fill');
      const fill = getCssColor(getParamValue(fillEl, 'fill'));
      const fillOpacity = getParamValue(fillEl, 'fill-opacity') || '1';

      const strokeEl = findFirst(symbolizer, 'Stroke');
      const stroke = getCssColor(getParamValue(strokeEl, 'stroke') || '#000000');
      const strokeWidth = getParamValue(strokeEl, 'stroke-width') || '1';
      const strokeOpacity = getParamValue(strokeEl, 'stroke-opacity') || '1';

      symbolInfo = { fill, fillOpacity, stroke, strokeWidth, strokeOpacity };
    }

    if (!symbolizerType) {
      status.textContent = 'Ingen symbolizer hittades.';
      preview.innerHTML = '';
      summary.textContent = 'Ingen PointSymbolizer, LineSymbolizer eller PolygonSymbolizer hittades.';
      return;
    }

    let svgContent = '';

    if (symbolizerType === 'Point') {
      const { wellKnownName, size, fill, fillOpacity, stroke, strokeWidth } = symbolInfo;
      const marker = generateSvgMarker(wellKnownName, size, fill, stroke, strokeWidth, fillOpacity);
      svgContent = `<svg width="240" height="120" viewBox="0 0 240 120" style="border: none;">
        <rect width="240" height="120" fill="#ffffff"/>
        ${marker}
      </svg>`;
    } else if (symbolizerType === 'Line') {
      const { stroke, strokeWidth, strokeOpacity } = symbolInfo;
      svgContent = `<svg width="240" height="120" viewBox="0 0 240 120" style="border: none;">
        <rect width="240" height="120" fill="#ffffff"/>
        <line x1="30" y1="60" x2="210" y2="60" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${strokeOpacity}"/>
      </svg>`;
    } else if (symbolizerType === 'Polygon') {
      const { fill, fillOpacity, stroke, strokeWidth, strokeOpacity } = symbolInfo;
      svgContent = `<svg width="240" height="120" viewBox="0 0 240 120" style="border: none;">
        <rect width="240" height="120" fill="#ffffff"/>
        <rect x="60" y="30" width="120" height="60" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${fillOpacity}"/>
      </svg>`;
    }

    preview.innerHTML = svgContent;

    let summaryText = `Typ: ${symbolizerType}Symbolizer\n\n`;
    Object.entries(symbolInfo).forEach(([key, value]) => {
      summaryText += `${key}: ${value}\n`;
    });

    summary.textContent = summaryText;
    status.textContent = `Hittade ${symbolizerType}Symbolizer.`;
  };

  const fillSample = (sldText) => {
    input.value = sldText;
    parseAndPreview();
  };

  const clearAll = () => {
    input.value = '';
    preview.innerHTML = '';
    summary.textContent = '';
    status.textContent = '';
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.sldpAction;
      if (action === 'preview') {
        parseAndPreview();
      } else if (action === 'sample-point') {
        fillSample(samplePointSld);
      } else if (action === 'sample-line') {
        fillSample(sampleLineSld);
      } else if (action === 'sample-polygon') {
        fillSample(samplePolygonSld);
      } else if (action === 'clear') {
        clearAll();
      }
    });
  });
};

const initMapSandboxTryIt = (block) => {
  const bboxWidth = block.querySelector('#ms-bbox-width');
  const bboxHeight = block.querySelector('#ms-bbox-height');
  const resolution = block.querySelector('#ms-resolution');
  const tile = block.querySelector('#ms-tile');
  const meta = block.querySelector('#ms-meta');
  const canvas = block.querySelector('#ms-canvas');
  const status = block.querySelector('#ms-status');
  const buttons = block.querySelectorAll('[data-ms-action]');

  if (!bboxWidth || !bboxHeight || !resolution || !tile || !meta || !canvas || !status) {
    return;
  }

  const ctx = canvas.getContext('2d');

  const updateStatus = (message) => {
    if (status) {
      status.textContent = message;
    }
  };

  const draw = () => {
    const bboxW = parseFloat(bboxWidth.value);
    const bboxH = parseFloat(bboxHeight.value);
    const resVal = parseFloat(resolution.value);
    const tileVal = parseFloat(tile.value);
    const metaVal = parseFloat(meta.value);

    if (
      isNaN(bboxW) || isNaN(bboxH) || isNaN(resVal) || isNaN(tileVal) || isNaN(metaVal) ||
      bboxW <= 0 || bboxH <= 0 || resVal <= 0 || tileVal <= 0 || metaVal <= 0
    ) {
      updateStatus('Alla värden måste vara tal > 0.');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const tileSpanM = resVal * tileVal;
    const metaSpanM = tileSpanM * metaVal;

    const numTilesX = Math.ceil(bboxW / tileSpanM);
    const numTilesY = Math.ceil(bboxH / tileSpanM);

    const padding = 20;
    const availWidth = canvas.width - 2 * padding;
    const availHeight = canvas.height - 2 * padding;

    const bboxAspect = bboxW / bboxH;
    const canvasAspect = availWidth / availHeight;

    let scaledWidth, scaledHeight;
    if (bboxAspect > canvasAspect) {
      scaledWidth = availWidth;
      scaledHeight = availWidth / bboxAspect;
    } else {
      scaledHeight = availHeight;
      scaledWidth = availHeight * bboxAspect;
    }

    const startX = padding + (availWidth - scaledWidth) / 2;
    const startY = padding + (availHeight - scaledHeight) / 2;

    const scaleX = scaledWidth / bboxW;
    const scaleY = scaledHeight / bboxH;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#555555';
    ctx.lineWidth = 2;
    for (let i = 0; i <= numTilesX; i++) {
      const xPixels = (i * metaSpanM) * scaleX;
      if (xPixels <= scaledWidth) {
        ctx.beginPath();
        ctx.moveTo(startX + xPixels, startY);
        ctx.lineTo(startX + xPixels, startY + scaledHeight);
        ctx.stroke();
      }
    }
    for (let j = 0; j <= numTilesY; j++) {
      const yPixels = (j * metaSpanM) * scaleY;
      if (yPixels <= scaledHeight) {
        ctx.beginPath();
        ctx.moveTo(startX, startY + yPixels);
        ctx.lineTo(startX + scaledWidth, startY + yPixels);
        ctx.stroke();
      }
    }

    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    for (let i = 0; i <= Math.ceil(bboxW / tileSpanM); i++) {
      const xPixels = (i * tileSpanM) * scaleX;
      if (xPixels <= scaledWidth) {
        ctx.beginPath();
        ctx.moveTo(startX + xPixels, startY);
        ctx.lineTo(startX + xPixels, startY + scaledHeight);
        ctx.stroke();
      }
    }
    for (let j = 0; j <= Math.ceil(bboxH / tileSpanM); j++) {
      const yPixels = (j * tileSpanM) * scaleY;
      if (yPixels <= scaledHeight) {
        ctx.beginPath();
        ctx.moveTo(startX, startY + yPixels);
        ctx.lineTo(startX + scaledWidth, startY + yPixels);
        ctx.stroke();
      }
    }

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeRect(startX, startY, scaledWidth, scaledHeight);

    const infoMsg = `BBOX: ${bboxW}×${bboxH}m | Tile: ${tileSpanM.toFixed(0)}m | Meta: ${metaSpanM.toFixed(0)}m | Grid: ${numTilesX}×${numTilesY} tiles`;
    updateStatus(infoMsg);
  };

  const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateStatus('');
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.msAction;
      if (action === 'draw') {
        draw();
      } else if (action === 'clear') {
        clearCanvas();
      }
    });
  });
};

const initTryIt = () => {
  const tryItBlocks = document.querySelectorAll('[data-tryit]');
  if (!tryItBlocks.length) {
    return;
  }

  const updateStatus = (element, message) => {
    if (element) {
      element.textContent = message;
    }
  };

  const initJsonTryIt = (block) => {
    const input = block.querySelector('#json-tryit-input');
    const output = block.querySelector('#json-tryit-output');
    const status = block.querySelector('#json-tryit-status');
    const buttons = block.querySelectorAll('[data-json-action]');

    if (!input || !output || !status || !buttons.length) {
      return;
    }

    const setOutput = (value) => {
      output.textContent = value;
    };

    const validateJson = () => {
      const raw = input.value.trim();
      if (!raw) {
        updateStatus(status, 'Fyll i JSON att validera.');
        setOutput('');
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        setOutput(JSON.stringify(parsed, null, 2));
        updateStatus(status, 'JSON är giltig.');
      } catch (error) {
        setOutput('');
        updateStatus(status, `Ogiltig JSON: ${error.message}`);
      }
    };

    const prettifyJson = () => {
      const raw = input.value.trim();
      if (!raw) {
        updateStatus(status, 'Fyll i JSON att prettify.');
        setOutput('');
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        const pretty = JSON.stringify(parsed, null, 2);
        input.value = pretty;
        setOutput(pretty);
        updateStatus(status, 'JSON prettify klar.');
      } catch (error) {
        setOutput('');
        updateStatus(status, `Ogiltig JSON: ${error.message}`);
      }
    };

    const minifyJson = () => {
      const raw = input.value.trim();
      if (!raw) {
        updateStatus(status, 'Fyll i JSON att minify.');
        setOutput('');
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        const minified = JSON.stringify(parsed);
        input.value = minified;
        setOutput(minified);
        updateStatus(status, 'JSON minify klar.');
      } catch (error) {
        setOutput('');
        updateStatus(status, `Ogiltig JSON: ${error.message}`);
      }
    };

    const copyJson = async () => {
      const text = output.textContent || input.value;
      if (!text.trim()) {
        updateStatus(status, 'Inget att kopiera.');
        return;
      }
      try {
        await copyText(text);
        updateStatus(status, 'Kopierat till urklipp.');
      } catch (error) {
        updateStatus(status, 'Kunde inte kopiera.');
      }
    };

    const clearJson = () => {
      input.value = '';
      setOutput('');
      updateStatus(status, '');
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.jsonAction;
        switch (action) {
          case 'validate':
            validateJson();
            break;
          case 'prettify':
            prettifyJson();
            break;
          case 'minify':
            minifyJson();
            break;
          case 'copy':
            copyJson();
            break;
          case 'clear':
            clearJson();
            break;
          default:
            break;
        }
      });
    });
  };

  const initSldTryIt = (block) => {
    const input = block.querySelector('#sld-tryit-input');
    const output = block.querySelector('#sld-tryit-output');
    const status = block.querySelector('#sld-tryit-status');
    const buttons = block.querySelectorAll('[data-sld-action]');

    if (!input || !output || !status || !buttons.length) {
      return;
    }

    const template = `<?xml version="1.0" encoding="UTF-8"?>
<se:StyledLayerDescriptor version="1.1.0"
  xmlns:se="http://www.opengis.net/se"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/se http://schemas.opengis.net/se/1.1.0/StyledLayerDescriptor.xsd">
  <se:NamedLayer>
    <se:Name>example_layer</se:Name>
    <se:UserStyle>
      <se:Title>Example style</se:Title>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#3b82f6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#1d4ed8</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </se:UserStyle>
  </se:NamedLayer>
</se:StyledLayerDescriptor>`;

    const setOutput = (value) => {
      output.textContent = value;
    };

    const checkSld = () => {
      const raw = input.value.trim();
      if (!raw) {
        updateStatus(status, 'Fyll i SLD att kontrollera.');
        setOutput('');
        return;
      }
      const parser = new DOMParser();
      const doc = parser.parseFromString(raw, 'application/xml');
      const errors = doc.querySelector('parsererror');
      if (errors) {
        updateStatus(status, 'XML-fel hittades. Kontrollera namespaces och syntax.');
        setOutput(errors.textContent || 'XML-fel hittades.');
        return;
      }

      const isSld =
        doc.querySelector('StyledLayerDescriptor') || doc.querySelector('se\\:StyledLayerDescriptor');
      if (!isSld) {
        updateStatus(status, 'Ingen StyledLayerDescriptor hittades.');
        setOutput('Tips: kontrollera att SLD/SE är korrekt och innehåller StyledLayerDescriptor.');
        return;
      }

      updateStatus(status, 'SLD ser giltig ut.');
      setOutput('XML är välformad och innehåller StyledLayerDescriptor.');
    };

    const loadTemplate = () => {
      input.value = template;
      setOutput('');
      updateStatus(status, 'Mall laddad.');
    };

    const copySld = async () => {
      const text = input.value;
      if (!text.trim()) {
        updateStatus(status, 'Inget att kopiera.');
        return;
      }
      try {
        await copyText(text);
        updateStatus(status, 'Kopierat till urklipp.');
      } catch (error) {
        updateStatus(status, 'Kunde inte kopiera.');
      }
    };

    const clearSld = () => {
      input.value = '';
      setOutput('');
      updateStatus(status, '');
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.sldAction;
        switch (action) {
          case 'check':
            checkSld();
            break;
          case 'template':
            loadTemplate();
            break;
          case 'copy':
            copySld();
            break;
          case 'clear':
            clearSld();
            break;
          default:
            break;
        }
      });
    });
  };

  const initUrlBuilder = (block) => {
    const base = block.querySelector('#urlbuilder-base');
    const service = block.querySelector('#urlbuilder-service');
    const layer = block.querySelector('#urlbuilder-layer');
    const format = block.querySelector('#urlbuilder-format');
    const crs = block.querySelector('#urlbuilder-crs');
    const bbox = block.querySelector('#urlbuilder-bbox');
    const output = block.querySelector('#urlbuilder-output');
    const status = block.querySelector('#urlbuilder-status');
    const buttons = block.querySelectorAll('[data-url-action]');

    if (!base || !service || !layer || !format || !crs || !bbox || !output || !status) {
      return;
    }

    const buildQuery = (serviceValue) => {
      const params = new URLSearchParams();
      const isWfs = serviceValue.toUpperCase() === 'WFS';
      params.set('service', serviceValue.toUpperCase());
      params.set('version', isWfs ? '2.0.0' : '1.1.1');
      params.set('request', isWfs ? 'GetFeature' : 'GetMap');
      params.set(isWfs ? 'typenames' : 'layers', layer.value.trim());
      params.set(isWfs ? 'outputFormat' : 'format', format.value.trim());
      if (!isWfs) {
        params.set('bbox', bbox.value.trim());
        params.set('srs', crs.value.trim());
        params.set('width', '256');
        params.set('height', '256');
      }
      return params;
    };

     const quicks = block.querySelectorAll('[data-url-quick]');
    quicks.forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.urlQuick;

        const setBaseIfEmpty = () => {
          if (!base.value.trim()) base.value = 'https://example.com/geoserver/ows';
        };

        if (action === 'cap-wms') {
          setBaseIfEmpty();
          service.value = 'WMS';

          layer.value = '';
          format.value = '';
          crs.value = '';
          bbox.value = '';

          try {
            const url = new URL(base.value.trim(), window.location.href);
            url.search = new URLSearchParams({
              service: 'WMS',
              request: 'GetCapabilities',
            }).toString();
            output.value = url.toString();
            updateStatus(status, 'Template: WMS GetCapabilities.');
          } catch {
            output.value = '';
            updateStatus(status, 'Ogiltig bas-URL.');
          }
          return;
        }

        if (action === 'cap-wfs') {
          setBaseIfEmpty();
          service.value = 'WFS';

          layer.value = '';
          format.value = '';
          crs.value = '';
          bbox.value = '';

          try {
            const url = new URL(base.value.trim(), window.location.href);
            url.search = new URLSearchParams({
              service: 'WFS',
              request: 'GetCapabilities',
            }).toString();
            output.value = url.toString();
            updateStatus(status, 'Template: WFS GetCapabilities.');
          } catch {
            output.value = '';
            updateStatus(status, 'Ogiltig bas-URL.');
          }
          return;
        }

        if (action === 'getmap-demo') {
          setBaseIfEmpty();
          service.value = 'WMS';
          layer.value = layer.value.trim() || 'workspace:layer';
          format.value = format.value.trim() || 'image/png';
          crs.value = crs.value.trim() || 'EPSG:3006';
          bbox.value = bbox.value.trim() || '200000,6100000,900000,7700000';
          try {
            const url = new URL(base.value.trim(), window.location.href);
            url.search = new URLSearchParams({
              service: 'WMS',
              version: '1.1.1',
              request: 'GetMap',
              layers: layer.value.trim(),
              format: format.value.trim(),
              bbox: bbox.value.trim(),
              srs: crs.value.trim(),
              width: '256',
              height: '256',
            }).toString();
            output.value = url.toString();
            updateStatus(status, 'Template: WMS GetMap (demo).');
          } catch {
            output.value = '';
            updateStatus(status, 'Ogiltig bas-URL.');
          }
          return;
        }

        if (action === 'clear') {
          base.value = '';
          layer.value = '';
          format.value = '';
          crs.value = '';
          bbox.value = '';
          output.value = '';
          updateStatus(status, 'Rensat.');
        }
      });
    });

    const generate = () => {
      const baseValue = base.value.trim();
      if (!baseValue) {
        updateStatus(status, 'Fyll i en bas‑URL.');
        output.value = '';
        return;
      }

      try {
        const url = new URL(baseValue, window.location.href);
        url.search = buildQuery(service.value).toString();
        output.value = url.toString();
        updateStatus(status, 'URL genererad.');
      } catch (error) {
        updateStatus(status, 'Ogiltig bas‑URL.');
        output.value = '';
      }
    };

    const copyUrl = async () => {
      const text = output.value.trim();
      if (!text) {
        updateStatus(status, 'Generera en URL först.');
        return;
      }
      try {
        await copyText(text);
        updateStatus(status, 'URL kopierad.');
      } catch (error) {
        updateStatus(status, 'Kunde inte kopiera.');
      }
    };

    buttons.forEach((button) => {
      button.addEventListener('click', async () => {
        const action = button.dataset.urlAction;
        if (action === 'generate') {
          generate();
        } else if (action === 'copy') {
          copyUrl();
        } else if (action === 'open') {
          const url = output.value.trim();
          if (!url) {
            updateStatus('Generera en URL först.');
            return;
          }
          window.open(url, '_blank', 'noopener,noreferrer');
          updateStatus('Öppnade URL i ny flik.');
        } else if (action === 'test') {
            try {
              const generated = output.value.trim();
              if (!generated) {
                updateStatus(status, 'Generera en URL först.');
                return;
              }

              const url = new URL(generated, window.location.href);

              if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
                updateStatus(status, 'Det här pekar på localhost. Starta GeoServer lokalt eller byt bas-URL för att testa.');
                return;
              }

              updateStatus(status, 'Testar…');

              const t0 = performance.now();

              let res;
              try {
                res = await fetch(url.toString(), { method: 'HEAD' });
              } catch {
                res = await fetch(url.toString(), { method: 'GET' });
              }

              const ms = Math.round(performance.now() - t0);
              const ct = res.headers.get('content-type') || 'okänt';
              updateStatus(status, `Svar: ${res.status} ${res.statusText} • ${ms} ms • ${ct}`);
            } catch (error) {
              updateStatus(status, 'Kunde inte testa URL (CORS/nätverk). Prova “Öppna” eller byt bas-URL.');
            }
          }
      });
    });
  };

  tryItBlocks.forEach((block) => {
    const type = block.dataset.tryit;
    if (type === 'json') {
      initJsonTryIt(block);
    } else if (type === 'sld') {
      initSldTryIt(block);
    } else if (type === 'sldpreview') {
      initSldPreviewTryIt(block);
    } else if (type === 'urlbuilder') {
      initUrlBuilder(block);
    } else if (type === 'bbox') {
      initBboxTryIt(block);
    } else if (type === 'resolutions') {
      initResolutionsTryIt(block);
    } else if (type === 'gridcalc') {
      initGridCalcTryIt(block);
    } else if (type === 'mapsandbox') {
      initMapSandboxTryIt(block);
    }
  });
};

const initWizard = () => {
  const wizards = document.querySelectorAll('.wizard[data-wizard]');

  wizards.forEach((wizard) => {
    const wizardId = wizard.getAttribute('data-wizard');
    const config = WIZARD_DATA[wizardId];

    if (!config || !config.symptoms.length) {
      return;
    }

    wizard.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = config.title;

    const optionsSection = document.createElement('div');
    optionsSection.className = 'wizard-section';

    const optionsTitle = document.createElement('h3');
    optionsTitle.textContent = 'Vad ser du?';

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'wizard-options';

    const startSection = document.createElement('div');
    startSection.className = 'wizard-section';

    const startTitle = document.createElement('h3');
    startTitle.textContent = 'Starta här';

    const startList = document.createElement('ol');
    startList.className = 'wizard-steps';

    const linkSection = document.createElement('div');
    linkSection.className = 'wizard-section';

    const linkTitle = document.createElement('h3');
    linkTitle.textContent = 'Gå vidare här';

    const linkList = document.createElement('ul');
    linkList.className = 'wizard-links';

    const escalateSection = document.createElement('div');
    escalateSection.className = 'wizard-section';

    const escalateTitle = document.createElement('h3');
    escalateTitle.textContent = 'När eskalera?';

    const escalateList = document.createElement('ul');
    escalateList.className = 'wizard-escalate';

    optionsSection.appendChild(optionsTitle);
    optionsSection.appendChild(optionsContainer);
    startSection.appendChild(startTitle);
    startSection.appendChild(startList);
    linkSection.appendChild(linkTitle);
    linkSection.appendChild(linkList);
    escalateSection.appendChild(escalateTitle);
    escalateSection.appendChild(escalateList);

    wizard.appendChild(title);
    wizard.appendChild(optionsSection);
    wizard.appendChild(startSection);
    wizard.appendChild(linkSection);
    wizard.appendChild(escalateSection);

    const storageKey = `wizard:${wizardId}`;
    const savedKey = localStorage.getItem(storageKey);
    let activeSymptom = config.symptoms.find((item) => item.key === savedKey) || config.symptoms[0];

    const renderList = (container, items) => {
      container.innerHTML = '';
      items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        container.appendChild(li);
      });
    };

    const renderLinks = (items) => {
      linkList.innerHTML = '';
      items.forEach((item) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = item.href;
        link.textContent = item.label;
        li.appendChild(link);
        linkList.appendChild(li);
      });
    };

    const renderSymptom = (symptom) => {
      renderList(startList, symptom.startHere, true);
      renderLinks(symptom.links);
      renderList(escalateList, symptom.escalate);
    };

    const updateActive = (symptomKey) => {
      const nextSymptom = config.symptoms.find((item) => item.key === symptomKey);
      if (!nextSymptom) {
        return;
      }
      activeSymptom = nextSymptom;
      localStorage.setItem(storageKey, symptomKey);
      renderSymptom(activeSymptom);
      optionsContainer.querySelectorAll('.wizard-option').forEach((button) => {
        const isActive = button.dataset.symptom === symptomKey;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', isActive.toString());
      });
    };

    optionsContainer.innerHTML = '';
    config.symptoms.forEach((symptom) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'wizard-option';
      button.textContent = symptom.label;
      button.dataset.symptom = symptom.key;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => updateActive(symptom.key));
      optionsContainer.appendChild(button);
    });

    updateActive(activeSymptom.key);
  });
};

const initReleasePlaybook = () => {
  const container = document.querySelector('[data-playbook=\"release\"]');
  if (!container) {
    return;
  }

  const checkboxes = container.querySelectorAll('input[type=\"checkbox\"][data-playbook-id]');
  const resetButton = document.getElementById('playbookReset');
  const storageKey = 'playbook:release';
  let state = {};

  try {
    state = JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch (error) {
    state = {};
  }

  checkboxes.forEach((checkbox) => {
    const id = checkbox.dataset.playbookId;
    checkbox.checked = Boolean(state[id]);

    checkbox.addEventListener('change', () => {
      state[id] = checkbox.checked;
      localStorage.setItem(storageKey, JSON.stringify(state));
    });
  });

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      state = {};
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      localStorage.removeItem(storageKey);
    });
  }
};

const initScrollSpy = () => {
  const nav = document.querySelector('.sidenav');
  if (!nav) {
    return;
  }

  const anchorLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const targets = anchorLinks
    .map((link) => {
      const id = link.getAttribute('href')?.slice(1);
      const target = id ? document.getElementById(id) : null;
      return target ? { link, target } : null;
    })
    .filter(Boolean);

  if (!targets.length) {
    return;
  }

  let activeLink = null;

  const setActive = (link) => {
    if (activeLink === link) {
      return;
    }
    anchorLinks.forEach((item) => item.classList.remove('is-active-section'));
    link.classList.add('is-active-section');
    activeLink = link;
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length) {
          const match = targets.find(({ target }) => target === visible[0].target);
          if (match) {
            setActive(match.link);
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );

    targets.forEach(({ target }) => observer.observe(target));
    return;
  }

  const handleScroll = () => {
    const top = window.scrollY + window.innerHeight * 0.3;
    let closest = null;
    let closestDistance = Infinity;

    targets.forEach(({ target, link }) => {
      const distance = Math.abs(target.offsetTop - top);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = link;
      }
    });

    if (closest) {
      setActive(closest);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
};

const initGridsetExplorer = () => {
  const container = document.getElementById('gridset-explorer-container');
  if (!container || typeof ol === 'undefined') return;

  const EPSG3006 = 'EPSG:3006';

  const extents = {
    sverige: {
      name: 'Sverige',
      bounds: [150000, 6100000, 1120000, 7710000],
    },
    skaraborg: {
      name: 'Skaraborg',
      bounds: [370000, 6428000, 489000, 6531500],
    },
  };

  const setUiStatus = (msg) => {
    const el = container.querySelector('[data-gridset-status]');
    if (el) el.textContent = msg;
  };

  const hasProj4 = typeof proj4 !== 'undefined';
  const canRegister =
    ol?.proj?.proj4 && typeof ol.proj.proj4.register === 'function' && typeof proj4?.defs === 'function';

  if (!hasProj4 || !canRegister) {
    setUiStatus('Kunde inte initiera EPSG:3006 (proj4/OpenLayers saknas).');
    return;
  }

  try {
    proj4.defs(
      EPSG3006,
      '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    );
    ol.proj.proj4.register(proj4);
  } catch (e) {
    setUiStatus('Kunde inte registrera EPSG:3006 (proj4-registrering misslyckades).');
    return;
  }

  const projection = ol.proj.get(EPSG3006);
  if (!projection) {
    setUiStatus('Kunde inte initiera EPSG:3006 (projection saknas).');
    return;
  }

  try {
    projection.setExtent([0, 6000000, 1500000, 7800000]);
  } catch (e) {}

  const mapTarget = document.getElementById('gridset-map');
  if (!mapTarget) {
    setUiStatus('Kunde inte initiera karta (gridset-map saknas i HTML).');
    return;
  }

  const vectorSource = new ol.source.Vector();

  const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({ color: '#3b82f6', width: 2 }),
      fill: new ol.style.Fill({ color: 'rgba(59,130,246,0.12)' }),
    }),
  });

  const view = new ol.View({
    projection,
    center: ol.extent.getCenter(extents.sverige.bounds),
    zoom: 4,
    constrainResolution: true,
    minZoom: 2,
    maxZoom: 14,
  });

  const map = new ol.Map({
    target: 'gridset-map',
    layers: [
      new ol.layer.Tile({ source: new ol.source.OSM() }),
      vectorLayer,
    ],
    view,
  });

  const setActiveButton = (extentKey) => {
    container.querySelectorAll('[data-extent-action]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.extentAction === extentKey);
      btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
    });
  };

  const updateInfo = (extentKey) => {
    const extent = extents[extentKey];
    if (!extent) return;

    const [minx, miny, maxx, maxy] = extent.bounds;
    const zoom = view.getZoom();
    const resolution = view.getResolution();
    if (!resolution) return;

    const width = maxx - minx;
    const height = maxy - miny;
    const tileSize = 256;

    const tilesX = Math.ceil(width / (resolution * tileSize));
    const tilesY = Math.ceil(height / (resolution * tileSize));
    const totalTiles = tilesX * tilesY;

    const elExtent = document.getElementById('gridset-info-extent');
    const elBbox = document.getElementById('gridset-info-bbox');
    const elZoom = document.getElementById('gridset-info-zoom');
    const elTiles = document.getElementById('gridset-info-tiles');

    const initGridsetWorkflow = () => {
      const copyBtn = document.querySelector('[data-gridset-action="copy-bbox"]');
      const sendBtn = document.querySelector('[data-gridset-action="send-to-urlbuilder"]');
      const bboxEl = document.getElementById('gridset-info-bbox');

      const getBbox = () => (bboxEl?.textContent || '').trim();

      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
        const bbox = getBbox();
        if (!bbox || bbox === '—') return;

        const original = copyBtn.textContent;

        try {
          await navigator.clipboard.writeText(bbox);
          copyBtn.textContent = 'Kopierat!';
        } catch {
          copyBtn.textContent = 'Kunde inte kopiera';
        }

        window.setTimeout(() => {
          copyBtn.textContent = original;
        }, 1200);
      });
      }

      if (sendBtn) {
        sendBtn.addEventListener('click', () => {
          const bbox = getBbox();
          if (!bbox || bbox === '—') return;

          const urlBbox = document.getElementById('urlbuilder-bbox');
          const urlCrs = document.getElementById('urlbuilder-crs');

          if (urlBbox) urlBbox.value = bbox;
          if (urlCrs) urlCrs.value = 'EPSG:3006';

          const target = document.getElementById('urlbuilder');
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    };

    initGridsetWorkflow();

    if (elExtent) elExtent.textContent = extent.name;
    if (elBbox) elBbox.textContent = `minx: ${minx}, miny: ${miny}\nmaxx: ${maxx}, maxy: ${maxy}`;
    if (elZoom) elZoom.textContent = typeof zoom === 'number' ? zoom.toFixed(2) : '—';
    if (elTiles) elTiles.textContent = `${tilesX} × ${tilesY} = ${totalTiles}`;
  };

  const drawBbox = (bounds) => {
    const [minx, miny, maxx, maxy] = bounds;

    vectorSource.clear();

    const ring = [
      [minx, miny],
      [maxx, miny],
      [maxx, maxy],
      [minx, maxy],
      [minx, miny],
    ];

    vectorSource.addFeature(new ol.Feature(new ol.geom.Polygon([ring])));
  };

  let activeExtentKey = 'skaraborg';

  const applyExtent = (extentKey) => {
    const extent = extents[extentKey];
    if (!extent) return;

    activeExtentKey = extentKey;
    setActiveButton(extentKey);
    drawBbox(extent.bounds);

    view.fit(extent.bounds, { padding: [28, 28, 28, 28], duration: 250, maxZoom: 7 });

    const z = view.getZoom();
    if (typeof z === 'number' && z < 2) view.setZoom(2);

    updateInfo(extentKey);
  };

  container.querySelectorAll('[data-extent-action]').forEach((button) => {
    button.addEventListener('click', () => applyExtent(button.dataset.extentAction));
  });

  view.on('change:resolution', () => updateInfo(activeExtentKey));
  view.on('change:center', () => updateInfo(activeExtentKey));

  applyExtent('skaraborg');
};

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAccordions();
  initOfflineNotice();
  initSearch();
  initPageMeta(); 
  initCodeCopy();
  initTryIt();
  initWizard();
  initReleasePlaybook();
  initScrollSpy();
  initGridsetExplorer();
});
