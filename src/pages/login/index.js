'use strict';

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
  AsyncStorage
} from 'react-native';
import firebase from '../../firebase';
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';

import Styles from './styles';
import Assets from '../../../assets';
import Metrics from '../../themes/Metrics';
import Colors from '../../themes/Colors';
import { ActivityComponent, ImageTextInput } from '../../components';
import { setNavigation, setUser } from '../../redux/actions/sidemenu';

const auth = firebase.auth();
const database = firebase.database();

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      schoolid: '',
      email: '',
      password: ''
    }
  }
  componentDidMount() {
    this.props.setNavigation(this.props.navigation);

    AsyncStorage.getItem('schoolid', (error, result) => {
      if(!error) {
        this.setState({schoolid: result});
      }
      AsyncStorage.getItem('email', (error, result) => {
        if(!error) {
          this.setState({email: result});
        }
      });
    });
  }

  schoolIdInputChanged(text) {
    this.setState({
      ...this.state,
      schoolid: text,
    });
  }

  emailInputChanged(text) {
    this.setState({
      ...this.state,
      email: text
    });
  }

  passwordInputChanged(text) {
    this.setState({
      ...this.state,
      password: text
    });
  }

  loginBtnClicked() {
    console.log('Email and pwd', this.state.email, this.state.password);
    this.refs.main.showIndicator();
    auth.signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(user => {
      let ref = database.ref(`users/${this.state.schoolid}/${user.user.uid}`);
      ref.once('value', (snapshot) => {
        var value = snapshot.val();
        if(!value) {
          Alert.alert(
            'Error',
            'Invalid User Credentials.',
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
        value.password = this.state.password;
        ref.update(value, () => {
          // let ref = database.ref(`houses/${auth.currentUser.uid}`);
          // ref.once('value', (snapshot) => {
          //   var ary = [];
          //   let index = 0;
          //   snapshot.forEach(element => {
          //     ary.push({index: index++, value: element.val() });
          //   });
          // });
            value.schoolid = this.state.schoolid;
            value.uid = user.user.uid;
            this.props.setUser(value);

            AsyncStorage.setItem('schoolid', this.state.schoolid).then(error => {
              return AsyncStorage.setItem('email', this.state.email);
            }).then(error => {
              if (!error) {
                this.refs.main.hideIndicator();
                this.props.navigation.navigate('dashboard');
              }
            });
        });
      });
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

  render() {
    return (
      <ActivityComponent ref='main'>
        <ImageBackground
          style={Styles.container}
          source={Assets.background}
          resizeMode='cover'>
          {/* <View style={Styles.statusbar} /> */}
          <StatusBar />
          <KeyboardAwareScrollView style={Styles.contentView}>
            <View style={{alignItems: 'center', paddingTop: Metrics.navbarHeight}}>
              <Image source={Assets.logo} style={{flex: 0, height: Metrics.logoHeight}} resizeMode='contain'/>
              <Text style={ Styles.title }>
                {'House Point\nSystem'}
              </Text>
              <ImageTextInput 
                style={{marginTop: 40}}
                placeholder='School-Id'
                icon={Assets.login_school}
                text={this.state.schoolid}
                func={this.schoolIdInputChanged.bind(this)} />
              <ImageTextInput 
                style={{marginTop: Metrics.padding}}
                placeholder='E-Mail Address'
                icon={Assets.login_user}
                text={this.state.email}
                func={this.emailInputChanged.bind(this)} />
              <ImageTextInput 
                style={{marginTop: Metrics.padding}}
                secureTextEntry={true}
                placeholder='Password'
                icon={Assets.login_password}
                func={this.passwordInputChanged.bind(this)} />
              <TouchableOpacity onPress={this.loginBtnClicked.bind(this)}>
                <View style={ Styles.btn }>
                  <Image source={Assets.check} style={{ width: Metrics.iconSize * 1.5, height: Metrics.iconSize * 1.5}} resizeMode='cover'/>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('reset')}>
                <Text style={{fontSize: 16, color: 'white', backgroundColor: 'transparent', marginTop: Metrics.padding * 2}}> Forgot your password? </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </ActivityComponent>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return ({
    setNavigation: navigation => dispatch(setNavigation(navigation)),
    setUser: user => dispatch(setUser(user))
  });
};

export default connect(null, mapDispatchToProps)(LoginScreen);