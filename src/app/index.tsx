import { Button } from 'react-native';

async function fetchHello() {
  const response = await fetch('/api/hello');
  const data = await response.json();
  alert('Hello ' + data.hello);
}

export default function App() {
  return <Button onPress={() => fetchHello()} title="Fetch hello" />;
}
