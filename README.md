# BizLink AI

Packaging intelligence for small businesses.

## Overview

BizLink AI is a packaging discovery and planning platform designed for small businesses that need practical packaging guidance without guesswork. The app helps users search for suitable packaging materials, boxes, and accessories based on their business type, product category, and packaging needs.

The platform uses the application's local static packaging dataset as its data source, while contextual AI-style guidance helps explain the trade-offs and recommend a sensible next step. This keeps the experience grounded in actual business data instead of generating unsupported or fictional products.

## Problem Statement

Small businesses often struggle to choose the right packaging materials, quantities, and presentation choices for their products. Common challenges include matching packaging to the product type, staying within budget, balancing protection with presentation, and understanding minimum order requirements or cost trade-offs without a clear decision framework.

For makers, retailers, and boutique brands, this creates friction in both customer experience and operational cost. A packaging decision that looks ideal on paper may be too expensive, too fragile, or unsuitable for the product category.

## Solution

BizLink AI helps simplify this process by bringing the packaging search and planning workflow into one place. Users can search by business need, apply filters, compare packaging options, and build a plan using records from the local static seed dataset. The app also includes goal-based ranking and cost-aware planning so recommendations can be tailored to different priorities such as budget, sustainability, or premium presentation.

## Key Features

### Smart Packaging Search

- Search by business need, such as packaging for Bakery, Crochet, Jewellery, Candles, and Rakhi
- Quick search suggestions for common packaging scenarios
- Business-specific query handling through the app search flow
- Search results grounded in the project’s internal packaging dataset

### Seed-Data Recommendations

- Materials, boxes, and accessories pulled from the project's local static seed data
- Product matching based on category, business fit, material type, and other filters
- Recommendation lists for packaging-related products and add-ons
- Supplier and guide information associated with results

### Packaging Goal Optimization

- Goal selector for Best Value, Eco-Friendly, and Premium
- Goal-based recommendation prioritization without inventing new products
- Goal-aware suggestions that influence ranking and guidance copy

### Budget-Aware Planning

- Packaging budget input for ongoing plan calculation
- Budget progress tracking and over-budget status
- Real-time total updates for selected packaging items
- Cost-based guidance within the live summary experience

### Smart Filters

- Category filtering
- Material and supplier filtering
- Eco-Friendly, Reusable, and Recyclable toggles
- Max price limit filtering
- Availability-based filtering

### Packaging Plan Builder

- Add to Plan interactions for selected items
- Quantity controls and minimum order quantity handling
- Live summary of selected materials, recommendations, and accessories
- Estimated total calculation based on chosen quantities
- Plan completeness tracking for primary packaging, protection, and branding/finishing

### AI Packaging Insight

- Contextual packaging guidance displayed alongside search results
- Recommendations grounded in current seed-data results and selected plan items
- Explanation text designed to support decision-making rather than fabricate unavailable products

### User Experience

- Responsive UI for search and result browsing
- Light and dark theme support
- Language selector support
- Premium dashboard-style interface for packaging discovery and planning

## How BizLink AI Works

```text
Business requirement
        ↓
Search / query
        ↓
Local seed-data matching
        ↓
Filters + packaging goal
        ↓
Ranked packaging recommendations
        ↓
Contextual guidance
        ↓
User builds a packaging plan
```

The workflow begins with a business requirement such as packaging for Jewellery or Bakery, then narrows results using filters and goal preferences. Relevant product records are retrieved from the app's local static seed data, ranked by relevance and suitability, and presented alongside AI-style guidance that explains the reasoning behind the recommendations.

## Packaging Goals

The project includes three packaging optimization goals:

- Best Value: prioritizes practical, affordable options from existing results
- Eco-Friendly: prioritizes products marked as eco-conscious, reusable, or recyclable where available
- Premium: prioritizes presentation-focused and high-end packaging options already present in the dataset

These goals influence the ranking and explanatory guidance, but they do not generate fake products. The app continues to rely on the actual seed-data records available in the project.

## AI + Seed-Data Architecture

BizLink AI uses a local static seed-data architecture:

- Local static seed data is the source of truth for product inventory, materials, accessories, and supplier information.
- Search and ranking are based on real records already present in the app.
- AI guidance is used for explanation, prioritization, and contextual suggestion, not for inventing unavailable products.
- Recommendations are therefore grounded in searchable and verifiable data rather than generated inventory.

This keeps the system practical, transparent, and useful for real business decision-making.

## Tech Stack

### Frontend

- Next.js 16.3.0
- React 19.2.8
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

### Backend

- Next.js App Router API routes
- Server-side data handling through search APIs

### AI

- Contextual suggestion and explanation patterns within the app experience
- Guidance is tied to current search results and dataset records

### Development tools

- ESLint
- TypeScript compiler
- Next.js build tooling

## Project Structure

```text
bizlink-ai/
├── app/
│   ├── api/
│   │   └── search/
│   │       └── route.ts
│   ├── business/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── details/
│   │   └── [type]/
│   │       └── [id]/
│   │           └── page.tsx
│   ├── material/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── search/
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── navigation.tsx
│   ├── profile-readiness.tsx
│   ├── providers.tsx
│   ├── search-results.tsx
│   └── search-shell.tsx
├── lib/
│   ├── i18n.ts
│   ├── query-parser.ts
│   ├── search-service.ts
│   └── seed-data.ts
├── public/
├── types/
│   └── index.ts
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
└── package-lock.json
```

## Getting Started

### Prerequisites

- Node.js compatible with the current Next.js setup
- npm

### 1) Clone the repository

```bash
git clone https://github.com/kanishkachauhan003-rgb/BizLink-AI.git
cd BizLink-AI
```

### 2) Install dependencies

```bash
npm install
```

### 3) Start the development server

```bash
npm run dev
```

Then open the app in your browser at:

```text
http://localhost:3000
```

### 4) Production build

```bash
npm run build
```

### 5) Start the production server

```bash
npm run start
```

### 6) Linting

```bash
npm run lint
```

## Data Source

The current app uses local static seed data in `lib/seed-data.ts` for packaging materials, boxes, accessories, suppliers, businesses, guides, and eco alternatives.

## Example Searches

- Packaging for Crochet
- Packaging for Jewellery
- Packaging for Bakery
- Packaging for Candles
- Packaging for Rakhi
- Packaging for Chocolate
- Packaging for Gift Products

## Future Improvements

The following are realistic future extensions, not current features:

- Additional supplier and order management workflows
- Expanded product datasets for more business categories
- More advanced packaging recommendation logic based on product dimensions and shipping needs
- Enhanced analytics for packaging cost and sustainability tracking
- Improved personalization and saved packaging plans

## Author

Kanishka Chauhan

LinkedIn: https://www.linkedin.com/in/kanishkachauhan003

GitHub: https://github.com/kanishkachauhan003-rgb

LeetCode: https://leetcode.com/u/kanishkachauhan003/

---

Built with a focus on practical packaging discovery, grounded recommendation logic, and a cleaner shopping/planning experience for small businesses.

## Acknowledgement

Thank you for exploring BizLink AI. This project reflects a practical approach to packaging intelligence, combining structured data, business-specific matching, and lighter AI guidance to help simplify packaging decisions.

