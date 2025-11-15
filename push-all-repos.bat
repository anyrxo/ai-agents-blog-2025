@echo off
echo ========================================
echo Pushing All 5 Projects to GitHub
echo ========================================
echo.

echo [1/5] MCP Hub...
git clone mcp-hub.bundle mcp-hub
cd mcp-hub
git remote add origin https://github.com/anyrxo/mcp-hub.git
git push origin claude/mcp-hub-01VTybEeziRhvN1tTu6BNH1k:main
cd ..
echo ✓ MCP Hub pushed!
echo.

echo [2/5] MCP Secure...
git clone mcp-secure.bundle mcp-secure
cd mcp-secure
git remote add origin https://github.com/anyrxo/mcp-secure.git
git push origin claude/mcp-secure-01VTybEeziRhvN1tTu6BNH1k:main
cd ..
echo ✓ MCP Secure pushed!
echo.

echo [3/5] SEO E-E-A-T Analyzer...
git clone seo-eeat-analyzer.bundle seo-eeat-analyzer
cd seo-eeat-analyzer
git remote add origin https://github.com/anyrxo/seo-eeat-analyzer.git
git push origin claude/seo-eat-analyzer-01VTybEeziRhvN1tTu6BNH1k:main
cd ..
echo ✓ E-E-A-T Analyzer pushed!
echo.

echo [4/5] MCP Monitor...
git clone mcp-monitor.bundle mcp-monitor
cd mcp-monitor
git remote add origin https://github.com/anyrxo/mcp-monitor.git
git push origin claude/mcp-monitor-01VTybEeziRhvN1tTu6BNH1k:main
cd ..
echo ✓ MCP Monitor pushed!
echo.

echo [5/5] MCP Test...
git clone mcp-test.bundle mcp-test
cd mcp-test
git remote add origin https://github.com/anyrxo/mcp-test.git
git push origin claude/mcp-test-01VTybEeziRhvN1tTu6BNH1k:main
cd ..
echo ✓ MCP Test pushed!
echo.

echo ========================================
echo 🎉 ALL REPOSITORIES PUSHED!
echo ========================================
echo.
echo Your repositories:
echo   1. https://github.com/anyrxo/mcp-hub
echo   2. https://github.com/anyrxo/mcp-secure
echo   3. https://github.com/anyrxo/seo-eeat-analyzer
echo   4. https://github.com/anyrxo/mcp-monitor
echo   5. https://github.com/anyrxo/mcp-test
echo.
echo ✅ Ready for public use!
echo.
pause
