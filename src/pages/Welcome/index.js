import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ViewPager from '@react-native-community/viewpager';

import PageIndicator from './PageIndicator';
import {Page1, Page2, AddPhoneNumber, HowWeWork} from './InstructionPages';

import {Gradient} from './styles';

export default function Welcome({navigation}) {
  const [activePage, setActivePage] = useState(0);
  const [firstRun, endFirstRun] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (firstRun) {
      const getUser = async () => {
        const userId = await AsyncStorage.getItem('@equiteria/userId');
        if (userId !== null) {
          navigation.navigate('Main');
        } else {
          setLoading(false);
        }

        return userId;
      };

      getUser();
      endFirstRun(false);
    }
  }, [firstRun, navigation]);

  return (
    <Gradient>
      {loading && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={50} color="#0d9c60" />
        </View>
      )}
      {!loading && (
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          <ViewPager
            style={{flex: 1}}
            initialPage={0}
            keyboardDismissMode="on-drag"
            onPageSelected={e => setActivePage(e.nativeEvent.position)}>
            <Page1 key="page1" />
            <Page2 key="page2" />
            <HowWeWork key="howwework" />
            <AddPhoneNumber key="login" navigation={navigation} />
          </ViewPager>
          <PageIndicator size={4} active={activePage} />
        </View>
      )}
    </Gradient>
  );
}
