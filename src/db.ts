import { StudySession, DailyQuestions, ErrorBookItem, SpecialImportanceItem, UserSettings } from './types';

const DB_NAME = 'PrepTrackDB';
const DB_VERSION = 1;

export class PrepTrackDB {
  private static db: IDBDatabase | null = null;

  public static async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error('IndexedDB error:', event);
        reject('Could not open IndexedDB');
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Settings Store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }

        // Study Sessions Store
        if (!db.objectStoreNames.contains('study_sessions')) {
          db.createObjectStore('study_sessions', { keyPath: 'id' });
        }

        // Questions Solved Store
        if (!db.objectStoreNames.contains('questions_solved')) {
          db.createObjectStore('questions_solved', { keyPath: 'date' });
        }

        // Error Book Store
        if (!db.objectStoreNames.contains('error_book')) {
          db.createObjectStore('error_book', { keyPath: 'id' });
        }

        // Special Importance Store
        if (!db.objectStoreNames.contains('special_importance')) {
          db.createObjectStore('special_importance', { keyPath: 'id' });
        }

        // Chapter Completion Store
        if (!db.objectStoreNames.contains('chapter_completion')) {
          db.createObjectStore('chapter_completion', { keyPath: 'id' });
        }
      };
    });
  }

  // --- SETTINGS OPERATIONS ---
  public static async getSettings(): Promise<UserSettings> {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const transaction = db.transaction('settings', 'readonly');
      const store = transaction.objectStore(requestStoreName('settings'));
      const request = store.get('user_settings');

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result);
        } else {
          // Default settings
          const defaults: UserSettings = {
            theme: 'glass',
            pomodoroWorkDuration: 25,
            pomodoroBreakDuration: 5,
            dailyStudyMinutesGoal: 180,
            dailyQuestionsSolvedGoal: 30,
          };
          resolve(defaults);
        }
      };

      request.onerror = () => {
        resolve({
          theme: 'glass',
          pomodoroWorkDuration: 25,
          pomodoroBreakDuration: 5,
          dailyStudyMinutesGoal: 180,
          dailyQuestionsSolvedGoal: 30,
        });
      };
    });
  }

  public static async saveSettings(settings: UserSettings): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('settings', 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.put({ ...settings, id: 'user_settings' });

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Failed to save settings');
    });
  }

  // --- STUDY SESSION OPERATIONS ---
  public static async getStudySessions(): Promise<StudySession[]> {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const transaction = db.transaction('study_sessions', 'readonly');
      const store = transaction.objectStore('study_sessions');
      const request = store.getAll();

      request.onsuccess = () => {
        const sorted = (request.result || []).sort((a, b) => b.startTime - a.startTime);
        resolve(sorted);
      };
      request.onerror = () => resolve([]);
    });
  }

  public static async saveStudySession(session: StudySession): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('study_sessions', 'readwrite');
      const store = transaction.objectStore('study_sessions');
      const request = store.put(session);

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Failed to save study session');
    });
  }

  public static async deleteStudySession(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('study_sessions', 'readwrite');
      const store = transaction.objectStore('study_sessions');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Failed to delete study session');
    });
  }

  // --- QUESTIONS SOLVED OPERATIONS ---
  public static async getQuestionsSolved(): Promise<DailyQuestions[]> {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const transaction = db.transaction('questions_solved', 'readonly');
      const store = transaction.objectStore('questions_solved');
      const request = store.getAll();

      request.onsuccess = () => {
        const sorted = (request.result || []).sort((a, b) => a.date.localeCompare(b.date));
        resolve(sorted);
      };
      request.onerror = () => resolve([]);
    });
  }

  public static async saveQuestionsSolved(record: DailyQuestions): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('questions_solved', 'readwrite');
      const store = transaction.objectStore('questions_solved');
      const request = store.put(record);

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Failed to save questions solved');
    });
  }

  // --- ERROR BOOK OPERATIONS ---
  public static async getErrorBook(): Promise<ErrorBookItem[]> {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const transaction = db.transaction('error_book', 'readonly');
      const store = transaction.objectStore('error_book');
      const request = store.getAll();

      request.onsuccess = () => {
        const sorted = (request.result || []).sort((a, b) => b.timestamp - a.timestamp);
        resolve(sorted);
      };
      request.onerror = () => resolve([]);
    });
  }

  public static async saveErrorBookItem(item: ErrorBookItem): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('error_book', 'readwrite');
      const store = transaction.objectStore('error_book');
      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Failed to save error book item');
    });
  }

  public static async deleteErrorBookItem(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('error_book', 'readwrite');
      const store = transaction.objectStore('error_book');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Failed to delete error book item');
    });
  }

  // --- SPECIAL IMPORTANCE OPERATIONS ---
  public static async getSpecialImportance(): Promise<SpecialImportanceItem[]> {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const transaction = db.transaction('special_importance', 'readonly');
      const store = transaction.objectStore('special_importance');
      const request = store.getAll();

      request.onsuccess = () => {
        const sorted = (request.result || []).sort((a, b) => b.timestamp - a.timestamp);
        resolve(sorted);
      };
      request.onerror = () => resolve([]);
    });
  }

  public static async saveSpecialImportanceItem(item: SpecialImportanceItem): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('special_importance', 'readwrite');
      const store = transaction.objectStore('special_importance');
      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Failed to save special importance item');
    });
  }

  public static async deleteSpecialImportanceItem(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('special_importance', 'readwrite');
      const store = transaction.objectStore('special_importance');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Failed to delete special importance item');
    });
  }

  // --- CHAPTER COMPLETION OPERATIONS ---
  public static async getChapterCompletion(): Promise<Record<string, boolean>> {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const transaction = db.transaction('chapter_completion', 'readonly');
      const store = transaction.objectStore('chapter_completion');
      const request = store.getAll();

      request.onsuccess = () => {
        const result: Record<string, boolean> = {};
        const items = request.result || [];
        items.forEach((item: { id: string; completed: boolean }) => {
          result[item.id] = item.completed;
        });
        resolve(result);
      };
      request.onerror = () => resolve({});
    });
  }

  public static async saveChapterCompletion(id: string, completed: boolean): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('chapter_completion', 'readwrite');
      const store = transaction.objectStore('chapter_completion');
      const request = store.put({ id, completed });

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Failed to save chapter completion');
    });
  }

  public static async clearChapterCompletions(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('chapter_completion', 'readwrite');
      const store = transaction.objectStore('chapter_completion');
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Failed to clear chapters');
    });
  }

  // --- RESET ALL DATA ---
  public static async resetAllData(): Promise<void> {
    const db = await this.getDB();
    db.close();
    this.db = null;

    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => reject('Failed to delete database');
    });
  }
}

function requestStoreName(name: string): string {
  return name;
}
