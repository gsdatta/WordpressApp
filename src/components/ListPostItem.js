import React from 'react';
import {Body, Card, CardItem, Col, Grid, Text, View, Thumbnail, Left} from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome";
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import HTML from 'react-native-render-html';


export default class ListPostItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let post = this.props.post;
        let onPress = this.props.onPress;
        let onLike = this.props.onLike;
        let isLiked = this.props.isLiked;
        let showExcerpt = this.props.showExcerpt;

        return (
            <Card>
                <TouchableOpacity
                    onPress={() => onPress(post)}
                    activeOpacity={0.7}>
                    <CardItem>                        
                        <Image style={styles.image}
                           source={{
                               uri: post.media_url,
                               headers: {'User-Agent': 'Mozilla/5.0'}
                           }}/>
                        
                        <Body style={{marginLeft: 20}}>
                            <Text>{post.name}</Text>
                            {showExcerpt ? (<HTML html={post.excerpt}/>) : null }
                            <Grid>
                                <Col size={80}>
                                    <Text style={styles.date}>{post.posted_date.toDateString()}</Text>
                                </Col>
                                <Col size={20}>
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
                        </Body>
                    </CardItem>
                </TouchableOpacity>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 75,
        overflow: 'hidden',
        padding: 0
        // flex: 1
    },
    date: {
        color: 'gray',
        fontSize: 12,
        textAlign: 'left',
        marginTop: 4
    }
});