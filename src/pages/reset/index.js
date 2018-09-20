

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
  Alert,
} from 'react-native';
import firebase from '../../firebase';
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Styles from './styles';
import Assets from '../../../assets';
import Metrics from '../../themes/Metrics';
import Colors from '../../themes/Colors';
import { ActivityComponent, ImageTextInput } from '../../components';

const auth = firebase.auth();

export default class ResetScreen extends Component {
  constructor() {
    super();
    
    this.state = {
      email: ''
    }
  }

  emailInputChanged(text) {
    this.setState({
      ...this.state,
      email: text
    });
  }

  checkBtnClicked() {
    this.refs.main.showIndicator();
    if (!this.state.email) {
      Alert.alert(
        'Error',
        'An email address must be provided.',
        [
          {
            text: 'OK',
            onPress: () => this.refs.main.hideIndicator()
          }
        ],
        { cancelable: false }
      );
      return;
    }
    auth.sendPasswordResetEmail(this.state.email)
    .then(() => {
      Alert.alert(
        'Success',
        'Password Reset Email is sent to your email.',
        [
          {
            text: 'OK',
            onPress: () => this.refs.main.hideIndicator()
          }
        ],
        { cancelable: false }
      );
    })
    .catch(error => {
      Alert.alert(
        'Error',
        error.message,
        [
          {
            text: 'OK',
            onPress: () => this.refs.main.hideIndicator()
          }
        ],
        { cancelable: false }
      );
    });
  }

  crossBtnClicked() {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <ActivityComponent ref='main'>
        <ImageBackground
          style={Styles.container}
          source={Assets.background}
          resizeMode='cover'>
          <View style={Styles.statusbar} />
          <KeyboardAwareScrollView style={Styles.contentView}>
            <View style={{alignItems: 'center', paddingTop: Metrics.navbarHeight}}>
              <Image source={Assets.logo} style={{flex: 0, height: Metrics.logoHeight}} resizeMode='contain'/>
              <Text style={ Styles.title }>
                {'House Point\nSystem'}
              </Text>
              <Text style={{fontSize: 20, backgroundColor: 'transparent', color: 'white', marginTop: 40}}>
                Forgot your Password?
              </Text>
              <Text style={{fontSize: 12, fontWeight: '200', backgroundColor: 'transparent', color: 'white', marginTop: 10}}>
                Email your e-mail below to reset your password.
              </Text>
              <ImageTextInput 
                style={{marginTop: 20}}
                placeholder='E-Mail Address'
                icon={Assets.forgot_email}
                func={this.emailInputChanged.bind(this)} />
              <View style={{width: Metrics.screenWidth * 0.8, flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                <TouchableOpacity onPress={this.checkBtnClicked.bind(this)}>
                  <View style={ Styles.checkbtn }>
                    <Image source={Assets.check} style={{ width: Metrics.iconSize * 1.5, height: Metrics.iconSize * 1.5}} resizeMode='cover'/>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.crossBtnClicked.bind(this)}>
                  <View style={ Styles.crossbtn }>
                    <Image source={Assets.cross} style={{ width: Metrics.iconSize * 1.5, height: Metrics.iconSize * 1.5}} resizeMode='cover'/>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </ActivityComponent>
    );
  }
}
