function createWhitelistBaseElement() {
  const list = '<ul id="whitelist" class="list-none flex flex-col gap-1.5 overflow-auto h-full"></ul>';
  document.getElementById('whitelist-container')!.innerHTML += list; // Asserting that this is in the popup html
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

function registerDeleteButtonEventListeners() {
  // Only match buttons that need an event listener
  const deleteButtons = [...document.querySelectorAll('.delete-whitelist-entry.needs-event-listener')];
  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', removeWhitelistItem);
    btn.classList.remove('needs-event-listener');
  });
}

// Helper function to make style changes easy
function liHtmlString(text: string): string {
  return `<li class="py-2 px-3 hover:bg-rose-100 dark:hover:bg-gray-800 rounded flex text-base group"><img src="/icons/play.svg" alt="play button" class="" /><span class="text-gray-800 dark:text-white px-3 grow cursor-default">${text}</span><button class="delete-whitelist-entry needs-event-listener hidden group-hover:block"><img src="/icons/trash.svg" alt="delete button" /></button></li>`;
}

async function constructWhitelistElements() {
  const channels: string[] = await getStoredWhitelistChannels();
  if (channels.length > 0) {
    createWhitelistBaseElement();
    let itemsForList = '';

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

  registerDeleteButtonEventListeners();

  input.value = '';
}

async function clearWhitelist() {
  await chrome.storage.local.set({ whitelist: [] });
  document.getElementById('whitelist')?.remove();
}

function forceLightMode() {
  localStorage.theme = 'light';
  document.documentElement.classList.remove('dark');
}

function forceDarkMode() {
  localStorage.theme = 'dark';
  document.documentElement.classList.add('dark');
}

async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function setActiveInactiveSpanText(active: boolean) {
  const toggleInputColoredTextSpan = document.getElementById('extension-active-colored-span');

  if (active) {
    toggleInputColoredTextSpan?.classList.remove('text-red-700');
    toggleInputColoredTextSpan?.classList.add('text-green-700');
    toggleInputColoredTextSpan!.innerText = 'active';
  } else {
    toggleInputColoredTextSpan?.classList.remove('text-green-700');
    toggleInputColoredTextSpan?.classList.add('text-red-700');
    toggleInputColoredTextSpan!.innerText = 'inactive';
  }
}
document.addEventListener('DOMContentLoaded', async () => {
  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Set base extension active state depending on user settings
  const extensionActiveToggle = document.getElementById('extension-active') as HTMLInputElement;
  const store = await chrome.storage.local.get(['tabExtensionActiveStates']);
  let tabExtensionActiveStates = store.tabExtensionActiveStates;
  const currentTab = await getCurrentTab();

  if (currentTab && currentTab.id) {
    let extensionActiveForThisTab = tabExtensionActiveStates[currentTab.id];
    extensionActiveToggle.checked = extensionActiveForThisTab;
    setActiveInactiveSpanText(extensionActiveForThisTab);

    extensionActiveToggle?.addEventListener('change', async (event) => {
      const target = event.target as HTMLInputElement;
      tabExtensionActiveStates[currentTab.id!] = target.checked; // asserting that id exists
      await chrome.storage.local.set({ tabExtensionActiveStates: tabExtensionActiveStates });

      // Set colored text
      setActiveInactiveSpanText(target.checked);

      // Tell user to refresh page to apply changes
      const toggleInputLabel = document.getElementById('extension-active-label');
      const refreshButton = document.getElementById('toggle-refresh-page');
      if (!refreshButton) {
        const newRefreshButton = document.createElement('button');
        newRefreshButton.id = 'toggle-refresh-page';
        newRefreshButton.classList.add('w-8', 'h-8', 'hover:bg-gray-100', 'dark:hover:bg-gray-800', 'rounded');
        newRefreshButton.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="m-auto stroke-gray-500" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
        <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
        </svg>`;

        newRefreshButton.addEventListener('click', async () => {
          await chrome.tabs.reload({ bypassCache: true });
          document.getElementById('toggle-refresh-page')?.remove();
          window.close();
        });

        toggleInputLabel?.appendChild(newRefreshButton);
      }
    });
  }

  // Construct whitelist from storage
  await constructWhitelistElements();

  // Register button event listeners
  const closeBtn = document.getElementById('popup-close');
  closeBtn?.addEventListener('click', () => window.close());

  const darkModeToggle = document.getElementById('dark-mode-toggle');
  darkModeToggle?.addEventListener('click', forceDarkMode);

  const lightModeToggle = document.getElementById('light-mode-toggle');
  lightModeToggle?.addEventListener('click', forceLightMode);

  const addBtn = document.getElementById('add-button');
  addBtn?.addEventListener('click', whitelistNewChannel);

  const clearWhitelistBtn = document.getElementById('clear-whitelist-button');
  clearWhitelistBtn?.addEventListener('click', clearWhitelist);

  registerDeleteButtonEventListeners();
});
