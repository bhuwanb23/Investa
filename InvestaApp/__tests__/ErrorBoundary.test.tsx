import React from 'react';
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer';
import { Text, TouchableOpacity } from 'react-native';
import ErrorBoundary from '../src/components/ErrorBoundary';
import logger from '../src/utils/logger';

/** Child that throws during render when told to. */
function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Boom');
  }
  return <Text>Safe Content</Text>;
}

interface AppProps {
  bomb: boolean;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

function App({ bomb, fallbackTitle, fallbackMessage }: AppProps) {
  return (
    <ErrorBoundary fallbackTitle={fallbackTitle} fallbackMessage={fallbackMessage}>
      <Bomb shouldThrow={bomb} />
    </ErrorBoundary>
  );
}

function renderedTexts(renderer: ReactTestRenderer): string[] {
  return renderer.root.findAllByType(Text).map((node) => {
    const children = node.props.children;
    return Array.isArray(children) ? children.join('') : String(children ?? '');
  });
}

describe('ErrorBoundary', () => {
  // React reports boundary-caught errors to console.error in dev; silence it.
  const originalError = console.error;
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    console.error = jest.fn();
    loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error = originalError;
    jest.restoreAllMocks();
  });

  it('renders its children when no error occurs', async () => {
    let renderer!: ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(<App bomb={false} />);
    });
    expect(renderedTexts(renderer)).toContain('Safe Content');
  });

  it('shows the default fallback UI and logs the error when a child throws', async () => {
    let renderer!: ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(<App bomb={true} />);
    });

    const texts = renderedTexts(renderer);
    expect(texts).toContain('Something went wrong');
    expect(texts).toContain('An unexpected error occurred. Please try again.');
    expect(texts).toContain('Try Again');
    expect(texts).not.toContain('Safe Content');

    // Error was reported to the logger.
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error)
    );
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'Component stack:',
      expect.any(String)
    );
  });

  it('shows custom fallback title and message when provided', async () => {
    let renderer!: ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(
        <App
          bomb={true}
          fallbackTitle="Custom Title"
          fallbackMessage="Custom Message"
        />
      );
    });

    const texts = renderedTexts(renderer);
    expect(texts).toContain('Custom Title');
    expect(texts).toContain('Custom Message');
    expect(texts).not.toContain('Something went wrong');
  });

  it('recovers after pressing Try Again when the child no longer throws', async () => {
    let renderer!: ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(<App bomb={true} />);
    });
    expect(renderedTexts(renderer)).toContain('Something went wrong');

    // Fix the child, then press retry.
    await act(async () => {
      renderer.update(<App bomb={false} />);
    });
    await act(async () => {
      renderer.root.findByType(TouchableOpacity).props.onPress();
    });

    expect(renderedTexts(renderer)).toContain('Safe Content');
    expect(renderedTexts(renderer)).not.toContain('Something went wrong');
  });

  it('re-catches the error if the child still throws after retry', async () => {
    let renderer!: ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(<App bomb={true} />);
    });

    await act(async () => {
      renderer.root.findByType(TouchableOpacity).props.onPress();
    });

    const texts = renderedTexts(renderer);
    expect(texts).toContain('Something went wrong');
    expect(texts).not.toContain('Safe Content');
  });
});