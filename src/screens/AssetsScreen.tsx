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

  const renderSectionHeader = ({ section: { title } }: any) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  // Group available assets by type
  const availableSections = [
    { title: 'Cars', data: ASSET_CATALOG.filter(a => a.type === 'Car') },
    { title: 'Houses', data: ASSET_CATALOG.filter(a => a.type === 'House') },
    { title: 'Businesses', data: ASSET_CATALOG.filter(a => a.type === 'Business') },
  ].filter(section => section.data.length > 0);

  // Group owned assets by type
  const ownedSections = [
    { title: 'Your Cars', data: assets.filter(a => a.type === 'Car') },
    { title: 'Your Houses', data: assets.filter(a => a.type === 'House') },
    { title: 'Your Businesses', data: assets.filter(a => a.type === 'Business') },
  ].filter(section => section.data.length > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assets</Text>
      <Text style={styles.money}>Your Money: ${money}</Text>
      
      <Text style={styles.mainSectionTitle}>Available for Purchase</Text>
      
      {availableSections.map((section) => (
        <View key={section.title}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <FlatList
            data={section.data}
            renderItem={renderAsset}
            keyExtractor={(item: Asset) => item.id}
            scrollEnabled={false}
          />
        </View>
      ))}
      
      {ownedSections.length > 0 && (
        <>
          <Text style={styles.mainSectionTitle}>Your Assets</Text>
          {ownedSections.map((section) => (
            <View key={section.title}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <FlatList
                data={section.data}
                renderItem={renderAsset}
                keyExtractor={(item: Asset) => item.id}
                scrollEnabled={false}
              />
            </View>
          ))}
        </>
      )}
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
  mainSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
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