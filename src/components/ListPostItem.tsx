import React from 'react';
import {Body, Card, CardItem, Col, Grid, Text} from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome";
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Navigation} from 'react-native-navigation';
import HTML from "react-native-render-html";
import {PostMetadata} from "../stores/wordpress/models";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

interface Props {
    post: PostMetadata;
    onPress: (post: PostMetadata) => void;
    onPressIn?: (post: PostMetadata) => ((reactTag?: any) => void);
    onLike: (post: PostMetadata) => void;
    onUnlike: (post: PostMetadata) => void;
    isLiked: (post: PostMetadata) => boolean;
    showExcerpt: boolean;
}

export class ListPostItem extends React.Component<Props> {
    constructor(props: Props) {
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
                <Navigation.TouchablePreview
                    onPress={() => onPress(post)}
                    onPressIn={(reactTag: any) => {
                        if (this.props.onPressIn) {
                            this.props.onPressIn(post)(reactTag);
                        }
                    }}
                    activeOpacity={0.7}>
                    <CardItem>
                        <Image style={styles.image}
                               source={{
                                   uri: post.media_url,
                                   headers: {'User-Agent': 'Mozilla/5.0'}
                               }}/>

                        <Body style={{marginLeft: 20}}>
                            <Text>{post.name}</Text>
                            {showExcerpt ? (<HTML html={post.excerpt ? post.excerpt : ''}/>) : null }
                            <Grid>
                                <Col size={80}>
                                    <Text style={styles.date}>{post.posted_date.toDateString()}</Text>
                                </Col>
                                <Col size={20}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            ReactNativeHapticFeedback.trigger('impactLight', true);
                                            if (isLiked(post)) {
                                                this.props.onUnlike(post);
                                            } else {
                                                return onLike(post);
                                            }
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
                </Navigation.TouchablePreview>
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