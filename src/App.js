/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import {Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { CategoriesStack, PostsStack } from './screens';

export const App = createAppContainer(createBottomTabNavigator(
  {
    Latest: PostsStack,
    Categories: CategoriesStack,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Latest') {
            iconName = `${Platform.OS === 'ios' ? 'ios' : 'material'}-home`
        } else if (routeName === 'Categories') {
          iconName = Platform.OS === 'ios' ? 'ios-folder-open' : 'material-folder'
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={horizontal ? 20 : 25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  }
));