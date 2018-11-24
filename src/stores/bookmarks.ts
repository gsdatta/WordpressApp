import {AsyncStorage} from "react-native";

export async function removePost(postId: number): Promise<number[]> {
    let posts = await getSavedPosts();

    return savePosts(posts.filter(p => p !== postId));
}

export async function savePost(postId: number): Promise<number[]> {
    let posts = await getSavedPosts();
    if (posts.includes(postId)) {
        return posts;
    }

    return savePosts(posts.concat(postId));
}

export async function getSavedPosts(): Promise<number[]> {
    let postString = await AsyncStorage.getItem('@Swayampaaka:saved_items');

    if (postString == null) {
        return [];
    }

    return JSON.parse(postString);
}

export async function savePosts(posts: number[]): Promise<number[]> {
    try {
        AsyncStorage.setItem('@Swayampaaka:saved_items', JSON.stringify(posts));
        return posts;
    } catch (error) {
        console.log(error);
        return error;
    }
}