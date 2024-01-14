import { storage } from '@/src/lib/firebase/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react';

export const useFirebaseStorage = () => {
  const [progress, setProgress] = useState(0);

  const onAddFile = async (file: File, filePath: string, fileName?: string): Promise<string | undefined> => {
    return await new Promise((resolve, reject) => {
      const customFileName = fileName ?? file.name;
      const storageRef = ref(storage, filePath + customFileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progression = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progression);
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error: any) => {
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            resolve(url);
          }).catch((error: any) => {
            reject(error);
          });
        }
      );
    });
  };

  return {
    onAddFile,
    progress,
  };
};
