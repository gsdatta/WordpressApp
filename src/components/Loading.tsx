import {Container, Text, View} from "native-base";
import {ActivityIndicator, StyleSheet} from "react-native";
import React from 'react';

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'column'
    },
    loadingText: {
        textAlign: 'center',
        marginBottom: 10
    }
});

export function Loading() {
    return (
        <Container>
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading... </Text>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        </Container>
    );
}

