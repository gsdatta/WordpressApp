import React, { Component } from 'react';
import {Text, List, ListItem} from 'native-base';

export class CategoriesComponent extends React.Component {
    constructor(props) {
        super(props);

        console.log(props);
        this.state = {
            categories: props.categories
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            categories: props.categories
        });
    }

    render() {
        let categories = this.state.categories;
        console.log(categories);
        return (
            <List>
            {categories.map( (category) =>
                <ListItem key={category.id}>
                    <Text>{category.name} ({category.count})</Text>
                </ListItem>
            )}
            </List>
        );
    }
}