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
    alignItems: 'center',
  },
  flatListStyle: {
    flex: 1,
    width: Metrics.screenWidth
  },

  list: {
    flex: 1,
    width: Metrics.screenWidth,
    alignItems: 'center'
  },
  item: {
    width: Metrics.screenWidth / 2 - Metrics.padding,
    height: Metrics.screenWidth / 2 + 100,
    margin: Metrics.padding / 2, 
  },
  usernameStyle: {
    paddingTop : 10,
    paddingLeft : 10,
    fontSize: 16,
    fontWeight: 'normal', 
    color: 'white',
    backgroundColor: 'transparent',
  },
  dateStyle :  {
    paddingLeft : 10,
    fontSize: 12,
    fontWeight: 'normal', 
    color: 'white',
    backgroundColor: 'transparent',
  },
  imageStyle : {
    marginTop : 10,
    height: 300,
    marginBottom : 10
  },
  descriptionStyle : {
    paddingLeft : 10,
    fontSize: 16,
    fontWeight: 'normal', 
    color: 'white',
    backgroundColor: 'transparent',
  },
  iconText : {
    color:  'white'
  },
  itemContainer: {
    backgroundColor : '#15181E',
    marginLeft: 10,
    marginRight: 10,
    marginTop : 5,
    marginBottom: 5
  }
});