import { useGlobalContext } from '../../context/GlobalProvider';
import { View, Text, ScrollView,Image, Alert } from 'react-native'
import React,{useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from './../../components/CustomButton';
import { Link, router } from 'expo-router';
import { signIn,getCurrentUser } from '../../lib/appwrite';

const SignIn = () => {
  const{setUser,setIsLoggedIn} = useGlobalContext();
const[isSubmitting,setIsSubmitting] = useState(false);
const [form,setForm] = useState({
  email:'',
  password:''
})
const submit = async()=>{
  if(form.email==="" || form.password===""){
    Alert.alert('Error, please fill all the field');
  }
  setIsSubmitting(true);
  try {
    await signIn(form.email,form.password)
    const result = await getCurrentUser();
    setUser(result);
    setIsLoggedIn(true);
    Alert.alert("Success")
    router.replace('/home')
  } catch (error) {
    Alert.alert('Error: ', error.message)
  }finally{
    setIsSubmitting(false);
  }
}
  return (
   <SafeAreaView className='bg-primary h-full'>
    <ScrollView>
      <View className='w-full justify-center h-full px-4 my-6'>
        <Image source={images.logo} 
        className='w-[115px h-[35px]'
        resizeMode='contain'
        />
        <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>Log in to Aora</Text>
        <FormField
        title='Email'
        value={form.email} 
        handleTextChange={(e)=>setForm({...form,email:e})}
        otherStyle='mt-7'
        keyboardType='email-address'
        />
        <FormField
        title='Password'
        value={form.password} 
        handleTextChange={(e)=>setForm({...form,password:e})}
        otherStyle='mt-7'
        />
        <CustomButton
        title="Sign In"
        handlePress={submit}
        containerStyle='mt-10'
        isLoading={isSubmitting}
        />
        <View className='justify-center pt-5 flex-row gap-2'>
          <Text className='text-lg text-gray-100 font-pregular'>Don't have account?</Text>
          <Link href='/sign-up' className='text-lg font-pregular text-secondary-200'>Sign Up</Link>
        </View>
      </View>
    </ScrollView>
   </SafeAreaView>
  )
}

export default SignIn