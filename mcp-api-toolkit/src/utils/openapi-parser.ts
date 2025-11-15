import SwaggerParser from 'swagger-parser';
import { OpenAPISpec } from '../types/api.js';
import * as yaml from 'yaml';

export class OpenAPIParser {
  /**
   * Parse and validate OpenAPI/Swagger specification
   */
  async parseSpec(input: string): Promise<OpenAPISpec> {
    try {
      // Try parsing as JSON first
      let spec: unknown;
      try {
        spec = JSON.parse(input);
      } catch {
        // Try YAML parsing
        spec = yaml.parse(input);
      }

      // Validate and dereference the spec
      const api = await SwaggerParser.validate(spec as OpenAPISpec);
      return api as OpenAPISpec;
    } catch (error) {
      throw new Error(`Failed to parse OpenAPI spec: ${(error as Error).message}`);
    }
  }

  /**
   * Parse spec from URL
   */
  async parseFromUrl(url: string): Promise<OpenAPISpec> {
    try {
      const api = await SwaggerParser.validate(url);
      return api as OpenAPISpec;
    } catch (error) {
      throw new Error(`Failed to parse OpenAPI spec from URL: ${(error as Error).message}`);
    }
  }

  /**
   * Extract all endpoints from spec
   */
  extractEndpoints(spec: OpenAPISpec): Array<{
    path: string;
    method: string;
    summary?: string;
    description?: string;
    operationId?: string;
  }> {
    const endpoints: Array<{
      path: string;
      method: string;
      summary?: string;
      description?: string;
      operationId?: string;
    }> = [];

    for (const [path, pathItem] of Object.entries(spec.paths)) {
      const methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'] as const;

      for (const method of methods) {
        const operation = pathItem[method];
        if (operation) {
          endpoints.push({
            path,
            method: method.toUpperCase(),
            summary: operation.summary,
            description: operation.description,
            operationId: operation.operationId,
          });
        }
      }
    }

    return endpoints;
  }

  /**
   * Get base URL from spec
   */
  getBaseUrl(spec: OpenAPISpec): string {
    if (spec.servers && spec.servers.length > 0) {
      return spec.servers[0].url;
    }
    return '';
  }

  /**
   * Generate spec summary
   */
  generateSummary(spec: OpenAPISpec): string {
    const endpoints = this.extractEndpoints(spec);
    const methodCounts = endpoints.reduce(
      (acc, ep) => {
        acc[ep.method] = (acc[ep.method] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return `
API: ${spec.info.title} (v${spec.info.version})
${spec.info.description || ''}

Endpoints: ${endpoints.length}
${Object.entries(methodCounts)
  .map(([method, count]) => `  ${method}: ${count}`)
  .join('\n')}

Base URL: ${this.getBaseUrl(spec)}
    `.trim();
  }
}
