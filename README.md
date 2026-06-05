# Sellably Auction

A single-page auction website for browsing listings, placing bids, and managing your profile. Built as a semester project using the Noroff API.

## Features

- Browse and search auction listings
- Sort listings by active or ended auctions
- Register and log in with a Noroff student email
- Place bids on active listings
- Create, edit, and delete your own listings
- Manage your profile, credits, and view your bids

## Prerequisites

- Node.js (v20+)
- npm

## Getting Started

### Installation

```bash
npm install
```

### Running the project

Build the styles, then start a local static server:

```bash
npm run build:css
npm run build:sass
npx serve .
```

Open the URL shown in the terminal (usually `http://localhost:3000`).

For development, you can watch CSS changes in a separate terminal:

```bash
npm run watch:css
```

### Running tests

```bash
npm run test
```

## Environment Variables

The app uses the Noroff API. You can configure these values in `src/api/httpClient.js`, or move them to a `.env` file if you add environment variable support:

```bash
API_KEY=your-api-key-here
BASE_URL=https://v2.api.noroff.dev
```

## Available Scripts

- `npm run build:css` - Build Tailwind CSS
- `npm run build:sass` - Compile Sass theme styles
- `npm run watch:css` - Watch and rebuild Tailwind CSS on changes
- `npm run test` - Run tests

## Technologies

- JavaScript
- HTML
- CSS
- Tailwind CSS
- Sass
- Noroff API

## Author

johnruud3
