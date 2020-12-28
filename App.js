import React, { useState } from "react";
import { StyleSheet, Text, View, PermissionsAndroid, Button, Platform } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DetailsScreen from './src/Screens/DetailsScreen';
import HomeScreen from './src/Screens/HomeScreen';
import Map from './src/Screens/Map';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="HomeScreen" component={HomeScreen}
          options={{headerShown: false}}/>
        <Stack.Screen name="Map" component = {Map}
        options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
