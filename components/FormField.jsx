import { View, Text, TextInput, TouchableOpacity,Image } from 'react-native'
import React,{useState} from 'react'
import {icons} from '../constants';

const FormField = ({title,value,placeholder,handleTextChange,otherStyle,...props}) => {
    const[showPass, setShowPass] = useState(false);
    
  return (
    <View className={`space-y-2 ${otherStyle}`}>
      <Text className=' text-white'>{title}</Text>
      <View className='w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary-200 items-center flex-row'>
        <TextInput
        className='flex-1 text-white font-psemibold text-base'
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#7b7b8b"
        onChangeText={handleTextChange}
        secureTextEntry={title === "Password" && !showPass}
        />
        {title === 'Password' && 
        <TouchableOpacity onPress={()=> setShowPass(!showPass)}>
            <Image source={!showPass ? icons.eye : icons.eyeHide} className='w-6 h-6'/>
        </TouchableOpacity>}
      </View>
    </View>
  )
}

export default FormField