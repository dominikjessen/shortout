<p align="center">
  <a href="https://github.com/dominikjessen/shortout">
   <img src="/public/logos/icon-128.png" alt="Logo" />
  </a>
  <h1 align="center">Shortout</h1>
  <h3 align="center">Hide unwanted YouTube Shorts from your Subscription page</h3>
  <p align="center">
    <span>Built with</span>
    <br />
    <br />
    <img width="56px" height="56px" src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" alt="Typescript" />
    <img width="56px" height="56px" src="https://tailwindcss.com/_next/static/media/tailwindcss-mark.3c5441fc7a190fb1800d4a5c7f07ba4b1345a9c8.svg" alt="Tailwind" />
    <img width="56px" height="56px" src="https://raw.githubusercontent.com/webpack/media/master/logo/icon-square-big.png" alt="Webpack" />
  </p>

</p>

#### Note: Since July 2023's YouTube update this extension no longer works and isn't needed!

## About Shortout

Shortout was a Chrome extension built to remove unwanted Shorts from the YouTube subscription page. With YouTube's July 2023 update that changed the subscription page layout - YT moved Shorts into its own section on the page - this extension is no longer necessary and won't work as intended. I'm keeping it up mostly for demonstration purposes and have no intention of pushing it to the Chrome Extension Store.

### Product Images

<p align='center'>
  <img width="40%" src="/public/product/01_Shortout_LightMode.png" />
  <img width="40%" src="/public/product/02_Shortout_DarkMode.png" />
</p>

## Setup

1. First, clone the repo and run

```sh
npm install
npm run build
```

This will generate a _dist_ folder containing the built extension.

2. Open your Chrome Extension Manager (`chrome://extensions/`) and enable Developer mode.

3. Click _Load unpacked_ and select the _dist_ folder. Done - Shortout should now be installed in your Chrome browser.
