import { randomUUID } from 'crypto';

/**
 * Note entity interface
 */
export interface Note {
  userId: string;
  noteId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input for creating a new note
 */
export interface CreateNoteInput {
  title: string;
  content: string;
}

/**
 * Input for updating an existing note
 */
export interface UpdateNoteInput {
  title?: string;
  content?: string;
}

/**
 * Note entity class with validation and factory methods
 */
export class NoteEntity {
  private data: Note;

  constructor(data: Note) {
    this.data = data;
  }

  /**
   * Create a new note
   */
  static create(userId: string, input: CreateNoteInput): NoteEntity {
    NoteEntity.validateCreateInput(input);

    const timestamp = new Date().toISOString();
    const note: Note = {
      userId,
      noteId: randomUUID(),
      title: input.title.trim(),
      content: input.content.trim(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return new NoteEntity(note);
  }

  /**
   * Create from existing data (e.g., from database)
   */
  static fromData(data: Note): NoteEntity {
    return new NoteEntity(data);
  }

  /**
   * Update the note
   */
  update(input: UpdateNoteInput): void {
    NoteEntity.validateUpdateInput(input);

    if (input.title !== undefined) {
      this.data.title = input.title.trim();
    }

    if (input.content !== undefined) {
      this.data.content = input.content.trim();
    }

    this.data.updatedAt = new Date().toISOString();
  }

  /**
   * Validate create input
   */
  private static validateCreateInput(input: CreateNoteInput): void {
    if (!input) {
      throw new Error('Note input is required');
    }

    if (!input.title || typeof input.title !== 'string' || input.title.trim().length === 0) {
      throw new Error('Title is required and must be a non-empty string');
    }

    if (!input.content || typeof input.content !== 'string' || input.content.trim().length === 0) {
      throw new Error('Content is required and must be a non-empty string');
    }

    if (input.title.length > 200) {
      throw new Error('Title must not exceed 200 characters');
    }

    if (input.content.length > 10000) {
      throw new Error('Content must not exceed 10,000 characters');
    }
  }

  /**
   * Validate update input
   */
  private static validateUpdateInput(input: UpdateNoteInput): void {
    if (!input) {
      throw new Error('Update input is required');
    }

    if (!input.title && !input.content) {
      throw new Error('At least one field (title or content) must be provided');
    }

    if (input.title !== undefined) {
      if (typeof input.title !== 'string' || input.title.trim().length === 0) {
        throw new Error('Title must be a non-empty string');
      }
      if (input.title.length > 200) {
        throw new Error('Title must not exceed 200 characters');
      }
    }

    if (input.content !== undefined) {
      if (typeof input.content !== 'string' || input.content.trim().length === 0) {
        throw new Error('Content must be a non-empty string');
      }
      if (input.content.length > 10000) {
        throw new Error('Content must not exceed 10,000 characters');
      }
    }
  }

  /**
   * Get the note data
   */
  toJSON(): Note {
    return { ...this.data };
  }

  /**
   * Get primary key for DynamoDB
   */
  getPrimaryKey(): { userId: string; noteId: string } {
    return {
      userId: this.data.userId,
      noteId: this.data.noteId,
    };
  }

  /**
   * Get note ID
   */
  get noteId(): string {
    return this.data.noteId;
  }

  /**
   * Get user ID
   */
  get userId(): string {
    return this.data.userId;
  }

  /**
   * Get title
   */
  get title(): string {
    return this.data.title;
  }

  /**
   * Get content
   */
  get content(): string {
    return this.data.content;
  }

  /**
   * Get created date
   */
  get createdAt(): string {
    return this.data.createdAt;
  }

  /**
   * Get updated date
   */
  get updatedAt(): string {
    return this.data.updatedAt;
  }

  /**
   * Check if note belongs to user
   */
  belongsToUser(userId: string): boolean {
    return this.data.userId === userId;
  }
}

