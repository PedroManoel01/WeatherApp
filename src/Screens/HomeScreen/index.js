import React from "react";
import { StyleSheet, Text, View, PermissionsAndroid, Button, Platform } from "react-native";
import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen({ navigation,route }) {
  const favoritos = [0]
  favoritos.unshift(route.params?.favoritoNome)
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button title = "Go to Map" onPress ={() => navigation.navigate('Map')}/>
      <Text> salvos:{favoritos}</Text>
    </View>
  );
}
export default HomeScreen;
