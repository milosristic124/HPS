

import React, { Component } from 'react';
import ActionSheet from 'react-native-actionsheet'
import {
  Platform,
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Alert,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/Foundation';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import firebase from '../../firebase';
import { NavigationActions } from 'react-navigation';
import Grid from 'react-native-grid-component';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import ModalSelector from 'react-native-modal-selector';

import Styles from './styles';
import Assets from '../../../assets';
import Metrics from '../../themes/Metrics';
import Colors from '../../themes/Colors';
import { ActivityComponent, ImageTextInput, Navbar, PointInput } from '../../components';
import { removeScrollFlag } from '../../redux/actions/event';

const auth = firebase.auth();
const database = firebase.database();
const ITEMS_PER_PAGE = 7;


const getNextResourcePromise = (ref, startKey) => new Promise((resolve, reject) => {
  ref.orderByKey().endAt(startKey).limitToLast(ITEMS_PER_PAGE+1).on('value' ,(snapshot)=> resolve(snapshot),() => reject("firebase function failed"))
})

class HousePhotosScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      housePhotoList: [],
      data : [],
      schoolid: props.user.schoolid,
      page :1,
      lastElementKey : null,
      refreshing : false,
      isAdmin : props.user.isadmin,
      isPhotoEditable : props.user.isPhotoEditable
    };
    this.loadMore = this.loadMore.bind(this);
  }

   componentDidMount() {
    let ref = database.ref(`house_photos`);
    var userRef = database.ref(`users/${this.state.schoolid}`);
    this.refs.main.showIndicator();
   
    ref.orderByKey().limitToLast(10).on('value' ,async (snapshot) => {
          const snapshotVal = snapshot.val();
          var arr = [];
          this.setState({lastElementKey : 0});
          const snapArray = Object.entries(snapshotVal)
          
          for (let i = 0; i < snapArray.length; i++) {
            let item = snapArray[i][1]
            item.key = snapArray[i][0];
            // set last element key
            if (this.state.lastElementKey == 0) 
            this.setState({lastElementKey : snapArray[i][0]});
            // get username 
            let userId = item.user_id;
             let snap = await userRef.child(userId).once('value');
            let userDetail = snap.val();
            item.userName = userDetail.name;   
            arr.unshift(item);
          }

          arr = arr.slice(0,-1);
          this.setState({
            housePhotoList: arr
          });
          this.refs.main.hideIndicator();  
      });
    
   
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.SET_SCROLL_TOP_FLAG != nextProps.SET_SCROLL_TOP_FLAG)
    {
      this.refs.flatlist.scrollToOffset({offset:0});
    }
  }

  menuBtnClicked() {
    this.props.navigation.openDrawer();
  }

    loadMore () {
      if(!this.canAction) return;
      if(this.state.refreshing) return;
    
      let ref = database.ref(`house_photos`);
      var userRef = database.ref(`users/${this.state.schoolid}`);
      let startKey = this.state.lastElementKey;
        this.setState({refreshing : true});
        if(startKey ==0 ) return;
        console.log(' ------------- load more is called ---------');
        ref.orderByKey().endAt(startKey).limitToLast(ITEMS_PER_PAGE+1).on('value' ,async (snapshot)=> {
          const snapshotVal = snapshot.val();
          var arr = [];
          this.setState({lastElementKey : 0});
          const snapArray = Object.entries(snapshotVal)
        
          for (let i = 0; i < snapArray.length; i++) {
            let item = snapArray[i][1];
            item.key = snapArray[i][0];
            if (this.state.lastElementKey == 0) 
            this.setState({lastElementKey : snapArray[i][0]});
            // get username 
            let userId = item.user_id;
            let snap = await userRef.child(userId).once('value');
            let userDetail = snap.val();
            item.userName = userDetail.name;   
            arr.unshift(item);
          }
          console.log('arr = ', arr);
          if(arr.length > ITEMS_PER_PAGE) arr = arr.slice(0,-1);
          else   this.setState({lastElementKey : 0});
          let temp = this.state.housePhotoList.slice(0);
          temp = temp.concat(arr);
          this.setState({
            housePhotoList: temp
          });
          this.setState({refreshing : false});
        });
  }

  selectModifyPost = (index) => {
    let ref = database.ref(`house_photos`);
    let selectedPostKey = this.state.selectedPostKey;
    switch(index) {
      case 0:
        // delete action
        Alert.alert(
          "Alert", 
          "Do you really want to delete this post?", 
          [
            {text: "OK" , onPress : () => {
              ref.child(selectedPostKey).remove();
            /*   let removedList = this.state.housePhotoList.slice(0);
              let selectedElementIndex;
              for(var index = 0 ; index < removedList.length ; index++) {
                if(removedList[index].key == selectedPostKey)
                {
                  selectedElementIndex = index;       
                  break;
                }
              }
              removedList.splice(selectedElementIndex,1);
              this.setState({housePhotoList : removedList}) */
            }},
            {text: "Cancel" , onPress : () => {
            
            }},
          ],
          { cancelable: false }
        );
       
        break;
    }
}


  showActionSheet = (data) => {
    this.setState({selectedPostKey : data[0]});
    this.ActionSheet.show();
  }

  _renderItem = ({item}) => { 
    var date = (new Date(item.date * 1000)).toDateString();
    return (
        <View style={Styles.itemContainer}>
        <View style={{flex:1, flexDirection : 'row', justifyContent : 'space-between', alignItems: 'center'}}>
          <View>
              <Text style={Styles.usernameStyle}>{item.userName}</Text>
              <Text style={Styles.dateStyle}>{date}</Text>
              <Text style={Styles.descriptionStyle}>{item.description}</Text>
          </View>
          <View style={{display : (this.state.isAdmin || this.state.isPhotoEditable) ? 'flex' : 'none'}}>
              <FontAwesomeIcon onPress = {this.showActionSheet.bind(this, [item.key] ) } style={{paddingRight:10}} name="chevron-down" size={15} color="white" />
          </View>
        </View>
        <FastImage style={Styles.imageStyle} source={{uri : item.image_url,  priority: FastImage.priority.normal}}/>
        {/* <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between', paddingTop:5, paddingBottom:5}}>
            <View style={{flex:1, flexDirection: 'row', justifyContent: 'center' ,alignItems: 'center'}}>
                <Icon style={{paddingRight:5}} name="like" size={30} color="white" />
                <Text style={Styles.iconText}>Like</Text>
            </View>
            <View style={{flex:1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Icon style={{paddingRight:5}} name="comments" size={30} color="white" />
                <Text style={Styles.iconText}>Comment</Text>
            </View>
            <View style={{flex:1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Icon style={{paddingRight:5}} name="share" size={30} color="white" />
                <Text style={Styles.iconText}>Share</Text>
            </View>
        </View> */}
      </View>
    );
  }

 
  addBtnClicked() {
    this.props.navigation.navigate("newpost");
  }


  render() {
      
    return (
      <ActivityComponent ref='main'>
        <ImageBackground
          style={Styles.container}
          source={Assets.background}
          resizeMode='cover'
        >
          <Navbar
            left={Assets.menubtn}
            leftHandler={this.menuBtnClicked.bind(this)}
            right={Assets.addbtn}
            rightHandler={this.addBtnClicked.bind(this)}
            title="House Photos"
            logo={Assets.house_photo}
          />      
          <View style={Styles.contentView}>
          <FlatList
            style={Styles.flatListStyle}
            data={this.state.housePhotoList}
            extraData={this.state.hosePhotoList}
            renderItem =  {this._renderItem}
            keyExtractor = {(item, index) => index.toString()}
            onEndReachedThreshold = {3}
            onEndReached={this.loadMore}
            ref='flatlist'
            onScrollBeginDrag={() => {
              this.canAction = true;
            }}
            onScrollEndDrag={() => {
              this.canAction = false;
            }}
            onMomentumScrollBegin={() => {
              this.canAction = true;
            }}
            onMomentumScrollEnd={() => {
              this.canAction = false;
            }}
            refreshing={ this.state.refreshing}
          />
            <ActionSheet
              ref={o => this.ActionSheet = o}
              title={'Select'}
              options={['Delete', 'Cancel']}
              cancelButtonIndex={3}
              destructiveButtonIndex={0}
              onPress={this.selectModifyPost}
            />
          </View>
        </ImageBackground>
      </ActivityComponent>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return ({
    removeScrollFlag: () => dispatch(removeScrollFlag()),
  });
};

const mapStateToProps = (state, props) => {
	return({
    user: state.sidemenu.user,
    SET_SCROLL_TOP_FLAG : state.event.SET_SCROLL_TOP_FLAG
	});
};

export default connect(mapStateToProps, null)(HousePhotosScreen);
