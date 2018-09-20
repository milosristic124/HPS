

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
import Grid from 'react-native-grid-component';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import ModalSelector from 'react-native-modal-selector';

import Styles from './styles';
import Assets from '../../../assets';
import Metrics from '../../themes/Metrics';
import Colors from '../../themes/Colors';
import { ActivityComponent, ImageTextInput, Navbar, PointInput } from '../../components';

const auth = firebase.auth();
const database = firebase.database();

class DashboardScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      houselist: [],
      schoolid: props.user.schoolid
    };
  }

  componentDidMount() {
    let ref = database.ref(`houses/${this.state.schoolid}`);
    ref.on('value', (snapshot) => {
      var ary = [];
      let index= 0;
      snapshot.forEach(element => {
        ary.push({index: index++, value: element.val() });
      });
      this.setState({
        houselist: ary
      });
    });
  }

  menuBtnClicked() {
    this.props.navigation.openDrawer();
  }

  resetAll() {
    let ref = database.ref(`houses/${this.state.schoolid}`);
    let obj = {};
    for(var i =0; i< this.state.houselist.length; i++) {
      obj[`/${i}/point`] = 0;
    }
    ref.update(obj, () => {
      this.refs.main.hideIndicator();  
    });
  }

  reset(index) {
    let ref = database.ref(`houses/${this.state.schoolid}/${index}`);
    ref.update({
      point: 0
    }, () => {
      
    });
  }

  resetBtnClicked(option) {
    Alert.alert(
      'Confirm', 
      'Are you sure you want to ' + option.label + ' to 0?', 
      [
        {text: 'No'},
        {text: 'Yes', onPress: () => {
          this.refs.main.showIndicator();
          if(option.key == 0){
            this.resetAll();
          }else{
            this.reset(option.key - 1);
          }
        }},
      ],
      { cancelable: false }
    );
    return;
  }

  itemClicked(params) {
    this.props.navigation.navigate('house', {data: params[0], index: params[1], schoolid: this.state.schoolid });
  }

  _renderItem = (data, i) => (
      <TouchableOpacity onPress={this.itemClicked.bind(this, [data.value, data.index])} key={data.index}>
        <View style={ Styles.item }>
          <FastImage source={{uri: data.value.url, priority: FastImage.priority.normal}} style={{flex: 1}} resizeMode={FastImage.resizeMode.contain}/>
          <PointInput value={data.value.point} icon={Assets.edit_btn} style={{width: Metrics.screenWidth / 2 - Metrics.padding, height: 60}} />
        </View>
      </TouchableOpacity>
  );

  _renderItem1 = (data, i) => (
    <View style={ Styles.item }>
      <FastImage source={{uri: data.value.url, priority: FastImage.priority.normal}} style={{flex: 1}} resizeMode={FastImage.resizeMode.contain}/>
      <PointInput value={data.value.point} icon={Assets.edit_btn} style={{width: Metrics.screenWidth / 2 - Metrics.padding, height: 60}} />
    </View>
  );

  render() {
    let optionsAry = [{key: 0, label: 'Reset All Houses'}];
    this.state.houselist.forEach(house => {
      optionsAry.push({key: house.index + 1, label: 'Reset ' + house.value.name});
    });

    return (
      <ActivityComponent ref='main'>
        <ImageBackground
          style={Styles.container}
          source={Assets.background}
          resizeMode='cover'
        >
        {
          this.props.user.isadmin
          ?
          <Navbar
            left={Assets.menubtn}
            leftHandler={this.menuBtnClicked.bind(this)}
            title='House Dashboard'
            logo={Assets.logo}
            rightData={optionsAry}
            right={Assets.resetbtn}
            rightHandler={this.resetBtnClicked.bind(this)} />
          :
          <Navbar
            left={Assets.menubtn}
            leftHandler={this.menuBtnClicked.bind(this)}
            title='House Dashboard'
            logo={Assets.logo} />
        } 
          
          <View style={Styles.contentView}>
            <Grid
              style={Styles.list}
              renderItem={this.props.user.iseditable ? this._renderItem : this._renderItem1}
              data={this.state.houselist}
              itemsPerRow={2}
            />
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

export default connect(mapStateToProps, null)(DashboardScreen);
