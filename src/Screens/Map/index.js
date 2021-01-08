import React, { useState,useEffect } from "react";
import { StyleSheet, Text, View, PermissionsAndroid, Button, Platform } from "react-native";
import Geolocation from '@react-native-community/geolocation';
import MapView,{Marker} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage'
import {TextInput} from 'react-native-paper'

export default function Map({route :{params}}) {
  const [coordinate, setCoordinate] = useState({
    latitude: 0,
    longitude: 0,
  });
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
  //Roda a função de pegar a localização atual
  useEffect(()=>{
      getLocation()
  },[])
//Salva as variaveis que irão retornar pra tela inicial
const setItems = () => {
      const data = params.dados;
      data.unshift({
        id:text,
        latitude:coordinate.latitude,
        longitude:coordinate.longitude
       })
      saveData(data);
      console.log(data)
  };
  //Salva as variaveis em um JSON
  const saveData = async (data) => {
     try {
         await AsyncStorage.setItem('@data',JSON.stringify(data));
         console.log('Token salvo com sucesso!');
     } catch (error) {
         console.log('Erro ao salvar token');
    }
}

//váriaveis para fazer o mapa funcionar de maneira correta
  var latitude = Number(coordinate.latitude)
  var longitude = Number(coordinate.longitude)
  var sendText = text.toString()
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
        <View style={styles.textoEntrada}>
          <TextInput
          value={text}
          placeholder = 'Digite o nome do local favorito'
          mode = 'outlined'
          onChangeText={(event) =>
            {setText(event)
            console.log(event)
            }}
          />
        </View>
        <View style = {styles.button}>
          <Button title='Salvar' onPress ={() => {
            setItems();
            navigation.goBack()
          }}/>
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
    marginTop: 20,
    right:100,},
  textoEntrada: {

  }

});
