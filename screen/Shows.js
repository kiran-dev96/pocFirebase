import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Button,
  TextInput,
  SafeAreaView,
} from 'react-native';
import Store from './Store';
import {Observer} from 'mobx-react';
let category = [
  'Arts',
  'Comedy',
  'Sattire',
  'Self Help',
  'Drama',
  'Entertaiment',
  'Humour',
  'Religion & Spirituality',
  'Science',
  'Personal Journals',
  'News',
];

const Shows = () => {
  useEffect(() => {
    Store.fetchData();
  }, []);

  const [search, setSearch] = useState('');
  const [episodesearch, setSepisodesearch] = useState('');

  const renderFlatlist = (item, index) => {
    return (
      <TouchableOpacity
        style={{
          padding: 20,
          borderWidth: 4,
          marginBottom: 5,
          borderRadius: 10,
        }}
        onPress={() => {
          Store.episodeListing(item._data.id);
        }}>
        <Text>{item._data.name}</Text>
        <Text>{item._data.description}</Text>
        <Text>{item._data.episodeTitle}</Text>
      </TouchableOpacity>
    );
  };

  const renderEpisodelist = (item, index) => {
    return (
      <View
        style={{
          padding: 20,
          borderWidth: 4,
          marginBottom: 5,
          borderRadius: 10,
        }}>
        <Text>{item._data.description}</Text>
        <Text>{item._data.title}</Text>
      </View>
    );
  };

  return (
    <Observer>
      {() => (
        // <SafeAreaView style={{flex: 1}}>
        //   <ScrollView style={{flex: 1}}>
        <>
          {Store.episodePresent && (
            <View
              style={{
                marginBottom: 820,
              }}>
              <TouchableOpacity
                onPress={() => {
                  Store.backNavigate();
                }}
                style={{marginTop: 80, marginLeft: 20}}>
                <Text
                  style={{
                    fontSize: 30,
                  }}>
                  Back
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  marginTop: 20,
                  paddingHorizontal: 20,
                }}>
                <FlatList
                  data={Store.episodes}
                  // keyExtractor={(item) => item.id}
                  // extraData={Store.data}
                  renderItem={(item, index) =>
                    renderEpisodelist(item.item, index)
                  }
                  ListEmptyComponent={() => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}>
                        <Text>No Data Found</Text>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
          )}
          <View
            style={{marginTop: Store.episodePresent ? 0 : 100, marginLeft: 20}}>
            <Text style={{fontSize: 40}}>Omny </Text>

            <Text style={{fontSize: 20}}>
              {Store.episodePresent ? 'Episodes ->' : 'All Programs ->'}
            </Text>
          </View>
          {Store.episodePresent ? (
            <View>
              <Text>I am present</Text>
            </View>
          ) : (
            <>
              <ScrollView
                style={{
                  paddingHorizontal: 30,
                }}>
                <ScrollView
                  style={{
                    maxHeight: 200,
                  }}>
                  {Store.allShows.map(item => {
                    return (
                      <View
                        style={{
                          margin: 10,
                          borderBottomWidth: 1,
                          padding: 5,
                        }}>
                        <Text>Show Name : {item._data.name}</Text>
                        <Text>Show Description : {item._data.description}</Text>
                      </View>
                    );
                  })}
                </ScrollView>
                <Text style={{fontSize: 20, marginTop: 10}}>Filter</Text>
                <ScrollView
                  style={{flexDirection: 'row', width: 310}}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {category.map(value => {
                    return (
                      <View>
                        <Button
                          title={value}
                          onPress={() => {
                            Store.filter(value);
                          }}
                        />
                      </View>
                    );
                  })}
                </ScrollView>
                <Text style={{fontSize: 20, marginTop: 10}}>Sort By</Text>

                <View style={{flexDirection: 'row'}}>
                  <Button
                    title={'Upated'}
                    onPress={() => {
                      Store.sortByUpateDate();
                    }}
                  />

                  <Button
                    title={'Created'}
                    onPress={() => {
                      Store.sortByCreatedDate();
                    }}
                  />
                </View>
                <Text style={{fontSize: 20, marginTop: 10, marginBottom: 5}}>
                  Search By
                </Text>

                <View style={{flexDirection: 'row', marginBottom: 10}}>
                  <TextInput
                    placeholder={'Search Shows'}
                    style={{
                      borderWidth: 1,
                      marginBottom: 2,
                      width: '50%',
                      paddingHorizontal: 5,
                    }}
                    onChangeText={value => {
                      setSearch(value);
                    }}
                    onSubmitEditing={() => {
                      Store.onSubmitSearch(search);
                    }}
                  />
                  <Button
                    title={'Search'}
                    onPress={() => {
                      Store.onSubmitSearch(search);
                    }}
                  />
                </View>
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                  <TextInput
                    placeholder={'Search Episodes'}
                    style={{
                      borderWidth: 1,
                      marginBottom: 2,
                      width: '50%',
                      paddingHorizontal: 5,
                    }}
                    onChangeText={value => {
                      setSepisodesearch(value);
                    }}
                    onSubmitEditing={() => {
                      Store.onSearchEpi(episodesearch);
                    }}
                  />
                  <Button
                    title={'Search'}
                    onPress={() => {
                      Store.onSearchEpi(episodesearch);
                    }}
                  />
                </View>
                <Text style={{fontSize: 20, marginTop: 10, marginBottom: 5}}>
                  Results
                </Text>
                <FlatList
                  data={Store.data}
                  // keyExtractor={(item) => item.id}
                  // extraData={Store.data}
                  renderItem={(item, index) => renderFlatlist(item.item, index)}
                  ListEmptyComponent={() => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}>
                        <Text>No Data Found</Text>
                      </View>
                    );
                  }}
                />
              </ScrollView>
            </>
          )}
        </>
      )}
    </Observer>
  );
};

export default Shows;
