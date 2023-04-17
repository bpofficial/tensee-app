import { useAuth } from "@hooks";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { Text, View } from "react-native";

export const HomeScreen: React.FC = () => {
    const { goBack, navigate } = useNavigation();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("Auth");
    };

    return (
        <View>
            <Text>Hi</Text>
            <Button onPress={goBack}>
                <Text>Go back</Text>
            </Button>
            <Button onPress={handleLogout}>
                <Text>Logout</Text>
            </Button>
        </View>
    );
};
