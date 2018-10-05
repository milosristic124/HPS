

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Alert
} from 'react-native';
import firebase from '../firebase';
import { DrawerItems, NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';


import Metrics from '../themes/Metrics';
import Colors from '../themes/Colors';
import Assets from '../../assets';

const database = firebase.database();

let auth = firebase.auth();
class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmenuVisible : false
    }

  }

  ToggleSubMenu () {
    if(this.state.isSubmenuVisible) {
      this.setState({isSubmenuVisible : false});
    } else {
      this.setState({isSubmenuVisible : true});
    }
    console.log(this.state.isSubmenuVisible);
  }
  
  logout() {
      AsyncStorage.clear();
      auth.signOut();
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'login' })]
      });
      this.props.navigation.dispatch(resetAction);
  }
  
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'black', paddingLeft: 30}}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: Metrics.statusbarHeight + 40}}>
        <Image source={Assets.logo} style={{width: 50, height: 75}} resizeMode='contain'/>
        <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold', marginLeft: Metrics.padding}}> {'House Point\n System'} </Text>
      </View>
      <View style={{ flex: 1, marginTop: 40}}>
        <View style={{position: 'absolute', left:0, right:0, top:0, bottom: 0, justifyContent: 'flex-end'}}>
          <TouchableOpacity onPress={this.logout.bind(this)}>
            <View style={[Styles.item, {marginBottom: 40}]}>
              <Image
                source={Assets.master_logout}
                style={{
                  width: Metrics.iconSize,
                  height: Metrics.iconSize,
                  marginRight: 10,
                }}
                resizeMode='contain'
              />
              <Text style={ Styles.itemdesc }> LOG OUT </Text>
            </View>
          </TouchableOpacity>
        </View>
  
        {/* <DrawerItems {...this.props} /> */}
        <TouchableOpacity onPress={() => this.props.navigation.navigate('dashboard')}>
          <View style={ Styles.item }>
            <Image
              source={Assets.master_home}
              style={{
                width: Metrics.iconSize,
                height: Metrics.iconSize,
                marginRight: 10,
              }}
              resizeMode='contain'
            />
            <Text style={ Styles.itemdesc }> HOUSE DASHBOARD </Text>
          </View>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={() => this.props.navigation.navigate('housephotos')}>
            <View style={[Styles.item, {marginTop: 25}]}>
              <Image
                source={Assets.house_photo}
                style={{
                  width: Metrics.iconSize,
                  height: Metrics.iconSize,
                  marginRight: 10,
                  tintColor: 'white'
                }}
                resizeMode='contain'
              />
              <Text style={ Styles.itemdesc }> HOUSE PHOTOS </Text>
            </View>
          </TouchableOpacity>
  
        {
          !this.props.user.isadmin &&
          <TouchableOpacity onPress={() => this.props.navigation.navigate('myprofile')}>
            <View style={[Styles.item, {marginTop: 25}]}>
              <Image
                source={Assets.master_user}
                style={{
                  width: Metrics.iconSize,
                  height: Metrics.iconSize,
                  marginRight: 10,
                }}
                resizeMode='contain'
              />
              <Text style={ Styles.itemdesc }> MY PROFILE </Text>
            </View>
          </TouchableOpacity>
        }

        {
          this.props.user.isadmin &&
            <TouchableOpacity onPress={ this.ToggleSubMenu.bind(this)}>
                <View style={[Styles.item, {marginTop: 25}]}>
                  <Image
                    source={Assets.setting}
                    style={{
                      width: Metrics.iconSize,
                      height: Metrics.iconSize,
                      marginRight: 10,
                      tintColor: 'white'
                    }}
                    resizeMode='contain'
                  />
                  <Text style={ Styles.itemdesc }> SETTINGS </Text>
                  { this.state.isSubmenuVisible ? 
                    <Icon style={{paddingLeft:5}} name="chevron-up" size={30} color="white" />
                    : 
                    <Icon style={{paddingLeft:5}} name="chevron-down" size={30} color="white" />
                  }
                </View>
              </TouchableOpacity>
        }

        {
           this.state.isSubmenuVisible && 
           <TouchableOpacity onPress={() => this.props.navigation.navigate('users', [this.props.user.schoolid])}>
           <View style={[Styles.item, {marginTop: 25, marginLeft: 40}]}>
             <Image
               source={Assets.master_user}
               style={{
                 width: Metrics.iconSize,
                 height: Metrics.iconSize,
                 marginRight: 10,
               }}
               resizeMode='contain'
             />
             <Text style={ Styles.itemdesc }> MANAGE USERS </Text>
           </View>
         </TouchableOpacity>
         
        }

        {
          this.state.isSubmenuVisible &&
          <TouchableOpacity onPress={() => this.props.navigation.navigate('newsticker', [this.props.user.schoolid])}>
            <View style={[Styles.item, {marginTop: 25, marginLeft: 40}]}>
              <Image
                source={Assets.master_news}
                style={{
                  width: Metrics.iconSize,
                  height: Metrics.iconSize,
                  marginRight: 10,
                }}
                resizeMode='contain'
              />
              <Text style={ Styles.itemdesc }> NEWS TICKER </Text>
            </View>
          </TouchableOpacity>
        }
        {
          this.state.isSubmenuVisible
          ?
          <TouchableOpacity onPress={() => this.props.navigation.navigate('settings', [this.props.user.schoolid])}>
            <View style={[Styles.item, {marginTop: 25, marginLeft: 40}]}>
              <Image
                source={Assets.master_settings}
                style={{
                  width: Metrics.iconSize,
                  height: Metrics.iconSize,
                  marginRight: 10,
                }}
                resizeMode='contain'
              />
              <Text style={ Styles.itemdesc }> POINT LIST </Text>
            </View>
          </TouchableOpacity>
          :
          null
        }
        {
          this.state.isSubmenuVisible
          ?
          <TouchableOpacity onPress={() => this.props.navigation.navigate('pointhistory')}>
            <View style={[Styles.item, {marginTop: 25, marginLeft: 40}]}>
              <Image
                source={Assets.point_history}
                style={{
                  width: Metrics.iconSize,
                  height: Metrics.iconSize,
                  marginRight: 10,
                  tintColor: 'white'
                }}
                resizeMode='contain'
              />
              <Text style={ Styles.itemdesc }> POINT HISTORY </Text>
            </View>
          </TouchableOpacity>
          :
          null
        }
          
  
        {
          this.state.isSubmenuVisible
          ?
          <TouchableOpacity onPress={
              () => 
                Alert.alert(
                  'Confirm', 
                  'Are you sure you want to reset the TV Interface?', 
                  [
                    {text: 'Cancel'},
                    {text: 'Yes', onPress: () => {
                      let ref = database.ref(`reset_flags/${this.props.user.schoolid}`);
                      ref.update({
                        resetTV: Date.now()
                      }, () => {
                        Alert.alert(
                          'Success', 
                          'The TV Interface has been reset.'
                        )
                      });
                    }},
                  ],
                  { cancelable: false }
                )
              }>
            <View style={[Styles.item, {marginTop: 25, marginLeft: 40}]}>
              <Image
                source={Assets.resetbtn}
                style={{
                  width: Metrics.iconSize,
                  height: Metrics.iconSize,
                  marginRight: 10,
                }}
                resizeMode='contain'
              />
              <Text style={ Styles.itemdesc }> RESET TV INTERFACE</Text>
            </View>
          </TouchableOpacity>
          :
          null
        }
      </View>
    </View>
    )
  }
}


const Styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemdesc: {
    fontSize: 18,
    color: 'white',
    backgroundColor: 'transparent'
  }
});

const mapStateToProps = (state, props) => {
	return({
    navigation: state.sidemenu.navigation,
    user: state.sidemenu.user,
	});
};

export default connect(mapStateToProps, null)(SideMenu);