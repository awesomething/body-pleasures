import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

export default function N8NChat() {
  useEffect(() => {
    createChat({
      webhookUrl: 'https://thebrain02.app.n8n.cloud/webhook/44b429f4-27a6-409b-9239-ef141158d2e4/chat',
      mode: 'window',
      initialMessages: [
        'Hi there! 👋',
        "I'm Ms V’s assistant. How can I help you today?",
      ],
      i18n: {
        en: {
          title: "Ms V’s Assistant",
          subtitle: "How may I assist you today?",
          footer: "", 
          getStarted: "Start Chat",
          inputPlaceholder: "Type your message…",
          closeButtonTooltip: "Close chat",
        }
      },
      metadata: {
        website: "MSV Body Pleasures",
        page: window.location.pathname,
      },
    });
  }, []);

  return null;
}
