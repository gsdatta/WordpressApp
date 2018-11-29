import {Navigation} from "react-native-navigation";
import {Categories} from './Categories';
import {Posts} from './Posts';
import {SinglePost} from "./SinglePost";
import {Saved} from "./Saved";
import {Search} from "./Search";
import {SaveButton} from "../components";

export function registerScreens(): void {
    Navigation.registerComponent('categories.List', () => Categories);
    Navigation.registerComponent('posts.List', () => Posts);
    Navigation.registerComponent('posts.Single', () => SinglePost);
    Navigation.registerComponent('posts.Saved', () => Saved);
    Navigation.registerComponent('posts.Search', () => Search);
    Navigation.registerComponent('post.Save', () => SaveButton);
}