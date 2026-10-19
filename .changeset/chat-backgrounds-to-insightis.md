---
'@devart/ui-react': major
---

Removed the chat-landing backgrounds from the system (DESIGN-SYSTEM-CHANGES.md §124): the tokens `--chat-shell-bg` and `--chat-glow-fill` (`globals.css`, light and dark) and the Tailwind utilities `bg-chat-shell` and `bg-chat-glow`. They were one product's screen background, not a system decision — Insightis now owns them in its own kit. A consumer that used them defines its own.
