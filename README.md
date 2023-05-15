# YouTube Shorts Remover

A Chrome extension that removes Shorts from YouTube pages. Click it to get rid of all shorts on the page without affecting the remaining functionality.

# Dev Workflow

- Make changes
- Run `npm run build`
- Go to Chrome Extensions Manager
- Hit `Refresh`
- See the changes

# CSS Selectors for nodes

1. node.nodeName === 'YTD-THUMBNAIL-OVERLAY-TIME-STATUS-RENDERER' && node.getAttribute('overlay-style') === 'SHORTS'
2. node.nodeName === 'A' && node.getAttribute('href').includes('/shorts/')

# TODO

- Check if the extension works always if changing observer to check document.body
- Check if I need to rewrite observer to look for changes to DOM where a fitting element is added
- Check if my observer should check for overlay-style attribute change (https://www.smashingmagazine.com/2019/04/mutationobserver-api-guide/)
