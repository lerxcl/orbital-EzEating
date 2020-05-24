import React from 'react';
import { StyleSheet, SafeAreaView} from 'react-native';
import LogInContainer from './container/LogInContainer';

export default function App() {
  return (
      <SafeAreaView style={styles.container}>
        <LogInContainer />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff'
  }
});
