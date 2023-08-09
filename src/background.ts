interface ChromeLocalStore {
  whitelist: string[];
  tabExtensionActiveStates: {
    [key: number]: boolean;
  };
}

async function getCurrentChromeStore(): Promise<ChromeLocalStore> {
  const chromeLocalStore = (await chrome.storage.local.get(null)) as ChromeLocalStore;
  if (chromeLocalStore.whitelist === null || chromeLocalStore.whitelist === undefined) {
    chromeLocalStore.whitelist = [];
    await chrome.storage.local.set({ whitelist: [] });
  }
  if (chromeLocalStore.tabExtensionActiveStates === null || chromeLocalStore.tabExtensionActiveStates === undefined) {
    chromeLocalStore.tabExtensionActiveStates = {};
    await chrome.storage.local.set({ tabExtensionActiveStates: {} });
  }

  return chromeLocalStore;
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status == 'complete' && tab.active && tab.url?.includes('youtube.com')) {
    await getCurrentChromeStore(); // Make sure Chrome Storage is init'd correctly
    let pageType;
    if (tab.url?.includes('subscriptions')) {
      pageType = 'SubscriptionsGrid';
    } else if (tab.url?.includes('/results')) {
      pageType = 'Search';
    } else if (tab.url === 'https://www.youtube.com/') {
      pageType = 'Home';
    } else {
      pageType = 'Other';
    }

    chrome.tabs.sendMessage(tabId, {
      tabId: tabId,
      pageType: pageType
    });
  }
});

chrome.tabs.onRemoved.addListener(async (tabId, _removeInfo) => {
  const { tabExtensionActiveStates } = await getCurrentChromeStore();
  if (tabExtensionActiveStates.hasOwnProperty(tabId)) {
    delete tabExtensionActiveStates[tabId];
    await chrome.storage.local.set({ tabExtensionActiveStates: tabExtensionActiveStates });
  }
});
