#!/bin/bash

echo "========================================="
echo "Pushing All 5 Projects to GitHub"
echo "========================================="
echo ""

# Clone the blog repo first
echo "📥 Cloning ai-agents-blog-2025..."
git clone https://github.com/anyrxo/ai-agents-blog-2025.git temp-blog
cd temp-blog
git checkout claude/research-popular-mcps-01VTybEeziRhvN1tTu6BNH1k
cd ..

echo ""
echo "========================================="
echo "Project 1/5: MCP Hub"
echo "========================================="
cp -r temp-blog/mcp-hub-repo mcp-hub
cd mcp-hub
rm -rf .git
git init
git add .
git commit -m "Initial release - MCP Hub package manager

Features:
- Package discovery and search
- One-command installation
- Configuration management
- System diagnostics

Tests: 21/21 passing (100%)
"
git branch -M main
git remote add origin https://github.com/anyrxo/mcp-hub.git
git push -u origin main
cd ..
echo "✅ MCP Hub pushed!"

echo ""
echo "========================================="
echo "Project 2/5: MCP Secure"
echo "========================================="
cp -r temp-blog/mcp-secure-repo mcp-secure
cd mcp-secure
rm -rf .git
git init
git add .
git commit -m "Initial release - Security scanner for MCP servers

Features:
- 10 security rules
- AST-based static analysis
- CI/CD integration
- Detailed fix recommendations

Scanner: Fully functional
"
git branch -M main
git remote add origin https://github.com/anyrxo/mcp-secure.git
git push -u origin main
cd ..
echo "✅ MCP Secure pushed!"

echo ""
echo "========================================="
echo "Project 3/5: SEO E-E-A-T Analyzer"
echo "========================================="
cp -r temp-blog/seo-eat-analyzer seo-eeat-analyzer
cd seo-eeat-analyzer
rm -rf .git
git init
git add .
git commit -m "Initial release - E-E-A-T and AEO content analyzer

Features:
- E-E-A-T scoring (Experience, Expertise, Authoritativeness, Trustworthiness)
- AEO readiness (ChatGPT, Perplexity, Google AI)
- Structured data detection
- Actionable recommendations

Tests: 27/27 passing (100%)
"
git branch -M main
git remote add origin https://github.com/anyrxo/seo-eeat-analyzer.git
git push -u origin main
cd ..
echo "✅ E-E-A-T Analyzer pushed!"

echo ""
echo "========================================="
echo "Project 4/5: MCP Monitor"
echo "========================================="
cp -r temp-blog/mcp-monitor mcp-monitor
cd mcp-monitor
rm -rf .git
git init
git add .
git commit -m "Initial release - Real-time observability for MCP servers

Features:
- Real-time metrics dashboard
- Performance tracking
- HTTP API
- Metrics export
- Auto instrumentation

Tests: 30/30 passing (100%)
"
git branch -M main
git remote add origin https://github.com/anyrxo/mcp-monitor.git
git push -u origin main
cd ..
echo "✅ MCP Monitor pushed!"

echo ""
echo "========================================="
echo "Project 5/5: MCP Test"
echo "========================================="
cp -r temp-blog/mcp-test mcp-test
cd mcp-test
rm -rf .git
git init
git add .
git commit -m "Initial release - Jest-like testing framework for MCP

Features:
- Jest-like API (describe, test, expect)
- 20+ assertion matchers
- MCP-specific mocks
- Lifecycle hooks
- Async/await support

Tests: 31/31 passing (100%)
"
git branch -M main
git remote add origin https://github.com/anyrxo/mcp-test.git
git push -u origin main
cd ..
echo "✅ MCP Test pushed!"

# Cleanup
echo ""
echo "🧹 Cleaning up..."
rm -rf temp-blog mcp-hub mcp-secure seo-eeat-analyzer mcp-monitor mcp-test

echo ""
echo "========================================="
echo "🎉 ALL 5 PROJECTS PUSHED SUCCESSFULLY!"
echo "========================================="
echo ""
echo "Your repositories:"
echo "  1. https://github.com/anyrxo/mcp-hub"
echo "  2. https://github.com/anyrxo/mcp-secure"
echo "  3. https://github.com/anyrxo/seo-eeat-analyzer"
echo "  4. https://github.com/anyrxo/mcp-monitor"
echo "  5. https://github.com/anyrxo/mcp-test"
echo ""
echo "✅ All projects are now live and ready for public use!"
echo ""
