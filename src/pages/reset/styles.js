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
  title: {
    flex: 0, 
    backgroundColor: 'transparent',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 20
  },
  checkbtn: {
    width: Metrics.screenWidth * 0.4 - Metrics.padding / 2, 
    height: Metrics.itemHeight, 
    borderRadius: 5, 
    backgroundColor: Colors.btnColor1, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  crossbtn: {
    width: Metrics.screenWidth * 0.4 - Metrics.padding / 2, 
    height: Metrics.itemHeight, 
    borderRadius: 5, 
    backgroundColor: Colors.btnColor2, 
    alignItems: 'center',
    justifyContent: 'center'
  }
});