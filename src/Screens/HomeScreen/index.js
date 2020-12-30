import React,{useState,useEffect} from "react";
import { StyleSheet, Text, View, PermissionsAndroid, Button, Platform,FlatList } from "react-native";
import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage'

function HomeScreen({ navigation,route }) {
const [localData,setLocalData] = useState({
  id:null,
  latitude: null,
  longitude:null
})

let init;
//Recebe as variaveis e define elas à localdata
const verify = async () => {
   try {
     init = await AsyncStorage.getItem('@data');
     if (init != null) {
       init = JSON.parse(init);
       setLocalData(init)
       console.log(localData)

     } else {
       init = [];
     }
   } catch (e) {
     alert(e);
   }
 };

 useEffect(()=>{
     verify();
 },[])



  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button title = "Go to Map" onPress ={() => {navigation.navigate('Map',{dados:localData})
      console.log(localData)}}/>
      <Button title = 'Recebe as variáveis'
      onPress = {async () =>{
        verify();
        console.log(localData)

      }}/>

    </View>
  );
}

export default HomeScreen;
