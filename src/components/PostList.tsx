import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet} from 'react-native';
import {View} from 'native-base';
import {ListPostItem} from './ListPostItem';
import {PostMetadata} from "../stores/wordpress/models";

interface Props {
    posts: PostMetadata[];
    onPostPress: (post: PostMetadata) => void;
    onLike: (post: PostMetadata) => void;
    onUnlike: (post: PostMetadata) => void;
    isLiked: (post: PostMetadata) => boolean;
    showExcerpt: boolean;
    onEndReached: () => void;
    onRefresh: () => void;
    refreshing: boolean;
    footerLoading: boolean;
}

export class PostList extends React.Component<Props> {
    constructor(props: Props) {
        console.log("RENDERING");
        super(props);
    }

    async componentDidMount() {
    }

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
                            onLike={(post) => this.props.onLike(post)}
                            onUnlike={(post) => this.props.onUnlike(post)}
                            isLiked={(post) => this.props.isLiked(post)}
                            showExcerpt={this.props.showExcerpt}/>
                    );
                }}
                onEndReached={() => this.props.onEndReached()}
                refreshing={this.props.refreshing}
                onRefresh={() => this.props.onRefresh()}
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