function hideShortsFromSubscriptionsPage(): void {
  // Note this querySelector could break if YT changes their page structure
  const shortsGridElements = [...document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]')].map((element) =>
    element.closest('ytd-grid-video-renderer')
  );

  // TODO: In the future I could do something with these shorts, like saving them to a bin in the extension
  shortsGridElements.forEach((short) => short?.remove());
}

function hideShortsSectionFromHomePage(): void {
  const shortsSectionElement = document.querySelector('ytd-rich-shelf-renderer[is-shorts]')?.closest('ytd-rich-section-renderer');
  shortsSectionElement?.remove();
}

chrome.action.onClicked.addListener((tab) => {
  let funcToCall = function () {};
  if (!tab.url?.includes('youtube.com')) {
    console.log(`This isn't YouTube, dummy!`);
    return;
  }

  if (tab.url.includes('subscriptions')) {
    funcToCall = hideShortsFromSubscriptionsPage;
  } else if (tab.url === 'https://www.youtube.com/') {
    funcToCall = hideShortsSectionFromHomePage;
  }

  chrome.scripting
    .executeScript({
      target: { tabId: tab.id ? tab.id : -1 },
      func: funcToCall
    })
    .then();
});
