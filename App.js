/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { Provider as StoreProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import store from './src/redux/store'
import {StackNavigator} from './src/navigation/stack';

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
        <StoreProvider store={store}>
          <PaperProvider>
            <NavigationContainer>
              <StackNavigator/>
            </NavigationContainer>
          </PaperProvider>
        </StoreProvider>
    </>
  );
};

export default App;
