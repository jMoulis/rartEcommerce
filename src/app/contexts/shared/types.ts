import { UserCredential } from 'firebase/auth';

export interface ApiPayload {
  status: boolean;
  code: string;
  error: string | null;
  message: string | null;
  data?: UserCredential | any
}
