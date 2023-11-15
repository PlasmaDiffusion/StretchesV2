import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { StretchItem } from './components/StretchItem';

const stretches = [
  {name:'aaa', color:'red'},
  {name:'bbb', color: 'salmon'},
  {name:'ccc', color: 'orange'},
]

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Select Stretches</Text>
      {stretches.map((stretch, index)=>(
      <StretchItem name={stretch.name} color={stretch.color}/>))
      }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
