import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons'
import * as SQLite from "expo-sqlite";

import Card from '../components/Card'


export default function LinksScreen() {
  const db = SQLite.openDatabase("favboox.db")

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    function loadFavorites() {
      const query = "SELECT * FROM favorites"

      db.transaction(
        tx => tx.executeSql(
          query,
          [],
          (_, { rows: { _array } }) => setFavorites(_array),
          err => console.error(err)
        )
      )
    }

    loadFavorites()
  }, [favorites])


  return (
    <ScrollView style={styles.container}>
      {favorites.length === 0 ?
        <View style={styles.errorContainer}>
          <Icon name="error" style={styles.errorIcon} />
          <Text style={styles.errorMessage} >Nenhum favorito salvo</Text>
        </View>
        :
        favorites.map(fav => (
          <Card
            key={fav.id}
            id={fav.id_book}
            title={fav.title}
            author={fav.author}
            publisher={fav.publisher}
            description={fav.description}
            thumbnail={fav.thumbnail}
            buyLink={fav.buy_link}
          />
        ))
      }
    </ScrollView>
  );
}

LinksScreen.navigationOptions = {
  title: 'Favoritos',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    paddingTop: 20,
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },

  errorIcon: {
    fontSize: 80,
    color: "#999",
    marginBottom: 10,
  },

  errorMessage: {
    fontSize: 20,
    color: "#999"
  },
});
