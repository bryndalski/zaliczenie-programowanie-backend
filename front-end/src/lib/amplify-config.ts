import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
      region: process.env.NEXT_PUBLIC_AWS_REGION!,
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
        phone: false,
        username: false,
      },
    },
  },
};

export function configureAmplify() {
  try {
    Amplify.configure(amplifyConfig);
  } catch (error) {
    console.error('Error configuring Amplify:', error);
  }
}

export default amplifyConfig;
