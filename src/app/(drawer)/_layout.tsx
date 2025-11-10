import React from 'react'
import { Drawer } from 'expo-router/drawer'

export default function DrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="(home)" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Home",
          title: "",
        }}
      />
      <Drawer.Screen
        name="about" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "About",
          title: "",
        }}
      />
      <Drawer.Screen
        name="sign-out" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Sign out",
          title: "",
        }}
      />
    </Drawer>
  );
};

