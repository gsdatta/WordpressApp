import React from 'react';
import {CategoriesComponent} from '../components';

export class Categories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
        };
    }

    render() {
        return (
            <CategoriesComponent componentId={this.props.componentId}/>
        );
    }
}