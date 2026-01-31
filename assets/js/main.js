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
    content:
      'origo init konfiguration wms wfs wmts lager controls clustering prestanda epsg 3008 vanliga fel',
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
    content:
      'tile cache gridset grid misalignment epsg 3008 seed truncate metatiles prestanda felsökning',
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
      activeTag === 'input' ||
      activeTag === 'textarea' ||
      document.activeElement?.isContentEditable;

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
    } catch {}

    if (!dateStr) {
      const manual = document.querySelector('meta[name="last-updated"]')?.getAttribute('content');
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
  if (
    cls.includes('language-bash') ||
    cls.includes('language-shell') ||
    cls.includes('language-cli')
  )
    return 'cli';
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
    (m, g1) => `<span class="tok-key">${g1}</span><span class="tok-punct">:</span>`,
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
        `<span class="tok-attr">${a}</span><span class="tok-punct">${eq}</span><span class="tok-value">${v}</span>`,
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
  s = s.replace(
    /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'|`([\s\S]*?)`/g,
    (m) => `<span class="tok-string">${m}</span>`,
  );
  s = s.replace(
    /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|import|export|from|try|catch|finally|throw|await|async)\b/g,
    `<span class="tok-keyword">$1</span>`,
  );
  s = s.replace(/(-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)/gi, `<span class="tok-number">$1</span>`);
  s = s.replace(/[{}()[\],.;:+\-*/=<>!&|?]/g, (m) => `<span class="tok-operator">${m}</span>`);
  return s;
};

const highlightCLI = (text) => {
  let s = escapeHTML(text);
  s = s.replace(
    /(^|\n)\s*([$>])\s?/g,
    (m, p1, p2) => `${p1}<span class="tok-prompt">${p2}</span> `,
  );
  s = s.replace(
    /(\s|^)(--[a-zA-Z0-9_-]+|-[a-zA-Z]+)/g,
    (m, p1, flag) => `${p1}<span class="tok-flag">${flag}</span>`,
  );
  s = s.replace(
    /(\s|^)(\.{0,2}\/[A-Za-z0-9._/-]+)/g,
    (m, p1, path) => `${p1}<span class="tok-path">${path}</span>`,
  );
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
  const output = block.querySelector('#res-output');
  const status = block.querySelector('#res-status');
  const buttons = block.querySelectorAll('[data-res-action]');

  // Enterprise elements
  const advancedToggle = block.querySelector('#res-advanced-toggle');
  const advancedPanel = block.querySelector('#res-advanced-panel');
  const validationOutput = block.querySelector('#res-validation');
  const previewDiv = block.querySelector('#res-preview');

  if (!input || !output || !status) {
    return;
  }

  const TOOL_KEY = 'res';
  let lastValidatedResolutions = null;
  let lastValidationResult = null;

  const updateStatus = (msg) => {
    if (status) status.textContent = msg;
  };

  const parseResolutions = () => {
    const text = input.value.trim();
    if (!text) return { resolutions: [], parseErrors: [], originalLines: [] };

    const lines = text.split('\n');
    const resolutions = [];
    const parseErrors = [];
    const originalLines = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      originalLines.push(trimmed);

      if (!trimmed) return; // Skip blank lines

      // Remove commas and extra spaces
      const cleaned = trimmed.replace(/,/g, '').replace(/\s+/g, ' ').trim();
      const val = parseFloat(cleaned);

      if (isNaN(val)) {
        parseErrors.push({ line: idx + 1, text: trimmed, error: 'Inte ett giltigt tal' });
      } else if (!isFinite(val)) {
        parseErrors.push({ line: idx + 1, text: trimmed, error: 'Inte ett ändligt tal' });
      } else if (val <= 0) {
        parseErrors.push({ line: idx + 1, text: trimmed, error: 'Måste vara > 0' });
      } else {
        resolutions.push(val);
      }
    });

    return { resolutions, parseErrors, originalLines };
  };

  const validateResolutions = (resolutions) => {
    const issues = [];
    const warnings = [];

    if (resolutions.length === 0) {
      issues.push('Listan är tom');
      return { issues, warnings, valid: false };
    }

    // Check for descending order
    const orderIssues = [];
    for (let i = 0; i < resolutions.length - 1; i++) {
      if (resolutions[i] <= resolutions[i + 1]) {
        orderIssues.push(`Position ${i + 1}→${i + 2}: ${resolutions[i]} ≤ ${resolutions[i + 1]}`);
      }
    }
    if (orderIssues.length > 0) {
      warnings.push('Lista är inte strikt fallande:');
      orderIssues.forEach((o) => warnings.push(`  ${o}`));
    }

    // Check for duplicates
    const seen = new Map();
    resolutions.forEach((val, idx) => {
      if (!seen.has(val)) {
        seen.set(val, []);
      }
      seen.get(val).push(idx + 1);
    });

    const duplicates = Array.from(seen.entries()).filter(([_, positions]) => positions.length > 1);
    if (duplicates.length > 0) {
      warnings.push('Dubbletter hittade:');
      duplicates.forEach(([val, positions]) => {
        warnings.push(`  ${val} på position: ${positions.join(', ')}`);
      });
    }

    // Check for suspicious values
    resolutions.forEach((val, idx) => {
      if (val > 10000) {
        warnings.push(`Position ${idx + 1}: ${val} verkar ovanligt stort`);
      } else if (val < 0.001) {
        warnings.push(`Position ${idx + 1}: ${val} verkar ovanligt litet`);
      }
    });

    // Check for too similar values
    for (let i = 0; i < resolutions.length - 1; i++) {
      const diff = Math.abs(resolutions[i] - resolutions[i + 1]);
      const pctDiff = (diff / resolutions[i]) * 100;
      if (pctDiff < 0.1 && pctDiff > 0) {
        warnings.push(
          `Position ${i + 1}→${i + 2}: ${resolutions[i]} och ${resolutions[i + 1]} skiljer < 0.1%`,
        );
      }
    }

    const valid = issues.length === 0;
    return { issues, warnings, valid };
  };

  const generateValidationReport = (parseErrors, resolutions, validation) => {
    const lines = ['═══ VALIDERINGSRAPPORT ═══', ''];

    if (parseErrors.length > 0) {
      lines.push('Status: [ERROR] Parse-fel');
      lines.push('');
      lines.push('Parse-fel:');
      parseErrors.forEach((e) => {
        lines.push(`  Rad ${e.line}: ${e.error}`);
        lines.push(`    "${e.text}"`);
      });
      return lines;
    }

    if (resolutions.length === 0) {
      lines.push('Status: [WARN] Ingen data');
      lines.push('');
      lines.push('Ingen giltig input hittades.');
      return lines;
    }

    const hasWarnings = validation.warnings.length > 0;
    const statusText =
      validation.valid && !hasWarnings
        ? '[OK] GILTIG'
        : hasWarnings
          ? '[WARN] VARNINGAR'
          : '[ERROR] OGILTIG';
    lines.push(`Status: ${statusText}`);
    lines.push('');

    lines.push(`Statistik:`);
    lines.push(`  Antal: ${resolutions.length}`);
    lines.push(`  Min: ${Math.min(...resolutions)}`);
    lines.push(`  Max: ${Math.max(...resolutions)}`);
    lines.push(`  Unika: ${new Set(resolutions).size}`);
    lines.push('');

    if (validation.issues.length === 0 && validation.warnings.length === 0) {
      lines.push('[OK] Alla värden > 0');
      lines.push('[OK] Strikt fallande ordning');
      lines.push('[OK] Inga dubbletter');
      lines.push('[OK] Inga misstänkta värden');
    } else {
      if (validation.issues.length > 0) {
        lines.push('Kritiska problem:');
        validation.issues.forEach((issue) => lines.push(`  ${issue}`));
        lines.push('');
      }

      if (validation.warnings.length > 0) {
        lines.push('Varningar:');
        validation.warnings.forEach((warn) => lines.push(`  ${warn}`));
      }
    }

    return lines;
  };

  const validate = () => {
    const { resolutions, parseErrors } = parseResolutions();
    const validation = validateResolutions(resolutions);
    const report = generateValidationReport(parseErrors, resolutions, validation);

    tryItSetReport(TOOL_KEY, report);
    lastValidatedResolutions = resolutions;
    lastValidationResult = validation;

    if (parseErrors.length > 0) {
      updateStatus('Parse-fel hittade.');
      tryItLog(TOOL_KEY, 'ERROR', `Parse-fel: ${parseErrors.length} rader`);
      updatePreview([], parseErrors);
      return null;
    }

    if (resolutions.length === 0) {
      updateStatus('Ingen data att validera.');
      tryItLog(TOOL_KEY, 'WARN', 'Ingen data');
      updatePreview([], []);
      return null;
    }

    updatePreview(resolutions, parseErrors);

    if (validation.warnings.length > 0) {
      updateStatus(`Validering OK med ${validation.warnings.length} varning(ar).`);
      tryItLog(
        TOOL_KEY,
        'WARN',
        `${resolutions.length} värden, ${validation.warnings.length} varningar`,
      );
    } else {
      updateStatus('Validering OK.');
      tryItLog(TOOL_KEY, 'OK', `${resolutions.length} värden validerade`);
    }

    return resolutions;
  };

  const updatePreview = (resolutions, parseErrors) => {
    if (!previewDiv) return;

    if (resolutions.length === 0 && parseErrors.length === 0) {
      previewDiv.innerHTML = '<p style="padding: 1rem; color: #666;">Ingen data att visa</p>';
      return;
    }

    let html = '<table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">';
    html += '<thead><tr style="background: #f0f0f0;">';
    html += '<th style="padding: 0.5rem; text-align: left; border: 1px solid #ddd;">Index</th>';
    html +=
      '<th style="padding: 0.5rem; text-align: right; border: 1px solid #ddd;">Resolution</th>';
    html += '<th style="padding: 0.5rem; text-align: center; border: 1px solid #ddd;">Ordning</th>';
    html += '<th style="padding: 0.5rem; text-align: left; border: 1px solid #ddd;">Noter</th>';
    html += '<th style="padding: 0.5rem; text-align: center; border: 1px solid #ddd;">Åtgärd</th>';
    html += '</tr></thead><tbody>';

    resolutions.forEach((val, idx) => {
      const notes = [];
      const isDescending = idx === 0 || val < resolutions[idx - 1];

      // Check for duplicates
      const dupIdx = resolutions.indexOf(val);
      if (dupIdx !== idx) {
        notes.push(`Dubblett av index ${dupIdx}`);
      }

      // Check suspicious values
      if (val > 10000) notes.push('Ovanligt stort');
      if (val < 0.001) notes.push('Ovanligt litet');

      // Check ordering
      if (idx > 0 && val >= resolutions[idx - 1]) {
        notes.push('Inte fallande');
      }

      const rowStyle = notes.length > 0 ? 'background: #fff3cd;' : '';
      html += `<tr style="${rowStyle}">`;
      html += `<td style="padding: 0.5rem; border: 1px solid #ddd;">${idx}</td>`;
      html += `<td style="padding: 0.5rem; text-align: right; border: 1px solid #ddd; font-family: monospace;">${val}</td>`;
      html += `<td style="padding: 0.5rem; text-align: center; border: 1px solid #ddd;">${isDescending ? '↓' : '✗'}</td>`;
      html += `<td style="padding: 0.5rem; border: 1px solid #ddd; font-size: 0.8rem;">${notes.join(', ') || '—'}</td>`;
      html += `<td style="padding: 0.5rem; text-align: center; border: 1px solid #ddd;"><button class="res-send-btn" data-res-send="gridcalc" data-res-value="${val}" type="button">Använd i Gridcalc</button></td>`;
      html += '</tr>';
    });

    html += '</tbody></table>';
    previewDiv.innerHTML = html;

    // Add event delegation for send-to-gridcalc buttons
    previewDiv.querySelectorAll('[data-res-send="gridcalc"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const resValue = parseFloat(btn.dataset.resValue);

        if (isNaN(resValue) || resValue <= 0) {
          updateStatus('Ogiltigt resolutionsvärde.');
          tryItLog(TOOL_KEY, 'ERROR', `Ogiltig resolution: ${btn.dataset.resValue}`);
          return;
        }

        // Find Gridcalc inputs
        const gridcalcResolution = document.getElementById('gridcalc-resolution');
        const gridcalcScale = document.getElementById('gridcalc-scale');
        const gridcalcFromResBtn = document.querySelector(
          '[data-gridcalc-action="from-resolution"]',
        );

        if (!gridcalcResolution || !gridcalcFromResBtn) {
          updateStatus('Gridcalc-verktyg hittades inte.');
          tryItLog(TOOL_KEY, 'ERROR', 'Gridcalc element saknas');
          return;
        }

        // Set resolution value
        gridcalcResolution.value = resValue.toFixed(4);
        if (gridcalcScale) gridcalcScale.value = '';

        // Log in both tools
        tryItLog(TOOL_KEY, 'INFO', `Skickade resolution ${resValue.toFixed(4)} till Gridcalc`);
        tryItLog('gridcalc', 'INFO', `Mottog resolution ${resValue.toFixed(4)} från Resolutions`);

        // Trigger from-resolution calculation
        gridcalcFromResBtn.click();

        // Scroll to Gridcalc section
        const gridcalcSection = document.getElementById('gridcalc');
        if (gridcalcSection) {
          gridcalcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => {
            gridcalcResolution.focus();
          }, 500);
        }

        updateStatus(`Resolution ${resValue.toFixed(4)} skickad till Gridcalc.`);
      });
    });
  };

  const exportOrigo = () => {
    const { resolutions, parseErrors } = parseResolutions();

    if (parseErrors.length > 0) {
      updateStatus('Parse-fel. Validera först.');
      output.value = '';
      tryItLog(TOOL_KEY, 'ERROR', 'Export blockerad: parse-fel');
      return;
    }

    if (resolutions.length === 0) {
      updateStatus('Ingen data.');
      output.value = '';
      tryItLog(TOOL_KEY, 'WARN', 'Export blockerad: ingen data');
      return;
    }

    const json = JSON.stringify(resolutions, null, 2);
    output.value = json;
    updateStatus('Exporterad som Origo JSON.');
    tryItLog(TOOL_KEY, 'OK', `Origo JSON: ${resolutions.length} värden`);
  };

  const exportGwc = () => {
    const { resolutions, parseErrors } = parseResolutions();

    if (parseErrors.length > 0) {
      updateStatus('Parse-fel. Validera först.');
      output.value = '';
      tryItLog(TOOL_KEY, 'ERROR', 'Export blockerad: parse-fel');
      return;
    }

    if (resolutions.length === 0) {
      updateStatus('Ingen data.');
      output.value = '';
      tryItLog(TOOL_KEY, 'WARN', 'Export blockerad: ingen data');
      return;
    }

    const lines = resolutions.map((res) => `    <resolution>${res}</resolution>`).join('\n');
    const gwcXml = `  <resolutions>\n${lines}\n  </resolutions>`;
    output.value = gwcXml;
    updateStatus('Exporterad som GWC XML.');
    tryItLog(TOOL_KEY, 'OK', `GWC XML: ${resolutions.length} värden`);
  };

  const fixResolutions = () => {
    const { resolutions, parseErrors } = parseResolutions();

    if (parseErrors.length > 0) {
      updateStatus('Kan inte fixa: parse-fel finns.');
      tryItLog(TOOL_KEY, 'ERROR', 'Fix blockerad: parse-fel');
      return;
    }

    if (resolutions.length === 0) {
      updateStatus('Ingen data att fixa.');
      tryItLog(TOOL_KEY, 'WARN', 'Fix blockerad: ingen data');
      return;
    }

    // Create fixed version: sort descending and remove duplicates
    const unique = Array.from(new Set(resolutions));
    const sorted = unique.sort((a, b) => b - a);

    // Update input
    input.value = sorted.join('\n');
    updateStatus(
      `Fixad: sorterad fallande, ${resolutions.length - sorted.length} dubbletter borttagna.`,
    );
    tryItLog(TOOL_KEY, 'OK', `Lista fixad: ${resolutions.length} → ${sorted.length} värden`);

    // Re-validate
    validate();
  };

  const downloadOrigo = () => {
    if (!lastValidatedResolutions || lastValidatedResolutions.length === 0) {
      updateStatus('Validera först.');
      return;
    }

    const json = JSON.stringify(lastValidatedResolutions, null, 2);
    tryItDownload(`resolutions-origo-${Date.now()}.json`, json, 'application/json');
    updateStatus('Origo JSON nedladdad.');
    tryItLog(TOOL_KEY, 'OK', 'Origo JSON nedladdad');
  };

  const downloadGwc = () => {
    if (!lastValidatedResolutions || lastValidatedResolutions.length === 0) {
      updateStatus('Validera först.');
      return;
    }

    const lines = lastValidatedResolutions
      .map((res) => `    <resolution>${res}</resolution>`)
      .join('\n');
    const gwcXml = `  <resolutions>\n${lines}\n  </resolutions>`;
    tryItDownload(`resolutions-gwc-${Date.now()}.txt`, gwcXml, 'text/plain');
    updateStatus('GWC format nedladdat.');
    tryItLog(TOOL_KEY, 'OK', 'GWC format nedladdat');
  };

  const downloadReport = () => {
    if (!validationOutput || !validationOutput.textContent.trim()) {
      updateStatus('Ingen rapport att ladda ner. Validera först.');
      return;
    }

    let content = validationOutput.textContent;
    content += '\n\n═══ KÖRHISTORIK ═══\n\n';
    const logEl = document.getElementById('res-runlog');
    if (logEl && logEl.textContent.trim()) {
      content += logEl.textContent;
    }

    tryItDownload(`resolutions-report-${Date.now()}.txt`, content, 'text/plain');
    updateStatus('Rapport nedladdad.');
    tryItLog(TOOL_KEY, 'OK', 'Rapport nedladdad');
  };

  const clearAll = () => {
    input.value = '';
    output.value = '';
    if (validationOutput) validationOutput.textContent = '';
    if (previewDiv) previewDiv.innerHTML = '';
    updateStatus('');
    lastValidatedResolutions = null;
    lastValidationResult = null;
    tryItLog(TOOL_KEY, 'INFO', 'Formulär rensat');
  };

  // Advanced mode toggle
  if (advancedToggle) {
    advancedToggle.addEventListener('change', () => {
      const enabled = advancedToggle.checked;
      tryItShowAdvanced(TOOL_KEY, enabled);
      tryItLog(TOOL_KEY, 'INFO', `Advanced mode ${enabled ? 'aktiverad' : 'inaktiverad'}`);
    });
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.resAction;
      if (action === 'validate') {
        validate();
      } else if (action === 'export-origo') {
        exportOrigo();
      } else if (action === 'export-gwc') {
        exportGwc();
      } else if (action === 'fix') {
        fixResolutions();
      } else if (action === 'download-origo') {
        downloadOrigo();
      } else if (action === 'download-gwc') {
        downloadGwc();
      } else if (action === 'download-report') {
        downloadReport();
      } else if (action === 'clear') {
        clearAll();
      }
    });
  });

  // Initialize
  tryItLog(TOOL_KEY, 'INFO', 'Resolutions-verktyg initierat');
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

  // Enterprise elements
  const advancedToggle = block.querySelector('#gridcalc-advanced-toggle');
  const advancedPanel = block.querySelector('#gridcalc-advanced-panel');
  const reportOutput = block.querySelector('#gridcalc-validation');
  const estimatorOutput = block.querySelector('#gridcalc-estimator-output');
  const tileKbInput = block.querySelector('#gridcalc-tilekb');
  const compressionInput = block.querySelector('#gridcalc-compression');

  if (!resolution || !scale || !tile || !meta || !bboxwidth || !bboxheight || !output || !status) {
    return;
  }

  const TOOL_KEY = 'gridcalc';
  const PIXEL_SIZE_M = 0.00028;
  let lastValidationResult = null;
  let lastCalculationData = null;
  let lastEstimatorData = null;

  const updateStatus = (msg) => {
    if (status) status.textContent = msg;
  };

  const validateInputs = () => {
    const issues = [];
    const warnings = [];

    const resVal = parseFloat(resolution.value);
    const scaleVal = parseFloat(scale.value);
    const tileVal = parseFloat(tile.value);
    const metaVal = parseFloat(meta.value);
    const bboxwVal = parseFloat(bboxwidth.value);
    const bboxhVal = parseFloat(bboxheight.value);

    // Resolution
    if (isNaN(resVal) || !isFinite(resVal)) {
      issues.push('Resolution: Inte ett giltigt tal');
    } else if (resVal <= 0) {
      issues.push('Resolution: Måste vara > 0');
    } else if (resVal > 10000) {
      warnings.push(`Resolution: ${resVal} verkar ovanligt stort`);
    } else if (resVal < 0.001) {
      warnings.push(`Resolution: ${resVal} verkar ovanligt litet`);
    }

    // Scale
    if (isNaN(scaleVal) || !isFinite(scaleVal)) {
      issues.push('Scale: Inte ett giltigt tal');
    } else if (scaleVal <= 0) {
      issues.push('Scale: Måste vara > 0');
    }

    // Tile size
    if (isNaN(tileVal) || !isFinite(tileVal)) {
      issues.push('Tile Size: Inte ett giltigt tal');
    } else if (tileVal <= 0) {
      issues.push('Tile Size: Måste vara > 0');
    } else if (!Number.isInteger(tileVal)) {
      warnings.push('Tile Size: Bör vara ett heltal');
    } else if (tileVal < 128 || tileVal > 1024) {
      warnings.push(`Tile Size: ${tileVal}px utanför vanligt intervall (128-1024)`);
    }

    // Metatile
    if (isNaN(metaVal) || !isFinite(metaVal)) {
      issues.push('Metatile: Inte ett giltigt tal');
    } else if (metaVal <= 0) {
      issues.push('Metatile: Måste vara > 0');
    } else if (!Number.isInteger(metaVal)) {
      warnings.push('Metatile: Bör vara ett heltal');
    } else if (metaVal < 1 || metaVal > 16) {
      warnings.push(`Metatile: ${metaVal} utanför rekommenderat intervall (1-16)`);
    }

    // BBOX width
    if (isNaN(bboxwVal) || !isFinite(bboxwVal)) {
      issues.push('BBOX Bredd: Inte ett giltigt tal');
    } else if (bboxwVal <= 0) {
      issues.push('BBOX Bredd: Måste vara > 0');
    }

    // BBOX height
    if (isNaN(bboxhVal) || !isFinite(bboxhVal)) {
      issues.push('BBOX Höjd: Inte ett giltigt tal');
    } else if (bboxhVal <= 0) {
      issues.push('BBOX Höjd: Måste vara > 0');
    }

    // Check resolution/scale consistency
    if (issues.length === 0) {
      const expectedScale = resVal / PIXEL_SIZE_M;
      const diff = Math.abs(scaleVal - expectedScale);
      const pctDiff = (diff / expectedScale) * 100;
      if (pctDiff > 1) {
        warnings.push(`Resolution/Scale inkonsistens: ${pctDiff.toFixed(1)}% skillnad`);
      }
    }

    const valid = issues.length === 0;
    return {
      issues,
      warnings,
      valid,
      values: { resVal, scaleVal, tileVal, metaVal, bboxwVal, bboxhVal },
    };
  };

  const generateValidationReport = (validation) => {
    const lines = ['═══ VALIDERINGSRAPPORT ═══', ''];

    if (validation.issues.length > 0) {
      lines.push('Status: [ERROR] Ogiltiga värden');
      lines.push('');
      lines.push('Kritiska problem:');
      validation.issues.forEach((issue) => lines.push(`  ${issue}`));
      return lines;
    }

    const hasWarnings = validation.warnings.length > 0;
    const statusText = hasWarnings ? '[WARN] VARNINGAR' : '[OK] GILTIG';
    lines.push(`Status: ${statusText}`);
    lines.push('');

    const { resVal, scaleVal, tileVal, metaVal, bboxwVal, bboxhVal } = validation.values;
    lines.push('Input-värden:');
    lines.push(`  Resolution: ${resVal.toFixed(4)} m/px`);
    lines.push(`  Scale: 1:${scaleVal.toFixed(0)}`);
    lines.push(`  Tile Size: ${tileVal} px`);
    lines.push(`  Metatile: ${metaVal}×${metaVal}`);
    lines.push(`  BBOX: ${bboxwVal.toFixed(0)} × ${bboxhVal.toFixed(0)} m`);
    lines.push('');

    if (validation.warnings.length === 0) {
      lines.push('[OK] Alla värden inom normala intervall');
      lines.push('[OK] Resolution och Scale är konsekventa');
    } else {
      lines.push('Varningar:');
      validation.warnings.forEach((warn) => lines.push(`  ${warn}`));
    }

    return lines;
  };

  const calculate = (source = 'manual') => {
    const validation = validateInputs();
    const report = generateValidationReport(validation);
    tryItSetReport(TOOL_KEY, report);
    lastValidationResult = validation;

    if (!validation.valid) {
      updateStatus('Valideringsfel - se rapport.');
      tryItLog(TOOL_KEY, 'ERROR', `Beräkning blockerad: ${validation.issues.length} fel`);
      output.value = '';
      if (estimatorOutput) estimatorOutput.textContent = '';
      return null;
    }

    const { resVal, scaleVal, tileVal, metaVal, bboxwVal, bboxhVal } = validation.values;

    // Calculations
    const tileSpanM = resVal * tileVal;
    const metaSpanM = tileSpanM * metaVal;
    const tilesX = Math.ceil(bboxwVal / tileSpanM);
    const tilesY = Math.ceil(bboxhVal / tileSpanM);
    const totalTiles = tilesX * tilesY;
    const metatilesX = Math.ceil(bboxwVal / metaSpanM);
    const metatilesY = Math.ceil(bboxhVal / metaSpanM);
    const totalMetatiles = metatilesX * metatilesY;

    // Seed recommendation
    let seedRec = '';
    if (totalTiles < 5000) {
      seedRec = 'Seed hela området på denna zoom.';
    } else if (totalTiles <= 50000) {
      seedRec = 'Seed selektivt (prioritera kärnområde).';
    } else {
      seedRec = 'Seed bara vid behov, dela upp bbox och/eller minska zoomintervall.';
    }

    const outText = [
      `Resolution: ${resVal.toFixed(4)} m/px`,
      `Scale: 1:${scaleVal.toFixed(0)}`,
      `Tile span (${tileVal}px): ${tileSpanM.toFixed(2)} m`,
      `Meta span (${metaVal}×${metaVal}): ${metaSpanM.toFixed(2)} m`,
      `Approx tiles for bbox: ${totalTiles.toLocaleString('sv-SE')}`,
      `Rekommendation: ${seedRec}`,
    ].join('\n');

    output.value = outText;

    // Store calculation data
    lastCalculationData = {
      inputs: { resVal, scaleVal, tileVal, metaVal, bboxwVal, bboxhVal },
      derived: {
        tileSpanM,
        metaSpanM,
        tilesX,
        tilesY,
        totalTiles,
        metatilesX,
        metatilesY,
        totalMetatiles,
        seedRec,
      },
      warnings: validation.warnings,
    };
    lastEstimatorData = null;

    const warnText =
      validation.warnings.length > 0 ? ` (${validation.warnings.length} varningar)` : '';
    updateStatus(`Beräknad${warnText}.`);
    tryItLog(
      TOOL_KEY,
      validation.warnings.length > 0 ? 'WARN' : 'OK',
      `Beräkning från ${source}: ${totalTiles.toLocaleString('sv-SE')} tiles${warnText}`,
    );

    return lastCalculationData;
  };

  const estimateCache = () => {
    if (!lastCalculationData || !estimatorOutput) {
      updateStatus('Beräkna grid först.');
      tryItLog(TOOL_KEY, 'WARN', 'Cache-estimat blockerat: ingen beräkning');
      return;
    }

    const tileKb = parseFloat(tileKbInput?.value || '');
    const compressionFactor = parseFloat(compressionInput?.value || '');

    if (!Number.isFinite(tileKb) || tileKb <= 0) {
      updateStatus('Ange en giltig tilestorlek (KB).');
      tryItLog(TOOL_KEY, 'ERROR', 'Cache-estimat misslyckades: ogiltig tile KB');
      return;
    }

    const validCompression =
      Number.isFinite(compressionFactor) && compressionFactor > 0 ? compressionFactor : 1.0;

    const { tilesX, tilesY, totalTiles, metatilesX, metatilesY, totalMetatiles } =
      lastCalculationData.derived;
    const totalKB = totalTiles * tileKb * validCompression;
    const totalMB = totalKB / 1024;
    const totalGB = totalMB / 1024;

    const inputs = lastCalculationData.inputs;
    const lines = [];
    lines.push('Cache estimator report');
    lines.push('');
    lines.push('Inputs:');
    lines.push(`- Resolution: ${inputs.resVal.toFixed(4)} m/px`);
    lines.push(`- Tile size: ${inputs.tileVal} px`);
    lines.push(`- Metatile: ${inputs.metaVal}×${inputs.metaVal}`);
    lines.push(
      `- BBOX width/height: ${inputs.bboxwVal.toFixed(0)} / ${inputs.bboxhVal.toFixed(0)} m`,
    );
    lines.push('');
    lines.push('Derived:');
    lines.push(
      `- Tiles X/Y: ${tilesX.toLocaleString('sv-SE')} / ${tilesY.toLocaleString('sv-SE')}`,
    );
    lines.push(`- Total tiles: ${totalTiles.toLocaleString('sv-SE')}`);
    lines.push(
      `- Metatiles X/Y: ${metatilesX.toLocaleString('sv-SE')} / ${metatilesY.toLocaleString('sv-SE')}`,
    );
    lines.push(`- Total metatiles (seed requests): ${totalMetatiles.toLocaleString('sv-SE')}`);
    lines.push('');
    lines.push('Storage estimate:');
    lines.push(`- Avg tile size: ${tileKb} KB`);
    lines.push(`- Compression factor: ${validCompression}`);
    if (totalGB >= 1) {
      lines.push(`- Estimated size: ${totalMB.toFixed(2)} MB / ${totalGB.toFixed(2)} GB`);
    } else {
      lines.push(`- Estimated size: ${totalMB.toFixed(2)} MB`);
    }
    lines.push('');
    lines.push('Assumptions:');
    lines.push('- Constant tile size');
    lines.push('- No deduplication');
    lines.push('- No empty-tile skipping');

    estimatorOutput.textContent = lines.join('\n');

    lastEstimatorData = {
      tileKb,
      compressionFactor: validCompression,
      totalKB,
      totalMB,
      totalGB,
      estimatedRequests: totalMetatiles,
    };

    updateStatus('Cache-estimat klart.');
    tryItLog(TOOL_KEY, 'OK', 'Cache-estimat beräknat');
  };

  const fromResolution = () => {
    const resVal = parseFloat(resolution.value);
    if (isNaN(resVal) || resVal <= 0) {
      updateStatus('Resolution måste vara ett tal > 0.');
      tryItLog(TOOL_KEY, 'ERROR', 'Från Resolution: ogiltig resolution');
      return;
    }
    const scaleVal = resVal / PIXEL_SIZE_M;
    scale.value = scaleVal.toFixed(0);
    calculate('resolution');
  };

  const fromScale = () => {
    const scaleVal = parseFloat(scale.value);
    if (isNaN(scaleVal) || scaleVal <= 0) {
      updateStatus('Scale måste vara ett tal > 0.');
      tryItLog(TOOL_KEY, 'ERROR', 'Från Scale: ogiltig scale');
      return;
    }
    const resVal = scaleVal * PIXEL_SIZE_M;
    resolution.value = resVal.toFixed(4);
    calculate('scale');
  };

  const setPreset = () => {
    resolution.value = '100';
    scale.value = (100 / PIXEL_SIZE_M).toFixed(0);
    tile.value = '256';
    meta.value = '4';
    bboxwidth.value = '100000';
    bboxheight.value = '100000';
    if (tileKbInput) tileKbInput.value = '20';
    if (compressionInput) compressionInput.value = '1.0';
    output.value = '';
    if (reportOutput) reportOutput.textContent = '';
    if (estimatorOutput) estimatorOutput.textContent = '';
    updateStatus('');
    tryItLog(TOOL_KEY, 'INFO', 'Preset applicerad (256/4×4)');
    calculate('preset');
  };

  const copyOutput = async () => {
    const text = output.value.trim();
    if (!text) {
      updateStatus('Beräkna först.');
      tryItLog(TOOL_KEY, 'WARN', 'Kopiera blockerad: ingen data');
      return;
    }
    try {
      await copyText(text);
      updateStatus('Kopierat.');
      tryItLog(TOOL_KEY, 'OK', 'Resultat kopierat');
    } catch (error) {
      updateStatus('Kunde inte kopiera.');
      tryItLog(TOOL_KEY, 'ERROR', 'Kopiera misslyckades');
    }
  };

  const clearAll = () => {
    resolution.value = '100';
    scale.value = (100 / PIXEL_SIZE_M).toFixed(0);
    tile.value = '256';
    meta.value = '4';
    bboxwidth.value = '100000';
    bboxheight.value = '100000';
    if (tileKbInput) tileKbInput.value = '20';
    if (compressionInput) compressionInput.value = '1.0';
    output.value = '';
    if (reportOutput) reportOutput.textContent = '';
    if (estimatorOutput) estimatorOutput.textContent = '';
    updateStatus('');
    lastValidationResult = null;
    lastCalculationData = null;
    lastEstimatorData = null;
    tryItLog(TOOL_KEY, 'INFO', 'Formulär rensat');
  };

  const downloadTxt = () => {
    if (!lastCalculationData) {
      updateStatus('Beräkna först.');
      return;
    }

    const lines = [];
    lines.push('═══ GRIDCALC RAPPORT ═══');
    lines.push('');
    lines.push('INPUT:');
    const inp = lastCalculationData.inputs;
    lines.push(`  Resolution: ${inp.resVal.toFixed(4)} m/px`);
    lines.push(`  Scale: 1:${inp.scaleVal.toFixed(0)}`);
    lines.push(`  Tile Size: ${inp.tileVal} px`);
    lines.push(`  Metatile: ${inp.metaVal}×${inp.metaVal}`);
    lines.push(`  BBOX: ${inp.bboxwVal.toFixed(0)} × ${inp.bboxhVal.toFixed(0)} m`);
    lines.push('');
    lines.push('BERÄKNADE VÄRDEN:');
    const der = lastCalculationData.derived;
    lines.push(`  Tile span: ${der.tileSpanM.toFixed(2)} m`);
    lines.push(`  Metatile span: ${der.metaSpanM.toFixed(2)} m`);
    lines.push(`  Tiles X: ${der.tilesX.toLocaleString('sv-SE')}`);
    lines.push(`  Tiles Y: ${der.tilesY.toLocaleString('sv-SE')}`);
    lines.push(`  Total tiles: ${der.totalTiles.toLocaleString('sv-SE')}`);
    lines.push(`  Metatiles X: ${der.metatilesX.toLocaleString('sv-SE')}`);
    lines.push(`  Metatiles Y: ${der.metatilesY.toLocaleString('sv-SE')}`);
    lines.push(`  Total metatiles: ${der.totalMetatiles.toLocaleString('sv-SE')}`);
    lines.push(`  Rekommendation: ${der.seedRec}`);

    if (lastCalculationData.warnings.length > 0) {
      lines.push('');
      lines.push('VARNINGAR:');
      lastCalculationData.warnings.forEach((w) => lines.push(`  ${w}`));
    }

    if (lastEstimatorData) {
      lines.push('');
      lines.push('CACHE / SEED ESTIMATOR:');
      lines.push(`  Avg tile size: ${lastEstimatorData.tileKb} KB`);
      lines.push(`  Compression factor: ${lastEstimatorData.compressionFactor}`);
      lines.push(`  Estimated size: ${lastEstimatorData.totalMB.toFixed(2)} MB`);
      if (lastEstimatorData.totalGB >= 1) {
        lines.push(`  Estimated size (GB): ${lastEstimatorData.totalGB.toFixed(2)} GB`);
      }
      lines.push(
        `  Estimated requests: ${lastEstimatorData.estimatedRequests.toLocaleString('sv-SE')}`,
      );
    }

    if (reportOutput && reportOutput.textContent.trim()) {
      lines.push('');
      lines.push('═══ VALIDERINGSRAPPORT ═══');
      lines.push('');
      lines.push(reportOutput.textContent);
    }

    const content = lines.join('\n');
    tryItDownload(`gridcalc-${Date.now()}.txt`, content, 'text/plain');
    updateStatus('TXT nedladdat.');
    tryItLog(TOOL_KEY, 'OK', 'TXT-rapport nedladdad');
  };

  const downloadJson = () => {
    if (!lastCalculationData) {
      updateStatus('Beräkna först.');
      return;
    }

    const jsonData = {
      inputs: lastCalculationData.inputs,
      derived: lastCalculationData.derived,
      warnings: lastCalculationData.warnings,
      estimator: lastEstimatorData,
      timestamp: new Date().toISOString(),
    };

    const content = JSON.stringify(jsonData, null, 2);
    tryItDownload(`gridcalc-${Date.now()}.json`, content, 'application/json');
    updateStatus('JSON nedladdat.');
    tryItLog(TOOL_KEY, 'OK', 'JSON nedladdat');
  };

  // Advanced mode toggle
  if (advancedToggle) {
    advancedToggle.addEventListener('change', () => {
      const enabled = advancedToggle.checked;
      tryItShowAdvanced(TOOL_KEY, enabled);
      tryItLog(TOOL_KEY, 'INFO', `Advanced mode ${enabled ? 'aktiverad' : 'inaktiverad'}`);
    });
  }

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
      } else if (action === 'download-txt') {
        downloadTxt();
      } else if (action === 'download-json') {
        downloadJson();
      } else if (action === 'estimate-cache') {
        estimateCache();
      } else if (action === 'clear') {
        clearAll();
      }
    });
  });

  // Initialize
  tryItLog(TOOL_KEY, 'INFO', 'Gridcalc-verktyg initierat');
  calculate('initial');
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

  // Enterprise mode elements
  const advancedToggle = block.querySelector('#bbox-advanced-toggle');
  const advancedPanel = block.querySelector('#bbox-advanced-panel');
  const validationOutput = block.querySelector('#bbox-validation');
  const runLogOutput = block.querySelector('#bbox-runlog');
  const normalizedOutput = block.querySelector('#bbox-normalized');

  if (
    !base ||
    !layer ||
    !format ||
    !width ||
    !height ||
    !minx ||
    !maxx ||
    !miny ||
    !maxy ||
    !output ||
    !urlOutput ||
    !status
  ) {
    return;
  }

  // CRS constant for this BBOX tool
  const BBOX_CRS = 'EPSG:3008';

  const presets = {
    'preset-1': { minx: 100000, miny: 6400000, maxx: 200000, maxy: 6500000 },
    'preset-2': { minx: 200000, miny: 6500000, maxx: 350000, maxy: 6650000 },
    'preset-3': { minx: 350000, miny: 6650000, maxx: 500000, maxy: 6800000 },
  };

  // Run log storage
  let runLog = [];
  let hasGenerated = false;

  const addToRunLog = (message) => {
    const timestamp = new Date().toLocaleTimeString('sv-SE');
    runLog.push(`[${timestamp}] ${message}`);
    if (runLog.length > 20) runLog.shift(); // Keep last 20 entries
    if (runLogOutput) {
      runLogOutput.textContent = runLog.join('\n');
      runLogOutput.scrollTop = runLogOutput.scrollHeight;
    }
  };

  const updateStatus = (message) => {
    if (status) {
      status.textContent = message;
    }
  };

  const updateValidationReport = (bbox, issues = []) => {
    if (!validationOutput) return;

    let report = '═══ VALIDATION REPORT ═══\n\n';

    if (bbox) {
      const width = bbox.maxx - bbox.minx;
      const height = bbox.maxy - bbox.miny;
      const area = width * height;
      const aspectRatio = (width / height).toFixed(3);

      report += `Status: ${issues.length === 0 ? '[OK] VALID' : '[WARN] WARNINGS'}\n\n`;
      report += `Dimensions:\n`;
      report += `  Width:  ${width.toLocaleString('sv-SE')} m\n`;
      report += `  Height: ${height.toLocaleString('sv-SE')} m\n`;
      report += `  Area:   ${area.toLocaleString('sv-SE')} m²\n`;
      report += `  Aspect: ${aspectRatio}\n\n`;

      report += `Bounds:\n`;
      report += `  X: ${bbox.minx.toLocaleString('sv-SE')} → ${bbox.maxx.toLocaleString('sv-SE')}\n`;
      report += `  Y: ${bbox.miny.toLocaleString('sv-SE')} → ${bbox.maxy.toLocaleString('sv-SE')}\n\n`;

      // Transparent rule messages
      if (issues.length > 0) {
        report += `Issues:\n`;
        issues.forEach((issue, i) => {
          report += `  ${i + 1}. ${issue}\n`;
        });
      } else {
        report += `[OK] No issues detected\n`;
        report += `[OK] Coordinates within valid range\n`;
        report += `[OK] Min < Max for both axes\n`;
      }
    } else {
      report += `Status: [ERROR] INVALID\n\n`;
      report += `Unable to validate BBOX.\n`;
      if (issues.length > 0) {
        report += `\nErrors:\n`;
        issues.forEach((issue, i) => {
          report += `  ${i + 1}. ${issue}\n`;
        });
      }
    }

    validationOutput.textContent = report;
  };

  const updateNormalizedBbox = (bbox) => {
    if (!normalizedOutput || !bbox) return;

    let normalized = '{\n';
    normalized += `  "minx": ${bbox.minx},\n`;
    normalized += `  "miny": ${bbox.miny},\n`;
    normalized += `  "maxx": ${bbox.maxx},\n`;
    normalized += `  "maxy": ${bbox.maxy},\n`;
    normalized += `  "crs": "${BBOX_CRS}",\n`;
    normalized += `  "width": ${bbox.maxx - bbox.minx},\n`;
    normalized += `  "height": ${bbox.maxy - bbox.miny}\n`;
    normalized += '}';

    normalizedOutput.value = normalized;
  };

  const validateBbox = () => {
    const minxVal = parseFloat(minx.value);
    const maxxVal = parseFloat(maxx.value);
    const minyVal = parseFloat(miny.value);
    const maxyVal = parseFloat(maxy.value);

    const issues = [];

    if (isNaN(minxVal) || isNaN(maxxVal) || isNaN(minyVal) || isNaN(maxyVal)) {
      issues.push('Alla koordinater måste vara tal.');
      updateValidationReport(null, issues);
      updateStatus('Alla koordinater måste vara tal.');
      return null;
    }

    if (minxVal >= maxxVal) {
      issues.push('Min X måste vara mindre än Max X.');
    }

    if (minyVal >= maxyVal) {
      issues.push('Min Y måste vara mindre än Max Y.');
    }

    if (minxVal < 0 || maxxVal > 1500000) {
      issues.push('X-värden måste ligga mellan 0 och 1,500,000.');
    }

    if (minyVal < 5500000 || maxyVal > 8000000) {
      issues.push('Y-värden måste ligga mellan 5,500,000 och 8,000,000.');
    }

    const bbox = { minx: minxVal, maxx: maxxVal, miny: minyVal, maxy: maxyVal };

    if (issues.length > 0) {
      updateValidationReport(bbox, issues);
      updateStatus(issues[0]);
      return null;
    }

    updateValidationReport(bbox, []);
    return bbox;
  };

  const generate = () => {
    const bbox = validateBbox();
    if (!bbox) {
      output.value = '';
      urlOutput.value = '';
      updateNormalizedBbox(null);
      addToRunLog('[ERROR] Generering misslyckades: Ogiltig BBOX');
      return;
    }

    const bboxStr = `${bbox.minx},${bbox.miny},${bbox.maxx},${bbox.maxy}`;
    output.value = bboxStr;
    hasGenerated = true;
    updateNormalizedBbox(bbox);

    const baseValue = base.value.trim();
    if (!baseValue) {
      updateStatus('Fyll i en bas‑URL för WMS-anropet.');
      urlOutput.value = '';
      addToRunLog('[WARN] Generering delvis: BBOX skapad, men ingen URL (saknar bas-URL)');
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
      params.set('srs', BBOX_CRS);

      url.search = params.toString();
      urlOutput.value = url.toString();
      updateStatus('Klar.');
      addToRunLog(`[OK] Genererad: ${bboxStr}`);
    } catch (error) {
      updateStatus('Ogiltig bas‑URL.');
      urlOutput.value = '';
      addToRunLog('[ERROR] Generering misslyckades: Ogiltig bas-URL');
    }
  };

  const setBboxPreset = (preset) => {
    minx.value = preset.minx;
    miny.value = preset.miny;
    maxx.value = preset.maxx;
    maxy.value = preset.maxy;
    hasGenerated = false;
    output.value = '';
    urlOutput.value = '';
    updateNormalizedBbox(null);
    updateValidationReport(null, []);
    updateStatus('');
    addToRunLog(
      `[OK] Preset laddad: X[${preset.minx}-${preset.maxx}] Y[${preset.miny}-${preset.maxy}]`,
    );
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
      addToRunLog('[OK] BBOX kopierad till clipboard');
    } catch (error) {
      updateStatus('Kunde inte kopiera.');
      addToRunLog('[ERROR] Kopiering misslyckades');
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
      addToRunLog('[OK] WMS URL kopierad till clipboard');
    } catch (error) {
      updateStatus('Kunde inte kopiera.');
      addToRunLog('[ERROR] Kopiering misslyckades');
    }
  };

  const exportGeoJSON = () => {
    const bbox = validateBbox();
    if (!bbox) {
      updateStatus('Generera en giltig BBOX först.');
      return;
    }

    const geojson = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { name: BBOX_CRS },
      },
      features: [
        {
          type: 'Feature',
          properties: {
            name: 'BBOX Area',
            minx: bbox.minx,
            miny: bbox.miny,
            maxx: bbox.maxx,
            maxy: bbox.maxy,
            width: bbox.maxx - bbox.minx,
            height: bbox.maxy - bbox.miny,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [bbox.minx, bbox.miny],
                [bbox.maxx, bbox.miny],
                [bbox.maxx, bbox.maxy],
                [bbox.minx, bbox.maxy],
                [bbox.minx, bbox.miny],
              ],
            ],
          },
        },
      ],
    };

    const jsonStr = JSON.stringify(geojson, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bbox_${Date.now()}.geojson`;
    a.click();
    URL.revokeObjectURL(url);

    updateStatus('GeoJSON exporterad.');
    addToRunLog('[OK] GeoJSON exporterad');
  };

  const exportTXT = () => {
    const bbox = validateBbox();
    if (!bbox) {
      updateStatus('Generera en giltig BBOX först.');
      return;
    }

    const bboxStr = output.value.trim();
    const urlStr = urlOutput.value.trim();
    const normalizedStr = normalizedOutput ? normalizedOutput.value : '';

    let txtContent = '═══ BBOX EXPORT ═══\n\n';
    txtContent += `Generated: ${new Date().toLocaleString('sv-SE')}\n`;
    txtContent += `CRS: ${BBOX_CRS} (SWEREF 99 13 30)\n\n`;

    txtContent += '─── BBOX String ───\n';
    txtContent += `${bboxStr}\n\n`;

    if (normalizedStr) {
      txtContent += '─── Normalized ───\n';
      txtContent += `${normalizedStr}\n\n`;
    }

    if (urlStr) {
      txtContent += '─── WMS GetMap URL ───\n';
      txtContent += `${urlStr}\n\n`;
    }

    txtContent += '─── Details ───\n';
    txtContent += `Layer: ${layer.value}\n`;
    txtContent += `Format: ${format.value}\n`;
    txtContent += `Size: ${width.value}x${height.value}px\n`;
    txtContent += `Width: ${(bbox.maxx - bbox.minx).toLocaleString('sv-SE')} m\n`;
    txtContent += `Height: ${(bbox.maxy - bbox.miny).toLocaleString('sv-SE')} m\n`;

    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bbox_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    updateStatus('TXT-fil exporterad.');
    addToRunLog('[OK] TXT-fil exporterad');
  };

  const sendToGridcalc = () => {
    const minxVal = parseFloat(minx.value);
    const maxxVal = parseFloat(maxx.value);
    const minyVal = parseFloat(miny.value);
    const maxyVal = parseFloat(maxy.value);

    if (![minxVal, maxxVal, minyVal, maxyVal].every((val) => Number.isFinite(val))) {
      updateStatus('Alla koordinater måste vara tal.');
      updateValidationReport(null, ['Alla koordinater måste vara tal.']);
      addToRunLog('[ERROR] Skicka till Gridcalc misslyckades: Ogiltiga koordinater');
      return;
    }

    const swappedX = minxVal > maxxVal;
    const swappedY = minyVal > maxyVal;
    const minxNorm = Math.min(minxVal, maxxVal);
    const maxxNorm = Math.max(minxVal, maxxVal);
    const minyNorm = Math.min(minyVal, maxyVal);
    const maxyNorm = Math.max(minyVal, maxyVal);

    if (swappedX || swappedY) {
      updateStatus('Min/Max omkastade - använder normaliserade värden.');
      addToRunLog('[WARN] Min/Max omkastade - använder normaliserade värden');
      if (!hasGenerated) {
        addToRunLog('[WARN] Inga fält ändrades (klicka Generera för att normalisera)');
      }
    }

    const bboxWidth = Math.abs(maxxNorm - minxNorm);
    const bboxHeight = Math.abs(maxyNorm - minyNorm);

    const gridcalcWidth = document.getElementById('gridcalc-bboxwidth');
    const gridcalcHeight = document.getElementById('gridcalc-bboxheight');
    const gridcalcResolution = document.getElementById('gridcalc-resolution');
    const gridcalcScale = document.getElementById('gridcalc-scale');
    const fromResolutionBtn = document.querySelector('[data-gridcalc-action="from-resolution"]');
    const fromScaleBtn = document.querySelector('[data-gridcalc-action="from-scale"]');

    if (gridcalcWidth) gridcalcWidth.value = Math.round(bboxWidth).toString();
    if (gridcalcHeight) gridcalcHeight.value = Math.round(bboxHeight).toString();

    addToRunLog('[INFO] Sent bbox width/height to Gridcalc');
    if (typeof window.tryItLog === 'function') {
      window.tryItLog('gridcalc', 'INFO', 'Received bbox width/height from BBOX tool');
    }

    if (gridcalcResolution && gridcalcResolution.value.trim() && fromResolutionBtn) {
      fromResolutionBtn.click();
    } else if (gridcalcScale && gridcalcScale.value.trim() && fromScaleBtn) {
      fromScaleBtn.click();
    } else {
      updateStatus('Skickade BBOX-bredd/höjd. Ange resolution eller scale för beräkning.');
    }

    const gridcalcSection = document.getElementById('gridcalc');
    if (gridcalcSection) {
      gridcalcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (gridcalcWidth) gridcalcWidth.focus();
  };

  const clearBbox = () => {
    minx.value = '100000';
    miny.value = '6400000';
    maxx.value = '200000';
    maxy.value = '6500000';
    hasGenerated = false;
    output.value = '';
    urlOutput.value = '';
    if (normalizedOutput) normalizedOutput.value = '';
    if (validationOutput) validationOutput.textContent = '';
    updateStatus('');
    addToRunLog('[OK] Formulär rensat');
  };

  // Advanced mode toggle
  if (advancedToggle && advancedPanel) {
    advancedToggle.addEventListener('change', () => {
      advancedPanel.style.display = advancedToggle.checked ? 'block' : 'none';
      addToRunLog(`[OK] Advanced mode ${advancedToggle.checked ? 'aktiverad' : 'inaktiverad'}`);
    });
  }

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
      } else if (action === 'export-geojson') {
        exportGeoJSON();
      } else if (action === 'export-txt') {
        exportTXT();
      } else if (action === 'send-to-urlbuilder') {
        const bboxText = output.value.trim();
        if (!bboxText) {
          updateStatus('Generera en BBOX först.');
          return;
        }

        const urlBbox = document.getElementById('urlbuilder-bbox');
        const urlCrs = document.getElementById('urlbuilder-crs');

        if (urlBbox) urlBbox.value = bboxText;
        if (urlCrs) urlCrs.value = BBOX_CRS;

        updateStatus('Skickade BBOX till URL builder.');
        addToRunLog('[OK] Skickad till URL builder');
        const target =
          document.getElementById('url-builder') || document.getElementById('urlbuilder-base');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (action === 'send-to-gridcalc') {
        sendToGridcalc();
      } else if (action === 'clear') {
        clearBbox();
      }
    });
  });

  // Initialize run log
  addToRunLog('[OK] BBOX verktyg initierat');
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
    const r = size / 2 || 8;

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
      summary.textContent =
        'Ingen PointSymbolizer, LineSymbolizer eller PolygonSymbolizer hittades.';
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

const initTryIt = () => {
  const tryItBlocks = document.querySelectorAll('[data-tryit]');
  if (!tryItBlocks.length) {
    return;
  }

  // ═══════════════════════════════════════════════════════════════
  // TryIt Enterprise Toolkit
  // ═══════════════════════════════════════════════════════════════
  const tryItLogs = {};

  window.tryItLog = (toolKey, level, message) => {
    if (!tryItLogs[toolKey]) tryItLogs[toolKey] = [];
    const timestamp = new Date().toLocaleTimeString('sv-SE');
    const prefix = `[${timestamp}] [${level}]`;
    tryItLogs[toolKey].push(`${prefix} ${message}`);
    if (tryItLogs[toolKey].length > 20) tryItLogs[toolKey].shift();

    const logEl = document.getElementById(`${toolKey}-runlog`);
    if (logEl) {
      logEl.textContent = tryItLogs[toolKey].join('\n');
      logEl.scrollTop = logEl.scrollHeight;
    }
  };

  window.tryItSetReport = (toolKey, lines) => {
    const reportEl = document.getElementById(`${toolKey}-validation`);
    if (reportEl) {
      reportEl.textContent = lines.join('\n');
    }
  };

  window.tryItCopy = async (text) => {
    try {
      await copyText(text);
      return true;
    } catch (error) {
      return false;
    }
  };

  window.tryItDownload = (filename, content, mime = 'text/plain') => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  window.tryItShowAdvanced = (toolKey, enabled) => {
    const panel = document.getElementById(`${toolKey}-advanced-panel`);
    if (panel) {
      panel.style.display = enabled ? 'block' : 'none';
    }
  };
  // ═══════════════════════════════════════════════════════════════

  const updateStatus = (element, message) => {
    if (element) {
      element.textContent = message;
    }
  };

  const initJsonTryIt = (block) => {
    const input = block.querySelector('#json-tryit-input');
    const output = block.querySelector('#json-tryit-output');
    const status = block.querySelector('#json-tryit-status');
    const reportOutput = block.querySelector('#json-validation');
    const logOutput = block.querySelector('#json-runlog');
    const metaOutput = block.querySelector('#json-meta');
    const advancedToggle = block.querySelector('#json-advanced-toggle');
    const advancedPanel = block.querySelector('#json-advanced-panel');
    const buttons = block.querySelectorAll('[data-json-action]');

    if (!input || !output || !status || !buttons.length) {
      return;
    }

    const runLog = [];
    let lastValidation = null;

    const addToRunLog = (action, level, message = '') => {
      const ts = new Date().toLocaleTimeString('sv-SE');
      const msg = message ? `${message}` : '';
      const line = `[${ts}] [${level}] ${action} ${msg}`.trim();
      runLog.push(line);
      if (runLog.length > 20) runLog.shift();
      if (logOutput) logOutput.textContent = runLog.join('\n');
    };

    const setOutput = (value) => {
      output.textContent = value;
    };

    const setReport = (value) => {
      if (reportOutput) reportOutput.textContent = value;
    };

    const setMeta = (value) => {
      if (metaOutput) metaOutput.textContent = value;
    };

    const updateStatusText = (msg) => {
      if (status) status.textContent = msg;
    };

    const extractBbox = (geometry) => {
      let minx = Infinity;
      let miny = Infinity;
      let maxx = -Infinity;
      let maxy = -Infinity;
      let pointCount = 0;

      const processPoint = (coord) => {
        if (Array.isArray(coord) && coord.length >= 2) {
          const [x, y] = coord;
          if (typeof x === 'number' && typeof y === 'number') {
            minx = Math.min(minx, x);
            miny = Math.min(miny, y);
            maxx = Math.max(maxx, x);
            maxy = Math.max(maxy, y);
            pointCount++;
          }
        }
      };

      const processCoordinates = (coords, depth) => {
        if (!Array.isArray(coords)) return;
        if (depth === 0) {
          processPoint(coords);
        } else {
          coords.forEach((c) => processCoordinates(c, depth - 1));
        }
      };

      const walkGeometry = (geom) => {
        if (!geom || !geom.type) return;

        if (geom.type === 'GeometryCollection' && Array.isArray(geom.geometries)) {
          geom.geometries.forEach((g) => walkGeometry(g));
          return;
        }

        if (!geom.coordinates) return;

        switch (geom.type) {
          case 'Point':
            processCoordinates(geom.coordinates, 0);
            break;
          case 'MultiPoint':
          case 'LineString':
            processCoordinates(geom.coordinates, 1);
            break;
          case 'MultiLineString':
          case 'Polygon':
            processCoordinates(geom.coordinates, 2);
            break;
          case 'MultiPolygon':
            processCoordinates(geom.coordinates, 3);
            break;
          default:
            break;
        }
      };

      walkGeometry(geometry);

      if (pointCount === 0) {
        return null;
      }

      return { minx, miny, maxx, maxy, pointCount };
    };

    const analyzeGeoJson = (obj) => {
      const result = {
        isGeoJson: false,
        type: null,
        featureCount: 0,
        geometryTypes: new Set(),
        bbox: null,
        warnings: [],
      };

      if (!obj || typeof obj !== 'object') {
        return result;
      }

      const collectGeometryTypes = (geom) => {
        if (geom && geom.type) {
          result.geometryTypes.add(geom.type);
          if (geom.type === 'GeometryCollection' && Array.isArray(geom.geometries)) {
            geom.geometries.forEach((g) => collectGeometryTypes(g));
          }
        }
      };

      if (obj.type === 'FeatureCollection' && Array.isArray(obj.features)) {
        result.isGeoJson = true;
        result.type = 'FeatureCollection';
        result.featureCount = obj.features.length;

        const allGeometries = [];
        obj.features.forEach((f) => {
          if (f.geometry) {
            collectGeometryTypes(f.geometry);
            allGeometries.push(f.geometry);
          }
        });

        let combinedBbox = null;
        allGeometries.forEach((geom) => {
          const bbox = extractBbox(geom);
          if (bbox) {
            if (!combinedBbox) {
              combinedBbox = bbox;
            } else {
              combinedBbox.minx = Math.min(combinedBbox.minx, bbox.minx);
              combinedBbox.miny = Math.min(combinedBbox.miny, bbox.miny);
              combinedBbox.maxx = Math.max(combinedBbox.maxx, bbox.maxx);
              combinedBbox.maxy = Math.max(combinedBbox.maxy, bbox.maxy);
              combinedBbox.pointCount += bbox.pointCount;
            }
          }
        });
        result.bbox = combinedBbox;
      } else if (obj.type === 'Feature' && obj.geometry) {
        result.isGeoJson = true;
        result.type = 'Feature';
        result.featureCount = 1;
        collectGeometryTypes(obj.geometry);
        result.bbox = extractBbox(obj.geometry);
      } else if (
        obj.type &&
        [
          'Point',
          'LineString',
          'Polygon',
          'MultiPoint',
          'MultiLineString',
          'MultiPolygon',
          'GeometryCollection',
        ].includes(obj.type)
      ) {
        result.isGeoJson = true;
        result.type = obj.type;
        collectGeometryTypes(obj);
        result.bbox = extractBbox(obj);
      }

      if (result.bbox) {
        const { minx, miny, maxx, maxy } = result.bbox;
        if (Math.abs(miny) > 90 || Math.abs(maxy) > 90) {
          if (Math.abs(minx) <= 90 && Math.abs(maxx) <= 90) {
            result.warnings.push('Koordinater kan vara omvända (lat/lon istället för lon/lat).');
          }
        }
      } else if (result.isGeoJson) {
        result.warnings.push('Inga koordinater hittade.');
      }

      return result;
    };

    const generateReport = (parsed, analysis) => {
      const lines = ['═══ VALIDERINGSRAPPORT ═══', ''];

      const rootType = Array.isArray(parsed)
        ? 'Array'
        : typeof parsed === 'object'
          ? 'Object'
          : typeof parsed;
      lines.push(`Rottyp: ${rootType}`);

      lines.push(`GeoJSON: ${analysis.isGeoJson ? '[OK] Ja' : 'Nej'}`);

      if (analysis.isGeoJson) {
        lines.push(`Typ: ${analysis.type}`);
        if (analysis.featureCount > 0) {
          lines.push(`Features: ${analysis.featureCount}`);
        }
        if (analysis.geometryTypes.size > 0) {
          lines.push(`Geometrytyper: ${Array.from(analysis.geometryTypes).join(', ')}`);
        }
        if (analysis.bbox) {
          const { minx, miny, maxx, maxy, pointCount } = analysis.bbox;
          lines.push(
            `BBOX: [OK] ${minx.toFixed(6)},${miny.toFixed(6)},${maxx.toFixed(6)},${maxy.toFixed(6)}`,
          );
          lines.push(`Punkter analyserade: ${pointCount}`);
        } else {
          lines.push('BBOX: [WARN] Inga koordinater');
        }
        lines.push('CRS: [INFO] GeoJSON standard är EPSG:4326 om inte angivet');
      }

      if (analysis.warnings.length > 0) {
        lines.push('');
        lines.push('Varningar:');
        analysis.warnings.forEach((w) => lines.push(`  [WARN] ${w}`));
      }

      return lines.join('\n');
    };

    const generateMeta = (analysis) => {
      if (!analysis.bbox) return 'Ingen BBOX tillgänglig.';

      const { minx, miny, maxx, maxy, pointCount } = analysis.bbox;
      const lines = [
        `minx: ${minx.toFixed(6)}`,
        `miny: ${miny.toFixed(6)}`,
        `maxx: ${maxx.toFixed(6)}`,
        `maxy: ${maxy.toFixed(6)}`,
        `punkter: ${pointCount}`,
      ];
      return lines.join('\n');
    };

    const validateJson = () => {
      const raw = input.value.trim();

      if (!raw) {
        setOutput('');
        setReport('Ingen input.');
        setMeta('');
        updateStatusText('Ange JSON att validera.');
        addToRunLog('VALIDATE', 'WARN', 'Ingen input');
        lastValidation = null;
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        const analysis = analyzeGeoJson(parsed);

        setOutput(JSON.stringify(parsed, null, 2));
        setReport(generateReport(parsed, analysis));
        setMeta(generateMeta(analysis));
        updateStatusText('JSON är giltig.');
        addToRunLog('VALIDATE', 'OK', `GeoJSON: ${analysis.isGeoJson ? 'ja' : 'nej'}`);

        lastValidation = { parsed, analysis };
      } catch (error) {
        setOutput('');
        setReport(`[ERROR] Parse-fel\n\n${error.message}`);
        setMeta('');
        updateStatusText('Ogiltig JSON.');
        addToRunLog('VALIDATE', 'ERROR', 'Parse-fel');
        lastValidation = null;
      }
    };

    const prettifyJson = () => {
      const raw = input.value.trim();
      if (!raw) {
        updateStatusText('Fyll i JSON att prettify.');
        addToRunLog('PRETTIFY', 'WARN', 'Ingen input');
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        const pretty = JSON.stringify(parsed, null, 2);
        input.value = pretty;
        setOutput(pretty);
        updateStatusText('JSON prettify klar.');
        addToRunLog('PRETTIFY', 'OK');
      } catch (error) {
        setOutput('');
        updateStatusText('Ogiltig JSON.');
        addToRunLog('PRETTIFY', 'ERROR', 'Parse-fel');
      }
    };

    const minifyJson = () => {
      const raw = input.value.trim();
      if (!raw) {
        updateStatusText('Fyll i JSON att minify.');
        addToRunLog('MINIFY', 'WARN', 'Ingen input');
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        const minified = JSON.stringify(parsed);
        input.value = minified;
        setOutput(minified);
        updateStatusText('JSON minify klar.');
        addToRunLog('MINIFY', 'OK');
      } catch (error) {
        setOutput('');
        updateStatusText('Ogiltig JSON.');
        addToRunLog('MINIFY', 'ERROR', 'Parse-fel');
      }
    };

    const copyJson = async () => {
      const text = output.textContent || input.value;
      if (!text.trim()) {
        updateStatusText('Inget att kopiera.');
        addToRunLog('COPY', 'WARN', 'Tomt innehåll');
        return;
      }
      try {
        await copyText(text);
        updateStatusText('Kopierat till urklipp.');
        addToRunLog('COPY', 'OK');
      } catch (error) {
        updateStatusText('Kunde inte kopiera.');
        addToRunLog('COPY', 'ERROR');
      }
    };

    const clearJson = () => {
      input.value = '';
      setOutput('');
      setReport('');
      setMeta('');
      updateStatusText('');
      lastValidation = null;
      runLog.length = 0;
      if (logOutput) logOutput.textContent = '';
      addToRunLog('CLEAR', 'OK');
    };

    const exportJson = () => {
      if (!lastValidation) {
        addToRunLog('EXPORT-JSON', 'WARN', 'Ingen validerad data');
        return;
      }

      const json = JSON.stringify(lastValidation.parsed, null, 2);
      if (window.tryItDownload) {
        window.tryItDownload('data.json', json, 'application/json');
      } else {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        URL.revokeObjectURL(url);
      }
      addToRunLog('EXPORT-JSON', 'OK', 'data.json');
    };

    const exportBboxTxt = () => {
      if (!lastValidation || !lastValidation.analysis.bbox) {
        addToRunLog('EXPORT-BBOX-TXT', 'WARN', 'Ingen BBOX');
        return;
      }

      const { minx, miny, maxx, maxy } = lastValidation.analysis.bbox;
      const txt = `${minx},${miny},${maxx},${maxy}`;
      if (window.tryItDownload) {
        window.tryItDownload('bbox.txt', txt, 'text/plain');
      } else {
        const blob = new Blob([txt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bbox.txt';
        a.click();
        URL.revokeObjectURL(url);
      }
      addToRunLog('EXPORT-BBOX-TXT', 'OK', 'bbox.txt');
    };

    const exportBboxGeoJson = () => {
      if (!lastValidation || !lastValidation.analysis.bbox) {
        addToRunLog('EXPORT-BBOX-GEOJSON', 'WARN', 'Ingen BBOX');
        return;
      }

      const { minx, miny, maxx, maxy } = lastValidation.analysis.bbox;
      const polygon = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: 'BBOX' },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [minx, miny],
                  [maxx, miny],
                  [maxx, maxy],
                  [minx, maxy],
                  [minx, miny],
                ],
              ],
            },
          },
        ],
      };

      const json = JSON.stringify(polygon, null, 2);
      if (window.tryItDownload) {
        window.tryItDownload('bbox.geojson', json, 'application/geo+json');
      } else {
        const blob = new Blob([json], { type: 'application/geo+json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bbox.geojson';
        a.click();
        URL.revokeObjectURL(url);
      }
      addToRunLog('EXPORT-BBOX-GEOJSON', 'OK', 'bbox.geojson');
    };

    const sendToBbox = () => {
      if (!lastValidation || !lastValidation.analysis.bbox) {
        addToRunLog('SEND-TO-BBOX', 'WARN', 'Ingen BBOX');
        return;
      }

      const { minx, miny, maxx, maxy } = lastValidation.analysis.bbox;
      const minxInput = document.querySelector('#bbox-minx');
      const minyInput = document.querySelector('#bbox-miny');
      const maxxInput = document.querySelector('#bbox-maxx');
      const maxyInput = document.querySelector('#bbox-maxy');

      if (minxInput && minyInput && maxxInput && maxyInput) {
        minxInput.value = minx.toString();
        minyInput.value = miny.toString();
        maxxInput.value = maxx.toString();
        maxyInput.value = maxy.toString();

        const bboxSection = document.querySelector('#bbox');
        if (bboxSection) {
          bboxSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => minxInput.focus(), 500);
        }

        addToRunLog('SEND-TO-BBOX', 'OK');
      } else {
        addToRunLog('SEND-TO-BBOX', 'ERROR', 'BBOX-fält saknas');
      }
    };

    const sendToUrlBuilder = () => {
      if (!lastValidation || !lastValidation.analysis.bbox) {
        addToRunLog('SEND-TO-URLBUILDER', 'WARN', 'Ingen BBOX');
        return;
      }

      const { minx, miny, maxx, maxy } = lastValidation.analysis.bbox;
      const bboxInput = document.querySelector('#urlbuilder-bbox');
      const crsInput = document.querySelector('#urlbuilder-crs');

      if (bboxInput) {
        bboxInput.value = `${minx},${miny},${maxx},${maxy}`;

        if (crsInput && !crsInput.value.trim() && lastValidation.analysis.isGeoJson) {
          crsInput.value = 'EPSG:4326';
        }

        const urlBuilderSection = document.querySelector('#urlbuilder');
        if (urlBuilderSection) {
          urlBuilderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => bboxInput.focus(), 500);
        }

        addToRunLog('SEND-TO-URLBUILDER', 'OK');
      } else {
        addToRunLog('SEND-TO-URLBUILDER', 'ERROR', 'URL builder-fält saknas');
      }
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
          case 'export-json':
            exportJson();
            break;
          case 'export-bbox-txt':
            exportBboxTxt();
            break;
          case 'export-bbox-geojson':
            exportBboxGeoJson();
            break;
          case 'send-to-bbox':
            sendToBbox();
            break;
          case 'send-to-urlbuilder':
            sendToUrlBuilder();
            break;
          default:
            break;
        }
      });
    });

    addToRunLog('INFO', 'JSON/GeoJSON initierat');
  };

  const initMapSandbox = (block) => {
    const urlInput = block.querySelector('#mapsandbox-url');
    const imgEl = block.querySelector('#mapsandbox-img');
    const fallbackEl = block.querySelector('#mapsandbox-fallback');
    const statusEl = block.querySelector('#mapsandbox-status');
    const paramsOutput = block.querySelector('#mapsandbox-params');
    const reportOutput = block.querySelector('#mapsandbox-validation');
    const logOutput = block.querySelector('#mapsandbox-runlog');
    const advancedToggle = block.querySelector('#mapsandbox-advanced-toggle');
    const advancedPanel = block.querySelector('#mapsandbox-advanced-panel');
    const buttons = block.querySelectorAll('[data-mapsandbox-action]');

    if (!urlInput || !imgEl || !statusEl) {
      return;
    }

    const runLog = [];

    const addToRunLog = (level, message) => {
      const ts = new Date().toLocaleTimeString('sv-SE');
      runLog.push(`[${ts}] [${level}] ${message}`);
      if (runLog.length > 20) runLog.shift();
      if (logOutput) logOutput.textContent = runLog.join('\n');
    };

    const setStatus = (message) => {
      statusEl.textContent = message;
    };

    const setParams = (text) => {
      if (paramsOutput) paramsOutput.textContent = text;
    };

    const setReport = (lines) => {
      if (reportOutput) reportOutput.textContent = lines.join('\n');
    };

    const showFallback = (show) => {
      if (!fallbackEl) return;
      fallbackEl.style.display = show ? 'block' : 'none';
      imgEl.style.display = show ? 'none' : 'block';
    };

    const parseUrlParams = (urlString) => {
      try {
        const url = new URL(urlString, window.location.href);
        const params = new URLSearchParams(url.search);
        const sorted = Array.from(params.entries()).sort((a, b) => a[0].localeCompare(b[0]));
        return { url, params, sorted, valid: true };
      } catch {
        return { url: null, params: null, sorted: [], valid: false };
      }
    };

    const getParam = (params, key) => {
      for (const [k, v] of params.entries()) {
        if (k.toLowerCase() === key.toLowerCase()) return v;
      }
      return null;
    };

    const validateUrl = (urlString) => {
      const issues = [];
      const warnings = [];

      if (!urlString || !urlString.trim()) {
        issues.push('URL saknas');
        return { valid: false, issues, warnings, parsed: null };
      }

      const parsed = parseUrlParams(urlString);
      if (!parsed.valid) {
        issues.push('Ogiltigt URL-format');
        return { valid: false, issues, warnings, parsed: null };
      }

      const { url, params } = parsed;
      if (!/^https?:$/i.test(url.protocol)) {
        issues.push('Protokoll måste vara http eller https');
      }

      const service = getParam(params, 'SERVICE');
      const request = getParam(params, 'REQUEST');
      const bbox = getParam(params, 'BBOX');
      const crs = getParam(params, 'CRS') || getParam(params, 'SRS');
      const format = getParam(params, 'FORMAT');

      if (!service || service.toUpperCase() !== 'WMS') {
        issues.push('SERVICE=WMS saknas eller är felaktig');
      }

      if (!request || request.toUpperCase() !== 'GETMAP') {
        issues.push('REQUEST=GetMap saknas eller är felaktig');
      }

      if (!bbox) {
        issues.push('BBOX saknas');
      }

      if (!crs) {
        issues.push('CRS eller SRS saknas');
      }

      if (!format) {
        warnings.push('FORMAT saknas');
      }

      return { valid: issues.length === 0, issues, warnings, parsed };
    };

    const generateReport = (validation) => {
      const lines = ['═══ VALIDERINGSRAPPORT ═══', ''];

      if (!validation.valid) {
        lines.push('Status: [ERROR] OGILTIG');
        lines.push('');
        lines.push('Fel:');
        validation.issues.forEach((issue) => lines.push(`  [FAIL] ${issue}`));
        if (validation.warnings.length > 0) {
          lines.push('');
          lines.push('Varningar:');
          validation.warnings.forEach((warn) => lines.push(`  [WARN] ${warn}`));
        }
        return lines;
      }

      const statusText =
        validation.warnings.length > 0 ? '[WARN] GILTIG MED VARNINGAR' : '[OK] GILTIG';
      lines.push(`Status: ${statusText}`);
      lines.push('');

      if (validation.parsed && validation.parsed.url && validation.parsed.params) {
        const { url, params } = validation.parsed;
        lines.push('Kontroller:');
        lines.push(`  [PASS] Protokoll: ${url.protocol}`);
        lines.push(`  [PASS] Värd: ${url.hostname}`);
        lines.push(`  [PASS] Sökväg: ${url.pathname}`);
        lines.push(`  [PASS] SERVICE: ${getParam(params, 'SERVICE') || 'saknas'}`);
        lines.push(`  [PASS] REQUEST: ${getParam(params, 'REQUEST') || 'saknas'}`);
        lines.push(
          `  ${getParam(params, 'BBOX') ? '[PASS]' : '[FAIL]'} BBOX: ${getParam(params, 'BBOX') || 'saknas'}`,
        );
        lines.push(
          `  ${getParam(params, 'CRS') || getParam(params, 'SRS') ? '[PASS]' : '[FAIL]'} CRS/SRS: ${getParam(params, 'CRS') || getParam(params, 'SRS') || 'saknas'}`,
        );
        lines.push(
          `  ${getParam(params, 'FORMAT') ? '[PASS]' : '[WARN]'} FORMAT: ${getParam(params, 'FORMAT') || 'saknas'}`,
        );
      }

      if (validation.warnings.length > 0) {
        lines.push('');
        lines.push('Varningar:');
        validation.warnings.forEach((warn) => lines.push(`  [WARN] ${warn}`));
      }

      return lines;
    };

    const generateParamsText = (parsed) => {
      if (!parsed || !parsed.sorted || parsed.sorted.length === 0) {
        return 'Inga parametrar hittades.';
      }
      const lines = ['═══ PARSED PARAMS ═══', ''];
      parsed.sorted.forEach(([key, value]) => lines.push(`${key} = ${value}`));
      return lines.join('\n');
    };

    const preview = () => {
      const urlString = urlInput.value.trim();
      const validation = validateUrl(urlString);
      setReport(generateReport(validation));
      setParams(
        validation.parsed ? generateParamsText(validation.parsed) : 'Kunde inte tolka URL.',
      );

      if (!validation.valid) {
        setStatus('Valideringsfel - se rapport.');
        showFallback(false);
        imgEl.src = '';
        addToRunLog('ERROR', `Validering misslyckades: ${validation.issues.length} fel`);
        return;
      }

      try {
        const previewUrl = new URL(urlString, window.location.href);
        previewUrl.searchParams.set('_ts', Date.now().toString());
        imgEl.src = previewUrl.toString();
        setStatus('Laddar förhandsvisning...');
        showFallback(false);
        addToRunLog('INFO', 'Laddar preview');
        if (validation.warnings.length > 0) {
          addToRunLog('WARN', `Validering med ${validation.warnings.length} varning(ar)`);
        }
      } catch {
        setStatus('Ogiltig URL.');
        showFallback(false);
        imgEl.src = '';
        addToRunLog('ERROR', 'Ogiltig URL');
      }
    };

    const useUrlBuilder = () => {
      const source = document.getElementById('urlbuilder-output');
      if (!source) {
        setStatus('URL builder hittades inte.');
        addToRunLog('ERROR', 'URL builder saknas');
        return;
      }
      const url = source.value.trim();
      if (!url) {
        setStatus('Ingen URL i URL builder.');
        addToRunLog('WARN', 'URL builder output är tom');
        return;
      }
      urlInput.value = url;
      setStatus('URL från URL builder laddad.');
      addToRunLog('OK', 'URL från URL builder laddad');
    };

    const useBboxUrl = () => {
      const source = document.getElementById('bbox-url-output');
      if (!source) {
        setStatus('BBOX-verktyg hittades inte.');
        addToRunLog('ERROR', 'BBOX URL saknas');
        return;
      }
      const url = source.value.trim();
      if (!url) {
        setStatus('Ingen URL i BBOX-verktyget.');
        addToRunLog('WARN', 'BBOX URL är tom');
        return;
      }
      urlInput.value = url;
      setStatus('URL från BBOX laddad.');
      addToRunLog('OK', 'URL från BBOX laddad');
    };

    const clear = () => {
      urlInput.value = '';
      imgEl.src = '';
      setStatus('');
      setParams('');
      setReport([]);
      showFallback(false);
      addToRunLog('INFO', 'Formulär rensat');
    };

    imgEl.addEventListener('load', () => {
      setStatus('Preview loaded.');
      addToRunLog('OK', 'Preview laddad');
      showFallback(false);
    });

    imgEl.addEventListener('error', () => {
      setStatus('Could not load preview. Likely CORS or network restrictions.');
      addToRunLog('ERROR', 'Preview misslyckades (CORS/nätverk)');
      showFallback(true);
    });

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.mapsandboxAction;
        if (action === 'preview') {
          preview();
        } else if (action === 'clear') {
          clear();
        } else if (action === 'use-urlbuilder') {
          useUrlBuilder();
        } else if (action === 'use-bbox-url') {
          useBboxUrl();
        }
      });
    });

    addToRunLog('INFO', 'Map sandbox initierat');
  };

  const initSldTryIt = (block) => {
    const input = block.querySelector('#sld-tryit-input');
    const output = block.querySelector('#sld-tryit-output');
    const status = block.querySelector('#sld-tryit-status');
    const report = block.querySelector('#sld-validation');
    const log = block.querySelector('#sld-runlog');
    const normalized = block.querySelector('#sld-normalized');
    const lintOutput = block.querySelector('#sld-lint');
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

    let runLog = [];
    let lastNormalized = null;
    let lastValidation = null;
    let lastContent = '';
    let lastLintReport = '';

    const setOutput = (value) => {
      output.textContent = value || '';
    };

    const updateStatusText = (message) => {
      status.textContent = message || '';
    };

    const addToRunLog = (action, result, detail = '') => {
      if (!log) return;
      const timestamp = new Date().toLocaleTimeString('sv-SE');
      const line = `[${timestamp}] ${action} ${result}${detail ? ` - ${detail}` : ''}`;
      runLog.push(line);
      if (runLog.length > 20) runLog.shift();
      log.textContent = runLog.join('\n');
      log.scrollTop = log.scrollHeight;
    };

    const setReport = (lines) => {
      if (!report) return;
      report.textContent = lines.join('\n');
    };

    const setNormalized = (obj) => {
      if (!normalized) return;
      normalized.textContent = obj ? JSON.stringify(obj, null, 2) : '';
    };

    const setLint = (text) => {
      if (!lintOutput) return;
      lintOutput.textContent = text;
      lastLintReport = text;
    };

    const formatXml = (xml) => {
      const reg = /(>)(<)(\/*)/g;
      let formatted = '';
      let pad = 0;
      xml
        .replace(reg, '$1\n$2$3')
        .split('\n')
        .forEach((node) => {
          let indent = 0;
          if (node.match(/^<\/\w/)) {
            if (pad > 0) pad -= 1;
          } else if (node.match(/^<\w/)) {
            indent = 1;
          }
          formatted += '  '.repeat(pad) + node + '\n';
          pad += indent;
        });
      return formatted.trim();
    };

    const minifyXml = (xml) => xml.replace(/>\s+</g, '><').trim();

    const parseSld = (raw) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(raw, 'application/xml');
      const parserError = doc.getElementsByTagName('parsererror')[0];
      if (parserError) {
        const msg = (parserError.textContent || 'XML-fel').split('\n')[0].trim();
        return { doc: null, parserError: true, errorText: msg };
      }
      return { doc, parserError: false, errorText: '' };
    };

    const findAll = (doc, localName) => {
      const nodes = Array.from(doc.getElementsByTagName('*'));
      return nodes.filter((n) => n.localName === localName);
    };

    const getNames = (elements) => {
      const names = [];
      elements.forEach((el) => {
        const nameNode = Array.from(el.getElementsByTagName('*')).find(
          (n) => n.localName === 'Name',
        );
        if (nameNode && nameNode.textContent) names.push(nameNode.textContent.trim());
      });
      return names;
    };

    const analyzeSld = (raw) => {
      const errors = [];
      const warnings = [];
      const reportLines = [];

      if (!raw.trim()) {
        errors.push('Inget innehåll att validera');
        reportLines.push('Status: Invalid');
        reportLines.push('FAIL: Inget innehåll');
        return { status: 'Invalid', errors, warnings, reportLines, normalized: null };
      }

      const parsed = parseSld(raw);
      if (parsed.parserError) {
        errors.push(parsed.errorText || 'XML parsererror');
        reportLines.push('Status: Invalid');
        reportLines.push(`FAIL: Parsererror: ${parsed.errorText || 'Okänt fel'}`);
        return { status: 'Invalid', errors, warnings, reportLines, normalized: null };
      }

      const doc = parsed.doc;
      const root = doc.documentElement;
      const sldNodes = findAll(doc, 'StyledLayerDescriptor');
      if (sldNodes.length === 0) {
        errors.push('StyledLayerDescriptor saknas');
        reportLines.push('Status: Invalid');
        reportLines.push('FAIL: StyledLayerDescriptor saknas');
        return { status: 'Invalid', errors, warnings, reportLines, normalized: null };
      }

      const version = root?.getAttribute('version') || '';
      const ns = root?.namespaceURI || '';
      const isSE = ns.includes('opengis.net/se') || version.startsWith('1.1');
      const variant = isSE
        ? 'SE 1.1'
        : ns.includes('opengis.net/sld') || version.startsWith('1.0')
          ? 'SLD 1.0'
          : 'Okänd';

      const namedLayers = findAll(doc, 'NamedLayer');
      const userLayers = findAll(doc, 'UserLayer');
      const rules = findAll(doc, 'Rule');
      const symbolizers = Array.from(doc.getElementsByTagName('*'))
        .filter((n) => n.localName && n.localName.endsWith('Symbolizer'))
        .map((n) => n.localName);
      const symbolizerList = Array.from(new Set(symbolizers));

      const expectedNs = isSE ? ['se', 'ogc', 'xlink', 'xsi'] : ['sld', 'ogc', 'xlink', 'xsi'];
      const present = [];
      const missing = [];
      expectedNs.forEach((prefix) => {
        const attr =
          root?.getAttribute(prefix === 'sld' || prefix === 'se' ? 'xmlns' : `xmlns:${prefix}`) ||
          root?.getAttribute(`xmlns:${prefix}`);
        if (attr) {
          present.push(prefix);
        } else {
          missing.push(prefix);
        }
      });

      if (missing.length > 0) warnings.push(`Namespaces saknas: ${missing.join(', ')}`);
      if (namedLayers.length === 0 && userLayers.length === 0)
        warnings.push('Inga NamedLayer/UserLayer hittades');
      if (rules.length === 0) warnings.push('Inga Rule hittades');
      if (symbolizerList.length === 0) warnings.push('Inga Symbolizer hittades');
      if (variant === 'Okänd') warnings.push('Okänd SLD-variant');

      reportLines.push(
        `Status: ${errors.length > 0 ? 'Invalid' : warnings.length > 0 ? 'Warnings' : 'Valid'}`,
      );
      reportLines.push(`PASS: StyledLayerDescriptor hittad (${sldNodes.length})`);
      reportLines.push(`${variant === 'Okänd' ? 'WARN' : 'PASS'}: Variant ${variant}`);
      reportLines.push(`${version ? 'PASS' : 'WARN'}: version-attribut ${version || 'saknas'}`);
      reportLines.push(
        `${missing.length ? 'WARN' : 'PASS'}: namespaces ${missing.length ? 'saknas ' + missing.join(', ') : 'ok'}`,
      );
      reportLines.push(`PASS: NamedLayer ${namedLayers.length} / UserLayer ${userLayers.length}`);
      reportLines.push(`${rules.length ? 'PASS' : 'WARN'}: Rule ${rules.length}`);
      reportLines.push(
        `${symbolizerList.length ? 'PASS' : 'WARN'}: Symbolizers ${symbolizerList.join(', ') || 'saknas'}`,
      );

      const normalizedObj = {
        variant,
        version,
        namedLayers: getNames(namedLayers),
        userLayers: getNames(userLayers),
        rulesCount: rules.length,
        symbolizers: symbolizerList,
        namespaces: { present, missing },
        warnings,
        errors,
      };

      return {
        status: errors.length > 0 ? 'Invalid' : warnings.length > 0 ? 'Warnings' : 'Valid',
        errors,
        warnings,
        reportLines,
        normalized: normalizedObj,
      };
    };

    const lintSld = (raw) => {
      const findings = [];

      if (!raw.trim()) {
        findings.push({
          level: 'ERROR',
          code: 'SLD000',
          message: 'Ingen SLD-kod att linta',
          hint: 'Klistra in SLD-kod först',
        });
        return { findings, errorCount: 1, warnCount: 0, infoCount: 0 };
      }

      const parsed = parseSld(raw);
      if (parsed.parserError) {
        findings.push({
          level: 'ERROR',
          code: 'SLD001',
          message: 'XML parsfel',
          hint: parsed.errorText || 'Kontrollera XML-syntax och namespaces',
        });
        return { findings, errorCount: 1, warnCount: 0, infoCount: 0 };
      }

      const doc = parsed.doc;
      const root = doc.documentElement;

      // A) Structure checks
      const sldNodes = findAll(doc, 'StyledLayerDescriptor');
      if (sldNodes.length === 0) {
        findings.push({
          level: 'ERROR',
          code: 'SLD002',
          message: 'StyledLayerDescriptor saknas',
          hint: 'Rotelementet måste vara StyledLayerDescriptor',
        });
        return { findings, errorCount: 1, warnCount: 0, infoCount: 0 };
      }

      const namedLayers = findAll(doc, 'NamedLayer');
      const userLayers = findAll(doc, 'UserLayer');

      if (namedLayers.length === 0 && userLayers.length === 0) {
        findings.push({
          level: 'ERROR',
          code: 'SLD003',
          message: 'Varken NamedLayer eller UserLayer hittades',
          hint: 'SLD måste innehålla minst ett NamedLayer eller UserLayer',
        });
      }

      if (namedLayers.length > 0 && userLayers.length > 0) {
        findings.push({
          level: 'INFO',
          code: 'SLD004',
          message: 'Både NamedLayer och UserLayer finns',
          hint: 'Detta är ovanligt men tillåtet',
        });
      }

      const userStyles = findAll(doc, 'UserStyle');
      if (userStyles.length === 0) {
        findings.push({
          level: 'WARN',
          code: 'SLD005',
          message: 'Ingen UserStyle hittades',
          hint: 'Lägg till UserStyle för att definiera styling',
        });
      }

      const rules = findAll(doc, 'Rule');
      if (rules.length === 0) {
        findings.push({
          level: 'WARN',
          code: 'SLD006',
          message: 'Inga Rules hittades',
          hint: 'Lägg till minst en Rule för att rendera features',
        });
      }

      // B) Namespace / version checks
      const version = root?.getAttribute('version');
      if (!version) {
        findings.push({
          level: 'WARN',
          code: 'SLD010',
          message: 'version-attribut saknas',
          hint: 'Lägg till version="1.1.0" eller "1.0.0" på rotelementet',
        });
      }

      const ns = root?.namespaceURI || '';
      const isSE = ns.includes('opengis.net/se') || (version && version.startsWith('1.1'));

      const hasOgcNs = root?.getAttribute('xmlns:ogc') || root?.lookupNamespaceURI('ogc');
      const filters = findAll(doc, 'Filter');

      if (isSE && filters.length > 0 && !hasOgcNs) {
        findings.push({
          level: 'WARN',
          code: 'SLD011',
          message: 'SE-format med Filter men ogc-namespace saknas',
          hint: 'Lägg till xmlns:ogc="http://www.opengis.net/ogc"',
        });
      }

      const schemaLocation = root?.getAttribute('xsi:schemaLocation');
      if (!schemaLocation) {
        findings.push({
          level: 'WARN',
          code: 'SLD012',
          message: 'schemaLocation saknas',
          hint: 'Lägg till xsi:schemaLocation för validering',
        });
      }

      // C) Scale sanity checks
      let allRulesHaveNoScale = true;
      rules.forEach((rule, idx) => {
        const minScales = Array.from(rule.getElementsByTagName('*')).filter(
          (n) => n.localName === 'MinScaleDenominator',
        );
        const maxScales = Array.from(rule.getElementsByTagName('*')).filter(
          (n) => n.localName === 'MaxScaleDenominator',
        );

        if (minScales.length > 0 || maxScales.length > 0) {
          allRulesHaveNoScale = false;
        }

        if (minScales.length > 0 && maxScales.length > 0) {
          const minVal = parseFloat(minScales[0].textContent);
          const maxVal = parseFloat(maxScales[0].textContent);

          if (!isNaN(minVal) && !isNaN(maxVal) && minVal > maxVal) {
            findings.push({
              level: 'WARN',
              code: 'SLD020',
              message: `Rule ${idx + 1}: MinScaleDenominator > MaxScaleDenominator`,
              hint: `Min (${minVal}) ska vara mindre än Max (${maxVal})`,
              path: `Rule[${idx}]`,
            });
          }

          if (!isNaN(minVal) && minVal < 1) {
            findings.push({
              level: 'INFO',
              code: 'SLD021',
              message: `Rule ${idx + 1}: Extremt liten MinScaleDenominator`,
              hint: `Värde ${minVal} är ovanligt, kontrollera om avsiktligt`,
              path: `Rule[${idx}]`,
            });
          }

          if (!isNaN(maxVal) && maxVal > 1000000000) {
            findings.push({
              level: 'INFO',
              code: 'SLD022',
              message: `Rule ${idx + 1}: Extremt stor MaxScaleDenominator`,
              hint: `Värde ${maxVal} är ovanligt, kontrollera om avsiktligt`,
              path: `Rule[${idx}]`,
            });
          }
        }
      });

      if (allRulesHaveNoScale && rules.length > 0) {
        findings.push({
          level: 'WARN',
          code: 'SLD023',
          message: 'Inga Rules har scale-gating',
          hint: 'Överväg MinScaleDenominator/MaxScaleDenominator för bättre prestanda',
        });
      }

      // D) Symbolizer and common mistakes
      const polygonSymbolizers = findAll(doc, 'PolygonSymbolizer');
      polygonSymbolizers.forEach((ps, idx) => {
        const fills = Array.from(ps.getElementsByTagName('*')).filter(
          (n) => n.localName === 'Fill',
        );
        const strokes = Array.from(ps.getElementsByTagName('*')).filter(
          (n) => n.localName === 'Stroke',
        );

        if (fills.length === 0 && strokes.length === 0) {
          findings.push({
            level: 'WARN',
            code: 'SLD030',
            message: `PolygonSymbolizer ${idx + 1}: Varken Fill eller Stroke`,
            hint: 'Polygonen blir osynlig utan Fill eller Stroke',
            path: `PolygonSymbolizer[${idx}]`,
          });
        }
      });

      const lineSymbolizers = findAll(doc, 'LineSymbolizer');
      lineSymbolizers.forEach((ls, idx) => {
        const strokes = Array.from(ls.getElementsByTagName('*')).filter(
          (n) => n.localName === 'Stroke',
        );
        if (strokes.length > 0) {
          const strokeWidths = Array.from(strokes[0].getElementsByTagName('*')).filter(
            (n) => n.localName === 'SvgParameter' && n.getAttribute('name') === 'stroke-width',
          );
          if (strokeWidths.length === 0) {
            findings.push({
              level: 'WARN',
              code: 'SLD031',
              message: `LineSymbolizer ${idx + 1}: stroke-width saknas`,
              hint: 'Linjebredd blir default (ofta 1px), specificera för tydlighet',
              path: `LineSymbolizer[${idx}]`,
            });
          }
        }
      });

      const textSymbolizers = findAll(doc, 'TextSymbolizer');
      textSymbolizers.forEach((ts, idx) => {
        const labels = Array.from(ts.getElementsByTagName('*')).filter(
          (n) => n.localName === 'Label',
        );
        if (labels.length === 0 || !labels[0].textContent.trim()) {
          findings.push({
            level: 'WARN',
            code: 'SLD032',
            message: `TextSymbolizer ${idx + 1}: Label saknas eller tom`,
            hint: 'Lägg till Label med PropertyName eller Literal',
            path: `TextSymbolizer[${idx}]`,
          });
        }
      });

      filters.forEach((filter, idx) => {
        const propNames = Array.from(filter.getElementsByTagName('*')).filter(
          (n) => n.localName === 'PropertyName',
        );
        if (propNames.length === 0 || !propNames.some((p) => p.textContent.trim())) {
          findings.push({
            level: 'WARN',
            code: 'SLD033',
            message: `Filter ${idx + 1}: PropertyName saknas eller tom`,
            hint: 'Filter behöver PropertyName för att fungera',
            path: `Filter[${idx}]`,
          });
        }
      });

      // Check for multiple rules without filters (last-rule-wins)
      const rulesWithoutFilter = rules.filter((rule) => {
        const ruleFilters = Array.from(rule.getElementsByTagName('*')).filter(
          (n) => n.localName === 'Filter',
        );
        const elseFilters = Array.from(rule.getElementsByTagName('*')).filter(
          (n) => n.localName === 'ElseFilter',
        );
        return ruleFilters.length === 0 && elseFilters.length === 0;
      });

      if (rulesWithoutFilter.length > 1) {
        findings.push({
          level: 'WARN',
          code: 'SLD034',
          message: `${rulesWithoutFilter.length} Rules utan Filter eller ElseFilter`,
          hint: 'Kan orsaka last-rule-wins problem, lägg till Filter för specifika villkor',
        });
      }

      // E) Color / opacity checks
      const svgParams = findAll(doc, 'SvgParameter');
      svgParams.forEach((param) => {
        const name = param.getAttribute('name');
        const value = param.textContent.trim();

        if ((name === 'fill-opacity' || name === 'stroke-opacity') && value) {
          const numVal = parseFloat(value);
          if (!isNaN(numVal) && (numVal < 0 || numVal > 1)) {
            findings.push({
              level: 'WARN',
              code: 'SLD040',
              message: `${name} utanför [0..1]: ${value}`,
              hint: 'Opacity ska vara mellan 0 och 1',
            });
          }
        }

        if (name === 'stroke-width' && value) {
          const numVal = parseFloat(value);
          if (!isNaN(numVal) && numVal <= 0) {
            findings.push({
              level: 'WARN',
              code: 'SLD041',
              message: `stroke-width <= 0: ${value}`,
              hint: 'Linjebredd måste vara > 0',
            });
          }
        }
      });

      // Count by level
      let errorCount = 0;
      let warnCount = 0;
      let infoCount = 0;
      findings.forEach((f) => {
        if (f.level === 'ERROR') errorCount++;
        else if (f.level === 'WARN') warnCount++;
        else if (f.level === 'INFO') infoCount++;
      });

      return { findings, errorCount, warnCount, infoCount };
    };

    const generateLintReport = (lintResult) => {
      const lines = [];
      lines.push('═══ SLD LINT RAPPORT ═══');
      lines.push('');

      const { findings, errorCount, warnCount, infoCount } = lintResult;

      if (findings.length === 0) {
        lines.push('Status: [OK] Inga problem hittade');
        return lines.join('\n');
      }

      lines.push(`Status: ${errorCount > 0 ? '[ERROR]' : warnCount > 0 ? '[WARN]' : '[INFO]'}`);
      lines.push(
        `Totalt: ${findings.length} findings (${errorCount} errors, ${warnCount} warnings, ${infoCount} info)`,
      );
      lines.push('');

      // Group by level
      const errors = findings.filter((f) => f.level === 'ERROR');
      const warnings = findings.filter((f) => f.level === 'WARN');
      const infos = findings.filter((f) => f.level === 'INFO');

      if (errors.length > 0) {
        lines.push('ERRORS:');
        errors.forEach((f) => {
          lines.push(`  [ERROR] ${f.code}: ${f.message}`);
          if (f.hint) lines.push(`    Hint: ${f.hint}`);
          if (f.path) lines.push(`    Path: ${f.path}`);
        });
        lines.push('');
      }

      if (warnings.length > 0) {
        lines.push('WARNINGS:');
        warnings.forEach((f) => {
          lines.push(`  [WARN] ${f.code}: ${f.message}`);
          if (f.hint) lines.push(`    Hint: ${f.hint}`);
          if (f.path) lines.push(`    Path: ${f.path}`);
        });
        lines.push('');
      }

      if (infos.length > 0) {
        lines.push('INFO:');
        infos.forEach((f) => {
          lines.push(`  [INFO] ${f.code}: ${f.message}`);
          if (f.hint) lines.push(`    Hint: ${f.hint}`);
          if (f.path) lines.push(`    Path: ${f.path}`);
        });
      }

      return lines.join('\n');
    };

    const runLint = () => {
      const raw = input.value.trim();

      if (!raw) {
        setLint('Ingen SLD-kod att linta.');
        updateStatusText('Ange SLD-kod först.');
        addToRunLog('LINT', 'WARN', 'Ingen kod');
        return;
      }

      const lintResult = lintSld(raw);
      const report = generateLintReport(lintResult);
      setLint(report);

      const { errorCount, warnCount, infoCount } = lintResult;

      if (errorCount > 0) {
        updateStatusText(`Lint: ${errorCount} fel, ${warnCount} varningar`);
        addToRunLog(
          'LINT',
          'ERROR',
          `${errorCount} fel, ${warnCount} varningar, ${infoCount} info`,
        );
      } else if (warnCount > 0) {
        updateStatusText(`Lint: ${warnCount} varningar`);
        addToRunLog('LINT', 'WARN', `${warnCount} varningar, ${infoCount} info`);
      } else if (infoCount > 0) {
        updateStatusText(`Lint: ${infoCount} info`);
        addToRunLog('LINT', 'INFO', `${infoCount} info`);
      } else {
        updateStatusText('Lint: Inga problem hittade.');
        addToRunLog('LINT', 'OK', 'Inga problem');
      }
    };

    const exportLintTxt = () => {
      if (!lastLintReport || !lastLintReport.trim()) {
        updateStatusText('Kör Lint först.');
        addToRunLog('EXPORT', 'WARN', 'Ingen lint-rapport att exportera');
        return;
      }

      let content = lastLintReport;
      content += '\n\n═══ METADATA ═══\n';
      content += `Tidpunkt: ${new Date().toLocaleString('sv-SE')}\n`;
      content += `SLD längd: ${input.value.length} tecken\n`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sld-lint-report.txt';
      a.click();
      URL.revokeObjectURL(url);

      updateStatusText('Lint-rapport exporterad.');
      addToRunLog('EXPORT', 'OK', 'Lint TXT');
    };

    const copyLintReport = async () => {
      if (!lastLintReport || !lastLintReport.trim()) {
        updateStatusText('Kör Lint först.');
        addToRunLog('COPY', 'WARN', 'Ingen lint-rapport att kopiera');
        return;
      }

      try {
        await copyText(lastLintReport);
        updateStatusText('Lint-rapport kopierad.');
        addToRunLog('COPY', 'OK', 'Lint-rapport');
      } catch (error) {
        updateStatusText('Kunde inte kopiera.');
        addToRunLog('COPY', 'ERROR', 'Kopiering misslyckades');
      }
    };

    const updateFromAnalysis = (analysis) => {
      lastValidation = analysis;
      setReport(analysis.reportLines);
      setNormalized(analysis.normalized);
    };

    const checkSld = () => {
      const raw = input.value.trim();
      const analysis = analyzeSld(raw);
      updateFromAnalysis(analysis);

      if (analysis.status === 'Invalid') {
        updateStatusText('Ogiltig SLD. Se valideringsrapport.');
        setOutput(analysis.errors[0] || 'Ogiltig SLD.');
        addToRunLog('CHECK', 'FAIL', analysis.errors[0] || 'Ogiltig SLD');
        return;
      }

      if (analysis.status === 'Warnings') {
        updateStatusText('SLD validerad med varningar.');
        setOutput('SLD är välformad men har varningar.');
        addToRunLog('CHECK', 'WARN', `${analysis.warnings.length} varning(ar)`);
        return;
      }

      updateStatusText('SLD ser giltig ut.');
      setOutput('XML är välformad och innehåller StyledLayerDescriptor.');
      addToRunLog('CHECK', 'OK');
    };

    const loadTemplate = () => {
      input.value = template;
      lastContent = template;
      setOutput('');
      updateStatusText('Mall laddad.');
      addToRunLog('TEMPLATE', 'OK');
    };

    const prettify = () => {
      const raw = input.value.trim();
      if (!raw) {
        updateStatusText('Inget att formatera.');
        addToRunLog('FORMAT', 'FAIL', 'Tomt innehåll');
        return;
      }
      try {
        const formatted = formatXml(raw);
        input.value = formatted;
        lastContent = formatted;
        updateStatusText('Formaterad.');
        addToRunLog('FORMAT', 'OK');
      } catch {
        updateStatusText('Kunde inte formatera.');
        addToRunLog('FORMAT', 'FAIL');
      }
    };

    const minify = () => {
      const raw = input.value.trim();
      if (!raw) {
        updateStatusText('Inget att minifiera.');
        addToRunLog('MINIFY', 'FAIL', 'Tomt innehåll');
        return;
      }
      const minified = minifyXml(raw);
      input.value = minified;
      lastContent = minified;
      updateStatusText('Minifierad.');
      addToRunLog('MINIFY', 'OK');
    };

    const copySld = async () => {
      const text = input.value.trim();
      if (!text) {
        updateStatusText('Inget att kopiera.');
        addToRunLog('COPY', 'FAIL', 'Tomt innehåll');
        return;
      }
      try {
        await copyText(text);
        updateStatusText('Kopierat till urklipp.');
        addToRunLog('COPY', 'OK');
      } catch (error) {
        updateStatusText('Kunde inte kopiera.');
        addToRunLog('COPY', 'FAIL');
      }
    };

    const exportSld = () => {
      const text = input.value.trim() || lastContent;
      if (!text) {
        updateStatusText('Inget att exportera.');
        addToRunLog('EXPORT', 'FAIL', 'Tomt innehåll');
        return;
      }
      const blob = new Blob([text], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sld-export.sld';
      a.click();
      URL.revokeObjectURL(url);
      updateStatusText('SLD exporterad.');
      addToRunLog('EXPORT', 'OK', 'SLD');
    };

    const exportTxt = () => {
      const analysis = lastValidation || analyzeSld(input.value.trim());
      updateFromAnalysis(analysis);

      let content = '═══ SLD EXPORT ───\n\n';
      content += `Tidpunkt: ${new Date().toLocaleString('sv-SE')}\n\n`;
      content += '─── Metadata ───\n';
      if (analysis.normalized) {
        const n = analysis.normalized;
        content += `Variant: ${n.variant}\n`;
        content += `Version: ${n.version || 'saknas'}\n`;
        content += `NamedLayer: ${n.namedLayers.length}\n`;
        content += `UserLayer: ${n.userLayers.length}\n`;
        content += `Rules: ${n.rulesCount}\n`;
        content += `Symbolizers: ${n.symbolizers.join(', ') || 'saknas'}\n`;
      }
      content += '\n─── Validering ───\n';
      content += `${analysis.reportLines.join('\n')}\n\n`;
      content += '─── Tips ───\n';
      content += 'Kontrollera CRS och schemaLocation före import i GeoServer.\n';

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sld-export.txt';
      a.click();
      URL.revokeObjectURL(url);
      updateStatusText('TXT exporterad.');
      addToRunLog('EXPORT', 'OK', 'TXT');
    };

    const clearSld = () => {
      input.value = '';
      setOutput('');
      setReport([]);
      setNormalized(null);
      setLint('');
      updateStatusText('');
      lastContent = '';
      lastValidation = null;
      addToRunLog('CLEAR', 'OK');
    };

    const suggestFixes = () => {
      updateStatusText('Quick Fixes-funktionen är under utveckling.');
      addToRunLog('SUGGEST-FIXES', 'INFO', 'Under utveckling');
    };

    const applyFixes = () => {
      updateStatusText('Quick Fixes-funktionen är under utveckling.');
      addToRunLog('APPLY-FIXES', 'INFO', 'Under utveckling');
    };

    const resetFixes = () => {
      updateStatusText('Quick Fixes-funktionen är under utveckling.');
      addToRunLog('RESET-FIXES', 'INFO', 'Under utveckling');
    };

    // Advanced panel now uses native <details> in the HTML; no toggle handler required.

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
          case 'prettify':
            prettify();
            break;
          case 'minify':
            minify();
            break;
          case 'lint':
            runLint();
            break;
          case 'copy':
            copySld();
            break;
          case 'export-sld':
            exportSld();
            break;
          case 'export-txt':
            exportTxt();
            break;
          case 'export-lint-txt':
            exportLintTxt();
            break;
          case 'copy-lint':
            copyLintReport();
            break;
          case 'suggest-fixes':
            suggestFixes();
            break;
          case 'apply-fixes':
            applyFixes();
            break;
          case 'reset-fixes':
            resetFixes();
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

    // Enterprise elements
    const advancedToggle = block.querySelector('#urlbuilder-advanced-toggle');
    const advancedPanel = block.querySelector('#urlbuilder-advanced-panel');
    const reportOutput = block.querySelector('#urlbuilder-validation');
    const logOutput = block.querySelector('#urlbuilder-runlog');
    const explainOutput = block.querySelector('#urlbuilder-explain');

    if (!base || !service || !layer || !format || !crs || !bbox || !output || !status) {
      return;
    }

    const TOOL_KEY = 'urlbuilder';
    const updateStatus = (msg) => {
      if (status) status.textContent = msg;
    };
    let runLog = [];

    const addToRunLog = (level, message) => {
      if (!logOutput) return;
      const timestamp = new Date().toLocaleTimeString('sv-SE');
      runLog.push(`[${timestamp}] [${level}] ${message}`);
      if (runLog.length > 20) runLog.shift();
      logOutput.textContent = runLog.join('\n');
      logOutput.scrollTop = logOutput.scrollHeight;
    };

    const setReport = (lines) => {
      if (!reportOutput) return;
      reportOutput.textContent = lines.join('\n');
    };

    const validateInputs = () => {
      const errors = [];
      const warnings = [];
      const baseVal = base.value.trim();
      const layerVal = layer.value.trim();
      const crsVal = crs.value.trim();
      const bboxVal = bbox.value.trim();
      const formatVal = format.value.trim();
      const serviceVal = service.value.toUpperCase();

      // Base URL
      if (!baseVal) {
        errors.push('Bas-URL är obligatorisk');
      } else {
        try {
          const parsed = new URL(baseVal, window.location.href);
          if (!/^https?:$/i.test(parsed.protocol)) {
            errors.push('Bas-URL måste vara http:// eller https://');
          }
        } catch {
          errors.push('Bas-URL måste vara en giltig URL');
        }
      }

      // Service
      if (!['WMS', 'WFS'].includes(serviceVal)) {
        errors.push('Tjänst måste vara WMS eller WFS');
      }

      // Layer
      if (!layerVal) {
        errors.push('Layer är obligatoriskt');
      }

      // Format (warning)
      if (!formatVal) {
        warnings.push('Format saknas');
      } else if (!/^[\w-]+\/[\w-+.]+$/i.test(formatVal)) {
        warnings.push('Format bör följa mönstret type/subtype (t.ex. image/png)');
      }

      // CRS (warning)
      if (!crsVal) {
        warnings.push('CRS saknas');
      } else if (!/^EPSG:\d+$/i.test(crsVal)) {
        warnings.push('CRS bör följa mönstret EPSG:XXXX (t.ex. EPSG:3006)');
      }

      let normalizedBbox = '';
      let bboxParts = null;

      if (serviceVal === 'WMS') {
        if (!bboxVal) {
          errors.push('BBOX är obligatoriskt för WMS');
        } else {
          const parts = bboxVal
            .split(/[\s,]+/)
            .map((s) => s.trim())
            .filter(Boolean);
          if (parts.length !== 4) {
            errors.push(
              'BBOX måste innehålla exakt 4 värden separerade med komma eller mellanslag',
            );
          } else {
            const nums = parts.map((p) => Number(p));
            if (nums.some((n) => !Number.isFinite(n))) {
              errors.push('BBOX-värden måste vara giltiga tal');
            } else {
              const [minx, miny, maxx, maxy] = nums;
              const minxNorm = Math.min(minx, maxx);
              const maxxNorm = Math.max(minx, maxx);
              const minyNorm = Math.min(miny, maxy);
              const maxyNorm = Math.max(miny, maxy);
              if (minx > maxx || miny > maxy) {
                warnings.push('BBOX min/max är omkastade - normaliserar vid generering');
              }
              bboxParts = { minx, miny, maxx, maxy };
              normalizedBbox = `${minxNorm},${minyNorm},${maxxNorm},${maxyNorm}`;
            }
          }
        }
      }

      return { errors, warnings, normalizedBbox, bboxParts };
    };

    const generateValidationReport = ({ errors, warnings }) => {
      const lines = ['═══ VALIDERINGSRAPPORT ═══', ''];

      if (errors.length === 0 && warnings.length === 0) {
        lines.push('Status: [OK] Inga problem upptäckta');
      } else if (errors.length > 0) {
        lines.push(`Status: [ERROR] ${errors.length} fel`);
      } else {
        lines.push(`Status: [WARN] ${warnings.length} varning(ar)`);
      }

      if (errors.length > 0) {
        lines.push('');
        lines.push('Fel:');
        errors.forEach((issue, i) => lines.push(`  ${i + 1}. ${issue}`));
      }

      if (warnings.length > 0) {
        lines.push('');
        lines.push('Varningar:');
        warnings.forEach((issue, i) => lines.push(`  ${i + 1}. ${issue}`));
      }

      return lines;
    };

    const explainRequest = (params, serviceVal) => {
      const lines = ['═══ EXPLAIN REQUEST ═══', ''];
      const isWfs = serviceVal === 'WFS';

      const addLine = (key, value, description) => {
        lines.push(`${key}=${value} - ${description}`);
      };

      addLine('SERVICE', params.get('service') || serviceVal, 'Protocol family');
      addLine('VERSION', params.get('version') || '', isWfs ? 'WFS version' : 'WMS version');
      addLine(
        'REQUEST',
        params.get('request') || '',
        isWfs ? 'Operation (GetFeature)' : 'Operation (GetMap)',
      );

      if (isWfs) {
        addLine('TYPENAMES', params.get('typenames') || '', 'Target layer(s)');
        addLine('OUTPUTFORMAT', params.get('outputFormat') || '', 'Output format');
      } else {
        addLine('LAYERS', params.get('layers') || '', 'Target layer(s)');
        addLine('FORMAT', params.get('format') || '', 'Output format');
        const crsParam = params.get('srs') ? 'SRS' : 'CRS';
        addLine(
          crsParam,
          params.get('srs') || params.get('crs') || '',
          'Coordinate reference system',
        );
        addLine('BBOX', params.get('bbox') || '', 'Extent (minX,minY,maxX,maxY)');
        addLine('WIDTH', params.get('width') || '', 'Map width in pixels');
        addLine('HEIGHT', params.get('height') || '', 'Map height in pixels');
      }

      const version = params.get('version');
      const crsValue = params.get('crs') || params.get('srs') || '';
      if (version === '1.3.0' && crsValue.toUpperCase() === 'EPSG:4326') {
        lines.push('');
        lines.push('Note: WMS 1.3.0 with EPSG:4326 uses latitude/longitude axis order.');
      }

      return lines;
    };

    const buildQuery = (serviceValue, options = {}) => {
      const params = new URLSearchParams();
      const isWfs = serviceValue.toUpperCase() === 'WFS';
      const bboxValue = options.bboxValue || bbox.value.trim();
      params.set('service', serviceValue.toUpperCase());
      params.set('version', isWfs ? '2.0.0' : '1.1.1');
      params.set('request', isWfs ? 'GetFeature' : 'GetMap');
      params.set(isWfs ? 'typenames' : 'layers', layer.value.trim());
      params.set(isWfs ? 'outputFormat' : 'format', format.value.trim());
      if (!isWfs) {
        params.set('bbox', bboxValue);
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
            updateStatus('Template: WMS GetCapabilities.');
            addToRunLog('INFO', 'Laddade mall: WMS GetCapabilities');
          } catch {
            output.value = '';
            updateStatus('Ogiltig bas-URL.');
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
            updateStatus('Template: WFS GetCapabilities.');
            addToRunLog('INFO', 'Laddade mall: WFS GetCapabilities');
          } catch {
            output.value = '';
            updateStatus('Ogiltig bas-URL.');
          }
          return;
        }

        if (action === 'getmap-demo') {
          setBaseIfEmpty();
          service.value = 'WMS';
          if (!layer.value.trim()) layer.value = 'workspace:layer';
          if (!format.value.trim()) format.value = 'image/png';
          if (!crs.value.trim()) crs.value = 'EPSG:3006';
          if (!bbox.value.trim()) bbox.value = '200000,6100000,900000,7700000';
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
            updateStatus('Template: WMS GetMap (demo).');
            addToRunLog('INFO', 'Laddade mall: WMS GetMap demo');
          } catch {
            output.value = '';
            updateStatus('Ogiltig bas-URL.');
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
          setReport([]);
          if (explainOutput) explainOutput.textContent = '';
          updateStatus('Rensat.');
          addToRunLog('INFO', 'Formulär rensat');
        }
      });
    });

    const generate = () => {
      const validation = validateInputs();
      const report = generateValidationReport(validation);
      setReport(report);

      if (validation.errors.length > 0) {
        updateStatus('Validering misslyckades. Se valideringsrapporten.');
        addToRunLog('ERROR', `Validering misslyckades: ${validation.errors.length} fel`);
        output.value = '';
        if (explainOutput) explainOutput.textContent = '';
        return false;
      }

      if (validation.warnings.length > 0) {
        addToRunLog('WARN', `Validering med ${validation.warnings.length} varning(ar)`);
      }

      const baseValue = base.value.trim();
      try {
        const url = new URL(baseValue, window.location.href);
        const params = buildQuery(service.value, {
          bboxValue: validation.normalizedBbox || bbox.value.trim(),
        });
        url.search = params.toString();
        output.value = url.toString();
        updateStatus('URL genererad.');
        addToRunLog('OK', `URL genererad för ${service.value}`);

        if (explainOutput) {
          const explanation = explainRequest(params, service.value.toUpperCase());
          explainOutput.textContent = explanation.join('\n');
        }
        return true;
      } catch (error) {
        updateStatus('Ogiltig bas‑URL.');
        output.value = '';
        addToRunLog('ERROR', 'Kunde inte generera URL: ogiltig bas-URL');
        return false;
      }
    };

    const copyUrl = async () => {
      const text = output.value.trim();
      if (!text) {
        updateStatus('Generera en URL först.');
        return;
      }
      const success = await tryItCopy(text);
      if (success) {
        updateStatus('URL kopierad.');
        addToRunLog('OK', 'URL kopierad till clipboard');
      } else {
        updateStatus('Kunde inte kopiera.');
        addToRunLog('ERROR', 'Kopiering misslyckades');
      }
    };

    const copyCurl = async () => {
      const url = output.value.trim();
      if (!url) {
        updateStatus('Generera en URL först.');
        return;
      }
      const curl = `curl -L "${url}"`;
      const success = await tryItCopy(curl);
      if (success) {
        updateStatus('curl-kommando kopierat.');
        addToRunLog('OK', 'curl-kommando kopierat');
      } else {
        updateStatus('Kunde inte kopiera.');
        addToRunLog('ERROR', 'Kopiering misslyckades');
      }
    };

    const downloadCurl = () => {
      const url = output.value.trim();
      if (!url) {
        updateStatus('Generera en URL först.');
        return;
      }
      const curl = `curl -L "${url}"`;
      tryItDownload('request.curl.txt', curl, 'text/plain');
      updateStatus('curl-kommando nedladdat.');
      addToRunLog('OK', 'curl-kommando nedladdat');
    };

    const fixBbox = () => {
      const validation = validateInputs();
      const report = generateValidationReport(validation);
      setReport(report);

      if (validation.errors.length > 0) {
        updateStatus('Validering misslyckades. Se valideringsrapporten.');
        addToRunLog('ERROR', `Fixa BBOX misslyckades: ${validation.errors.length} fel`);
        return;
      }

      if (validation.normalizedBbox) {
        bbox.value = validation.normalizedBbox;
        updateStatus('BBOX normaliserad.');
        addToRunLog('OK', 'BBOX normaliserad');
      } else {
        updateStatus('BBOX behöver inte normaliseras.');
        addToRunLog('INFO', 'BBOX redan normaliserad');
      }
    };

    const exportTXT = () => {
      const url = output.value.trim();
      if (!url) {
        updateStatus('Generera en URL först.');
        return;
      }

      let content = '═══ URL BUILDER EXPORT ═══\n\n';
      content += `Tidpunkt: ${new Date().toLocaleString('sv-SE')}\n\n`;
      content += '─── URL ───\n';
      content += `${url}\n\n`;

      if (reportOutput && reportOutput.textContent.trim()) {
        content += '─── Valideringsrapport ───\n';
        content += `${reportOutput.textContent}\n\n`;
      }

      if (explainOutput && explainOutput.textContent.trim()) {
        content += '─── Explain request ───\n';
        content += `${explainOutput.textContent}\n\n`;
      }

      tryItDownload('urlbuilder.txt', content, 'text/plain');
      updateStatus('TXT-fil exporterad.');
      addToRunLog('OK', 'TXT-fil exporterad');
    };

    buttons.forEach((button) => {
      button.addEventListener('click', async () => {
        const action = button.dataset.urlAction;
        if (action === 'generate') {
          generate();
        } else if (action === 'copy') {
          copyUrl();
        } else if (action === 'copy-curl') {
          copyCurl();
        } else if (action === 'download-curl') {
          downloadCurl();
        } else if (action === 'export-txt') {
          exportTXT();
        } else if (action === 'fix-bbox') {
          fixBbox();
        } else if (action === 'open') {
          const validation = validateInputs();
          const report = generateValidationReport(validation);
          setReport(report);
          if (validation.errors.length > 0) {
            updateStatus('Validering misslyckades. Se valideringsrapporten.');
            addToRunLog('ERROR', `Öppna blockerat: ${validation.errors.length} fel`);
            return;
          }

          if (!output.value.trim()) {
            const generated = generate();
            if (!generated) return;
          }

          const url = output.value.trim();
          window.open(url, '_blank', 'noopener,noreferrer');
          updateStatus('Öppnade URL i ny flik.');
          addToRunLog('INFO', 'Öppnade URL i ny flik');
        } else if (action === 'test') {
          try {
            if (window.location.protocol === 'file:') {
              updateStatus('Kör via http.server för att testa URL (file:// blockeras).');
              addToRunLog('WARN', 'Test blockerat: file:// används');
              return;
            }

            const validation = validateInputs();
            const report = generateValidationReport(validation);
            setReport(report);
            if (validation.errors.length > 0) {
              updateStatus('Validering misslyckades. Se valideringsrapporten.');
              addToRunLog('ERROR', `Test blockerat: ${validation.errors.length} fel`);
              return;
            }

            if (!output.value.trim()) {
              const generated = generate();
              if (!generated) return;
            }

            const url = new URL(output.value.trim(), window.location.href);

            if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
              updateStatus(
                'Det här pekar på localhost. Starta GeoServer lokalt eller byt bas-URL för att testa.',
              );
              addToRunLog('WARN', 'Test blockerat: localhost-URL');
              return;
            }

            updateStatus('Testar…');
            addToRunLog('INFO', 'Testar URL');

            const t0 = performance.now();
            let res;
            try {
              res = await fetch(url.toString(), { method: 'GET' });
            } catch (error) {
              updateStatus('CORS blocked; open in new tab or test from server environment.');
              addToRunLog('ERROR', 'CORS-blockerat test');
              return;
            }

            const ms = Math.round(performance.now() - t0);
            const ct = res.headers.get('content-type') || 'okänt';
            const msg = `Svar: ${res.status} ${res.statusText} • ${ms} ms • ${ct}`;
            updateStatus(msg);
            addToRunLog('OK', `Test slutförd: ${res.status} (${ms}ms)`);
          } catch (error) {
            updateStatus('CORS blocked; open in new tab or test from server environment.');
            addToRunLog('ERROR', 'Test misslyckades: CORS/nätverksfel');
          }
        }
      });
    });

    // Advanced mode toggle
    if (advancedToggle) {
      advancedToggle.addEventListener('change', () => {
        const enabled = advancedToggle.checked;
        tryItShowAdvanced(TOOL_KEY, enabled);
        addToRunLog('INFO', `Advanced mode ${enabled ? 'aktiverad' : 'inaktiverad'}`);
      });
    }

    // Initialize
    addToRunLog('INFO', 'URL-builder initierat');
  };

  tryItBlocks.forEach((block) => {
    const type = block.dataset.tryit;
    if (type === 'json') {
      initJsonTryIt(block);
    } else if (type === 'mapsandbox') {
      initMapSandbox(block);
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
  const TILE_SIZE = 256;

  const reportEl = document.getElementById('gridset-validation');
  const logEl = document.getElementById('gridset-runlog');
  const outputEl = document.getElementById('gridset-output');

  let gridsetRunLog = [];
  let lastGridsetData = null;
  let workflowInitialized = false;

  const addToGridsetLog = (level, message) => {
    if (!logEl) return;
    const timestamp = new Date().toLocaleTimeString('sv-SE');
    gridsetRunLog.push(`[${timestamp}] [${level}] ${message}`);
    if (gridsetRunLog.length > 20) gridsetRunLog.shift();
    logEl.textContent = gridsetRunLog.join('\n');
    logEl.scrollTop = logEl.scrollHeight;
  };

  const setReport = (lines) => {
    if (!reportEl) return;
    reportEl.textContent = lines.join('\n');
  };

  const setOutput = (text) => {
    if (!outputEl) return;
    outputEl.textContent = text;
  };

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
    ol?.proj?.proj4 &&
    typeof ol.proj.proj4.register === 'function' &&
    typeof proj4?.defs === 'function';

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

  // Ensure map container has dimensions before initializing
  const targetRect = mapTarget.getBoundingClientRect();
  if (targetRect.width === 0 || targetRect.height === 0) {
    console.warn('Map container has zero dimensions, skipping map initialization');
    setUiStatus('Väntar på att karta-containern ska bli synlig...');
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
    layers: [new ol.layer.Tile({ source: new ol.source.OSM() }), vectorLayer],
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
    const tilesX = Math.ceil(width / (resolution * TILE_SIZE));
    const tilesY = Math.ceil(height / (resolution * TILE_SIZE));
    const totalTiles = tilesX * tilesY;

    const elExtent = document.getElementById('gridset-info-extent');
    const elBbox = document.getElementById('gridset-info-bbox');
    const elZoom = document.getElementById('gridset-info-zoom');
    const elTiles = document.getElementById('gridset-info-tiles');

    const reportLines = [];
    const issues = [];

    reportLines.push('═══ GRIDSET VALIDERING ═══');
    reportLines.push('');
    reportLines.push(`CRS: ${EPSG3006}`);
    reportLines.push(`Tile size: ${TILE_SIZE}px`);
    reportLines.push(`Extent: ${extent.name}`);
    reportLines.push(`Bounds: ${minx}, ${miny}, ${maxx}, ${maxy}`);
    reportLines.push(
      `Width/Height: ${width.toLocaleString('sv-SE')} m / ${height.toLocaleString('sv-SE')} m`,
    );
    reportLines.push(`Zoom: ${typeof zoom === 'number' ? zoom.toFixed(2) : '—'}`);
    reportLines.push(`Resolution: ${resolution.toFixed(4)} m/px`);
    reportLines.push(`Tiles: ${tilesX} × ${tilesY} = ${totalTiles}`);
    reportLines.push('');
    reportLines.push('Kontroller:');

    if (![minx, miny, maxx, maxy].every((val) => Number.isFinite(val))) {
      issues.push('[ERROR] BBOX måste innehålla 4 giltiga tal');
    } else {
      reportLines.push('[OK] BBOX har 4 giltiga tal');
    }

    if (minx >= maxx || miny >= maxy) {
      issues.push('[ERROR] Min måste vara mindre än Max för X/Y');
    } else {
      reportLines.push('[OK] Min/Max är korrekta för X/Y');
    }

    if (width <= 0 || height <= 0) {
      issues.push('[ERROR] BBOX-bredd/höjd måste vara > 0');
    } else {
      reportLines.push('[OK] BBOX-bredd/höjd är > 0');
    }

    if (!Number.isFinite(resolution) || resolution <= 0) {
      issues.push('[ERROR] Resolution måste vara > 0');
    } else {
      reportLines.push('[OK] Resolution > 0');
    }

    if (!Number.isFinite(tilesX) || !Number.isFinite(tilesY) || tilesX <= 0 || tilesY <= 0) {
      issues.push('[ERROR] Tiles X/Y måste vara positiva heltal');
    } else {
      reportLines.push('[OK] Tiles X/Y är positiva heltal');
    }

    if (issues.length > 0) {
      reportLines.push('');
      reportLines.push(`Status: [ERROR] ${issues.length} problem`);
      reportLines.push(...issues);
    } else {
      reportLines.push('');
      reportLines.push('Status: [OK] Inga problem upptäckta');
    }

    setReport(reportLines);

    lastGridsetData = {
      extentKey,
      extentName: extent.name,
      bounds: { minx, miny, maxx, maxy },
      width,
      height,
      zoom,
      resolution,
      tilesX,
      tilesY,
      totalTiles,
    };

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

  const initGridsetWorkflow = () => {
    if (workflowInitialized) return;
    workflowInitialized = true;

    const copyBtn = document.querySelector('[data-gridset-action="copy-bbox"]');
    const sendBtn = document.querySelector('[data-gridset-action="send-to-urlbuilder"]');
    const exportGeoBtn = document.querySelector('[data-gridset-action="export-geojson"]');
    const exportTxtBtn = document.querySelector('[data-gridset-action="export-txt"]');
    const copyGridsetBtn = document.querySelector('[data-gridset-action="copy-gridset"]');
    const sendToGridcalcBtn = document.querySelector('[data-gridset-action="send-to-gridcalc"]');
    const bboxEl = document.getElementById('gridset-info-bbox');

    const getBbox = () => (bboxEl?.textContent || '').trim();
    const getBboxForUrlBuilder = () => {
      const extent = extents[activeExtentKey];
      if (!extent || !Array.isArray(extent.bounds) || extent.bounds.length !== 4) return '';
      const [minx, miny, maxx, maxy] = extent.bounds;
      return `${minx},${miny},${maxx},${maxy}`;
    };

    const ensureData = () => {
      if (!lastGridsetData) {
        addToGridsetLog('WARN', 'Ingen data att använda ännu.');
        return false;
      }
      return true;
    };

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const bbox = getBbox();
        if (!bbox || bbox === '—') return;

        const original = copyBtn.textContent;

        try {
          await navigator.clipboard.writeText(bbox);
          copyBtn.textContent = 'Kopierat!';
          addToGridsetLog('OK', 'BBOX kopierad');
        } catch {
          copyBtn.textContent = 'Kunde inte kopiera';
          addToGridsetLog('ERROR', 'Kopiering misslyckades');
        }

        window.setTimeout(() => {
          copyBtn.textContent = original;
        }, 1200);
      });
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        const bbox = getBboxForUrlBuilder();
        if (!bbox) return;

        const urlBbox = document.getElementById('urlbuilder-bbox');
        const urlCrs = document.getElementById('urlbuilder-crs');

        if (urlBbox) urlBbox.value = bbox;
        if (urlCrs) urlCrs.value = 'EPSG:3006';

        addToGridsetLog('OK', 'Skickad till URL builder');
        const target = document.getElementById('urlbuilder');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    if (exportGeoBtn) {
      exportGeoBtn.addEventListener('click', () => {
        if (!ensureData()) return;
        const { bounds } = lastGridsetData;
        const geojson = {
          type: 'FeatureCollection',
          crs: { type: 'name', properties: { name: EPSG3006 } },
          features: [
            {
              type: 'Feature',
              properties: { extentName: lastGridsetData.extentName },
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [bounds.minx, bounds.miny],
                    [bounds.maxx, bounds.miny],
                    [bounds.maxx, bounds.maxy],
                    [bounds.minx, bounds.maxy],
                    [bounds.minx, bounds.miny],
                  ],
                ],
              },
            },
          ],
        };

        try {
          const blob = new Blob([JSON.stringify(geojson, null, 2)], {
            type: 'application/geo+json',
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'gridset-extent.geojson';
          a.click();
          URL.revokeObjectURL(url);
          addToGridsetLog('OK', 'GeoJSON exporterad');
        } catch {
          addToGridsetLog('ERROR', 'GeoJSON-export misslyckades');
        }
      });
    }

    if (exportTxtBtn) {
      exportTxtBtn.addEventListener('click', () => {
        if (!ensureData()) return;
        const d = lastGridsetData;
        const txt = [
          '═══ GRIDSET EXTENT REPORT ═══',
          '',
          `Extent: ${d.extentName}`,
          `CRS: ${EPSG3006}`,
          `BBOX: ${d.bounds.minx},${d.bounds.miny},${d.bounds.maxx},${d.bounds.maxy}`,
          `Zoom: ${typeof d.zoom === 'number' ? d.zoom.toFixed(2) : '—'}`,
          `Resolution: ${d.resolution.toFixed(4)} m/px`,
          `Tiles: ${d.tilesX} × ${d.tilesY} = ${d.totalTiles}`,
          `Timestamp: ${new Date().toLocaleString('sv-SE')}`,
        ].join('\n');

        try {
          const blob = new Blob([txt], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'gridset-extent.txt';
          a.click();
          URL.revokeObjectURL(url);
          addToGridsetLog('OK', 'TXT exporterad');
        } catch {
          addToGridsetLog('ERROR', 'TXT-export misslyckades');
        }
      });
    }

    if (copyGridsetBtn) {
      copyGridsetBtn.addEventListener('click', async () => {
        if (!ensureData()) return;
        const d = lastGridsetData;
        const snippet = {
          example: true,
          extentName: d.extentName,
          crs: EPSG3006,
          bbox: [d.bounds.minx, d.bounds.miny, d.bounds.maxx, d.bounds.maxy],
          tileSize: TILE_SIZE,
        };
        const snippetText = JSON.stringify(snippet, null, 2);
        setOutput(snippetText);

        try {
          if (typeof window.tryItCopy === 'function') {
            await window.tryItCopy(snippetText);
          } else if (typeof copyText === 'function') {
            await copyText(snippetText);
          }
          addToGridsetLog('OK', 'Gridset-snippet kopierat');
        } catch {
          addToGridsetLog('ERROR', 'Kunde inte kopiera gridset-snippet');
        }
      });
    }

    if (sendToGridcalcBtn) {
      sendToGridcalcBtn.addEventListener('click', () => {
        if (!ensureData()) return;
        const d = lastGridsetData;
        const gridcalcWidth = document.getElementById('gridcalc-bboxwidth');
        const gridcalcHeight = document.getElementById('gridcalc-bboxheight');

        if (gridcalcWidth) gridcalcWidth.value = Math.round(d.width).toString();
        if (gridcalcHeight) gridcalcHeight.value = Math.round(d.height).toString();

        addToGridsetLog('INFO', 'Skickade BBOX-bredd/höjd till Gridcalc');
        if (typeof window.tryItLog === 'function') {
          window.tryItLog('gridcalc', 'INFO', 'Received bbox width/height from Gridset Explorer');
        }

        const gridcalcSection = document.getElementById('gridcalc');
        if (gridcalcSection) gridcalcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (gridcalcWidth) gridcalcWidth.focus();
      });
    }
  };

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
    addToGridsetLog('INFO', `Extent ändrad: ${extent.name}`);
  };

  container.querySelectorAll('[data-extent-action]').forEach((button) => {
    button.addEventListener('click', () => applyExtent(button.dataset.extentAction));
  });

  view.on('change:resolution', () => updateInfo(activeExtentKey));
  view.on('change:center', () => updateInfo(activeExtentKey));

  initGridsetWorkflow();
  addToGridsetLog('INFO', 'Gridset Explorer initierat');

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
