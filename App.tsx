/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated,Alert } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [timeLeft, setTimeLeft] = useState<number>(120); // 2 minutes
  const [score, setScore] = useState<number>(0);
  const [missedBalloons, setMissedBalloons] = useState<number>(0);
  const [balloons, setBalloons] = useState<{ id: string, position: { x: number, y: number } }[]>([]);
  const [animation] = useState(new Animated.Value(height));

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft === 0) {
        clearInterval(interval);
        handleGameOver();
      } else {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    spawnBalloons();
  }, []);

  const spawnBalloons = () => {
    const interval = setInterval(() => {
      const newBalloon = {
        id: Math.random().toString(),
        position: { x: Math.random() * (width - 50), y: height },
      };
      setBalloons(prevBalloons => [...prevBalloons, newBalloon]);
      animateBalloon(newBalloon);
    }, 800);

    return () => clearInterval(interval);
  };

  const animateBalloon = (balloon: { id: string, position: { x: number, y: number } }) => {
    Animated.timing(animation, {
      toValue: -height, // Move the balloon to the top of the screen
      duration: 4000,
      useNativeDriver: true, // Use native driver
    }).start(({ finished }) => {
      if (finished) {
        setMissedBalloons(missedBalloons + 1);
        setBalloons(prevBalloons => prevBalloons.filter(b => b.id !== balloon.id));
      }
    });
  };
  

  const handlePopBalloon = (balloonId: string) => {
    setScore(score + 2);
    setBalloons(prevBalloons => prevBalloons.filter(balloon => balloon.id !== balloonId));
  };

  const handleGameOver = () => {
    Alert.alert(`Game Over!\nScore: ${score}\nMissed Balloons: ${missedBalloons}`);
    resetGame();
  };
  

  const resetGame = () => {
    setTimeLeft(120);
    setScore(0);
    setMissedBalloons(0);
    setBalloons([]);
    spawnBalloons();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}</Text>
      <Text style={styles.scoreText}>Score: {score}</Text>
      <View style={styles.balloonsContainer}>
        {balloons.map(balloon => (
          <TouchableOpacity
          key={balloon.id}
          style={[
            styles.balloon,
            { left: balloon.position.x, transform: [{ translateY: animation }] }, // Use translateY for animation
          ]}
          onPress={() => handlePopBalloon(balloon.id)}
          activeOpacity={0.8}
        />
        
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  timerText: {
    fontSize: 20,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 20,
    marginBottom: 20,
  },
  balloonsContainer: {
    position: 'absolute',
    width,
    height,
  },
  balloon: {
    position: 'absolute',
    width: 50,
    height: 100,
    backgroundColor: 'red',
    borderRadius: 25,
  },
});
