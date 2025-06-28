import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { authStyles } from "../../assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constans/colors";

const VerifyEmail = ({email, onBack}) => {

    const {isLoaded, signUp, setActive} = useSignUp();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerification = async() => {

        if(!isLoaded) return;

        setLoading(true);

        try {

            const signUpAttemp = await signUp.attemptEmailAddressVerification({code});

            if(signUpAttemp.status === "complete") {

                await setActive({session: signUpAttemp.createdSessionId});
            } else {

                Alert.alert("Error", "Verification failed. Please try again.");
                console.error(JSON.stringify(signUpAttemp, null, 2));

            }
            
        } catch (err) {

            Alert.alert("Error", err.errors?.[0]?.message || "Ошибка");
            console.error(JSON.stringify(err, null, 2));
            
        } finally {

            setLoading(false);

        }
    };

    return (
        <View style={authStyles.container}>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={authStyles.keyboardView} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>

                <ScrollView contentContainerStyle={authStyles.scrollContent}
                showsVerticalScrollIndicator={false}>

                    {/* картинка */}

                    <View style={authStyles.imageContainer}>
                        <Image source={require("../../assets/images/i3.png")}
                        style={authStyles.image} contentFit="contain"/>
                    </View>

                    <Text style={authStyles.title}>Подтвердите свой Email</Text>
                    <Text style={authStyles.subtitle}>Мы отправили код подтверждения на {email}</Text>

                    <View style={authStyles.formContainer}>

                        {/* код подтверждения */}

                        <View style={authStyles.inputContainer}>
                            <TextInput style={authStyles.textInput} placeholder="Введите код подтверждения"
                            placeholderTextColor={COLORS.textLight} value={code} onChangeText={setCode}
                            keyboardType="number-pad" autoCapitalize="none"/>
                        </View>

                        {/* кнопка */}

                        <TouchableOpacity style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                        onPress={handleVerification} disabled={loading} activeOpacity={0.8}>
                            <Text style={authStyles.buttonText}>
                                {loading ? "Verifying..." : "Подтвердить Email"}
                            </Text>
                        </TouchableOpacity>

                        {/* обратно на Sign Up */}

                        <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
                            <Text style={authStyles.link}>Вернуться на регистрацию</Text>
                        </TouchableOpacity>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default VerifyEmail;