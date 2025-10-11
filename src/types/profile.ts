export type Profile = {
  avatar: number;
  gender: 'male' | 'female' | 'other';
  firstName: string;
  lastName: string;
  country: string; // ISO country code
};
