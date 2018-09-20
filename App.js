/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, View, StatusBar } from "react-native";

import { Provider } from "react-redux";
import configureStore from "./configureStore";

import Navigator from './src/components/Navigator';
import Metrics from './src/themes/Metrics';
import Colors from './src/themes/Colors';

const store = configureStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <View style={{ flex: 1, backgroundColor: Colors.statusbarBg }}>
          <StatusBar barStyle="light-content" />
          <Navigator />
        </View>
      </Provider>
    );
  }
}
