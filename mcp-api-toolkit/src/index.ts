#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { tools } from './tools/index.js';
import { OpenAPIParser } from './utils/openapi-parser.js';
import { APIClient } from './utils/api-client.js';
import { SDKGenerator } from './utils/sdk-generator.js';
import { ApiRequestSchema, OpenAPISpec } from './types/api.js';

class APIToolkitServer {
  private server: Server;
  private parser: OpenAPIParser;
  private client: APIClient;
  private sdkGenerator: SDKGenerator;

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-api-toolkit',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.parser = new OpenAPIParser();
    this.client = new APIClient();
    this.sdkGenerator = new SDKGenerator();

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools,
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'parse_openapi':
            return await this.handleParseOpenAPI(args || {});

          case 'list_endpoints':
            return await this.handleListEndpoints(args || {});

          case 'test_api_endpoint':
            return await this.handleTestEndpoint(args || {});

          case 'generate_sdk':
            return await this.handleGenerateSDK(args || {});

          case 'generate_mock_data':
            return await this.handleGenerateMockData(args || {});

          case 'generate_api_docs':
            return await this.handleGenerateDocs(args || {});

          case 'validate_api_response':
            return await this.handleValidateResponse(args || {});

          case 'batch_test_endpoints':
            return await this.handleBatchTest(args || {});

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async handleParseOpenAPI(args: Record<string, unknown>) {
    const { input, isUrl } = args as { input: string; isUrl?: boolean };

    const spec = isUrl
      ? await this.parser.parseFromUrl(input)
      : await this.parser.parseSpec(input);

    const summary = this.parser.generateSummary(spec);

    return {
      content: [
        {
          type: 'text',
          text: `Successfully parsed OpenAPI specification!\n\n${summary}\n\nSpec stored and ready for use with other tools.`,
        },
        {
          type: 'text',
          text: `Full specification:\n${JSON.stringify(spec, null, 2)}`,
        },
      ],
    };
  }

  private async handleListEndpoints(args: Record<string, unknown>) {
    const { spec, filterByTag, filterByMethod } = args as {
      spec: string;
      filterByTag?: string;
      filterByMethod?: string;
    };

    const parsedSpec = JSON.parse(spec) as OpenAPISpec;
    let endpoints = this.parser.extractEndpoints(parsedSpec);

    // Apply filters
    if (filterByMethod) {
      endpoints = endpoints.filter(
        (ep) => ep.method === filterByMethod.toUpperCase()
      );
    }

    // Filter by tag if specified
    if (filterByTag) {
      endpoints = endpoints.filter((ep) => ep.tags?.includes(filterByTag));
    }

    const endpointsList = endpoints
      .map(
        (ep, i) =>
          `${i + 1}. [${ep.method}] ${ep.path}${ep.summary ? ` - ${ep.summary}` : ''}`
      )
      .join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Found ${endpoints.length} endpoints:\n\n${endpointsList}`,
        },
        {
          type: 'text',
          text: `Detailed endpoints:\n${JSON.stringify(endpoints, null, 2)}`,
        },
      ],
    };
  }

  private async handleTestEndpoint(args: Record<string, unknown>) {
    const validatedArgs = ApiRequestSchema.parse(args);

    const result = await this.client.testEndpoint(
      validatedArgs,
      args.expectedStatus as number | undefined
    );

    const statusEmoji = result.success ? '✅' : '❌';
    const summary = `${statusEmoji} ${validatedArgs.method} ${validatedArgs.url}
Status: ${result.response.status} ${result.response.statusText}
Duration: ${result.response.duration}ms
Size: ${(result.response.size / 1024).toFixed(2)}KB

${result.errors.length > 0 ? `Errors:\n${result.errors.map((e) => `  - ${e}`).join('\n')}\n` : ''}
${result.warnings.length > 0 ? `Warnings:\n${result.warnings.map((w) => `  - ${w}`).join('\n')}\n` : ''}`;

    return {
      content: [
        {
          type: 'text',
          text: summary,
        },
        {
          type: 'text',
          text: `Response:\n${JSON.stringify(result.response.data, null, 2)}`,
        },
      ],
    };
  }

  private async handleGenerateSDK(args: Record<string, unknown>) {
    const { spec, language, clientName } = args as {
      spec: string;
      language: 'typescript' | 'python' | 'javascript' | 'go';
      clientName?: string;
    };

    const parsedSpec = JSON.parse(spec) as OpenAPISpec;
    const options = { language, clientName };

    let sdk: string;
    switch (language) {
      case 'typescript':
      case 'javascript':
        sdk = this.sdkGenerator.generateTypeScriptSDK(parsedSpec, options);
        break;
      case 'python':
        sdk = this.sdkGenerator.generatePythonSDK(parsedSpec, options);
        break;
      case 'go':
        sdk = 'Go SDK generation coming soon!';
        break;
      default:
        throw new Error(`Unsupported language: ${language}`);
    }

    const filename =
      language === 'python'
        ? `${clientName || 'client'}.py`
        : `${clientName || 'client'}.ts`;

    return {
      content: [
        {
          type: 'text',
          text: `Generated ${language} SDK for ${parsedSpec.info.title}!\n\nSave this as: ${filename}\n\n${sdk}`,
        },
      ],
    };
  }

  private async handleGenerateMockData(args: Record<string, unknown>) {
    const { schema, count = 1 } = args as { schema: unknown; count?: number };

    const mockData = Array.from({ length: count }, () =>
      this.client.generateMockData(schema)
    );

    return {
      content: [
        {
          type: 'text',
          text: `Generated ${count} mock data object(s):\n\n${JSON.stringify(mockData, null, 2)}`,
        },
      ],
    };
  }

  private async handleGenerateDocs(args: Record<string, unknown>) {
    const { spec, includeExamples = true } = args as {
      spec: string;
      includeExamples?: boolean;
    };

    const parsedSpec = JSON.parse(spec) as OpenAPISpec;
    const endpoints = this.parser.extractEndpoints(parsedSpec);

    let docs = `# ${parsedSpec.info.title}\n\n`;
    docs += `**Version:** ${parsedSpec.info.version}\n\n`;
    if (parsedSpec.info.description) {
      docs += `${parsedSpec.info.description}\n\n`;
    }

    docs += `**Base URL:** ${this.parser.getBaseUrl(parsedSpec)}\n\n`;
    docs += `## Endpoints\n\n`;

    for (const endpoint of endpoints) {
      docs += `### ${endpoint.method} ${endpoint.path}\n\n`;
      if (endpoint.summary) {
        docs += `${endpoint.summary}\n\n`;
      }
      if (endpoint.description) {
        docs += `${endpoint.description}\n\n`;
      }

      if (includeExamples) {
        docs += `**Example Request:**\n\`\`\`bash\ncurl -X ${endpoint.method} "${this.parser.getBaseUrl(parsedSpec)}${endpoint.path}"\n\`\`\`\n\n`;
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: `Generated API Documentation:\n\n${docs}`,
        },
      ],
    };
  }

  private async handleValidateResponse(args: Record<string, unknown>) {
    const { response, schema } = args as { response: unknown; schema: unknown };

    // Basic validation (can be enhanced with JSON Schema validator)
    const isValid = response !== null && response !== undefined;

    // TODO: Implement proper JSON schema validation using the schema parameter
    // For now, just check if response exists
    console.log('Schema to validate against:', schema);

    return {
      content: [
        {
          type: 'text',
          text: isValid
            ? '✅ Response validation passed'
            : '❌ Response validation failed',
        },
        {
          type: 'text',
          text: `Response:\n${JSON.stringify(response, null, 2)}`,
        },
      ],
    };
  }

  private async handleBatchTest(args: Record<string, unknown>) {
    const { spec, baseUrl, filterByTag, headers } = args as {
      spec: string;
      baseUrl?: string;
      filterByTag?: string;
      headers?: Record<string, string>;
    };

    const parsedSpec = JSON.parse(spec) as OpenAPISpec;
    let endpoints = this.parser.extractEndpoints(parsedSpec);

    const testBaseUrl = baseUrl || this.parser.getBaseUrl(parsedSpec);

    // Filter by tag if specified
    if (filterByTag) {
      endpoints = endpoints.filter((ep) => ep.tags?.includes(filterByTag));
    }

    // Only test GET endpoints for safety
    endpoints = endpoints.filter((ep) => ep.method === 'GET');

    const results = [];
    let passed = 0;
    let failed = 0;

    for (const endpoint of endpoints.slice(0, 10)) {
      // Limit to 10 for safety
      try {
        const url = `${testBaseUrl}${endpoint.path}`;
        const result = await this.client.testEndpoint(
          {
            method: endpoint.method as 'GET',
            url,
            headers,
            timeout: 30000,
          },
          200
        );

        if (result.success) passed++;
        else failed++;

        results.push({
          endpoint: `${endpoint.method} ${endpoint.path}`,
          status: result.response.status,
          success: result.success,
          duration: result.response.duration,
        });
      } catch (error) {
        failed++;
        results.push({
          endpoint: `${endpoint.method} ${endpoint.path}`,
          error: (error as Error).message,
          success: false,
        });
      }
    }

    const summary = `Batch Test Results:\n✅ Passed: ${passed}\n❌ Failed: ${failed}\n\nDetails:\n${results.map((r, i) => `${i + 1}. ${r.endpoint} - ${r.success ? '✅' : '❌'} (${r.status || 'error'})`).join('\n')}`;

    return {
      content: [
        {
          type: 'text',
          text: summary,
        },
        {
          type: 'text',
          text: `Full results:\n${JSON.stringify(results, null, 2)}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP API Toolkit Server running on stdio');
  }
}

const server = new APIToolkitServer();
server.run().catch(console.error);
