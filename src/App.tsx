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
        Icon.getImageSource(Platform.OS === 'ios' ? 'ios-bookmark' : 'md-bookmark', 20),
        Icon.getImageSource(Platform.OS === 'ios' ? 'ios-search' : 'md-search', 20)
    ]);
    const [home, categories, bookmarks, search] = icons;
    return {
        home,
        categories,
        bookmarks,
        search
    };
}

function getStandardComponent(screenName: string, tabText: string, topVisible: boolean = true, drawBehind: boolean = Platform.OS === "ios"): Layout {
    let layout: Layout = {
        component: {
            name: screenName,
            options: {
                topBar: {
                    visible: topVisible,
                    drawBehind: drawBehind,
                    title: {
                        text: tabText
                    },
                },
                bottomTabs: {
                    translucent: true,
                    drawBehind: true
                }
            }
        }
    };

    if (Platform.OS === 'ios') {
        Object.assign(layout!.component!.options!.topBar, {
            background: {
                translucent: true
            },
        });
    }

    console.log(layout);

    return layout;
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
                                        // drawBehind: true
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
                                            drawBehind: Platform.OS === "ios"
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
                                            drawBehind: Platform.OS === "ios"
                                        }
                                    }
                                }
                            },
                            {
                                stack: {
                                    children: [
                                        getStandardComponent('posts.Search', 'Search', false, true)
                                    ],
                                    options: {
                                        bottomTab: {
                                            text: 'Search',
                                            icon: icons.search,
                                            selectedIconColor: 'blue',
                                        },
                                        bottomTabs: {
                                            titleDisplayMode: 'alwaysShow',
                                            translucent: true,
                                            drawBehind: Platform.OS === "ios"
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