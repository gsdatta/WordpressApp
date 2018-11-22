import { createStackNavigator } from 'react-navigation';
import {Categories} from './Categories';
import {Posts} from './Posts';
import {PostsScreen} from "./Post";

export const CategoriesStack = createStackNavigator({
  Categories: Categories,
  Posts: Posts,
  Post: PostsScreen
});

export const PostsStack = createStackNavigator({
  Posts: Posts,
  Post: PostsScreen
});
