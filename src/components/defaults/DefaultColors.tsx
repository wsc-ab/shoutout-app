export const defaultBlue = '#3785fa';

export const defaultRed = {lv1: 'red', lv2: 'tomato'};

export const defaultBlack = {
  lv1: (opacity: number) => `rgba(0, 0, 0, ${opacity})`,
  lv2: (opacity: number) => `rgba(36, 36, 44, ${opacity})`,
  lv3: (opacity: number) => `rgba(68, 68, 72, ${opacity})`,
  lv4: (opacity: number) => `rgba(85, 85, 90, ${opacity})`,
  lv5: (opacity: number) => `rgba(110, 110, 117, ${opacity})`,
};

export const placeholderTextColor = 'gray';
