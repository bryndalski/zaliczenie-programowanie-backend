# Notes Dashboard

Kompletny dashboard do zarządzania notatkami z pełnymi funkcjonalnościami CRUD.

## Funkcjonalności

### ✅ Tworzenie notatek
- Modal z formularzem
- Walidacja wymaganych pól
- Obsługa błędów
- Loading states

### ✅ Wyświetlanie notatek
- Grid layout (responsywny)
- Karty z informacjami o notatkach
- Daty utworzenia i modyfikacji
- Stan pustej listy (empty state)
- Stan ładowania

### ✅ Edycja notatek
- Modal z pre-wypełnionym formularzem
- Aktualizacja tylko zmienionych pól
- Walidacja
- Optymistyczna aktualizacja UI

### ✅ Usuwanie notatek
- Modal potwierdzenia
- Ochrona przed przypadkowym usunięciem
- Natychmiastowa aktualizacja UI

### ✅ Dodatkowe funkcje
- Odświeżanie listy notatek
- Licznik notatek
- Obsługa błędów API
- Loading states dla wszystkich operacji
- Wylogowanie

## Komponenty

### `useNotes` Hook
Custom hook zarządzający stanem notatek i komunikacją z API.

**Zwraca:**
- `notes`: lista notatek
- `loading`: stan ładowania
- `error`: komunikat błędu
- `actionLoading`: stan ładowania akcji (create/update/delete)
- `fetchNotes()`: odświeżenie listy
- `addNote(input)`: dodanie notatki
- `updateNote(noteId, input)`: aktualizacja notatki
- `deleteNote(noteId)`: usunięcie notatki

### `NoteCard`
Komponent wyświetlający pojedynczą notatkę.

**Props:**
- `note`: obiekt notatki
- `onEdit`: callback edycji
- `onDelete`: callback usunięcia

### `CreateNoteModal`
Modal do tworzenia nowych notatek.

**Props:**
- `isOpen`: czy modal jest otwarty
- `onClose`: callback zamknięcia
- `onSubmit`: callback wysłania formularza

### `EditNoteModal`
Modal do edycji istniejących notatek.

**Props:**
- `isOpen`: czy modal jest otwarty
- `note`: edytowana notatka
- `onClose`: callback zamknięcia
- `onSubmit`: callback aktualizacji

### `DeleteConfirmModal`
Modal potwierdzenia usunięcia.

**Props:**
- `isOpen`: czy modal jest otwarty
- `noteTitle`: tytuł usuwanej notatki
- `onConfirm`: callback potwierdzenia
- `onCancel`: callback anulowania
- `loading`: stan ładowania

## API Endpoints

Wszystkie endpointy wymagają autoryzacji (Bearer token z AWS Cognito).

### `GET /notes/get`
Pobiera listę notatek użytkownika.

**Response:**
```json
{
  "notes": [
    {
      "userId": "string",
      "noteId": "string",
      "title": "string",
      "content": "string",
      "createdAt": "ISO-8601",
      "updatedAt": "ISO-8601"
    }
  ],
  "count": number
}
```

### `POST /notes/add`
Tworzy nową notatkę.

**Request:**
```json
{
  "title": "string",
  "content": "string"
}
```

**Response:**
```json
{
  "note": {
    "userId": "string",
    "noteId": "string",
    "title": "string",
    "content": "string",
    "createdAt": "ISO-8601",
    "updatedAt": "ISO-8601"
  }
}
```

### `PUT /notes/update?noteId={id}`
Aktualizuje istniejącą notatkę.

**Request:**
```json
{
  "title": "string (optional)",
  "content": "string (optional)"
}
```

**Response:**
```json
{
  "message": "Note updated successfully",
  "note": {
    "userId": "string",
    "noteId": "string",
    "title": "string",
    "content": "string",
    "createdAt": "ISO-8601",
    "updatedAt": "ISO-8601"
  }
}
```

### `DELETE /notes/delete?noteId={id}`
Usuwa notatkę.

**Response:** 204 No Content

## Technologie

- **React 19** - UI framework
- **Next.js 16** - App Router
- **TypeScript** - type safety
- **Tailwind CSS** - styling
- **AWS Amplify** - autentykacja
- **Lucide React** - ikony

## Struktura plików

```
src/
├── app/
│   └── dashboard/
│       └── page.tsx          # Główna strona dashboardu
├── components/
│   └── notes/
│       ├── index.ts          # Exports
│       ├── NoteCard.tsx      # Karta notatki
│       ├── CreateNoteModal.tsx
│       ├── EditNoteModal.tsx
│       └── DeleteConfirmModal.tsx
├── hooks/
│   └── useNotes.ts           # Hook zarządzający notatkami
└── types/
    └── auth.ts               # Typy auth (User, etc.)
```

## Użycie

Dashboard jest dostępny po zalogowaniu na ścieżce `/dashboard`.

Wszystkie operacje są zabezpieczone przez middleware Next.js, który sprawdza czy użytkownik jest zalogowany (sesja w cookies).

