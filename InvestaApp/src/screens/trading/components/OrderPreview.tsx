import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

interface OrderPreviewProps {
  isBuyMode: boolean;
  quantity: number;
  price: number;
  estimatedCost: number;
  commission: number;
  totalCost: number;
  currentCash: number;
  newCash: number;
}

const OrderPreview: React.FC<OrderPreviewProps> = ({
  isBuyMode,
  quantity,
  price,
  estimatedCost,
  commission,
  totalCost,
  currentCash,
  newCash,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Preview</Text>
      
      <View style={styles.details}>
        <View style={styles.row}>
          <Text style={styles.label}>Estimated Cost</Text>
          <Text style={styles.value}>₹{estimatedCost.toFixed(2)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Commission</Text>
          <Text style={styles.value}>₹{commission.toFixed(2)}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{totalCost.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.portfolioImpact}>
        <Text style={styles.impactTitle}>Portfolio Impact</Text>
        <Text style={styles.impactText}>
          Cash: ₹{currentCash.toFixed(2)} → <Text style={styles.newCash}>₹{newCash.toFixed(2)}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  details: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  portfolioImpact: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  impactTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  impactText: {
    fontSize: 14,
    color: '#374151',
  },
  newCash: {
    fontWeight: '500',
  },
});

export default OrderPreview;
