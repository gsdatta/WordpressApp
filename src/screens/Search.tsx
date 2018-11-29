import React from 'react';
import {Navigation} from 'react-native-navigation';
import {PostList} from '../components';
import {PostMetadata} from "../stores/wordpress/models";
import {Container, Header, Icon, Input, Item, Text} from "native-base";
import {WP} from "../stores/wordpress";
import {NativeSyntheticEvent, TextInputSubmitEditingEventData} from "react-native";
import {navigateToPost, showPostPreview} from "../stores/navigator";


export interface Props {
    componentId: string;
}

interface State {
    posts: PostMetadata[];
    refreshing: boolean;
    loadingMore: boolean;
    canLoadMore: boolean;
}

export class Search extends React.Component<Props, State> {
    private searchString = "";

    constructor(props: Props) {
        super(props);

        this.state = Search._getDefaultState();
    }

    static _getDefaultState(): State {
        return {
            posts: [],
            refreshing: true,
            loadingMore: false,
            canLoadMore: true
        };
    }

    async componentDidMount() {
        Navigation.mergeOptions(this.props.componentId, {
                topBar: {
                    visible: false,
                },
            }
        );
    }

    onSubmit = (query: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        this.searchString = query.nativeEvent.text;
        this._getData(this.searchString)
    };

    async _getData(searchQuery: string, page: number = 1) {
        new WP().search(searchQuery, page).then((newPosts) => {
            this.setState((prevState) => {
                return {
                    posts: page == 1 ? newPosts : prevState.posts.concat(newPosts),
                    loadingMore: false
                }
            });
        }).catch((error) => {
            this.setState({
                canLoadMore: false,
                loadingMore: false
            })
        });

    }

    render() {
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" onSubmitEditing={this.onSubmit}/>
                    </Item>
                    {/*<Button transparent>*/}
                        {/*<Text>Search</Text>*/}
                    {/*</Button>*/}
                </Header>
                {this.state.posts.length > 0 ?
                    <PostList
                        posts={this.state.posts}
                        onPostPress={post => navigateToPost(this.props.componentId, post)}
                        onPostPressIn={post => showPostPreview(this.props.componentId, post)}
                        onEndReached={(page) => {
                            if(this.state.canLoadMore) {
                                this.setState({
                                    loadingMore: true
                                });
                                this._getData(this.searchString, page)
                            }
                        }}
                        refreshing={false}
                        onRefresh={() => {}}
                        footerLoading={this.state.loadingMore}
                        showExcerpt={false}
                    />
                    : <Text style={{textAlign: 'center', color: 'grey', 'paddingTop': 20}}>No results. Try another search.</Text>
                }
            </Container>
        );
    }
}