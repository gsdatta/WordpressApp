import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet} from 'react-native';
import {View} from 'native-base';
import ListPostItem from './ListPostItem';

export class PostList extends React.Component {
    constructor(props) {
        super(props);
        console.log("RENDERING");
    }

    async componentDidMount() {
    }

    render() {
        // console.log("RENDERING");
        return (
                <FlatList
                    style={styles.list}
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    data={this.props.posts}
                    renderItem={({item}) => {
                        const post = item;
                        return (
                            <ListPostItem
                            post={post}
                            onPress={(post) => this.props.onPostPress(post)}
                            onLike={(post) => this.props.onLike(post)}
                            isLiked={(post) => this.props.isLiked(post)}
                            />
                        );
                    }}
                    onEndReached={() => this.props.onEndReached()}
                    refreshing={this.props.refreshing}
                    onRefresh={() => this.props.onRefresh()}
                    keyExtractor={(post) => `${post.id}`}
                    ListFooterComponent={() => {
                        return (
                            this.props.footerLoading &&
                            <View style={{flex: 1}}>
                                <ActivityIndicator size="small"/>
                            </View>
                        );
                    }}
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