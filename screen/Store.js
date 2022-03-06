import {makeAutoObservable, action} from 'mobx';
import firestore from '@react-native-firebase/firestore';

class Store {
  constructor() {
    makeAutoObservable(this);
  }

  data = [];
  allShows = [];
  episodePresent = false;
  episodes = [];

  fetchData = () => {
    firestore()
      .collection('test-shows')
      .get()
      .then(snapshot => {
        // console.log('Snapshot data', snapshot);
        this.allShows = snapshot._docs;

        // this.data = snapshot._data.shows;
        // return snapshot._data?.shows.length>0 && snapshot._data?.shows
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  };

  filter = value => {
    const arr = firestore()
      .collection('test-shows')
      .where('categories', 'array-contains', value);

    arr.get().then(snap => {
      this.data = snap._docs;
    });
  };

  sortByUpateDate = value => {
    const sortData = firestore()
      .collection('shows')
      .orderBy('updatedAt', 'desc');

    sortData.get().then(snap => {
      //   this.data = snap._docs;
      this.data = snap._docs;
    });
  };

  sortByCreatedDate = value => {
    const sortData = firestore()
      .collection('test-shows')
      .orderBy('createdAt', 'desc');

    sortData.get().then(snap => {
      //   this.data = snap._docs;
      this.data = snap._docs;
    });
  };

  onSubmitSearch = value => {
    const searchData = firestore()
      .collection('test-shows')
      .where('name', '==', value);

    searchData.get().then(snap => {
      //   this.data = snap._docs;
      this.data = snap._docs;
    });
  };

  onSearchEpi = value => {
    const searchData = firestore()
      .collection('test-episodes')
      .where('title', '==', value);

    searchData.get().then(snap => {
      //   this.data = snap._docs;
      this.data = snap._docs;
    });
  };

  backNavigate = () => {
    this.episodePresent = false;
  };

  episodeListing = value => {
    console.log(value);
    const searchData = firestore()
      .collection('test-episodes')
      .where('program_id', '==', value);

    searchData.get().then(snap => {
      //   this.data = snap._docs;
      // this.data = snap._docs;
      // console.log('----->', snap._docs.length);
      if (snap._docs.length > 0) {
        this.episodePresent = true;
        this.episodes = snap._docs;
      }
    });
  };
}
export default new Store();
