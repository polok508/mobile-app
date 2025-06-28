import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "../../constans/colors";

const TabsLayout = () => {
    const {isSignedIn, isLoaded} = useAuth();

    if(!isLoaded) return null;

    if(!isSignedIn) return <Redirect href={"/(auth)/sign-in"}/>

    return (
    
    <Tabs screenOptions={{headerShown: false, tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight, 
        
        tabBarStyle: {backgroundColor: COLORS.white, borderTopColor: COLORS.border, 
        borderTopWidth: 1, paddingBottom: 8, height: 80}, 
        
        tabBarLabelStyle: {fontSize: 12, fontWeight: "600"},
    }}>

        {/* рецепты */}

        <Tabs.Screen name="index" 
        options={{title: "Рецепты", tabBarIcon: ({color, size}) => 
        <Ionicons name="restaurant" size={size} color={color}/>}}/>

        {/* поиск */}

        <Tabs.Screen name="search" 
        options={{title: "Поиск", tabBarIcon: ({color, size}) => 
        <Ionicons name="search" size={size} color={color}/>}}/>

        {/* любимое */}

        <Tabs.Screen name="favorites" 
        options={{title: "Любимое", tabBarIcon: ({color, size}) => 
        <Ionicons name="heart" size={size} color={color}/>}}/>
        
    </Tabs>
);
};

export default TabsLayout;