import React from 'react';
import { ActivityIndicator, AsyncStorage, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { View, Text } from 'native-base';
import { WP } from "../wordpress";
import { WP_SERVER } from "../config";
import Icon from "react-native-vector-icons/Ionicons";
import { Navigation } from 'react-native-navigation';
import { PostList } from '../components';

export class Posts extends React.Component {
    constructor(props) {
        super(props);

        this.state = this._getDefaultState();
        this.goToPost = this.goToPost.bind(this);
    }

    _getDefaultState() {
        return {
            posts: [],
            categoryId: null,
            isLoadingMore: false,
            saved: [],
            refreshing: false,
            page: 1
        };
    }

    async componentDidMount() {
        this._getPostData(this.props.categoryId);
        let saved = [];
        try {
            let s = await AsyncStorage.getItem('@Swayampaaka:saved_items')
            console.log(`Items currently saved: ${s}`);
            if (s !== null) {
                saved = JSON.parse(s);
            }
        } catch ( error ) {
            console.log(error);
        }

        this.setState({
            saved: saved
        });
    }

    _getPostData(categoryId) {
        let params = {};
        console.log(`Loading list of posts for category [${categoryId}]`);

        if (categoryId) {
            this.state.categoryId = categoryId;
            params.categories = categoryId;
        }

        params.page = this.state.page;

        return new WP(WP_SERVER).posts(params)
            .then(cat => {
                let posts = this.state.posts;

                Array.prototype.push.apply(posts, cat);

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
    }

    goToPost = (post) => {
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
    }

    savePost = (post) => {
        let posts = this.state.saved;
        if (posts.includes(post.id)) {
            posts = posts.filter(p => p !== post.id);
        } else {
            posts.push(post.id);
        }

        AsyncStorage.setItem('@Swayampaaka:saved_items', JSON.stringify(posts)).then(s => console.log(s)).catch(e => console.log(e));
        this.setState({
            saved: posts
        });
    };    

    render() {
        return (
                <PostList
                    posts={this.state.posts}
                    onPostPress={this.goToPost}
                    onLike={this.savePost}
                    isLiked={(post) => this.state.saved.includes(post.id)}
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
                />
        );
    }
}