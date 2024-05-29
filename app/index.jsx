import React from 'react'
import { ScrollView, StyleSheet, Text, View,Image } from 'react-native'
import { Link,Redirect,router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../constants';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';
import { StatusBar } from 'expo-status-bar';

const index = () => {
  const{loading,isLoggedIn} = useGlobalContext();
  if(!loading && isLoggedIn) return <Redirect href='/home'/>
  return (
    <SafeAreaView className='bg-primary h-full'>
      <StatusBar backgroundColor='#161622' style='light' />
      <ScrollView contentContainerStyle={{height:"100%"}}>
        <View className='w-full justify-center items-center min-h-[85vh] px-4'>
          <Image 
          source={images.logo}
          className=' w-[130px] h-[84px]'
          resizeMode='contain'
          />
          <Image
          source={images.cards}
          className=' max-w-[380px] w-full h-[300px]'
          resizeMode='contain'
          />
          <View className='relative mt-5'>
            <Text className='text-3xl text-white font-bold text-center'>
              Discover Endless Possibilities with{' '}
              <Text className='text-secondary-200'>Aora</Text>
            </Text>
            <Image
            source={images.path}
            className='w-[136px] h-[15px] absolute -bottom-2 -right-8'
            resizeMode='contain'
            />
          </View>
          <Text className='text-sm text-center mt-7 text-gray-100'>Where creativity meets innovation: embark on a journey of limitless exploration with Aora</Text>
          <CustomButton
           title='Continue with email'
           handlePress={()=>router.push('/sign-in')}
           containerStyle='w-full mt-10' 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default index

const styles = StyleSheet.create({})