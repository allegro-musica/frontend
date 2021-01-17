import React, {useEffect, useState} from 'react';
import {Button, Icon, Input, Text} from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import {Quiz} from "../types/Quiz";
import {TextInput, View} from "react-native";

const Home = () => {
    const [roomId, setRoomId] = useState<string>('');
    const navigation = useNavigation();

    const handleClick = () => {
        axios.get<Quiz>('http://localhost:5000/test')
            .then((response) => {
                navigation.navigate('Quizzer', {
                    roomId: response.data.id
                });
            })
            .catch(() => {
                console.error("Failed to send request")
            })
    }

    const handleJoinGame = () => {
        if (roomId.length <= 0) return;

        navigation.navigate('Quizzer', {
            roomId: roomId
        });
    }

    const handleTextChange = (value: string) => {
        setRoomId(value);
    }

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Button title="Start game" onPress={handleClick} />
            <Text h4 style={{marginTop: '16px'}}>
                Or insert room id
            </Text>
            <Input
                style={{marginTop: '16px'}}
                placeholder='Room id'
                onChangeText={handleTextChange}
            />
            <Button title="Join room" onPress={handleJoinGame} />
        </View>
    );
};

export default Home;