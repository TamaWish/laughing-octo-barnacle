// Auto-generated list of character images so we can reference them statically for Metro bundler
// Gender-aware character image lists
// We keep a backwards-compatible `characters` array (male then female) for numeric indices,
// but also expose helper functions to resolve an avatar by gender so the correct M#/F# image
// is shown for a profile.

export const maleCharacters = [
  require('../../assets/Character/M1.png'),
  require('../../assets/Character/M2.png'),
  require('../../assets/Character/M3.png'),
  require('../../assets/Character/M4.png'),
  require('../../assets/Character/M5.png'),
  require('../../assets/Character/M6.png'),
  require('../../assets/Character/M7.png'),
  require('../../assets/Character/M8.png'),
  require('../../assets/Character/M9.png'),
  require('../../assets/Character/M10.png'),
  require('../../assets/Character/M11.png'),
  require('../../assets/Character/M12.png'),
  require('../../assets/Character/M13.png'),
  require('../../assets/Character/M14.png'),
  require('../../assets/Character/M15.png'),
  require('../../assets/Character/M16.png'),
  require('../../assets/Character/M17.png'),
  require('../../assets/Character/M18.png'),
  require('../../assets/Character/M19.png'),
  require('../../assets/Character/M20.png'),
  require('../../assets/Character/M22.png'),
  require('../../assets/Character/M23.png'),
  require('../../assets/Character/M24.png'),
  require('../../assets/Character/M25.png'),
  require('../../assets/Character/M26.png'),
  require('../../assets/Character/M27.png'),
  require('../../assets/Character/M28.png'),
  require('../../assets/Character/M29.png'),
  require('../../assets/Character/M30.png'),
];

export const femaleCharacters = [
  require('../../assets/Character/F1.png'),
  require('../../assets/Character/F10.png'),
  require('../../assets/Character/F11.png'),
  require('../../assets/Character/F12.png'),
  require('../../assets/Character/F13.png'),
  require('../../assets/Character/F14.png'),
  require('../../assets/Character/F15.png'),
  require('../../assets/Character/F16.png'),
  require('../../assets/Character/F17.png'),
  require('../../assets/Character/F18.png'),
  require('../../assets/Character/F19.png'),
  require('../../assets/Character/F2.png'),
  require('../../assets/Character/F20.png'),
  require('../../assets/Character/F21.png'),
  require('../../assets/Character/F22.png'),
  require('../../assets/Character/F23.png'),
  require('../../assets/Character/F24.png'),
  require('../../assets/Character/F25.png'),
  require('../../assets/Character/F26.png'),
  require('../../assets/Character/F27.png'),
  require('../../assets/Character/F28.png'),
  require('../../assets/Character/F29.png'),
  require('../../assets/Character/F3.png'),
  require('../../assets/Character/F30.png'),
  require('../../assets/Character/F4.png'),
  require('../../assets/Character/F6.png'),
  require('../../assets/Character/F7.png'),
  require('../../assets/Character/F8.png'),
  require('../../assets/Character/F9.png'),
];

// Backwards-compatible flat array: male then female (keeps numeric indices stable)
export const characters = [...maleCharacters, ...femaleCharacters];

export type Gender = 'male' | 'female' | 'other';

// Return an image source for a requested gender and index. Index is wrapped with modulo
// so old numeric avatar values still map to a valid image.
export function getCharacter(gender: Gender | undefined, index: number | undefined) {
  const idx = typeof index === 'number' && !isNaN(index) ? Math.max(0, index) : 0;
  if (gender === 'male') return maleCharacters[idx % maleCharacters.length];
  if (gender === 'female') return femaleCharacters[idx % femaleCharacters.length];
  return characters[idx % characters.length];
}

// Accepts a profile-like object { avatar: number, gender: 'male'|'female'|... }
// and returns the resolved image source. This is the convenience function to use when
// rendering avatars for people so the selected gender's image set is used.
export function resolveAvatar(obj: { avatar?: number; gender?: Gender } | undefined) {
  if (!obj) return characters[0];
  return getCharacter(obj.gender, obj.avatar ?? 0);
}
