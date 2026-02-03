#!/usr/bin/env node

/**
 * Simple Arabic Markdown to HTML Converter
 * Converts Arabic markdown files to HTML with RTL support
 */

import * as fs from "fs";
import * as path from "path";
import { marked } from "marked";

const srcDir = path.join(process.cwd(), "ar/src");
const htmlDir = path.join(process.cwd(), "ar/html");

// HTML template with RTL support
const htmlTemplate = (title, content, chapterNum) => `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} - جافاسكريبت بليغ</title>
  <link rel="stylesheet" href="css/ejs.css">
  <link rel="stylesheet" href="css/ejs-rtl.css">
  <style>
    /* Additional inline styles for chapter content */
    article { max-width: 40em; }
    pre { direction: ltr; text-align: left; }
    code { direction: ltr; unicode-bidi: embed; }
  </style>
</head>
<body>
  <article>
    <nav>
      <a href="index.html">الرئيسية</a>
      ${chapterNum > 0 ? `<a href="${String(chapterNum - 1).padStart(2, '0')}_${getChapterFileName(chapterNum - 1)}.html">← السابق</a>` : ''}
      <a href="${String(chapterNum + 1).padStart(2, '0')}_${getChapterFileName(chapterNum + 1)}.html">التالي →</a>
    </nav>
    ${content}
    <nav style="margin-top: 3em; padding-top: 1em; border-top: 1px solid #ccc;">
      <a href="index.html">الرئيسية</a>
      ${chapterNum > 0 ? `<a href="${String(chapterNum - 1).padStart(2, '0')}_${getChapterFileName(chapterNum - 1)}.html">← السابق</a>` : ''}
      <a href="${String(chapterNum + 1).padStart(2, '0')}_${getChapterFileName(chapterNum + 1)}.html">التالي →</a>
    </nav>
  </article>
</body>
</html>`;

function getChapterFileName(num) {
  // This is a simplified mapping - you should update it as you translate more chapters
  const chapters = [
    "intro",
    "values",
    "program_structure", 
    "functions",
    "data",
    "higher_order",
    "object",
    "robot",
    "error",
    "regexp",
    "modules",
    "async",
    "language",
    "browser",
    "dom",
    "event",
    "game",
    "canvas",
    "http",
    "paint",
    "node",
    "skillsharing"
  ];
  return chapters[num] || "intro";
}

// Simple preprocessor for custom EJS markdown syntax
function preprocessMarkdown(content) {
  // Remove meta tags
  content = content.replace(/\{\{meta[^}]+\}\}\n*/g, '');
  
  // Remove index tags {{index ...}}
  content = content.replace(/\{\{index[^}]+\}\}\n*/g, '');
  content = content.replace(/\{\{indexsee[^}]+\}\}\n*/g, '');
  
  // Remove if blocks {{if ...}} ... {{if}}
  content = content.replace(/\{\{if\s+\w+\n([\s\S]*?)if\}\}/g, '$1');
  
  // Handle quotes {{quote ...}} ... quote}}
  content = content.replace(
    /\{\{quote\s*\{author:\s*"([^"]+)"\s*,\s*title:\s*"([^"]+)"[^}]*\}\n*\n([\s\S]*?)quote\}\}/g,
    '> **$3**\n> — *$1*, $2\n\n'
  );
  
  // Handle figures {{figure ...}}
  content = content.replace(
    /\{\{figure\s*\{url:\s*"([^"]+)"\s*,\s*alt:\s*"([^"]+)"[^}]*\}\}/g,
    '![$2]($1)\n\n'
  );
  
  // Handle double parentheses terms ((term))
  content = content.replace(/\(\(([^)]+)\)\)/g, '$1');
  
  // Handle fenced code blocks with language info
  content = content.replace(
    /```\{lang:\s*"?([^"}]+)"?[^}]*\}\n([\s\S]*?)```/g,
    '```$1\n$2```'
  );
  content = content.replace(
    /```\{([^}]+)\}\n([\s\S]*?)```/g,
    '```javascript\n$2```'
  );
  
  // Handle chapter links [text](chapter_id)
  content = content.replace(/\[([^\]]+)\]\((\w+)\)/g, '[$1]($2.html)');
  
  return content;
}

function buildChapter(filename) {
  const filepath = path.join(srcDir, filename);
  
  if (!fs.existsSync(filepath)) {
    console.log(`Warning: ${filename} not found, skipping...`);
    return false;
  }
  
  console.log(`Building ${filename}...`);
  
  const content = fs.readFileSync(filepath, "utf8");
  const processed = preprocessMarkdown(content);
  
  // Extract title from first h1
  const titleMatch = processed.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1] : filename;
  
  // Convert markdown to HTML
  const htmlContent = marked(processed);
  
  // Extract chapter number
  const chapterMatch = filename.match(/^(\d{2})_/);
  const chapterNum = chapterMatch ? parseInt(chapterMatch[1], 10) : 0;
  
  // Generate HTML
  const html = htmlTemplate(title, htmlContent, chapterNum);
  
  // Write output
  const outputFile = filename.replace('.md', '.html');
  const outputPath = path.join(htmlDir, outputFile);
  fs.writeFileSync(outputPath, html, "utf8");
  
  console.log(`  ✓ Created ${outputFile}`);
  return true;
}

function buildAll() {
  console.log("Building Arabic translation...\n");
  
  // Ensure html directory exists
  if (!fs.existsSync(htmlDir)) {
    fs.mkdirSync(htmlDir, { recursive: true });
  }
  
  // Get all markdown files
  const files = fs.readdirSync(srcDir)
    .filter(f => f.endsWith('.md'))
    .sort();
  
  if (files.length === 0) {
    console.log("No markdown files found in ar/src/");
    console.log("Please add your translated .md files there.");
    return;
  }
  
  let built = 0;
  for (const file of files) {
    if (buildChapter(file)) {
      built++;
    }
  }
  
  console.log(`\n✓ Built ${built} chapter(s)`);
  console.log(`\nOutput directory: ${htmlDir}`);
}

// Build specific chapter or all
const target = process.argv[2];
if (target && target.endsWith('.md')) {
  buildChapter(target);
} else if (target) {
  // Try with .md extension
  buildChapter(target + '.md');
} else {
  buildAll();
}
