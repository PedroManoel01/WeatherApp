import React,{useState,useEffect} from "react";
import { StyleSheet, Text, View, PermissionsAndroid, Button, Platform,FlatList,TouchableHighlight } from "react-native";
import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage'

function HomeScreen({ navigation,route }) {
const [localData,setLocalData] = useState([])
const [info,setInfo]= useState({
  temp:"loading",
  humidity:"loading",
  })

let init;
//Recebe as variaveis e define elas à localdata
const verify = async () => {
   try {
     init = await AsyncStorage.getItem('@data');
     if (init != null) {
       init = JSON.parse(init);
       setLocalData(init)


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
 //Consulta a Api e checa o clima

function getWeather(item) {
   fetch('https://api.openweathermap.org/data/2.5/weather?lat='+item.latitude+'&lon='+item.longitude+'&appid=dc8ae956e7527cd7c2fcbb020dd1dd20&units=metric')
   .then(data=>data.json())
   .then(results=>{
     console.log(results)
     setInfo({
       temp:results.main.temp,
       humidity:results.main.humidity
     })
   })
 }


  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button title = "Adicionar Favorito" style ={styles.button} onPress ={() => {navigation.navigate('Map',{dados:localData})
      console.log(localData)}}/>
      <FlatList
        data ={localData}
        renderItem = {({ item,separators }) => (
          <TouchableHighlight
            key={item.id}
            onPress ={() => getWeather(item)}
            onShowUnderlay={separators.highlight}
            onHideUnderlay={separators.unhighlight}>
            <View  style={{ backgroundColor: 'white' }}>
              <Text>{item.id}</Text>
            </View>
          </TouchableHighlight>
      )}
      />
      <Text>
        Temperatura: {info.temp}
      </Text>
      <Text>
        Humidade: {info.humidity}
      </Text>
    </View>
  );

}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
     justifyContent: 'center'
  },

  map: {

    position: 'absolute',
    top: 200,
    left: 0,
    right: 0,
    bottom: 0,
  },
  button: {
    alignItems: 'center',
    justifyContent:'center',
    marginTop: 15,
    right:100,},
  text: {
    alignItems: 'center',
    justifyContent:'center',
    marginTop: 15,
    right: 100,},

});

export default HomeScreen;
