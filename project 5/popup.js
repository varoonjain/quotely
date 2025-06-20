document.addEventListener('DOMContentLoaded', async () => {
    // Load stats
    await loadStats();
    
    // Bind events
    document.getElementById('new-quote-btn').addEventListener('click', async () => {
        // Send message to active tab to refresh quote
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab.url.includes('chrome://newtab/') || tab.url.includes('chrome-extension://')) {
            chrome.tabs.sendMessage(tab.id, { action: 'refreshQuote' });
            window.close();
        } else {
            // Open new tab
            chrome.tabs.create({ url: 'chrome://newtab/' });
            window.close();
        }
    });
    
    document.getElementById('copy-quote-btn').addEventListener('click', async () => {
        // Send message to active tab to copy quote
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab.url.includes('chrome://newtab/') || tab.url.includes('chrome-extension://')) {
            chrome.tabs.sendMessage(tab.id, { action: 'copyQuote' });
            window.close();
        } else {
            // Get last quote from storage and copy it
            try {
                const result = await chrome.storage.local.get(['lastQuote']);
                if (result.lastQuote) {
                    const quoteText = `"${result.lastQuote.content}" — ${result.lastQuote.author}`;
                    await navigator.clipboard.writeText(quoteText);
                    // Show brief success indication
                    const btn = document.getElementById('copy-quote-btn');
                    const originalText = btn.textContent;
                    btn.textContent = 'Copied!';
                    setTimeout(() => {
                        btn.textContent = originalText;
                        window.close();
                    }, 1000);
                } else {
                    window.close();
                }
            } catch (error) {
                console.error('Failed to copy quote:', error);
                window.close();
            }
        }
    });
});

async function loadStats() {
    try {
        const result = await chrome.storage.local.get(['quotesViewed', 'quotesCopied', 'firstInstall']);
        
        const quotesViewed = result.quotesViewed || 0;
        const quotesCopied = result.quotesCopied || 0;
        const firstInstall = result.firstInstall || Date.now();
        
        // Calculate days since installation
        const daysSinceInstall = Math.floor((Date.now() - firstInstall) / (1000 * 60 * 60 * 24));
        
        document.getElementById('quote-count').textContent = quotesViewed;
        document.getElementById('copy-count').textContent = quotesCopied;
        document.getElementById('days-active').textContent = daysSinceInstall;
        
        // Initialize first install date if not set
        if (!result.firstInstall) {
            await chrome.storage.local.set({ firstInstall: Date.now() });
        }
    } catch (error) {
        console.error('Error loading stats:', error);
        document.getElementById('quote-count').textContent = '0';
        document.getElementById('copy-count').textContent = '0';
        document.getElementById('days-active').textContent = '0';
    }
}