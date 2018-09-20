

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import firebase from '../firebase';
import { DrawerItems, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import Metrics from '../themes/Metrics';
import Colors from '../themes/Colors';
import Assets from '../../assets';

const database = firebase.database();

let auth = firebase.auth();
const SideMenu = props => (
  <View style={{ flex: 1, backgroundColor: 'black', alignItems: 'center'}}>
    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: Metrics.statusbarHeight + 40}}>
      <Image source={Assets.logo} style={{width: 50, height: 75}} resizeMode='contain'/>
      <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold', marginLeft: Metrics.padding}}> {'House Point\n System'} </Text>
    </View>
    <View style={{ flex: 1, marginTop: 40}}>
      <View style={{position: 'absolute', left:0, right:0, top:0, bottom: 0, justifyContent: 'flex-end'}}>
        <TouchableOpacity onPress={() => {
          auth.signOut();
          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'login' })]
          });
          props.navigation.dispatch(resetAction);
        }}>
          <View style={[Styles.item, {marginBottom: 50}]}>
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

      {/* <DrawerItems {...props} /> */}
      <TouchableOpacity onPress={() => props.navigation.navigate('dashboard')}>
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
      {
        props.user.isadmin
        ?
        <TouchableOpacity onPress={() => props.navigation.navigate('users', [props.user.schoolid])}>
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
            <Text style={ Styles.itemdesc }> MANAGE USERS </Text>
          </View>
        </TouchableOpacity>
        :
        <TouchableOpacity onPress={() => props.navigation.navigate('myprofile')}>
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
        props.user.isadmin
        ?
        <TouchableOpacity onPress={() => props.navigation.navigate('newsticker', [props.user.schoolid])}>
          <View style={[Styles.item, {marginTop: 25}]}>
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
        :
        null
      }
      {
        props.user.isadmin
        ?
        <TouchableOpacity onPress={() => props.navigation.navigate('settings', [props.user.schoolid])}>
          <View style={[Styles.item, {marginTop: 25}]}>
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
        props.user.isadmin
        ?
        <TouchableOpacity onPress={() => props.navigation.navigate('pointhistory')}>
          <View style={[Styles.item, {marginTop: 25}]}>
            <Image
              source={Assets.master_settings}
              style={{
                width: Metrics.iconSize,
                height: Metrics.iconSize,
                marginRight: 10,
              }}
              resizeMode='contain'
            />
            <Text style={ Styles.itemdesc }> POINT HISTORY </Text>
          </View>
        </TouchableOpacity>
        :
        null
      }
        <TouchableOpacity onPress={() => props.navigation.navigate('housephotos')}>
          <View style={[Styles.item, {marginTop: 25}]}>
            <Image
              source={Assets.master_settings}
              style={{
                width: Metrics.iconSize,
                height: Metrics.iconSize,
                marginRight: 10,
              }}
              resizeMode='contain'
            />
            <Text style={ Styles.itemdesc }> HOUSE PHOTOS </Text>
          </View>
        </TouchableOpacity>
      {
        props.user.isadmin
        ?
        <TouchableOpacity onPress={
            () => 
              Alert.alert(
                'Confirm', 
                'Are you sure you want to reset the TV Interface?', 
                [
                  {text: 'Cancel'},
                  {text: 'Yes', onPress: () => {
                    let ref = database.ref(`reset_flags/${props.user.schoolid}`);
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
          <View style={[Styles.item, {marginTop: 50}]}>
            <Image
              source={Assets.resetbtn}
              style={{
                width: Metrics.iconSize,
                height: Metrics.iconSize,
                marginRight: 10,
              }}
              resizeMode='contain'
            />
            <Text style={ Styles.itemdesc }> RESET TV INTERFACE </Text>
          </View>
        </TouchableOpacity>
        :
        null
      }
    </View>
  </View>
);

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
