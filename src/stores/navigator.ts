import {PostMetadata} from "./wordpress/models";
import {Navigation} from "react-native-navigation";

export async function navigateToPost(componentId: string, post: PostMetadata) {
    console.log(`Navigating to post using componentId [${componentId}]`);
    console.log(`Loading post [${post.id}]`);
    await Navigation.push(componentId, {
        component: {
            name: 'posts.Single',
            passProps: {
                postId: post.id
            }
        }
    });
}

export function showPostPreview(componentId: string, post: PostMetadata): ((reactTag?: any) => void){
    return async ({reactTag}) => {
        await Navigation.push(componentId, {
            component: {
                name: 'posts.Single',
                passProps: {
                    postId: post.id
                },
                options: {
                    preview: reactTag ? {
                        reactTag,
                        commit: true
                    } : undefined,
                }
            }
        });
    }
};
