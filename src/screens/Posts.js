import React from 'react';
import {PostListComponent} from '../components';

export class Posts extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const categoryId = this.props.categoryId;

        return (
            <PostListComponent category={categoryId}/>
        );
    }
}