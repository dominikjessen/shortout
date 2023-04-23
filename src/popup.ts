function createWhitelistBaseElement() {
  const list = document.createElement('ul');
  list.setAttribute('id', 'whitelist');
  list.classList.add('list-disc');
  // const list = '<ul id="whitelist" class="list-desc"></ul>';
  document.getElementById('whitelist-container')!.appendChild(list); // Asserting that this is in the popup html
}

async function constructWhitelistElements() {
  const channels: string[] = await getStoredWhitelistChannels();
  if (channels.length > 0) {
    createWhitelistBaseElement();
    // let itemsForList = '';
    const whitelistElement = document.getElementById('whitelist');

    channels.forEach(function (channel: string) {
      const listItem = document.createElement('li');
      listItem.classList.add('flex', 'text-green-200', 'text-bold', 'border-2', 'border-slate-200', 'px-12', 'py-8');
      listItem.textContent = channel;
      whitelistElement?.appendChild(listItem);

      // itemsForList += `<li class="flex text-green text-bold">${channel}</li>`;
    });

    // document.getElementById('whitelist')!.innerHTML += itemsForList; // Asserting that this is in the popup html
  }
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
  if (currentWhitelist.length === 0) {
    createWhitelistBaseElement();
  }

  await chrome.storage.local.set({ whitelist: [...currentWhitelist, input.value] });

  document.getElementById('whitelist')!.innerHTML += `<li>${input.value}</li>`; // Asserting that this is in the popup html
}

async function clearWhitelist() {
  await chrome.storage.local.set({ whitelist: [] });
  document.getElementById('whitelist')?.remove();
}

document.addEventListener('DOMContentLoaded', () => {
  constructWhitelistElements();

  const addBtn = document.getElementById('add-button');
  addBtn?.addEventListener('click', whitelistNewChannel);

  const clearWhitelistBtn = document.getElementById('clear-whitelist-button');
  clearWhitelistBtn?.addEventListener('click', clearWhitelist);
});
