chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status == 'complete' && tab.active && tab.url?.includes('youtube.com')) {
    let pageType;
    if (tab.url?.includes('subscriptions')) {
      pageType = 'SubscriptionsGrid';
    } else if (tab.url === 'https://www.youtube.com/') {
      pageType = 'Home';
    }

    chrome.tabs.sendMessage(tabId, {
      pageType: pageType
    });
  }
});
