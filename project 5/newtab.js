class QuoteManager {
    constructor() {
        this.apiUrl = 'https://quotable.io/random';
        this.fallbackQuotes = [
            {
                content: "The only way to do great work is to love what you do.",
                author: "Steve Jobs"
            },
            {
                content: "Life is what happens to you while you're busy making other plans.",
                author: "John Lennon"
            },
            {
                content: "The future belongs to those who believe in the beauty of their dreams.",
                author: "Eleanor Roosevelt"
            },
            {
                content: "It is during our darkest moments that we must focus to see the light.",
                author: "Aristotle"
            },
            {
                content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
                author: "Winston Churchill"
            },
            {
                content: "In the middle of difficulty lies opportunity.",
                author: "Albert Einstein"
            },
            {
                content: "The best time to plant a tree was 20 years ago. The second best time is now.",
                author: "Chinese Proverb"
            },
            {
                content: "Be yourself; everyone else is already taken.",
                author: "Oscar Wilde"
            },
            {
                content: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
                author: "Albert Einstein"
            },
            {
                content: "A room without books is like a body without a soul.",
                author: "Marcus Tullius Cicero"
            },
            {
                content: "You only live once, but if you do it right, once is enough.",
                author: "Mae West"
            },
            {
                content: "If you tell the truth, you don't have to remember anything.",
                author: "Mark Twain"
            }
        ];
        
        this.elements = {};
        this.isLoading = false;
        this.currentQuote = null;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupElements();
                this.bindEvents();
                this.loadQuote();
            });
        } else {
            this.setupElements();
            this.bindEvents();
            this.loadQuote();
        }
    }
    
    setupElements() {
        this.elements = {
            loading: document.getElementById('loading'),
            quoteContent: document.getElementById('quote-content'),
            errorContent: document.getElementById('error-content'),
            quoteText: document.getElementById('quote-text'),
            quoteAuthor: document.getElementById('quote-author'),
            refreshBtn: document.getElementById('refresh-btn'),
            retryBtn: document.getElementById('retry-btn'),
            copyBtn: document.getElementById('copy-btn'),
            copyNotification: document.getElementById('copy-notification')
        };
        
        // Verify all elements exist
        for (const [key, element] of Object.entries(this.elements)) {
            if (!element) {
                console.error(`Element not found: ${key}`);
            }
        }
    }
    
    bindEvents() {
        if (this.elements.refreshBtn) {
            this.elements.refreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Refresh button clicked');
                this.loadQuote();
            });
        }
        
        if (this.elements.retryBtn) {
            this.elements.retryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Retry button clicked');
                this.loadQuote();
            });
        }
        
        if (this.elements.copyBtn) {
            this.elements.copyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Copy button clicked');
                this.copyQuoteToClipboard();
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'KeyR') {
                e.preventDefault();
                console.log('Keyboard shortcut pressed:', e.code);
                this.loadQuote();
            } else if (e.code === 'KeyC' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                console.log('Copy keyboard shortcut pressed');
                this.copyQuoteToClipboard();
            }
        });
        
        // Listen for messages from popup
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                if (request.action === 'refreshQuote') {
                    this.loadQuote();
                    sendResponse({ success: true });
                }
            });
        }
    }
    
    async loadQuote() {
        if (this.isLoading) {
            console.log('Already loading, skipping...');
            return;
        }
        
        console.log('Loading new quote...');
        this.isLoading = true;
        this.showLoading();
        
        try {
            const quote = await this.fetchQuote();
            this.currentQuote = quote;
            await this.displayQuote(quote);
            await this.saveToStorage(quote);
            await this.incrementQuoteCount();
        } catch (error) {
            console.error('Error loading quote:', error);
            // Show a random fallback quote instead of error
            const fallbackQuote = this.getRandomFallbackQuote();
            this.currentQuote = fallbackQuote;
            await this.displayQuote(fallbackQuote);
        } finally {
            this.isLoading = false;
        }
    }
    
    async fetchQuote() {
        try {
            console.log('Fetching quote from API...');
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
            
            const response = await fetch(this.apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Quote fetched successfully:', data);
            
            return {
                content: data.content,
                author: data.author
            };
        } catch (error) {
            console.warn('API fetch failed, using random fallback:', error);
            // Always use random fallback, don't check storage
            return this.getRandomFallbackQuote();
        }
    }
    
    getRandomFallbackQuote() {
        const randomIndex = Math.floor(Math.random() * this.fallbackQuotes.length);
        const quote = this.fallbackQuotes[randomIndex];
        console.log('Using random fallback quote:', quote);
        return quote;
    }
    
    async displayQuote(quote) {
        return new Promise((resolve) => {
            // Add a small delay for smooth transition
            setTimeout(() => {
                if (this.elements.quoteText && this.elements.quoteAuthor) {
                    this.elements.quoteText.textContent = quote.content;
                    this.elements.quoteAuthor.textContent = quote.author;
                    
                    this.hideLoading();
                    this.hideError();
                    
                    if (this.elements.quoteContent) {
                        this.elements.quoteContent.style.display = 'block';
                        
                        // Trigger animation
                        this.elements.quoteContent.style.animation = 'none';
                        this.elements.quoteContent.offsetHeight; // Trigger reflow
                        this.elements.quoteContent.style.animation = 'fadeIn 0.6s ease-out';
                    }
                }
                resolve();
            }, 300);
        });
    }
    
    async copyQuoteToClipboard() {
        if (!this.currentQuote) {
            console.warn('No quote available to copy');
            return;
        }
        
        const quoteText = `"${this.currentQuote.content}" — ${this.currentQuote.author}`;
        
        try {
            // Try using the modern Clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(quoteText);
                console.log('Quote copied to clipboard using Clipboard API');
            } else {
                // Fallback to the older method
                const textArea = document.createElement('textarea');
                textArea.value = quoteText;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                
                if (!successful) {
                    throw new Error('Copy command failed');
                }
                console.log('Quote copied to clipboard using fallback method');
            }
            
            this.showCopyNotification();
            await this.incrementCopyCount();
            
        } catch (error) {
            console.error('Failed to copy quote to clipboard:', error);
            this.showCopyNotification(false);
        }
    }
    
    showCopyNotification(success = true) {
        if (!this.elements.copyNotification) return;
        
        const notification = this.elements.copyNotification;
        const content = notification.querySelector('.copy-notification-content span');
        
        if (success) {
            notification.style.background = 'rgba(16, 185, 129, 0.95)';
            content.textContent = 'Quote copied to clipboard!';
        } else {
            notification.style.background = 'rgba(239, 68, 68, 0.95)';
            content.textContent = 'Failed to copy quote';
        }
        
        // Show notification
        notification.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    showLoading() {
        if (this.elements.loading) {
            this.elements.loading.style.display = 'flex';
        }
        if (this.elements.quoteContent) {
            this.elements.quoteContent.style.display = 'none';
        }
        if (this.elements.errorContent) {
            this.elements.errorContent.style.display = 'none';
        }
    }
    
    hideLoading() {
        if (this.elements.loading) {
            this.elements.loading.style.display = 'none';
        }
    }
    
    showError() {
        this.hideLoading();
        if (this.elements.quoteContent) {
            this.elements.quoteContent.style.display = 'none';
        }
        if (this.elements.errorContent) {
            this.elements.errorContent.style.display = 'block';
        }
    }
    
    hideError() {
        if (this.elements.errorContent) {
            this.elements.errorContent.style.display = 'none';
        }
    }
    
    async saveToStorage(quote) {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                await chrome.storage.local.set({
                    lastQuote: quote,
                    lastFetch: Date.now()
                });
                console.log('Quote saved to storage');
            } else {
                // Fallback to localStorage for testing
                localStorage.setItem('lastQuote', JSON.stringify(quote));
                localStorage.setItem('lastFetch', Date.now().toString());
            }
        } catch (error) {
            console.warn('Storage not available:', error);
        }
    }
    
    async getFromStorage() {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                const result = await chrome.storage.local.get(['lastQuote', 'lastFetch']);
                const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
                
                // Return cached quote if it's less than an hour old
                if (result.lastQuote && result.lastFetch && 
                    (Date.now() - result.lastFetch) < oneHour) {
                    return result.lastQuote;
                }
            } else {
                // Fallback to localStorage for testing
                const lastQuote = localStorage.getItem('lastQuote');
                const lastFetch = localStorage.getItem('lastFetch');
                
                if (lastQuote && lastFetch) {
                    const oneHour = 60 * 60 * 1000;
                    if ((Date.now() - parseInt(lastFetch)) < oneHour) {
                        return JSON.parse(lastQuote);
                    }
                }
            }
        } catch (error) {
            console.warn('Storage not available:', error);
        }
        return null;
    }
    
    async incrementQuoteCount() {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                const result = await chrome.storage.local.get(['quotesViewed']);
                const count = (result.quotesViewed || 0) + 1;
                await chrome.storage.local.set({ quotesViewed: count });
            }
        } catch (error) {
            console.warn('Could not update quote count:', error);
        }
    }
    
    async incrementCopyCount() {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                const result = await chrome.storage.local.get(['quotesCopied']);
                const count = (result.quotesCopied || 0) + 1;
                await chrome.storage.local.set({ quotesCopied: count });
            }
        } catch (error) {
            console.warn('Could not update copy count:', error);
        }
    }
}

// Enhanced user experience features
class UIEnhancements {
    constructor() {
        this.init();
    }
    
    init() {
        this.addKeyboardShortcuts();
        this.addAccessibilityFeatures();
        this.addGradientVariations();
    }
    
    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Help dialog with 'H' key
            if (e.code === 'KeyH' && !e.ctrlKey && !e.metaKey) {
                this.showHelpDialog();
            }
        });
    }
    
    addAccessibilityFeatures() {
        // Add focus indicators for keyboard navigation
        const focusableElements = document.querySelectorAll('button');
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid #667eea';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = 'none';
            });
        });
    }
    
    addGradientVariations() {
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
        ];
        
        // Change gradient occasionally (every few refreshes)
        const savedGradientIndex = localStorage.getItem('gradientIndex') || '0';
        const currentIndex = parseInt(savedGradientIndex);
        
        // Change gradient every 3rd quote refresh
        if (Math.random() > 0.7) {
            const newIndex = (currentIndex + 1) % gradients.length;
            document.body.style.background = gradients[newIndex];
            localStorage.setItem('gradientIndex', newIndex.toString());
        } else {
            document.body.style.background = gradients[currentIndex];
        }
    }
    
    showHelpDialog() {
        if (document.getElementById('help-dialog')) return;
        
        const dialog = document.createElement('div');
        dialog.id = 'help-dialog';
        dialog.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                <div style="background: white; padding: 2rem; border-radius: 16px; max-width: 400px; text-align: center;">
                    <h3 style="margin-bottom: 1rem; color: #1e293b;">Keyboard Shortcuts</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>Space or R:</strong> New quote</p>
                    <p style="margin-bottom: 0.5rem;"><strong>C:</strong> Copy quote</p>
                    <p style="margin-bottom: 1.5rem;"><strong>H:</strong> Show this help</p>
                    <button onclick="document.getElementById('help-dialog').remove()" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
        
        // Close on escape
        const closeHandler = (e) => {
            if (e.code === 'Escape') {
                dialog.remove();
                document.removeEventListener('keydown', closeHandler);
            }
        };
        document.addEventListener('keydown', closeHandler);
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            if (document.getElementById('help-dialog')) {
                dialog.remove();
            }
        }, 5000);
    }
}

// Initialize the application
let quoteManager;
let uiEnhancements;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    console.log('Initializing Quotely...');
    quoteManager = new QuoteManager();
    uiEnhancements = new UIEnhancements();
}

// Handle extension context
if (typeof chrome !== 'undefined' && chrome.runtime) {
    console.log('Quotely extension loaded successfully');
}