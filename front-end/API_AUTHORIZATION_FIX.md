# API Authorization Fix - Front-end nie wysyła Bearer Token

## 🎯 Problem
Front-end aplikacji nie wysyła tokenu Bearer w headerze Authorization, co powoduje błąd 401 Unauthorized z API.

## 🔍 Główne przyczyny

### 1. **Token nie jest dostępny po logowaniu**
- Amplify nie został właściwie skonfigurowany
- Sesja użytkownika nie jest w pełni utworzona
- Problem z localStorage lub session storage

### 2. **Token jest pobrany, ale nie jest wysyłany**
- Błąd w funkcji `getAuthHeader()`
- Timing issues - request wysyłany zanim token jest gotowy
- Błędna implementacja fetch requests

### 3. **Token jest wysyłany, ale w złym formacie**
- Używany access token zamiast ID token
- Niepoprawny format Authorization header
- Problem z encoding tokenu

## ✅ Rozwiązania krok po kroku

### Krok 1: Sprawdź podstawową konfigurację
```bash
cd front-end
./check-env.sh
```

### Krok 2: Uruchom pełną naprawę
```bash
./fix-auth.sh
```

### Krok 3: Test z debuggerem
1. Start aplikacji: `npm run dev`
2. Otwórz http://localhost:3000
3. Zaloguj się 
4. Użyj AuthDebugger widget (prawy dolny róg)
5. Sprawdź console logs

### Krok 4: Sprawdź specyficzne problemy

#### A. Brak tokenu w localStorage
```javascript
// W browser console:
Object.keys(localStorage).filter(key => key.includes('Cognito'))
```

Jeśli puste:
1. Wyloguj się i wyczyść localStorage
2. Zaloguj ponownie
3. Sprawdź ponownie

#### B. Token jest, ale wygasły
```javascript
// W browser console sprawdź datę wygaśnięcia
const token = localStorage.getItem('...idToken...')
const payload = JSON.parse(atob(token.split('.')[1]))
new Date(payload.exp * 1000) // Data wygaśnięcia
```

#### C. Request nie zawiera Authorization header
1. Otwórz Developer Tools → Network
2. Wykonaj żądanie do API
3. Sprawdź Request Headers
4. Sprawdź czy jest `Authorization: Bearer ...`

## 🔧 Zaawansowane debugowanie

### Sprawdź middleware w Lambda
```bash
aws logs tail /aws/lambda/default-notes-app-get_notes --follow
```

### Test bezpośrednio z tokenem
```bash
# Pobierz token z browser console i test:
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://io3jsoifpi.execute-api.eu-central-1.amazonaws.com/default/notes/get"
```

### Sprawdź API Gateway logs
```bash
aws logs tail API-Gateway-Execution-Logs --follow
```

## 🛠️ Najczęstsze naprawy

### 1. Restart całej sesji
```javascript
// W browser console:
localStorage.clear()
sessionStorage.clear()
// Następnie odśwież stronę i zaloguj ponownie
```

### 2. Force refresh sesji
```javascript
// W komponencie React:
const session = await fetchAuthSession({ forceRefresh: true })
```

### 3. Sprawdź timing
Upewnij się że request jest wysyłany dopiero po pełnej inicjalizacji Amplify:
```javascript
// Poczekaj na konfigurację
await new Promise(resolve => setTimeout(resolve, 1000))
const headers = await getAuthHeader()
```

## 📋 Checklist diagnostyczny

- [ ] Environment variables są poprawnie ustawione
- [ ] API odpowiada 401/403 bez autoryzacji  
- [ ] CORS jest poprawnie skonfigurowany
- [ ] Amplify jest skonfigurowany w AuthContext
- [ ] Użytkownik może się zalogować bez błędów
- [ ] localStorage zawiera tokeny Cognito po logowaniu
- [ ] AuthDebugger pokazuje poprawne dane
- [ ] Network tab pokazuje Authorization header w requestach

## 🚨 Jeśli nic nie pomaga

1. **Sprawdź backend**:
   ```bash
   cd terraform
   terraform plan
   # Sprawdź czy authorizer_id jest poprawnie skonfigurowany
   ```

2. **Przebuduj infrastructure**:
   ```bash
   terraform destroy -auto-approve
   terraform apply -auto-approve
   ```

3. **Sprawdź User Pool w AWS Console**:
   - Czy User Pool istnieje
   - Czy App Client ma poprawne ustawienia
   - Czy domeny są poprawnie skonfigurowane

4. **Test z nowym użytkownikiem**:
   - Stwórz nowego użytkownika
   - Przetestuj cały flow od początku

## 📞 Support

Jeśli problem nadal występuje, zbierz:
1. Output z `./check-env.sh`
2. Output z `./fix-auth.sh` 
3. Screenshots z Network tab
4. Browser console logs
5. `terraform output`

---

**Ostatnia aktualizacja:** $(date '+%Y-%m-%d %H:%M:%S')
