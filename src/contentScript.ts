// This removes all shorts whenever they're added to the DOM immediately unless they're whitelisted
function hideShortsFromSubscriptionsGridPage(nodeToObserve: Element) {
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
 ** Note that the shorts array has to have a 'ytd-channel-name' in its DOM tree to find something
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

async function onReady(obj: any) {
  if (obj.pageType === 'Other' || obj.pageType === 'Search' || obj.pageType === 'Home' || obj.pageType === 'SubscriptionsList') return;

  if (obj.pageType === 'SubscriptionsGrid') {
    const store = await chrome.storage.local.get(['tabExtensionActiveStates']);
    const tabExtensionActiveStates = store.tabExtensionActiveStates;
    let extensionActiveForThisTab = tabExtensionActiveStates[obj.tabId];

    // If not in list, add with 'active' true and hide
    // else tell popup.ts to uncheck the toggle and set 'inactive' for this tab and return
    if (extensionActiveForThisTab === null || extensionActiveForThisTab === undefined) {
      extensionActiveForThisTab = true;
      tabExtensionActiveStates[obj.tabId] = extensionActiveForThisTab;
      await chrome.storage.local.set({ tabExtensionActiveStates: tabExtensionActiveStates });
    }

    if (extensionActiveForThisTab) {
      const nodeToObserve = document.body; // If checking for a specific node, due to YT rendering sometimes doesn't work
      hideShortsFromSubscriptionsGridPage(nodeToObserve);
    }
  }
}

chrome.runtime.onMessage.addListener(async (obj, _sender, _response) => {
  onReady(obj);
});
