import { OpenAPIParser } from '../src/utils/openapi-parser.js';

describe('OpenAPIParser', () => {
  let parser: OpenAPIParser;

  beforeEach(() => {
    parser = new OpenAPIParser();
  });

  describe('parseSpec', () => {
    it('should parse a valid JSON OpenAPI spec', async () => {
      const spec = JSON.stringify({
        openapi: '3.0.0',
        info: {
          title: 'Test API',
          version: '1.0.0',
        },
        paths: {
          '/users': {
            get: {
              summary: 'Get users',
              responses: {
                '200': {
                  description: 'Success',
                },
              },
            },
          },
        },
      });

      const result = await parser.parseSpec(spec);
      expect(result.info.title).toBe('Test API');
      expect(result.info.version).toBe('1.0.0');
    });

    it('should parse a valid YAML OpenAPI spec', async () => {
      const spec = `
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get users
      responses:
        '200':
          description: Success
`;

      const result = await parser.parseSpec(spec);
      expect(result.info.title).toBe('Test API');
      expect(result.info.version).toBe('1.0.0');
    });

    it('should throw error for invalid spec', async () => {
      const spec = '{ invalid json }';

      await expect(parser.parseSpec(spec)).rejects.toThrow();
    });
  });

  describe('extractEndpoints', () => {
    it('should extract all endpoints from spec', async () => {
      const spec = {
        openapi: '3.0.0',
        info: {
          title: 'Test API',
          version: '1.0.0',
        },
        paths: {
          '/users': {
            get: {
              summary: 'Get users',
            },
            post: {
              summary: 'Create user',
            },
          },
          '/posts': {
            get: {
              summary: 'Get posts',
            },
          },
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const endpoints = parser.extractEndpoints(spec as any);
      expect(endpoints).toHaveLength(3);
      expect(endpoints[0].method).toBe('GET');
      expect(endpoints[0].path).toBe('/users');
      expect(endpoints[1].method).toBe('POST');
      expect(endpoints[1].path).toBe('/users');
      expect(endpoints[2].method).toBe('GET');
      expect(endpoints[2].path).toBe('/posts');
    });

    it('should include operation details', async () => {
      const spec = {
        openapi: '3.0.0',
        info: {
          title: 'Test API',
          version: '1.0.0',
        },
        paths: {
          '/users': {
            get: {
              summary: 'Get users',
              description: 'Retrieve all users',
              operationId: 'getUsers',
              tags: ['users'],
            },
          },
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const endpoints = parser.extractEndpoints(spec as any);
      expect(endpoints[0].summary).toBe('Get users');
      expect(endpoints[0].description).toBe('Retrieve all users');
      expect(endpoints[0].operationId).toBe('getUsers');
      expect(endpoints[0].tags).toEqual(['users']);
    });
  });

  describe('getBaseUrl', () => {
    it('should return the first server URL', () => {
      const spec = {
        openapi: '3.0.0',
        info: {
          title: 'Test API',
          version: '1.0.0',
        },
        servers: [
          { url: 'https://api.example.com' },
          { url: 'https://staging.api.example.com' },
        ],
        paths: {},
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const baseUrl = parser.getBaseUrl(spec as any);
      expect(baseUrl).toBe('https://api.example.com');
    });

    it('should return empty string if no servers', () => {
      const spec = {
        openapi: '3.0.0',
        info: {
          title: 'Test API',
          version: '1.0.0',
        },
        paths: {},
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const baseUrl = parser.getBaseUrl(spec as any);
      expect(baseUrl).toBe('');
    });
  });

  describe('generateSummary', () => {
    it('should generate a summary with endpoint counts', () => {
      const spec = {
        openapi: '3.0.0',
        info: {
          title: 'Test API',
          version: '1.0.0',
          description: 'A test API',
        },
        servers: [{ url: 'https://api.example.com' }],
        paths: {
          '/users': {
            get: {},
            post: {},
          },
          '/posts': {
            get: {},
            delete: {},
          },
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const summary = parser.generateSummary(spec as any);
      expect(summary).toContain('Test API');
      expect(summary).toContain('1.0.0');
      expect(summary).toContain('Endpoints: 4');
      expect(summary).toContain('GET: 2');
      expect(summary).toContain('POST: 1');
      expect(summary).toContain('DELETE: 1');
      expect(summary).toContain('https://api.example.com');
    });
  });
});
