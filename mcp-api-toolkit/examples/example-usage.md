# MCP API Toolkit - Example Usage

This guide shows real-world examples of using MCP API Toolkit with Claude Code.

## Example 1: Testing GitHub API

### Step 1: Parse the GitHub API

```
Can you parse the GitHub API OpenAPI spec? It's available at:
https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json
```

Claude will use the `parse_openapi` tool and show you:
- API title and version
- Number of endpoints
- Base URL
- Available methods

### Step 2: List Repository Endpoints

```
Show me all the endpoints related to repositories
```

Claude will filter and display repository-related endpoints.

### Step 3: Test an Endpoint

```
Test the GET /repos/{owner}/{repo} endpoint for the repository "microsoft/typescript"
```

Claude will execute the request and show:
- Response status
- Response time
- Data size
- Full response body

### Step 4: Generate TypeScript SDK

```
Generate a TypeScript SDK for the repository endpoints
```

You'll get a fully-typed TypeScript client with methods like:
```typescript
const client = new GitHubClient({ baseUrl: 'https://api.github.com' });
const repo = await client.getRepository('microsoft', 'typescript');
```

---

## Example 2: Testing JSONPlaceholder (Practice API)

Perfect for learning and testing!

```
Parse the JSONPlaceholder API:
https://jsonplaceholder.typicode.com/

Then:
1. List all endpoints
2. Test GET /posts/1
3. Generate a Python SDK
4. Create 3 mock post objects
```

Claude will:
1. Parse the API spec
2. Show all available endpoints
3. Execute the GET request and show results
4. Generate a complete Python client
5. Create realistic mock data

---

## Example 3: Stripe API Integration

### Exploring Stripe's API

```
Parse the Stripe OpenAPI spec from:
https://raw.githubusercontent.com/stripe/openapi/master/openapi/spec3.json

Filter to show only payment-related endpoints
```

### Generate SDK for Payments

```
Generate a TypeScript SDK focused on the payment methods
```

### Mock Payment Data

```
Create mock data for a payment intent object based on Stripe's schema
```

---

## Example 4: REST Countries API

```
Test this workflow:

1. Parse: https://restcountries.com/v3.1/all
2. Test the endpoint GET /v3.1/name/canada
3. Generate mock country data
4. Create API documentation in markdown
```

---

## Example 5: Building Your Own API Client

Let's say you have a custom API:

```
I have this API spec:

{
  "openapi": "3.0.0",
  "info": {
    "title": "Todo API",
    "version": "1.0.0"
  },
  "servers": [
    { "url": "https://api.mytodos.com" }
  ],
  "paths": {
    "/todos": {
      "get": {
        "summary": "List all todos",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": { "type": "number" },
                      "title": { "type": "string" },
                      "completed": { "type": "boolean" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "summary": "Create a todo",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "title": { "type": "string" },
                  "completed": { "type": "boolean" }
                }
              }
            }
          }
        },
        "responses": {
          "201": { "description": "Created" }
        }
      }
    },
    "/todos/{id}": {
      "get": {
        "summary": "Get a todo",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "number" }
          }
        ],
        "responses": {
          "200": { "description": "Success" }
        }
      }
    }
  }
}

Can you:
1. Parse this spec
2. Generate a TypeScript SDK
3. Create 5 mock todos
4. Generate markdown documentation
```

Claude will create:
- A fully-typed TypeScript client
- Realistic todo mock data
- Beautiful API documentation

---

## Example 6: Batch Testing for Health Checks

```
Parse my API spec and run batch tests on all GET endpoints to check API health
```

Perfect for:
- Smoke testing after deployment
- Monitoring endpoint availability
- Checking response times
- Validating API contracts

---

## Example 7: API Documentation Generation

```
I need to document this API for my team. Parse the spec and generate:
1. Markdown documentation with examples
2. A summary of all endpoints
3. Mock data for testing
```

---

## Example 8: Multi-Language SDK Generation

```
Generate SDKs for this API in:
1. TypeScript (for our frontend)
2. Python (for our backend)
3. JavaScript (for our mobile app)
```

Get production-ready client libraries in minutes!

---

## Tips & Best Practices

### 1. Start with Public APIs
Practice with well-known public APIs:
- JSONPlaceholder (testing)
- GitHub API
- REST Countries
- OpenWeather
- The Cat API

### 2. Use Mock Data for Development
Generate realistic test data before the backend is ready:
```
Generate 10 mock user objects with names, emails, and avatars
```

### 3. Test Before Integration
Test third-party APIs before writing integration code:
```
Test the Stripe payment intent creation endpoint with these parameters...
```

### 4. Generate Docs for Your Team
Keep documentation up-to-date:
```
Generate API documentation from our latest OpenAPI spec
```

### 5. Validate Contracts
Ensure API responses match expectations:
```
Validate this API response against the schema in our spec
```

---

## Common Workflows

### API Discovery
```
Parse → List Endpoints → Test Key Endpoints → Generate Docs
```

### SDK Creation
```
Parse → Generate SDK → Test Generated Client → Save to Project
```

### API Testing
```
Parse → Batch Test → Validate Responses → Generate Report
```

### Integration Prep
```
Parse → Generate SDK → Create Mock Data → Test Integration
```

---

## Next Steps

1. Try the examples above
2. Experiment with your favorite APIs
3. Generate SDKs for your projects
4. Contribute your own examples!

Happy API building! 🚀
