#!/usr/bin/env node
/**
 * Build Search Index for OrigoDocs
 *
 * Crawls HTML files and extracts:
 * - Page title and metadata
 * - Headings (h1-h3) with their IDs for deep linking
 * - Text content from key sections
 * - Special handling for troubleshooting symptoms
 *
 * Output: search/search-index.json
 */

const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '..', 'pages');
const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_PATH = path.join(__dirname, '..', 'search', 'search-index.json');

/**
 * Extract text content from HTML string (simple regex-based)
 * @param {string} html
 * @returns {string}
 */
function extractText(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract heading sections from HTML
 * @param {string} html
 * @returns {Array<{level: number, id: string, text: string, content: string}>}
 */
function extractHeadings(html) {
  const headings = [];
  const regex = /<h([2-3])[^>]*id=["']([^"']+)["'][^>]*>(.*?)<\/h\1>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const id = match[2];
    const text = extractText(match[3]);

    // Extract content after this heading (simplified: next 500 chars)
    const afterHeading = html.substring(match.index + match[0].length);
    const contentMatch = afterHeading.match(/^[\s\S]{0,800}/);
    const content = contentMatch ? extractText(contentMatch[0]) : '';

    headings.push({ level, id, text, content: content.substring(0, 300) });
  }

  return headings;
}

/**
 * Extract troubleshooting symptoms
 * @param {string} html
 * @returns {Array<{title: string, cause: string, keywords: string}>}
 */
function extractSymptoms(html) {
  const symptoms = [];
  
  // Find all symptom rows
  const rowRegex = /<div class="symptom-row"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowHtml = rowMatch[1];
    
    // Extract title
    const titleMatch = rowHtml.match(/<h3 class="symptom-title">(.*?)<\/h3>/i);
    if (!titleMatch) continue;
    const title = extractText(titleMatch[1]);
    
    // Extract cause
    const causeMatch = rowHtml.match(/symptom-col--cause[^>]*>[\s\S]*?<\/div>[\s\S]*?<div[^>]*>([\s\S]*?)<\/div>/i);
    const cause = causeMatch ? extractText(causeMatch[1]) : '';
    
    symptoms.push({
      title,
      cause,
      keywords: `${title} ${cause}`.toLowerCase(),
    });
  }

  return symptoms;
}

/**
 * Process a single HTML file
 * @param {string} filePath
 * @param {string} relativeUrl
 * @returns {Array<Object>}
 */
function processFile(filePath, relativeUrl) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const entries = [];

  // Extract page title
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const pageTitle = titleMatch ? extractText(titleMatch[1]) : path.basename(filePath, '.html');

  // Extract eyebrow (category)
  const eyebrowMatch = html.match(/<span class="eyebrow">(.*?)<\/span>/i);
  const category = eyebrowMatch ? extractText(eyebrowMatch[1]) : '';

  // Extract main heading
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const h1Text = h1Match ? extractText(h1Match[1]) : '';

  // Extract main content section text
  const contentMatch = html.match(/<section[^>]*class="doc-content"[^>]*>([\s\S]*?)<\/section>/i);
  const mainContent = contentMatch ? extractText(contentMatch[1]).substring(0, 500) : '';

  // Main page entry
  const pageId = path.basename(filePath, '.html');
  entries.push({
    id: pageId,
    title: pageTitle,
    category,
    url: relativeUrl,
    heading: h1Text,
    content: mainContent,
    type: 'page',
    weight: 1,
  });

  // Extract headings for deep links
  const headings = extractHeadings(html);
  headings.forEach((heading) => {
    entries.push({
      id: `${pageId}-${heading.id}`,
      title: `${pageTitle}: ${heading.text}`,
      category,
      url: `${relativeUrl}#${heading.id}`,
      heading: heading.text,
      content: heading.content,
      type: 'section',
      weight: 1.2,
    });
  });

  // Special handling for troubleshooting page
  if (pageId === 'troubleshooting') {
    const symptoms = extractSymptoms(html);
    symptoms.forEach((symptom, index) => {
      entries.push({
        id: `troubleshoot-symptom-${index}`,
        title: `Felsökning: ${symptom.title}`,
        category: 'Felsökning',
        url: `${relativeUrl}#symptom-rotorsak`,
        heading: symptom.title,
        content: `Symptom: ${symptom.title}. Orsak: ${symptom.cause}`,
        keywords: symptom.keywords,
        type: 'symptom',
        weight: 2.0, // Higher weight for symptom matches
      });
    });
  }

  return entries;
}

/**
 * Main build function
 */
function buildSearchIndex() {
  const index = [];

  // Process index.html
  const indexPath = path.join(ROOT_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    index.push(...processFile(indexPath, 'index.html'));
  }

  // Process all pages
  if (fs.existsSync(PAGES_DIR)) {
    const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.html'));

    files.forEach((file) => {
      const filePath = path.join(PAGES_DIR, file);
      const relativeUrl = `pages/${file}`;
      index.push(...processFile(filePath, relativeUrl));
    });
  }

  // Write output
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2), 'utf-8');
  console.log(`✓ Search index built: ${index.length} entries`);
  console.log(`  Output: ${OUTPUT_PATH}`);
}

// Run
try {
  buildSearchIndex();
} catch (error) {
  console.error('✗ Failed to build search index:', error.message);
  process.exit(1);
}
