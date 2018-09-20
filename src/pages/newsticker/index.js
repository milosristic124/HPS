

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
  TouchableHighlight,
  ImageBackground,
  Alert,
} from 'react-native';
import firebase from '../../firebase';
import { NavigationActions } from 'react-navigation';
import Prompt from '../react-native-prompt';
import Swipeable from 'react-native-swipeable';

import Styles from './styles';
import Assets from '../../../assets';
import Metrics from '../../themes/Metrics';
import Colors from '../../themes/Colors';
import { ActivityComponent, ImageTextInput, Navbar } from '../../components';

const auth = firebase.auth();
const database = firebase.database();

export default class NewstickerScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      promptVisible: false,
      promptInput: "",
      schoolid: props.navigation.state.params[0],
      announcements: []
    };
  }

  componentDidMount() {
    let ref = database.ref(`announcements/${this.state.schoolid}`);
    ref.on("value", snapshot => {
      var announcements = [];
      let index = 0;
      snapshot.forEach(child => {
        announcements.push({
          key: index++,
          value: child.val()
        });
      });
      this.setState({
        ...this.state,
        announcements: announcements
      });
    });
  }

  swipeable = null;

  menuBtnClicked() {
    this.props.navigation.openDrawer();
  }

  addBtnClicked() {
    this.setState({
      ...this.state,
      promptVisible: true
    });
  }

  sortNumber(a, b) {
    return a - b;
  }

  addAnnouncement(value) {
    this.refs.main.showIndicator();
    let ary = this.state.announcements.slice();
    ary.push({key: ary.length + 1, value: value});
    // firebase
    let ref = database.ref(`announcements/${this.state.schoolid}`);
    var obj = {};
    let index = 0;
    ary.forEach(item => {
      obj[index++] = item.value;
    });

    ref.update(obj, () => {
      let result = [];
      ary.forEach((item, index) => {
        result.push({key: index + 1, value: item.value});
      });
      this.setState({
        ...this.state,
        announcements: result,
        promptVisible: false,
        promptInput: parseInt(value)
      });
      this.refs.main.hideIndicator();
    });
  }

  deleteBtnClicked(params) {
    let ary = this.state.announcements.slice();
    ary.splice(parseInt(params[0]), 1);
    this.swipeable.recenter();

    //firebase
    this.refs.main.showIndicator();
    let ref = database.ref(`announcements/${this.state.schoolid}`);
    var obj = {};
    let index = 0;
    ary.forEach(item => {
      obj[index++] = item.value;
    });
    console.log(obj);

    ref.set(obj, (error) => {
      let result = [];
      let index = 0;
      ary.forEach(item => {
        result.push({
          key: index++,
          value: item.value
        });
      });

      this.setState({
        ...this.state,
        announcements: result
      });
      this.refs.main.hideIndicator();
    });
  }

  render() {
    const rightButtons = [
      <TouchableOpacity onPress={this.deleteBtnClicked.bind(this)}>
        <View style={{width: 75, height: 50, backgroundColor: "red",alignItems: "center", justifyContent: "center", marginLeft: Metrics.padding}}>
          <Text style={{fontSize: 16, fontWeight: "normal", color: "white", backgroundColor: "transparent"}}>DELETE</Text>
        </View>
      </TouchableOpacity>
    ];

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
            title="News Ticker"
            logo={Assets.master_news}
          />
          <ScrollView style={Styles.contentView}>
            <View>
              {
                this.state.announcements.map((item, index) => {
                  return (
                    <Swipeable 
                      key={index} 
                      rightButtons={[
                        <TouchableOpacity onPress={this.deleteBtnClicked.bind(this, [index])}>
                          <View style={{width: 75, height: 50, backgroundColor: "red",alignItems: "center", justifyContent: "center", marginLeft: Metrics.padding}}>
                            <Text style={{fontSize: 16, fontWeight: "normal", color: "white", backgroundColor: "transparent"}}>DELETE</Text>
                          </View>
                        </TouchableOpacity>
                      ]} 
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
                      <View style={Styles.userItem}>
                        <Text
                          style={{
                            fontSize: 18,
                            color: "white",
                            backgroundColor: "transparent"
                          }}>
                          {item.value}
                        </Text>
                      </View>
                    </Swipeable>
                  );
                })
              }
            </View>
          </ScrollView>
          <Prompt
            title="Newsticker Input"
            placeholder="Enter a new Newsticker"
            defaultValue=""
            visible={this.state.promptVisible}
            onCancel={() =>
              this.setState({ ...this.state, promptVisible: false })
            }
            onSubmit={this.addAnnouncement.bind(this)}
          />
        </ImageBackground>
      </ActivityComponent>
    );
  }
}
