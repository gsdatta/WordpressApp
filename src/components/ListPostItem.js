import React from 'react';
import {Body, Card, CardItem, Col, Grid, Text, View} from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome";
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import HTML from 'react-native-render-html';


export default class ListPostItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const post = this.props.post;
        const onPress = this.props.onPress;
        const onLike = this.props.onLike;
        const isLiked = this.props.isLiked;
        const showExcerpt = this.props.showExcerpt;

        return (
            <Card>
                <TouchableOpacity
                    onPress={() => onPress(post)}
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
                {showExcerpt ? (
                    <CardItem>
                        <HTML html={post.excerpt}/>
                    </CardItem>
                ) : null }
                <CardItem>
                    <Grid>
                        <Col>
                            <Text style={styles.date}>Posted
                                on: {post.posted_date.toDateString()}</Text>
                        </Col>
                        <Col>
                            <TouchableOpacity
                                onPress={() => {
                                    return onLike(post);
                                }}
                                activeOpacity={0.5}>
                                <Icon
                                    name={isLiked(post) ? 'bookmark' : 'bookmark-o'}
                                    size={20} style={{textAlign: 'right', paddingTop: 3}}
                                    color={'red'}/>
                            </TouchableOpacity>
                        </Col>
                    </Grid>
                </CardItem>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width: null,
        height: 250,
        flex: 1
    },
    date: {
        color: 'gray',
        fontSize: 12,
        textAlign: 'right',
        marginTop: 4
    }
});