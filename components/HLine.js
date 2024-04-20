import { View, StyleSheet } from 'react-native';

// a horizontal line
export default function HLine() {
  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flex: 1, borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, }} />
    </View>
  );
}
