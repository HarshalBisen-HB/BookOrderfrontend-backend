import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  Dimensions,
} from "react-native";
import {
  Card,
  Text,
  IconButton,
  Surface,
  Chip,
  ActivityIndicator,
  useTheme,
  Searchbar,
} from "react-native-paper";
import axios from "axios";

const windowWidth = Dimensions.get("window").width;
const numColumns = 2;

function Home(props) {
  const theme = useTheme();
  const [books, setBooks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllBooks = async () => {
    try {
      setRefreshing(true);
      const reply = await axios.get("http://localhost:4444/book/all");
      setBooks(reply.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const searchBookByTitle = async () => {
    try {
      setLoading(true);
      const reply = await axios.get(
        `http://localhost:4444/book/title?title=${searchText}`
      );
      setBooks(reply.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderBookCard = ({ item }) => (
    <Surface style={styles.cardSurface} elevation={4}>
      <Card
        style={styles.card}
        onPress={() =>
          props.navigation.navigate("BookDetails", { bookId: item.book_id })
        }
      >
        <Card.Cover
          source={{ uri: "https://picsum.photos/400/600" }}
          style={styles.cardCover}
        />
        <Card.Content style={styles.cardContent}>
          <Text
            variant="titleMedium"
            style={styles.bookTitle}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text
            variant="bodyMedium"
            style={styles.authorText}
            numberOfLines={1}
          >
            by {item.author}
          </Text>
          <View style={styles.chipContainer}>
            <Chip
              icon="book"
              style={styles.chip}
              textStyle={styles.chipText}
              compact
            >
              Fiction
            </Chip>
            <IconButton
              icon="heart-outline"
              size={20}
              style={styles.favoriteButton}
              iconColor="#6D5ACD"
            />
          </View>
        </Card.Content>
      </Card>
    </Surface>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Discover
          </Text>
          <Text variant="bodyLarge" style={styles.headerSubtitle}>
            Find your next favorite book
          </Text>
        </View>
        <IconButton
         label="Cart"
          icon="cart"
          size={28}
          mode="contained"
          containerColor="#6D5ACD"
          iconColor="white"
          style={styles.cartButton}
          onPress={() => props.navigation.navigate("Orders")}
        />
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search Books"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={searchBookByTitle}
          style={styles.searchBar}
          iconColor="#6D5ACD"
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6D5ACD" />
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.book_id.toString()}
          renderItem={renderBookCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={fetchAllBooks}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "white",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "#666",
  },
  cartButton: {
    marginLeft: 16,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: "white",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 2,
    marginBottom: 10,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  listContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  cardSurface: {
    width: (windowWidth - 40) / numColumns,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: "white",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
  },
  cardCover: {
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
  },
  bookTitle: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    fontSize: 14,
  },
  authorText: {
    color: "#666",
    marginBottom: 8,
    fontSize: 12,
  },
  chipContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chip: {
    backgroundColor: "#E8E4F3",
    height: 28,
  },
  chipText: {
    color: "#6D5ACD",
    fontSize: 11,
  },
  favoriteButton: {
    margin: 0,
    padding: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
