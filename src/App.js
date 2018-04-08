/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { registerScreens, registerScreenVisibilityListener } from './screens';
import { Navigation } from 'react-native-navigation';

registerScreens();
registerScreenVisibilityListener();

const tabs = [{
  'label': 'Categories',
  'screen': 'categories.List',
  'title': 'Categories List'
}]

Navigation.startTabBasedApp({
  tabs,
  animationType: Platform.OS === 'ios' ? 'slide-down' : 'fade',
})