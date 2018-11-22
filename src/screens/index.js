import { Navigation } from "react-native-navigation";
import { Categories } from './Categories';
import { Posts } from './Posts';
import { PostsScreen } from "./Post";

export function registerScreens() {
    Navigation.registerComponent('categories.List', () => Categories);
    Navigation.registerComponent('posts.List', () => Posts);
    Navigation.registerComponent('posts.Single', () => PostsScreen);
}