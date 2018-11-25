import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet} from 'react-native';
import {View} from 'native-base';
import {ListPostItem} from './ListPostItem';
import {PostMetadata} from "../stores/wordpress/models";
import {BookmarkMessage, Bookmarks, SAVED_POSTS} from "../stores/bookmarks";
import PubSub from 'pubsub-js';

interface Props {
    posts: PostMetadata[];
    onPostPress: (post: PostMetadata) => void;
    onLike?: (post: PostMetadata) => void;
    onUnlike?: (post: PostMetadata) => void;
    showExcerpt: boolean;
    onEndReached: (page: number) => void;
    onRefresh: () => void;
    refreshing: boolean;
    footerLoading: boolean;
}

interface State {
    saved: number[];
}

export class PostList extends React.Component<Props, State> {
    private bookmarkSubscription: any;
    private page = 1;

    constructor(props: Props) {
        super(props);

        console.log("RENDERING");

        this.state = {
            saved: []
        };
    }

    async componentDidMount() {
        let saved = await Bookmarks.getSavedPosts();
        this.setState({
            saved: saved
        });

        this.bookmarkSubscription = PubSub.subscribe(SAVED_POSTS, this.handleSave);
    }


    componentWillUnmount(): void {
        if (this.bookmarkSubscription) {
            PubSub.unsubscribe(this.bookmarkSubscription);
        }
    }

    savePost = (post: PostMetadata) => {
        Bookmarks.savePost(post.id);
        if (this.props.onLike) {
            this.props.onLike(post);
        }
    };

    unsavePost = (post: PostMetadata) => {
        // Bookmarks.removePost(post.id).then(posts => this.setState({saved: posts}));
        Bookmarks.removePost(post.id);

        if (this.props.onUnlike) {
            this.props.onUnlike(post);
        }
    };

    handleSave = (msg: string, data: BookmarkMessage) => {
        console.log(data);

        this.setState(state => {
            if (data.saved) {
                return {saved: state.saved.concat(data.saved)};
            }

            if (data.removed) {
                return {saved: state.saved.filter(p => p!= data.removed)};
            }
        })
    };

    render() {
        return (
            <FlatList
                style={styles.list}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                data={this.props.posts}
                renderItem={({item}) => {
                    return (
                        <ListPostItem
                            post={item}
                            onPress={(post) => this.props.onPostPress(post)}
                            onLike={this.savePost}
                            onUnlike={this.unsavePost}
                            isLiked={(post) => this.state.saved.includes(post.id)}
                            showExcerpt={this.props.showExcerpt}/>
                    );
                }}
                onEndReached={() => {
                    if (!this.props.footerLoading) {
                        this.page += 1;
                        this.props.onEndReached(this.page);
                    }
                }}
                refreshing={this.props.refreshing}
                onRefresh={() => {
                    this.props.onRefresh();
                    Bookmarks.getSavedPosts().then(saved => this.setState({saved: saved}));
                }}
                keyExtractor={(post) => `post-${post.id}`}
                ListFooterComponent={(
                        this.props.footerLoading ? (
                        <View style={{flex: 1}}>
                            <ActivityIndicator size="small"/>
                        </View>
                        ) : null
                    )
                }
            />
        );
    }
}

const styles = StyleSheet.create({
    list: {
        marginLeft: 10,
        marginRight: 10
    },
    container: {
        paddingBottom: 10,
        paddingTop: 10
    }
});