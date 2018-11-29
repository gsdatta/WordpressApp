import React from 'react';
import {AsyncStorage, GestureResponderEvent} from 'react-native';
import {WP} from "../stores/wordpress";
import {Navigation} from 'react-native-navigation';
import {PostList} from '../components';
import {PostMetadata, PostSearchParams} from "../stores/wordpress/models";
import {Loading} from "../components/Loading";
import {navigateToPost, showPostPreview} from "../stores/navigator";


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
}

export class Posts extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = Posts._getDefaultState();
    }

    static _getDefaultState(): State {
        return {
            posts: [],
            categoryId: undefined,
            isLoadingMore: false,
            canLoadMore: true,
            saved: [],
            refreshing: false,
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

    _getPostData(categoryId?: number, page: number = 1) {
        let params = new PostSearchParams();
        console.log(`Loading list of posts for category [${categoryId}]`);

        if (categoryId) {
            this.setState({
                categoryId: categoryId
            });
            params.categoryId = categoryId;
        }

        params.page = page;

        return new WP().posts(params)
            .then(cat => {
                let posts = this.state.posts;

                Array.prototype.push.apply(posts, cat);
                console.log(cat);

                this.setState({
                    posts: posts,
                    canLoadMore: cat.length !== 0,
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

    render() {
        if (this.state.posts.length == 0) {
            return (<Loading />);
        }

        return (
            <PostList
                posts={this.state.posts}
                onPostPress={post => navigateToPost(this.props.componentId, post)}
                onPostPressIn={post => showPostPreview(this.props.componentId, post)}
                onEndReached={(page) => {
                    if (this.state.canLoadMore) {
                        this.setState({
                            isLoadingMore: true
                        });
                        this._getPostData(this.state.categoryId, page);
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