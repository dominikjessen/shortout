// TODO: Bug - works only on refresh or when opening YT but not when navigating between pages
function hideShortsSectionFromHomePage() {
  const shortsSectionElement = document.querySelector('ytd-rich-shelf-renderer[is-shorts]')?.closest('ytd-rich-section-renderer') as HTMLElement;
  shortsSectionElement.remove();
}

// TODO: Bug - sometimes the refrehs doesn't seem to work correctly
// This removes all shorts whenever they're added to the DOM immediately unless they're whitelisted
function hideShortsFromSubscriptionsGridPage(nodeToObserve: Element | Document) {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      const newShorts = [...mutation.addedNodes].filter((node) => {
        if (
          node instanceof HTMLElement &&
          node.nodeName === 'YTD-THUMBNAIL-OVERLAY-TIME-STATUS-RENDERER' &&
          node.getAttribute('overlay-style') === 'SHORTS'
        ) {
          return node;
        }
      }) as HTMLElement[];
      const removalArray = newShorts.map((node) => node.closest('ytd-grid-video-renderer')) as HTMLElement[];

      retainWhitelistedChannels(removalArray).then((cleanedList: HTMLElement[]) => {
        if (cleanedList.length > 0) {
          cleanedList.forEach((node) => node?.remove());
        }
      });
    });
  });

  // Start observing the base node for mutations.
  observer.observe(nodeToObserve, { childList: true, subtree: true });
}

/*
 ** This function cleans out any whitelisted channel from the array we want to remove elements from
 ** Note that the <shorts> array has to have a 'ytd-channel-name' in its DOM tree to find something
 */
async function retainWhitelistedChannels(shorts: HTMLElement[]): Promise<HTMLElement[]> {
  if (shorts.length <= 0) {
    return shorts;
  }

  const userStorage = await chrome.storage.local.get('whitelist');
  const userWhitelist = userStorage?.whitelist;

  if (userWhitelist.length <= 0) {
    return shorts;
  }

  let whitelistCleaned: HTMLElement[] = [];

  for (let str of userWhitelist) {
    whitelistCleaned = shorts.filter((element) => {
      const channelNameElement = element.querySelector('ytd-channel-name') as HTMLElement;
      return channelNameElement?.innerText.includes(str) ? false : true;
    });

    // Make sure to not check other strings if a match was found to not override whitelistCleaned again
    if (whitelistCleaned.length === 0) {
      break;
    }
  }

  return whitelistCleaned;
}

function hideShortsFromSubscriptionsListPage() {
  // TODO
}

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
