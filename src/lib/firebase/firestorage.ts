// Import your storage from the Firebase config file
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Uploads a file to Firebase Storage.
 * @param file - File to be uploaded.
 * @param filePath - Path in Firebase Storage where the file will be stored.
 */
export const uploadFile = async (jsonString: string, filePath: string) => {
  const storageRef = ref(storage, filePath);
  try {
    const blob = new Blob([jsonString], { type: 'application/json' });

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    throw error;
  }
};

/**
 * Gets the download URL of a file stored in Firebase Storage.
 * @param filePath - Path of the file in Firebase Storage.
 */
export const getFileDownloadUrl = async (filePath: string) => {
  const storageRef = ref(storage, filePath);
  try {
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a file from Firebase Storage.
 * @param filePath - Path of the file in Firebase Storage to be deleted.
 */
export const deleteFile = async (filePath: string) => {
  const storageRef = ref(storage, filePath);
  try {
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    throw error;
  }
};
