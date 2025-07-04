import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { collection, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useCollection(collectionName) {
  const [data, loading, error] = useCollectionData(
    collection(db, collectionName),
    { idField: 'id' }
  );
  
  return { data, loading, error };
}

export function useDocument(collectionName, documentId) {
  const [data, loading, error] = useDocumentData(
    doc(db, collectionName, documentId),
    { idField: 'id' }
  );
  
  return { data, loading, error };
}

export async function addDocument(collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
}

export async function updateDocument(collectionName, documentId, data) {
  try {
    await updateDoc(doc(db, collectionName, documentId), data);
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
}

export async function deleteDocument(collectionName, documentId) {
  try {
    await deleteDoc(doc(db, collectionName, documentId));
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}