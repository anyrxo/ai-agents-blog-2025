import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiRequest, ApiResponse } from '../types/api.js';

export class APIClient {
  /**
   * Execute an API request
   */
  async executeRequest(request: ApiRequest): Promise<ApiResponse> {
    const startTime = Date.now();

    const config: AxiosRequestConfig = {
      method: request.method,
      url: request.url,
      headers: request.headers,
      params: request.params,
      data: request.body,
      timeout: request.timeout,
      validateStatus: () => true, // Don't throw on any status code
    };

    try {
      const response: AxiosResponse = await axios(config);
      const duration = Date.now() - startTime;

      // Calculate response size
      const size = JSON.stringify(response.data).length;

      return {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
        data: response.data,
        duration,
        size,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      if (axios.isAxiosError(error)) {
        return {
          status: error.response?.status || 0,
          statusText: error.message,
          headers: (error.response?.headers as Record<string, string>) || {},
          data: { error: error.message },
          duration,
          size: 0,
        };
      }

      throw error;
    }
  }

  /**
   * Test an endpoint with validation
   */
  async testEndpoint(
    request: ApiRequest,
    expectedStatus?: number
  ): Promise<{
    success: boolean;
    response: ApiResponse;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const response = await this.executeRequest(request);

    // Validate status code
    if (expectedStatus && response.status !== expectedStatus) {
      errors.push(
        `Expected status ${expectedStatus}, got ${response.status}`
      );
    }

    // Check for common issues
    if (response.status >= 500) {
      errors.push('Server error (5xx)');
    } else if (response.status >= 400 && response.status < 500) {
      warnings.push('Client error (4xx)');
    }

    // Check response time
    if (response.duration > 5000) {
      warnings.push(`Slow response: ${response.duration}ms`);
    }

    // Check response size
    if (response.size > 1000000) {
      warnings.push(`Large response: ${(response.size / 1024 / 1024).toFixed(2)}MB`);
    }

    return {
      success: errors.length === 0,
      response,
      errors,
      warnings,
    };
  }

  /**
   * Generate mock data based on schema
   */
  generateMockData(schema: unknown): unknown {
    if (!schema || typeof schema !== 'object') {
      return null;
    }

    const schemaObj = schema as Record<string, unknown>;
    const type = schemaObj.type as string;

    switch (type) {
      case 'string':
        return schemaObj.example || 'mock-string';
      case 'number':
      case 'integer':
        return schemaObj.example || 42;
      case 'boolean':
        return schemaObj.example !== undefined ? schemaObj.example : true;
      case 'array':
        const items = schemaObj.items;
        return [this.generateMockData(items)];
      case 'object':
        const properties = schemaObj.properties as Record<string, unknown>;
        if (!properties) return {};
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(properties)) {
          result[key] = this.generateMockData(value);
        }
        return result;
      default:
        return schemaObj.example || null;
    }
  }
}
