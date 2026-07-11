import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/tokens';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface PulseIndicatorProps {
  online: boolean;
}

export default function PulseIndicator({ online }: PulseIndicatorProps) {
  const offset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!online) {
      offset.stopAnimation();
      return;
    }
    const loop = Animated.loop(
      Animated.timing(offset, {
        toValue: -40,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [offset, online]);

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height={34} viewBox="0 0 300 34">
        <AnimatedPath
          d="M0 17 L60 17 L72 4 L84 30 L96 17 L300 17"
          fill="none"
          stroke={online ? colors.amber : colors.inkFaint}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={online ? '6 5' : '4 5'}
          strokeDashoffset={offset}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
});
