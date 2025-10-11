declare module 'expo-linear-gradient' {
  import { ComponentType } from 'react';
  import { ViewProps } from 'react-native';
  export const LinearGradient: ComponentType<ViewProps & { colors: string[]; start?: any; end?: any }>;
  export default { LinearGradient };
}
