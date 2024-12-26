import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, SafeAreaView } from "react-native";
import {
  Card,
  Text,
  Surface,
  ActivityIndicator,
  IconButton,
  Chip,
  Divider,
  Avatar,
  useTheme,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

function Orders({ navigation }) {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      if (id) {
        const reply = await axios.get(
          `http://localhost:4444/purchase/orders/${id}`
        );
        setOrders(reply.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderOrderCard = ({ item }) => (
    <Surface style={styles.cardSurface} elevation={2}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.orderHeader}>
            <View>
              <Text variant="titleMedium" style={styles.orderIdText}>
                Order #{item.purchase_id}
              </Text>
              <Text variant="bodySmall" style={styles.dateText}>
                {formatDate(item.purchase_date)}
              </Text>
            </View>
            <Chip 
              icon="check-circle" 
              mode="outlined" 
              style={styles.statusChip}
              textStyle={{ color: '#6D5ACD' }}
            >
              Completed
            </Chip>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.bookInfo}>
            <Avatar.Image
              size={60}
              source={{ uri: 'https://picsum.photos/200' }}
              style={styles.bookImage}
            />
            <View style={styles.bookDetails}>
              <Text variant="titleMedium" style={styles.bookTitle}>
                {item.book_title}
              </Text>
              <Text variant="bodyMedium" style={styles.authorText}>
                by {item.book_author}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.orderDetails}>
            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={styles.detailLabel}>
                Quantity
              </Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                {item.quantity} {item.quantity === 1 ? 'copy' : 'copies'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={styles.detailLabel}>
                Price per unit
              </Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                ₹{(item.total_price / item.quantity).toFixed(2)}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text variant="titleMedium" style={styles.totalLabel}>
                Total Amount
              </Text>
              <Text variant="titleMedium" style={styles.totalAmount}>
                ₹{item.total_price}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </Surface>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6D5ACD" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text variant="headlineSmall" style={styles.headerText}>
          My Orders
        </Text>
        <IconButton
          icon="refresh"
          size={24}
          onPress={handleRefresh}
          disabled={refreshing}
        />
      </Surface>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.purchase_id.toString()}
        renderItem={renderOrderCard}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={styles.emptyText}>
              No orders found
            </Text>
          </View>
        }
      />
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
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  cardSurface: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "white",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderIdText: {
    fontWeight: "bold",
    color: "#333",
  },
  dateText: {
    color: "#666",
    marginTop: 4,
  },
  statusChip: {
    backgroundColor: "#E8E4F3",
  },
  divider: {
    marginVertical: 12,
  },
  bookInfo: {
    flexDirection: "row",
    marginBottom: 12,
  },
  bookImage: {
    backgroundColor: "#E1E1E1",
    marginRight: 12,
  },
  bookDetails: {
    flex: 1,
    justifyContent: "center",
  },
  bookTitle: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  authorText: {
    color: "#666",
  },
  orderDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    color: "#666",
  },
  detailValue: {
    color: "#333",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontWeight: "bold",
    color: "#6D5ACD",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    color: "#666",
  },
});

export default Orders;