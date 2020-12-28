import React, { useState,useEffect } from "react";
import { StyleSheet, Text,TextInput, View, PermissionsAndroid, Button, Platform } from "react-native";
import Geolocation from '@react-native-community/geolocation';
import MapView,{Marker} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';

export default function Map() {
  const [coordinate, setCoordinate] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [info,setInfo]= useState({
    name:"loading",
    temp:"loading",
    humidity:"loading",
    desc:"loading",
    icon:"loading"
  })
   const [text, setText] = useState('');
   const navigation = useNavigation()
//Solicita acesso pra pegar a localização atual
  const callLocation = () => {
      const requestLocationPermission = async () => {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permissão de Acesso à Localização",
            message: "Este aplicativo precisa acessar sua localização.",
            buttonNeutral: "Pergunte-me depois",
            buttonNegative: "Cancelar",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        } else {
          alert('Permissão de Localização negada');
        }
      };
      requestLocationPermission();
  }
  // Pega a localização Atual
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const currentLatitude = JSON.stringify(position.coords.latitude);
        const currentLongitude = JSON.stringify(position.coords.longitude);
        setCoordinate({
          latitude:currentLatitude,
          longitude: currentLongitude,
        })
      }
    );
  }
  useEffect(()=>{
      getLocation()
  },[])
  const  getWeather = () =>{
    var latitude = coordinate.latitude.toString()
    var longitude = coordinate.longitude.toString()
    fetch('https://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&appid=075113093f20a219f26575c36cc4a929&units=metric')
    .then(data=>data.json())
    .then(results=>{
      console.log(results)
      setInfo({
        name:results.name,
        temp:results.main.temp,
        humidity:results.main.humidity,
        desc:results.weather[0].description,
        icon:results.weather[0].icon,
      })
    })
  }
  function saveName(){
    navigation.navigate('HomeScreen',{favoritoNome:text});
  }


  var latitude = Number(coordinate.latitude)
  var longitude = Number(coordinate.longitude)

    return (

      <View style={styles.container}>

        <MapView
          style={styles.map}
          region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 5,
            longitudeDelta: 5,
          }}
          onPress ={(results=>{
            setCoordinate({
              latitude:results.nativeEvent.coordinate.latitude,
              longitude:results.nativeEvent.coordinate.longitude,
            });
            getWeather();
          }
        )}
      >
      <Marker coordinate={{
        latitude: latitude,
        longitude:longitude,
        latitudeDelta: 5,
        longitudeDelta:5,
      }} />
        </MapView>
        <View style={styles.button}>
          <Button title='Obter Localização' onPress={callLocation}/>
        </View>
        <View style = {styles.button}>
          <Button title='pega o clima do local selecionado' onPress={getWeather}/>
        </View>
        <View style={styles.text}>
          <Text>
            Temperatura: {info.temp}
          </Text>
          <Text>
            Humidade: {info.humidity}
          </Text>
        </View>
        <View style={styles.texto}>
          <TextInput
          value={text}
          onChangeText={text => setText(text)}
          />
        </View>
        <View style = {styles.button}>
          <Button title='Salvar' onPress = {saveName}/>
        </View>
      </View>

    );
}

const styles = StyleSheet.create({

  container: {
    width: 600,
    height:600
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
