chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // NOTE: not sure if this should be somewhere else for perf?
  // Init store
  const chromeLocalStore = await chrome.storage.local.get(null);
  if (chromeLocalStore.whitelist === null || chromeLocalStore.whitelist === undefined) {
    await chrome.storage.local.set({ whitelist: [] });
  }
  if (chromeLocalStore.tabExtensionActiveStates === null || chromeLocalStore.tabExtensionActiveStates === undefined) {
    await chrome.storage.local.set({ tabExtensionActiveStates: {} });
  }

  if (changeInfo.status == 'complete' && tab.active && tab.url?.includes('youtube.com')) {
    let pageType;
    if (tab.url?.includes('subscriptions')) {
      pageType = 'SubscriptionsGrid';
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
