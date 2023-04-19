function hideShortsFromSubscriptionsPage(): void {
  // Note this querySelector could break if YT changes their page structure
  const shortsGridElements = [...document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]')].map((element) =>
    element.closest('ytd-grid-video-renderer')
  );

  // TODO: In the future I could do something with these shorts, like saving them to a bin in the extension
  shortsGridElements.forEach((short) => short?.remove());
}

chrome.action.onClicked.addListener((tab) => {
  if (tab.url !== 'https://www.youtube.com/feed/subscriptions') {
    console.log(`This isn't YouTube, dummy!`);
    return;
  }

  chrome.scripting
    .executeScript({
      target: { tabId: tab.id ? tab.id : -1 },
      func: hideShortsFromSubscriptionsPage
    })
    .then();
});
