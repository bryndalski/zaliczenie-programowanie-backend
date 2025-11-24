This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Environment Configuration

First, you need to set up your environment variables. You have two options:

#### Option A: Automatic (Recommended)
Run the script to automatically generate `.env.local` from Terraform outputs:

```bash
./generate-env.sh
```

This script requires `jq` to be installed. On macOS:
```bash
brew install jq
```

#### Option B: Manual
Copy the example file and fill in the values:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your AWS Cognito and API Gateway configuration.

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app` - Next.js App Router pages
  - `/auth` - Authentication pages (login, register, forgot password)
  - `/dashboard` - Protected dashboard page
- `/src/components` - React components
  - `/auth` - Authentication-related components
- `/src/contexts` - React contexts (AuthContext)
- `/src/hooks` - Custom React hooks (useAuthActions, useNotes)
- `/src/lib` - Library configurations and utilities

## Features

- ✅ AWS Cognito authentication
- ✅ Protected routes with middleware
- ✅ Login, Register, Forgot Password flows
- ✅ Dashboard with notes management (CRUD operations)
- ✅ Tailwind CSS styling
- ✅ TypeScript support

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_COGNITO_USER_POOL_ID` - AWS Cognito User Pool ID
- `NEXT_PUBLIC_COGNITO_CLIENT_ID` - AWS Cognito Client ID
- `NEXT_PUBLIC_COGNITO_REGION` - AWS Region (e.g., eu-central-1)
- `NEXT_PUBLIC_API_GATEWAY_URL` - API Gateway endpoint URL

## Troubleshooting

### Authentication Issues

If you encounter problems with login or dashboard access:

1. **"There is already a signed in user" error:**
   - Click the "Clear session and retry" button in the error message
   - Or visit `/auth/debug` and use "Force Sign Out & Clear All"

2. **Can't access dashboard:**
   - Visit `/auth/debug` to check your auth state
   - Use "Log Auth State to Console" to see detailed information

3. **"401 Unauthorized" when calling API:**
   - See [API_AUTHORIZATION_FIX.md](./API_AUTHORIZATION_FIX.md) for detailed explanation
   - **TL;DR:** App now uses ID Token (not Access Token) for API Gateway authorization
   - Make sure to re-login after updating code

4. **Other auth issues:**
   - See [AUTH_TROUBLESHOOTING.md](./AUTH_TROUBLESHOOTING.md) for detailed guide

### Debug Tools

- **Debug Page:** Visit `/auth/debug` for auth diagnostic tools
- **Check Environment:** Run `./check-env.sh` to verify configuration
- **Test API Auth:** Run `./test-api-auth.sh` for API authorization test instructions

## Documentation

- [Dashboard Guide](./DASHBOARD_GUIDE.md) - Complete guide to notes dashboard features
- [Auth Troubleshooting](./AUTH_TROUBLESHOOTING.md) - Solving authentication problems
- [API Authorization Fix](./API_AUTHORIZATION_FIX.md) - Understanding ID Token vs Access Token

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

