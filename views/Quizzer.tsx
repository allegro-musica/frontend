import React, {useEffect, useState} from 'react';
import {HttpTransportType, HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {useRoute} from "@react-navigation/native";
import {View} from "react-native";
import {Button, Card, Image, Text} from "react-native-elements";
import RemainingTime from "../components/RemainingTime";

const Quizzer = () => {
    const [loading, setLoading] = useState(false);
    const [connectedUsers, setConnectedUsers] = useState<Array<string>>([]);
    const [questions, setQuestions] = useState<Array<string>>([]);
    const [gameEnded, setGameEnded] = useState(false);
    const [showRemaining, setRemaining] = useState(false);
    const [error, setError] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const route = useRoute();
    const {roomId}:any = route.params;
    const [hubConnection, setHubConnection] = useState<HubConnection | null>(null);

    useEffect(() => {
        setLoading(true);
        const connection = new HubConnectionBuilder()
            .withUrl("http://localhost:4900/gateway?roomId=" + roomId, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .build();
        connection.keepAliveIntervalInMilliseconds = 5000;
        connection.start()
            .then(r => {
                setLoading(false);
            });

        connection.onclose(() => {
            setError(true);
        });

        connection.on("GameStarted", ({gameId, users}) => {
            setGameStarted(true);
            setConnectedUsers(users);
        })

        connection.on("QuestionReceived", ({title}) => {
            setQuestions(prev => [...prev, title]);
            setRemaining(true);
        })

        connection.on("GameEnded", ({gameId}) => {
            setGameEnded(true);
        })

        setHubConnection(connection);
    }, []);

    const handleStartGame = () => {
        if (hubConnection != null) {
            return hubConnection.send("StartGame", roomId);
        }
    }

    const handleNextQuestion = () => {
        if (hubConnection != null) {
            return hubConnection.send("NextQuestion", roomId);
        }
    }

    if (loading) {
        return (
            <div>Loading..</div>
        )
    }

    if (gameEnded) {
        return (
            <View style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
                <Text h1 style={{textAlign: 'center'}}>
                    Game ended
                </Text>
            </View>
        )
    }

    if (error) {
        return (
            <div>Encountered error...</div>
        )
    }

    if (gameStarted) {
        return (
            <View style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
                <Text>Game started {roomId}</Text>
                <Card>
                    <Card.Title>Question {questions.length}</Card.Title>
                    <Card.Divider/>
                    <Text>
                        {questions.length <= 0 ? "Loading..." : questions[questions.length - 1]}
                    </Text>
                </Card>
                {showRemaining ? (
                    <Text h4 style={{textAlign: 'center', color: 'red'}}>
                        <RemainingTime ms={15} onEnd={() => setRemaining(false)} />
                    </Text>
                ) : <Button style={{marginTop: '16px'}} title="Next question" onPress={handleNextQuestion} />}
                <Text style={{marginTop: '30px', textAlign: 'center'}}>
                    Connected users: {connectedUsers.length}
                </Text>
                {connectedUsers.map((x, key) => (
                    <Text key={key} style={{paddingTop: '5px'}}>
                        {x}
                    </Text>
                ))}
            </View>
        )
    }

    return (
        <View style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
            <Text>Connected to room {roomId}</Text>
            <Button title="Start game" onPress={handleStartGame} />
        </View>
    );
};

export default Quizzer;