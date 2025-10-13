import { map } from 'nanostores'

export interface DefaultFormStore {
  step: 'signup' | 'otp' | 'phone';
}

export const defaultFormStore = map<DefaultFormStore>({
  step: 'signup',
});