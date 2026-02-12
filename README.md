# Multiple Timezone Meeting Planner

A responsive React application for planning meetings across multiple timezones. Built with React, Luxon, and Vite.

## Features

- **Searchable City List**: Add multiple cities from a searchable dropdown
- **Real-time Time Display**: Uses Luxon to display accurate current times for each city
- **24-Hour Slider**: Interactive slider that updates all cities simultaneously to show relative local times
- **Color-Coded Time Slots**:
  - 🟢 Green: Working hours (9 AM - 5 PM)
  - 🟡 Yellow: Waking hours (7 AM - 9 PM)
  - 🔴 Red: Sleeping hours (other times)
- **Copy Meeting Link**: Export selected meeting time in a formatted string to clipboard

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Usage

1. Search for and add cities using the search box
2. Use the 24-hour slider to select a meeting time
3. View the color-coded time grid to see optimal meeting times
4. Click "Copy Meeting Link" to copy a formatted string with all city times

## Technologies

- React 18
- Luxon (for timezone handling)
- Vite (build tool)
- CSS3 (responsive design)
