/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from 'react';

import { Platform } from 'react-native';
import { registerScreens } from './screens';
import { Navigation } from 'react-native-navigation';
import Icon from "react-native-vector-icons/Ionicons";

async function prepareIcons() {
    const icons = await Promise.all([
        Icon.getImageSource(Platform.OS === 'ios' ? 'ios-home' : 'md-home', 20),
        Icon.getImageSource(Platform.OS === 'ios' ? 'ios-folder-open' : 'md-folder', 20)
    ]);
    const [home, categories] = icons;
    return {
        home,
        categories
    };
}

function getStandardComponent(screenName, tabText) {
  return {component: {
      name: screenName,
      options: {
          topBar: {
              visible: true,
              title: {
                  text: tabText
              }
          },
          background: {
            translucent: true
          },
          drawBehind: true
      }
  }}
}

export default async function start() {
    console.log("STARTING UP");
    Navigation.events().registerAppLaunchedListener(() => {
        console.log("APP LAUNCHING!!");

        registerScreens();
        prepareIcons().then((icons) => {
            console.log("ICONS READY");

            Navigation.setRoot({
                root: {
                    bottomTabs: {
                        children: [{
                            stack: {
                                id: 'latestRecipes',
                                children: [
                                  getStandardComponent('posts.List', 'Latest Recipes')
                                ],
                                options: {
                                    bottomTab: {
                                        text: 'Latest',
                                        icon: icons.home,
                                        selectedIconColor: 'blue',
                                    },
                                    bottomTabs: {
                                        titleDisplayMode: 'alwaysShow'
                                    },
                                }
                            }
                        },
                            {
                                stack: {
                                    children: [
                                      getStandardComponent('categories.List', 'Categories'),
                                    ],
                                    options: {
                                        bottomTab: {
                                            text: 'Categories',
                                            icon: icons.categories,
                                            selectedIconColor: 'blue',
                                        },
                                        bottomTabs: {
                                            titleDisplayMode: 'alwaysShow'
                                        }
                                    }
                                }
                            }]
                    }
                }
            });
        });
    });
}