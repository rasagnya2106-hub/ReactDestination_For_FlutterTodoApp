package src/components
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFirestore, collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';

const CreateNote = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const db = getFirestore();

  const noteId = route.params?.noteId;
  const passedSnapshot = route.params?.noteSnapshot;

  const isEditMode = !!noteId;

  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      if (passedSnapshot) {
        const data = passedSnapshot.data ? passedSnapshot.data() : passedSnapshot;
        setTitle(data.title || '');
        setLoading(false);
      } else {
        const fetchNote = async () => {
          try {
            const noteRef = doc(db, 'notes', noteId);
            const snap = await getDoc(noteRef);
            if (snap.exists()) {
              const data = snap.data();
              setTitle(data.title || '');
            } else {
              setError('Note not found.');
            }
          } catch (e) {
            setError('Failed to load note.');
          } finally {
            setLoading(false);
          }
        };
        fetchNote();
      }
    }
  }, [isEditMode, noteId, passedSnapshot, db]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Title is required.');
      return;
    }
    setLoading(true);
    try {
      const noteData = { title: title.trim() };
      if (isEditMode) {
        const noteRef = doc(db, 'notes', noteId);
        await setDoc(noteRef, noteData, { merge: true });
      } else {
        await addDoc(collection(db, 'notes'), noteData);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Save Error', 'Failed to save note.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isEditMode ? 'Edit Note' : 'Create Note'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
});

export default CreateNote;