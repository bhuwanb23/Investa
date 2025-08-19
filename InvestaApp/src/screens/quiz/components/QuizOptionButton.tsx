import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuizOptionButtonProps {
  option: string;
  optionIndex: number;
  isSelected: boolean;
  isCorrect?: boolean;
  showResult?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const QuizOptionButton: React.FC<QuizOptionButtonProps> = ({
  option,
  optionIndex,
  isSelected,
  isCorrect,
  showResult,
  onPress,
  disabled = false,
}) => {
  const getOptionLetter = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D...
  };

  const getButtonStyle = () => {
    if (showResult && isCorrect) {
      return [styles.button, styles.correctOption];
    }
    if (showResult && isSelected && !isCorrect) {
      return [styles.button, styles.incorrectOption];
    }
    if (isSelected) {
      return [styles.button, styles.selectedOption];
    }
    return [styles.button, styles.defaultOption];
  };

  const getTextStyle = () => {
    if (showResult && isCorrect) {
      return [styles.optionText, styles.correctText];
    }
    if (showResult && isSelected && !isCorrect) {
      return [styles.optionText, styles.incorrectText];
    }
    if (isSelected) {
      return [styles.optionText, styles.selectedText];
    }
    return [styles.optionText, styles.defaultText];
  };

  const getLetterStyle = () => {
    if (showResult && isCorrect) {
      return [styles.letterContainer, styles.correctLetter];
    }
    if (showResult && isSelected && !isCorrect) {
      return [styles.letterContainer, styles.incorrectLetter];
    }
    if (isSelected) {
      return [styles.letterContainer, styles.selectedLetter];
    }
    return [styles.letterContainer, styles.defaultLetter];
  };

  const getLetterTextStyle = () => {
    if (showResult && isCorrect || isSelected) {
      return [styles.letterText, styles.selectedLetterText];
    }
    return [styles.letterText, styles.defaultLetterText];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={getLetterStyle()}>
          <Text style={getLetterTextStyle()}>
            {getOptionLetter(optionIndex)}
          </Text>
        </View>
        <Text style={getTextStyle()}>{option}</Text>
      </View>
      
      {showResult && (
        <Ionicons
          name={isCorrect ? "checkmark-circle" : "close-circle"}
          size={24}
          color={isCorrect ? "#10B981" : "#EF4444"}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  defaultOption: {
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  correctOption: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  incorrectOption: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  letterContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  defaultLetter: {
    backgroundColor: '#F3F4F6',
  },
  selectedLetter: {
    backgroundColor: '#3B82F6',
  },
  correctLetter: {
    backgroundColor: '#10B981',
  },
  incorrectLetter: {
    backgroundColor: '#EF4444',
  },
  letterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  defaultLetterText: {
    color: '#6B7280',
  },
  selectedLetterText: {
    color: 'white',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  defaultText: {
    color: '#374151',
  },
  selectedText: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  correctText: {
    color: '#065F46',
    fontWeight: '600',
  },
  incorrectText: {
    color: '#991B1B',
    fontWeight: '600',
  },
});

export default QuizOptionButton;
