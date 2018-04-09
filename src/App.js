/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from 'react';

import {Platform} from 'react-native';
import {registerScreens, registerScreenVisibilityListener} from './screens';
import {Navigation} from 'react-native-navigation';
import Icon from "react-native-vector-icons/Ionicons";

registerScreens();
registerScreenVisibilityListener();

async function prepareIcons() {
    const icons = await Promise.all([
        Icon.getImageSource(Platform.OS === 'ios' ? 'ios-home' : 'material-home', 20),
        Icon.getImageSource(Platform.OS === 'ios' ? 'ios-folder-open' : 'material-folder', 20)
    ]);
    const [home, categories] = icons;
    return {home, categories};
}


async function startApp() {
    const icons = await prepareIcons();
    const tabs = [
        {
            label: 'Latest',
            screen: 'posts.List',
            title: 'Latest Recipes',
            icon: icons.home
        },
        {
            label: 'Categories',
            screen: 'categories.List',
            title: 'Recipe Categories',
            icon: icons.categories
        }
    ];
    Navigation.startTabBasedApp({
        tabs,
        animationType: Platform.OS === 'ios' ? 'slide-down' : 'fade',
    });
}

startApp();