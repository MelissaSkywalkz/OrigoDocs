import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();

const collectJsonFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') {
        continue;
      }
      files.push(...(await collectJsonFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      if (entry.name === 'package-lock.json') {
        continue;
      }
      files.push(fullPath);
    }
  }
  return files;
};

const main = async () => {
  const searchIndex = path.join(repoRoot, 'search-index.json');
  try {
    await fs.access(searchIndex);
  } catch {
    console.error('search-index.json saknas i repo-root.');
    process.exit(1);
  }

  const jsonFiles = await collectJsonFiles(repoRoot);
  const errors = [];

  for (const file of jsonFiles) {
    try {
      const content = await fs.readFile(file, 'utf8');
      JSON.parse(content);
    } catch (error) {
      errors.push(`${file}: ogiltig JSON (${error.message})`);
    }
  }

  if (errors.length) {
    console.error('JSON-validering misslyckades:');
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log('JSON-validering OK.');
};

main();
