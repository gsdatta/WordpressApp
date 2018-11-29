import React from 'react';
import {FlatList, ScrollView} from 'react-native';
import {Body, Icon, List, ListItem, Right, Text} from 'native-base';
import {Layout, Navigation} from 'react-native-navigation';
import {WP} from '../stores/wordpress'
import {Category} from "../stores/wordpress/models";
import {InputProps as PostProps} from "./Posts";
import {navigateToCategoryPostList} from "../stores/navigator";

export interface Props {
    componentId: string;
    name: string;
    enthusiasmLevel?: number;
}

interface State {
    categories: Category[]
}

export class Categories extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        console.log(props);
        this.state = {
            categories: []
        };

        this.goToPostList = this.goToPostList.bind(this);
    }

    componentDidMount() {
        new WP().categories().then(cat => {
            console.log(cat);
            return cat;
        }).then(cat => this.setState({categories: cat}));
    }

    goToPostList = (category: Category) => {
        console.log(`ComponentId: ${this.props.componentId}`);
        console.log(`Loading category ${category.id}`);
        let opts: Layout<PostProps> = {
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
    };

    render() {
        let categories = this.state.categories;

        return (
            <ScrollView>
                <FlatList
                    data={categories}
                    keyExtractor={(category) => `category-${category.id}`}
                    renderItem={({item}) => {
                        const category = item;
                        return (
                            <ListItem key={category.id} onPress={() => navigateToCategoryPostList(this.props.componentId, category)} icon>
                                <Body>
                                <Text>{category.name}</Text>
                                </Body>
                                <Right>
                                    <Text>{category.count}</Text>
                                    <Icon active name="arrow-forward"/>
                                </Right>
                            </ListItem>
                        );
                    }}>
                </FlatList>
            </ScrollView>
        );
    }
}