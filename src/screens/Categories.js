import React from 'react';
import {WP_SERVER} from '../config';
import {WP} from '../wordpress'
import {CategoriesComponent} from '../components';

export class Categories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
        };
    }

    componentDidMount() {
        new WP(WP_SERVER).categories().then(cat => {
            console.log(cat);
            return cat;
        }).then(cat => this.setState({categories: cat}));
    }

    render() {
        return (
            <CategoriesComponent/>
        );
    }
}