async function constructWhitelistElements() {
  const channels: string[] = await getStoredWhitelistChannels();
  let list = '<ul id="whitelist" >';

  channels.forEach(function (channel: string) {
    list += `<li>${channel}</li>`;
  });

  list += '</ul>';
  document.getElementById('whitelist-container')!.innerHTML += list; // Asserting that this is in the popup html
}

async function getStoredWhitelistChannels(): Promise<string[]> {
  const userWhitelist = await chrome.storage.local.get(['whitelist']);
  return userWhitelist.whitelist;
}

async function whitelistNewChannel() {
  const input = document.getElementById('new-whitelist-input') as HTMLInputElement;
  if (!input.value) return;

  const store = await chrome.storage.local.get(['whitelist']);
  const currentWhitelist = store?.whitelist || [];

  await chrome.storage.local.set({ whitelist: [...currentWhitelist, input.value] });

  document.getElementById('whitelist')!.innerHTML += `<li>${input.value}</li>`; // Asserting that this is in the popup html
}

document.addEventListener('DOMContentLoaded', () => {
  constructWhitelistElements();

  const addBtn = document.getElementById('add-button');
  addBtn?.addEventListener('click', whitelistNewChannel);
});
