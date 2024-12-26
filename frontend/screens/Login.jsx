import React, { useState, useContext } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator } from "react-native";
import {
  Button,
  TextInput,
  Text,
  Surface,
  Portal,
  Provider,
  IconButton,
  useTheme,
  Divider,
  Snackbar,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import UserContext from "../context/userContext";

function Login(props) {
  const theme = useTheme();
  const uContextName = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const HandleLogin = async () => {
    if (!email || !password) {
      setSnackMessage("Please fill in all fields");
      setSnackVisible(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4444/user/login", { 
        email, 
        password 
      });

      if (response.data.data != null || response.data.data != undefined) {
        await AsyncStorage.setItem("userId", response.data.data.user_id);
        await AsyncStorage.setItem("userName", response.data.data.first_name);
        props.navigation.navigate("Home");
      } else {
        setSnackMessage("Login failed! Invalid Credentials");
        setSnackVisible(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setSnackMessage("An error occurred. Please try again.");
      setSnackVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <Surface style={styles.loginContainer} elevation={4}>
          <Text variant="headlineMedium" style={styles.loginTitle}>
            Welcome Back
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              activeOutlineColor="#6D5ACD"
              left={<TextInput.Icon icon="email" />}
              autoCapitalize="none"
              keyboardType="email-address"
              disabled={loading}
            />

            <TextInput
              mode="outlined"
              label="Password"
              value={password}
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              left={<TextInput.Icon icon="lock" />}
              onChangeText={setPassword}
              style={styles.input}
              activeOutlineColor="#6D5ACD"
              disabled={loading}
            />
          </View>

          <Button
            mode="text"
            onPress={() => {}}
            textColor="#6D5ACD"
            style={styles.forgotPassword}
            disabled={loading}
          >
            Forgot Password?
          </Button>

          <Button
            mode="contained"
            onPress={HandleLogin}
            style={styles.signInBtn}
            buttonColor="#6D5ACD"
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              "Sign In"
            )}
          </Button>

          <View style={styles.socialLogin}>
            <View style={styles.dividerContainer}>
              <Divider style={styles.divider} />
              <Text style={styles.socialLoginText}>Or continue with</Text>
              <Divider style={styles.divider} />
            </View>

            <View style={styles.socialIcons}>
              <IconButton
                icon="google"
                size={24}
                mode="outlined"
                containerColor="#f9f9f9"
                iconColor="#6D5ACD"
                onPress={() => {}}
                disabled={loading}
              />
              <IconButton
                icon="twitter"
                size={24}
                mode="outlined"
                containerColor="#f9f9f9"
                iconColor="#6D5ACD"
                onPress={() => {}}
                disabled={loading}
              />
            </View>
          </View>

          <View style={styles.signupLink}>
            <Text style={styles.signupText}>
              Don't have an account?{" "}
              <Text 
                onPress={() => props.navigation.navigate("Register")} 
                style={styles.signupLinkText}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </Surface>

        <Portal>
          <Snackbar
            visible={snackVisible}
            onDismiss={() => setSnackVisible(false)}
            duration={3000}
            action={{
              label: "Close",
              onPress: () => setSnackVisible(false),
            }}
          >
            {snackMessage}
          </Snackbar>
        </Portal>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    padding: 20,
  },
  loginContainer: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
  },
  loginTitle: {
    color: "#333",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  signInBtn: {
    borderRadius: 8,
    marginBottom: 20,
    paddingVertical: 6,
  },
  socialLogin: {
    marginBottom: 20,
    alignItems: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  divider: {
    flex: 1,
    backgroundColor: "#ddd",
  },
  socialLoginText: {
    color: "#555",
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  signupLink: {
    alignItems: "center",
  },
  signupText: {
    color: "#555",
    fontSize: 14,
  },
  signupLinkText: {
    color: "#6D5ACD",
    fontWeight: "bold",
  },
});

export default Login;