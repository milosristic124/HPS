import React, { Component } from 'react';
import { Platform, View } from 'react-native';

import {
  StackNavigator,
  NavigationAction,
  DrawerNavigator,
  createStackNavigator,
  createDrawerNavigator
} from 'react-navigation';

//pages
import LoginScreen from '../pages/login';
import ResetScreen from '../pages/reset';
import DashboardScreen from '../pages/dashboard';
import UsersScreen from '../pages/users';
import HouseScreen from '../pages/house';
import ProfileScreen from '../pages/profile';
import MyProfileScreen from '../pages/myprofile';
import SettingsScreen from '../pages/settings';
import NewUserScreen from '../pages/newuser';
import NewstickerScreen from '../pages/newsticker';
import PointHistoryScreen from '../pages/pointhistory';
import HousePhotosScreen from '../pages/housephotos';
import NewPostScreen from '../pages/newpost';

import SideMenu from './SideMenu';
import Metrics from '../themes/Metrics';
import Colors from '../themes/Colors';

const Drawer = createDrawerNavigator(
  {
    dashboard: {
      screen: DashboardScreen
    },
    users: {
      screen: UsersScreen
    },
    settings: {
      screen: SettingsScreen
    },
    newsticker: {
      screen: NewstickerScreen
    }, 
    myprofile: {
      screen: MyProfileScreen
    },
    pointhistory: {
      screen: PointHistoryScreen
    },
    housephotos: {
      screen: HousePhotosScreen
    }
    // newpost: {
    //   screen: NewPostScreen
    // }
  },
  {
    drawerWidth: Metrics.screenWidth * 0.8,
    contentComponent: SideMenu,
    initialRouteName: 'dashboard',
    contentOptions: {
      activeTintColor: 'white',
      inactiveTintColor: 'white',
      labelStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        fontStyle: 'normal',
        marginLeft: 0,
        paddingLeft: 0
      }
    },
    // drawerOpenRoute: 'DrawerOpen',
    // drawerCloseRoute: 'DrawerClose',
    // drawerToggleRoute: 'DrawerToggle'
  }
);

const Navigator = createStackNavigator(
  {
    login: {
      screen: LoginScreen
    },
    reset: {
      screen: ResetScreen
    },
    dashboard: {
      screen: Drawer
    },
    house: {
      screen: HouseScreen
    },
    profile: {
      screen: ProfileScreen
    },
    newuser: {
      screen: NewUserScreen
    },
    pointhistory: {
      screen: PointHistoryScreen
    },
    housephotos: {
      screen: HousePhotosScreen
    },
    newpost: {
      screen: NewPostScreen
    }
  },
  {
    navigationOptions: {
      gesturesEnabled: false
    },
    initialRouteName: 'login',
    headerMode: 'none'
  }
);
const defaultGetStateForAction = Drawer.router.getStateForAction;

Drawer.router.getStateForAction = (action, state) => {

  //use 'DrawerOpen' to capture drawer open event
  if (state && action.type === 'Navigation/NAVIGATE' && action.routeName === 'DrawerClose') {
      console.log('DrawerClose');
      //write the code you want to deal with 'DrawerClose' event
  }
  return defaultGetStateForAction(action, state);
};
export default Navigator;
