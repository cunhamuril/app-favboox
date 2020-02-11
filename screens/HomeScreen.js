import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons'
import Toast from 'react-native-simple-toast'
import axios from 'axios'

import Card from '../components/Card'

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchInput = useRef()

  async function handleSubmit() {
    if (!searchValue) return Toast.show("Informe um valor")

    setLoading(true)

    const res = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: { q: searchValue.toLowerCase() }
    })

    if (res.data && res.data.totalItems !== 0) {
      setError(false)
      setData(res.data.items)
    } else {
      setError(true)
      setData([])
    }

    setLoading(false)
  }

  return (
    loading ?
      <View style={styles.errorContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
      :
      <>
        {/* Search header */}
        <View style={styles.searchContainer}>
          <Icon name="search" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar livro"
            autoCapitalize="words"
            value={searchValue}
            onChangeText={text => setSearchValue(text)}
            onSubmitEditing={handleSubmit}
            ref={searchInput}
          />
          {searchValue.length > 0 &&
            <TouchableOpacity onPress={() => {
              searchInput.current.focus()
              if (searchValue.length > 0) setSearchValue("")
            }}>
              <Icon name="close" style={styles.iconClean} />
            </TouchableOpacity>
          }
        </View>

        {/* Content */}
        <ScrollView style={styles.container}>
          {data.length !== 0 && !error
            ? data.map(book => (
              <Card
                key={book.id}
                id={book.id}
                title={book.volumeInfo.title}
                author={book.volumeInfo.authors ? book.volumeInfo.authors : "Nenhum autor especificado"}
                description={book.volumeInfo.description}
                publisher={book.volumeInfo.publisher}
                thumbnail={book.volumeInfo.imageLinks
                  ? book.volumeInfo.imageLinks.thumbnail
                  : "https://screenshotlayer.com/images/assets/placeholder.png"
                }
                buyLink={book.saleInfo.buyLink && book.saleInfo.buyLink}
              />
            ))
            : !error ?
              <View style={styles.errorContainer}>
                <Icon name="book" style={styles.errorIcon} />
                <Text style={styles.errorMessage} >Faça sua busca de livros!</Text>
              </View>
              :
              <View style={styles.errorContainer}>
                <Icon name="error" style={styles.errorIcon} />
                <Text style={styles.errorMessage} >Nenhum livro encontrado!</Text>
              </View>
          }
        </ScrollView>
      </>
  )
};

HomeScreen.navigationOptions = {
  title: 'FavBoox',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    paddingTop: 20,
  },

  searchContainer: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  searchInput: {
    flex: 10,
    paddingVertical: 10,
    marginVertical: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: "#CCC",
  },

  iconClean: {
    color: "#CCC",
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 9.4,
    borderBottomColor: "#CCC",
    borderBottomWidth: 0.2,
  },

  searchIcon: {
    color: "#CCC",
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 9.4,
    borderBottomColor: "#CCC",
    borderBottomWidth: 0.2,
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
})

export default HomeScreen;