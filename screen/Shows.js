import React, {useEffect, useState} from 'react';
import TrackPlayer, {Capability} from 'react-native-track-player';
import {useProgress} from 'react-native-track-player/lib/hooks';
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

const trackPlayerInit = async () => {
  // console.log('now what', Store.episodes);
  await TrackPlayer.setupPlayer();

  await TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.JumpBackward,
      Capability.JumpForward,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
  });

  await TrackPlayer.add(Store.episodes);
  return true;
};

const Shows = () => {
  useEffect(() => {
    Store.fetchData();
  }, []);

  const playInTandom = async () => {
    console.log('checked----->');
    let isInit = await trackPlayerInit();
    setIsTrackPlayerInit(isInit);
    let trackIndex = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(trackIndex);
    console.log(`Title: ${trackObject.title}`);
    setTitle(trackObject.title);
  };

  useEffect(() => {
    if (!isSeeking && position && duration) {
      setSliderValue(position / duration);
    }
  }, [position, duration]);

  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  //the value of the slider should be between 0 and 1
  const [sliderValue, setSliderValue] = useState(0);
  const [title, setTitle] = useState('');

  //flag to check whether the use is sliding the seekbar or not
  const [isSeeking, setIsSeeking] = useState(false);

  //useTrackPlayerProgress is a hook which provides the current position and duration of the track player.
  //These values will update every 250ms
  const {position, bufferedPosition, duration} = useProgress(250, null);
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

  const onButtonPressed = () => {
    if (!isPlaying) {
      TrackPlayer.play();
      setIsPlaying(true);
    } else {
      TrackPlayer.pause();
      setIsPlaying(false);
    }
  };
  //this function is called when the user starts to slide the seekbar
  const slidingStarted = () => {
    setIsSeeking(true);
  };
  //this function is called when the user stops sliding the seekbar
  const slidingCompleted = async value => {
    await TrackPlayer.seekTo(value * duration);
    setSliderValue(value);
    setIsSeeking(false);
  };

  const skipNext = async () => {
    await TrackPlayer.skipToNext();
    // console.log('Next');
    let trackIndex = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(trackIndex);
    console.log(`Title: ${trackObject.title}`);
    setTitle(trackObject.title);
  };

  const skipPrev = async () => {
    await TrackPlayer.skipToPrevious();
    let trackIndex = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(trackIndex);
    console.log(`Title: ${trackObject.title}`);
    setTitle(trackObject.title);
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

  const jumpForward = async () => {
    let newPosition = await TrackPlayer.getPosition();
    let duration = await TrackPlayer.getDuration();
    newPosition += 10;
    if (newPosition > duration) {
      newPosition = duration;
    }
    TrackPlayer.seekTo(newPosition);
  };

  const jumpBackward = async () => {
    let newPosition = await TrackPlayer.getPosition();
    newPosition -= 10;
    if (newPosition < 0) {
      newPosition = 0;
    }
    TrackPlayer.seekTo(newPosition);
  };

  return (
    <Observer>
      {() => (
        // <SafeAreaView style={{flex: 1}}>
        //   <ScrollView style={{flex: 1}}>
        <>
          {Store.episodePresent && playInTandom() && (
            <>
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
                  marginTop: 100,
                  borderWidth: 2,
                  marginHorizontal: 20,
                  borderRadius: 10,
                }}>
                <Text style={{textAlign: 'center', marginBottom: 10}}>
                  {title}
                </Text>
                <View style={{marginHorizontal: 20}}>
                  <Button
                    title={isPlaying ? 'Pause' : 'Play'}
                    onPress={onButtonPressed}
                    // disabled={!isTrackPlayerInit}
                  />
                </View>
                {/* defining our slider here */}
                {/* <Slider
        style={{width: 400, height: 40}}
        minimumValue={0}
        maximumValue={1}
        value={sliderValue}
        minimumTrackTintColor="#111000"
        maximumTrackTintColor="#000000"
        onSlidingStart={slidingStarted}
        onSlidingComplete={slidingCompleted}
      /> */}

                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 25,
                    justifyContent: 'space-around',
                  }}>
                  <Button onPress={jumpBackward} title={'-5sec'} />
                  <Button onPress={jumpForward} title={'+5sec'} />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 25,
                    justifyContent: 'space-around',
                  }}>
                  <Button onPress={skipPrev} title={'Prev'} />
                  <Button onPress={skipNext} title={'Next'} />
                </View>
              </View>
            </>
          )}
          <View
            style={{marginTop: Store.episodePresent ? 0 : 100, marginLeft: 20}}>
            <Text style={{fontSize: 20}}>
              {Store.episodePresent ? '' : 'All Programs ->'}
            </Text>
          </View>
          {Store.episodePresent ? (
            <View>
              <Text></Text>
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
