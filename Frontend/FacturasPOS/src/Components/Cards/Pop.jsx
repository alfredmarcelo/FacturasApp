import { View, TouchableWithoutFeedback } from 'react-native';
import { useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

export default function Pop({ show, setShow, content, styleContent }) {
  // Animación
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (show) {
      // Aparece
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 102 });
    } else {
      // Desaparece
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.8, { duration: 200 });
    }
  }, [show]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });
  return (
    <View style={style.Selector}>
      <TouchableWithoutFeedback onPress={() => setShow(false)}>
        <View style={style.Selector}></View>
      </TouchableWithoutFeedback>
      <Animated.View style={[style.SelectorContent, animatedStyle, styleContent]}>
        {content}
      </Animated.View>
    </View>
  );
}

const style = StyleSheet.create({
  Selector: {
    width: wp('100%'),
    height: hp('100%'),
    flex: 1,
    zIndex: 1,
    backgroundColor: '#00000054',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  SelectorContent: {
    width: wp('75%'),
    height: hp('60%'),
    backgroundColor: 'white',
    borderRadius: 10,
    zIndex: 2,
  },
});
