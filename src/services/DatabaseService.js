package src/services/DatabaseService.js
import { getFirestore, collection, doc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Note from "../models/Note";
import { toast } from "react-toastify";

/**
 * DatabaseService provides static-like CRUD operations for notes.
 * Ensure Firebase is initialized before importing this module.
 */
class DatabaseService {
  static user = null;
  static notesRef = null;
  static notes = null;

  static init() {
    const auth = getAuth();
    this.user = auth.currentUser;
    const db = getFirestore();
    if (this.user) {
      const uid = this.user.uid;
      const notesCollection = collection(db, `users/${uid}/notes`);
      const noteConverter = {
        toFirestore: (note) => note.toJson(),
        fromFirestore: (snap) => Note.fromJson(snap.data()),
      };
      this.notesRef = notesCollection.withConverter(noteConverter);
      this.notes = this.notesRef;
    }
  }

  static updateNoteref(uid) {
    const db = getFirestore();
    const notesCollection = collection(db, `users/${uid}/notes`);
    const noteConverter = {
      toFirestore: (note) => note.toJson(),
      fromFirestore: (snap) => Note.fromJson(snap.data()),
    };
    this.notesRef = notesCollection.withConverter(noteConverter);
    this.notes = this.notesRef;
  }

  static addNote(note) {
    addDoc(this.notesRef, note)
      .then(() => {
        toast.success("Note Added");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  static deleteNoteById(id) {
    const docRef = doc(this.notesRef, id);
    deleteDoc(docRef)
      .then(() => {
        console.log("Note Deleted");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  static updateNoteById(id, note) {
    const docRef = doc(this.notesRef, id);
    updateDoc(docRef, { title: note.title })
      .then(() => {
        console.log("Note Updated");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // static fetchNotes() {
  //   // Placeholder for future implementation
  // }
}

// Initialize static fields on module load
DatabaseService.init();

export default DatabaseService;