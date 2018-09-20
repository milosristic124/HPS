

import React, { Component } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View
} from 'react-native';

export default class ActivityComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: false
    };
  }

  showIndicator() {
    this.setState({
      progress: true
    });
  }
  
  hideIndicator() {
    this.setState({
      progress: false
    });
  }

  render() {
    return (
      <View style={Styles.container}>
        {this.props.children}
        {
          this.state.progress ?
          <View style={Styles.progressbarContainer}>
            <ActivityIndicator size='large' color='white' animating={true}/>
          </View>
          : null
        }
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
});