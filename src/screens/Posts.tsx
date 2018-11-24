import React from 'react';
import {AsyncStorage} from 'react-native';
import {WP} from "../stores/wordpress";
import {WP_SERVER} from "../config";
import {Navigation} from 'react-native-navigation';
import {PostList} from '../components';
import {PostMetadata, PostSearchParams} from "../stores/wordpress/models";
import {Bookmarks} from "../stores/bookmarks";


export interface InputProps {
    categoryId: number | undefined;
}

interface Props extends InputProps {
    componentId: string;
}

interface State {
    posts: PostMetadata[];
    categoryId: number | undefined;
    isLoadingMore: boolean;
    canLoadMore: boolean;
    saved: number[];
    refreshing: boolean;
    page: number;
}

export class Posts extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = Posts._getDefaultState();
        this.goToPost = this.goToPost.bind(this);
    }

    static _getDefaultState(): State {
        return {
            posts: [],
            categoryId: undefined,
            isLoadingMore: false,
            canLoadMore: true,
            saved: [],
            refreshing: false,
            page: 1
        };
    }

    async componentDidMount() {
        this._getPostData(this.props.categoryId);

        let saved = [];
        try {
            let s = await AsyncStorage.getItem('@Swayampaaka:saved_items');
            console.log(`Items currently saved: ${s}`);
            if (s !== null) {
                saved = JSON.parse(s);
            }
        } catch (error) {
            console.log(error);
        }

        this.setState({
            saved: saved
        });
    }

    _getPostData(categoryId?: number) {
        let params = new PostSearchParams();
        console.log(`Loading list of posts for category [${categoryId}]`);

        if (categoryId) {
            this.setState({
                categoryId: categoryId
            });
            params.categoryId = categoryId;
        }

        params.page = this.state.page;

        return new WP(WP_SERVER).posts(params)
            .then(cat => {
                let posts = this.state.posts;

                Array.prototype.push.apply(posts, cat);
                console.log(cat);

                let nextPage = this.state.page + 1;

                this.setState({
                    posts: posts,
                    canLoadMore: cat.length !== 0,
                    page: nextPage,
                    refreshing: false,
                    isLoadingMore: false
                });
            })
            .catch(err => {
                console.log(err);

                this.setState({
                    isLoadingMore: false,
                    refreshing: false,
                    canLoadMore: false
                });
            });
    }

    _onRefresh = () => {
        this.setState({
            refreshing: true
        });

        this._getPostData(this.state.categoryId).then(() => {
            this.setState({
                refreshing: false
            });
        }).catch((err) => this.setState({
            refreshing: false
        }));
    };

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

    render() {
        return (
            <PostList
                posts={this.state.posts}
                onPostPress={this.goToPost}
                onEndReached={() => {
                    if (!this.state.isLoadingMore && this.state.canLoadMore) {
                        this.setState({
                            isLoadingMore: true
                        });
                        this._getPostData(this.state.categoryId);
                    }
                }}
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
                footerLoading={this.state.isLoadingMore}
                showExcerpt={false}
            />
        );
    }
}