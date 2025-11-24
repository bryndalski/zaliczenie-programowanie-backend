# Dashboard Guide - Notes Application

## 🎯 Przegląd
Dashboard aplikacji Notes umożliwia pełne zarządzanie notatkami z funkcjonalnościami CRUD (Create, Read, Update, Delete).

## 🚀 Pierwsze uruchomienie

### 1. Przygotuj środowisko
```bash
# Wygeneruj poprawny .env.local
./generate-env.sh

# Sprawdź konfigurację
./check-env.sh

# Uruchom z debugowaniem
./start-debug.sh
```

### 2. Zaloguj się
1. Otwórz http://localhost:3000
2. Kliknij "Register" jeśli nie masz konta
3. Podaj email i hasło (min. 8 znaków, wielka/mała litera, cyfra)
4. Potwierdź email jeśli wymagane
5. Zaloguj się

## 📋 Funkcjonalności Dashboard

### ➕ Tworzenie notatek
1. Kliknij przycisk **"New Note"** (niebieski, prawy górny róg)
2. Wprowadź tytuł notatki (wymagane)
3. Wprowadź treść notatki (opcjonalne)
4. Kliknij **"Create Note"**

### 📖 Wyświetlanie notatek
- Wszystkie notatki wyświetlają się w siatce kart
- Każda karta zawiera: tytuł, treść, datę utworzenia/aktualizacji
- Liczba notatek pokazana jest w lewym górnym rogu

### ✏️ Edycja notatek
1. Kliknij ikonę **ołówka** (Edit) na karcie notatki
2. Zmodyfikuj tytuł lub treść
3. Kliknij **"Update Note"**

### 🗑️ Usuwanie notatek
1. Kliknij ikonę **kosza** (Delete) na karcie notatki
2. Potwierdź usunięcie w dialogu
3. Notatka zostanie usunięta bezpowrotnie

### 🔄 Odświeżanie
- Kliknij ikonę **odświeżania** obok tytułu "My Notes"
- Notatki zostaną pobrane z serwera

### 🚪 Wylogowanie
- Kliknij **"Sign Out"** w prawym górnym rogu

## 🔧 Debugowanie

### AuthDebugger Widget
W prawym dolnym rogu znajdziesz widget debugowania:

1. **"Debug Auth"** - sprawdza stan autoryzacji
   - Status użytkownika
   - Obecność tokenów
   - Ważność tokenów

2. **"Test API Call"** - testuje połączenie z API
   - Sprawdza czy tokeny są wysyłane
   - Testuje odpowiedź serwera

### Browser Console
Otwórz Developer Tools (F12) i sprawdź:
- **Console** - logi aplikacji z emoji dla łatwiejszego filtrowania:
  - 🔐 = operacje autoryzacji
  - 📡 = requesty API
  - ✅ = operacje udane
  - ❌ = błędy

- **Network** - sprawdź requesty HTTP:
  - Czy zawierają header `Authorization: Bearer ...`
  - Jakie statusy odpowiedzi otrzymujesz

## 🐛 Rozwiązywanie problemów

### Problem: Nie można zalogować
1. Sprawdź `.env.local`
2. Uruchom `./check-env.sh`
3. Sprawdź console na błędy

### Problem: Brak notatek po zalogowaniu
1. Sprawdź Network tab - czy requesty mają Authorization header
2. Użyj AuthDebugger → "Test API Call"
3. Sprawdź czy API zwraca 200 OK

### Problem: "Unauthorized" error
1. Przeczytaj `API_AUTHORIZATION_FIX.md`
2. Uruchom `./fix-auth.sh`
3. Wyloguj się i zaloguj ponownie

### Problem: Aplikacja się zawiesza
1. Wyczyść localStorage: `localStorage.clear()`
2. Odśwież stronę
3. Zaloguj ponownie

## 📊 Struktura danych

### Notatka (Note)
```typescript
{
  userId: string;      // ID użytkownika (automatyczne)
  noteId: string;      // Unikalny ID notatki (automatyczne)
  title: string;       // Tytuł notatki (wymagane)
  content: string;     // Treść notatki (opcjonalne)
  createdAt: string;   // Data utworzenia (automatyczne)
  updatedAt: string;   // Data aktualizacji (automatyczne)
}
```

## 🔒 Bezpieczeństwo

### Autoryzacja
- Wszystkie operacje wymagają logowania
- Każdy użytkownik widzi tylko swoje notatki
- Tokeny JWT są automatycznie dołączane do requestów

### Walidacja
- Tytuł notatki jest wymagany
- Maksymalna długość tytułu: 100 znaków
- Treść jest opcjonalna

## 🛠️ Technologie

### Frontend
- **Next.js 16** - framework React
- **Tailwind CSS** - stylowanie
- **AWS Amplify** - autoryzacja
- **TypeScript** - typowanie

### Backend
- **AWS Lambda** - funkcje serverless
- **API Gateway** - REST API
- **DynamoDB** - baza danych NoSQL
- **Cognito** - zarządzanie użytkownikami

## 📞 Pomoc

Jeśli masz problemy:

1. **Sprawdź dokumentację**:
   - `AUTH_TROUBLESHOOTING.md` - problemy z logowaniem
   - `API_AUTHORIZATION_FIX.md` - problemy z API

2. **Użyj narzędzi debugowania**:
   - `./check-env.sh` - sprawdź środowisko
   - `./fix-auth.sh` - automatyczna naprawa
   - AuthDebugger widget - testowanie w czasie rzeczywistym

3. **Zbierz informacje**:
   - Browser console logs
   - Network tab screenshots
   - Output skryptów diagnostycznych

---

**Miłego korzystania z aplikacji Notes! 📝**
