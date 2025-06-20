# Quotely - Minimalist Quote Chrome Extension

A beautiful Chrome extension that replaces your new tab page with inspiring literary quotes from renowned authors.

## Features

✨ **Beautiful Design**: Clean, minimalist interface with elegant typography and subtle animations
📚 **Literary Quotes**: Curated quotes from famous authors and thinkers
🔄 **Smart Refresh**: Get new quotes with a click or keyboard shortcut
📱 **Responsive**: Works perfectly on all screen sizes
🎨 **Dynamic Backgrounds**: Subtle gradient variations for visual interest
⌨️ **Keyboard Shortcuts**: Space, R, or H for quick actions
♿ **Accessible**: Built with accessibility best practices
🔒 **Privacy-Focused**: No tracking, minimal permissions

## Installation

### From Source (Development)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension will be installed and ready to use

### From Chrome Web Store

*Coming soon - extension will be published to the Chrome Web Store*

## Usage

1. **New Quote**: Open a new tab to see a fresh quote
2. **Refresh Quote**: Click the refresh button or press Space/R
3. **Keyboard Shortcuts**:
   - `Space` or `R`: Get a new quote
   - `H`: Show help dialog

## Technical Details

### Architecture

- **Manifest V3**: Uses the latest Chrome extension manifest version
- **Vanilla JavaScript**: No frameworks, lightweight and fast
- **Quotable API**: Fetches quotes from the free Quotable.io service
- **Fallback System**: Local quotes available when offline
- **Smart Caching**: Reduces API calls with intelligent storage

### Files Structure

```
quotely/
├── manifest.json          # Extension configuration
├── newtab.html           # New tab page HTML
├── newtab.css            # Styling for new tab page  
├── newtab.js             # Quote fetching and display logic
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── icons/                # Extension icons (16px, 48px, 128px)
└── README.md            # This file
```

### Permissions

- `storage`: For caching quotes and storing user preferences
- `host_permissions`: For fetching quotes from quotable.io

## Customization

### Changing Quote Sources

Edit the `apiUrl` in `newtab.js` to use a different quotes API, or modify the `fallbackQuotes` array to include your preferred quotes.

### Styling

Modify `newtab.css` to customize:
- Color schemes and gradients
- Typography and fonts
- Layout and spacing
- Animations and transitions

### Background Gradients

The extension includes several beautiful gradient variations that rotate automatically. Add more in the `gradients` array within `newtab.js`.

## Development

### Local Development

1. Make changes to the extension files
2. Go to `chrome://extensions/`
3. Click the reload button on the Quotely extension
4. Open a new tab to see your changes

### Testing

- Test on different screen sizes
- Verify keyboard shortcuts work
- Check offline functionality
- Ensure accessibility with screen readers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use and modify for your own projects.

## Acknowledgments

- **Quotable.io**: For providing the free quotes API
- **Google Fonts**: For beautiful typography
- **Chrome Extension Documentation**: For comprehensive development guides

---

**Quotely** - Bringing literary inspiration to your everyday browsing experience.