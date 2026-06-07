import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const LANGUAGES = ['en', 'hi', 'ta', 'te'];

async function main() {
  const pages = [
    'courses', 'home', 'privacySettings', 'profile',
    'progress', 'securitySettings', 'trading', 'twoFactorAuth',
  ];

  const allKeys = new Set();
  const langKeys = { en: new Set(), hi: new Set(), ta: new Set(), te: new Set() };
  let totalStrings = 0;

  for (const page of pages) {
    const filePath = resolve(__dirname, `../src/language/pages/${page}.ts`);
    let content;
    try {
      content = readFileSync(filePath, 'utf-8');
    } catch {
      console.error(`  ❌ Missing page file: ${page}.ts`);
      continue;
    }

    for (const lang of LANGUAGES) {
      // Find the block for this language: extract keys after `lang: {`
      const regex = new RegExp(`\\b${lang}:\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\)?`, 'g');
      const match = content.match(regex);
      if (!match) {
        console.error(`  ❌ ${page}.ts: Missing language block '${lang}'`);
        continue;
      }

      // Extract property names from the language block
      const keyRegex = /^\s*(\w+)\s*:/gm;
      let keyMatch;
      while ((keyMatch = keyRegex.exec(match[0])) !== null) {
        const key = keyMatch[1];
        if (key !== 'export' && key !== 'const') {
          langKeys[lang].add(key);
          allKeys.add(key);
          totalStrings++;
        }
      }
    }
  }

  // Report missing keys per language
  let exitCode = 0;
  console.log(`\n📊 Translation completeness check`);
  console.log(`   Total unique keys: ${allKeys.size}`);
  console.log(`   Total strings across languages: ${totalStrings}`);
  console.log(`   Expected (full coverage): ${allKeys.size * 4}\n`);

  for (const lang of LANGUAGES) {
    const missing = [...allKeys].filter(k => !langKeys[lang].has(k));
    if (missing.length === 0) {
      console.log(`  ✅ ${lang}: complete (${langKeys[lang].size}/${allKeys.size} keys)`);
    } else {
      console.log(`  ⚠️  ${lang}: missing ${missing.length}/${allKeys.size} keys`);
      for (const k of missing) {
        console.log(`       - ${k}`);
      }
      exitCode = 1;
    }
  }

  // Check for English-only duplicates (keys only in en but not others)
  console.log('');
  process.exit(exitCode);
}

main();
