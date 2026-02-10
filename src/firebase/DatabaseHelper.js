// package src/firebase
import { getFirestore, collection, doc, getDoc, deleteDoc, query, orderBy } from "firebase/firestore";

export const NoteQuery = Object.freeze({
  BY_TITLE: "BY_TITLE",
  BY_DATE_TIME: "BY_DATE_TIME",
});

export class DatabaseHelper {
  static _notesRef = null;

  static setNotesCollection(uid) {
    this._notesRef = collection(getFirestore(), `users/${uid}/notes`);
  }

  static get notesRef() {
    if (!this._notesRef) {
      throw new Error("Notes reference not initialized. Call setNotesCollection(uid) first.");
    }
    return this._notesRef;
  }

  static getNotesQuery(noteQuery) {
    switch (noteQuery) {
      case NoteQuery.BY_TITLE:
        return query(this.notesRef, orderBy("title"));
      case NoteQuery.BY_DATE_TIME:
        return query(this.notesRef, orderBy("dateTime"));
      default:
        return this.notesRef;
    }
  }

  static async deleteNoteById(noteId) {
    const noteDocRef = doc(this.notesRef, noteId);
    await deleteDoc(noteDocRef);
  }

  static async getNoteSnapshot(noteId) {
    const noteDocRef = doc(this.notesRef, noteId);
    const snapshot = await getDoc(noteDocRef);
    return snapshot;
  }
}