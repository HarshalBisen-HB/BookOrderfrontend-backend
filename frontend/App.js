
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./screens/Login";
import Home from "./screens/Home";
import Register from "./screens/Register";
import Orders from "./screens/Order";
// import OrderDetails from "./components/OrderDetails";
import BookDetails from "./screens/BookDetails";
import UserContext from "./context/userContext";

export default function App() {
  var Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <UserContext.Provider value="Guest">
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Orders" component={Orders} />
          {/* <Stack.Screen name="OrderDetails" component={OrderDetails} /> */}
          <Stack.Screen name="BookDetails" component={BookDetails} />
        </Stack.Navigator>
      </UserContext.Provider>
    </NavigationContainer>
  );
}
