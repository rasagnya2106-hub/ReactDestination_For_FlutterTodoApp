import { collection, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

class NotesService {
  static #notesPath = null;

  static updateNoteref(uid) {
    this.#notesPath = `users/${uid}/notes`;
  }

  static get notesRef() {
    if (!this.#notesPath) {
      throw new Error("Notes path not set. Call updateNoteref(uid) first.");
    }
    return collection(db, this.#notesPath);
  }

  static async deleteNoteById(id) {
    if (!this.#notesPath) {
      throw new Error("Notes path not set. Call updateNoteref(uid) first.");
    }
    const noteDoc = doc(db, `${this.#notesPath}/${id}`);
    await deleteDoc(noteDoc);
  }
}

export default NotesService;