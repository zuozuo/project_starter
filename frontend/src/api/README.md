# API Generated Code

This directory contains auto-generated TypeScript code from the backend OpenAPI specification.

## Usage

### 1. Generate API Client

Make sure the backend is running at `http://localhost:8000`, then run:

```bash
npm run generate-api
```

This will generate TypeScript types and API client code in the `generated/` directory.

### 2. Use Generated API

```typescript
import { UsersService, type User } from '@/api/generated';

// Get users list
const users: User[] = await UsersService.getUsers();

// Create a new user
const newUser = await UsersService.createUser({
  username: 'john',
  email: 'john@example.com',
  password: 'secret123',
});
```

## Files

- `generated/models/` - TypeScript type definitions from backend Pydantic models
- `generated/services/` - API service functions
- `generated/index.ts` - Main export file

## Notes

- **Do not edit generated files manually** - they will be overwritten on the next generation
- Run `npm run generate-api` after backend API changes
- The generated code uses axios client configured in `@/config/api.ts`
