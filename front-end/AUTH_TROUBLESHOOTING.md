# Troubleshooting Guide - Authorization Issues

## Problem: Front-end nie wysyła Bearer tokenu (Unauthorized Error)

### Objawy:
- API zwraca status 401 Unauthorized
- Brak nagłówka Authorization w requestach
- Front-end pokazuje błąd "Unauthorized"

### Kroki do debugowania:

#### 1. Sprawdź środowisko
```bash
cd front-end
cat .env.local
```

Upewnij się, że wszystkie zmienne są ustawione:
- `NEXT_PUBLIC_COGNITO_USER_POOL_ID`
- `NEXT_PUBLIC_COGNITO_CLIENT_ID` 
- `NEXT_PUBLIC_COGNITO_REGION`
- `NEXT_PUBLIC_API_GATEWAY_URL`

#### 2. Uruchom frontend z debugowaniem
```bash
chmod +x start-debug.sh
./start-debug.sh
```

#### 3. Testuj autoryzację krok po kroku

1. **Otwórz http://localhost:3000**
2. **Zaloguj się** na swoje konto
3. **Otwórz Developer Console (F12)**
4. **Sprawdź logi** - szukaj komunikatów z emoji 🔐, ✅, ❌
5. **Użyj AuthDebugger** - widget w prawym dolnym rogu

#### 4. Sprawdź typowe problemy

##### Problem: "No ID token available"
- **Przyczyna**: Użytkownik nie jest w pełni zalogowany
- **Rozwiązanie**: Wyloguj się i zaloguj ponownie

##### Problem: "Token is expired"
- **Przyczyna**: Token wygasł
- **Rozwiązanie**: Wyloguj się i zaloguj ponownie

##### Problem: "Auth UserPool not configured"
- **Przyczyna**: Błędna konfiguracja Amplify
- **Rozwiązanie**: Sprawdź zmienne środowiskowe

#### 5. Test backendu bez frontendu
```bash
chmod +x test-api-auth.sh
./test-api-auth.sh
```

#### 6. Sprawdź infrastrukturę
```bash
cd ../terraform
terraform output
```

Sprawdź czy outputy są poprawne:
- `api_gateway_url`
- `cognito_client_id`
- `cognito_user_pool_id`

## Rozwiązania problemów

### Błąd 1: Lock file w Next.js
```bash
rm -rf .next
npm run dev
```

### Błąd 2: Brak tokenu po logowaniu
1. Sprawdź localStorage w przeglądarce
2. Szukaj kluczy zaczynających się od "CognitoIdentityServiceProvider"
3. Jeśli brak - wyczyść localStorage i zaloguj ponownie

### Błąd 3: CORS errors
- Sprawdź czy request idzie do poprawnego URL
- Upewnij się że API Gateway ma właściwie skonfigurowany CORS

### Błąd 4: 403 Forbidden z API Gateway
- Sprawdź czy Cognito User Pool ARN jest poprawny w Terraform
- Zweryfikuj czy endpoint używa authorizera

## Debug Commands

### Sprawdź status infrastruktury:
```bash
cd terraform
terraform plan
```

### Sprawdź logi Lambda:
```bash
aws logs tail /aws/lambda/default-notes-app-get_notes --follow
```

### Test autoryzacji przez AWS CLI:
```bash
aws cognito-idp admin-create-user --user-pool-id eu-central-1_dBuqwAOur --username test@example.com
```

## Kontakt z deweloperem

Jeśli problemy nadal występują, dołącz do raportu:

1. **Logi z przeglądarki** (F12 → Console)
2. **Network tab** z failed requestem
3. **Wynik** `./test-api-auth.sh`
4. **Terraform outputs** z `terraform output`
5. **Zawartość** `.env.local`
