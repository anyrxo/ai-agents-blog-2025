# 📋 Manual Copy-Paste Guide

Since file downloads don't work, here's how to manually create the files on GitHub:

## For Each Repository:

1. Go to the GitHub repository
2. Click "Add file" → "Create new file"
3. Enter the filename
4. Copy content from the source files below
5. Paste into GitHub editor
6. Commit the file

## 🚀 Quick Method: Import from Existing Repo

**EASIEST SOLUTION:**

Since all the code is already in the `ai-agents-blog-2025` repository on GitHub, you can:

### For Each Project:

1. Go to the project directory in `ai-agents-blog-2025`
2. Example for MCP Hub: https://github.com/anyrxo/ai-agents-blog-2025/tree/claude/research-popular-mcps-01VTybEeziRhvN1tTu6BNH1k
3. Navigate to `/mcp-hub-repo/` folder
4. Copy all files manually to your new `mcp-hub` repository

OR use GitHub's import feature:
1. Go to https://github.com/anyrxo/mcp-hub/import
2. Source repo: `https://github.com/anyrxo/ai-agents-blog-2025`
3. This won't work easily due to subdirectories...

## ✅ BEST SOLUTION: Use Git Locally

On your computer:

```bash
# Clone the main repo
git clone https://github.com/anyrxo/ai-agents-blog-2025.git
cd ai-agents-blog-2025
git checkout claude/research-popular-mcps-01VTybEeziRhvN1tTu6BNH1k

# For MCP Hub
cp -r mcp-hub-repo ../mcp-hub
cd ../mcp-hub
rm -rf .git
git init
git add .
git commit -m "Initial release"
git branch -M main
git remote add origin https://github.com/anyrxo/mcp-hub.git
git push -u origin main

# Repeat for other 4 projects
```

This is the fastest way to get everything uploaded.
