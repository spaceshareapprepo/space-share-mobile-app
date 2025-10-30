import React from 'react'
import { Drawer } from 'expo-router/drawer'

const DrawerLayout = () => {
  return (
    <Drawer>
      <Drawer.Screen
        name="(home)" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Home',
          title: '',
          headerShown: true
        }}
      />
      <Drawer.Screen
        name="about" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'About',
          title: '',
        }}
      />
    </Drawer>
  )
}

export default DrawerLayout