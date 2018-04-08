import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Text, List, ListItem } from 'native-base';

export class PostListComponent extends React.Component {
    constructor(props) {
        super(props);

        console.log(props);
        this.state = {
            posts: props.posts
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            posts: props.posts
        });
    }

    render() {
        let posts = this.state.posts;
        console.log(posts);
        return (
            <ScrollView>
                <List>
                    {posts.map((post) =>
                        <ListItem key={post.id}>
                            <Text>{post.name} ({post.count})</Text>
                        </ListItem>
                    )}
                </List>
            </ScrollView>
        );
    }
}