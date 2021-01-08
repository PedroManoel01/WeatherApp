import React,{useState,useEffect} from "react";
import { StyleSheet, Text, View, PermissionsAndroid, Platform,FlatList,ScrollView,Modal} from "react-native";
import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage'
import {Button,TextInput} from 'react-native-paper'

function HomeScreen({ navigation,route:{params} }) {
const [localData,setLocalData] = useState([])
const [modalVisibility,setModalVisibility]= useState(false)
const [editedText,setEditedText]= useState('')
const [editedItem,setEditedItem]= useState(0)
const [info,setInfo]= useState({
  temp:"",
  humidity:"",
  })
let init;
//Recebe as variaveis e define elas à localdata
const receiveLocalData = async () => {
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

 setTimeout(() => {
 receiveLocalData();
}, 1);
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
 const removeItemFromList= (item)=>{
   let newimagesAddFile = localData;
   newimagesAddFile.splice(item.id,1); //to remove a single item starting at index
   setLocalData(newimagesAddFile)
}
 //Função pra alterar o nome
 function changeName(editedItem){
   const changedData = localData.map( item =>{
     if(item.id === editedItem){
       item.id = editedText
     }
   })
 }

 //Salva para quando o usuario sair continuar os valores
 const saveChangedData = async (localData) => {
    try {
        await AsyncStorage.setItem('@data',JSON.stringify(localData));
        console.log('Token salvo com sucesso!');
    } catch (error) {
        console.log('Erro ao salvar token');
   }
}

  return (
  <View style={styles.container}>
    <Text style = {{fontSize:30}}>WeatherApp</Text>

      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibility}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style = {styles.textoEntrada}
                value={editedText}
                placeholder = 'Editar nome do local favorito'
                mode = 'outlined'
                onChangeText={(event) =>
                  {setEditedText(event)
                    console.log(event)
                  }}
                  />
              <Button onPress ={()=>{
                setModalVisibility(!modalVisibility)
                changeName(editedItem)
                saveChangedData(localData)
              }}>Salvar</Button>
            </View>
          </View>
        </Modal>
      </View>
    <ScrollView>
      <FlatList
        style={styles.lista}
        data ={localData}
        renderItem = {({ item,separators }) => (
        <View style = {styles.button}>
          <Button mode = 'contained' onPress ={() => getWeather(item)}>{item.id}</Button>
          <View style = {styles.espaçamento}>
             <View>
              <Button mode = 'contained' onPress={()=>{
                setModalVisibility(true)
                setEditedItem(item.id)
                }}>Editar</Button>
              <Button mode = 'contained' onPress = {()=> {
                removeItemFromList(item.id)
                saveChangedData(localData)
              }}>Excluir</Button>
            </View>
          </View>
        </View>
      )}
      />
      </ScrollView>
      <View style={styles.unchangeablebuttons}>
        <Button onPress ={() => {navigation.navigate('Map',{dados:localData})}}> Adicionar Favoritos</Button>
      </View>

      <Text>
        Temperatura: {info.temp}
      </Text>
      <Text>
        Umidade: {info.humidity}
      </Text>
    </View>
  );

}
const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
     justifyContent: 'center'
  },
  favoritos:{
    backgroundColor: 'cyan',
    width: 100,
    height:30,
    alignItems: 'center',
    marginTop:10,
    borderRadius: 10,
    justifyContent:'center',

  },
  textoEntrada:{
    height:50,
    width:300
  },
  lista:{
    width:400,
    height:400
  },
  espaçamento:{
    marginLeft:50
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  text:{
    fontSize: 40,
  },
  button: {

    alignItems: 'center',
    justifyContent:'center',
    marginTop:20,
    marginBottom:10,
    flexDirection: 'row',
    marginRight:10
  },
  unchangeablebuttons: {

    alignItems: 'center',
    justifyContent:'center',
    marginTop:20,
    marginBottom:10,
    marginRight:10
  },
  text: {
    alignItems: 'center',
    justifyContent:'center',
    marginTop: 15,
    right: 100,},
    textStyle: {
   color: "white",
   fontWeight: "bold",
   textAlign: "center"
 },
 modalText: {
   marginBottom: 15,
   textAlign: "center"
 }

});

export default HomeScreen;
