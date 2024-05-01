import { StyleSheet } from 'react-native';

export default SharedStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#efefef" // default
  },
  containerLight: {
    backgroundColor: "#efefef"
  },
  containerDark: {
    backgroundColor: "#000"
  },
  shadowButton: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    borderWidth: 0.5,

    // shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 1,
    paddingHorizontal: 5,
    textAlign: "right",
  },
});
