(function () {
  'use strict';

  // Read config from script tag
  var script = document.currentScript;
  if (!script) return;
  var chatbotId = script.getAttribute('data-chatbot-id');
  if (!chatbotId) return console.warn('[MDN Chat] Missing data-chatbot-id');

  var baseUrl = script.src.replace(/\/widget\.js.*$/, '');
  var CONFIG = null;
  var STATE = {
    open: false,
    loading: false,
    messages: [],
    visitorId: '',
    conversationId: null,
  };

  // Session persistence
  var STORAGE_KEY = 'mdn-chat-' + chatbotId;
  function saveState() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        visitorId: STATE.visitorId,
        conversationId: STATE.conversationId,
        messages: STATE.messages.slice(-50),
      }));
    } catch (e) { }
  }
  function loadState() {
    try {
      var saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        var parsed = JSON.parse(saved);
        STATE.visitorId = parsed.visitorId || '';
        STATE.conversationId = parsed.conversationId || null;
        STATE.messages = parsed.messages || [];
      }
    } catch (e) { }
    if (!STATE.visitorId) {
      STATE.visitorId = 'v_' + Math.random().toString(36).substr(2, 12) + Date.now().toString(36);
    }
  }

  // Simple markdown: **bold**, [link](url), - lists, \n
  function renderMarkdown(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/\n/g, '<br>');
  }

  // CSS
  var CSS = '\
    :host { all: initial; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; }\
    * { box-sizing: border-box; margin: 0; padding: 0; }\
    .mdn-bubble { position: fixed; bottom: 20px; right: 20px; width: 56px; height: 56px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0,0,0,0.3); transition: transform 0.2s, box-shadow 0.2s; z-index: 2147483647; border: none; }\
    .mdn-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(0,0,0,0.4); }\
    .mdn-bubble svg { width: 26px; height: 26px; fill: white; }\
    .mdn-panel { position: fixed; bottom: 88px; right: 20px; width: 380px; max-height: 520px; border-radius: 16px; background: #0d0d20; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 8px 40px rgba(0,0,0,0.5); display: none; flex-direction: column; overflow: hidden; z-index: 2147483647; }\
    .mdn-panel.open { display: flex; }\
    .mdn-header { padding: 16px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.06); }\
    .mdn-header-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }\
    .mdn-header-name { color: #fff; font-weight: 600; font-size: 14px; flex: 1; }\
    .mdn-header-close { background: none; border: none; color: #666; cursor: pointer; font-size: 18px; padding: 4px; line-height: 1; }\
    .mdn-header-close:hover { color: #fff; }\
    .mdn-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; min-height: 200px; max-height: 360px; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }\
    .mdn-msg { max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.5; word-wrap: break-word; }\
    .mdn-msg a { color: inherit; text-decoration: underline; }\
    .mdn-msg ul { margin: 4px 0; padding-left: 18px; }\
    .mdn-msg-user { align-self: flex-end; color: #fff; border-bottom-right-radius: 4px; }\
    .mdn-msg-assistant { align-self: flex-start; background: rgba(255,255,255,0.06); color: #d1d5db; border-bottom-left-radius: 4px; }\
    .mdn-msg-assistant strong { color: #fff; }\
    .mdn-typing { align-self: flex-start; padding: 10px 18px; background: rgba(255,255,255,0.06); border-radius: 12px; display: none; }\
    .mdn-typing.show { display: flex; gap: 4px; }\
    .mdn-typing span { width: 6px; height: 6px; border-radius: 50%; background: #888; animation: mdnBounce 1.2s infinite; }\
    .mdn-typing span:nth-child(2) { animation-delay: 0.2s; }\
    .mdn-typing span:nth-child(3) { animation-delay: 0.4s; }\
    @keyframes mdnBounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }\
    .mdn-input-row { padding: 12px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; gap: 8px; }\
    .mdn-input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 14px; color: #fff; font-size: 13px; outline: none; resize: none; font-family: inherit; }\
    .mdn-input::placeholder { color: #555; }\
    .mdn-input:focus { border-color: rgba(255,255,255,0.2); }\
    .mdn-send { width: 38px; height: 38px; border-radius: 10px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: opacity 0.2s; flex-shrink: 0; }\
    .mdn-send:disabled { opacity: 0.4; cursor: default; }\
    .mdn-send svg { width: 18px; height: 18px; fill: white; }\
    .mdn-powered { text-align: center; padding: 6px; font-size: 10px; color: #444; }\
    .mdn-powered a { color: #666; text-decoration: none; }\
    @media (max-width: 480px) { .mdn-panel { width: calc(100vw - 16px); right: 8px; bottom: 80px; max-height: 70vh; } .mdn-bubble { bottom: 14px; right: 14px; } }\
  ';

  // Create widget
  function init(config) {
    CONFIG = config;
    var color = config.primaryColor || '#7c3aed';

    var container = document.createElement('div');
    container.id = 'mdn-chat-widget';
    document.body.appendChild(container);
    var shadow = container.attachShadow({ mode: 'open' });

    // Inject CSS
    var style = document.createElement('style');
    style.textContent = CSS;
    shadow.appendChild(style);

    // Bubble
    var bubble = document.createElement('button');
    bubble.className = 'mdn-bubble';
    bubble.style.background = color;
    bubble.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>';
    shadow.appendChild(bubble);

    // Panel
    var panel = document.createElement('div');
    panel.className = 'mdn-panel';
    panel.innerHTML = '\
      <div class="mdn-header">\
        <div class="mdn-header-dot" style="background:' + color + '"></div>\
        <div class="mdn-header-name">' + esc(config.name) + '</div>\
        <button class="mdn-header-close">&times;</button>\
      </div>\
      <div class="mdn-messages"></div>\
      <div class="mdn-input-row">\
        <input class="mdn-input" placeholder="Type a message..." autocomplete="off" />\
        <button class="mdn-send" style="background:' + color + '">\
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>\
        </button>\
      </div>\
      <div class="mdn-powered">Powered by <a href="https://mdntech.org" target="_blank">M.D.N Tech</a></div>\
    ';
    shadow.appendChild(panel);

    var messagesEl = panel.querySelector('.mdn-messages');
    var input = panel.querySelector('.mdn-input');
    var sendBtn = panel.querySelector('.mdn-send');
    var closeBtn = panel.querySelector('.mdn-header-close');

    // Add typing indicator
    var typingEl = document.createElement('div');
    typingEl.className = 'mdn-typing';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(typingEl);

    // Render existing messages
    function renderMessages() {
      var els = messagesEl.querySelectorAll('.mdn-msg');
      els.forEach(function (el) { el.remove(); });
      STATE.messages.forEach(function (msg) {
        addMessageEl(msg.role, msg.content);
      });
    }

    function addMessageEl(role, content) {
      var div = document.createElement('div');
      div.className = 'mdn-msg mdn-msg-' + role;
      if (role === 'user') {
        div.style.background = color;
      }
      div.innerHTML = role === 'assistant' ? renderMarkdown(content) : esc(content);
      messagesEl.insertBefore(div, typingEl);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return div;
    }

    function setTyping(show) {
      typingEl.className = 'mdn-typing' + (show ? ' show' : '');
      if (show) messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Toggle
    function toggle() {
      STATE.open = !STATE.open;
      panel.className = 'mdn-panel' + (STATE.open ? ' open' : '');
      if (STATE.open) {
        // Add greeting if no messages
        if (STATE.messages.length === 0) {
          STATE.messages.push({ role: 'assistant', content: config.greeting });
          saveState();
        }
        renderMessages();
        input.focus();
      }
    }

    bubble.addEventListener('click', toggle);
    closeBtn.addEventListener('click', toggle);

    // Send message
    async function sendMessage() {
      var text = input.value.trim();
      if (!text || STATE.loading) return;

      input.value = '';
      STATE.messages.push({ role: 'user', content: text });
      addMessageEl('user', text);
      STATE.loading = true;
      sendBtn.disabled = true;
      setTyping(true);

      try {
        var res = await fetch(baseUrl + '/api/chat/' + chatbotId + '/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            visitorId: STATE.visitorId,
            conversationId: STATE.conversationId,
            sourceUrl: window.location.href,
          }),
        });

        if (!res.ok) throw new Error('Request failed');

        var reader = res.body.getReader();
        var decoder = new TextDecoder();
        var assistantMsg = '';
        var msgEl = null;
        setTyping(false);

        while (true) {
          var result = await reader.read();
          if (result.done) break;

          var chunk = decoder.decode(result.value, { stream: true });
          var lines = chunk.split('\n');

          for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line.startsWith('data: ')) continue;

            try {
              var data = JSON.parse(line.slice(6));

              if (data.error) {
                assistantMsg = 'Sorry, something went wrong. Please try again.';
                if (!msgEl) msgEl = addMessageEl('assistant', assistantMsg);
                else { msgEl.innerHTML = renderMarkdown(assistantMsg); }
                break;
              }

              if (data.token) {
                assistantMsg += data.token;
                if (!msgEl) msgEl = addMessageEl('assistant', assistantMsg);
                else { msgEl.innerHTML = renderMarkdown(assistantMsg); }
                messagesEl.scrollTop = messagesEl.scrollHeight;
              }

              if (data.done) {
                STATE.conversationId = data.conversationId;
              }
            } catch (e) { }
          }
        }

        if (assistantMsg) {
          STATE.messages.push({ role: 'assistant', content: assistantMsg });
        }
      } catch (err) {
        setTyping(false);
        var errorContent = 'Sorry, I\'m having trouble connecting. Please try again.';
        STATE.messages.push({ role: 'assistant', content: errorContent });
        addMessageEl('assistant', errorContent);
      }

      STATE.loading = false;
      sendBtn.disabled = false;
      saveState();
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Restore messages if returning
    if (STATE.messages.length > 0 && STATE.open) {
      renderMessages();
    }
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // Boot
  loadState();
  fetch(baseUrl + '/api/chat/' + chatbotId + '/config')
    .then(function (r) { return r.json(); })
    .then(init)
    .catch(function (e) { console.warn('[MDN Chat] Failed to load config:', e); });
})();
