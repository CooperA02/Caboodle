import React, { useState } from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const AccessibilityScreen = () => {
  const [textSize, setTextSize] = useState('small');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Text Size</Text>
      <Switch
        value={textSize === 'small'}
        onValueChange={() => setTextSize(textSize === 'small' ? 'medium' : 'small')}
      />
      <Text style={[styles.text, textSize === 'small' && styles.smallText]}>
        Small
      </Text>
      <Switch
        value={textSize === 'medium'}
        onValueChange={() => setTextSize(textSize === 'medium' ? 'large' : 'medium')}
      />
      <Text style={[styles.text, textSize === 'medium' && styles.mediumText]}>
        Medium
      </Text>
      <Switch
        value={textSize === 'large'}
        onValueChange={() => setTextSize(textSize === 'large' ? 'center-aligned' : 'large')}
      />
      <Text style={[styles.text, textSize === 'large' && styles.largeText]}>
        Large
      </Text>
      <Switch
        value={textSize === 'center-aligned'}
        onValueChange={() => setTextSize(textSize === 'center-aligned' ? 'small' : 'center-aligned')}
      />
      <Text style={[styles.text, textSize === 'center-aligned' && styles.centerAlignedText]}>
        Center-Aligned Text
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      marginBottom: 10,
    },
    text: {
      fontSize: 16,
    },
    smallText: {
      fontSize: 14,
    },
    mediumText: {
      fontSize: 18,
    },
    largeText: {
      fontSize: 24,
    },
    centerAlignedText: {
      textAlign: 'center',
    },
  });

export default AccessibilityScreen;
