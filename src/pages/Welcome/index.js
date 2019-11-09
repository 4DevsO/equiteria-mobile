import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ViewPager from '@react-native-community/viewpager';

import PageIndicator from './PageIndicator';
import {Page1, Page2, AddPhoneNumber} from './InstructionPages';

export default function Welcome({navigation}) {
  const [activePage, setActivePage] = useState(0);
  const [firstRun, endFirstRun] = useState(true);

  useEffect(() => {
    if (firstRun) {
      const getUser = async () => {
        const user = await AsyncStorage.getItem('@equiteria/userAuth');

        if (user !== null) {
          navigation.navigate('Main');
        }

        return user;
      };

      getUser();
      endFirstRun(false);
    }
  }, [firstRun, navigation]);

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <ViewPager
        style={{flex: 1}}
        initialPage={0}
        keyboardDismissMode="on-drag"
        onPageSelected={e => setActivePage(e.nativeEvent.position)}>
        <Page1 key="1" />
        <Page2 key="2" />
        <AddPhoneNumber key="3" navigation={navigation} />
      </ViewPager>
      <PageIndicator size={3} active={activePage} />
    </View>
  );
}
