import React from 'react';
import {ActivityIndicator, Image, ScrollView, StyleSheet} from 'react-native';
import {Card, Text, View} from 'native-base';
import {WP} from "../wordpress";
import {WP_SERVER} from "../config";
import HTML from 'react-native-render-html';
import Icon from "react-native-vector-icons/EvilIcons";
import {Platform} from 'react-native';
import {Navigation} from 'react-native-navigation';
import Share from 'react-native-share';


export class SinglePost extends React.Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);

        this.state = {
            post: null,
            height: 0
        };
    }

    async buttonOptions() {
    	let shareIcon = await Icon.getImageSource(`share-${Platform.OS === 'ios' ? 'apple' : 'google'}`, 30)
	    return {
	      topBar: {
	        rightButtons: {
	          id: 'shareButton',
	          icon: shareIcon
	        }
	      }
	    };
  	}

    async componentDidMount() {
        this._getPostData(this.props.postId);
        
       	let options = await this.buttonOptions();
       	Navigation.mergeOptions(this.props.componentId, options);
    }

  	navigationButtonPressed({ buttonId }) {
    	if (buttonId === 'shareButton') {
    		Share.open({
    			url: this.state.post.url,
    			title: this.state.post.name,
    		})
    	}
  	}

    _getPostData(postId) {
        console.log(postId);
        new WP(WP_SERVER).post(postId)
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

            return (
                <ScrollView contentContainerStyle={styles.container} style={{flex: 1, flexDirection: 'column'}}>
                    <View>

                            <Image style={styles.image}
                                   source={{
                                       uri: post.media_url,
                                       headers: {'User-Agent': 'Mozilla/5.0'}
                                   }}
                                   resizeMode={'cover'}/>
                        <Text style={{marginTop: 10, fontWeight: 'bold', fontSize: 20}}>{post.name}</Text>
                        <Text style={styles.date}>Posted on: {post.posted_date.toDateString()}</Text>
                    </View>
                    <HTML html={post.post_content}/>
                </ScrollView>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        // padding: 20,
        justifyContent: 'center',
    },
    image: {
        width: null,
        height: 210,
    },
    date: {
        color: 'gray',
        fontSize: 11,
        textAlign: 'right',
        marginTop: 10
    }
});