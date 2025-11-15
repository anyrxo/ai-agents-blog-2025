import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const tools: Tool[] = [
  {
    name: 'parse_openapi',
    description:
      'Parse and validate an OpenAPI/Swagger specification from JSON/YAML string or URL. Returns detailed information about the API including endpoints, methods, and schemas.',
    inputSchema: {
      type: 'object',
      properties: {
        input: {
          type: 'string',
          description: 'OpenAPI spec as JSON/YAML string, or a URL to fetch the spec from',
        },
        isUrl: {
          type: 'boolean',
          description: 'Whether the input is a URL (default: false)',
          default: false,
        },
      },
      required: ['input'],
    },
  },
  {
    name: 'list_endpoints',
    description:
      'Extract and list all API endpoints from a previously parsed OpenAPI specification. Returns all paths, methods, summaries, and operation IDs.',
    inputSchema: {
      type: 'object',
      properties: {
        spec: {
          type: 'string',
          description: 'OpenAPI specification as JSON string',
        },
        filterByTag: {
          type: 'string',
          description: 'Optional: Filter endpoints by tag',
        },
        filterByMethod: {
          type: 'string',
          description: 'Optional: Filter endpoints by HTTP method (GET, POST, etc.)',
        },
      },
      required: ['spec'],
    },
  },
  {
    name: 'test_api_endpoint',
    description:
      'Execute an API request and test an endpoint with optional validation. Returns response status, data, timing, and validation results.',
    inputSchema: {
      type: 'object',
      properties: {
        method: {
          type: 'string',
          enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
          description: 'HTTP method',
        },
        url: {
          type: 'string',
          description: 'Full URL to test',
        },
        headers: {
          type: 'object',
          description: 'Optional HTTP headers',
          additionalProperties: { type: 'string' },
        },
        body: {
          type: 'object',
          description: 'Optional request body (for POST, PUT, PATCH)',
        },
        params: {
          type: 'object',
          description: 'Optional query parameters',
          additionalProperties: { type: 'string' },
        },
        expectedStatus: {
          type: 'number',
          description: 'Expected HTTP status code for validation',
        },
        timeout: {
          type: 'number',
          description: 'Request timeout in milliseconds (default: 30000)',
          default: 30000,
        },
      },
      required: ['method', 'url'],
    },
  },
  {
    name: 'generate_sdk',
    description:
      'Generate a client SDK in TypeScript, Python, JavaScript, or Go from an OpenAPI specification. Creates ready-to-use client libraries with type safety.',
    inputSchema: {
      type: 'object',
      properties: {
        spec: {
          type: 'string',
          description: 'OpenAPI specification as JSON string',
        },
        language: {
          type: 'string',
          enum: ['typescript', 'python', 'javascript', 'go'],
          description: 'Target language for SDK generation',
        },
        clientName: {
          type: 'string',
          description: 'Optional: Custom client class name',
        },
      },
      required: ['spec', 'language'],
    },
  },
  {
    name: 'generate_mock_data',
    description:
      'Generate mock data based on a JSON schema or OpenAPI schema definition. Useful for testing and development.',
    inputSchema: {
      type: 'object',
      properties: {
        schema: {
          type: 'object',
          description: 'JSON Schema or OpenAPI schema object',
        },
        count: {
          type: 'number',
          description: 'Number of mock objects to generate (default: 1)',
          default: 1,
        },
      },
      required: ['schema'],
    },
  },
  {
    name: 'generate_api_docs',
    description:
      'Generate markdown documentation from an OpenAPI specification. Creates human-readable API documentation with examples.',
    inputSchema: {
      type: 'object',
      properties: {
        spec: {
          type: 'string',
          description: 'OpenAPI specification as JSON string',
        },
        includeExamples: {
          type: 'boolean',
          description: 'Include request/response examples (default: true)',
          default: true,
        },
      },
      required: ['spec'],
    },
  },
  {
    name: 'validate_api_response',
    description:
      'Validate an API response against an OpenAPI schema definition. Checks if the response matches the expected schema.',
    inputSchema: {
      type: 'object',
      properties: {
        response: {
          type: 'object',
          description: 'API response data to validate',
        },
        schema: {
          type: 'object',
          description: 'Expected OpenAPI schema',
        },
      },
      required: ['response', 'schema'],
    },
  },
  {
    name: 'batch_test_endpoints',
    description:
      'Test multiple API endpoints from an OpenAPI spec in batch. Useful for smoke testing or API health checks.',
    inputSchema: {
      type: 'object',
      properties: {
        spec: {
          type: 'string',
          description: 'OpenAPI specification as JSON string',
        },
        baseUrl: {
          type: 'string',
          description: 'Base URL to use for testing (overrides spec servers)',
        },
        filterByTag: {
          type: 'string',
          description: 'Optional: Only test endpoints with this tag',
        },
        headers: {
          type: 'object',
          description: 'Optional: Common headers for all requests',
          additionalProperties: { type: 'string' },
        },
      },
      required: ['spec'],
    },
  },
];
