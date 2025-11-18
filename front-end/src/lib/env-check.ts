// Debug helper - sprawdza czy zmienne środowiskowe są załadowane
export function checkEnvVariables() {
  const requiredEnvVars = {
    'NEXT_PUBLIC_COGNITO_USER_POOL_ID': process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    'NEXT_PUBLIC_COGNITO_CLIENT_ID': process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    'NEXT_PUBLIC_COGNITO_REGION': process.env.NEXT_PUBLIC_COGNITO_REGION,
    'NEXT_PUBLIC_API_GATEWAY_URL': process.env.NEXT_PUBLIC_API_GATEWAY_URL,
  };

  const missing: string[] = [];

  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing);
    console.error('Please check your .env.local file');
    return false;
  }

  console.log('✅ All required environment variables are set:');
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    // Show first and last 4 characters for security
    const maskedValue = value!.length > 8
      ? `${value!.substring(0, 4)}...${value!.substring(value!.length - 4)}`
      : '****';
    console.log(`  ${key}: ${maskedValue}`);
  });

  return true;
}

