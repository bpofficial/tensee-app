import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useAuth } from "../hooks";

export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, refreshToken } = useAuth();

    useEffect(() => {
        refreshToken()
    }, [])

    return (
        <View>
            <TextInput
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry
            />
            <Button title="Log in" onPress={() => login(email, password)} />
        </View>
    );
};
