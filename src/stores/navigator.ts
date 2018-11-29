import {Category, PostMetadata} from "./wordpress/models";
import {Layout, Navigation} from "react-native-navigation";
import {InputProps as PostProps} from "../screens/Posts";

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
}

export async function navigateToCategoryPostList(componentId: string, category: Category) {
    console.log(`Navigating to category post list using componentId [${componentId}]`);
    console.log(`Loading category ${category.id}`);
    let opts: Layout<PostProps> = {
        component: {
            name: 'posts.List',
            passProps: {
                'categoryId': category.id
            },
            options: {
                topBar: {
                    title: {
                        text: category.name
                    }
                }
            }
        }
    };
    await Navigation.push(componentId, opts);
}

export function showCategoryPostsPreview(componentId: string, category: Category): ((reactTag?: any) => void) {
    return async ({reactTag}) => {
        let opts: Layout<PostProps> = {
            component: {
                name: 'posts.List',
                passProps: {
                    'categoryId': category.id
                },
                options: {
                    topBar: {
                        title: {
                            text: category.name
                        }
                    },
                    preview: reactTag ? {
                        reactTag,
                        commit: true
                    } : undefined,
                }
            }
        };
        await Navigation.push(componentId, opts);
    };
}
