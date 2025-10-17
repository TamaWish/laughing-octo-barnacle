import React from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
import useGameStore from '../store/gameStore';
import { ASSET_CATALOG } from '../constants/assets';
import { Asset } from '../types/assets';

const AssetsScreen = () => {
  const { money, assets, buyAsset, sellAsset } = useGameStore();

  const renderAsset = ({ item }: { item: Asset }) => {
    const isOwned = assets.some(a => a.id === item.id);
    return (
      <View style={styles.assetContainer}>
        <Text style={styles.assetName}>{item.name}</Text>
        <Text>Cost: ${item.cost}</Text>
        <Text>Resale Value: ${item.resaleValue}</Text>
        {item.type === 'Business' && <Text>Income: ${item.incomePerYear}/year</Text>}
        {item.type === 'House' && <Text>Maintenance: ${item.maintenanceCost}/year</Text>}
        {isOwned ? (
          <Button title="Sell" onPress={() => sellAsset(item)} />
        ) : (
          <Button title="Buy" onPress={() => buyAsset(item)} disabled={money < item.cost} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assets</Text>
      <Text style={styles.money}>Your Money: ${money}</Text>
      <FlatList
        data={ASSET_CATALOG}
        renderItem={renderAsset}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Available for Purchase</Text>}
      />
      <FlatList
        data={assets}
        renderItem={renderAsset}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Your Assets</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  money: {
    fontSize: 18,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  assetContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
  },
  assetName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AssetsScreen;