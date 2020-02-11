import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import * as SQLite from "expo-sqlite";

import AppNavigator from './navigation/AppNavigator';

export default function App() {
  // Abrir DB
  const db = SQLite.openDatabase("favboox.db")

  useEffect(() => {
    function createTable() {
      const query = `
      CREATE TABLE IF NOT EXISTS favorites
      (
        id INTEGER PRIMARY KEY NOT NULL,
        id_book TEXT NOT NULL,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        publisher TEXT,
        description TEXT,
        thumbnail TEXT,
        buy_link TEXT
      )
      `

      db.transaction(
        tx => tx.executeSql(query),
        err => console.error(err)
      )
    }

    createTable()
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
