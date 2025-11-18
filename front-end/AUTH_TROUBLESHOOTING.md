# Rozwiązywanie problemów z autentykacją

## Problem: "There is already a signed in user"

Ten błąd występuje, gdy AWS Amplify ma zapamiętane dane sesji w localStorage, ale nie są one już ważne.

### Rozwiązanie 1: Automatyczne (Zalecane)

1. Spróbuj się zalogować ponownie
2. Jeśli zobaczysz błąd "already a signed in user", kliknij przycisk **"Clear session and retry"** w komunikacie błędu
3. Aplikacja automatycznie wyczyści sesję i przekieruje do logowania

### Rozwiązanie 2: Ręczne czyszczenie przez Debug Page

1. Przejdź do `/auth/debug`
2. Kliknij przycisk **"Force Sign Out & Clear All"**
3. Zostaniesz przekierowany do strony logowania ze świeżą sesją

### Rozwiązanie 3: Manualnie przez Console

1. Otwórz Developer Tools (F12)
2. Przejdź do zakładki **Console**
3. Wpisz i wykonaj:
   ```javascript
   localStorage.clear()
   sessionStorage.clear()
   location.reload()
   ```

## Problem: Nie mogę otworzyć dashboardu

### Diagnoza

1. Przejdź do `/auth/debug`
2. Sprawdź "Current Auth State"
3. Kliknij "Log Auth State to Console" i sprawdź browser console

### Możliwe przyczyny:

#### 1. Nie jesteś zalogowany
- **Symptom:** Status pokazuje "Not Authenticated"
- **Rozwiązanie:** Przejdź do `/auth/login` i zaloguj się

#### 2. Sesja wygasła
- **Symptom:** Token w localStorage istnieje, ale jest nieważny
- **Rozwiązanie:** Użyj "Force Sign Out & Clear All" w `/auth/debug`

#### 3. Problem z ProtectedRoute
- **Symptom:** Widzisz loader, ale jesteś przekierowywany do login
- **Rozwiązanie:** 
  1. Sprawdź czy AuthContext prawidłowo inicjalizuje Amplify
  2. Sprawdź console na błędy
  3. Spróbuj wyczyścić cache i zalogować się ponownie

## Dlaczego to się dzieje?

AWS Amplify przechowuje tokeny w **localStorage** (client-side), nie w httpOnly cookies. To oznacza:

- ✅ Łatwa integracja z AWS Cognito
- ✅ Działa w aplikacjach SPA
- ⚠️ Tokeny mogą się "zawieszać" po błędach
- ⚠️ Wymaga ręcznego czyszczenia przy problemach

## Ulepszenia w kodzie

### useAuthActions - Automatyczne wylogowanie przed logowaniem

```typescript
const handleLogin = async (credentials: LoginCredentials) => {
  try {
    // Check if user is already signed in and sign out first
    try {
      await getCurrentUser();
      console.log('User already signed in, signing out first...');
      await signOut();
    } catch {
      // User is not signed in, continue with login
    }
    
    await signIn({
      username: credentials.email,
      password: credentials.password,
    });
    
    await refreshAuth();
    return true;
  } catch (err) {
    // handle error
  }
};
```

### Middleware - Wyłączony

Middleware Next.js został **tymczasowo wyłączony**, ponieważ nie ma dostępu do tokenów w localStorage. 
Ochrona tras jest realizowana przez komponent `ProtectedRoute`.

W przyszłości można zaimplementować:
- Server-side sessions w httpOnly cookies
- Token refresh w middleware
- API routes dla auth operations

## Przydatne narzędzia

### Debug Page: `/auth/debug`
Strona z narzędziami diagnostycznymi:
- Podgląd stanu autentykacji
- Log auth state do console
- Clear auth cache
- Force sign out

### Auth Utils Library: `@/lib/auth-utils`
```typescript
import { 
  clearAmplifyAuthCache,  // Czyści localStorage
  debugAuthState,          // Loguje auth state
  forceSignOut             // Wylogowanie + clear + redirect
} from '@/lib/auth-utils';
```

## Zalecenia

1. **Przy problemach z logowaniem:** Użyj przycisku "Clear session and retry"
2. **Regularnie:** Jeśli widzisz dziwne zachowanie auth, odwiedź `/auth/debug`
3. **Development:** Trzymaj otwarte DevTools Console, aby widzieć logi Amplify
4. **Production:** Rozważ migrację do server-side sessions dla lepszego bezpieczeństwa

## FAQ

**Q: Czy muszę się wylogowywać przed zamknięciem przeglądarki?**
A: Nie, tokeny są w localStorage i przetrwają restart przeglądarki.

**Q: Jak długo trwa sesja?**
A: Access token: 60 minut, Refresh token: 30 dni (konfiguracja w Cognito)

**Q: Czy mogę być zalogowany na wielu urządzeniach?**
A: Tak, każde urządzenie ma własny token w localStorage.

**Q: Co się stanie jeśli wyczyść localStorage?**
A: Zostaniesz wylogowany i będziesz musiał zalogować się ponownie.

