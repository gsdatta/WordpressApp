import {AsyncStorage} from "react-native";

export class Bookmarks {
    static async removePost(postId: number): Promise<number[]> {
        let posts = await Bookmarks.getSavedPosts();
        return Bookmarks.savePosts(posts.filter(p => p !== postId));
    }

    static async savePost(postId: number): Promise<number[]> {
        let posts = await Bookmarks.getSavedPosts();
        if (posts.includes(postId)) {
            return posts;
        }

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


