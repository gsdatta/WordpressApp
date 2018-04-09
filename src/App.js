/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from 'react';

import {Platform} from 'react-native';
import {registerScreens, registerScreenVisibilityListener} from './screens';
import {Navigation} from 'react-native-navigation';

registerScreens();
registerScreenVisibilityListener();

const tabs = [
    {
        'label': 'Latest',
        'screen': 'posts.List',
        'title': 'Latest Recipes'
    },
    {
        'label': 'Categories',
        'screen': 'categories.List',
        'title': 'Recipe Categories'
    }
];

Navigation.startTabBasedApp({
    tabs,
    animationType: Platform.OS === 'ios' ? 'slide-down' : 'fade',
});