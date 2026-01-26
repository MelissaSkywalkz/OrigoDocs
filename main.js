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

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAccordions();
  initSearch();
});
