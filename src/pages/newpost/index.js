

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

class NewPostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      isadmin: true,
      iseditable: true,
      isremovable: true,
      schoolid: props.user.schoolid
    };
  }

  componentDidMount() {

  }

  deleteUser() {
    this.props.navigation.goBack();
  }

  checkBtnClicked() {
    // this.refs.main.showIndicator();
    if (this.state.name == "") {
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
    if (this.state.email == "") {
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
    //
    this.refs.main.showIndicator();
    auth.createUserWithEmailAndPassword(this.state.email, "secretpassword")
      .then(user => {
        let ref = database.ref(`users/${this.state.schoolid}`).child(user.uid);
        ref.set({
          name: this.state.name,
          email: this.state.email,
          isadmin: this.state.isadmin,
          iseditable: this.state.isadmin ? true : this.state.iseditable,
          isremovable: this.state.isadmin ? true : this.state.isremovable,
          isroot: false,
          password: "secretpassword",
        }, (error) => {
          if(error) {
            Alert.alert(
              "Error", 
              error, 
              [
                {text: "OK", onPress: () => {
                  this.refs.main.hideIndicator();
                }},
              ],
              { cancelable: false }
            );
            return;
          }else{
            auth.sendPasswordResetEmail(this.state.email).then(() => {
              return auth.signInWithEmailAndPassword(this.props.user.email, this.props.user.password);
            }).then(user => {
              Alert.alert(
                "Success", 
                "Password Reset Email is sent.", 
                [
                  {text: "OK", onPress: () => {
                    this.refs.main.hideIndicator();
                    this.props.navigation.goBack();
                  }},
                ],
                { cancelable: false }
              );
            }).catch( error => {
              Alert.alert(
                "Error", 
                error.message, 
                [
                  {text: "OK", onPress: () => this.refs.main.hideIndicator() },
                ],
                { cancelable: false }
              );
            });
          }
        });
      })
      .catch(error => {
        Alert.alert(
          "Error", 
          error.message, 
          [
            {text: "OK", onPress: () => this.refs.main.hideIndicator() },
          ],
          { cancelable: false }
        );
      });
  }

  backBtnClicked() {
    this.props.navigation.goBack();
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
            left={Assets.backbtn}
            leftHandler={this.backBtnClicked.bind(this)}
            title="Add User"
            logo={Assets.login_user}
          />
          <KeyboardAwareScrollView style={Styles.contentView}>
            <View
              style={{ alignItems: "center", marginTop: 20 }}
            >
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
                  placeholderTextColor= "white"
                  value={this.state.name}
                  autoCapitalize="none"
                  onChangeText={(text) => {
                    this.setState({
                      ...this.state,
                      name: text,
                    });
                  }}
                />
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
                  placeholder="Type your email"
                  placeholderTextColor= "white"
                  value={this.state.email}
                  autoCapitalize="none"
                  onChangeText={(text) => {
                    this.setState({
                      ...this.state,
                      email: text
                    });
                  }}
                />
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

export default connect(mapStateToProps, null)(NewPostScreen);