import React, {useEffect} from 'react';
import {View} from 'react-native';
import Shows from './screen/Shows';
import {Observer} from 'mobx-react';
// import {setData} from './common/components/Api';
import SignIn from './screen/SignIn';

const App = () => {
  // useEffect(() => {
  //   setData();
  // }, []);
  return (
    <Observer>
      {() => (
        <View>
          <SignIn />
        </View>
      )}
    </Observer>
  );
};

export default App;
