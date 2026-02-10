package src/services
import { db } from '../firebase';
import { collection, doc, getDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

class Database {
  static uid = null;

  static setUser(uid) {
    this.uid = uid;
  }

  static get notesCollection() {
    if (!this.uid) {
      throw new Error('User UID not set');
    }
    return collection(db, 'users', this.uid, 'notes');
  }

  static queryBy(noteQuery) {
    const colRef = this.notesCollection;
    switch (noteQuery) {
      case 'TITLE_ASC':
        return query(colRef, orderBy('title', 'asc'));
      case 'TITLE_DESC':
        return query(colRef, orderBy('title', 'desc'));
      case 'DATE_ASC':
        return query(colRef, orderBy('dateTime', 'asc'));
      case 'DATE_DESC':
        return query(colRef, orderBy('dateTime', 'desc'));
      default:
        return query(colRef);
    }
  }

  static async deleteNoteById(docId) {
    await deleteDoc(doc(this.notesCollection, docId));
  }

  static async getNoteById(docId) {
    const snapshot = await getDoc(doc(this.notesCollection, docId));
    return snapshot;
  }
}

export default Database;