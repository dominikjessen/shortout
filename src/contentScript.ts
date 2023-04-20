chrome.runtime.onMessage.addListener((obj, sender, response) => {
  if (obj.pageType === 'Home') {
    hideShortsSectionFromHomePage();
  }

  if (obj.pageType === 'SubscriptionsGrid') {
    // TODO: It might be better to observe specific nodes
    const nodeToObserve = document.querySelector('ytd-grid-renderer') || document; // fallback to observe entire DOM if can't find node
    hideShortsFromSubscriptionsGridPage(nodeToObserve);
  }

  if (obj.pageType === 'SubscriptionsList') {
    console.log('sub list');
    hideShortsFromSubscriptionsListPage();
  }
});

// TODO: Bug - works only on refresh or when opening YT but not when navigating between pages
function hideShortsSectionFromHomePage() {
  const shortsSectionElement = document.querySelector('ytd-rich-shelf-renderer[is-shorts]')?.closest('ytd-rich-section-renderer') as HTMLElement;
  shortsSectionElement.remove();
}

function hideShortsFromSubscriptionsGridPage(nodeToObserve: Element | Document) {
  // This removes all shorts whenever they're added to the DOM immediately
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      const newShorts = [...mutation.addedNodes].filter((node) => {
        if (
          node instanceof HTMLElement &&
          node.nodeName === 'YTD-THUMBNAIL-OVERLAY-TIME-STATUS-RENDERER' &&
          node.getAttribute('overlay-style') === 'SHORTS'
        ) {
          return node.closest('ytd-grid-video-renderer') as HTMLElement;
        }
      }) as HTMLElement[];

      if (newShorts.length > 0) {
        newShorts.forEach((node) => node.remove());
      }
    });
  });

  // Start observing the base node for mutations.
  observer.observe(nodeToObserve, { childList: true, subtree: true });
}

function hideShortsFromSubscriptionsListPage() {
  // TODO
}
