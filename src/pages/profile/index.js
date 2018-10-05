

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

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      user: props.navigation.state.params.user,
      schoolid: props.user.schoolid,
      selfState: false
    };

    if (this.state.user.key == auth.currentUser.uid) {
      this.state = {
        ...this.state,
        selfState: true
      };
    }
  }

  componentDidMount() {

  }

  checkBtnClicked() {
    this.refs.main.showIndicator();
    if (this.state.user.value.name == '') {
      Alert.alert(
        'Error', 
        "Name can't be empty.", 
        [
          {text: 'OK'},
        ],
        { cancelable: false }
      );
      return;
    }
    if (this.state.user.value.email == '') {
      Alert.alert(
        'Error', 
        "Email can't be empty.", 
        [
          {text: 'OK'},
        ],
        { cancelable: false }
      );
      return;
    }
    if (this.state.selfState) {
      let currentUser = auth.currentUser;
      let ref = database.ref(`users/${this.state.schoolid}/${currentUser.uid}`);
      currentUser.updateEmail(this.state.user.value.email)
      .then(() => {
        ref.update(this.state.user.value, () => {
          Alert.alert(
            'Success', 
            'Profile has been updated successfully.', 
            [
              {text: 'OK', onPress: () => {
                this.refs.main.hideIndicator();
                this.props.navigation.goBack();
              }},
            ],
            { cancelable: false }
          );
        });
      })
      .catch((error) => {
        var msg = '';
        if (error && error.message) {
          msg = error.message;
        }else{
          msg = error;
        }
        Alert.alert(
          'Error', 
          msg, 
          [
            {text: 'OK', onPress:() => {
              this.refs.main.hideIndicator();
              // this.props.navigation.goBack();
            }},
          ],
          { cancelable: false }
        );
      });
    }else{
      let ref = database.ref(`users/${this.state.schoolid}/${this.state.user.key}`);
      if (this.state.user.value.isadmin) {
        this.state.user.value.iseditable = true;
        this.state.user.value.isremovable = true;
        this.state.user.value.isPhotoEditable = true;
      }
      ref.update(this.state.user.value, () => {
        Alert.alert(
          'Success', 
          'Profile is updated successfully.', 
          [
            {text: 'OK', onPress:() => {
              this.refs.main.hideIndicator();
              this.props.navigation.goBack();
            }},
          ],
          { cancelable: false }
        );
      });
    }
  }
  deleteUser() {
    this.refs.main.showIndicator();
    if (this.state.user.value.isroot == false) {
      let ref = database.ref(`users/${this.state.schoolid}/${this.state.user.key}`);
      ref.remove((error) => {
        if (error) {
          Alert.alert(
            'Error', 
            'Failed to delete the profile.', 
            [
              {text: 'OK', onPress:() => {
                this.refs.main.hideIndicator();
              }},
            ],
            { cancelable: false }
          );
          return;
        }
      });
      this.refs.main.hideIndicator();
      this.props.navigation.goBack();
    }
  }

  crossBtnClicked() {
    Alert.alert(
      'Confirm', 
      'Do you want to remove this user?', 
      [
        {text: 'No'},
        {text: 'Yes', onPress: this.deleteUser.bind(this)},
      ],
      { cancelable: false }
    );
  }

  backBtnClicked() {
    this.props.navigation.goBack();
  }

  resetPassword() {
    auth.sendPasswordResetEmail(auth.currentUser.email)
      .then(() => {
        Alert.alert(
          'Success', 
          'Password Reset Email is sent.', 
          [
            {text: 'OK'},
          ],
          { cancelable: false }
        );
      })
      .catch( error => {
        Alert.alert(
          'Error', 
          error.message, 
          [
            {text: 'OK'},
          ],
          { cancelable: false }
        );
      });
  }

  render() {
    return (
      <ActivityComponent ref='main'>
        <ImageBackground
          style={Styles.container}
          source={Assets.background}
          resizeMode='cover'
        >
          <Navbar
            left={Assets.backbtn}
            leftHandler={this.backBtnClicked.bind(this)}
            title='Edit User'
            logo={Assets.login_user}
          />
          <KeyboardAwareScrollView style={Styles.contentView}>
            <View
              style={{ alignItems: 'center', marginTop: 20 }}
            >
              {
                this.state.user.value.name 
                ?
                <UserAvatar size='100' name={this.state.user.value.name} color={ Colors.btnColor1 } style={{marginVertical: 20}}/> 
                :
                <View style={{width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.btnColor1, marginVertical: 20}}/>
              }
              <View style={Styles.itemContainer}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#aaaaaa',
                    backgroundColor: 'transparent'
                  }}
                >
                  Name:
                </Text>
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: 'transparent',
                    marginLeft: Metrics.padding
                  }}
                  underlineColorAndroid='transparent'
                  placeholder='Type your name'
                  placeholderTextColor='white'
                  value={this.state.user.value.name}
                  editable={this.state.selfState}
                  autoCapitalize='none'
                  onChangeText={(text) => {
                    let user = Object.assign({}, this.state.user);
                    user.value.name = text;
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
                  resizeMode='contain'
                /> */}
              </View>
              <View style={Styles.itemContainer}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#aaaaaa',
                    backgroundColor: 'transparent'
                  }}
                >
                  Email:
                </Text>
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: 'transparent',
                    marginLeft: Metrics.padding
                  }}
                  underlineColorAndroid='transparent'
                  placeholder='Type your name'
                  placeholderTextColor='white'
                  value={this.state.user.value.email}
                  editable={this.state.selfState}
                  autoCapitalize='none'
                  onChangeText={(text) => {
                    let user = Object.assign({}, this.state.user);
                    user.value.email = text;
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
                  resizeMode='contain'
                /> */}
              </View>
              {
                this.state.selfState
                ?
                null
                :
                <View style={Styles.itemContainer}>
                  <Image
                    style={{
                      flex: 0,
                      width: Metrics.itemHeight * 0.6,
                      height: Metrics.itemHeight * 0.6
                    }}
                    source={Assets.crown}
                    resizeMode='contain'
                  />
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: 'transparent',
                      marginLeft: Metrics.padding
                    }}
                  >
                    Admin
                  </Text>
                  <Switch
                    onTintColor={Colors.btnColor1}
                    value={this.state.user.value.isadmin}
                    style={{ marginRight: 10 }}
                    onValueChange={state => {
                      var user = Object.assign({}, this.state.user);
                      user.value.isadmin = state;
                      this.setState({ ...this.state, user: user });
                    }}
                  />
                </View>
              }
              {
                this.state.selfState || this.state.user.value.isadmin
                ?
                null
                :
                <View style={Styles.itemContainer1}>
                  <View style={{flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Switch
                      onTintColor={Colors.btnColor1}
                      value={this.state.user.value.iseditable}
                      style={{ marginRight: 10 }}
                      onValueChange={state => {
                        var user = Object.assign({}, this.state.user);
                        user.value.iseditable = state;
                        this.setState({ ...this.state, user: user });
                      }}
                    />
                    <Text style={{fontSize: 14, backgroundColor: 'transparent', color: 'white', fontWeight: 'bold', marginTop: 10}}>
                      Edit Points
                    </Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Switch
                      onTintColor={Colors.btnColor1}
                      value={this.state.user.value.isremovable}
                      disabled={!this.state.user.value.iseditable}
                      style={{ marginRight: 10 }}
                      onValueChange={state => {
                        var user = Object.assign({}, this.state.user);
                        user.value.isremovable = state;
                        this.setState({ ...this.state, user: user });
                      }}
                    />
                    <Text style={{fontSize: 14, backgroundColor: 'transparent', color: 'white', fontWeight: 'bold', marginTop: 10}}>
                      Remove Points
                    </Text>
                  </View>
                  <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <Switch
                      onTintColor={Colors.btnColor1}
                      value={this.state.user.value.isPhotoEditable}
                      disabled={!this.state.user.value.iseditable}
                      style={{ marginRight: 10 }}
                      onValueChange={state => {
                        var user = Object.assign({}, this.state.user);
                        user.value.isPhotoEditable = state;
                        this.setState({ ...this.state, user: user });
                      }}
                    />
                    <Text style={{fontSize: 14, backgroundColor: "transparent", color: "white", fontWeight: "bold", marginTop: 10}}>
                      Edit  Photo
                    </Text>
                  </View>
                </View>
              }
              <View style={Styles.itemContainer}>
                <Image
                  style={{
                    flex: 0,
                    width: Metrics.itemHeight * 0.6,
                    height: Metrics.itemHeight * 0.6
                  }}
                  source={Assets.master_key}
                  resizeMode='contain'
                />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: 'transparent',
                    marginLeft: Metrics.padding
                  }}>
                  Reset Password
                </Text>
                {
                  this.state.selfState
                  ?
                  <TouchableOpacity onPress={this.resetPassword.bind(this)}>
                    <Image
                      style={{
                        flex: 0,
                        width: Metrics.itemHeight * 0.6,
                        height: Metrics.itemHeight * 0.6,
                        marginRight: Metrics.padding
                      }}
                      source={Assets.master_rightarrow}
                      resizeMode='contain'
                    />
                  </TouchableOpacity>
                  :
                  <Image
                    style={{
                      flex: 0,
                      width: Metrics.itemHeight * 0.6,
                      height: Metrics.itemHeight * 0.6,
                      marginRight: Metrics.padding
                    }}
                    source={Assets.master_rightarrow}
                    resizeMode='contain'
                  />
                }
              </View>
              <TouchableOpacity onPress={this.checkBtnClicked.bind(this)}>
                <View style={Styles.checkbtn}>
                  <Image
                    source={Assets.check}
                    style={{
                      width: Metrics.iconSize * 1.5,
                      height: Metrics.iconSize * 1.5
                    }}
                    resizeMode='cover'
                  />
                </View>
              </TouchableOpacity>
              {
                this.state.selfState
                ?
                null
                :
                <TouchableOpacity onPress={this.crossBtnClicked.bind(this)}>
                  <View style={Styles.crossbtn}>
                    <Image
                      source={Assets.cross}
                      style={{
                        width: Metrics.iconSize * 1.5,
                        height: Metrics.iconSize * 1.5
                      }}
                      resizeMode='cover'
                    />
                  </View>
                </TouchableOpacity>
              }
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

export default connect(mapStateToProps, null)(ProfileScreen);
