import { APIClient } from '../src/utils/api-client.js';

describe('APIClient', () => {
  let client: APIClient;

  beforeEach(() => {
    client = new APIClient();
  });

  describe('generateMockData', () => {
    it('should generate mock string data', () => {
      const schema = { type: 'string' };
      const result = client.generateMockData(schema);
      expect(typeof result).toBe('string');
    });

    it('should generate mock number data', () => {
      const schema = { type: 'number' };
      const result = client.generateMockData(schema);
      expect(typeof result).toBe('number');
    });

    it('should generate mock boolean data', () => {
      const schema = { type: 'boolean' };
      const result = client.generateMockData(schema);
      expect(typeof result).toBe('boolean');
    });

    it('should generate mock object data', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
          active: { type: 'boolean' },
        },
      };

      const result = client.generateMockData(schema);
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('age');
      expect(result).toHaveProperty('active');
    });

    it('should generate mock array data', () => {
      const schema = {
        type: 'array',
        items: { type: 'string' },
      };

      const result = client.generateMockData(schema);
      expect(Array.isArray(result)).toBe(true);
      expect((result as unknown[]).length).toBeGreaterThan(0);
    });

    it('should use example values if provided', () => {
      const schema = {
        type: 'string',
        example: 'test@example.com',
      };

      const result = client.generateMockData(schema);
      expect(result).toBe('test@example.com');
    });

    it('should handle nested objects', () => {
      const schema = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              email: { type: 'string' },
            },
          },
        },
      };

      const result = client.generateMockData(schema) as Record<string, unknown>;
      expect(result).toHaveProperty('user');
      expect(result.user).toHaveProperty('name');
      expect(result.user).toHaveProperty('email');
    });
  });
});
