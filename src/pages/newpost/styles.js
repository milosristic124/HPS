import { StyleSheet } from 'react-native';
import Metrics from '../../themes/Metrics';
import Colors from '../../themes/Colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: Metrics.screenWidth
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
    height: 70,
    marginTop: Metrics.padding,
    marginBottom: 2 * Metrics.padding,
    paddingLeft: Metrics.padding
  },
  checkbtn: {
    width: Metrics.screenWidth * 0.9, 
    height: Metrics.itemHeight, 
    borderRadius: 5, 
    backgroundColor: Colors.btnColor1, 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1 * Metrics.padding,
    marginBottom: 1 * Metrics.padding
  },
  imgUploadBtn: {
    width: Metrics.screenWidth * 0.9, 
    height: Metrics.itemHeight, 
    borderRadius: 5, 
    backgroundColor: Colors.btnColor1, 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2 * Metrics.padding,
    marginBottom: 1 * Metrics.padding
  },
  previewImg: {
      width : 200,
      height : 200
  }
});