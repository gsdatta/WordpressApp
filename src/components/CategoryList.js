import React from 'react';
import {ScrollView} from 'react-native';
import {List, ListItem, Text} from 'native-base';
import { Navigation } from 'react-native-navigation';
import {WP_SERVER} from '../config';
import {WP} from '../wordpress'


export default class CategoriesComponent extends React.Component {
    constructor(props) {
        super(props);

        console.log(props);
        this.state = {
            categories: []
        };

        this.goToPostList = this.goToPostList.bind(this);
    }

    componentDidMount() {
        new WP(WP_SERVER).categories().then(cat => {
            console.log(cat);
            return cat;
        }).then(cat => this.setState({categories: cat}));
    }

    async goToPostList(category) {
        console.log(`ComponentId: ${this.props.componentId}`);
        console.log(`Loading category [${category.id}]`);

        await Navigation.push(this.props.componentId, {
            component: {
                name: 'posts.List',
                passProps: {
                    categoryId: category.id
                }
            }
        });
    }

    render() {
        let categories = this.state.categories;

        return (
            <ScrollView>
                <List>
                    {categories.map((category) =>
                        <ListItem key={category.id} onPress={() => this.goToPostList(category)}>
                            <Text>{category.name} ({category.count})</Text>
                        </ListItem>
                    )}
                </List>
            </ScrollView>
        );
    }
}
