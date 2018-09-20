

import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Switch
} from 'react-native';
import firebase from '../../firebase';
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import UserAvatar from 'react-native-user-avatar';
import { connect } from 'react-redux';

import Styles from './styles';
import Assets from '../../../assets';
import Metrics from '../../themes/Metrics';
import Colors from '../../themes/Colors';
import { ActivityComponent, Navbar, ImageTextInput } from '../../components';

const auth = firebase.auth();
const database = firebase.database();

class MyProfileScreen extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      user: {
        email: "",
        name: "",
        password: "",
        isadmin: true,
        iseditable: true,
        isremovable: true,
      },
      schoolid: props.user.schoolid
    };
  }

  componentDidMount() {
    let ref = database.ref(`users/${this.state.schoolid}/${auth.currentUser.uid}`);
    ref.on("value", (snapshot) => {
      if (snapshot.val()) {
        this.setState({
          user: snapshot.val() 
        });
      }else{
        Alert.alert(
          "Error", 
          "Your profile has been removed by admin.", 
          [
            {text: "OK", onPress: () => {
              //logout & go back to login screen
              auth.signOut();

            }},
          ],
          { cancelable: false }
        );
      }
    });
  }

  checkBtnClicked() {
    this.refs.main.showIndicator();
    if (this.state.user.name == "") {
      Alert.alert(
        "Error", 
        "Name can't be empty.", 
        [
          {text: "OK"},
        ],
        { cancelable: false }
      );
      return;
    }
    if (this.state.user.email == "") {
      Alert.alert(
        "Error", 
        "Email can't be empty.", 
        [
          {text: "OK"},
        ],
        { cancelable: false }
      );
      return;
    }

    let currentUser = auth.currentUser;
    let ref = database.ref(`users/${this.state.schoolid}`).child(currentUser.uid);

    currentUser.updateEmail(this.state.user.email)
    .then(() => {
      return ref.update(this.state.user, () => {
        Alert.alert(
          "Success", 
          "Profile has been updated successfully.", 
          [
            {text: "OK", onPress: () => {
              this.refs.main.hideIndicator();
            }},
          ],
          { cancelable: false }
        );
      });
    })
    .catch((error) => {
      var msg = "";
      if (error && error.message) {
        msg = error.message;
      }else{
        msg = error;
      }
      Alert.alert(
        "Error", 
        msg, 
        [
          {text: "OK", onPress:() => {
            this.refs.main.hideIndicator();
          }},
        ],
        { cancelable: false }
      );
    });
  }

  menuBtnClicked() {
    this.props.navigation.openDrawer();
  }

  resetPassword() {
    auth.sendPasswordResetEmail(auth.currentUser.email)
      .then(() => {
        Alert.alert(
          "Success", 
          "Password Reset Email is sent.", 
          [
            {text: "OK"},
          ],
          { cancelable: false }
        );
      })
      .catch( error => {
        Alert.alert(
          "Error", 
          error.message, 
          [
            {text: "OK"},
          ],
          { cancelable: false }
        );
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
            title="My Profile"
            logo={Assets.login_user}
          />
          <KeyboardAwareScrollView style={Styles.contentView}>
            <View
              style={{ alignItems: "center", marginTop: 20 }}
            >
              {
                this.state.user.name 
                ?
                <UserAvatar size="100" name={this.state.user.name} color={ Colors.btnColor1 } style={{marginVertical: 20}}/> 
                :
                <View style={{width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.btnColor1, marginVertical: 20}}/>
              }
              <View style={Styles.itemContainer}>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#aaaaaa",
                    backgroundColor: "transparent"
                  }}
                >
                  Name:
                </Text>
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "transparent",
                    marginLeft: Metrics.padding
                  }}
                  underlineColorAndroid="transparent"
                  placeholder="Type your name"
                  placeholderTextColor="white"
                  value={this.state.user.name}
                  autoCapitalize="none"
                  onChangeText={(text) => {
                    let user = Object.assign({}, this.state.user);
                    user.name = text;
                    this.setState({
                      ...this.state,
                      user: user
                    });
                  }}
                />
                {/* <Image
                  style={{
                    flex: 0,
                    width: Metrics.itemHeight,
                    height: Metrics.itemHeight
                  }}
                  source={Assets.edit}
                  resizeMode="contain"
                /> */}
              </View>
              <View style={Styles.itemContainer}>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#aaaaaa",
                    backgroundColor: "transparent"
                  }}
                >
                  Email:
                </Text>
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "transparent",
                    marginLeft: Metrics.padding
                  }}
                  underlineColorAndroid="transparent"
                  placeholder="Type your name"
                  placeholderTextColor="white"
                  value={this.state.user.email}
                  autoCapitalize="none"
                  onChangeText={(text) => {
                    let user = Object.assign({}, this.state.user);
                    user.email = text;
                    this.setState({
                      ...this.state,
                      user: user
                    });
                  }}
                />
                {/* <Image
                  style={{
                    flex: 0,
                    width: Metrics.itemHeight,
                    height: Metrics.itemHeight
                  }}
                  source={Assets.edit}
                  resizeMode="contain"
                /> */}
              </View>
              {/* <View style={Styles.itemContainer}>
                <Image
                  style={{
                    flex: 0,
                    width: Metrics.itemHeight * 0.6,
                    height: Metrics.itemHeight * 0.6
                  }}
                  source={Assets.crown}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "transparent",
                    marginLeft: Metrics.padding
                  }}
                >
                  Admin
                </Text>
                <Switch
                  onTintColor={Colors.btnColor1}
                  value={this.state.user.isadmin}
                  disabled={true}
                  style={{ marginRight: 10 }}
                  onValueChange={state => {
                    var user = Object.assign({}, this.state.user);
                    user.isadmin = state;
                    this.setState({ ...this.state, user: user });
                  }}
                />
              </View> */}
              {/* <View style={Styles.itemContainer1}>
                <View style={{flex: 0.5, height: "100%", alignItems: "center", justifyContent: "center"}}>
                  <Switch
                    onTintColor={Colors.btnColor1}
                    value={this.state.user.iseditable}
                    disabled={true}
                    style={{ marginRight: 10 }}
                    onValueChange={state => {
                      var user = Object.assign({}, this.state.user);
                      user.iseditable = state;
                      this.setState({ ...this.state, user: user });
                    }}
                  />
                  <Text style={{fontSize: 14, backgroundColor: "transparent", color: "white", fontWeight: "bold", marginTop: 10}}>
                    Edit Points
                  </Text>
                </View>
                <View style={{flex: 0.5, alignItems: "center", justifyContent: "center"}}>
                  <Switch
                    onTintColor={Colors.btnColor1}
                    value={this.state.user.isremovable}
                    disabled={true}
                    style={{ marginRight: 10 }}
                    onValueChange={state => {
                      var user = Object.assign({}, this.state.user);
                      user.isremovable = state;
                      this.setState({ ...this.state, user: user });
                    }}
                  />
                  <Text style={{fontSize: 14, backgroundColor: "transparent", color: "white", fontWeight: "bold", marginTop: 10}}>
                    Remove Points
                  </Text>
                </View>
              </View> */}
              <View style={Styles.itemContainer}>
                <Image
                  style={{
                    flex: 0,
                    width: Metrics.itemHeight * 0.6,
                    height: Metrics.itemHeight * 0.6
                  }}
                  source={Assets.master_key}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "transparent",
                    marginLeft: Metrics.padding
                  }}>
                  Reset Password
                </Text>
                <TouchableOpacity onPress={this.resetPassword.bind(this)}>
                  <Image
                    style={{
                      flex: 0,
                      width: Metrics.itemHeight * 0.6,
                      height: Metrics.itemHeight * 0.6,
                      marginRight: Metrics.padding
                    }}
                    source={Assets.master_rightarrow}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={this.checkBtnClicked.bind(this)}>
                <View style={Styles.checkbtn}>
                  <Image
                    source={Assets.check}
                    style={{
                      width: Metrics.iconSize * 1.5,
                      height: Metrics.iconSize * 1.5
                    }}
                    resizeMode="cover"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </ActivityComponent>
    );
  }
}

const mapStateToProps = (state, props) => {
	return({
    user: state.sidemenu.user,
	});
};

export default connect(mapStateToProps, null)(MyProfileScreen);
