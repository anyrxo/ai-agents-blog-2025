import { OpenAPISpec, SDKGenerationOptions } from '../types/api.js';

export class SDKGenerator {
  /**
   * Generate TypeScript SDK from OpenAPI spec
   */
  generateTypeScriptSDK(spec: OpenAPISpec, options: SDKGenerationOptions): string {
    const clientName = options.clientName || spec.info.title.replace(/\s+/g, '') + 'Client';

    let sdk = `// Auto-generated TypeScript SDK for ${spec.info.title}
// Version: ${spec.info.version}
// Generated: ${new Date().toISOString()}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
}

export interface ${clientName}Config {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export class ${clientName} {
  private baseUrl: string;
  private headers: Record<string, string>;
  private timeout: number;

  constructor(config: ${clientName}Config) {
    this.baseUrl = config.baseUrl;
    this.headers = config.headers || {};
    this.timeout = config.timeout || 30000;
  }

  private async request<T>(
    method: string,
    path: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const url = \`\${this.baseUrl}\${path}\`;
    const headers = { ...this.headers, ...config?.headers };

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(config?.timeout || this.timeout),
    });

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }

    return response.json() as Promise<T>;
  }
`;

    // Generate methods for each endpoint
    const endpoints = this.extractEndpoints(spec);
    const methodsByTag = this.groupByTag(endpoints);

    for (const [tag, methods] of Object.entries(methodsByTag)) {
      sdk += `\n  // ${tag || 'Default'} endpoints\n`;

      for (const endpoint of methods) {
        const methodName = this.generateMethodName(endpoint.operationId, endpoint.method, endpoint.path);
        const params = this.extractParameters(endpoint);
        const hasBody = ['POST', 'PUT', 'PATCH'].includes(endpoint.method);

        sdk += `\n  /**\n   * ${endpoint.summary || endpoint.description || `${endpoint.method} ${endpoint.path}`}\n   */\n`;
        sdk += `  async ${methodName}(`;

        // Add parameters
        const paramList: string[] = [];
        if (params.path.length > 0) {
          paramList.push(...params.path.map(p => `${p.name}: string`));
        }
        if (params.query.length > 0) {
          paramList.push(`query?: { ${params.query.map(p => `${p.name}?: string`).join('; ')} }`);
        }
        if (hasBody) {
          paramList.push('data?: unknown');
        }
        paramList.push('config?: RequestConfig');

        sdk += paramList.join(', ');
        sdk += `): Promise<unknown> {\n`;

        // Build path with parameters
        let apiPath = endpoint.path;
        for (const param of params.path) {
          apiPath = apiPath.replace(`{${param.name}}`, `\${${param.name}}`);
        }

        // Add query parameters
        if (params.query.length > 0) {
          sdk += `    const queryParams = new URLSearchParams();\n`;
          sdk += `    if (query) {\n`;
          for (const param of params.query) {
            sdk += `      if (query.${param.name}) queryParams.append('${param.name}', query.${param.name});\n`;
          }
          sdk += `    }\n`;
          sdk += `    const queryString = queryParams.toString();\n`;
          sdk += `    const path = \`${apiPath}\${queryString ? '?' + queryString : ''}\`;\n`;
        } else {
          sdk += `    const path = \`${apiPath}\`;\n`;
        }

        sdk += `    return this.request('${endpoint.method}', path${hasBody ? ', data' : ', undefined'}, config);\n`;
        sdk += `  }\n`;
      }
    }

    sdk += `}\n`;

    return sdk;
  }

  /**
   * Generate Python SDK from OpenAPI spec
   */
  generatePythonSDK(spec: OpenAPISpec, options: SDKGenerationOptions): string {
    const className = options.clientName || spec.info.title.replace(/\s+/g, '') + 'Client';

    let sdk = `"""
Auto-generated Python SDK for ${spec.info.title}
Version: ${spec.info.version}
Generated: ${new Date().toISOString()}
"""

import requests
from typing import Dict, Any, Optional
from urllib.parse import urljoin

class ${className}:
    def __init__(self, base_url: str, headers: Optional[Dict[str, str]] = None, timeout: int = 30):
        self.base_url = base_url
        self.headers = headers or {}
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update(self.headers)

    def _request(self, method: str, path: str, **kwargs) -> Any:
        url = urljoin(self.base_url, path)
        response = self.session.request(method, url, timeout=self.timeout, **kwargs)
        response.raise_for_status()
        return response.json()
`;

    const endpoints = this.extractEndpoints(spec);

    for (const endpoint of endpoints) {
      const methodName = this.generatePythonMethodName(endpoint.operationId, endpoint.method, endpoint.path);
      const params = this.extractParameters(endpoint);
      const hasBody = ['POST', 'PUT', 'PATCH'].includes(endpoint.method);

      sdk += `\n    def ${methodName}(self`;

      // Add parameters
      if (params.path.length > 0) {
        sdk += params.path.map(p => `, ${p.name}: str`).join('');
      }
      if (params.query.length > 0) {
        sdk += ', params: Optional[Dict[str, Any]] = None';
      }
      if (hasBody) {
        sdk += ', data: Optional[Dict[str, Any]] = None';
      }
      sdk += ') -> Any:\n';

      sdk += `        """\n        ${endpoint.summary || endpoint.description || `${endpoint.method} ${endpoint.path}`}\n        """\n`;

      let apiPath = endpoint.path;
      for (const param of params.path) {
        apiPath = apiPath.replace(`{${param.name}}`, `{${param.name}}`);
      }

      sdk += `        path = f"${apiPath}"\n`;
      sdk += `        return self._request('${endpoint.method}', path`;
      if (params.query.length > 0) {
        sdk += ', params=params';
      }
      if (hasBody) {
        sdk += ', json=data';
      }
      sdk += ')\n';
    }

    return sdk;
  }

  private extractEndpoints(spec: OpenAPISpec) {
    const endpoints: Array<{
      path: string;
      method: string;
      summary?: string;
      description?: string;
      operationId?: string;
      tags?: string[];
      parameters?: unknown[];
    }> = [];

    for (const [path, pathItem] of Object.entries(spec.paths)) {
      const methods = ['get', 'post', 'put', 'patch', 'delete'] as const;

      for (const method of methods) {
        const operation = pathItem[method];
        if (operation) {
          endpoints.push({
            path,
            method: method.toUpperCase(),
            summary: operation.summary,
            description: operation.description,
            operationId: operation.operationId,
            tags: operation.tags,
            parameters: operation.parameters,
          });
        }
      }
    }

    return endpoints;
  }

  private groupByTag<T extends { tags?: string[] }>(endpoints: Array<T>): Record<string, Array<T>> {
    const grouped: Record<string, Array<T>> = {};

    for (const endpoint of endpoints) {
      const tag = endpoint.tags?.[0] || 'Default';
      if (!grouped[tag]) {
        grouped[tag] = [];
      }
      grouped[tag].push(endpoint);
    }

    return grouped;
  }

  private generateMethodName(operationId: string | undefined, method: string, path: string): string {
    if (operationId) {
      return this.toCamelCase(operationId);
    }

    // Generate from method and path
    const pathParts = path.split('/').filter(p => p && !p.startsWith('{'));
    const name = method.toLowerCase() + pathParts.map(p => this.capitalize(p)).join('');
    return this.toCamelCase(name);
  }

  private generatePythonMethodName(operationId: string | undefined, method: string, path: string): string {
    if (operationId) {
      return this.toSnakeCase(operationId);
    }

    const pathParts = path.split('/').filter(p => p && !p.startsWith('{'));
    const name = method.toLowerCase() + '_' + pathParts.join('_');
    return this.toSnakeCase(name);
  }

  private extractParameters(endpoint: { parameters?: unknown[] }): {
    path: Array<{ name: string }>;
    query: Array<{ name: string }>;
    header: Array<{ name: string }>;
  } {
    const result = {
      path: [] as Array<{ name: string }>,
      query: [] as Array<{ name: string }>,
      header: [] as Array<{ name: string }>,
    };

    if (!endpoint.parameters) return result;

    for (const param of endpoint.parameters) {
      const p = param as { name: string; in: string };
      if (p.in === 'path') result.path.push({ name: p.name });
      else if (p.in === 'query') result.query.push({ name: p.name });
      else if (p.in === 'header') result.header.push({ name: p.name });
    }

    return result;
  }

  private toCamelCase(str: string): string {
    return str.replace(/[-_](.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, (_, c) => c.toLowerCase());
  }

  private toSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
