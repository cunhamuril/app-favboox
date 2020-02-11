import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons'
import Toast from 'react-native-simple-toast'
import * as SQLite from "expo-sqlite";

const Card = ({ id, title, author, publisher, description, thumbnail, buyLink }) => {
  const db = SQLite.openDatabase("favboox.db")

  const [collapse, setCollapse] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    function getFavorite() {
      const query = "SELECT * FROM favorites WHERE id_book = ?"

      db.transaction(
        tx => tx.executeSql(
          query,
          [id],
          (_, { rows: { _array } }) => {
            setFavorite(_array.length > 0 ? true : false)
          },
          err => console.error(err)
        )
      )
    }

    getFavorite()
  }, [])

  function toggleCollapse() {
    setCollapse(!collapse)
  }

  // Função que converte array de author em string
  function getAuthors() {
    return (
      Array.isArray(author) && author.length > 1
        ? author.join(', ').toString()
        : author.toString()
    )
  }

  function handleFavorited() {
    let query

    if (!favorite) {
      query = `
      INSERT INTO favorites (id_book, title, author, publisher, description, thumbnail, buy_link)
      VALUES (?, ?, ?, ?, ?, ?, ?);
      `

      db.transaction(
        tx => tx.executeSql(
          query,
          [id, title, getAuthors(), publisher, description, thumbnail, buyLink],
          (_, result) => {
            console.log(result)
          },
          err => console.error(err),
        ),
        err => console.error(err),
        success => {
          setFavorite(true)
          Toast.show("Adicionado aos favoritos")
          console.log(success) // TEMP
        }
      )
    } else {
      query = `
      DELETE FROM favorites WHERE id_book = ?
      `

      db.transaction(
        tx => tx.executeSql(
          query,
          [id],
          (_, result) => {
            console.log(result)
          },
          err => console.error(err),
        ),
        err => console.error(err),
        success => {
          setFavorite(false)
          Toast.show("Removido dos favoritos")
          console.log(success) // TEMP
        }
      )
    }
  }

  return (
    <TouchableWithoutFeedback onPress={toggleCollapse}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image style={styles.image} source={{ uri: thumbnail }} />
          <View style={styles.infoContainer}>
            <Text style={{ color: "#444", fontSize: 20 }}>{title}</Text>
            <Text style={{ color: "#AAA", marginTop: 5 }}>
              {getAuthors()}
            </Text>
            <Text style={{ color: "#AAA", marginTop: 5 }}>{publisher}</Text>
          </View>
        </View>

        {collapse &&
          <View style={styles.cardBody}>
            <Text style={{ color: "#666", textAlign: "justify" }}>{description}</Text>

            <View style={styles.cardBtnsContainer}>
              <TouchableOpacity onPress={handleFavorited}>
                <Icon
                  name="favorite"
                  style={{
                    backgroundColor: favorite ? "#000" : "#BBB",
                    ...styles.cardBtn,
                  }}
                />
              </TouchableOpacity>

              {buyLink &&
                <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(buyLink)}>
                  <Icon
                    name="shopping-cart"
                    style={{
                      backgroundColor: "#BBB",
                      ...styles.cardBtn,
                    }}
                  />
                </TouchableOpacity>
              }
            </View>
          </View>
        }

        <View style={styles.expandBar} />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 5,
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#EEE"
  },

  cardHeader: {
    flexDirection: "row"
  },

  image: {
    width: 80,
    height: 120,
    resizeMode: "contain",
  },

  infoContainer: {
    marginHorizontal: 10,
    maxWidth: 245
  },

  cardBody: {
    paddingVertical: 15,
  },

  expandBar: {
    flex: 1,
    height: 2,
    borderRadius: 2,
    backgroundColor: "#CCC",
    width: 50,
    alignSelf: "center"
  },

  cardBtnsContainer: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  cardBtn: {
    fontSize: 20,
    padding: 8,
    marginHorizontal: 5,
    color: "#FFF",
    borderRadius: 5,
  }
})

export default Card;