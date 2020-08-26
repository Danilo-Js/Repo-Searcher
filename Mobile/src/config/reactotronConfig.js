import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactotron.configure({
    // FOR ANDROID
    // host: 192.168.x.x
    // if still not working, you should redirect the doors via adb
    // in your terminal, run adb reverse tcp:9090 tcp:9090, and if
    // adb isn't in your path variables, you should run with your sdk directory, like
    // ~/Android/Sdk/platform-tools/adb reverse tcp:9090 tcp:9090
  })
    .useReactNative()
    .connect();

  console.tron = tron;

  tron.clear();
}
