import React from 'react';
import {ActivityIndicator, Image, ScrollView, StyleSheet} from 'react-native';
import {Text, View} from 'native-base';
import {WP} from "../wordpress";
import {WP_SERVER} from "../config";
import HTML from 'react-native-render-html';

export class PostComponent extends React.Component {
    webview = null;

    constructor(props) {
        super(props);

        this.state = {
            post: null,
            height: 0
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            postId: nextProps.postId
        };
    }

    componentDidMount() {
        this._getPostData();
    }

    _getPostData() {
        console.log(this.state.postId);
        new WP(WP_SERVER).post(this.state.postId)
            .then(p => {
                console.log(p);
                return p
            })
            .then(p => {
                this.setState({
                    post: p,
                    isLoading: false
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        if (this.state.isLoading || this.state.post === null) {
            return (
                <View style={styles.container}>
                    <Text style={{textAlign: 'center', marginBottom: 10}}>Loading posts...</Text>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
            )
        } else {
            let post = this.state.post;

            let myHTML = '<html>' +
                '<head>' +
                '<title></title>' +
                '</head>' +
                '<body>' +
                post.post_content +
                '</body>' +
                '</html>';
            // const javascript =
            let javascript = 'window.location.hash = 1;' +
                'document.title = document.body.scrollHeight;' +
                'window.postMessage( document.body.scrollHeight );';

            return (
                <ScrollView contentContainerStyle={styles.container} style={{flex: 1, flexDirection: 'column'}}>
                    <View style={{ padding: 10, border: '10px solid gray'}}>
                        <Image style={styles.image}
                               source={{
                                   uri: post.media_url,
                                   headers: {'User-Agent': 'Mozilla/5.0'}
                               }}
                               resizeMode={'cover'}/>
                        <Text style={{marginTop: 10, fontWeight: 'bold', fontSize: 20}}>{post.name}</Text>
                        <Text style={styles.date}>Posted on: {post.posted_date.toDateString()}</Text>
                    </View>
                    <HTML html={myHTML}/>
                </ScrollView>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // flexDirection: 'row',
        padding: 20,
        justifyContent: 'center',
        // alignItems: 'center',
        // flexWrap: 'wrap'
    },
    image: {
        width: 300,
        height: 150,
        // marginBottom: 10
    },
    date: {
        color: 'gray',
        fontSize: 11,
        textAlign: 'right',
        marginTop: 10
    }
});

const htmlStyles = StyleSheet.create({
    content: {
        flex: 1,
        height: 1200,
        margin: 10,
        fontFamily: 'sans-serif'
    }
});
