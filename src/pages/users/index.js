

import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Alert
} from 'react-native';
import firebase from '../../firebase';
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import UserAvatar from 'react-native-user-avatar';
import Swipeable from 'react-native-swipeable';

import Styles from './styles';
import Assets from '../../../assets';
import Metrics from '../../themes/Metrics';
import Colors from '../../themes/Colors';
import { ActivityComponent, ImageTextInput, Navbar } from '../../components';

const auth = firebase.auth();
const database = firebase.database();

export default class UsersScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { users: [], schoolid: props.navigation.state.params[0] };
  }
  
  swipeable = null;

  componentDidMount() {
    let ref = database.ref(`users/${this.state.schoolid}`);
    ref.on("value", snapshot => {
      var users = [];
      snapshot.forEach(child => {
        users.push({
          key: child.key,
          value: child.val()
        });
      });
      this.setState({
        ...this.state,
        users: users
      });
    });
  }

  menuBtnClicked() {
    this.props.navigation.openDrawer();
  }

  addBtnClicked() {
    this.props.navigation.navigate("newuser");
  }

  itemClicked(params) {
    this.props.navigation.navigate("profile", { user: params[0] });
  }

  deleteBtnClicked(params) {
    this.refs.main.showIndicator();

    let ary = this.state.users.slice();
    ary.splice(parseInt(params[0]), 1);
    this.swipeable.recenter();

    let user = this.state.users[parseInt(params[0])];
    if (user.key == auth.currentUser.uid) {
      Alert.alert(
        "Error", 
        "Can't delete your profile.", 
        [
          {text: "OK", onPress:() => {
            this.refs.main.hideIndicator();
          }},
        ],
        { cancelable: false }
      );
      return;
    }
    if (user.value.isroot) {
      Alert.alert(
        "Error", 
        "Can't delete root account.", 
        [
          {text: "OK", onPress:() => {
            this.refs.main.hideIndicator();
          }},
        ],
        { cancelable: false }
      );
      return;
    }

    let ref = database.ref(`users/${this.state.schoolid}/${user.key}`);
    ref.remove((error) => {
      if (error) {
        Alert.alert(
          "Error", 
          "Failed to delete the profile.", 
          [
            {text: "OK", onPress:() => {
              this.refs.main.hideIndicator();
            }},
          ],
          { cancelable: false }
        );
        return;
      }
      this.refs.main.hideIndicator();
      this.setState({
        ...this.state,
        users: ary
      });
    });
  }

  render() {
    return (
      <ActivityComponent ref="main">
        <ImageBackground
          style={Styles.container}
          source={Assets.background}
          resizeMode="cover"
        >
          <Navbar
            left={Assets.menubtn}
            leftHandler={this.menuBtnClicked.bind(this)}
            right={Assets.addbtn}
            rightHandler={this.addBtnClicked.bind(this)}
            title="Manage Users"
            logo={Assets.master_user}
          />
          <ScrollView style={Styles.contentView}>
            <View>
              {
                this.state.users.map((item, index) => {
                  return (
                    <Swipeable 
                    key={index} 
                    rightButtons={[
                      <TouchableOpacity onPress={this.deleteBtnClicked.bind(this, [index])}>
                        <View style={{width: 100, height: 100, backgroundColor: "red",alignItems: "center", justifyContent: "center", marginLeft: Metrics.padding}}>
                          <Text style={{fontSize: 18, fontWeight: "normal", color: "white", backgroundColor: "transparent"}}>DELETE</Text>
                        </View>
                      </TouchableOpacity>
                    ]} 
                    rightButtonWidth={100}
                    onRef={ref => this.swipeable = ref}
                    onRightButtonsOpenRelease = { 
                      (event, gestureState, swipe) => {
                        if (this.swipeable && this.swipeable !== swipe) {
                          this.swipeable.recenter(); 
                        }
                        this.swipeable = swipe;
                      } 
                    }
                    onRightButtonsCloseRelease = {() => this.swipeable = null }>
                      <TouchableOpacity onPress={this.itemClicked.bind(this, [item])}>
                        <View style={Styles.userItem}>
                          <UserAvatar
                            size="70"
                            name={item.value.name}
                            color={Colors.btnColor1}
                          />
                          <View
                            style={{
                              flex: 1,
                              height: 80,
                              alignItems: "flex-start",
                              justifyContent: "center",
                              marginLeft: 10
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                color: Colors.btnColor1,
                                backgroundColor: "transparent",
                                marginBottom: 5
                              }}
                            >
                              {item.value.name}
                            </Text>
                            <Text
                              style={{
                                fontSize: 14,
                                color: "white",
                                backgroundColor: "transparent"
                              }}
                            >
                              {item.value.email}
                            </Text>
                          </View>
                          {item.value.isadmin ? (
                            <View
                              style={{
                                flex: 0,
                                width: 50,
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <Image
                                style={{
                                  flex: 0,
                                  height: 30,
                                  justifyContent: "center",
                                  marginBottom: 10
                                }}
                                source={Assets.crown}
                                resizeMode="contain"
                              />
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: "white",
                                  backgroundColor: "transparent"
                                }}
                              >
                                ADMIN
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    </Swipeable>
                  );
                })
              }
            </View>
          </ScrollView>
        </ImageBackground>
      </ActivityComponent>
    );
  }
}
