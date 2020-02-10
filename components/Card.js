import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
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

const Card = ({ title, author, publisher, description, thumbnail, buyLink }) => {
  const [collapse, setCollapse] = useState(false);
  const [favorite, setFavorite] = useState(false);

  function toggleCollapse() {
    setCollapse(!collapse)
  }

  function handleFavorited() {
    setFavorite(!favorite)

    if (favorite) {
      Toast.show("Removido dos favoritos")
    } else {
      Toast.show("Adicionado aos favoritos")
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
              {typeof author === "array" && author.length > 1 ? author.join(',') : author}
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