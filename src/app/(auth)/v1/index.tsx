import { Stack } from 'expo-router'
import React from 'react'

export default function AuthCallbackPage() {
  return (
    <Stack>
        <Stack.Screen name="v1/callback" options={{ headerShown: false }}/>
    </Stack>
  )
}

