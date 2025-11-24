import { Amplify } from 'aws-amplify';
import { checkEnvVariables } from './env-check';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      region: process.env.NEXT_PUBLIC_COGNITO_REGION!,
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
      },
    },
  },
};

export function configureAmplify() {
  try {
    // Check if environment variables are set
    if (!checkEnvVariables()) {
      throw new Error('Missing required environment variables');
    }

    Amplify.configure(amplifyConfig, { ssr: true });
    console.log('✅ Amplify configured successfully');
  } catch (error) {
    console.error('❌ Error configuring Amplify:', error);
    throw error;
  }
}

export default amplifyConfig;
