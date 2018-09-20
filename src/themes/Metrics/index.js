

import { Dimensions, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const { width, height } = Dimensions.get('window');

const Metrics = {
  screenWidth: width,
  screenHeight: height,
  statusbarHeight: getStatusBarHeight(),
  navbarHeight: Platform.OS === 'ios' ? 44 : 48,
  logoHeight: 100,
  itemHeight: 50,
  iconSize: 24,
  padding: 10
};

export default Metrics;
