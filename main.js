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

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAccordions();
});
