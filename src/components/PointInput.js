import React, { Component } from 'react';
import {
  View,
  Image,
  TextInput, 
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

import Assets from '../../assets';
import Metrics from '../themes/Metrics';
import Colors from '../themes/Colors';

export default class PointInput extends Component {
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
        borderWidth: 1,
        borderRadius: 5, 
        borderColor: 'white',
        flexDirection: 'row', 
        alignItems:'center',
        justifyContent: 'flex-start', 
        ...this.props.style}}>
        <View style={{ flex: 1, height: this.props.style.height, alignItems:'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 18, color: 'white', backgroundColor: 'transparent', fontWeight: 'bold'}}> 
            {this.props.value}
          </Text>
          <Text style={{fontSize: 16, color: 'white', backgroundColor: 'transparent'}}> 
            POINTS
          </Text>
        </View>
        <View>
          <Image source={ this.props.icon } style={{ flex: 1, width: this.props.style.height - 2, height: this.props.style.height - 2}} resizeMode='contain'/> 
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