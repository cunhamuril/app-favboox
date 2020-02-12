import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  ActivityIndicator,
  FlatList,
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
  const [footerLoading, setFooterLoading] = useState(false);
  const [page, setPage] = useState(null);

  const searchInput = useRef()
  const list = useRef()

  // Função responsável por carregar os livros a partir da busca
  function handleSubmit() {
    if (!searchValue) return Toast.show("Informe um valor")

    setLoading(true)
    loadBooks("search", 1)
  }

  // Função responsável por carregar os livros a partir do scroll
  function handleScrolling() {
    setFooterLoading(true)
    loadBooks("scroll")
  }

  async function loadBooks(type, index) {
    const res = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: searchValue.toLowerCase(),
        startIndex: index || page,
        filter: "ebooks"
      }
    })

    // Validação
    if (!res.data || res.data.totalItems === 0) {
      setError(true)
      setData([])
    } else {
      setError(false)

      // Se for do tipo busca, vai substituir o state Data
      if (type === "search") {
        setData(res.data.items)
        // Na verdade não é página, é o índice que começa. 
        // Quando buscar, o sistema vai setar o valor de page para 11 que é a próxima página
        // e assim vai acrescentando de 10 em 10 nas próximas páginas
        setPage(11)
      }

      // Se for do tipo scroll, vai incrementar os itens da próxima página com o state Data
      if (type === "scroll") {
        setData([...data, ...res.data.items])
        setFooterLoading(false)
        setPage(page + 10)
      }
    }

    setLoading(false)
  }

  const renderCards = ({ item }) => (
    <Card
      id={item.id}
      title={item.volumeInfo.title}
      author={item.volumeInfo.authors ? item.volumeInfo.authors : "Nenhum autor especificado"}
      description={item.volumeInfo.description}
      publisher={item.volumeInfo.publisher}
      thumbnail={item.volumeInfo.imageLinks
        ? item.volumeInfo.imageLinks.thumbnail
        : "https://screenshotlayer.com/images/assets/placeholder.png"
      }
      buyLink={item.saleInfo.buyLink && item.saleInfo.buyLink}
    />
  )

  const renderFooter = () => {
    if (!footerLoading) return null

    return (
      <View style={{ alignItems: "center", justifyContent: "center", height: 100 }}>
        <ActivityIndicator size="small" color="#000" />
      </View>
    )
  }

  return (
    <>
      {/* Search header */}
      <View style={styles.searchContainer}>
        <TouchableWithoutFeedback onPress={() => searchInput.current.focus()}>
          <Icon name="search" style={styles.searchIcon} />
        </TouchableWithoutFeedback>
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
      {loading ?
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#000" />
        </View>
        :
        data.length !== 0 && !error ?
          <FlatList
            ref={list}
            style={styles.container}
            data={data}
            renderItem={renderCards}
            keyExtractor={(item, index) => String(index)}
            onEndReached={handleScrolling}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
          />
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