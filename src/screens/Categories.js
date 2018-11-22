import React from 'react';
import {ScrollView} from 'react-native';
import {List, ListItem, Text} from 'native-base';
import { Navigation } from 'react-native-navigation';
import {WP_SERVER} from '../config';
import {WP} from '../wordpress'

export class Categories extends React.Component {
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

    goToPostList = (category) => {
        console.log(`ComponentId: ${this.props.componentId}`);
        console.log(`Loading category ${category.id}`);
        let opts = {
            component: {
                name: 'posts.List',
                passProps: {
                    'categoryId': category.id
                },
                options: {
                  topBar: {
                    title: {
                      text: category.name
                    }
                  }
                }
            }
        };
        console.log(opts);
        Navigation.push(this.props.componentId, opts);
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