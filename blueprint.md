# Package Blueprint: TypeScript SDK Template

This blueprint extracts all patterns, configurations, and structure from the `steadfast-courier` project to serve as a
complete template for building similar npm packages.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Package.json Configuration](#packagejson-configuration)
3. [TypeScript Configuration](#typescript-configuration)
4. [Build Process](#build-process)
5. [CI/CD Workflows](#cicd-workflows)
6. [Testing Setup](#testing-setup)
7. [Linting and Formatting](#linting-and-formatting)
8. [Architectural Patterns](#architectural-patterns)
9. [Publishing Workflow](#publishing-workflow)
10. [Step-by-Step Checklist](#step-by-step-checklist)

---

## Project Structure

### Directory Layout

```
project-name/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Continuous Integration
│       └── release.yml         # Automated Publishing
├── dist/                       # Build output (CJS + ESM)
├── dist-esm/                   # Temporary ESM build
├── scripts/
│   └── fix-esm-extension.js   # Post-build script for ESM
├── src/
│   ├── client.ts              # Main client class
│   ├── constants.ts           # Constants and enums
│   ├── index.ts               # Main entry point
│   ├── services/              # API service classes
│   │   ├── base.service.ts    # Base service class
│   │   └── *.service.ts       # Individual services
│   ├── types/                 # TypeScript type definitions
│   │   ├── index.ts
│   │   └── *.ts
│   ├── utils/                 # Utility functions
│   │   ├── errors.ts          # Custom error classes
│   │   ├── http-client.ts     # HTTP client wrapper
│   │   └── validation.ts       # Input validation
│   └── webhooks/              # Webhook handling (optional)
│       ├── adapters/          # Framework adapters
│       ├── handler.ts
│       ├── parser.ts
│       └── verifier.ts
├── tests/
│   └── unit/                  # Unit tests
├── .eslintrc.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── vitest.config.ts
├── README.md
├── CHANGELOG.md
└── LICENSE
```

### Key Files

- **`src/index.ts`** - Main entry point, exports all public APIs
- **`src/client.ts`** - Main client class that initializes services
- **`src/services/base.service.ts`** - Base class for all service classes
- **`src/utils/http-client.ts`** - HTTP client for API requests
- **`src/utils/errors.ts`** - Custom error classes
- **`src/utils/validation.ts`** - Input validation utilities

---

## Package.json Configuration

### Essential Configuration

```json
{
	"name": "your-package-name",
	"version": "1.0.0",
	"description": "TypeScript SDK for Your API",
	"main": "./dist/index.js",
	"module": "./dist/index.mjs",
	"types": "./dist/index.d.ts",
	"engines": {
		"node": ">=18.0.0"
	},
	"license": "MIT",
	"repository": {
		"type": "git",
		"url": "git+https://github.com/your-username/your-repo.git"
	},
	"bugs": {
		"url": "https://github.com/your-username/your-repo/issues"
	},
	"homepage": "https://github.com/your-username/your-repo#readme"
}
```

### Exports Configuration (Dual ESM/CJS)

```json
{
	"exports": {
		".": {
			"import": {
				"types": "./dist/index.d.ts",
				"default": "./dist/index.mjs"
			},
			"require": {
				"types": "./dist/index.d.ts",
				"default": "./dist/index.js"
			}
		},
		"./webhooks": {
			"import": {
				"types": "./dist/webhooks/index.d.ts",
				"default": "./dist/webhooks/index.mjs"
			},
			"require": {
				"types": "./dist/webhooks/index.d.ts",
				"default": "./dist/webhooks/index.js"
			}
		},
		"./package.json": "./package.json"
	}
}
```

### TypeScript Compatibility

```json
{
	"typesVersions": {
		"*": {
			"webhooks": ["./dist/webhooks/index.d.ts"]
		}
	}
}
```

### Files to Publish

```json
{
	"files": ["dist", "README.md", "CHANGELOG.md", "LICENSE"]
}
```

### Scripts

```json
{
	"scripts": {
		"build": "tsc -p tsconfig.build.json && npm run build:esm",
		"build:esm": "tsc -p tsconfig.build.json --module esnext --outDir dist-esm && node scripts/fix-esm-extension.js",
		"dev": "tsc --watch",
		"test": "vitest run",
		"test:watch": "vitest",
		"test:coverage": "vitest run --coverage",
		"lint": "eslint src --ext .ts",
		"lint:fix": "eslint src --ext .ts --fix",
		"format": "prettier --write \"src/**/*.ts\"",
		"format:check": "prettier --check \"src/**/*.ts\"",
		"docs": "typedoc",
		"docs:serve": "typedoc --serve",
		"prepublishOnly": "npm run build && npm run test"
	}
}
```

### Dependencies

```json
{
	"devDependencies": {
		"@types/node": "^20.10.0",
		"@typescript-eslint/eslint-plugin": "^6.13.0",
		"@typescript-eslint/parser": "^6.13.0",
		"@vitest/coverage-v8": "^1.0.4",
		"eslint": "^8.54.0",
		"prettier": "^3.1.0",
		"tsx": "^4.21.0",
		"typedoc": "^0.25.0",
		"typescript": "^5.3.2",
		"vitest": "^1.0.4"
	},
	"peerDependencies": {
		"express": "^4.18.0",
		"fastify": "^4.24.0"
	},
	"peerDependenciesMeta": {
		"express": {
			"optional": true
		},
		"fastify": {
			"optional": true
		}
	}
}
```

---

## TypeScript Configuration

### tsconfig.json (Development)

```json
{
	"compilerOptions": {
		"target": "ES2022",
		"module": "commonjs",
		"lib": ["ES2022"],
		"types": ["node"],
		"declaration": true,
		"declarationMap": true,
		"sourceMap": true,
		"outDir": "./dist",
		"rootDir": "./src",
		"removeComments": false,
		"strict": true,
		"esModuleInterop": true,
		"skipLibCheck": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"moduleResolution": "node",
		"allowSyntheticDefaultImports": true,
		"noUnusedLocals": true,
		"noUnusedParameters": true,
		"noImplicitReturns": true,
		"noFallthroughCasesInSwitch": true,
		"noUncheckedIndexedAccess": true,
		"exactOptionalPropertyTypes": true
	},
	"include": ["src/**/*"],
	"exclude": ["node_modules", "dist", "dist-esm", "tests", "**/*.test.ts", "**/*.spec.ts"]
}
```

### tsconfig.build.json (Production Build)

```json
{
	"extends": "./tsconfig.json",
	"compilerOptions": {
		"outDir": "./dist",
		"declaration": true,
		"declarationMap": true,
		"sourceMap": true,
		"skipLibCheck": true
	},
	"include": ["src/**/*"],
	"exclude": [
		"node_modules",
		"dist",
		"dist-esm",
		"tests",
		"**/*.test.ts",
		"**/*.spec.ts",
		"src/webhooks/adapters/express.ts",
		"src/webhooks/adapters/fastify.ts"
	]
}
```

**Note:** Exclude framework adapter files if they're peer dependencies.

---

## Build Process

### Dual Module System (ESM + CJS)

The build process creates both CommonJS (`.js`) and ESM (`.mjs`) outputs:

1. **Build CommonJS:**

   ```bash
   tsc -p tsconfig.build.json
   ```

   Outputs: `dist/**/*.js`, `dist/**/*.d.ts`, `dist/**/*.map`

2. **Build ESM:**

   ```bash
   tsc -p tsconfig.build.json --module esnext --outDir dist-esm
   ```

   Outputs: `dist-esm/**/*.js`

3. **Fix ESM Extensions:**
   ```bash
   node scripts/fix-esm-extension.js
   ```
   Converts `.js` to `.mjs` and updates import statements

### fix-esm-extension.js Script

```javascript
#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function fixExtensions(dir) {
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			fixExtensions(filePath);
		} else if (file.endsWith(".js")) {
			// Rename .js to .mjs
			const newPath = filePath.replace(/\.js$/, ".mjs");
			fs.renameSync(filePath, newPath);

			// Update import statements in the file
			let content = fs.readFileSync(newPath, "utf8");
			content = content.replace(/from\s+['"](\.\/[^'"]+)\.js['"]/g, "from '$1.mjs'");
			content = content.replace(/from\s+['"](\.\.\/[^'"]+)\.js['"]/g, "from '$1.mjs'");
			fs.writeFileSync(newPath, content, "utf8");
		}
	}
}

const distEsmPath = path.join(__dirname, "..", "dist-esm");
if (fs.existsSync(distEsmPath)) {
	fixExtensions(distEsmPath);
	// Move .mjs files to dist
	const distPath = path.join(__dirname, "..", "dist");
	if (fs.existsSync(distPath)) {
		const moveFiles = (src, dest) => {
			const files = fs.readdirSync(src);
			for (const file of files) {
				const srcPath = path.join(src, file);
				const destPath = path.join(dest, file);
				if (fs.statSync(srcPath).isDirectory()) {
					if (!fs.existsSync(destPath)) {
						fs.mkdirSync(destPath, { recursive: true });
					}
					moveFiles(srcPath, destPath);
				} else if (file.endsWith(".mjs")) {
					fs.copyFileSync(srcPath, destPath);
				}
			}
		};
		moveFiles(distEsmPath, distPath);
	}
}
```

### Build Output Structure

For each source file `src/file.ts`, you get:

- `dist/file.js` - CommonJS
- `dist/file.mjs` - ESM
- `dist/file.d.ts` - TypeScript declarations
- `dist/file.d.ts.map` - Declaration source map
- `dist/file.js.map` - JavaScript source map

---

## CI/CD Workflows

### CI Workflow (`.github/workflows/ci.yml`)

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    name: Test (${{ matrix.node-version }})
    runs-on: ubuntu-latest
    timeout-minutes: 15
    strategy:
      matrix:
        node-version: [18.x, 20.x]
      fail-fast: false
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Format check
        run: npm run format:check
      - name: Build
        run: npm run build
      - name: Test
        run: npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: matrix.node-version == '20.x'
        with:
          files: ./coverage/coverage-final.json
          fail_ci_if_error: false

  test-package-managers:
    name: Test Package Managers (${{ matrix.package-manager }})
    runs-on: ubuntu-latest
    timeout-minutes: 15
    strategy:
      matrix:
        package-manager: [npm, yarn, pnpm]
      fail-fast: false
    steps:
      - uses: actions/checkout@v4
      - name: Install pnpm
        if: matrix.package-manager == 'pnpm'
        uses: pnpm/action-setup@v2
        with:
          version: 10
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20.x"
          cache: ${{ matrix.package-manager }}
      - name: Install dependencies
        run: |
          if [ "${{ matrix.package-manager }}" == "npm" ]; then npm ci; fi
          if [ "${{ matrix.package-manager }}" == "yarn" ]; then yarn install --frozen-lockfile; fi
          if [ "${{ matrix.package-manager }}" == "pnpm" ]; then pnpm install --frozen-lockfile; fi
      - name: Build
        run: |
          if [ "${{ matrix.package-manager }}" == "npm" ]; then npm run build; fi
          if [ "${{ matrix.package-manager }}" == "yarn" ]; then yarn build; fi
          if [ "${{ matrix.package-manager }}" == "pnpm" ]; then pnpm build; fi
      - name: Test
        run: |
          if [ "${{ matrix.package-manager }}" == "npm" ]; then npm test; fi
          if [ "${{ matrix.package-manager }}" == "yarn" ]; then yarn test; fi
          if [ "${{ matrix.package-manager }}" == "pnpm" ]; then pnpm test; fi
```

### Release Workflow (`.github/workflows/release.yml`)

Key features:

- OIDC authentication (no tokens needed)
- Version validation
- Duplicate version check
- Automated publishing

See full workflow in the project's `.github/workflows/release.yml` file.

**Key Requirements:**

- Node.js 24.x (for npm 11.5.1+ with OIDC support)
- `id-token: write` permission
- Trusted Publisher configured on npm

---

## Testing Setup

### Vitest Configuration (`vitest.config.ts`)

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: ["node_modules/", "dist/", "dist-esm/", "**/*.test.ts", "**/*.spec.ts", "**/index.ts"],
		},
	},
});
```

### Test File Structure

```
tests/
└── unit/
    ├── services/
    ├── utils/
    └── webhooks/
```

### Example Test

```typescript
import { describe, it, expect } from "vitest";
import { YourService } from "../../src/services/your.service";

describe("YourService", () => {
	it("should do something", () => {
		// Test implementation
	});
});
```

---

## Linting and Formatting

### ESLint Configuration (`.eslintrc.json`)

```json
{
	"root": true,
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": 2022,
		"sourceType": "module",
		"project": "./tsconfig.json"
	},
	"plugins": ["@typescript-eslint"],
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking"
	],
	"rules": {
		"@typescript-eslint/explicit-function-return-type": "warn",
		"@typescript-eslint/no-explicit-any": "error",
		"@typescript-eslint/no-unused-vars": [
			"error",
			{
				"argsIgnorePattern": "^_",
				"varsIgnorePattern": "^_"
			}
		],
		"prefer-const": "error",
		"no-var": "error"
	},
	"env": {
		"node": true,
		"es2022": true
	},
	"ignorePatterns": ["scripts/**", "dist/**", "dist-esm/**", "node_modules/**"]
}
```

### Prettier Configuration

Create `.prettierrc.json`:

```json
{
	"semi": true,
	"trailingComma": "es5",
	"singleQuote": true,
	"printWidth": 100,
	"tabWidth": 2
}
```

---

## Architectural Patterns

### 1. Main Client Pattern

```typescript
// src/client.ts
import { HttpClient, HttpClientConfig } from "./utils/http-client";
import { YourService } from "./services/your.service";

export interface YourClientConfig {
	apiKey: string;
	secretKey: string;
	baseUrl?: string;
	timeout?: number;
}

export class YourClient {
	private readonly httpClient: HttpClient;
	public readonly yourService: YourService;

	constructor(config: YourClientConfig) {
		if (!config.apiKey || !config.secretKey) {
			throw new Error("apiKey and secretKey are required");
		}

		const httpConfig: HttpClientConfig = {
			apiKey: config.apiKey,
			secretKey: config.secretKey,
			...(config.baseUrl && { baseUrl: config.baseUrl }),
			...(config.timeout && { timeout: config.timeout }),
		};

		this.httpClient = new HttpClient(httpConfig);
		this.yourService = new YourService(this.httpClient);
	}
}
```

### 2. Base Service Pattern

```typescript
// src/services/base.service.ts
import { HttpClient } from "../utils/http-client";

export abstract class BaseService {
	protected readonly httpClient: HttpClient;

	constructor(httpClient: HttpClient) {
		this.httpClient = httpClient;
	}
}
```

### 3. Service Implementation

```typescript
// src/services/your.service.ts
import { BaseService } from "./base.service";
import { YourRequest, YourResponse } from "../types/your";

export class YourService extends BaseService {
	async doSomething(request: YourRequest): Promise<YourResponse> {
		// Validation
		if (!request.field) {
			throw new Error("field is required");
		}

		// API call
		return this.httpClient.post<YourResponse>("/endpoint", request);
	}
}
```

### 4. HTTP Client Pattern

```typescript
// src/utils/http-client.ts
export class HttpClient {
	private readonly baseUrl: string;
	private readonly apiKey: string;
	private readonly secretKey: string;
	private readonly timeout: number;

	constructor(config: HttpClientConfig) {
		this.baseUrl = config.baseUrl || BASE_URL;
		this.apiKey = config.apiKey;
		this.secretKey = config.secretKey;
		this.timeout = config.timeout || 30000;
	}

	async request<T>(options: RequestOptions): Promise<T> {
		// Implementation with fetch API
		// Includes authentication headers
		// Handles timeouts and errors
	}

	async get<T>(path: string, headers?: Record<string, string>): Promise<T> {
		return this.request<T>({ method: "GET", path, headers });
	}

	async post<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
		return this.request<T>({ method: "POST", path, body, headers });
	}
}
```

### 5. Error Handling Pattern

```typescript
// src/utils/errors.ts
export class YourError extends Error {
	constructor(message: string, public readonly statusCode?: number, public readonly code?: string) {
		super(message);
		this.name = "YourError";
		Object.setPrototypeOf(this, YourError.prototype);
	}
}

export class YourApiError extends YourError {
	constructor(message: string, statusCode: number, public readonly response?: unknown) {
		super(message, statusCode, "API_ERROR");
		this.name = "YourApiError";
		Object.setPrototypeOf(this, YourApiError.prototype);
	}
}

export class YourValidationError extends YourError {
	constructor(message: string, public readonly field?: string) {
		super(message, 400, "VALIDATION_ERROR");
		this.name = "YourValidationError";
		Object.setPrototypeOf(this, YourValidationError.prototype);
	}
}
```

### 6. Validation Pattern

```typescript
// src/utils/validation.ts
import { YourValidationError } from "./errors";

export function validateField(field: string, fieldName: string = "field"): void {
	if (!field || typeof field !== "string") {
		throw new YourValidationError(`${fieldName} is required and must be a string`);
	}
	// Additional validation logic
}
```

### 7. Entry Point Pattern

```typescript
// src/index.ts
// Export main client
export { YourClient } from "./client";
export type { YourClientConfig } from "./client";

// Export all types
export * from "./types";

// Export constants
export * from "./constants";

// Export services (for advanced usage)
export { YourService } from "./services/your.service";

// Export utilities
export * from "./utils/errors";
export * from "./utils/validation";
```

---

## Publishing Workflow

### OIDC Setup (Recommended)

1. **Configure Trusted Publisher on npm:**

   - Go to: https://www.npmjs.com/package/your-package/access
   - Add Trusted Publisher:
     - Publisher: `GitHub Actions`
     - Repository: `your-username/your-repo`
     - Workflow filename: `release.yml`

2. **Workflow Requirements:**

   - Node.js 24.x (for npm 11.5.1+)
   - `id-token: write` permission
   - `registry-url: 'https://registry.npmjs.org'` in setup-node

3. **Publishing:**
   ```bash
   npm version patch && git push && git push --tags
   ```

### Manual Publishing

```bash
# Build and test
npm run build
npm test

# Publish
npm publish --access public
```

### Version Management

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major

# Push tags to trigger automated publishing
git push && git push --tags
```

---

## Step-by-Step Checklist

### Initial Setup

- [ ] Create new repository
- [ ] Initialize npm package: `npm init -y`
- [ ] Install TypeScript: `npm install -D typescript @types/node`
- [ ] Create `tsconfig.json` and `tsconfig.build.json`
- [ ] Set up project structure (src/, tests/, scripts/)
- [ ] Create `package.json` with exports configuration
- [ ] Add build scripts to `package.json`

### Development Setup

- [ ] Install dev dependencies (ESLint, Prettier, Vitest)
- [ ] Configure ESLint (`.eslintrc.json`)
- [ ] Configure Prettier (`.prettierrc.json`)
- [ ] Set up Vitest (`vitest.config.ts`)
- [ ] Create base service class
- [ ] Create HTTP client utility
- [ ] Create error classes
- [ ] Create validation utilities

### Implementation

- [ ] Implement main client class
- [ ] Implement service classes
- [ ] Create TypeScript type definitions
- [ ] Add constants and enums
- [ ] Create entry point (`src/index.ts`)
- [ ] Write unit tests
- [ ] Add JSDoc documentation

### Build Setup

- [ ] Create `fix-esm-extension.js` script
- [ ] Test build process (CJS + ESM)
- [ ] Verify output structure
- [ ] Test imports (both `import` and `require`)

### CI/CD Setup

- [ ] Create `.github/workflows/ci.yml`
- [ ] Create `.github/workflows/release.yml`
- [ ] Test CI workflow
- [ ] Set up OIDC Trusted Publisher on npm
- [ ] Test release workflow

### Documentation

- [ ] Write comprehensive README.md
- [ ] Add installation instructions
- [ ] Add usage examples
- [ ] Document API methods
- [ ] Add troubleshooting section
- [ ] Create CHANGELOG.md

### Pre-Publishing

- [ ] Run all checks: `npm run lint && npm run format:check && npm run build && npm test`
- [ ] Verify package contents: `npm pack --dry-run`
- [ ] Test package locally: `npm pack` then `npm install ./package-name-1.0.0.tgz`
- [ ] Check package.json version
- [ ] Ensure all files are committed

### Publishing

- [ ] First publish: `npm publish --access public`
- [ ] Verify on npm: `npm view your-package-name`
- [ ] Test installation: `npm install your-package-name`
- [ ] Set up automated publishing (OIDC)

### Post-Publishing

- [ ] Update README with npm package link
- [ ] Create GitHub release
- [ ] Share package with team/users
- [ ] Monitor for issues

---

## Key Takeaways

1. **Dual Module Support**: Always build both ESM and CJS for maximum compatibility
2. **TypeScript First**: Full type definitions improve developer experience
3. **Automated CI/CD**: Saves time and reduces errors
4. **OIDC Authentication**: More secure than tokens, no secrets to manage
5. **Comprehensive Testing**: Unit tests catch issues early
6. **Good Documentation**: JSDoc + README = happy developers
7. **Service Pattern**: Base service class reduces code duplication
8. **Error Handling**: Custom error classes provide better debugging
9. **Validation**: Input validation prevents API errors
10. **Source Maps**: Essential for debugging in production

---

## Customization for Your Package

When adapting this blueprint:

1. **Replace package name** in all files
2. **Update API endpoints** in constants
3. **Modify service classes** for your API
4. **Adjust type definitions** for your data models
5. **Update authentication** if different (OAuth, API keys, etc.)
6. **Customize error messages** for your domain
7. **Add/remove features** as needed (webhooks, etc.)

---

## Resources

- [npm Package.json Docs](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [OIDC Trusted Publishers](https://docs.npmjs.com/about-oidc-and-oauth2)
- [Vitest Documentation](https://vitest.dev/)

---

**Last Updated**: Based on `steadfast-courier@1.0.9`
