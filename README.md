# Notes App - Aplikacja do Zarządzania Notatkami

Fullstack aplikacja serverless do zarządzania notatkami, zbudowana w architekturze AWS z wykorzystaniem Lambda, DynamoDB, Cognito oraz Next.js jako frontend.

## 📋 Spis Treści

- [Architektura](#-architektura)
- [Technologie](#-technologie)
- [Struktura Projektu](#-struktura-projektu)
- [Endpointy API](#-endpointy-api)
- [DynamoDB - Struktura i Indeksy](#-dynamodb---struktura-i-indeksy)
- [Funkcje Lambda](#-funkcje-lambda)
- [Jak Uruchomić Projekt](#-jak-uruchomić-projekt)
- [Porty i Adresy](#-porty-i-adresy)
- [Serwisy AWS](#-serwisy-aws)
- [Środowisko Developerskie](#-środowisko-developerskie)
- [Debugging i Troubleshooting](#-debugging-i-troubleshooting)
- [Bezpieczeństwo](#-bezpieczeństwo)

## 🏗 Architektura

Projekt wykorzystuje architekturę **serverless** z pełnym rozdzieleniem frontendu i backendu:

```
┌─────────────────┐
│   Next.js App   │ ──────► Port 3000 (localhost)
│   (Frontend)    │
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────────────────────────────────────────┐
│           AWS API Gateway (REST API)                │
│  • Autoryzacja: Cognito User Pool Authorizer       │
│  • CORS: Skonfigurowane                            │
│  • Endpointy: /notes/add, /notes/get, etc.         │
└────────┬────────────────────────────────────────────┘
         │
         │ Invoke
         ▼
┌─────────────────────────────────────────────────────┐
│              AWS Lambda Functions                   │
│  • add_note    • get_notes                         │
│  • update_note • delete_note                       │
│  Runtime: Node.js 20.x                             │
│  Layers: telemetry + dynamodb                      │
└────────┬────────────────────────────────────────────┘
         │
         │ SDK Calls
         ▼
┌─────────────────────────────────────────────────────┐
│              AWS DynamoDB                           │
│  Table: {variant}-notes-app-notes                  │
│  • Hash Key: userId                                │
│  • Range Key: noteId                               │
│  • Billing: PAY_PER_REQUEST                        │
└─────────────────────────────────────────────────────┘

         Authentication Flow:
         ┌────────────────┐
         │ AWS Cognito    │
         │ User Pool      │
         │ • Email login  │
         │ • Password     │
         │ • JWT tokens   │
         └────────────────┘
```

## 🔧 Technologie

### Backend
- **AWS Lambda** - Funkcje serverless (Node.js 20.x)
- **AWS DynamoDB** - Baza danych NoSQL
- **AWS Cognito** - Uwierzytelnianie użytkowników
- **AWS API Gateway** - REST API
- **Terraform** - Infrastructure as Code
- **TypeScript** - Język programowania

### Frontend
- **Next.js 16** - Framework React z App Router
- **React 19** - Biblioteka UI
- **TypeScript** - Typowanie statyczne
- **Tailwind CSS 4** - Framework CSS
- **AWS Amplify** - Integracja z AWS
- **React Hook Form** - Zarządzanie formularzami
- **Zod** - Walidacja schematów

## 📁 Struktura Projektu

```
.
├── terraform/                    # Infrastruktura AWS (IaC)
│   ├── main.tf                  # Główny plik konfiguracyjny
│   ├── locals.tf                # Zmienne lokalne (project, variant)
│   ├── backend.tf               # Konfiguracja backendu Terraform
│   └── modules/
│       ├── api-gateway/         # REST API Gateway
│       ├── cognito/             # User Pool i konfiguracja
│       ├── dynamodb/            # Tabele DynamoDB
│       ├── lambda/              # Moduł funkcji Lambda
│       ├── lambda-layers/       # Lambda Layers
│       ├── endpoints/           # Integracja API Gateway ↔ Lambda
│       └── project/             # Główny moduł projektu
│
├── src/                         # Backend - kod Lambda
│   ├── lambdas/
│   │   ├── add_note/           # POST - dodawanie notatki
│   │   ├── get_notes/          # GET - pobieranie notatek
│   │   ├── update_note/        # PUT - aktualizacja notatki
│   │   └── delete_note/        # DELETE - usuwanie notatki
│   ├── layers/
│   │   ├── dynamodb/           # Helper do operacji DynamoDB
│   │   └── telemetry/          # Logging, middleware, responses
│   ├── entities/
│   │   └── note.entity.ts      # Encja notatki z walidacją
│   └── build.js                # Skrypt budowania Lambda
│
└── front-end/                   # Frontend - Next.js
    ├── src/
    │   ├── app/                # App Router (Next.js 13+)
    │   │   ├── page.tsx        # Strona główna
    │   │   ├── auth/           # Strony autoryzacji
    │   │   │   ├── login/
    │   │   │   ├── register/
    │   │   │   └── forgot-password/
    │   │   └── dashboard/      # Dashboard z notatkami
    │   ├── components/
    │   │   ├── auth/           # Komponenty autoryzacji
    │   │   └── notes/          # Komponenty notatek
    │   ├── contexts/
    │   │   └── AuthContext.tsx # Context API dla auth
    │   ├── hooks/
    │   │   ├── useAuthActions.ts
    │   │   └── useNotes.ts
    │   └── lib/
    │       ├── amplify-config.ts
    │       └── validation.ts
    └── package.json
```

## 🌐 Endpointy API

Wszystkie endpointy wymagają autoryzacji przez **Cognito User Pool Authorizer** (JWT token w nagłówku `Authorization`).

### Base URL
```
https://{api-id}.execute-api.{region}.amazonaws.com/{stage}/notes
```

### Dostępne Endpointy

#### 1. **POST /notes/add** - Dodanie notatki
```json
Request:
{
  "title": "Tytuł notatki",
  "content": "Treść notatki"
}

Response (201):
{
  "note": {
    "noteId": "uuid-v4",
    "userId": "cognito-user-id",
    "title": "Tytuł notatki",
    "content": "Treść notatki",
    "createdAt": "2025-12-03T12:00:00.000Z",
    "updatedAt": "2025-12-03T12:00:00.000Z"
  }
}
```

#### 2. **GET /notes/get** - Pobranie wszystkich notatek użytkownika
```json
Response (200):
{
  "notes": [
    {
      "noteId": "uuid-v4",
      "userId": "cognito-user-id",
      "title": "Tytuł",
      "content": "Treść",
      "createdAt": "2025-12-03T12:00:00.000Z",
      "updatedAt": "2025-12-03T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### 3. **PUT /notes/update** - Aktualizacja notatki
```json
Request:
{
  "noteId": "uuid-v4",
  "title": "Nowy tytuł",
  "content": "Nowa treść"
}

Response (200):
{
  "note": { /* zaktualizowana notatka */ }
}
```

#### 4. **DELETE /notes/delete** - Usunięcie notatki
```json
Request:
{
  "noteId": "uuid-v4"
}

Response (200):
{
  "message": "Note deleted successfully"
}
```

### Nagłówki CORS
Wszystkie endpointy zwracają:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Content-Type,Authorization
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
```

## 🗄 DynamoDB - Struktura i Indeksy

### Tabela: `{variant}-notes-app-notes`

**Nazwa przykładowa:** `dev-notes-app-notes`

### Klucze Główne

| Typ | Nazwa | Typ Danych | Opis |
|-----|-------|------------|------|
| **HASH (Partition Key)** | `userId` | String | ID użytkownika z Cognito (sub claim) |
| **RANGE (Sort Key)** | `noteId` | String | UUID notatki (v4) |

### Atrybuty

| Nazwa | Typ | Opis |
|-------|-----|------|
| `userId` | String | Identyfikator użytkownika z Cognito |
| `noteId` | String | Unikalny identyfikator notatki (UUID) |
| `title` | String | Tytuł notatki |
| `content` | String | Treść notatki (może być pusta) |
| `createdAt` | String | Timestamp utworzenia (ISO 8601) |
| `updatedAt` | String | Timestamp ostatniej modyfikacji (ISO 8601) |

### Struktura Kluczy - Dlaczego Tak?

#### Composite Key: `userId` (HASH) + `noteId` (RANGE)

**Zalety tego podejścia:**

1. **Naturalne partycjonowanie** - Dane każdego użytkownika są w osobnej partycji
2. **Efektywne zapytania** - Query po `userId` zwraca wszystkie notatki użytkownika
3. **Unique constraint** - Kombinacja userId + noteId jest unikalna
4. **Skalowalność** - DynamoDB automatycznie balansuje obciążenie między partycjami

**Wzorce dostępu:**
- ✅ Pobierz wszystkie notatki użytkownika: `Query(userId = X)`
- ✅ Pobierz konkretną notatkę: `GetItem(userId = X, noteId = Y)`
- ✅ Usuń notatkę: `DeleteItem(userId = X, noteId = Y)`
- ✅ Aktualizuj notatkę: `UpdateItem(userId = X, noteId = Y)`

### Indeksy

**Obecnie w projekcie nie ma Global Secondary Index (GSI)**, ponieważ obecna struktura kluczy głównych (Composite Key) już zapewnia efektywny dostęp do danych.

#### Potencjalne GSI (jeśli byłyby potrzebne):

Gdyby w przyszłości były potrzebne dodatkowe wzorce dostępu, można dodać:

**1. GSI: `createdAtIndex`**
```hcl
# Terraform config (przykład)
global_secondary_index {
  name               = "createdAtIndex"
  hash_key           = "userId"
  range_key          = "createdAt"
  projection_type    = "ALL"
  read_capacity      = 5
  write_capacity     = 5
}
```
- **Klucz partycji (HASH):** `userId`
- **Klucz sortowania (RANGE):** `createdAt`
- **Projekcja:** ALL (wszystkie atrybuty)
- **Cel:** Sortowanie notatek użytkownika po dacie utworzenia
- **Zapytanie:** `Query(userId = X) ORDER BY createdAt DESC`

**2. GSI: `titleSearchIndex`**
```hcl
global_secondary_index {
  name               = "titleSearchIndex"
  hash_key           = "userId"
  range_key          = "title"
  projection_type    = "KEYS_ONLY"
  read_capacity      = 5
  write_capacity     = 5
}
```
- **Cel:** Wyszukiwanie notatek po tytule (begins_with)
- **Projekcja:** KEYS_ONLY (tylko klucze, mniejsze zużycie storage)

### Konfiguracja Tabeli

**Billing Mode:** `PAY_PER_REQUEST` (On-Demand)
- Automatyczne skalowanie
- Płatność za rzeczywiste użycie
- Brak konieczności przewidywania RCU/WCU

**Alternatywnie - PROVISIONED:**
- Read Capacity Units (RCU): 5
- Write Capacity Units (WCU): 5

**Dodatkowe Funkcje:**
- ✅ **Point-in-time Recovery:** Włączone (backup)
- ✅ **Encryption at Rest:** AWS Managed Keys
- ✅ **DynamoDB Streams:** Włączone (`NEW_AND_OLD_IMAGES`)
- ✅ **CloudWatch Metrics:** Automatyczne monitorowanie

### Operacje DynamoDB w Lambdach

**get_notes:** `Query`
```typescript
QueryCommand({
  TableName: NOTES_TABLE_NAME,
  KeyConditionExpression: 'userId = :userId',
  ExpressionAttributeValues: {
    ':userId': userId
  }
})
```

**add_note:** `PutItem`
```typescript
PutCommand({
  TableName: NOTES_TABLE_NAME,
  Item: note
})
```

**update_note:** `GetItem` → `UpdateItem`
```typescript
GetItemCommand({ /* weryfikacja właściciela */ })
UpdateItemCommand({ /* aktualizacja */ })
```

**delete_note:** `GetItem` → `DeleteItem`
```typescript
GetItemCommand({ /* weryfikacja właściciela */ })
DeleteItemCommand({ /* usunięcie */ })
```

## ⚡ Funkcje Lambda

### Konfiguracja Wspólna

| Parametr | Wartość |
|----------|---------|
| **Runtime** | Node.js 20.x |
| **Timeout** | 30 sekund |
| **Memory** | 256 MB |
| **Tracing** | AWS X-Ray (Active) |
| **Log Format** | JSON |

### Lambda Layers

Każda funkcja Lambda używa dwóch warstw (layers):

#### 1. **telemetry-layer**
- Middleware do obsługi requestów
- Standaryzowane odpowiedzi HTTP
- Strukturyzowane logowanie
- Error handling

#### 2. **dynamodb-layer**
- Helper functions dla DynamoDB
- Document Client setup
- Typowanie TypeScript dla operacji DB

### Funkcje

#### 1. **add_note**
- **Endpoint:** `POST /notes/add`
- **Uprawnienia IAM:**
  - `dynamodb:PutItem` na tabeli notes
- **Zmienne środowiskowe:**
  - `NOTES_TABLE_NAME`
  - `COGNITO_USER_POOL_ID`
- **Walidacja:**
  - `title` - wymagane
  - `content` - opcjonalne
- **Proces:**
  1. Weryfikacja tokenu Cognito (automatyczna przez Authorizer)
  2. Parsowanie body
  3. Walidacja danych wejściowych
  4. Generowanie UUID dla noteId
  5. Utworzenie timestampów
  6. Zapis do DynamoDB
  7. Zwrócenie utworzonej notatki

#### 2. **get_notes**
- **Endpoint:** `GET /notes/get`
- **Uprawnienia IAM:**
  - `dynamodb:Query` na tabeli notes
- **Zmienne środowiskowe:**
  - `NOTES_TABLE_NAME`
- **Proces:**
  1. Pobranie userId z tokenu Cognito
  2. Query DynamoDB po userId
  3. Zwrócenie listy notatek i liczby

#### 3. **update_note**
- **Endpoint:** `PUT /notes/update`
- **Uprawnienia IAM:**
  - `dynamodb:GetItem` - weryfikacja właściciela
  - `dynamodb:UpdateItem` - aktualizacja
- **Zmienne środowiskowe:**
  - `NOTES_TABLE_NAME`
- **Walidacja:**
  - Notatka musi należeć do zalogowanego użytkownika
- **Proces:**
  1. Weryfikacja właściciela notatki (GetItem)
  2. Walidacja uprawnień
  3. Aktualizacja notatki
  4. Update timestamp `updatedAt`
  5. Zwrócenie zaktualizowanej notatki

#### 4. **delete_note**
- **Endpoint:** `DELETE /notes/delete`
- **Uprawnienia IAM:**
  - `dynamodb:GetItem` - weryfikacja właściciela
  - `dynamodb:DeleteItem` - usunięcie
- **Zmienne środowiskowe:**
  - `NOTES_TABLE_NAME`
- **Walidacja:**
  - Notatka musi należeć do zalogowanego użytkownika
- **Proces:**
  1. Weryfikacja właściciela notatki
  2. Usunięcie z DynamoDB
  3. Potwierdzenie usunięcia

## 🚀 Jak Uruchomić Projekt

### Wymagania Wstępne

- **Node.js** 18+ (zalecane 20.x)
- **Yarn** lub npm
- **AWS CLI** skonfigurowane (`aws configure`)
- **Terraform** 1.0+
- **Konto AWS** z uprawnieniami administratora

### Krok 1: Budowanie Kodu Lambda

```bash
cd src

# Instalacja zależności
yarn install
# lub
npm install

# Build funkcji Lambda (kompilacja TypeScript)
node build.js
```

To utworzy folder `src/dist/lambdas/` z skompilowanym kodem.

### Krok 2: Wdrożenie Infrastruktury AWS

```bash
cd terraform

# Inicjalizacja Terraform (pierwszorazowo)
terraform init

# Wybór/utworzenie workspace (dev/staging/prod)
terraform workspace new dev
# lub
terraform workspace select dev

# Podgląd zmian (plan)
terraform plan -out=tfplan

# Wdrożenie infrastruktury
terraform apply tfplan
```

**Terraform utworzy:**
- DynamoDB table: `dev-notes-app-notes`
- 4 funkcje Lambda (add_note, get_notes, update_note, delete_note)
- 2 Lambda Layers (telemetry, dynamodb)
- API Gateway REST API
- Cognito User Pool i App Client
- CloudWatch Log Groups
- IAM Roles i Policies

**Czas wdrożenia:** ~2-3 minuty

### Krok 3: Pobranie Konfiguracji dla Frontend

```bash
cd ../front-end

# Automatyczne wygenerowanie .env.local z Terraform outputs
./generate-env.sh
```

To utworzy plik `.env.local` z:
```env
NEXT_PUBLIC_COGNITO_USER_POOL_ID=eu-central-1_xxxxxxxxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_REGION=eu-central-1
NEXT_PUBLIC_API_GATEWAY_URL=https://xxxxxxxxxx.execute-api.eu-central-1.amazonaws.com/dev
```

### Krok 4: Instalacja i Uruchomienie Frontend

```bash
cd front-end

# Instalacja zależności
yarn install
# lub
npm install

# Uruchomienie w trybie developerskim
yarn dev
# lub
npm run dev
```

**Aplikacja będzie dostępna na:** http://localhost:3000

### Krok 5: Rejestracja Użytkownika

1. Otwórz http://localhost:3000
2. Przejdź do `/auth/register`
3. Zarejestruj konto email/hasło
4. Potwierdź email (kod weryfikacyjny)
5. Zaloguj się

## 🌍 Porty i Adresy

### Lokalne (Development)

| Serwis | Port | URL |
|--------|------|-----|
| **Next.js Frontend** | 3000 | http://localhost:3000 |
| **Next.js Build** | 3000 | (po `yarn start`) |

### AWS (Cloud)

| Serwis | Endpoint | Format |
|--------|----------|--------|
| **API Gateway** | HTTPS | `https://{api-id}.execute-api.{region}.amazonaws.com/{stage}` |
| **Cognito** | HTTPS | `https://cognito-idp.{region}.amazonaws.com` |
| **DynamoDB** | Internal | (dostęp tylko przez AWS SDK) |
| **Lambda** | Internal | (wywoływane przez API Gateway) |

**Przykład API URL:**
```
https://abc123xyz.execute-api.eu-central-1.amazonaws.com/dev/notes/get
```

## ☁️ Serwisy AWS

### 1. AWS Lambda

**Funkcje:**
- `dev-notes-app-add_note`
- `dev-notes-app-get_notes`
- `dev-notes-app-update_note`
- `dev-notes-app-delete_note`

**Konfiguracja:**
- Runtime: Node.js 20.x
- Architecture: x86_64
- Timeout: 30s
- Memory: 256 MB
- Concurrent executions: Unlimited (default)

**Monitoring:**
- CloudWatch Logs: `/aws/lambda/{function-name}`
- X-Ray Tracing: Active
- CloudWatch Metrics: Automatyczne

### 2. AWS DynamoDB

**Tabela:** `dev-notes-app-notes`

**Konfiguracja:**
- Billing: PAY_PER_REQUEST
- Encryption: AWS Managed Keys (SSE)
- Point-in-time Recovery: Enabled
- Streams: NEW_AND_OLD_IMAGES

**Monitoring:**
- CloudWatch Metrics (read/write, throttles, errors)
- Contributor Insights (opcjonalne)

### 3. AWS Cognito

**User Pool:** `dev-notes-app-user-pool`

**Polityka Haseł:**
- Minimalna długość: 8 znaków
- Wymagane: małe litery, wielkie litery, cyfry, znaki specjalne
- Tymczasowe hasło ważne: 7 dni

**Konfiguracja:**
- Logowanie: Email
- Auto-weryfikacja: Email
- MFA: Optional (TOTP)
- Password recovery: Email

**Domain:** `dev-notes-app-auth.auth.{region}.amazoncognito.com`

### 4. AWS API Gateway

**REST API:** `dev-notes-app-api`

**Authorizer:**
- Typ: Cognito User Pool
- Token source: `Authorization` header
- Token validation: Automatyczna

**Stages:**
- `dev` (lub zgodnie z terraform workspace)

**Throttling:**
- Rate: 10,000 requests/second (default AWS)
- Burst: 5,000 requests (default AWS)

**CORS:**
- Origins: `*` (w produkcji: specific domains)
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization

### 5. AWS CloudWatch

**Log Groups:**
- `/aws/lambda/dev-notes-app-add_note`
- `/aws/lambda/dev-notes-app-get_notes`
- `/aws/lambda/dev-notes-app-update_note`
- `/aws/lambda/dev-notes-app-delete_note`
- `/aws/apigateway/dev-notes-app-api`

**Retention:** 7 dni (domyślnie, można zmienić)

### 6. AWS IAM

**Role Lambda:**
- `dev-notes-app-add_note-lambda-role`
- `dev-notes-app-get_notes-lambda-role`
- `dev-notes-app-update_note-lambda-role`
- `dev-notes-app-delete_note-lambda-role`

**Polityki:**
- AWSLambdaBasicExecutionRole (CloudWatch Logs)
- AWSXRayDaemonWriteAccess (X-Ray)
- Custom policy dla DynamoDB (specificzne dla każdej funkcji)

## 💻 Środowisko Developerskie

### Struktura Workspace Terraform

```bash
# Lista workspace
terraform workspace list

# Przełączanie workspace
terraform workspace select dev
terraform workspace select staging
terraform workspace select prod

# Tworzenie nowego workspace
terraform workspace new test
```

**Konwencja nazewnictwa:**
- Workspace = Environment (dev, staging, prod)
- Resources: `{workspace}-{project}-{resource}`
- Przykład: `dev-notes-app-notes`

### Skrypty Pomocnicze (front-end/)

| Skrypt | Opis |
|--------|------|
| `generate-env.sh` | Generuje `.env.local` z Terraform outputs |

### Zmienne Środowiskowe

**Backend (Lambda):**
```bash
NOTES_TABLE_NAME=dev-notes-app-notes
COGNITO_USER_POOL_ID=eu-central-1_xxxxxxxxx
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_COGNITO_USER_POOL_ID=eu-central-1_xxxxxxxxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_REGION=eu-central-1
NEXT_PUBLIC_API_GATEWAY_URL=https://xxx.execute-api.eu-central-1.amazonaws.com/dev
```

## 🐛 Debugging i Troubleshooting

### Logi CloudWatch

```bash
# Tail logs w czasie rzeczywistym
aws logs tail /aws/lambda/dev-notes-app-get_notes --follow

# Logi z ostatnich 10 minut
aws logs tail /aws/lambda/dev-notes-app-add_note --since 10m

# Filtrowanie błędów
aws logs tail /aws/lambda/dev-notes-app-get_notes --filter-pattern "ERROR"
```

### Test API z curl

```bash
# Najpierw zdobądź token JWT z Cognito (po zalogowaniu)
TOKEN="eyJraWQiOiI..."

# Test GET
curl -H "Authorization: Bearer $TOKEN" \
  https://xxx.execute-api.eu-central-1.amazonaws.com/dev/notes/get

# Test POST
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Hello"}' \
  https://xxx.execute-api.eu-central-1.amazonaws.com/dev/notes/add
```

### Problemy i Rozwiązania

**Problem:** "Unauthorized" przy wywołaniu API
```bash
# Sprawdź zmienne środowiskowe w .env.local
cat front-end/.env.local

# Sprawdź czy token jest ważny
# Token JWT wygasa po 1 godzinie

# Zweryfikuj konfigurację Cognito w AWS Console
```

**Problem:** Lambda timeout
```bash
# Sprawdź logi
aws logs tail /aws/lambda/{function-name} --since 5m

# Zwiększ timeout w Terraform (modules/lambda/vars.tf)
# Default: 30s, Max: 900s (15 min)
```

**Problem:** DynamoDB throttling
```bash
# Zmień billing mode na PROVISIONED z wyższymi RCU/WCU
# lub pozostaw PAY_PER_REQUEST (automatyczne skalowanie)
```

### Debug Mode Frontend

```bash
cd front-end

# Start z debug logs
DEBUG=* yarn dev

# lub z dodatkowymi Next.js debug logs
NODE_OPTIONS='--inspect' yarn dev
```

## 🔒 Bezpieczeństwo

### Implementowane Mechanizmy

✅ **Autoryzacja:**
- Wszystkie endpointy wymagają JWT token z Cognito
- API Gateway Authorizer weryfikuje token przed wywołaniem Lambda
- `userId` jest pobierany z zweryfikowanego tokenu (claim `sub`)

✅ **Weryfikacja Właściciela:**
- Update/Delete sprawdzają czy notatka należy do użytkownika
- Brak możliwości modyfikacji cudzych notatek

✅ **Szyfrowanie:**
- DynamoDB: Encryption at Rest (AWS Managed Keys)
- API Gateway: HTTPS only
- Cognito: Secure token exchange

✅ **Walidacja:**
- Input validation w Lambdach
- TypeScript type safety
- Zod schemas w frontend

✅ **CORS:**
- Skonfigurowane tylko dla zaufanych origin
- W produkcji: specific domains zamiast `*`

✅ **IAM Least Privilege:**
- Każda Lambda ma tylko niezbędne uprawnienia
- Separate roles per function
- No wildcard permissions

### Best Practices

🔐 **Hasła Cognito:**
- Min. 8 znaków, mixed case, cyfry, znaki specjalne
- Można włączyć MFA dla dodatkowego bezpieczeństwa

🔐 **Secrets Management:**
- Nigdy nie commituj `.env.local`
- Używaj AWS Secrets Manager dla production secrets

🔐 **Monitoring:**
- CloudWatch Alarms dla nietypowej aktywności
- X-Ray dla tracing requests
- CloudTrail dla audit logs

## 📚 Dodatkowa Dokumentacja

W katalogu `front-end/` znajduje się README z opisem konfiguracji aplikacji React/Next.js.

## 📝 Notatki Developerskie

**Project Name:** `notes-app`  
**Default Workspace:** `dev`  
**AWS Region:** `eu-central-1` (lub zgodnie z konfiguracją)  
**Created:** Grudzień 2025

### Terraform State

Backend configuration w `terraform/backend.tf` - upewnij się, że masz skonfigurowany S3 bucket dla state files.

### Costs Estimation

W trybie PAY_PER_REQUEST z niskim ruchem:
- DynamoDB: ~$0.01/dzień
- Lambda: Free tier (1M requestów/miesiąc)
- API Gateway: Free tier (1M wywołań/miesiąc)
- Cognito: Free tier (50k MAU)

**Szacowany koszt miesięczny:** < $5 dla development
