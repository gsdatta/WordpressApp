import React from 'react';
import {Navigation} from 'react-native-navigation';
import {PostList} from '../components';
import {PostMetadata, PostSearchParams} from "../stores/wordpress/models";
import {Button, Container, Header, Icon, Input, Item, Text} from "native-base";
import {WP} from "../stores/wordpress";
import {WP_SERVER} from "../config";
import {NativeSyntheticEvent, TextInputSubmitEditingEventData} from "react-native";


export interface Props {
    componentId: string;
}

interface State {
    posts: PostMetadata[];
    refreshing: boolean;
}

export class Search extends React.Component<Props, State> {
    private bookmarkSubscription: any;

    constructor(props: Props) {
        super(props);

        this.state = Search._getDefaultState();
        this.goToPost = this.goToPost.bind(this);
        // this.onRefresh = this.onRefresh.bind(this);
        // this.bookmarkSubscription = PubSub.subscribe(SAVED_POSTS, this.handleSave);
    }

    // static get options() {
    //     return     }

    static _getDefaultState(): State {
        return {
            posts: [],
            refreshing: true,
        };
    }

    async componentDidMount() {
        Navigation.mergeOptions(this.props.componentId, {
                topBar: {
                    visible: false,
                },
            }
        );
       // this.onRefresh();
    }

    _getPostData(savedIds: number[]) {
    }

    goToPost = (post: PostMetadata) => {
        console.log(`ComponentId: ${this.props.componentId}`);
        console.log(`Loading post [${post.id}]`);
        Navigation.push(this.props.componentId, {
            component: {
                name: 'posts.Single',
                passProps: {
                    postId: post.id
                }
            }
        });
    };

    onSubmit = (query: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        let params = new PostSearchParams();
        params.search = query.nativeEvent.text;

        new WP(WP_SERVER).posts(params).then((posts) => {
            this.setState({
                posts: posts
            });
        });
    };

    render() {
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" onSubmitEditing={this.onSubmit}/>
                    </Item>
                    <Button transparent>
                        <Text>Search</Text>
                    </Button>
                </Header>
                <PostList
                    posts={this.state.posts}
                    onPostPress={this.goToPost}
                    onEndReached={() => { }}
                    refreshing={false}
                    onRefresh={() => {}}
                    footerLoading={false}
                    showExcerpt={false}
                    />
            </Container>
        );
    }
}