import React from 'react';
import {AsyncStorage} from 'react-native';
import {WP} from "../stores/wordpress";
import {WP_SERVER} from "../config";
import {Navigation} from 'react-native-navigation';
import {PostList} from '../components';
import {PostMetadata} from "../stores/wordpress/models";


export interface InputProps {
    categoryId: number | undefined;
}

interface Props extends InputProps {
    componentId: string;
}

interface State {
    saved: PostMetadata[];
    refreshing: boolean;
}

export class Saved extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = Saved._getDefaultState();
        this.goToPost = this.goToPost.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    static _getDefaultState(): State {
        return {
            saved: [],
            refreshing: true,
        };
    }

    async componentDidMount() {
       this.onRefresh();
    }

    _getPostData(savedIds: number[]) {
        savedIds.forEach( id => {
            console.log(id);
            new WP(WP_SERVER).post(Number(id))
                .then(post => {
                    console.log(post);
                    this.setState((prevState: State) => {
                        return {saved: prevState.saved.concat(post)};
                    })
                })
                .catch(err => {
                    console.log(err);

                    this.setState({
                        refreshing: false,
                    });
                });

        });
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

    async onRefresh() {
        let saved = [];
        this.setState({saved: []});
        try {
            let s = await AsyncStorage.getItem('@Swayampaaka:saved_items');
            console.log(`Items currently saved: ${s}`);
            if (s !== null) {
                saved = JSON.parse(s);
            }

            this._getPostData(saved);
        } catch (error) {
            console.log(error);
        }
    }

    savePost = (post: PostMetadata) => {
        // let posts = this.state.saved;
        // if (posts.includes(post.id)) {
        //     posts = posts.filter(p => p !== post.id);
        // } else {
        //     posts.push(post.id);
        // }
        //
        // AsyncStorage.setItem('@Swayampaaka:saved_items', JSON.stringify(posts)).then(s => console.log(s)).catch(e => console.log(e));
        // this.setState({
        //     saved: posts
        // });
    };

    render() {
        return (
            <PostList
                posts={this.state.saved}
                onPostPress={this.goToPost}
                onLike={this.savePost}
                isLiked={(post: PostMetadata) => true}
                onEndReached={() => {
                }}
                refreshing={false}
                onRefresh={this.onRefresh}
                footerLoading={false}
                showExcerpt={false}
            />
        );
    }
}