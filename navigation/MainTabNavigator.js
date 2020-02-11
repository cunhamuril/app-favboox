import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import Colors from '../constants/Colors'

import HomeScreen from '../screens/HomeScreen';
import FavoriteScreen from '../screens/FavoriteScreen';

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
    <TabBarIcon focused={focused} name="search" />
  ),
  tabBarOptions,
};

HomeStack.path = '';

const FavoritesStack = createStackNavigator(
  {
    Favorite: FavoriteScreen,
  },
  config
);

FavoritesStack.navigationOptions = {
  tabBarLabel: 'Favoritos',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name="favorite" />
  ),
  tabBarOptions
};

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  FavoritesStack,
});

export default tabNavigator;
