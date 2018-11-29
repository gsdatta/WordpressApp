import React from 'react';
import {WP} from "../stores/wordpress";
import {PostList} from '../components';
import {PostMetadata} from "../stores/wordpress/models";
import {BookmarkMessage, Bookmarks, SAVED_POSTS} from "../stores/bookmarks";
import PubSub from "pubsub-js";
import {navigateToPost, showPostPreview} from "../stores/navigator";
import {TextMessages} from "../components/Loading";


export interface InputProps {
    categoryId: number | undefined;
}

interface Props extends InputProps {
    componentId: string;
}

interface State {
    saved: PostMetadata[];
    refreshing: boolean;
    error: boolean;
    loading: boolean;
}

export class Saved extends React.Component<Props, State> {
    private bookmarkSubscription: any;

    constructor(props: Props) {
        super(props);

        this.state = Saved._getDefaultState();
        this._onRefresh = this._onRefresh.bind(this);
        this.bookmarkSubscription = PubSub.subscribe(SAVED_POSTS, this._handleSaveMessage);
    }

    static _getDefaultState(): State {
        return {
            saved: [],
            refreshing: true,
            error: false,
            loading: true
        };
    }

    async componentDidMount() {
        this._onRefresh();
    }

    _handleSaveMessage = (msg: string, data: BookmarkMessage) => {
        console.log(data);
        if (data.saved) {
            this._getPostData([data.saved]);
        }

        if (data.removed) {
            this.setState((state: State) => {
                return {
                    saved: state.saved.filter(p => p.id != data.removed)
                }
            });
        }
    };

    _unlikePost = (post: PostMetadata) => {
        this.setState((state: State) => {
            return {
                saved: state.saved.filter(p => p.id != post.id)
            }
        })
    };

    _getPostData = async (savedIds: number[]) => {
        const wp = new WP();
        savedIds.forEach(async id => {
            console.log(id);
            try {
                let post = await wp.post(Number(id));
                console.log(post);
                this.setState((prevState: State) => {
                    return {saved: prevState.saved.concat(post)};
                })
            } catch (err) {
                console.log(err);

                this.setState({
                    refreshing: false,
                });
            }
        });
    };

    async _onRefresh() {
        this.setState(Saved._getDefaultState());
        try {
            let saved = await Bookmarks.getSavedPosts();
            this.setState({
                loading: false
            });

            this._getPostData(saved);
        } catch (error) {
            this.setState({
                error: true,
                loading: false
            })
        }
    }


    render() {
        if (!this.state.loading && !this.state.error && this.state.saved.length == 0) {
            return (
                <TextMessages messages={["You haven't saved anything yet :(", "Check out some of our recipes first!"]} />
            )
        }
        return (
            <PostList
                posts={this.state.saved}
                onPostPress={post => navigateToPost(this.props.componentId, post)}
                onPostPressIn={post => showPostPreview(this.props.componentId, post)}
                onUnlike={this._unlikePost}
                onEndReached={() => {
                }}
                refreshing={false}
                onRefresh={this._onRefresh}
                footerLoading={false}
                showExcerpt={false}
                postsAreLoading={this.state.loading && !this.state.error}
                isError={this.state.error}
            />
        );
    }
}