

import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Switch
} from 'react-native';
import firebase from '../../firebase';
import { NavigationActions } from 'react-navigation';
import ModalSelector from 'react-native-modal-selector';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';

import Styles from './styles';
import Assets from '../../../assets';
import Metrics from '../../themes/Metrics';
import Colors from '../../themes/Colors';
import { Navbar, ActivityComponent, ImageTextInput } from '../../components';

const auth = firebase.auth();
const database = firebase.database();

class HouseScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPoint: 0,
      points: [],
      data: {name: '', point: 0, url: ''},
      index: props.navigation.state.params.index,
      schoolid: props.navigation.state.params.schoolid,
      switch: true
    };
  }

  componentDidMount() {
    let ref = database.ref(`schools/${this.state.schoolid}`);
    ref.on('value', (snapshot) => {
      var ary = [];
      let index = 0;
      snapshot.forEach((child) => {
        ary.push({key: index++, label: child.val() + (child.val()<=1 ? ' Point' : ' Points')});
      });

      this.setState({
        ...this.state,
        points: ary
      });
    });
    let ref1 = database.ref(`houses/${this.state.schoolid}/${this.state.index}`);
    ref1.on('value', (snapshot) => {
      this.setState({
        ...this.state,
        data: snapshot.val()
      })
    });
  }

  backBtnClicked() {
    // this.props.navigation.state.params.apply(this.state.data, this.state.index);
    this.props.navigation.goBack();
  }

  checkBtnClicked() {
    if (!this.state.selectedPoint) {
      Alert.alert(
        'Error', 
        'Select the point from the list.', 
        [
          {text: 'No'},
        ],
        { cancelable: false }
      );
      return;
    }
    let ref = database.ref(`houses/${this.state.schoolid}/${this.state.index}`);
    let data = Object.assign({}, this.state.data);
    data.point += (this.state.switch ? 1 : -1) * this.state.selectedPoint;
    console.log(data);
    
    //Update point
    ref.update(data, () => {
      this.setState({
        ...this.state,
        data: data
      });
      Alert.alert(
        'Success', 
        `${this.state.selectedPoint} Points ${this.state.switch ? 'added' : 'removed'}`, 
        [
          {text: 'OK', onPress: () => this.backBtnClicked()},
        ],
        { cancelable: false }
      );
    });

    this.updatePointHistory();
  }

  updatePointHistory = () => {
    let ref_history = database.ref(`point_histories/`);
    let point_history = {};
    let history_key = Math.floor(new Date() / 1000) + this.props.user.uid;
    let date = new Date();
    let day_1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    let day_2 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    let day_begin = Math.floor(day_1 / 1000);
    let day_end = Math.floor(day_2 / 1000);
    //Update user point history
    ref_history.child(`${history_key}`).set({
      date: Math.floor(new Date() / 1000),
      house_id: this.state.index,
      point: (this.state.switch ? 1 : -1) * this.state.selectedPoint,
      school_id: this.state.schoolid,
      user_id: this.props.user.uid,
      filter_all: `${this.props.user.uid}_${this.state.index}_${day_begin}_${day_end}`,
      filter_house_date: `${this.state.index}_${day_begin}_${day_end}`,
      filter_user_date: `${this.props.user.uid}_${day_begin}_${day_end}`,
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
            title={this.state.data.name}
            logo={Assets.logo}
          />
          <View style={Styles.contentView}>
            <View style={Styles.pointContainer}>
              <Text
                style={{
                  fontSize: 32,
                  backgroundColor: 'transparent',
                  color: '#bcbcbd',
                  fontWeight: '800'
                }}
              >
                {this.state.data.point + ' POINTS'}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FastImage 
                source={{uri: this.state.data.url, priority: FastImage.priority.normal}} 
                style={{ flex: 0.8, width: Metrics.screenWidth * 0.8 }}
                resizeMode={FastImage.resizeMode.contain}/>
            </View>
            <View
              style={{
                width: Metrics.screenWidth,
                height: 80,
                paddingHorizontal: Metrics.padding * 2,
                marginBottom: 40,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <View
                style={{
                  height: 60,
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Switch
                  onTintColor={Colors.btnColor1}
                  value={this.state.switch}
                  disabled={!this.props.user.isremovable}
                  onValueChange={state => {
                    this.setState({ ...this.state, switch: state });
                  }}
                />
                <Text
                  style={{
                    color: Colors.btnColor1,
                    backgroundColor: 'transparent',
                    fontSize: 16
                  }}
                >
                  {this.state.switch ? 'Add points' : 'Remove points'}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  height: 60,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderColor: 'white',
                  borderWidth: 1,
                  borderRadius: 5,
                  marginLeft: Metrics.padding
                }}>

                <ModalSelector
                    data={this.state.points}
                    initValue='Select Points'
                    cancelText='Cancel'
                    style={{flex: 1}}
                    // selectStyle={{borderColor: 'transparent'}}
                    // selectTextStyle={{fontSize: 20, color: 'white', fontWeight: 'bold', backgroundColor: 'transparent'}}
                    optionStyle={{height: 40, alignItems: 'center', justifyContent: 'center'}}
                    optionTextStyle={{fontSize: 16, fontWeight: 'bold'}}
                    cancelStyle={{height: 40, alignItems: 'center', justifyContent: 'center'}}
                    cancelTextStyle={{fontSize: 16, fontWeight: 'bold'}}
                    onChange={(option)=>{ 
                      this.setState({ selectedPoint: parseInt(option.label.split(' ')[0]) });
                    }}>
                    <TextInput
                        style={{height: 80, fontSize: 20, color: 'white', backgroundColor: 'transparent', fontWeight: 'bold', paddingLeft: 10, textAlign: 'center', textAlignVertical: 'center'}}
                        editable={false}
                        placeholder='Select Points'
                        placeholderTextColor='white'
                        underlineColorAndroid='transparent'
                        value={ this.state.selectedPoint ? (this.state.switch ? '+' : '-') + this.state.selectedPoint : null} />
                </ModalSelector>
                <TouchableOpacity onPress={this.checkBtnClicked.bind(this)}>
                  <Image
                    source={Assets.check_btn}
                    resizeMode='contain'
                    style={{ height: 58, width: 58 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
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

export default connect(mapStateToProps, null)(HouseScreen);
