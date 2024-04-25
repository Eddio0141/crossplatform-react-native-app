import { View, StyleSheet } from 'react-native';
import SharedStyle from '../Style';

export default function Calendar({ events }) {
  return (
    <View style={SharedStyle.container}>
    </View>
  )
}

const styles = StyleSheet.create({
  weekDayText: {
    fontSize: 20,
  }
});
