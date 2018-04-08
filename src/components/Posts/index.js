import React, { Component } from 'react';
import { ScrollView, Image } from 'react-native';
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
                        <ListItem key={post.id} style={{ flex: 1, flexDirection: 'column', backgroundColor: 'transparent' }}>
                            <Text>{post.name}</Text>
                            <Image
                                style={{width: 150, height: 150}}
                                source={{uri: "https://swayampaaka.com/wp-content/uploads/2016/08/Vaddaragi-hittu-Oddaragi-hittu-Baby-Food-Recipe-1-150x150.jpeg"}}
                            />
                        </ListItem>
                    )}
                </List>
            </ScrollView>
        );
    }
}