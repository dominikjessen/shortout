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
