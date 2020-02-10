import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import Colors from '../constants/Colors'

import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {}
});

const tabBarOptions = {
  activeTintColor: Colors.tintColor,
}

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Pesquisar',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name="search"
    />
  ),
  tabBarOptions,
};

HomeStack.path = '';

const LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: 'Favoritos',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name="favorite" />
  ),
  tabBarOptions
};

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  LinksStack,
});

export default tabNavigator;
