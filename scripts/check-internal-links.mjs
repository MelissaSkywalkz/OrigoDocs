import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();

const isExternalLink = (href) => {
  const trimmed = href.trim();
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('javascript:')
  );
};

const collectFiles = async (dir, ext) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath, ext)));
    } else if (entry.isFile() && entry.name.endsWith(ext)) {
      files.push(fullPath);
    }
  }
  return files;
};

const extractIds = (content) => {
  const ids = new Set();
  const idRegex = /id=["']([^"']+)["']/gi;
  let match = idRegex.exec(content);
  while (match) {
    ids.add(match[1]);
    match = idRegex.exec(content);
  }
  return ids;
};

const extractHrefs = (content) => {
  const hrefs = [];
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match = hrefRegex.exec(content);
  while (match) {
    hrefs.push(match[1]);
    match = hrefRegex.exec(content);
  }
  return hrefs;
};

const normalizeTarget = (href) => {
  const [pathPart] = href.split('#');
  return pathPart.split('?')[0];
};

const main = async () => {
  const htmlFiles = await collectFiles(repoRoot, '.html');
  const errors = [];

  const htmlCache = new Map();

  for (const file of htmlFiles) {
    const content = await fs.readFile(file, 'utf8');
    htmlCache.set(file, {
      content,
      ids: extractIds(content)
    });
  }

  for (const file of htmlFiles) {
    const { content, ids } = htmlCache.get(file);
    const hrefs = extractHrefs(content);

    for (const href of hrefs) {
      if (!href || href === '#' || href.startsWith('#')) {
        if (href && href.startsWith('#')) {
          const anchor = href.slice(1);
          if (anchor && !ids.has(anchor)) {
            errors.push(`${file}: saknar ankare #${anchor}`);
          }
        }
        continue;
      }

      if (isExternalLink(href)) {
        continue;
      }

      const normalized = normalizeTarget(href);
      const targetPath = path.resolve(path.dirname(file), normalized);

      try {
        const stat = await fs.stat(targetPath);
        if (!stat.isFile()) {
          errors.push(`${file}: länkmål finns inte: ${href}`);
          continue;
        }
      } catch {
        errors.push(`${file}: länkmål finns inte: ${href}`);
        continue;
      }

      const anchor = href.includes('#') ? href.split('#')[1] : null;
      if (anchor && targetPath.endsWith('.html')) {
        const target = htmlCache.get(targetPath);
        if (target && !target.ids.has(anchor)) {
          errors.push(`${file}: ankare saknas i ${normalized}: #${anchor}`);
        }
      }
    }
  }

  if (errors.length) {
    console.error('Hittade fel i interna länkar:');
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log('Interna länkar OK.');
};

main();
