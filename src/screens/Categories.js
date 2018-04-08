import React from 'react';
import {Text, List, ListItem} from 'react-native';
import { WP_SERVER } from '../config';
import { WP } from '../wordpress'

class Categories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
        };
    }

    componentDidMount() {
        fetch('https://swayampaaka.com/wp-json/wp/v2/categories', {headers: {'Access-Control-Allow-Origin':'*'}}).then(res => console.log(res.body));
        // new WP(WP_SERVER).categories().then(cat => this.setState({categories: cat}));
    }

    render() {
        const categories = this.state.categories;

        return (
            <Text>ASDF</Text>
            // <List>
            // {categories.map( (category) =>
            //     <ListItem key={category.id}>
            //         <Text>{category.name} ({category.count})</Text>
            //     </ListItem>
            // )}
            // </List>
        );
    }
}

export default Categories;