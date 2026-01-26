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
    quickChecks: [
      'Testa Layer Preview i GeoServer för att bekräfta att lagret ritar.',
      'Bekräfta att du använder rätt gridset och CRS (t.ex. EPSG:3008).',
      'Testa en annan zoomnivå för att se om felet är nivåspecifikt.',
      'Verifiera att lagret är cache-aktiverat i GeoWebCache.'
    ],
    escalate: [
      'Felet kvarstår efter truncate/seed och kontroll av gridset.',
      'Du ser fel i GeoServer-loggar eller upprepade renderingsfel.',
      'Extern tjänst är långsam även i enkel WMS-preview.'
    ],
    symptoms: [
      {
        id: 'stale-tiles',
        label: 'Jag ser gamla tiles (förändringar syns inte)',
        actions: [
          'Kör truncate för lagret i GeoWebCache.',
          'Seed om endast de zoomnivåer och områden som används.',
          'Verifera att klienten inte cacherar egna tiles.',
          'Testa BBOX med cache-bypass i WMS om möjligt.'
        ],
        check: 'Kontrollera detta: testa samma lager i GeoServer Layer Preview.',
        avoid: 'Undvik detta: seed inte allt på alla zoomar.'
      },
      {
        id: 'offset-tiles',
        label: 'Tiles hamnar fel / offset (grid/projection)',
        actions: [
          'Verifiera att gridset matchar kartans CRS (EPSG:3008).',
          'Kontrollera att layer är publicerat i rätt CRS.',
          'Rensa cache efter CRS/gridset-ändringar.',
          'Säkerställ att Origo använder samma projectionCode.'
        ],
        check: 'Kontrollera detta: testa samma lager i WMS 1.1.1 med rätt CRS.',
        avoid: 'Undvik detta: blanda olika gridset för samma lager.'
      },
      {
        id: 'holes-tiles',
        label: 'Tomma tiles eller “hål” i kartan',
        actions: [
          'Kontrollera datatäckning och BBOX för lagret.',
          'Seed om området med korrekt zoomintervall.',
          'Verifiera att stilen fungerar i GeoServer Preview.',
          'Testa med en förenklad style om möjligt.'
        ],
        check: 'Kontrollera detta: testa annan zoom och panorera över området.',
        avoid: 'Undvik detta: seeda extremt höga zoomnivåer utan behov.'
      },
      {
        id: 'slow-seed',
        label: 'Långsam rendering / seeding tar evigheter',
        actions: [
          'Seeda i mindre geografiska rutor.',
          'Minska antal zoomnivåer som seedas.',
          'Kontrollera att datakällan presterar (index i PostGIS).',
          'Granska style-komplexitet (tunga symbolizers).'
        ],
        check: 'Kontrollera detta: testa att seeda ett litet område.',
        avoid: 'Undvik detta: kör full seed på hela världen.'
      },
      {
        id: 'slow-external',
        label: 'Extern WMS är långsam',
        actions: [
          'Mät svarstid direkt mot den externa WMS-url:en.',
          'Cachea som proxy-lager om möjligt.',
          'Begränsa upplösning och zoomnivåer.',
          'Undvik för stora BBOX i enskilda anrop.'
        ],
        check: 'Kontrollera detta: jämför svarstid med och utan cache.',
        avoid: 'Undvik detta: skicka onödigt stora kartutdrag.'
      },
      {
        id: 'client-or-server',
        label: 'Jag vet inte om felet är klient (Origo) eller server (GeoServer/GWC)',
        actions: [
          'Testa lagret i GeoServer Layer Preview.',
          'Testa samma lager i Origo med cache-bypass om möjligt.',
          'Jämför resultat mellan WMS och cache-lager.',
          'Kontrollera nätverksflödet i webbläsarens devtools.'
        ],
        check: 'Kontrollera detta: isolera felet genom att testa WMS direkt.',
        avoid: 'Undvik detta: ändra flera inställningar samtidigt.'
      }
    ]
  },
  'geoserver-styles': {
    quickChecks: [
      'Testa stilen i GeoServer Layer Preview.',
      'Säkerställ att rätt style är kopplad som default.',
      'Kontrollera att lagret och stilen matchar datatyp.',
      'Bekräfta att SLD/SE-versionen är korrekt.'
    ],
    escalate: [
      'Stilen laddas inte trots ren XML och korrekt format.',
      'Inget syns i preview efter flera validerade ändringar.',
      'Loggar visar upprepade schema- eller renderingsfel.'
    ],
    symptoms: [
      {
        id: 'sld-import-fail',
        label: 'SLD importeras inte (XML/schema-fel)',
        actions: [
          'Validera XML-strukturen och namespaces.',
          'Använd SE 1.1 och rätt schemaLocation.',
          'Kontrollera att filen är ren UTF-8 utan extra tecken.',
          'Testa att importera en minimal referensstyle.'
        ]
      },
      {
        id: 'sld-no-render',
        label: 'SLD importeras men inget syns på kartan',
        actions: [
          'Verifiera datatyp (point/line/polygon) mot symbolizer.',
          'Kontrollera Min/MaxScaleDenominator.',
          'Testa en enkel färg/linjestil utan filter.',
          'Bekräfta att rätt style är aktiv på lagret.'
        ]
      },
      {
        id: 'labels-missing',
        label: 'Labels syns inte eller ligger fel',
        actions: [
          'Kontrollera att rätt attribut används i Label.',
          'Justera fontstorlek och halo/placement.',
          'Testa med större text och enklare placement.',
          'Verifiera att data faktiskt har värden.'
        ]
      },
      {
        id: 'rules-fail',
        label: 'Rule-baserad styling fungerar inte (filter)',
        actions: [
          'Dubbelkolla filter-syntax och attributnamn.',
          'Testa en regel i taget.',
          'Kontrollera att datatypen matchar filtervillkoret.',
          'Verifiera med en enklare OGC-filterregel.'
        ]
      },
      {
        id: 'style-cache',
        label: 'Jag ser gamla stilar (cache)',
        actions: [
          'Rensa cache i GeoWebCache för lagret.',
          'Testa med cache-bypass i WMS.',
          'Uppdatera kartan med hård refresh.',
          'Bekräfta att rätt style-version är aktiv.'
        ]
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
  const wizards = document.querySelectorAll('[data-wizard]');

  wizards.forEach((wizard) => {
    const wizardId = wizard.getAttribute('data-wizard');
    const config = WIZARD_DATA[wizardId];

    if (!config) {
      return;
    }

    const optionsContainer = wizard.querySelector('[data-wizard-options]');
    const actionsContainer = wizard.querySelector('[data-wizard-actions]');
    const quickContainer = wizard.querySelector('[data-wizard-quick]');
    const escalateContainer = wizard.querySelector('[data-wizard-escalate]');
    const checkContainer = wizard.querySelector('[data-wizard-check]');
    const avoidContainer = wizard.querySelector('[data-wizard-avoid]');

    if (!optionsContainer || !actionsContainer || !quickContainer || !escalateContainer) {
      return;
    }

    const storageKey = `wizard-selection-${wizardId}`;
    const defaultSymptom = config.symptoms[0];
    const savedId = localStorage.getItem(storageKey);
    let activeSymptom = config.symptoms.find((item) => item.id === savedId) || defaultSymptom;

    const renderList = (container, items) => {
      container.innerHTML = '';
      items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        container.appendChild(li);
      });
    };

    renderList(quickContainer, config.quickChecks);
    renderList(escalateContainer, config.escalate);

    const renderActions = (symptom) => {
      actionsContainer.innerHTML = '';
      symptom.actions.forEach((action) => {
        const li = document.createElement('li');
        li.textContent = action;
        actionsContainer.appendChild(li);
      });

      if (checkContainer) {
        checkContainer.textContent = symptom.check ? symptom.check : '';
        checkContainer.classList.toggle('hidden', !symptom.check);
      }

      if (avoidContainer) {
        avoidContainer.textContent = symptom.avoid ? symptom.avoid : '';
        avoidContainer.classList.toggle('hidden', !symptom.avoid);
      }
    };

    const updateActive = (symptomId) => {
      const nextSymptom = config.symptoms.find((item) => item.id === symptomId);
      if (!nextSymptom) {
        return;
      }

      activeSymptom = nextSymptom;
      localStorage.setItem(storageKey, symptomId);
      renderActions(activeSymptom);
      optionsContainer.querySelectorAll('.wizard-option').forEach((button) => {
        const isActive = button.dataset.symptom === symptomId;
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
      button.dataset.symptom = symptom.id;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => updateActive(symptom.id));
      optionsContainer.appendChild(button);
    });

    updateActive(activeSymptom.id);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAccordions();
  initSearch();
  initCodeCopy();
  initWizard();
});
