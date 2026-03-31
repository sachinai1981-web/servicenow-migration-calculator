# ServiceNow Migration Cost Calculator

A free, browser-based tool that helps enterprise CIOs and IT leaders estimate the true cost of migrating from ServiceNow to Freshservice — covering licensing savings, implementation costs, data migration effort, training, and change management — so they can build a credible business case before engaging a vendor.

## Live Demo

[https://sachinai1981-web.github.io/servicenow-migration-calculator](https://sachinai1981-web.github.io/servicenow-migration-calculator)

## Features

- **Comprehensive cost calculation** — models licensing delta, implementation effort, data migration complexity, training costs, and change management overhead
- **Email gate** — results are revealed only after the user enters a work email address, capturing warm leads for Freshworks demo booking
- **Mobile responsive** — fully usable on desktop, tablet, and phone with no layout breakage
- **No backend needed** — runs entirely in the browser; zero server costs, zero infrastructure to maintain
- **Instant results** — calculations happen client-side in real time as inputs change

## How the Calculation Works

The calculator uses a five-component cost model:

| Component | Formula |
|---|---|
| **Licensing savings** | (ServiceNow seat cost − Freshservice seat cost) × number of agents × contract years |
| **Implementation** | Base implementation rate × complexity multiplier (Low / Medium / High) |
| **Data migration** | Per-record estimate × total record volume × migration complexity factor |
| **Training** | Hours per agent × hourly rate × number of agents |
| **Change management** | Percentage of total project cost based on org size tier |

The **net migration cost** is the sum of implementation + data migration + training + change management, offset against the projected licensing savings over the selected contract term. A positive ROI means migration pays for itself within the chosen period.

## How to Deploy

### GitHub Pages (recommended)

1. Fork or clone this repository
2. Go to **Settings → Pages** in your GitHub repo
3. Set source to **GitHub Actions**
4. Push to `main` — the included workflow deploys automatically

The `.nojekyll` file in the root ensures GitHub Pages serves the site without Jekyll processing, which is required for files starting with `_` or `.` to be served correctly.

### Local development

No build step required — open `index.html` directly in any modern browser:

```bash
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | Vanilla HTML5 |
| Styling | Inline CSS (no external stylesheets) |
| Logic | Vanilla JavaScript (ES6+) |
| Dependencies | **None** |
| Build tool | **None** |

Everything ships in a single `index.html` plus a companion `calculator.js`. No npm, no bundler, no framework.

## License

MIT — free to use, fork, and adapt.
