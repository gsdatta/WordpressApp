import React from 'react';
import PostComponent from "../components/Post";

export class PostsScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const postId = this.props.postId;

        return (
            <PostComponent postId={postId} componentId={this.props.componentId}/>
        );
    }
}