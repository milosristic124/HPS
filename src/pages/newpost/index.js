

import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Switch,
  NativeModules
} from 'react-native';
import firebase from '../../firebase';
import RNFetchBlob from 'react-native-fetch-blob'
import FastImage from 'react-native-fast-image';
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import UserAvatar from 'react-native-user-avatar';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import Styles from './styles';
import Assets from '../../../assets';
import Metrics from '../../themes/Metrics';
import Colors from '../../themes/Colors';
import { ActivityComponent, Navbar, ImageTextInput } from '../../components';
import { setScrollFlag } from '../../redux/actions/event';

// const _image = NativeModules.ImagePicker
const auth = firebase.auth();
const database = firebase.database();

class NewPostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageDesc : "",
      previewImg: null,
      schoolId: props.user.schoolid,
      userId : props.user.uid
    }
  }

  componentDidMount() {
   
  }

 

  checkBtnClicked() {
    // this.refs.main.showIndicator();
    // validation
    if (this.state.imageDesc == "") {
      Alert.alert(
        "Error", 
        "Description can't be empty.", 
        [
          {text: "OK"},
        ],
        { cancelable: false }
      );
      return;
    }
    if (this.state.previewImg == null) {
      Alert.alert(
        "Error", 
        "Please pick a Image for House.", 
        [
          {text: "OK"},
        ],
        { cancelable: false }
      );
      return;
    }
    
    this.refs.main.showIndicator();
    // Upload photo info to firebase DB : house_photos
    // date, description, image_url, school_id, user_id
    // image upload to storage
    this.uploadImage().then( (downloadUrl) => 
    {
        // id = date + userId 
        let date = Math.floor(Date.now() / 1000);
        let user_id = this.state.userId;
        let id = date + user_id;
        let newObj = {'date' : date, description : this.state.imageDesc, image_url : downloadUrl, school_id : this.state.schoolId, user_id : user_id};
        database.ref(`house_photos/`+ id).set(newObj).then( () => {
          this.refs.main.hideIndicator();  
          Alert.alert(
            "Succss", 
            "Successfully added", 
            [
              {text: "OK" , onPress : () =>  { this.props.navigation.navigate("housephotos")
              this.props.setScrollFlag();}
              },
            ],
            { cancelable: false }
          );
        }).catch((Error) => {

        });
    }).catch((Error) => {
        this.refs.main.hideIndicator();  
        console.log(Error);
    });
  }

  uploadImage(mime = 'image/jpg') {

    return new Promise((resolve, reject) => {
      const Blob = RNFetchBlob.polyfill.Blob;
      const fs = RNFetchBlob.fs;
      window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
      window.Blob = Blob;

      let imgUri = this.state.previewImg.uri; 
      let uploadBlob = null;
      const uploadUri = Platform.OS === 'ios' ? imgUri.toString().replace('file://', '') : imgUri;
      let name = new Date().toString();
      const imageRef = firebase.storage().ref(`/House_Photo/`+name)
      fs.readFile(uploadUri, 'base64')
        .then(data => {
          return Blob.build(data, { type: `${mime};BASE64` });
        })
        .then(blob => {
          uploadBlob = blob;
          return imageRef.put(blob);
        })
        .then(() => {
          uploadBlob.close()
          return imageRef.getDownloadURL();
        })
        .then(url => {
          resolve(url);
        })
        .catch(error => {
          reject(error)
      })
    })
  }
  
  backBtnClicked() {
  
    this.props.navigation.navigate("housephotos");
  }

  imgUploadBtnClicked() {
    var options = {
      title: 'Select Avatar',
      customButtons: [
        {name: 'fb', title: 'Choose Photo from Facebook'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    
    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info below in README)
     */
    ImagePicker.showImagePicker(options, (response) => {
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };
    
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
    
        this.setState({
          previewImg: source
        });
      }
    });
  }

  render() {
    const imageUri = this.state.previewImg ? this.state.previewImg.uri : 'https://google.com/1.png';
    return (
      <ActivityComponent ref="main">
        <ImageBackground
          style={Styles.container}
          source={Assets.background}
          resizeMode="cover"
        >
          <Navbar
            left={Assets.backbtn}
            leftHandler={this.backBtnClicked.bind(this)}
            title="Add HousePhoto"
            logo={Assets.login_user}
          />
          <KeyboardAwareScrollView style={Styles.contentView}>
            <View
              style={{ alignItems: "center", marginTop: 20 }}
            >
              <TouchableOpacity onPress={this.imgUploadBtnClicked.bind(this)}>
                <View style={Styles.imgUploadBtn}>
                  <Text  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                  }}>Pick Image</Text>
                </View>
              </TouchableOpacity>
              <FastImage style={this.state.previewImg? Styles.previewImg : ''} source={{ uri : imageUri , priority: FastImage.priority.normal}}  />
              <View style={Styles.itemContainer}>
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "transparent",
                    marginLeft: Metrics.padding
                  }}
                  multiline
                  numberOfLines={4}
                  underlineColorAndroid="transparent"
                  placeholder="Type Photo Description"
                  placeholderTextColor= "white"
                  value={this.state.imageDesc}
                  autoCapitalize="none"
                  onChangeText={(text) => {
                    this.setState({
                      ...this.state,
                      imageDesc: text,
                    });
                  }}
                />
              </View>

              <TouchableOpacity onPress={this.checkBtnClicked.bind(this)}>
                <View style={Styles.checkbtn}>
                  <Image
                    source={Assets.check}
                    style={{
                      width: Metrics.iconSize * 1.5,
                      height: Metrics.iconSize * 1.5
                    }}
                    resizeMode="cover"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </ActivityComponent>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return ({
    setScrollFlag: () => dispatch(setScrollFlag()),
  });
}; 

const mapStateToProps = (state, props) => {
	return({
    user: state.sidemenu.user,
	});
};

export default connect(mapStateToProps, mapDispatchToProps)(NewPostScreen);