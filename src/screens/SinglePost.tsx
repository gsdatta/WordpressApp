import React from 'react';
import {Image, Linking, Platform, ScrollView, StyleSheet} from 'react-native';
import {Button, Icon, Text, Toast, View} from 'native-base';
import {WP} from "../stores/wordpress";
import HTML from 'react-native-render-html';
import EvilIcons from "react-native-vector-icons/EvilIcons";
import {Navigation, Options} from 'react-native-navigation';
import Share from 'react-native-share';
import {ImageSource} from "react-native-vector-icons/Icon";
import {PostMetadata} from "../stores/wordpress/models";
import {Loading, UnableToLoad} from "../components/Loading";

export interface InputProps {
    postId: number;
    componentId: string;
}

interface State {
    isLoading: boolean;
    post: PostMetadata | null;
    error: boolean;
}

const CATEGORY_REGEX = RegExp("swayampaaka.com\/category");

export class SinglePost extends React.Component<InputProps, State> {

    constructor(props: InputProps) {
        super(props);
        Navigation.events().bindComponent(this);

        this.state = {
            post: null,
            isLoading: true,
            error: false
        };
    }

    async buttonOptions(): Promise<Options> {
        let shareIcon: ImageSource = await EvilIcons.getImageSource(`share-${Platform.OS === 'ios' ? 'apple' : 'google'}`, 30);
        return {
            topBar: {
                rightButtons: [{
                    id: 'shareButton',
                    icon: shareIcon
                }]
            }
        };
    }

    async componentDidMount() {
        await this._getPostData(this.props.postId);

        let options = await this.buttonOptions();
        Navigation.mergeOptions(this.props.componentId, options);
    }

    navigationButtonPressed({buttonId}: { buttonId: string }) {
        if (this.state.post == null) {
            return;
        }

        if (buttonId === 'shareButton') {
            Share.open({
                url: this.state.post.url,
                title: this.state.post.name,
            })
        }
    }

    async _getPostData(postId: number) {
        console.log(`Fetching post ${postId}`);
        try {
            let post = await new WP().post(postId);
            this.setState({
                post: post,
                error: false
            });
        } catch (err) {
            console.log(err);
            this.setState({error: true, isLoading: false});
        }

        this.setState({isLoading: false});
    }

    render() {
        if (this.state.isLoading && this.state.post === null) {
            return (<Loading message={"Loading post..."}/>)
        } else if (this.state.error || this.state.post === null) {
            return (<UnableToLoad onRefresh={() => this._getPostData(this.props.postId)}/>)
        } else {
            let post = this.state.post;

            return (
                <ScrollView contentContainerStyle={styles.container} style={{flex: 1, flexDirection: 'column'}}>
                    <View>
                        <Image style={styles.image}
                               source={{
                                   uri: post.media_url,
                                   headers: {'User-Agent': 'Mozilla/5.0'}
                               }}
                               resizeMode={'cover'}/>
                    </View>
                    <View style={{padding: 20}}>
                        <Text style={{marginTop: 10, fontWeight: 'bold', fontSize: 20}}>{post.name}</Text>
                        <Text style={styles.date}>Posted on: {post.posted_date.toDateString()}</Text>
                        <Button block iconRight danger onPress={() => {
                            if (this.state.post != null && this.state.post.video_url != null) {
                                Linking.openURL(this.state.post.video_url)
                            }
                        }}>
                            <Text>Watch this on YouTube</Text>
                            <Icon type='FontAwesome' name='youtube-play'/>
                        </Button>

                        <HTML
                            html={post.post_content != null ? post.post_content : ''}
                            allowedStyles={[]}
                            onLinkPress={(event, href) => {
                                if (CATEGORY_REGEX.test(href)) {
                                    new WP()._getCategoryIdBySlug(href).then(category => {
                                            if (category) {
                                                Navigation.push(this.props.componentId, {
                                                    component: {
                                                        name: 'posts.List',
                                                        passProps: {
                                                            categoryId: category.id
                                                        },
                                                        options: {
                                                            topBar: {
                                                                backButton: {
                                                                    title: 'Back'
                                                                }
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    ).catch(error => Toast.show({text: "Unable to load this post."}))
                                } else {
                                    new WP().getPostFromURL(href).then(post => {
                                            if (post) {
                                                Navigation.push(this.props.componentId, {
                                                    component: {
                                                        name: 'posts.Single',
                                                        passProps: {
                                                            postId: post.id
                                                        },
                                                        options: {
                                                            topBar: {
                                                                backButton: {
                                                                    title: 'Back'
                                                                }
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    ).catch(error => Toast.show({text: "Unable to load this post."}))
                                }
                            }}
                        />
                    </View>
                </ScrollView>
            );
        }
    }
}

const loading = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'column'
    }
});

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    image: {
        width: undefined,
        height: 210,
    },
    date: {
        color: 'gray',
        fontSize: 12,
        textAlign: 'left',
        margin: 10
    }
});