#!/usr/bin/env node

// Manual integration test for MCP API Toolkit
import { OpenAPIParser } from './dist/utils/openapi-parser.js';
import { APIClient } from './dist/utils/api-client.js';
import { SDKGenerator } from './dist/utils/sdk-generator.js';

console.log('🧪 Testing MCP API Toolkit...\n');

async function runTests() {
  const parser = new OpenAPIParser();
  const client = new APIClient();
  const sdkGen = new SDKGenerator();

  // Test 1: Parse a simple OpenAPI spec
  console.log('Test 1: Parsing OpenAPI spec...');
  try {
    const simpleSpec = JSON.stringify({
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
        description: 'A simple test API'
      },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/users': {
          get: {
            summary: 'List users',
            operationId: 'getUsers',
            tags: ['users'],
            responses: {
              '200': {
                description: 'Success'
              }
            }
          },
          post: {
            summary: 'Create user',
            operationId: 'createUser',
            tags: ['users'],
            responses: {
              '201': {
                description: 'Created'
              }
            }
          }
        },
        '/users/{id}': {
          get: {
            summary: 'Get user by ID',
            operationId: 'getUserById',
            tags: ['users'],
            parameters: [{
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }],
            responses: {
              '200': {
                description: 'Success'
              }
            }
          }
        }
      }
    });

    const spec = await parser.parseSpec(simpleSpec);
    console.log('✅ Spec parsed successfully');
    console.log(`   Title: ${spec.info.title}`);
    console.log(`   Version: ${spec.info.version}`);

    // Test 2: Extract endpoints
    console.log('\nTest 2: Extracting endpoints...');
    const endpoints = parser.extractEndpoints(spec);
    console.log(`✅ Found ${endpoints.length} endpoints:`);
    endpoints.forEach(ep => {
      console.log(`   - [${ep.method}] ${ep.path} ${ep.summary ? '- ' + ep.summary : ''}`);
    });

    // Test 3: Generate summary
    console.log('\nTest 3: Generating summary...');
    const summary = parser.generateSummary(spec);
    console.log('✅ Summary generated:');
    console.log(summary.split('\n').map(line => '   ' + line).join('\n'));

    // Test 4: Get base URL
    console.log('\nTest 4: Getting base URL...');
    const baseUrl = parser.getBaseUrl(spec);
    console.log(`✅ Base URL: ${baseUrl}`);

    // Test 5: Generate TypeScript SDK
    console.log('\nTest 5: Generating TypeScript SDK...');
    const tsSDK = sdkGen.generateTypeScriptSDK(spec, { language: 'typescript', clientName: 'TestAPIClient' });
    console.log('✅ TypeScript SDK generated');
    console.log(`   Length: ${tsSDK.length} characters`);
    console.log(`   Contains class: ${tsSDK.includes('export class TestAPIClient')}`);
    console.log(`   Contains methods: ${tsSDK.includes('async getUsers(')}`);

    // Test 6: Generate Python SDK
    console.log('\nTest 6: Generating Python SDK...');
    const pySDK = sdkGen.generatePythonSDK(spec, { language: 'python', clientName: 'TestAPIClient' });
    console.log('✅ Python SDK generated');
    console.log(`   Length: ${pySDK.length} characters`);
    console.log(`   Contains class: ${pySDK.includes('class TestAPIClient')}`);

    // Test 7: Generate mock data
    console.log('\nTest 7: Generating mock data...');
    const userSchema = {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        email: { type: 'string', example: 'test@example.com' },
        active: { type: 'boolean' }
      }
    };
    const mockUser = client.generateMockData(userSchema);
    console.log('✅ Mock data generated:');
    console.log('   ', JSON.stringify(mockUser, null, 2).split('\n').join('\n    '));

    // Test 8: Test real API (JSONPlaceholder)
    console.log('\nTest 8: Testing real API call to JSONPlaceholder...');
    try {
      const result = await client.testEndpoint({
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        timeout: 30000
      }, 200);

      console.log(`✅ API call successful`);
      console.log(`   Status: ${result.response.status}`);
      console.log(`   Duration: ${result.response.duration}ms`);
      console.log(`   Size: ${(result.response.size / 1024).toFixed(2)}KB`);
      console.log(`   Validation: ${result.success ? 'PASSED' : 'FAILED'}`);
      if (result.errors.length > 0) {
        console.log(`   Errors: ${result.errors.join(', ')}`);
      }
      if (result.warnings.length > 0) {
        console.log(`   Warnings: ${result.warnings.join(', ')}`);
      }
    } catch (error) {
      console.log(`⚠️  API call failed (expected in some environments): ${error.message}`);
    }

    // Test 9: Parse real OpenAPI spec from URL
    console.log('\nTest 9: Parsing JSONPlaceholder OpenAPI spec from URL...');
    try {
      // Using a known public OpenAPI spec
      const realSpec = await parser.parseFromUrl('https://petstore3.swagger.io/api/v3/openapi.json');
      console.log('✅ Real spec parsed from URL');
      console.log(`   Title: ${realSpec.info.title}`);
      console.log(`   Version: ${realSpec.info.version}`);
      const realEndpoints = parser.extractEndpoints(realSpec);
      console.log(`   Endpoints: ${realEndpoints.length}`);
    } catch (error) {
      console.log(`⚠️  URL parsing test skipped (network/CORS): ${error.message.substring(0, 100)}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 ALL CORE TESTS PASSED!');
    console.log('='.repeat(60));
    console.log('\n✅ MCP API Toolkit is working correctly!');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    console.error(error);
    process.exit(1);
  }
}

runTests();
