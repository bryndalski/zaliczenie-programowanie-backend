# Rozwiązanie problemu "Unauthorized" w API Gateway

## Problem
Otrzymujesz błąd `NetworkError when attempting to fetch resource` oraz `401 Unauthorized` podczas wywołań API.

## Przyczyna
Były **dwa problemy**:

### 1. Użycie Access Token zamiast ID Token
AWS API Gateway z **Cognito User Pool Authorizer** wymaga **ID Token**, a nie Access Token.

**Przed:**
```typescript
const token = session.tokens?.accessToken?.toString();
```

**Po:**
```typescript
const token = session.tokens?.idToken?.toString();
```

### 2. Brak `identity_source` w konfiguracji authorizera
Authorizer musi wiedzieć, skąd pobrać token JWT.

**Przed:**
```terraform
resource "aws_api_gateway_authorizer" "cognito" {
  name          = "..."
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.api.id
  provider_arns = [var.cognito_user_pool_arn]
}
```

**Po:**
```terraform
resource "aws_api_gateway_authorizer" "cognito" {
  name            = "..."
  type            = "COGNITO_USER_POOLS"
  rest_api_id     = aws_api_gateway_rest_api.api.id
  provider_arns   = [var.cognito_user_pool_arn]
  identity_source = "method.request.header.Authorization"  # ← DODANE
}
```

## Różnice między tokenami

### Access Token
- Używany do **autoryzacji dostępu do zasobów**
- Zawiera **scopes** i **permissions**
- Krótszy czas życia (domyślnie 60 minut)
- Używany w **OAuth 2.0** flow

### ID Token
- Używany do **identyfikacji użytkownika**
- Zawiera **user claims** (sub, email, username, itp.)
- JWT z informacjami o użytkowniku
- **Wymagany przez AWS API Gateway Cognito User Pool Authorizer**

## Jak działa flow

1. **Użytkownik loguje się** → AWS Cognito zwraca tokeny (ID, Access, Refresh)
2. **Frontend wysyła request** z `Authorization: Bearer {ID_TOKEN}`
3. **API Gateway** odbiera request i wywołuje authorizer
4. **Cognito Authorizer** waliduje ID Token z User Pool
5. **Lambda** otrzymuje `requestContext.authorizer.claims` z danymi użytkownika
6. **Middleware** wyciąga `userId` z `claims.sub`

## Kroki do zastosowania poprawki

### 1. Zaktualizuj front-end
```bash
cd front-end
# Plik już został zaktualizowany - używa idToken zamiast accessToken
```

### 2. Zaktualizuj Terraform
```bash
cd ../terraform
terraform plan   # Sprawdź zmiany
terraform apply  # Zastosuj zmiany
```

### 3. Zrestartuj aplikację Next.js
```bash
cd ../front-end
npm run dev
```

### 4. Przetestuj
1. Zaloguj się ponownie (aby mieć świeże tokeny)
2. Spróbuj pobrać notatki
3. Spróbuj utworzyć notatkę

## Debugowanie

### Sprawdź czy masz ID Token
Otwórz DevTools Console i wykonaj:
```javascript
import { fetchAuthSession } from 'aws-amplify/auth';
const session = await fetchAuthSession();
console.log('ID Token:', session.tokens?.idToken?.toString());
console.log('Access Token:', session.tokens?.accessToken?.toString());
```

### Sprawdź zawartość ID Token
Wklej token do https://jwt.io i sprawdź:
- `sub` - user ID (UUID)
- `cognito:username` - nazwa użytkownika
- `email` - email użytkownika
- `email_verified` - czy email jest zweryfikowany

### Sprawdź response z API
```javascript
const headers = { 
  'Authorization': `Bearer ${idToken}`,
  'Content-Type': 'application/json'
};
const response = await fetch('API_URL/notes/get', { headers });
console.log('Status:', response.status);
console.log('Response:', await response.json());
```

## Potencjalne problemy

### Token wygasł
- ID Token jest ważny przez 60 minut (domyślnie)
- Rozwiązanie: Wyloguj się i zaloguj ponownie
- Lub użyj refresh token (automatyczne w Amplify)

### Zły User Pool
- Sprawdź czy `NEXT_PUBLIC_COGNITO_USER_POOL_ID` w `.env.local` jest poprawny
- Sprawdź czy authorizer w Terraform używa tego samego User Pool ARN

### CORS
- Jeśli widzisz błędy CORS, sprawdź konfigurację CORS w Terraform
- API Gateway musi zwracać odpowiednie nagłówki `Access-Control-Allow-*`

### Brak deploy API Gateway
Po zmianach w Terraform musisz **zredeploy'ować API Gateway**:
```bash
terraform apply
# To automatycznie utworzy nowy deployment
```

## Dodatkowe zasoby

- [AWS API Gateway Authorizers](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html)
- [Cognito User Pool Tokens](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html)
- [AWS Amplify Auth](https://docs.amplify.aws/javascript/build-a-backend/auth/)

