class syncLinkProv {
    constructor() {
        this.messages = []; // stores in array (local storage -> JSON -> messages)
        this.settings = {
            username: 'User_' + Math.random().toString(36).substr(2, 9), // ai gen'd ts
            theme: 'dark',
            font: 'mono',
            accentColor: '#9d4edd',
            borderRadius: false,
            glowEnabled: true,
            backgroundGlowEnabled: true,
            showName: true,
            timezone: 'UTC',
            bio: ''
        };
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.loadMessages();
        this.setupEventListeners();
        this.applySettings();
        this.renderMessages();
        this.updateActiveUsers();
    }

    setupEventListeners() {
        const navItems = document.querySelectorAll('.nav-item');
        if (!navItems.length) {
            console.error('No nav items found');
        }

        navItems.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.closest('.nav-item').dataset.view;
                if (view) {
                    this.switchView(view);
                } else {
                    console.error('No data-view attribute found on nav item');
                }
            });
        });

        const sendBtn = document.getElementById('sendBtn');
        const messageInput = document.getElementById('messageInput');
        
        if (!sendBtn) {
            console.error('Send button not found');
        } else {
            sendBtn.addEventListener('click', () => {
                console.log('Send button clicked');
                this.sendMessage();
            });
        }
        
        if (!messageInput) {
            console.error('Message input not found');
        } else {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    console.log('Enter key pressed');
                    this.sendMessage();
                }
            });
        }

        const usernameInput = document.getElementById('usernameInput');
        if (usernameInput) {
            usernameInput.addEventListener('change', (e) => {
                const newUsername = e.target.value || this.settings.username;
                const oldUsername = this.settings.username;
                
                this.messages = this.messages.map(msg => {
                    if (msg.username === oldUsername) {
                        return { ...msg, username: newUsername };
                    }
                    return msg;
                });
                
                this.settings.username = newUsername;
                this.saveSettings();
                this.saveMessages();
                this.renderMessages();
                this.updateActiveUsers();
            });
        }

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) { // change theme without intrinsic HTML script
            themeToggle.addEventListener('change', (e) => {
                this.settings.theme = e.target.value;
                this.saveSettings();
                this.applySettings();
            });
        }

        const fontSelect = document.getElementById('fontSelect');
        // change font without intrinsic HTML script
        if (fontSelect) { 
            fontSelect.addEventListener('change', (e) => {
                this.settings.font = e.target.value;
                this.saveSettings();
                this.applySettings();
            });
        }

        // const accentColor = document.getElementById('accentColor');
        // if (accentColor) {
        //     accentColor.addEventListener('change', (e) => {
        //         this.settings.accentColor = e.target.value;
        //         this.saveSettings();
        //         this.applySettings();
        //     });
        // }

        // const borderRadiusToggle = document.getElementById('borderRadiusToggle');
        // if (borderRadiusToggle) {
        //     borderRadiusToggle.addEventListener('change', (e) => {
        //         this.settings.borderRadius = !e.target.checked;
        //         this.saveSettings();
        //         this.applySettings();
        //     });
        // }

        // const glowToggle = document.getElementById('glowToggle');
        // if (glowToggle) {
        //     glowToggle.addEventListener('change', (e) => {
        //         this.settings.glowEnabled = e.target.checked;
        //         this.saveSettings();
        //         this.applySettings();
        //     });
        // }

        // const backgroundGlowToggle = document.getElementById('backgroundGlowToggle');
        // if (backgroundGlowToggle) {
        //     backgroundGlowToggle.addEventListener('change', (e) => {
        //         this.settings.backgroundGlowEnabled = e.target.checked;
        //         this.saveSettings();
        //         this.applySettings();
        //     });
        // }

        const showNameToggle = document.getElementById('showNameToggle');
        if (showNameToggle) {
            showNameToggle.addEventListener('change', (e) => {
                this.settings.showName = e.target.checked;
                this.saveSettings();
                this.renderMessages();
            });
        }

        const timezoneSelect = document.getElementById('timezoneSelect');
        if (timezoneSelect) {
            timezoneSelect.addEventListener('change', (e) => {
                this.settings.timezone = e.target.value;
                this.saveSettings();
                this.renderMessages();
            });
        }

        const bioInput = document.getElementById('bioInput');
        if (bioInput) {
            bioInput.addEventListener('change', (e) => {
                this.settings.bio = e.target.value;
                this.saveSettings();
            });
        }

        const clearChatBtn = document.getElementById('clearChatBtn');
        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', () => {
                if (confirm('Clear all chat history?')) {
                    this.messages = [];
                    this.saveMessages();
                    this.renderMessages();
                }
            });
        }
    }

    switchView(view) {
        const views = ['chatView', 'settingsView', 'dmsView'];
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
        const navItem = document.querySelector(`[data-view="${view}"]`);
        if (navItem) {
            navItem.classList.add('active');
        } else {
            console.error(`Nav item for view ${view} not found`); // variable interpolation inside template literal
        }

        views.forEach(v => document.getElementById(v).classList.add('hidden'));
        
        const viewElement = document.getElementById(`${view}View`);
        if (viewElement) {
            viewElement.classList.remove('hidden');
            if (view === 'settings') {
                this.populateSettings();
            }
        } else {
            console.error(`View element ${view} - View not found`);
        }
    }

    sendMessage() {
        const input = document.getElementById('messageInput');
        if (!input) {
            console.error('Message input not found in sendMessage');
            return;
        }

        const text = input.value.trim();
        if (!text) {
            console.log('Empty message, not sending');
            return;
        }

        // MESSAGE STORAGE STATS
        // important

        const message = {
            id: Date.now(),
            username: this.settings.username,
            text: text,
            timestamp: new Date(),
            error: false
        };

        this.messages.push(message);
        this.saveMessages();
        this.renderMessages();
        input.value = '';
        input.focus();
        this.updateActiveUsers();

        setTimeout(() => {
            const messagesArea = document.getElementById('messagesArea');
            if (messagesArea) {
                messagesArea.scrollTop = messagesArea.scrollHeight;
            } else {
                console.error('Messages area not found');
            }
        }, 0);
    }

    formatTime(date) {
        const options = { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: this.getTimezoneOffset(this.settings.timezone)
        };

        try {
            return new Date(date).toLocaleTimeString('en-US', options);
        } catch (e) {
            console.error('Error formatting time:', e);
            return new Date(date).toLocaleTimeString('en-US');
        }
    }

    getTimezoneOffset(tz) {
        const tzMap = {
            'UTC': 'UTC',
            // 'EST': 'America/New_York',
            // 'CST': 'America/Chicago',
            // 'MST': 'America/Denver',
            // 'PST': 'America/Los_Angeles',
            'GMT': 'Europe/London',
            // 'CET': 'Europe/Paris',
            'IST': 'Asia/Kolkata',
            'JST': 'Asia/Tokyo'
        };

        return tzMap[tz] || 'UTC';
    }

    // display actual shit to the user (change for users)
    // whenever user hits send, if text content {true} {render_message};
    renderMessages() {
        const messagesArea = document.getElementById('messagesArea');
        if (!messagesArea) {
            console.error('Messages area not found in renderMessages');
            return;
        }

        messagesArea.innerHTML = '';

        this.messages.forEach(msg => {
            const msgGroup = document.createElement('div');
            msgGroup.className = 'message-group';

            // avatar
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.textContent = msg.username.charAt(0).toUpperCase();

            // text content (msg content)
            const content = document.createElement('div');
            content.className = 'message-content';

            // applied settings
            if (this.settings.showName) {
                const header = document.createElement('div');
                header.className = 'message-header';

                const username = document.createElement('span');
                username.className = 'message-username';
                username.textContent = msg.username;

                const time = document.createElement('span');
                time.className = 'message-time';
                time.textContent = this.formatTime(msg.timestamp);

                header.appendChild(username);
                header.appendChild(time);
                content.appendChild(header);
            }

            const bubble = document.createElement('div');
            bubble.className = 'message-bubble';
            bubble.textContent = msg.text;

            content.appendChild(bubble);

            // this probably never gets executed
            if (msg.error) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'message-error';
                errorDiv.innerHTML = '<span class="error-icon">[ ! ]: </span><span class="error-text">MSG_SEND_ERR</span>';
                content.appendChild(errorDiv);
            }

            msgGroup.appendChild(avatar);
            // msgGroup.appendChild()
            msgGroup.appendChild(content);
            messagesArea.appendChild(msgGroup);
        });
    }

    updateActiveUsers() {
        const activeList = document.getElementById('activeList');
        if (!activeList) {
            console.error('Active list not found');
            return;
        }

        // for every new username, theres a new C-Active user
        // issue fixed long ago
        const uniqueUsers = [...new Set(this.messages.map(m => m.username))];

        activeList.innerHTML = '';
        uniqueUsers.forEach(user => {
            const userEl = document.createElement('div');
            userEl.className = 'active-user';
            userEl.textContent = user;
            activeList.appendChild(userEl);
        });
    }

    populateSettings() {
        const inputs = {
            usernameInput: this.settings.username,
            themeToggle: this.settings.theme,
            fontSelect: this.settings.font,
            accentColor: this.settings.accentColor,
            borderRadiusToggle: !this.settings.borderRadius,
            glowToggle: this.settings.glowEnabled,
            backgroundGlowToggle: this.settings.backgroundGlowEnabled,
            showNameToggle: this.settings.showName,
            timezoneSelect: this.settings.timezone,
            bioInput: this.settings.bio
        };

        for (const [id, value] of Object.entries(inputs)) {
            const element = document.getElementById(id);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
            } else {
                console.error(`Settings element ${id} not found`);
            }
        }
    }

    applySettings() {
        const root = document.documentElement;
        const body = document.body;

        // theme settings
        if (this.settings.theme === 'light') {
            body.classList.add('light-theme');
        } else {
            body.classList.remove('light-theme');
        }

        // font settings
        body.classList.remove('font-sans', 'font-serif');
        if (this.settings.font === 'sans') {
            body.classList.add('font-sans');
        } else if (this.settings.font === 'serif') {
            body.classList.add('font-serif');
        }

        // root.style.setProperty('--accent-color', this.settings.accentColor);
        // const rgb = this.hexToRgb(this.settings.accentColor);
        // root.style.setProperty('--glow-color', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);

        // bootyness 
        root.style.setProperty('--border-radius', this.settings.borderRadius ? '8px' : '0px'); // doesnt work
    }

    // hexToRgb(hex) {
    //     const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    //     return result ? {
    //         r: parseInt(result[1], 16),
    //         g: parseInt(result[2], 16),
    //         b: parseInt(result[3], 16)
    //     } : { r: 157, g: 78, b: 221 };
    // }

    // local storage
    // saves in JSON format
    saveSettings() {
        try {
            localStorage.setItem('chatSettings', JSON.stringify(this.settings));
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('chatSettings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error('Error loading settings:', e);
        }
    }

    saveMessages() {
        try {
            localStorage.setItem('chatMessages', JSON.stringify(this.messages));
        } catch (e) {
            console.error('Error saving messages:', e);
        }
    }

    loadMessages() {
        try {
            const saved = localStorage.getItem('chatMessages');
            if (saved) {
                this.messages = JSON.parse(saved).map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
            }
        } catch (e) {
            console.error('Error loading messages:', e);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new syncLinkProv();
});
