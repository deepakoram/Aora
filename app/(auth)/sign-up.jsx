import { View, Text, ScrollView,Image, Alert } from 'react-native'
import React,{useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from './../../components/CustomButton';
import { Link, router } from 'expo-router';
import {createUser} from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const SignUp = () => {
const{setUser,setIsLoggedIn} = useGlobalContext()
const[isSubmitting,setIsSubmitting] = useState(false);
const [form,setForm] = useState({
  username:'',
  email:'',
  password:''
})
const submit = async()=>{
  if(form.email === "" || form.password==="" || form.username===""){
    Alert.alert('Error, please fill all the field');
  }
  setIsSubmitting(true);
  try {
    const result = await createUser(form.email,form.password,form.username)
    setUser(result);
    setIsLoggedIn(true);
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
        <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>Sign Up to Aora</Text>
        <FormField
        title='Username'
        value={form.username} 
        handleTextChange={(e)=>setForm({...form,username:e})}
        otherStyle='mt-7'
        />
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
          <Text className='text-lg text-gray-100 font-pregular'>Have an account already?</Text>
          <Link href='/sign-in' className='text-lg font-pregular text-secondary-200'>Sign In</Link>
        </View>
      </View>
    </ScrollView>
   </SafeAreaView>
  )
}

export default SignUp