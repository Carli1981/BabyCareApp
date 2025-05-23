import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const maxBaseWidth = 480;

const effectiveWidth = (Platform.OS === 'web' && width > maxBaseWidth) ? maxBaseWidth : width;

export const scale = (size: number) => (effectiveWidth / guidelineBaseWidth) * size;
export const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const isTablet = width >= 768;
