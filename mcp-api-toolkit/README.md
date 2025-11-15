# 🚀 MCP API Toolkit

> Comprehensive API development and testing MCP server for Claude Code

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-1.0-green)](https://modelcontextprotocol.io)

**MCP API Toolkit** brings powerful API development capabilities to Claude Code through the Model Context Protocol. Think Postman + OpenAPI + AI-powered testing, all integrated into your Claude workflow.

## ✨ Features

- 🔍 **OpenAPI/Swagger Parsing** - Import and validate API specifications
- 🧪 **API Testing** - Execute and validate API requests with AI insights
- 📚 **Documentation Generation** - Auto-generate beautiful API docs
- 🛠️ **SDK Generation** - Create TypeScript, Python, JavaScript SDKs automatically
- 🎭 **Mock Data** - Generate realistic test data from schemas
- ⚡ **Batch Testing** - Test multiple endpoints at once
- 🔒 **Request Validation** - Ensure requests/responses match schemas
- 📊 **Performance Insights** - Track response times and sizes

## 📦 Installation

### NPM (Recommended)

```bash
npm install -g mcp-api-toolkit
```

### From Source

```bash
git clone https://github.com/yourusername/mcp-api-toolkit.git
cd mcp-api-toolkit
npm install
npm run build
npm link
```

## 🔧 Configuration

Add to your Claude Code MCP settings:

### macOS/Linux: `~/Library/Application Support/Claude/claude_desktop_config.json`
### Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "api-toolkit": {
      "command": "mcp-api-toolkit"
    }
  }
}
```

Or with npx:

```json
{
  "mcpServers": {
    "api-toolkit": {
      "command": "npx",
      "args": ["-y", "mcp-api-toolkit"]
    }
  }
}
```

Restart Claude Code to activate the MCP server.

## 🎯 Usage

### 1. Parse OpenAPI Specification

```
Parse this OpenAPI spec: https://api.example.com/openapi.json
```

Or paste the spec directly:

```
Parse this OpenAPI spec:
{
  "openapi": "3.0.0",
  "info": { "title": "My API", "version": "1.0.0" },
  ...
}
```

### 2. List API Endpoints

```
List all endpoints from the parsed spec
```

### 3. Test an Endpoint

```
Test the GET /users endpoint with authentication header
```

Claude will use the `test_api_endpoint` tool:

```
GET https://api.example.com/users
Headers: { "Authorization": "Bearer token" }
```

### 4. Generate SDK

```
Generate a TypeScript SDK from the parsed spec
```

Claude will create a fully-typed client library:

```typescript
export class MyAPIClient {
  async getUsers(config?: RequestConfig): Promise<User[]> {
    // Auto-generated implementation
  }
}
```

### 5. Generate Documentation

```
Generate markdown documentation for this API
```

### 6. Create Mock Data

```
Generate 5 mock user objects based on this schema:
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "email": { "type": "string" },
    "age": { "type": "number" }
  }
}
```

## 🛠️ Available Tools

### `parse_openapi`
Parse and validate OpenAPI/Swagger specifications (JSON, YAML, or URL).

**Input:**
- `input` (string): OpenAPI spec as JSON/YAML or URL
- `isUrl` (boolean): Whether input is a URL

**Output:** Parsed specification with summary

### `list_endpoints`
Extract all API endpoints from a specification.

**Input:**
- `spec` (string): OpenAPI spec JSON
- `filterByTag` (string, optional): Filter by tag
- `filterByMethod` (string, optional): Filter by HTTP method

**Output:** List of endpoints with methods and paths

### `test_api_endpoint`
Execute and validate API requests.

**Input:**
- `method` (string): HTTP method (GET, POST, PUT, PATCH, DELETE)
- `url` (string): Full URL to test
- `headers` (object, optional): HTTP headers
- `body` (object, optional): Request body
- `params` (object, optional): Query parameters
- `expectedStatus` (number, optional): Expected HTTP status
- `timeout` (number, optional): Timeout in ms (default: 30000)

**Output:** Response data, status, timing, validation results

### `generate_sdk`
Generate client SDKs in multiple languages.

**Input:**
- `spec` (string): OpenAPI spec JSON
- `language` (string): typescript | python | javascript | go
- `clientName` (string, optional): Custom client class name

**Output:** Generated SDK code

### `generate_mock_data`
Create mock data from JSON schemas.

**Input:**
- `schema` (object): JSON Schema definition
- `count` (number, optional): Number of objects to generate

**Output:** Array of mock data objects

### `generate_api_docs`
Generate markdown documentation from OpenAPI specs.

**Input:**
- `spec` (string): OpenAPI spec JSON
- `includeExamples` (boolean, optional): Include examples (default: true)

**Output:** Markdown documentation

### `validate_api_response`
Validate responses against schemas.

**Input:**
- `response` (object): API response data
- `schema` (object): Expected schema

**Output:** Validation results

### `batch_test_endpoints`
Test multiple endpoints at once.

**Input:**
- `spec` (string): OpenAPI spec JSON
- `baseUrl` (string, optional): Override base URL
- `filterByTag` (string, optional): Test only tagged endpoints
- `headers` (object, optional): Common headers

**Output:** Batch test results summary

## 📖 Examples

### Example 1: Test a Public API

```
Parse the JSONPlaceholder API: https://jsonplaceholder.typicode.com/

Then test the GET /posts/1 endpoint
```

### Example 2: Generate a Client Library

```
Parse this OpenAPI spec and generate a Python SDK:

{
  "openapi": "3.0.0",
  "info": { "title": "User API", "version": "1.0.0" },
  "servers": [{ "url": "https://api.example.com" }],
  "paths": {
    "/users": {
      "get": {
        "summary": "List users",
        "responses": {
          "200": { "description": "Success" }
        }
      }
    }
  }
}
```

### Example 3: API Testing Workflow

```
1. Parse the Stripe API spec: https://raw.githubusercontent.com/stripe/openapi/master/openapi/spec3.json
2. List all payment-related endpoints
3. Generate TypeScript SDK
4. Create mock customer data
```

## 🎨 Use Cases

### API Development
- Import existing OpenAPI specs
- Test endpoints during development
- Generate client libraries automatically
- Create API documentation

### API Testing
- Validate API responses
- Batch test endpoints for health checks
- Performance testing with timing metrics
- Mock data generation for testing

### API Integration
- Generate SDKs for easy integration
- Test third-party APIs before integration
- Validate API contracts
- Document external APIs

### Learning & Exploration
- Explore public APIs (GitHub, Stripe, Twitter, etc.)
- Understand API structures
- Generate working code examples
- Create educational documentation

## 🏗️ Architecture

```
mcp-api-toolkit/
├── src/
│   ├── index.ts           # Main MCP server
│   ├── tools/             # MCP tool definitions
│   ├── utils/
│   │   ├── openapi-parser.ts  # OpenAPI parsing
│   │   ├── api-client.ts      # HTTP client
│   │   └── sdk-generator.ts   # SDK generation
│   └── types/
│       └── api.ts         # TypeScript types
├── examples/              # Usage examples
├── docs/                  # Documentation
└── tests/                 # Unit tests
```

## 🔒 Security

- No API credentials are stored
- All requests are made on-demand
- Rate limiting respect
- Input validation with Zod
- HTTPS-only for URL parsing

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🌟 Star History

If you find this project useful, please consider giving it a star on GitHub!

## 🔗 Links

- [Model Context Protocol](https://modelcontextprotocol.io)
- [Claude Code](https://claude.ai)
- [OpenAPI Specification](https://www.openapis.org/)
- [Report Issues](https://github.com/yourusername/mcp-api-toolkit/issues)

## 💡 Inspiration

Built to solve the API-first development workflow in 2025. Inspired by:
- Postman's intuitive API testing
- OpenAPI's standardization
- Claude's AI-powered development assistance

## 📧 Support

- Documentation: [docs/](./docs)
- Issues: [GitHub Issues](https://github.com/yourusername/mcp-api-toolkit/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/mcp-api-toolkit/discussions)

---

**Made with ❤️ for the Claude Code community**

*Supercharge your API development workflow with AI!*
