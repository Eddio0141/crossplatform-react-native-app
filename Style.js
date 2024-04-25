import { StyleSheet } from 'react-native';

export default SharedStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-start",
    ...SharedStyle.containerLight,
  },
  containerLight: {
    backgroundColor: "#e5e5e5"
  },
  containerDark: {
    backgroundColor: "#000"
  },
});
