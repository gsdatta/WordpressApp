import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet} from 'react-native';
import {View} from 'native-base';
import {ListPostItem} from './ListPostItem';
import {PostMetadata} from "../stores/wordpress/models";
import {Bookmarks} from "../stores/bookmarks";

interface Props {
    posts: PostMetadata[];
    onPostPress: (post: PostMetadata) => void;
    onLike?: (post: PostMetadata) => void;
    onUnlike?: (post: PostMetadata) => void;
    showExcerpt: boolean;
    onEndReached: () => void;
    onRefresh: () => void;
    refreshing: boolean;
    footerLoading: boolean;
}

interface State {
    saved: number[];
}

export class PostList extends React.Component<Props, State> {
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
    }

    savePost = (post: PostMetadata) => {
        Bookmarks.savePost(post.id).then(posts => this.setState({saved: posts}));
        if (this.props.onLike) {
            this.props.onLike(post);
        }
    };

    unsavePost = (post: PostMetadata) => {
        Bookmarks.removePost(post.id).then(posts => this.setState({saved: posts}));

        if (this.props.onUnlike) {
            this.props.onUnlike(post);
        }
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
                onEndReached={() => this.props.onEndReached()}
                refreshing={this.props.refreshing}
                onRefresh={() => {
                    this.props.onRefresh();
                    Bookmarks.getSavedPosts().then(saved => this.setState({saved: saved}));
                }}
                keyExtractor={(post) => `${post.id}`}
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