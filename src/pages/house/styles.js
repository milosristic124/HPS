import { StyleSheet } from 'react-native';

import Metrics from '../../themes/Metrics';
import Colors from '../../themes/Colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusbar: {
    flex: 0,
    width: Metrics.screenWidth,
    height: Metrics.statusbarHeight,
    backgroundColor: Colors.statusbarBg,
  },
  navbar: {
    flex: 0,
    height: Metrics.navbarHeight,
    width: Metrics.screenWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.padding,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: 'normal', 
    color: 'white',
    backgroundColor: 'transparent',
  },
  contentView: {
    flex: 1,
    width: Metrics.screenWidth,
    paddingHorizontal: Metrics.padding,
    paddingTop: Metrics.padding,
    alignItems: 'center',
  },
  pointContainer: {
    width: Metrics.screenWidth - 4 * Metrics.padding, 
    height: 80,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  }
});