# Contributing to MCP API Toolkit

First off, thank you for considering contributing to MCP API Toolkit! It's people like you that make this tool better for everyone.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, Node version, Claude Code version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how it would be used**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes**
4. **Add tests** if applicable
5. **Ensure tests pass**: `npm test`
6. **Lint your code**: `npm run lint`
7. **Format your code**: `npm run format`
8. **Commit with clear messages** following [Conventional Commits](https://www.conventionalcommits.org/)
9. **Push to your fork** and submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/mcp-api-toolkit.git
cd mcp-api-toolkit

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode (watch mode)
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
mcp-api-toolkit/
├── src/
│   ├── index.ts              # Main MCP server
│   ├── tools/                # MCP tool definitions
│   │   └── index.ts
│   ├── utils/                # Utility functions
│   │   ├── openapi-parser.ts # OpenAPI parsing
│   │   ├── api-client.ts     # HTTP client
│   │   └── sdk-generator.ts  # SDK generation
│   └── types/                # TypeScript types
│       └── api.ts
├── examples/                 # Usage examples
├── docs/                     # Documentation
└── tests/                    # Unit tests
```

## Coding Standards

### TypeScript Style Guide

- Use TypeScript strict mode
- Prefer `const` over `let`, avoid `var`
- Use async/await over promises where possible
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Use type safety - avoid `any` unless absolutely necessary

### Code Formatting

We use Prettier for code formatting. Run `npm run format` before committing.

### Linting

We use ESLint with TypeScript. Run `npm run lint` to check for issues.

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new tool for API mocking
fix: resolve parsing error for YAML specs
docs: update README with new examples
test: add unit tests for SDK generator
chore: update dependencies
```

## Adding New Features

### Adding a New MCP Tool

1. Define the tool schema in `src/tools/index.ts`:
```typescript
{
  name: 'my_new_tool',
  description: 'What this tool does',
  inputSchema: {
    type: 'object',
    properties: {
      // Define parameters
    },
    required: ['param1'],
  },
}
```

2. Implement the handler in `src/index.ts`:
```typescript
case 'my_new_tool':
  return await this.handleMyNewTool(args);
```

3. Add the handler method:
```typescript
private async handleMyNewTool(args: Record<string, unknown>) {
  // Implementation
  return {
    content: [
      {
        type: 'text',
        text: 'Result',
      },
    ],
  };
}
```

4. Add tests in `tests/`
5. Update documentation in `README.md`
6. Add examples in `examples/`

### Adding Language Support for SDK Generation

1. Add the language to the `SDKGenerationOptions` type in `src/types/api.ts`
2. Implement the generator method in `src/utils/sdk-generator.ts`:
```typescript
generateGoSDK(spec: OpenAPISpec, options: SDKGenerationOptions): string {
  // Implementation
}
```
3. Add the case in `handleGenerateSDK` in `src/index.ts`
4. Add tests and examples

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Place tests in `tests/` directory
- Use descriptive test names
- Test edge cases and error handling
- Aim for high code coverage

Example test:
```typescript
describe('OpenAPIParser', () => {
  it('should parse valid OpenAPI spec', async () => {
    const parser = new OpenAPIParser();
    const spec = await parser.parseSpec(validSpec);
    expect(spec.info.title).toBe('My API');
  });

  it('should throw error for invalid spec', async () => {
    const parser = new OpenAPIParser();
    await expect(parser.parseSpec(invalidSpec)).rejects.toThrow();
  });
});
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new functions
- Update examples for new features
- Keep documentation clear and concise

## Release Process

(For maintainers)

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create a git tag: `git tag v0.2.0`
4. Push tag: `git push origin v0.2.0`
5. GitHub Actions will publish to npm automatically

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Be patient and understanding
- Accept constructive criticism gracefully
- Focus on what is best for the community

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## Questions?

- Open an issue for questions
- Join discussions on GitHub
- Reach out to maintainers

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing! 🎉
