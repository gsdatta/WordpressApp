/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from 'react';

import {Platform} from 'react-native';
import {registerScreens} from './screens';
import {Layout, Navigation} from 'react-native-navigation';
import Icon from "react-native-vector-icons/Ionicons";

async function prepareIcons() {
    const icons = await Promise.all([
        Icon.getImageSource(Platform.OS === 'ios' ? 'ios-home' : 'md-home', 20),
        Icon.getImageSource(Platform.OS === 'ios' ? 'ios-folder-open' : 'md-folder', 20),
        Icon.getImageSource(Platform.OS === 'ios' ? 'ios-bookmark' : 'md-bookmark', 20)
    ]);
    const [home, categories, bookmarks] = icons;
    return {
        home,
        categories,
        bookmarks
    };
}

function getStandardComponent(screenName: string, tabText: string): Layout {
    return {
        component: {
            name: screenName,
            options: {
                topBar: {
                    visible: true,
                    title: {
                        text: tabText
                    },
                    background: {
                        translucent: true
                    },
                    drawBehind: true
                }
            }
        }
    }
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
                                        titleDisplayMode: 'alwaysShow',
                                        translucent: true,
                                        drawBehind: true
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
                                            titleDisplayMode: 'alwaysShow',
                                            translucent: true,
                                            drawBehind: true
                                        }
                                    }
                                }
                            },
                            {
                                stack: {
                                    children: [
                                        getStandardComponent('posts.Saved', 'Saved'),
                                    ],
                                    options: {
                                        bottomTab: {
                                            text: 'Saved',
                                            icon: icons.bookmarks,
                                            selectedIconColor: 'blue',
                                        },
                                        bottomTabs: {
                                            titleDisplayMode: 'alwaysShow',
                                            translucent: true,
                                            drawBehind: true
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            });
        });
    });
}