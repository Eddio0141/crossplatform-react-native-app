import { View, StyleSheet } from 'react-native';

// a horizontal line
export default function HLine() {
  return (
    <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }}>
      <View style={{ flex: 1, borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, }} />
    </View>
  );
}
