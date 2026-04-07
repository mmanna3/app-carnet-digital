import React from 'react'
import { Platform } from 'react-native'
import Torneos from '@/app/torneos/index'
import HomeMobile from '@/app/home-mobile'

export default function HomeScreen() {
  if (Platform.OS === 'web') return <Torneos />

  return <HomeMobile />
}
