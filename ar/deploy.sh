#!/bin/bash

# Deploy script for GitHub Pages
# This script prepares the Arabic translation for GitHub Pages

echo "🚀 Preparing Arabic translation for GitHub Pages..."

# Build the HTML
echo "📦 Building HTML files..."
cd "$(dirname "$0")"
node build.mjs

# Check if build succeeded
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Create .nojekyll to disable Jekyll processing (needed for GitHub Pages)
touch html/.nojekyll

echo "✅ Ready for GitHub Pages!"
echo ""
echo "📋 Next steps:"
echo "   1. Push to GitHub:"
echo "      git add ar/"
echo "      git commit -m 'Add Arabic translation structure'"
echo "      git push origin main"
echo ""
echo "   2. Enable GitHub Pages:"
echo "      - Go to Settings → Pages"
echo "      - Source: Deploy from a branch"
echo "      - Branch: main /root"
echo "      - Folder: /ar/html"
echo ""
echo "   3. Your site will be at:"
echo "      https://yourusername.github.io/Eloquent-JavaScript/ar/html/"
echo ""
echo "🌟 Don't forget to:"
echo "   - Update ar/README.md with your name"
echo "   - Update ar/html/index.html with your name"
echo "   - Translate more chapters in ar/src/"
echo "   - Run 'node build.mjs' after each translation"
