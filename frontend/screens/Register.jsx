import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import { Button, TextInput, Card, Avatar, Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import UserContext from "../context/userContext";

function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const uContextName = useContext(UserContext);

  const togglePasswordVisibility = () => {
    setShowPassword(true);
    setTimeout(() => {
      setShowPassword(false);
    }, 2000);
  };

  const HandleRegister = () => {
    axios
      .post("http://localhost:4444/user/register", {
        first_name,
        last_name,
        email,
        password,
      })
      .then((reply) => {
        if (reply.data.status == "success") {
          alert("User registered successfully");
          props.navigation.navigate("Login");
        } else {
          alert("User registration failed", reply.data.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Avatar.Image
        size={80}
      
        style={styles.avatar}
      />
      <Text style={styles.welcomeText}>Welcome ...! {uContextName}</Text>
      <Text style={styles.loginText}>Register</Text>
      <View style={styles.inputContainer}>
        <TextInput
          label="Enter the First Name"
          mode="outlined"
          value={first_name}
          onChangeText={(text) => setFirstName(text)}
          style={styles.input}
        />
        <TextInput
          label="Enter the Last Name"
          mode="outlined"
          value={last_name}
          onChangeText={(text) => setLastName(text)}
          style={styles.input}
        />
        <TextInput
          label="Enter the Email"
          mode="outlined"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          label="Enter the Password"
          mode="outlined"
          secureTextEntry={!showPassword}
          right={
            <TextInput.Icon icon="eye" onPress={togglePasswordVisibility} />
          }
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          icon="login"
          mode="contained"
          onPress={HandleRegister}
          style={styles.signUpButton}
        >
          Register
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f6f6f6",
  },
  avatar: {
    alignSelf: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  loginText: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  signUpButton: {
    borderRadius: 30, // Rounded corners
    paddingVertical: 10,
  },
  divider: {
    marginVertical: 20,
  },
  registerText: {
    textAlign: "center",
    color: "#6200ee",
    textDecorationLine: "underline",
  },
});

export default Register;