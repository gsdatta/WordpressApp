import React, { Component } from 'react';
import { WP_SERVER } from '../config';
import { WP } from '../wordpress'
import { PostListComponent } from '@components/Posts/index.js';

export class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
        };
    }

    componentDidMount() {
        new WP(WP_SERVER).posts(this.props.post_query).then(cat => {console.log(cat); return cat;}).then(cat => this.setState({posts: cat}));
    }

    render() {
        const posts = this.state.posts;
        return (
            <PostListComponent posts={posts}/>
        );
    }
}