import React, { Component } from 'react';
import {
  View,
  Image,
  TextInput, 
  StyleSheet
} from 'react-native';

import Assets from '../../assets';
import Metrics from '../themes/Metrics';
import Colors from '../themes/Colors';

export default class ImageTextInput extends Component {
  constructor(props) {
    super(props);

  }

  clear() {
    this.refs.text.clear();
  }

  render() {
    return (  
      <View style={{ 
        backgroundColor: 'transparent',
        paddingHorizontal: Metrics.padding,
        borderWidth: 1,
        paddingVertical: 5,
        borderRadius: 5, 
        borderColor: 'white',
        flexDirection: 'row', 
        alignItems:'center',
        justifyContent: 'flex-start', 
        width: Metrics.screenWidth * 0.8,
        height: Metrics.itemHeight,
        ...this.props.style}}>
        <View style={{ height: Metrics.itemHeight - 10, width: Metrics.iconSize + 5 }}>
          <Image source={ this.props.icon } style={{ flex: 1, width: Metrics.iconSize }} resizeMode='contain'/> 
        </View> 
        <View style={{ flex: 1, height: Metrics.itemHeight, marginLeft: 15, justifyContent: 'center'}}>
          <TextInput 
            style={ Styles.input} 
            placeholder={this.props.placeholder}
            placeholderTextColor='white'
            defaultValue={this.props.text}
            secureTextEntry={this.props.secureTextEntry}
            autoCapitalize='none'
            underlineColorAndroid='transparent'
            onChangeText={(text) => this.props.func(text)}
            ref='text'
            />
        </View>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  input: {
    fontSize: 20,
    color: 'white',
  }
});