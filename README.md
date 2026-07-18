# Virraaj — Fine Dining Restaurant & AI Orchestration Platform

> **Prototype v1** · Vanilla HTML / CSS / JavaScript — no build step required.

A luxury fine dining restaurant website with an integrated AI orchestration layer covering personalised guest experiences, marketing automation, and operational intelligence.

---

## Project Structure

```
virraaj/
├── index.html        # Main restaurant website
├── ai-demo.html      # AI Orchestration showcase & interactive demos
├── css/
│   ├── style.css     # Core design system (tokens, components, layout)
│   └── ai-demo.css   # AI demo page-specific styles
├── js/
│   ├── main.js       # Navigation, menu tabs, reservation form, AI chat concierge
│   └── ai-demo.js    # Interactive recommendation & sentiment demos
└── images/           # (Placeholder for photography assets)
```

---

## Website Features (`index.html`)

| Section | Details |
|---|---|
| **Hero** | Full-screen, animated landing with gold luxury palette |
| **Our Story** | About section with restaurant philosophy and stats |
| **Menu** | Tabbed interface — 7-course Tasting Menu, À La Carte, Drinks |
| **Chef** | Executive chef bio with accolades |
| **Gallery** | Interactive image grid with hover captions |
| **Events** | Private dining, Chef's Table, Wine Pairing, Corporate events |
| **Reservations** | Validated booking form with date/time/guest selectors |
| **AI Concierge** | Floating chat widget with canned NLP responses (prototype) |
| **Footer** | Full site links, contact, social, awards |

---

## AI Orchestration (`ai-demo.html`)

### Use Cases Implemented (Prototype)

| Use Case | Category | Status |
|---|---|---|
| Hyper-Personalised Campaigns | Marketing | 🟢 Live |
| AI Menu Recommendations | Guest Experience | 🟢 Live |
| Real-Time Review Sentiment | Reputation | 🟢 Live |
| Demand Forecasting | Operations | 🟡 Beta |
| Dynamic Pricing & Yield Management | Revenue | 🟡 Beta |
| AI Voice Reservation Agent | Reservations | ⚪ Planned |

### Interactive Demos

- **Menu Recommendation Engine** — Select dietary preferences and get AI-ranked dish suggestions with match scores.
- **Review Sentiment Analysis** — Click sample guest reviews to trigger real-time NLP sentiment scoring with animated bar charts.
- **Marketing Automation Timeline** — End-to-end automated guest journey from discovery through loyalty.
- **Architecture Diagram** — Visual layered diagram of the AI orchestration stack (Data Sources → Feature Pipeline → AI Layer → Output Channels).

### AI Stack (Production Vision)

- **LLM**: GPT-4o via Azure OpenAI
- **RAG**: Vector store for menu knowledge base and guest preference retrieval
- **Orchestration**: LangChain agent router
- **ML Models**: Time-series demand forecasting, RL-based pricing agent
- **NLP**: Sentiment classification across review platforms (Google, Zomato, Instagram)

---

## Running Locally

No build step required. Open directly in a browser:

```bash
# Option 1 – just open the file
open index.html

# Option 2 – serve with Python
python3 -m http.server 8080
# → http://localhost:8080

# Option 3 – serve with Node
npx serve .
# → http://localhost:3000
```

---

## Design System

- **Primary font**: Cormorant Garamond (serif) — headings, quotes, dish names
- **Secondary font**: Montserrat (sans-serif) — labels, body, navigation
- **Colour palette**: Deep charcoal bg (`#0d0c0b`) · Luxury gold (`#c9a84c`) · Warm cream (`#f5f0e8`)
- **Responsive**: Mobile-first, breakpoints at 480 / 768 / 1024 px
- **Accessibility**: ARIA roles/labels, keyboard navigation, `prefers-reduced-motion` support, focus-visible styling

---

## Roadmap

- [ ] **v2**: Connect reservation form to a real backend (e.g. Supabase / Firebase)
- [ ] **v2**: Replace canned AI chat responses with live LLM API calls
- [ ] **v3**: Build demand forecasting dashboard with real POS data ingestion
- [ ] **v3**: Implement AI voice reservation agent (Twilio + OpenAI Realtime API)
- [ ] **v4**: Full multi-agent orchestration platform with LangGraph
