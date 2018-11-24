import {AsyncStorage} from "react-native";
import PubSub from 'pubsub-js';

export const SAVED_POSTS: string = 'SAVED_POSTS';

export interface BookmarkMessage {
    saved?: number;
    removed?: number;
}

export class Bookmarks {

    static async removePost(postId: number): Promise<number[]> {
        let posts = await Bookmarks.getSavedPosts();
        PubSub.publish(SAVED_POSTS, {removed: postId});

        return Bookmarks.savePosts(posts.filter(p => p !== postId));
    }

    static async savePost(postId: number): Promise<number[]> {
        let posts = await Bookmarks.getSavedPosts();
        if (posts.includes(postId)) {
            return posts;
        }

        PubSub.publish(SAVED_POSTS, {saved: postId});
        return Bookmarks.savePosts(posts.concat(postId));
    }

    static async getSavedPosts(): Promise<number[]> {
        let postString = await AsyncStorage.getItem('@Swayampaaka:saved_items');

        if (postString == null) {
            return [];
        }

        return JSON.parse(postString);
    }

    static async savePosts(posts: number[]): Promise<number[]> {
        try {
            AsyncStorage.setItem('@Swayampaaka:saved_items', JSON.stringify(posts));
            return posts;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}


