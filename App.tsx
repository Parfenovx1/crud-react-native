import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Platform, Image, ImageSourcePropType, Dimensions, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';
import { ListItem } from './interface';
import tw from 'twrnc';
import { getItems, deleteItem, saveItem } from './api/api';

export default function App() {

  //state initialization

  const [list, setList] = useState<ListItem[]>([]);

  const [modal, setModal] = useState<Boolean>(false);

  const [id, setId] = useState<Number>(0);
  const [active, setActive] = useState<Number>(1);
  const [text, setText] = useState<String>('');
  const [title, setTitle] = useState<String>('');
  const [url, setUrl] = useState<String>('');
  const [image, setImage] = useState<String>('');

  //useEffect to get list of items on initial render

  useEffect(() => {
    getItemsList();
  }, [])

  //API requests

  const getItemsList = async () => {
    try {
      const data = await getItems();
      setList(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleRemove = async (item: ListItem) => {
    try {
      await deleteItem(item);
      getItemsList();
    } catch (error) {
      console.error(error);
    }
  }

  const handleSave = async () => {
    try {
      const state = { active, title, text, url, image };
      await saveItem(id, state)
      setModal(false);
      clearForm();
      getItemsList();
    } catch (error) {
      console.error(error);
    }
  }

  //methods

  const handleCreate = () => {
    setModal(true)
  }

  const handleUpdate = (item: ListItem) => {
    setId(item.id)
    setActive(item.active);
    setText(item.text);
    setTitle(item.title);
    setUrl(item.url);
    setImage(item.image);
    setModal(true);
  }


  const clearForm = () => {
    setActive(1);
    setText('');
    setTitle('');
    setUrl('');
    setId(0);
    setImage('')
  }

  const handleCloseModal = () => {
    clearForm();
    setModal(false)
  }

  //item component

  const renderItem = useCallback(({ item }: any) => (
    <View key={item.id} style={[tw`flex text-center pt-2 pb-2 flex-row justify-around border-b`]}>
      <View style={[tw`items-center p-3`]}>
        <Text>Id: {item.id}</Text>
        <Text>Is Active: {item.active === 0 ? "No" : "Yes"}</Text>
        <Text>Title: {item.title}</Text>
        <Text>Text: {item.text}</Text>
        <Text>URL: {item.url}</Text>
      </View>
      <View style={[tw`items-center`]}>
        <Image style={[tw`w-36 h-20`]} source={{ uri: item.image }} />
        <View style={[tw`flex justify-between mt-1 flex-row`]}>
          <TouchableOpacity style={[tw`border-red-700 border-2 p-2 mr-1 rounded-2xl`]} onPress={() => handleRemove(item)}>
            <Text style={[tw`text-red-700 font-bold`]}>DELETE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[tw`border-green-900 border-2 p-2 ml-1 rounded-2xl`]} onPress={() => handleUpdate(item)}>
            <Text style={[tw`text-green-900 font-bold`]}>UPDATE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [])

  //application view

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      {!modal ? null :
        <Modal animationType="slide" transparent visible={Boolean(modal)}>
          <SafeAreaView style={[tw`bg-red-200 h-3/4 top-[30%] rounded-t-2xl shadow-black`]}>
            <View style={[tw`flex flex-row justify-between border-b p-2 items-center`]}>
              <Text>New Item</Text>
              <TouchableOpacity style={[tw`border-gray-600 rounded-2xl border-2 p-2`]} onPress={handleCloseModal}>
                <Text style={[tw`text-gray-600 font-bold`]}>CLOSE</Text>
              </TouchableOpacity>
            </View>
            <View style={[tw`pl-2 pr-2 mt-5`]}>
              <Text>Is Active</Text>
              <TextInput keyboardType='numeric' maxLength={1} style={[tw`border-gray-600 rounded-xl border p-2 mb-1`]} placeholder='Is Active' value={active?.toString()} onChangeText={(text) => {
                setActive(Number(text))
              }} />

              <Text>Image</Text>
              <TextInput style={[tw`border-gray-600 rounded-xl border p-2 mb-1`]} placeholder='Image https link' value={image.toString()} onChangeText={text =>
                setImage(text)
              } />

              <Text>Title</Text>
              <TextInput style={[tw`border-gray-600 rounded-xl border p-2 mb-1`]} placeholder='Title' value={title.toString()} onChangeText={text =>
                setTitle(text)
              } />

              <Text>Text</Text>
              <TextInput style={[tw`border-gray-600 rounded-xl border p-2 mb-1`]} placeholder='Text' value={text.toString()} onChangeText={text =>
                setText(text)
              } />

              <Text>URL</Text>
              <TextInput style={[tw`border-gray-600 rounded-xl border p-2 mb-1`]} placeholder='URL' value={url.toString()} onChangeText={text =>
                setUrl(text)
              } />
              <TouchableOpacity style={[tw`border-pink-800 rounded-2xl border-2 pt-2 pb-2 pl-3 pr-2 w-16 mt-2 flex self-end`]} onPress={handleSave}>
                <Text style={[tw`text-pink-800 font-bold`]}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>}
      <View>
        <View style={[tw`flex flex-row justify-between border-b pb-1`]}>
          <Text style={[tw`p-2`]}>Items List: {list.length}</Text>
          <TouchableOpacity style={[tw`p-2 border-indigo-700 border-2 mr-2 rounded-2xl`]} onPress={() => handleCreate()}>
            <Text style={[tw`text-indigo-700 font-bold`]}>NEW</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          contentContainerStyle={[tw`pl-2 pr-2 pb-12`]}
          data={list}
          renderItem={renderItem}
          keyExtractor={({ id }: any) => id.toString()}
        />
        <StatusBar style="auto" />
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  droidSafeArea: {
    width: Dimensions.get("screen").width,
    flex: 1,
    backgroundColor: 'lightgray',
    paddingTop: Platform.OS === 'android' ? 40 : 0
  }
});
