import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screen/home';

const Stack = createStackNavigator();

const screenList = {
    Chart: HomeScreen
};

export const StackNavigator = () => {
    return (
        <Stack.Navigator>
            {Object.keys(screenList).map(t => (
                <Stack.Screen key={t} name={t} component={screenList[t]} />
            ))}
        </Stack.Navigator>
    )
}
