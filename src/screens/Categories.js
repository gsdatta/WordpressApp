import React from 'react';
import {ScrollView} from 'react-native';
import {Body, Icon, List, ListItem, Right, Text} from 'native-base';
import {Navigation} from 'react-native-navigation';
import {WP_SERVER} from '../config';
import {WP} from '../stores/wordpress'

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
                <List dataArray={categories} renderRow={(category) => {
                    return (
                        <ListItem key={category.id} onPress={() => this.goToPostList(category)} icon>
                            <Body>
                                <Text>{category.name}</Text>
                            </Body>
                            <Right>
                                <Text>{category.count}</Text>
                                <Icon active name="arrow-forward" />
                            </Right>
                        </ListItem>
                    );}}>
                </List>
            </ScrollView>
        );
    }
}