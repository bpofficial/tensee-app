import { useNavigation } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { Text, View } from "react-native";

export const HomeScreen: React.FC = () => {
    const { goBack } = useNavigation();

    return (
        <View>
            <Text>Hi</Text>
            <Button onPress={goBack}>
                <Text>Go back</Text>
            </Button>
        </View>
    );
};
