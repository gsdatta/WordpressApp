import React from 'react';
import {AsyncStorage} from 'react-native';
import {WP} from "../stores/wordpress";
import {WP_SERVER} from "../config";
import {Navigation} from 'react-native-navigation';
import {PostList} from '../components';
import {PostMetadata} from "../stores/wordpress/models";
import {Bookmarks} from "../stores/bookmarks";


export interface InputProps {
    categoryId: number | undefined;
}

interface Props extends InputProps {
    componentId: string;
}

interface State {
    saved: PostMetadata[];
    refreshing: boolean;
}

export class Saved extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = Saved._getDefaultState();
        this.goToPost = this.goToPost.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    static _getDefaultState(): State {
        return {
            saved: [],
            refreshing: true,
        };
    }

    async componentDidMount() {
       this.onRefresh();
    }

    _getPostData(savedIds: number[]) {
        savedIds.forEach( id => {
            console.log(id);
            new WP(WP_SERVER).post(Number(id))
                .then(post => {
                    console.log(post);
                    this.setState((prevState: State) => {
                        return {saved: prevState.saved.concat(post)};
                    })
                })
                .catch(err => {
                    console.log(err);

                    this.setState({
                        refreshing: false,
                    });
                });

        });
    }

    goToPost = (post: PostMetadata) => {
        console.log(`ComponentId: ${this.props.componentId}`);
        console.log(`Loading post [${post.id}]`);
        Navigation.push(this.props.componentId, {
            component: {
                name: 'posts.Single',
                passProps: {
                    postId: post.id
                }
            }
        });
    };

    async onRefresh() {
        this.setState({saved: []});
        let saved = await Bookmarks.getSavedPosts();
        this._getPostData(saved);
    }

    savePost = (post: PostMetadata) => {

    };

    unlikePost = (post: PostMetadata) => {
        this.setState((state: State) => {
            return {
                saved: state.saved.filter(p => p.id != post.id)
            }
        })
    };

    render() {
        return (
            <PostList
                posts={this.state.saved}
                onPostPress={this.goToPost}
                onUnlike={this.unlikePost}
                onEndReached={() => {
                }}
                refreshing={false}
                onRefresh={this.onRefresh}
                footerLoading={false}
                showExcerpt={false}
            />
        );
    }
}