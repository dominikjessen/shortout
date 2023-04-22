function constructWhitelistElements() {
  const channels = getStoredWhitelistChannels();
  let str = '<ul>';

  channels.forEach(function (channel) {
    str += '<li>' + channel + '</li>';
  });

  str += '</ul>';
  document.getElementById('whitelist-container')!.innerHTML = str; // Asserting that this is in the popup html
}

function getStoredWhitelistChannels(): string[] {
  // TODO: Get channels from chrome storage

  const userWhitelist = ['channel 1', 'channel 2', 'channel 3', 'channel 4', 'channel 5'];

  return userWhitelist;
}

function whitelistNewChannel(channelName: string) {
  // TODO: Add channel name to chrome storage
}

document.addEventListener('DOMContentLoaded', () => {
  constructWhitelistElements();
});
