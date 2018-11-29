import {Body, Button, Container, Icon, Text, View} from "native-base";
import {ActivityIndicator, StyleSheet, ViewStyle} from "react-native";
import React, {ReactNode} from 'react';

const styles = StyleSheet.create({
    loadingText: {
        // textAlign: 'center',
        alignSelf: 'center',
        marginBottom: 10
    }
});

const containerStyles: ViewStyle = {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
};

interface ContainerProps {
    children?: ReactNode;
}

export function DefaultContainer(props: ContainerProps) {
    return (
        <Container>
            <Body style={containerStyles}>
                <View>
                    {props.children}
                </View>
            </Body>
        </Container>
    );
}

export function TextMessages(props: { messages: string[], children?: ReactNode }) {
    return (
        <DefaultContainer>
            {props.messages.map((message, index) => <Text key={index} style={styles.loadingText}>{message}</Text>)}
            {props.children}
        </DefaultContainer>
    )
}

export function Loading(props: { message: string }) {
    return (
        <TextMessages messages={props.message ? [props.message] : ["Loading..."]}>
            <ActivityIndicator size="large" color="#0000ff"/>
        </TextMessages>
    );
}

export function UnableToLoad(props: { onRefresh?: () => void }) {
    return (
        <DefaultContainer>
            <Text style={styles.loadingText}>Sorry, looks like there was a problem.</Text>
            <Text style={styles.loadingText}>Are you offline?</Text>
            {props.onRefresh ? (
                <Button success iconRight onPress={() => {console.log("REFRESHING"); if (props.onRefresh) props.onRefresh()}} style={{alignSelf: 'center'}}>
                    <Text>Try again</Text>
                    <Icon name="refresh"/>
                </Button>
            ) : null}
        </DefaultContainer>
    );
}

