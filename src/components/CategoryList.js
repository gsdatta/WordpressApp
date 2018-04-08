import React from 'react';
import {ScrollView} from 'react-native';
import {List, ListItem, Text} from 'native-base';

export class CategoriesComponent extends React.Component {
    constructor(props) {
        super(props);

        console.log(props);
        this.state = {
            categories: props.categories
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            categories: nextProps.categories
        };
    }

    render() {
        let categories = this.state.categories;
        console.log(categories);

        const goToPostList = (category) => this.props.navigator.push({
            screen: 'posts.List',
            passProps: {
                navigation: this.props.navigator,
                categoryId: category.id
            }
        });

        return (
            <ScrollView>
                <List>
                    {categories.map((category) =>
                        <ListItem key={category.id} onPress={() => goToPostList(category)}>
                            <Text>{category.name} ({category.count})</Text>
                        </ListItem>
                    )}
                </List>
            </ScrollView>
        );
    }
}
