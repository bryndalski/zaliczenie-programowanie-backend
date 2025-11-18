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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

