# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-11-15

### Added
- Initial release of MCP API Toolkit
- OpenAPI/Swagger specification parsing and validation
- API endpoint testing with detailed metrics
- TypeScript SDK generation from OpenAPI specs
- Python SDK generation from OpenAPI specs
- Mock data generation based on JSON schemas
- Markdown API documentation generation
- API response validation
- Batch endpoint testing for health checks
- 8 comprehensive MCP tools for Claude Code

### Features
- **parse_openapi**: Parse OpenAPI/Swagger specs from JSON, YAML, or URLs
- **list_endpoints**: Extract and filter API endpoints
- **test_api_endpoint**: Execute and validate API requests
- **generate_sdk**: Generate TypeScript, Python, JavaScript SDKs
- **generate_mock_data**: Create realistic test data
- **generate_api_docs**: Auto-generate API documentation
- **validate_api_response**: Validate responses against schemas
- **batch_test_endpoints**: Test multiple endpoints at once

### Developer Experience
- Full TypeScript support with strict typing
- Comprehensive error handling
- Performance metrics (response time, size)
- Security validation
- Detailed logging

### Documentation
- Comprehensive README with examples
- Detailed usage guide
- Contributing guidelines
- Code of conduct
- MIT License

### Infrastructure
- GitHub Actions CI/CD
- Automated testing
- ESLint and Prettier configuration
- NPM package publishing workflow

[Unreleased]: https://github.com/yourusername/mcp-api-toolkit/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/mcp-api-toolkit/releases/tag/v0.1.0
