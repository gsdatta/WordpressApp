import React from "react";
import {BookmarkMessage, Bookmarks, SAVED_POSTS} from "../stores/bookmarks";
import {TouchableOpacity} from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Icon from "react-native-vector-icons/FontAwesome";
import PubSub from "pubsub-js";

interface Props {
    postId: number;
    color?: string;
    size?: number;
}

interface State {
    saved: boolean;
}

export class SaveButton extends React.Component<Props, State> {
    private bookmarkSubscription: any;

    constructor(props: Props) {
        super(props);

        this.state = {
            saved: false
        };
    }

    async componentDidMount() {
        let saved = await Bookmarks.isPostSaved(this.props.postId);
        this.setState({
            saved: saved
        });

        this.bookmarkSubscription = PubSub.subscribe(SAVED_POSTS, (msg: string, data: BookmarkMessage) => {
            let isNowSaved = data.saved == this.props.postId;
            let isNowRemoved = data.removed == this.props.postId;
            this.setState((prevState) => {
                return {
                    saved: (!prevState.saved && isNowSaved) || (prevState.saved && !isNowSaved && !isNowRemoved)
                }
            });
        });
    }

    componentWillUnmount() {
        if (this.bookmarkSubscription) {
            PubSub.unsubscribe(this.bookmarkSubscription);
        }
    }

    onPress = async () => {
        ReactNativeHapticFeedback.trigger('impactLight', true);

        if (this.state.saved) {
            Bookmarks.removePost(this.props.postId);
        } else {
            Bookmarks.savePost(this.props.postId);
        }
    };

    render() {
        return (
            <TouchableOpacity
                onPress={this.onPress}
                activeOpacity={0.5}>
                <Icon name={this.state.saved ? 'bookmark' : 'bookmark-o'}
                      size={this.props.size}
                      color={this.props.color}/>
            </TouchableOpacity>
        );
    }
}