import React from 'react';
import {ActivityIndicator, Image, ListView, StyleSheet} from 'react-native';
import {Text, View} from 'native-base';
import {WP} from "../wordpress";
import {WP_SERVER} from "../config";

export class PostListComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: null,
            categoryId: null,
            dataSource: null,
            isLoadingMore: false,
            page: 1
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            categoryId: nextProps.category
        };
    }

    componentDidMount() {
        this._getPostData();
    }

    _getPostData() {
        let params = {};

        if (this.state.categoryId) {
            params.categories = this.state.categoryId;
        }

        params.page = this.state.page;

        new WP(WP_SERVER).posts(params)
            .then(cat => {
                let posts = this.state.posts;

                if (posts !== null) {
                    Array.prototype.push.apply(posts, cat);
                } else {
                    posts = cat;
                }

                let ds = this.state.dataSource !== null ? this.state.dataSource : new ListView.DataSource({
                    rowHasChanged: (r1, r2) => r1 !== r2
                });

                let nextPage = this.state.page + 1;

                this.setState({
                    posts: posts,
                    canLoadMore: cat.length !== 0,
                    page: nextPage,
                    dataSource: ds.cloneWithRows(posts),
                    isLoading: false,
                    isLoadingMore: false
                });

                console.log(this.state.dataSource);
            })
            .catch(err => {
                console.log(err);

                this.setState({
                    isLoadingMore: false,
                    isLoading: false,
                    canLoadMore: false
                });
            });
    }

    render() {
        if (this.state.isLoading || this.state.dataSource === null) {
            return (
                <View style={styles.container}>
                    <Text style={{textAlign: 'center', marginBottom: 10}}>Loading posts...</Text>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
            )
        } else {
            console.log(this.state.dataSource);
            return (
                <ListView
                    dataSource={this.state.dataSource}
                    onEndReached={() => {
                        if (!this.state.isLoadingMore && this.state.canLoadMore) {
                            this.setState({isLoadingMore: true});
                            this._getPostData();
                        }
                    }}
                    renderFooter={() => {
                        return (
                            this.state.isLoadingMore &&
                            <View style={{flex: 1}}>
                                <ActivityIndicator size="small"/>
                            </View>
                        );
                    }}
                    renderRow={post=> {
                        return (
                            <View style={[styles.listItem, styles.container]}>
                                <Image style={{width: 300, height: 150, marginBottom: 10}} source={{uri: post.media_url }} resizeMode={'cover'}/>
                                <Text>{post.name}</Text>
                            </View>
                        )
                    }}
                >
                </ListView>
            );
        }
    }
}

const styles = StyleSheet.create({
    listItem: {
        flex: 1,
        flexDirection: "row",
        flexWrap: 'wrap',
        borderBottomWidth: 1,
        borderBottomColor: "#d6d7da",
        padding: 20,
        margin: 3
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    vertical: {
        flexDirection: 'column',
        justifyContent: 'center'
    }
});