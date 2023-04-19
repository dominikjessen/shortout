function changeBgColor(color: string): void {
  document.body.style.backgroundColor = color;
}

chrome.action.onClicked.addListener((tab) => {
  const color = 'blue';
  chrome.scripting
    .executeScript({
      target: { tabId: tab.id ? tab.id : -1 },
      func: changeBgColor,
      args: [color]
    })
    .then();
});
