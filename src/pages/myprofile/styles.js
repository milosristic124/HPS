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
  },
  itemContainer: {
    borderColor: 'white', 
    borderRadius: 5, 
    borderWidth: 1,
    width: Metrics.screenWidth * 0.9,
    height: Metrics.itemHeight,
    marginTop: Metrics.padding,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Metrics.padding
  },
  itemContainer1: {
    borderColor: 'white', 
    borderRadius: 5, 
    borderWidth: 1,
    width: Metrics.screenWidth * 0.9,
    height: Metrics.itemHeight * 1.5,
    marginTop: Metrics.padding,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Metrics.padding
  },
  checkbtn: {
    width: Metrics.screenWidth * 0.75, 
    height: Metrics.itemHeight, 
    borderRadius: 5, 
    backgroundColor: Colors.btnColor1, 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3 * Metrics.padding,
    marginBottom: Metrics.padding * 2,
  }
});