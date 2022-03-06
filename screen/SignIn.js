import React, {useState} from 'react';
import {Text, View, Button, Platform, TextInput} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Shows from './Shows';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

GoogleSignin.configure({
  webClientId:
    Platform.OS == 'android'
      ? '358521956746-7pc9lct6hqmg0ita84d8qmj50redu7ds.apps.googleusercontent.com'
      : '358521956746-e8fqte1t0kjjrdsq8gbh8pmmnp07t7kt.apps.googleusercontent.com',
});

const SignIn = () => {
  //   useEffect(() => {
  //     // Update the document title using the browser API
  //     document.title = `You clicked ${count} times`;
  //   });

  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [signUpFlag, setSignUpFlag] = useState(true);
  const [signInFlag, setSignInFlag] = useState(true);
  const [showPage, setShowPage] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  async function onGoogleButtonPress() {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    console.log('------->', googleCredential);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  const onFacebookButtonPress = () => {
    // Attempt login with permissions
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        if (result.isCancelled) {
          alert('Facebook login cancelled');
        } else {
          alert('Facebook login successfull');
          setShowPage(!showPage);
        }
      },
    );
  };

  const signUp = () => {
    auth()
      .createUserWithEmailAndPassword(username, password)
      .then(() => {
        console.log('User account created & signed in!');
        alert('User account created & signed in!');
        setShowPage(!showPage);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  const signInGoggle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
      setShowPage(!showPage);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const signIn = () => {
    auth()
      .signInWithEmailAndPassword(username, password)
      .then(result => {
        console.log('User account created & signed in!', result);
        alert('User signed in!');
        setShowPage(!showPage);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  const googleSignIn = () => {
    return (
      <View>
        {showPage ? (
          <View style={{paddingHorizontal: 10, marginTop: 200}}>
            {signUpFlag && (
              <View>
                {signInFlag ? (
                  <Button
                    title="SignIn"
                    onPress={() => {
                      setSignInFlag(!signInFlag);
                    }}
                  />
                ) : (
                  <>
                    <TextInput
                      onChangeText={text => {
                        setUserName(text);
                      }}
                      placeholder={'Username'}
                      style={{
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        height: 40,
                        borderRadius: 10,
                      }}
                    />
                    <TextInput
                      onChangeText={text => {
                        setPassword(text);
                      }}
                      secureTextEntry={true}
                      placeholder={'Password'}
                      style={{
                        paddingHorizontal: 10,

                        borderWidth: 1,
                        height: 40,
                        marginTop: 10,
                        borderRadius: 10,
                      }}
                    />

                    <Button title={'Sign-In'} onPress={() => signIn()} />
                  </>
                )}
              </View>
            )}
            {signInFlag && (
              <View>
                {signUpFlag ? (
                  <Button
                    title="SignUp"
                    onPress={() => setSignUpFlag(!signUpFlag)}
                  />
                ) : (
                  <>
                    <TextInput
                      onChangeText={text => {
                        setUserName(text);
                      }}
                      placeholder={'Username'}
                      style={{
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        height: 40,
                        borderRadius: 10,
                      }}
                    />
                    <TextInput
                      onChangeText={text => {
                        setPassword(text);
                      }}
                      secureTextEntry={true}
                      placeholder={'Password'}
                      style={{
                        paddingHorizontal: 10,

                        borderWidth: 1,
                        height: 40,
                        marginTop: 10,
                        borderRadius: 10,
                      }}
                    />

                    <Button title={'Sign-Up'} onPress={() => signUp()} />
                  </>
                )}
                {signUpFlag && (
                  <Button
                    title="Google Sign-In"
                    onPress={() =>
                      onGoogleButtonPress().then(() => {
                        console.log('Signed in with Google!'),
                          setShowPage(!showPage);
                        alert('Google Signed in!');
                      })
                    }
                  />
                )}
                <GoogleSigninButton
                  style={{width: 192, height: 48}}
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Dark}
                  onPress={() => signInGoggle()}
                  //   disabled={this.state.isSigninInProgress}
                />
                <Button
                  title="Facebook Sign-In"
                  onPress={() => onFacebookButtonPress()}
                />
              </View>
            )}
          </View>
        ) : (
          <Shows />
        )}
      </View>
    );
  };

  return <View>{googleSignIn()}</View>;
};

export default SignIn;
