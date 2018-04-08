import React, { Component } from 'react';
import { WP_SERVER } from '../config';
import { WP } from '../wordpress'
import { CategoriesComponent } from '@components/Categories/index.js';

export class Categories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
        };
    }

    componentDidMount() {
        new WP(WP_SERVER).categories().then(cat => {console.log(cat); return cat;}).then(cat => this.setState({categories: cat}));
    }

    render() {
        const categories = this.state.categories;
        return (
            <CategoriesComponent categories={categories} />
        );
    }
}