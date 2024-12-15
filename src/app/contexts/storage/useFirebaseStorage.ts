import { storage } from '@/src/lib/firebase/firebase';
import { deleteFile } from '@/src/lib/firebase/firestorage';
import { getDownloadURL, listAll, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react';

export const useFirebaseStorage = () => {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, any>>({}); // New state for errors

  const onAddFile = async (file: File, filePath: string, fileName?: string): Promise<string | undefined> => {
    return await new Promise((resolve, reject) => {
      const customFileName = fileName ?? file.name;
      const storageRef = ref(storage, filePath + customFileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progression = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(prevProgress => ({ ...prevProgress, [customFileName]: progression }));
        },
        (error: any) => {
          setErrors(prevErrors => ({ ...prevErrors, [customFileName]: error })); // Update error state
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            resolve(url);
          }).catch((error: any) => {
            setErrors(prevErrors => ({ ...prevErrors, [customFileName]: error })); // Handle error in getting download URL
            reject(error);
          });
        }
      );
    });
  };

  const listFilesInFolder = async (folderPath: string) => {
    const folderRef = ref(storage, folderPath);
    try {
      const fileList = await listAll(folderRef);
      return fileList.items;
    } catch (error) {
      return [];
    }
  };
  const onDeleteFiles = async (files: string[]) => {
    const promises = files.map(async (file) => {
      try {
        await deleteFile(file);
        return file;
      } catch (error) {
        return error;
      }
    });
    return Promise.all(promises);
  };
  return {
    onAddFile,
    progress,
    errors,
    listFilesInFolder,
    onDeleteFiles
  };
};
