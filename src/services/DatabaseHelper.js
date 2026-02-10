import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';

class DatabaseHelper {
  static _collectionRef = null;

  static setUser(uid) {
    if (!uid) {
      console.log('Failed to set user: UID is required');
      return;
    }
    const db = getFirestore();
    this._collectionRef = collection(db, `users/${uid}/notes`);
  }

  static clearReference() {
    this._collectionRef = null;
  }

  static listen(callback) {
    if (!this._collectionRef) {
      console.log('Failed to listen: collection reference not set');
      return () => {};
    }
    const unsubscribe = onSnapshot(this._collectionRef, (snapshot) => {
      const notes = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      callback(notes);
    });
    return unsubscribe;
  }

  static async addNote(note, uiCallback) {
    if (!this._collectionRef) {
      console.log('Failed to add note: collection reference not set');
      return;
    }
    try {
      await addDoc(this._collectionRef, note);
      console.log('Note Added');
      if (typeof uiCallback === 'function') {
        uiCallback('Note Added');
      }
    } catch (error) {
      console.log('Failed to add note:', error);
    }
  }

  static async deleteNoteById(id) {
    if (!this._collectionRef) {
      console.log('Failed to delete note: collection reference not set');
      return;
    }
    try {
      const docRef = doc(this._collectionRef, id);
      await deleteDoc(docRef);
      console.log('Note Deleted');
    } catch (error) {
      console.log('Failed to delete note:', error);
    }
  }

  static async updateNoteById(id, title) {
    if (!this._collectionRef) {
      console.log('Failed to update note: collection reference not set');
      return;
    }
    try {
      const docRef = doc(this._collectionRef, id);
      await updateDoc(docRef, { title });
      console.log('Note Updated');
    } catch (error) {
      console.log('Failed to update note:', error);
    }
  }
}

export default DatabaseHelper;