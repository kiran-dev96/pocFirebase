import TrackPlayer, {Event} from 'react-native-track-player';

module.exports = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });
  TrackPlayer.addEventListener('remote-next', async () => {
    console.log('-----> next song');
    await TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    console.log('-----> prev song');
    await TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteJumpForward, async () => {
    let newPosition = await TrackPlayer.getPosition();
    let duration = await TrackPlayer.getDuration();
    newPosition += 10;
    if (newPosition > duration) {
      newPosition = duration;
    }
    console.log(newPosition, '----->', duration, newPosition > duration);

    let trackIndex = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(trackIndex);
    console.log(`Title: ${trackObject.title}`);
    TrackPlayer.seekTo(newPosition);
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async () => {
    let newPosition = await TrackPlayer.getPosition();
    newPosition -= 10;
    if (newPosition < 0) {
      newPosition = 0;
    }
    TrackPlayer.seekTo(newPosition);
  });
};
