function createWhitelistBaseElement() {
  const list = '<ul id="whitelist" class="list-none flex flex-col gap-1.5 overflow-auto h-full"></ul>';
  document.getElementById('whitelist-container')!.innerHTML += list; // Asserting that this is in the popup html
}

// Helper function to make style changes easy
function liHtmlString(text: string): string {
  return `<li class="py-2 px-3 hover:bg-rose-100 rounded flex text-base"><img src="/icons/play.svg" alt="play button" class="" /><span class="text-neutral-800 px-3 grow cursor-default">${text}</span><button class="delete-whitelist-entry hover:fill-blue-500"><img src="/icons/trash.svg" alt="delete button" /></button></li>`;
}

async function constructWhitelistElements() {
  const channels: string[] = await getStoredWhitelistChannels();
  if (channels.length > 0) {
    createWhitelistBaseElement();
    let itemsForList = '';
    // const whitelistElement = document.getElementById('whitelist');

    // TODO: Add play button and add trahs can icon
    // TODO: For trash can, add eventlistener to delete this channel from the list and remove element from DOM
    channels.forEach(function (channel: string) {
      itemsForList += liHtmlString(channel);
    });

    document.getElementById('whitelist')!.innerHTML += itemsForList; // Asserting that this is in the popup html
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

  document.getElementById('whitelist')!.innerHTML += liHtmlString(input.value); // Asserting that this is in the popup html
}

async function clearWhitelist() {
  await chrome.storage.local.set({ whitelist: [] });
  document.getElementById('whitelist')?.remove();
}

async function removeWhitelistItem(event: Event) {
  const target = event.target as HTMLElement;
  const li = target.closest('li');
  const channelToDelete = li?.innerText;

  if (!channelToDelete) return;

  // Update chrome storage
  const currentWhitelist = await getStoredWhitelistChannels();
  const index = currentWhitelist.indexOf(channelToDelete);
  if (index !== -1) {
    currentWhitelist.splice(index, 1);
  }
  await chrome.storage.local.set({ whitelist: currentWhitelist });

  // Remove li
  li.remove();
}

document.addEventListener('DOMContentLoaded', async () => {
  await constructWhitelistElements();

  const closeBtn = document.getElementById('popup-close');
  closeBtn?.addEventListener('click', () => window.close());

  const addBtn = document.getElementById('add-button');
  addBtn?.addEventListener('click', whitelistNewChannel);

  const clearWhitelistBtn = document.getElementById('clear-whitelist-button');
  clearWhitelistBtn?.addEventListener('click', clearWhitelist);

  const deleteButtons = [...document.querySelectorAll('.delete-whitelist-entry')];
  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', removeWhitelistItem);
  });
});
