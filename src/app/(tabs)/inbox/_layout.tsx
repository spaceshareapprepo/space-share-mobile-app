import { Stack, usePathname } from 'expo-router'

export default function InboxLayoutScreen (){
  const pathname = usePathname();
  return (
    <Stack 
    screenOptions={{ headerShown: false, 
      animation: pathname.startsWith("/inbox") ? "default" : "none",
    }}
     />
  )
}