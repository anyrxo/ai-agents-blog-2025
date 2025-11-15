import { z } from 'zod';

// API Request Schema
export const ApiRequestSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']),
  url: z.string().url(),
  headers: z.record(z.string()).optional(),
  body: z.unknown().optional(),
  params: z.record(z.string()).optional(),
  timeout: z.number().optional().default(30000),
});

export type ApiRequest = z.infer<typeof ApiRequestSchema>;

// API Response
export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  duration: number;
  size: number;
}

// OpenAPI Spec
export interface OpenAPISpec {
  openapi?: string;
  swagger?: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: Record<string, PathItem>;
  components?: {
    schemas?: Record<string, unknown>;
    securitySchemes?: Record<string, unknown>;
  };
}

export interface PathItem {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  patch?: Operation;
  delete?: Operation;
  head?: Operation;
  options?: Operation;
}

export interface Operation {
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses?: Record<string, Response>;
  security?: Array<Record<string, string[]>>;
  tags?: string[];
}

export interface Parameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  schema?: unknown;
}

export interface RequestBody {
  description?: string;
  required?: boolean;
  content?: Record<string, MediaType>;
}

export interface MediaType {
  schema?: unknown;
  example?: unknown;
  examples?: Record<string, Example>;
}

export interface Example {
  value?: unknown;
  summary?: string;
  description?: string;
}

export interface Response {
  description: string;
  content?: Record<string, MediaType>;
  headers?: Record<string, unknown>;
}

// SDK Generation
export interface SDKGenerationOptions {
  language: 'typescript' | 'python' | 'go' | 'javascript';
  outputPath?: string;
  clientName?: string;
  includeTests?: boolean;
}

// Test Results
export interface TestResult {
  passed: boolean;
  endpoint: string;
  method: string;
  status: number;
  duration: number;
  errors?: string[];
  warnings?: string[];
}

export interface TestSuite {
  name: string;
  results: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    duration: number;
  };
}
