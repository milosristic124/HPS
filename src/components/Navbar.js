

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';

import Assets from '../../assets';
import Metrics from '../themes/Metrics';
import Colors from '../themes/Colors';

export default class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ImageBackground
        style={Styles.container}
        source={Assets.navbar}
        resizeMode="cover"
      >
        <View style={Styles.statusbar} />
        <View style={Styles.navbar}>
          <TouchableOpacity onPress={this.props.leftHandler}>
            <Image
              source={this.props.left}
              style={{flex: 0, width: 32, height: 24, alignItems: "center"}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              height: Metrics.navbarHeight,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image source={this.props.logo} resizeMode="contain" style={{height: Metrics.navbarHeight * 0.8, width: 40, tintColor: 'white'}}/>
              <Text style={{color: "white", fontSize: 18, backgroundColor: "transparent"}}> 
                {this.props.title}
              </Text>
          </View>
          {
            this.props.rightData
            ?
            <View style={{flex:0, width: 32, height: 24, alignItems: "center"}}>
              <ModalSelector
                data={this.props.rightData}
                cancelText="Cancel"
                style={{flex: 1}}
                // selectTextStyle={{fontSize: 20, color: "white", fontWeight: "bold", backgroundColor: "transparent"}}
                optionStyle={{height: 40, alignItems: "center", justifyContent: "center"}}
                optionTextStyle={{fontSize: 16, fontWeight: "bold"}}
                cancelStyle={{height: 40, alignItems: "center", justifyContent: "center"}}
                cancelTextStyle={{fontSize: 16, fontWeight: "bold"}}
                onChange={this.props.rightHandler}>
                  <Image source={this.props.right} style={{flex:0, width: 32, height: 24, alignItems: "center"}} resizeMode="contain" />
              </ModalSelector>
            </View>
            :
            <TouchableOpacity onPress={this.props.rightHandler}>
              <Image
                source={this.props.right}
                style={{flex:0, width: 32, height: 24, alignItems: "center" }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          }
          
        </View>
      </ImageBackground>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: "center",
    width: Metrics.screenWidth,
    height: Metrics.navbarHeight + Metrics.statusbarHeight,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#36393e"
  },
  statusbar: {
    flex: 0,
    width: Metrics.screenWidth,
    height: Metrics.statusbarHeight,
    backgroundColor: Colors.statusbarBg
  },
  navbar: {
    flex: 0,
    height: Metrics.navbarHeight,
    width: Metrics.screenWidth,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Metrics.padding
  }
});
