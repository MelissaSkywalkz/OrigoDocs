const initNavigation = () => {
  const body = document.body;
  const toggleButtons = document.querySelectorAll('[data-nav-toggle]');
  const mediaQuery = window.matchMedia('(max-width: 960px)');

  const setCollapsed = (collapsed) => {
    body.classList.toggle('nav-collapsed', collapsed);
    toggleButtons.forEach((button) => {
      button.setAttribute('aria-expanded', (!collapsed).toString());
    });
  };

  const handleToggle = () => {
    setCollapsed(!body.classList.contains('nav-collapsed'));
  };

  toggleButtons.forEach((button) => {
    button.addEventListener('click', handleToggle);
  });

  const handleMediaChange = () => {
    if (mediaQuery.matches) {
      setCollapsed(true);
    }
  };

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
          'Ladda om kartan med hård refresh.'
        ],
        links: [
          { label: 'Seed / Truncate / Bypass – skillnaden', href: '#seed-truncate-bypass' },
          { label: 'Praktisk checklista', href: '#checklista' },
          { label: 'Stale tiles', href: '#stale-tiles' }
        ],
        escalate: [
          'Felet kvarstår efter truncate och ny seed.',
          'Loggar visar återkommande renderingsfel.'
        ]
      },
      {
        key: 'offset-tiles',
        label: 'Tiles hamnar fel / offset',
        startHere: [
          'Kontrollera gridset och CRS (EPSG:3008).',
          'Verifiera origin och matrixset i gridset.',
          'Testa samma lager i WMS 1.1.1.'
        ],
        links: [
          { label: 'CRS & gridsets', href: '#crs-gridset' },
          { label: 'Gridset, origin och matrixset', href: '#gridset-origin' },
          { label: 'Begrepp (enkelt)', href: '#begrepp' }
        ],
        escalate: ['Offset kvarstår efter gridset/CRS-kontroll.']
      },
      {
        key: 'holes-tiles',
        label: 'Tomma tiles eller “hål”',
        startHere: [
          'Testa annan zoomnivå i klienten.',
          'Kontrollera datatäckning och BBOX.',
          'Se om lagret ritar i Layer Preview.'
        ],
        links: [
          { label: 'Tile cache 101', href: '#tile-cache-101' },
          { label: 'Seeding och REST-anrop', href: '#seeding-rest' },
          { label: 'Praktisk checklista', href: '#checklista' }
        ],
        escalate: ['Tomma tiles även i Layer Preview.']
      },
      {
        key: 'slow-seed',
        label: 'Långsam rendering / seeding',
        startHere: [
          'Seeda mindre område och färre zoomnivåer.',
          'Kontrollera datakällans prestanda.',
          'Granska om stilen är tung.'
        ],
        links: [
          { label: 'Seeding och REST-anrop', href: '#seeding-rest' },
          { label: 'Metastore och disk quota', href: '#metastore-disk' },
          { label: 'Vanliga misstag', href: '#vanliga-misstag' }
        ],
        escalate: ['Seeding är fortsatt långsam på små ytor.']
      },
      {
        key: 'slow-external',
        label: 'Extern WMS är långsam',
        startHere: [
          'Mät svarstid direkt mot WMS-url.',
          'Cachea som proxy-lager om möjligt.',
          'Begränsa BBOX och zoomnivåer.'
        ],
        links: [
          { label: 'Cacheability och parametrar', href: '#cacheability' },
          { label: 'Hur GeoWebCache hänger ihop med GeoServer', href: '#geoserver-koppling' },
          { label: 'Klientperspektiv', href: '#klientperspektiv' }
        ],
        escalate: ['Extern tjänst är långsam även utan cache.']
      },
      {
        key: 'client-or-server',
        label: 'Osäker om felet är klient eller server',
        startHere: [
          'Testa lagret i GeoServer Layer Preview.',
          'Testa WMS direkt i webbläsaren.',
          'Jämför resultat i Origo och preview.'
        ],
        links: [
          { label: 'Klientperspektiv', href: '#klientperspektiv' },
          { label: 'Hur GeoWebCache hänger ihop med GeoServer', href: '#geoserver-koppling' },
          { label: 'Tile cache 101', href: '#tile-cache-101' }
        ],
        escalate: ['Skillnaden mellan klient och server går inte att isolera.']
      }
    ]
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
          'Kontrollera att formatet är SE 1.1.'
        ],
        links: [
          { label: 'Import och namespaces', href: '#sld-import' },
          { label: 'SLD Cookbook', href: '#sld-cookbook' },
          { label: 'Välj rätt format', href: '#format' }
        ],
        escalate: ['Import misslyckas även med minimal SLD.']
      },
      {
        key: 'sld-no-render',
        label: 'SLD importeras men syns inte',
        startHere: [
          'Verifiera datatyp mot symbolizer.',
          'Kontrollera Min/MaxScaleDenominator.',
          'Testa en enkel style utan filter.'
        ],
        links: [
          { label: 'SLD Cookbook', href: '#sld-cookbook' },
          { label: 'Skala och synlighet', href: '#sld-scale' },
          { label: 'Parameterguide', href: '#parameterguide' }
        ],
        escalate: ['Inget syns i preview efter förenklad style.']
      },
      {
        key: 'labels-missing',
        label: 'Labels syns inte / ligger fel',
        startHere: [
          'Kontrollera attributnamn i Label.',
          'Justera fontstorlek och placement.',
          'Testa en enkel label utan halo.'
        ],
        links: [
          { label: 'Labels – enkel etikett', href: '#labels' },
          { label: 'Skala och synlighet', href: '#sld-scale' },
          { label: 'Parameterguide', href: '#parameterguide' }
        ],
        escalate: ['Labels syns inte trots förenklad label.']
      },
      {
        key: 'rules-fail',
        label: 'Filter-regler fungerar inte',
        startHere: [
          'Kontrollera filter-syntax och attributnamn.',
          'Testa en regel i taget.',
          'Verifiera datatyper i attributen.'
        ],
        links: [
          { label: 'SLD‑felsökning', href: '#sld-felsokning' },
          { label: 'Parameterguide', href: '#parameterguide' },
          { label: 'SLD Cookbook', href: '#sld-cookbook' }
        ],
        escalate: ['Filter ger fel även med enkel regel.']
      },
      {
        key: 'style-cache',
        label: 'Jag ser gamla stilar',
        startHere: [
          'Rensa cache för lagret i GeoWebCache.',
          'Gör hård refresh i webbläsaren.',
          'Bekräfta att rätt style är aktiv.'
        ],
        links: [
          { label: 'Cache och uppdatering', href: '#sld-cache' },
          { label: 'Översikt', href: '#oversikt' },
          { label: 'Hur detta påverkar kartklienten', href: '#origo-impact' }
        ],
        escalate: ['Stilen uppdateras inte efter cache‑rensing.']
      }
    ]
  }
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

const initSearch = () => {
  const input = document.getElementById('navSearch');
  const results = document.getElementById('searchResults');

  if (!input || !results) {
    return;
  }

  let searchIndex = [];

  fetch('search-index.json')
    .then((response) => (response.ok ? response.json() : []))
    .then((data) => {
      if (Array.isArray(data)) {
        searchIndex = data;
      }
    })
    .catch(() => {
      searchIndex = [];
    });

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

    const codeText = codeBlock.textContent.trim();
    let badgeLabel = 'Kod';

    if (/^<\\?xml/i.test(codeText) || /<se:StyledLayerDescriptor/i.test(codeText) || /<StyledLayerDescriptor/i.test(codeText)) {
      badgeLabel = 'XML';
    } else if (/^[\\[{]/.test(codeText)) {
      badgeLabel = 'JSON';
    } else if (/^(\\$ |npm |git |python )/m.test(codeText)) {
      badgeLabel = 'CLI';
    }

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

        button.textContent = 'Kopierat ✓';
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
    } else if (badgeLabel === 'JSON') {
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
        <li>Om “command not found”: kontrollera att python/node/git är installerat och ligger i PATH.</li>
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

const initGlossary = () => {
  const main = document.querySelector('main');

  if (!main) {
    return;
  }

  fetch('./glossary.json')
    .then((response) => (response.ok ? response.json() : []))
    .then((terms) => {
      if (!Array.isArray(terms) || !terms.length) {
        return;
      }

      const entries = terms.flatMap((term) => {
        const aliases = Array.isArray(term.aliases) ? term.aliases : [];
        const allTerms = [term.term, ...aliases];
        return allTerms.map((label) => ({
          label,
          short: term.short,
          long: term.long || term.short,
          key: term.term
        }));
      });

      entries.sort((a, b) => b.label.length - a.label.length);

      const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = entries.map((entry) => escapeRegex(entry.label)).join('|');
      const regex = new RegExp(`(${pattern})`, 'gi');

      const excludedTags = new Set(['A', 'PRE', 'CODE', 'KBD', 'SAMP', 'SCRIPT', 'STYLE']);
      let tooltipIndex = 0;

      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          if (!node.nodeValue || !node.nodeValue.trim()) {
            return NodeFilter.FILTER_REJECT;
          }

          const parent = node.parentElement;
          if (!parent) {
            return NodeFilter.FILTER_REJECT;
          }

          if (parent.closest('.glossary-item')) {
            return NodeFilter.FILTER_REJECT;
          }

          if (parent.closest('pre, code, kbd, samp, script, style, a')) {
            return NodeFilter.FILTER_REJECT;
          }

          if (excludedTags.has(parent.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      });

      const nodes = [];
      while (walker.nextNode()) {
        nodes.push(walker.currentNode);
      }

      nodes.forEach((node) => {
        const text = node.nodeValue;
        if (!regex.test(text)) {
          return;
        }

        regex.lastIndex = 0;
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
          const matchedText = match[0];
          const matchIndex = match.index;
          const before = text.slice(lastIndex, matchIndex);
          if (before) {
            fragment.appendChild(document.createTextNode(before));
          }

          const entry = entries.find((item) => item.label.toLowerCase() === matchedText.toLowerCase());
          if (!entry) {
            fragment.appendChild(document.createTextNode(matchedText));
            lastIndex = matchIndex + matchedText.length;
            continue;
          }

          tooltipIndex += 1;
          const tooltipId = `glossary-tip-${tooltipIndex}`;
          const wrapper = document.createElement('span');
          wrapper.className = 'glossary-item';

          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'glossary-term';
          button.textContent = matchedText;
          button.setAttribute('aria-describedby', tooltipId);
          button.setAttribute('aria-label', `${entry.key}: ${entry.short}`);
          button.setAttribute('aria-expanded', 'false');

          const tooltip = document.createElement('span');
          tooltip.className = 'glossary-tooltip';
          tooltip.id = tooltipId;
          tooltip.setAttribute('role', 'tooltip');
          tooltip.textContent = entry.short;
          tooltip.dataset.short = entry.short;
          tooltip.dataset.long = entry.long;

          button.addEventListener('click', () => {
            const expanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', (!expanded).toString());
            tooltip.textContent = expanded ? tooltip.dataset.short : tooltip.dataset.long;
          });

          wrapper.appendChild(button);
          wrapper.appendChild(tooltip);
          fragment.appendChild(wrapper);

          lastIndex = matchIndex + matchedText.length;
        }

        const after = text.slice(lastIndex);
        if (after) {
          fragment.appendChild(document.createTextNode(after));
        }

        node.parentNode.replaceChild(fragment, node);
      });
    })
    .catch(() => {});
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
      { rootMargin: '-30% 0px -60% 0px' }
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

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAccordions();
  initSearch();
  initCodeCopy();
  initWizard();
  initGlossary();
  initReleasePlaybook();
  initScrollSpy();
});
