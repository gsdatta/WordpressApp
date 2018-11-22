/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from 'react';

import {Platform} from 'react-native';
import {registerScreens} from './screens';
import {Navigation} from 'react-native-navigation';
import Icon from "react-native-vector-icons/Ionicons";

async function prepareIcons() {
    const icons = await Promise.all([
        Icon.getImageSource(Platform.OS === 'ios' ? 'ios-home' : 'material-home', 20),
        Icon.getImageSource(Platform.OS === 'ios' ? 'ios-folder-open' : 'material-folder', 20)
    ]);
    const [home, categories] = icons;
    return {home, categories};
}


export default async function start() {
  console.log("STARTING UP");
    registerScreens();
    let icons = await prepareIcons()
    console.log("ICONS READY");
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
    Navigation.events().registerAppLaunchedListener(() => {
      console.log("APP LAUNCHING!!");
        Navigation.setRoot({
          root: {
            bottomTabs: {
              children: [{
                stack: {
                  id: 'latestRecipes',
                  children: [
                    {
                      component: {
                        name: 'posts.List',
                        options: {
                          topBar: {
                            visible: true,
                            title: {
                              text: 'Latest Recipes'
                            }
                          }
                        }
                      }
                    },
                  ],
                  options: {
                    bottomTab: {
                      text: 'Latest',
                      icon: icons.home
                    }
                  }
                }
              },
              {
                stack: {
                  children: [{
                    component: {
                      name: 'categories.List',
                      options: {
                        topBar: {
                          visible: true,
                          title: {
                            text: 'Categories'
                          }
                        }
                      }
                    }
                  }],
                  options: {
                    bottomTab: {
                      text: 'Categories',
                      icon: icons.categories
                    }
                  }
                }
              }]
            }
          }
        });
    });
    // Navigation.startTabBasedApp({
    //     tabs,
    //     animationType: Platform.OS === 'ios' ? 'slide-down' : 'fade',
    // });
}