import { map } from 'nanostores'

export interface DefaultFormStore {
  step: 'signup' | 'otp' | 'success';
  email?: string;
  phoneNumber?: string;
  program?: string;
}

export const defaultFormStore = map<DefaultFormStore>({
  step: 'signup',
  program: 'Academy',
});