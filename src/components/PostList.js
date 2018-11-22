import React from 'react';
import {ActivityIndicator, AsyncStorage, Image, ListView, StyleSheet, TouchableOpacity} from 'react-native';
import {Body, Card, CardItem, Col, Grid, Text, View} from 'native-base';
import {WP} from "../wordpress";
import {WP_SERVER} from "../config";
import Icon from "react-native-vector-icons/Ionicons";
import { withNavigation } from 'react-navigation'

class PostListComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: null,
            categoryId: null,
            dataSource: null,
            isLoadingMore: false,
            saved: [],
            page: 1
        };
    }

    componentDidMount() {
        this._getPostData();
        let saved = [];

        AsyncStorage.getItem('@Swayampaaka:saved_items').then(s => {
            console.log(s);
            if (s !== null) {
                saved = JSON.parse(s);
            }
        }).catch(err => console.log(err));

        this.setState({saved: saved});
    }

    _getPostData() {
        let params = {};
        categoryId = this.props.navigation.getParam('categoryId');
        console.log(`Category ID: ${categoryId}`);

        if (categoryId) {
            this.state.categoryId = categoryId;
            params.categories = categoryId;
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
            console.log(this.props.navigator);
            const goToPost = (post) => this.props.navigation.navigate(
                'Post',
                {postId: post.id});

            const savePost = (post) => {
                let posts = this.state.saved;
                if (posts.includes(post.id)) {
                    posts = posts.filter(p => p !== post.id);
                } else {
                    posts.push(post.id);
                    AsyncStorage.setItem('@Swayampaaka:saved_items', JSON.stringify(posts)).then(s => console.log(s)).catch(e => console.log(e));
                }
                this.setState({saved: posts});
            };

            return (
                <ListView
                    style={{padding: 10}}
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
                    renderRow={post => {
                        return (
                            <Card>
                                <TouchableOpacity
                                    onPress={() => {
                                        return goToPost(post);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <CardItem>
                                        <Body>
                                        <Text>{post.name}</Text>
                                        </Body>
                                    </CardItem>
                                    <CardItem cardBody>
                                        <Image style={styles.image}
                                               source={{
                                                   uri: post.media_url,
                                                   headers: {'User-Agent': 'Mozilla/5.0'}
                                               }}/>
                                    </CardItem>
                                </TouchableOpacity>
                                <CardItem>
                                    <Grid>
                                        <Col>
                                            <Text style={styles.date}>Posted
                                                on: {post.posted_date.toDateString()}</Text>
                                        </Col>
                                        <Col>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    return savePost(post);
                                                }}
                                                activeOpacity={0.5}>
                                                <Icon
                                                    name={this.state.saved.includes(post.id) ? 'ios-heart' : 'ios-heart-outline'}
                                                    size={20} style={{textAlign: 'right'}}
                                                    color={'red'}/>
                                            </TouchableOpacity>
                                        </Col>
                                    </Grid>
                                </CardItem>
                            </Card>
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
    image: {
        width: null,
        height: 250,
        flex: 1
    },
    date: {
        color: 'gray',
        fontSize: 11,
        textAlign: 'right',
        marginTop: 10
    }
});

export default withNavigation(PostListComponent);