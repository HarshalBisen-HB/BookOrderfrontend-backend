import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, SafeAreaView } from "react-native";
import {
  Button,
  IconButton,
  Card,
  Text,
  Surface,
  Avatar,
  Divider,
  Portal,
  Modal,
  ActivityIndicator,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

function BookDetails(props) {
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState(props.route.params.bookId);
  const [bookDetails, setBookDetails] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  useEffect(() => {
    fetchBookDetails();
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const [id, bookResponse] = await Promise.all([
        AsyncStorage.getItem("userId"),
        axios.get(`http://localhost:4444/book/${bookId}`)
      ]);
      setUserId(id);
      setBookDetails(bookResponse.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load book details");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (quantity === 0) {
      Alert.alert("Error", "Please select quantity");
      return;
    }

    try {
      setPurchaseLoading(true);
      
      // Update the stock quantity in the backend
      const response = await axios.put(`http://localhost:4444/book/${bookId}`, {
        stock_quantity: bookDetails.stock_quantity - quantity
      });

      if (response.data.success) {
        // Update local state with new stock quantity
        setBookDetails(prevDetails => ({
          ...prevDetails,
          stock_quantity: prevDetails.stock_quantity - quantity
        }));
        
        // Reset quantity
        setQuantity(0);
        
        Alert.alert(
          "Success",
          `Successfully purchased ${quantity} book(s)!`,
          [
            {
              text: "OK",
              onPress: () => {
                // Optionally navigate back or refresh the screen
                // props.navigation.goBack();
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error("Purchase error:", error);
      Alert.alert("Error", "Failed to complete purchase. Please try again.");
    } finally {
      setPurchaseLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < bookDetails.stock_quantity) {
      setQuantity(quantity + 1);
      bookDetails.stock_quantity = bookDetails.stock_quantity - 1;
      

    }
  };

  const decrementQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6D5ACD" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Surface style={styles.headerContainer}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => props.navigation.goBack()}
            style={styles.backButton}
          />
          <Text variant="headlineSmall" style={styles.header}>
            Book Details
          </Text>
        </Surface>

        {bookDetails && (
          <View style={styles.content}>
            <Surface style={styles.bookCard} elevation={2}>
              <View style={styles.imageContainer}>
                <Avatar.Image
                  size={120}
                  source={{ uri: 'https://picsum.photos/200' }}
                  style={styles.bookImage}
                />
              </View>

              <View style={styles.bookInfo}>
                <Text variant="headlineSmall" style={styles.title}>
                  {bookDetails.title}
                </Text>
                <Text variant="titleMedium" style={styles.author}>
                  by {bookDetails.author}
                </Text>

                <Divider style={styles.divider} />

                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Price</Text>
                    <Text style={styles.price}>₹{bookDetails.price}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Stock</Text>
                    <Text style={[
                      styles.stock,
                      bookDetails.stock_quantity === 0 && styles.outOfStock
                    ]}>
                      {bookDetails.stock_quantity === 0 
                        ? "Out of Stock" 
                        : `${bookDetails.stock_quantity} copies`}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Published</Text>
                    <Text style={styles.date}>
                      {new Date(bookDetails.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
            </Surface>

            <Surface style={styles.purchaseCard} elevation={2}>
              <Text variant="titleMedium" style={styles.quantityTitle}>
                Select Quantity
              </Text>
              
              <View style={styles.quantityContainer}>
                <IconButton
                  icon="minus"
                  mode="contained"
                  size={20}
                  onPress={decrementQuantity}
                  style={[
                    styles.quantityButton,
                    quantity === 0 && styles.quantityButtonDisabled
                  ]}
                  disabled={quantity === 0}
                />
                <Text style={styles.quantityText}>{quantity}</Text>
                <IconButton
                  icon="plus"
                  mode="contained"
                  size={20}
                  onPress={incrementQuantity}
                  style={[
                    styles.quantityButton,
                    quantity === bookDetails.stock_quantity && styles.quantityButtonDisabled
                  ]}
                  disabled={quantity === bookDetails.stock_quantity || bookDetails.stock_quantity === 0}
                />
              </View>

              <View style={styles.totalContainer}>
                <Text variant="titleMedium">Total:</Text>
                <Text variant="headlineSmall" style={styles.totalPrice}>
                  ₹{(bookDetails.price * quantity).toFixed(2)}
                </Text>
              </View>

              <Button
                mode="contained"
                onPress={handlePurchase}
                style={[
                  styles.purchaseButton,
                  (bookDetails.stock_quantity === 0) && styles.purchaseButtonDisabled
                ]}
                loading={purchaseLoading}
                disabled={quantity === 0 || purchaseLoading || bookDetails.stock_quantity === 0}
              >
                {purchaseLoading ? "Processing..." : 
                 bookDetails.stock_quantity === 0 ? "Out of Stock" : "Purchase Now"}
              </Button>
            </Surface>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    elevation: 2,
  },
  backButton: {
    marginRight: 16,
  },
  header: {
    flex: 1,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    padding: 16,
  },
  bookCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "white",
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  bookImage: {
    backgroundColor: "#E1E1E1",
  },
  bookInfo: {
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  author: {
    color: "#666",
    marginBottom: 16,
  },
  divider: {
    width: "100%",
    marginVertical: 16,
  },
  detailsContainer: {
    width: "100%",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    color: "#666",
  },
  price: {
    fontWeight: "bold",
    color: "#6D5ACD",
  },
  stock: {
    color: "#333",
  },
  outOfStock: {
    color: "#FF0000",
    fontWeight: "bold",
  },
  date: {
    color: "#666",
  },
  purchaseCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "white",
  },
  quantityTitle: {
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  quantityButton: {
    backgroundColor: "#6D5ACD",
  },
  quantityButtonDisabled: {
    backgroundColor: "#E1E1E1",
  },
  quantityText: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 24,
    color: "#333",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  totalPrice: {
    color: "#6D5ACD",
    fontWeight: "bold",
  },
  purchaseButton: {
    backgroundColor: "#6D5ACD",
    paddingVertical: 8,
  },
  purchaseButtonDisabled: {
    backgroundColor: "#E1E1E1",
  },
});

export default BookDetails;