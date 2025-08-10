const fs = require('fs');
const path = require('path');

// Read the landing.tsx file
const filePath = path.join(__dirname, 'src/shared/components/landing.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Define replacements
const replacements = [
  // Background colors
  { from: /bg-white dark:bg-black\/80/g, to: 'bg-card' },
  { from: /bg-white dark:bg-black\/40/g, to: 'bg-background' },
  { from: /bg-gray-50 dark:bg-black\/80/g, to: 'bg-card' },
  { from: /bg-gray-100 dark:bg-white\/5/g, to: 'bg-muted' },
  
  // Border colors
  { from: /border-gray-200 dark:border-white\/10/g, to: 'border-border' },
  { from: /border-gray-200 dark:border-white\/20/g, to: 'border-border' },
  { from: /border-white\/20/g, to: 'border-border' },
  
  // Text colors
  { from: /text-gray-900 dark:text-white/g, to: 'text-foreground' },
  { from: /text-gray-700 dark:text-white\/80/g, to: 'text-muted-foreground' },
  { from: /text-gray-700 dark:text-white\/60/g, to: 'text-muted-foreground' },
  { from: /text-gray-900 dark:text-white\/90/g, to: 'text-foreground' },
  { from: /text-gray-900 dark:text-white\/60/g, to: 'text-muted-foreground' },
  { from: /text-black dark:text-white/g, to: 'text-foreground' },
  
  // Purple colors (keep as is, just remove dark variants)
  { from: /text-purple-600 dark:text-purple-200/g, to: 'text-purple-600' },
  { from: /text-purple-500 dark:text-purple-200\/60/g, to: 'text-purple-500' },
  { from: /text-purple-500 dark:text-purple-200\/80/g, to: 'text-purple-500' },
  
  // Hover states
  { from: /hover:bg-white\/10/g, to: 'hover:bg-accent' },
  { from: /hover:border-gray-300 dark:hover:border-white\/30/g, to: 'hover:border-border' },
  
  // Button colors
  { from: /bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200/g, to: 'bg-primary text-primary-foreground hover:bg-primary/90' },
  
  // Placeholder colors
  { from: /placeholder-gray-400 dark:placeholder-purple-200\/40/g, to: 'placeholder-muted-foreground' },
  
  // Shadow colors
  { from: /dark:shadow-white\/10/g, to: '' },
];

// Apply replacements
replacements.forEach(({ from, to }) => {
  content = content.replace(from, to);
});

// Write back to file
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Successfully replaced dark: classes with semantic colors in landing.tsx');
