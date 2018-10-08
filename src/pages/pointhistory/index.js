

import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  Alert,
  TextInput,
  ListView,
  Dimensions,
} from 'react-native';
import firebase from '../../firebase';
import { NavigationActions } from 'react-navigation';
import Grid from 'react-native-grid-component';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import ModalSelector from 'react-native-modal-selector';
import Autocomplete from 'react-native-autocomplete-input';
// import AutoSuggest from 'autosuggest';
import Icon from 'react-native-vector-icons/Entypo';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Styles from './styles';
import Assets from '../../../assets';
import Metrics from '../../themes/Metrics';
import Colors from '../../themes/Colors';
import { ActivityComponent, ImageTextInput, Navbar, PointInput } from '../../components';

const { width, height } = Dimensions.get('window');
const auth = firebase.auth();
const database = firebase.database();

var adresses = [
  {
    street: '1 Martin Place',
      city: 'Sydney',
    country: 'Australia'
    },{
    street: '1 Martin Street',
      city: 'Sydney',
    country: 'Australia'
  }
];

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class PointHistoryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      houselist: [],
      schoolid: props.user.schoolid,
      isDropDown: false,
      selectedHouseName: null,
      selectedUserName: null,
      point_history: [],
      isDateTimePickerVisible: false,
      selectedDate: new Date(),
      searchedAdresses: [],
      userList: [],
      userDataSource: [],
      userText: '',
      userListVisible: false,
      houseDataSource: [],
      houseText: '',
      houseListVisible: false,
    };
  }

  componentDidMount() {
    this.setState({
      selectedHouseID: -1,
      selectedUserID: 'all',
    })
    let ref = database.ref(`houses/${this.state.schoolid}`);
    var array = [{
        key: -1,
        label: 'All',
        uid: -1,
    }];
    var array1 = [];
    let index = 0;
    ref.on('value', (snapshot) => {
        console.log('Houses', snapshot.val());
        snapshot.forEach(element => {
            array.push({key: element.key, label: element.val().name, uid: element.key});
        });
        console.log('Array->', array);
        this.setState({
            houselist: array,
            selectedHouseName: array[0].label,
        });
        this.getPointHistory();
        this.getAllUser();        
    });
  }

  getAllUser = () => {
    let ref = database.ref(`users/${this.state.schoolid}`);
    var array = [{
        key: -1,
        label: 'All',
        uid: 'all',
    }];
    let index = 0;
    ref.on('value', (snapshot) => {
        console.log('Houses', snapshot.val());
        snapshot.forEach(element => {
            array.push({key: index++, label: element.val().name, uid: element.key});
        });
        console.log('User Array->', array);
        this.setState({
            userList: array,
            dataSource: array,
            selectedUserName: array[0].label,
        });
    });
  }

  getPointHistory = () => {
    let dateLabel = (new Date().getMonth()+1) + '/' + new Date().getDate() + '/' + new Date().getFullYear();
    let ref = database.ref(`point_histories`);
    let today1 = new Date();
    let today2 = new Date();
    today1.setHours(0, 0, 0, 0);
    today2.setHours(23,59,59,99);
    let today_begin = Math.floor(today1 / 1000);
    let today_end = Math.floor(today2 / 1000);
    this.setState({
      selectedDate: new Date(),
      selectedDateLabel: dateLabel,
      selectedDateBegin: today_begin,
      selectedDateEnd: today_end,
    });
    this.refs.main.showIndicator();
    ref.orderByChild('date').startAt(today_begin).endAt(today_end).once('value')
      .then((snap) => {
        const val = snap.val();
        !val && this.setState({ point_history: [], no_history: true, });        
        const point_history = [];
        let index = 0;
        Object.keys(val).forEach(async key => {
        
          let user_name = '';
          let user_id = val[key].user_id;
          var snap = await database.ref(`users/${this.state.schoolid}/${val[key].user_id}`).once('value');
          const value = snap.val();
          user_name = value.name;

          var date = new Date(val[key].date * 1000);
          var dateWithouthSecond = date.toLocaleString([],{year:'numeric', month:'2-digit', day:'2-digit', hour: '2-digit', minute:'2-digit'});
          // get house name
          let house_id = val[key].house_id;
          var snap1 = await database.ref(`houses/${this.state.schoolid}/${house_id}`).once('value');
          const value1 = snap1.val();
          house_name = value1.name;
          point_history.push({ index: index++, user: value.name, house_name : house_name,  date: dateWithouthSecond, point: val[key].point});
          this.setState({
            point_history: point_history,
            no_history: false,
          })
          this.refs.main.hideIndicator() 
        });
        console.log('Point array', point_history);
      })
      .catch(err => {
        this.refs.main.hideIndicator();
        console.log(err)
      })
  }

  menuBtnClicked() {
    this.props.navigation.openDrawer();
  }

  resetAll() {
    let ref = database.ref(`houses/${this.state.schoolid}`);
    let obj = {};
    for(var i =0; i< this.state.houselist.length; i++) {
      obj[`/${i}/point`] = 0;
    }
    ref.update(obj, () => {
      this.refs.main.hideIndicator();  
    });
  }

  reset(index) {
    let ref = database.ref(`houses/${this.state.schoolid}/${index}`);
    ref.update({
      point: 0
    }, () => {
      
    });
  }

  resetBtnClicked(option) {
    Alert.alert(
      'Confirm', 
      'Are you sure you want to ' + option.label + ' to 0?', 
      [
        {text: 'No'},
        {text: 'Yes', onPress: () => {
          this.refs.main.showIndicator();
          if(option.key == 0){
            this.resetAll();
          }else{
            this.reset(option.key - 1);
          }
        }},
      ],
      { cancelable: false }
    );
    return;
  }

  selectUser = async (id, name) => {
    this.setState({
      selectedUserName: name,
      selectedUserID: id,
    });

    let id_no = parseInt(this.state.selectedHouseID, 10);
    let user_id = id;
    let ref = database.ref(`point_histories`);
    this.refs.main.showIndicator();
  
    if( id !==  'all' && id_no !== -1) {
      try {
        let snapshot = await ref.orderByChild('filter_all').equalTo(`${user_id}_${id_no}_${this.state.selectedDateBegin}_${this.state.selectedDateEnd}`).once('value')
        var val = snapshot.val();
        !val && this.setState({ point_history: [], no_history: true, });        
        const point_history = [];
        let index = 0;
        Object.keys(val).forEach(async key => {
          let ref1 = database.ref(`users/${this.state.schoolid}/${val[key].user_id}`);
          let user_name = '';
          let user_id = val[key].user_id;
          let snap = await ref1.once('value')
          const value = snap.val();
          var date = new Date(val[key].date * 1000);
          user_name = value.name;
          var dateWithouthSecond = date.toLocaleString([],{year:'numeric', month:'2-digit', day:'2-digit', hour: '2-digit', minute:'2-digit'});
          // get house name
          let house_id = val[key].house_id;
          var snap1 = await database.ref(`houses/${this.state.schoolid}/${house_id}`).once('value');
          const value1 = snap1.val();
          house_name = value1.name;
          point_history.push({ index: index++, user: value.name, house_name : house_name,  date: dateWithouthSecond, point: val[key].point});
          
          this.setState({
            point_history: point_history,
            no_history: false,
          })
          this.refs.main.hideIndicator();
        });
        console.log('By house-->', point_history);
        
      } catch (error) {
        this.refs.main.hideIndicator();
      }
    }
    if ( id !== 'all' && id_no == -1) {
      try {
        let snapshot = await ref.orderByChild('filter_user_date').equalTo(`${user_id}_${this.state.selectedDateBegin}_${this.state.selectedDateEnd}`).once('value')
        var val = snapshot.val();
        !val && this.setState({ point_history: [], no_history: true, });        
        const point_history = [];
        let index = 0;
        Object.keys(val).forEach(async key => {
          let ref1 = database.ref(`users/${this.state.schoolid}/${val[key].user_id}`);
          let user_name = '';
          let user_id = val[key].user_id;
          let snap = await ref1.once('value')
          const value = snap.val();
          var date = new Date(val[key].date * 1000);
          user_name = value.name;
          var dateWithouthSecond = date.toLocaleString([],{year:'numeric', month:'2-digit', day:'2-digit', hour: '2-digit', minute:'2-digit'});
          
          // get house name
          let house_id = val[key].house_id;
          var snap1 = await database.ref(`houses/${this.state.schoolid}/${house_id}`).once('value');
          const value1 = snap1.val();
          house_name = value1.name;
          point_history.push({ index: index++, user: value.name, house_name : house_name,  date: dateWithouthSecond, point: val[key].point});
          this.setState({
            point_history: point_history,
            no_history: false,
          })
          this.refs.main.hideIndicator();
        });
        console.log('By house-->', point_history);
      } catch (error) {
        this.refs.main.hideIndicator();
      }
    }
    if ( id === 'all' && id_no == -1) {
      try {
        let snapshot = await ref.orderByChild('date').startAt(this.state.selectedDateBegin).endAt(this.state.selectedDateEnd).once('value')
        var val = snapshot.val();
        !val && this.setState({ point_history: [], no_history: true, });        
        const point_history = [];
        let index = 0;
        Object.keys(val).forEach(async key => {
          let ref1 = database.ref(`users/${this.state.schoolid}/${val[key].user_id}`);
          let user_name = '';
          let user_id = val[key].user_id;
          let snap = await ref1.once('value')
          const value = snap.val();
          var date = new Date(val[key].date * 1000);
          user_name = value.name;
          var dateWithouthSecond = date.toLocaleString([],{year:'numeric', month:'2-digit', day:'2-digit', hour: '2-digit', minute:'2-digit'});
          // get house name
          let house_id = val[key].house_id;
          var snap1 = await database.ref(`houses/${this.state.schoolid}/${house_id}`).once('value');
          const value1 = snap1.val();
          house_name = value1.name;
          point_history.push({ index: index++, user: value.name, house_name : house_name,  date: dateWithouthSecond, point: val[key].point});
          this.setState({
            point_history: point_history,
            no_history: false,
          })
          this.refs.main.hideIndicator();
        });
        console.log('By house-->', point_history);
      } catch (error) {
        this.refs.main.hideIndicator();
      }
    }
    if ( id === 'all' && id_no !== -1) {
      try {
        this.refs.main.showIndicator();
        let snapshot = await ref.orderByChild('filter_house_date').equalTo(`${id_no}_${this.state.selectedDateBegin}_${this.state.selectedDateEnd}`).once('value')
        var val = snapshot.val();
        !val && this.setState({ point_history: [], no_history: true, });        
        const point_history = [];
        let index = 0;
        Object.keys(val).forEach(async key => {
          let ref1 = database.ref(`users/${this.state.schoolid}/${val[key].user_id}`);
          let user_name = '';
          let user_id = val[key].user_id;
          let snap = await ref1.once('value')
          const value = snap.val();
          var date = new Date(val[key].date * 1000);
          user_name = value.name;
          var dateWithouthSecond = date.toLocaleString([],{year:'numeric', month:'2-digit', day:'2-digit', hour: '2-digit', minute:'2-digit'});
          
          // get house name
          let house_id = val[key].house_id;
          var snap1 = await database.ref(`houses/${this.state.schoolid}/${house_id}`).once('value');
          const value1 = snap1.val();
          house_name = value1.name;
          point_history.push({ index: index++, user: value.name, house_name : house_name,  date: dateWithouthSecond, point: val[key].point});
          this.setState({
            point_history: point_history,
            no_history: false,
          })
          this.refs.main.hideIndicator();
        });
        console.log('By house-->', point_history);
      } catch (error) {
        this.refs.main.hideIndicator();
      }
    }
  }

  selectHouse = async (id, name) => {
    this.setState({
        selectedHouseName: name,
        selectedHouseID: id,
    });
    let id_no = parseInt(id, 10);
    let user_id = this.state.selectedUserID;
    let ref = database.ref(`point_histories`);
    this.refs.main.showIndicator();
    if( id !== -1 && user_id !== 'all') {
      try {
        let snapshot = await ref.orderByChild('filter_all').equalTo(`${this.state.selectedUserID}_${id_no}_${this.state.selectedDateBegin}_${this.state.selectedDateEnd}`).once('value')
        var val = snapshot.val();
        !val && this.setState({ point_history: [], no_history: true, });        
        const point_history = [];
        let index = 0;
        Object.keys(val).forEach(async key => {
          let ref1 = database.ref(`users/${this.state.schoolid}/${val[key].user_id}`);
          let user_name = '';
          let user_id = val[key].user_id;
          let snap = await ref1.once('value')
          const value = snap.val();
          var date = new Date(val[key].date * 1000);
          user_name = value.name;
          var dateWithouthSecond = date.toLocaleString([],{year:'numeric', month:'2-digit', day:'2-digit', hour: '2-digit', minute:'2-digit'});
          // get house name
          let house_id = val[key].house_id;
          var snap1 = await database.ref(`houses/${this.state.schoolid}/${house_id}`).once('value');
          const value1 = snap1.val();
          house_name = value1.name;
          point_history.push({ index: index++, user: value.name, house_name : house_name,  date: dateWithouthSecond, point: val[key].point});
          this.setState({
            point_history: point_history,
            no_history: false,
          })
          this.refs.main.hideIndicator();
        });
        console.log('By house-->', point_history);
      } catch (error) {
        this.refs.main.hideIndicator();
      }
    }
    if( id !== -1 && user_id === 'all') {
      try {
        let snapshot = await ref.orderByChild('filter_house_date').equalTo(`${id_no}_${this.state.selectedDateBegin}_${this.state.selectedDateEnd}`).once('value')
        var val = snapshot.val();
        !val && this.setState({ point_history: [], no_history: true, });        
        const point_history = [];
        let index = 0;
        Object.keys(val).forEach(async key => {
          let ref1 = database.ref(`users/${this.state.schoolid}/${val[key].user_id}`);
          let user_name = '';
          let user_id = val[key].user_id;
          let snap = await ref1.once('value')
          const value = snap.val();
          var date = new Date(val[key].date * 1000);
          user_name = value.name;
          var dateWithouthSecond = date.toLocaleString([],{year:'numeric', month:'2-digit', day:'2-digit', hour: '2-digit', minute:'2-digit'});
          // get house name
          let house_id = val[key].house_id;
          var snap1 = await database.ref(`houses/${this.state.schoolid}/${house_id}`).once('value');
          const value1 = snap1.val();
          house_name = value1.name;
          point_history.push({ index: index++, user: value.name, house_name : house_name,  date: dateWithouthSecond, point: val[key].point});
          this.setState({
            point_history: point_history,
            no_history: false,
          })
          this.refs.main.hideIndicator();
        });
        console.log('By house-->', point_history);
      } catch (error) {
        this.refs.main.hideIndicator();
      }
    }
    if( id == -1 && user_id === 'all') {
      try {
        let snapshot = await ref.orderByChild('date').startAt(this.state.selectedDateBegin).endAt(this.state.selectedDateEnd).once('value')
        var val = snapshot.val();
        !val && this.setState({ point_history: [], no_history: true, });        
        const point_history = [];
        let index = 0;
        Object.keys(val).forEach(async key => {
          let ref1 = database.ref(`users/${this.state.schoolid}/${val[key].user_id}`);
          let user_name = '';
          let user_id = val[key].user_id;
          let snap = await ref1.once('value')
          const value = snap.val();
          var date = new Date(val[key].date * 1000);
          user_name = value.name;
          var dateWithouthSecond = date.toLocaleString([],{year:'numeric', month:'2-digit', day:'2-digit', hour: '2-digit', minute:'2-digit'});
          // get house name
          let house_id = val[key].house_id;
          var snap1 = await database.ref(`houses/${this.state.schoolid}/${house_id}`).once('value');
          const value1 = snap1.val();
          house_name = value1.name;
          point_history.push({ index: index++, user: value.name, house_name : house_name,  date: dateWithouthSecond, point: val[key].point});
          this.setState({
            point_history: point_history,
            no_history: false,
          })
          this.refs.main.hideIndicator();
        });
        console.log('By house-->', point_history);
      } catch (error) {
        this.refs.main.hideIndicator();
      }
    }
    if( id == -1 && user_id !== 'all'){
      try {
        let snapshot = await ref.orderByChild('filter_user_date').equalTo(`${this.state.selectedUserID}_${this.state.selectedDateBegin}_${this.state.selectedDateEnd}`).once('value')
        var val = snapshot.val();
        !val && this.setState({ point_history: [], no_history: true, });        
        const point_history = [];
        let index = 0;
        Object.keys(val).forEach(async key => {
          let ref1 = database.ref(`users/${this.state.schoolid}/${val[key].user_id}`);
          let user_name = '';
          let user_id = val[key].user_id;
          let snap = await ref1.once('value')
          const value = snap.val();
          var date = new Date(val[key].date * 1000);
          user_name = value.name;
          var dateWithouthSecond = date.toLocaleString([],{year:'numeric', month:'2-digit', day:'2-digit', hour: '2-digit', minute:'2-digit'});
          // get house name
          let house_id = val[key].house_id;
          var snap1 = await database.ref(`houses/${this.state.schoolid}/${house_id}`).once('value');
          const value1 = snap1.val();
          house_name = value1.name;
          point_history.push({ index: index++, user: value.name, house_name : house_name,  date: dateWithouthSecond, point: val[key].point});
          this.setState({
            point_history: point_history,
            no_history: false,
          })
          this.refs.main.hideIndicator();
        });
        console.log('By house-->', point_history);
      } catch (error) {
        this.refs.main.hideIndicator();
      }
    }
  }

  isPress = () => {
    console.log('Pressed');
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });


  _handleDatePicked = async (date) => {
    console.log('A date has been picked: ', date);
    let dateLabel = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    let ref = database.ref(`point_histories`);
    let day_1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    let day_2 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    let day_begin = Math.floor(day_1 / 1000);
    let day_end = Math.floor(day_2 / 1000);
    this.setState({
      seletedDate: date,
      selectedDateLabel: dateLabel,
      selectedDateBegin: day_begin,
      selectedDateEnd: day_end,
    });
    let user_id = this.state.selectedUserID;
    let house_id = parseInt(this.state.selectedHouseID, 10);
    this.refs.main.showIndicator();
    if (user_id === 'all' && house_id == -1) {
      try {
        let snapshot = await ref.orderByChild('date').startAt(day_begin).endAt(day_end).once('value')
        var val = snapshot.val();
        !val && this.setState({ point_history: [], no_history: true, });        
        const point_history = [];
        let index = 0;
        Object.keys(val).forEach(async key => {
          let ref1 = database.ref(`users/${this.state.schoolid}/${val[key].user_id}`);
          let user_name = '';
          let user_id = val[key].user_id;
          let snap = await ref1.once('value')
          const value = snap.val();
          var date = new Date(val[key].date * 1000);
          var dateWithouthSecond = date.toLocaleString([],{year:'numeric', month:'2-digit', day:'2-digit', hour: '2-digit', minute:'2-digit'});
          user_name = value.name;
          // get house name
          let house_id = val[key].house_id;
          var snap1 = await database.ref(`houses/${this.state.schoolid}/${house_id}`).once('value');
          const value1 = snap1.val();
          house_name = value1.name;
          point_history.push({ index: index++, user: value.name, house_name : house_name,  date: dateWithouthSecond, point: val[key].point});
          this.setState({
            point_history: point_history,
            no_history: false,
          })
          this.refs.main.hideIndicator();
        });
        console.log('By house-->', point_history);
      } catch (error) {
        this.refs.main.hideIndicator();
      }
    }
    if (user_id === 'all' && house_id !== -1) {
      try {
        let snapshot = await ref.orderByChild('filter_house_date').equalTo(`${house_id}_${day_begin}_${day_end}`).once('value')
        var val = snapshot.val();
        !val && this.setState({ point_history: [], no_history: true, });        
        const point_history = [];
        let index = 0;
        Object.keys(val).forEach(async key => {
          let ref1 = database.ref(`users/${this.state.schoolid}/${val[key].user_id}`);
          let user_name = '';
          let user_id = val[key].user_id;
          let snap = await ref1.once('value')
          const value = snap.val();
          var date = new Date(val[key].date * 1000);
          var dateWithouthSecond = date.toLocaleString([],{year:'numeric', month:'2-digit', day:'2-digit', hour: '2-digit', minute:'2-digit'});
          user_name = value.name;
          // get house name
          let house_id = val[key].house_id;
          var snap1 = await database.ref(`houses/${this.state.schoolid}/${house_id}`).once('value');
          const value1 = snap1.val();
          house_name = value1.name;
          point_history.push({ index: index++, user: value.name, house_name : house_name,  date: dateWithouthSecond, point: val[key].point});
          this.setState({
            point_history: point_history,
            no_history: false,
          })
          this.refs.main.hideIndicator();
        });
        console.log('By house-->', point_history);
      } catch (error) {
        this.refs.main.hideIndicator();
      }
    }

    if( user_id !== 'all' && house_id == -1) {
      try {
        let snapshot = await ref.orderByChild('filter_user_date').equalTo(`${user_id}_${day_begin}_${day_end}`).once('value')
        var val = snapshot.val();
        !val && this.setState({ point_history: [], no_history: true, });        
        const point_history = [];
        let index = 0;
        Object.keys(val).forEach(async key => {
          let ref1 = database.ref(`users/${this.state.schoolid}/${val[key].user_id}`);
          let user_name = '';
          let user_id = val[key].user_id;
          let snap = await ref1.once('value')
          const value = snap.val();
          var date = new Date(val[key].date * 1000);
          var dateWithouthSecond = date.toLocaleString([],{year:'numeric', month:'2-digit', day:'2-digit', hour: '2-digit', minute:'2-digit'});
          user_name = value.name;
          // get house name
          let house_id = val[key].house_id;
          var snap1 = await database.ref(`houses/${this.state.schoolid}/${house_id}`).once('value');
          const value1 = snap1.val();
          house_name = value1.name;
          point_history.push({ index: index++, user: value.name, house_name : house_name,  date: dateWithouthSecond, point: val[key].point});
          this.setState({
            point_history: point_history,
            no_history: false,
          })
          this.refs.main.hideIndicator();
        });
        console.log('By house-->', point_history);
      } catch (error) {
        this.refs.main.hideIndicator();
      }
    }

    if( user_id !== 'all' && house_id !== -1) {
      try {
        let snapshot = await ref.orderByChild('filter_all').equalTo(`${user_id}_${house_id}_${day_begin}_${day_end}`).once('value')
        var val = snapshot.val();
        !val && this.setState({ point_history: [], no_history: true, });        
        const point_history = [];
        let index = 0;
        Object.keys(val).forEach(async key => {
          let ref1 = database.ref(`users/${this.state.schoolid}/${val[key].user_id}`);
          let user_name = '';
          let user_id = val[key].user_id;
          let snap = await ref1.once('value')
          const value = snap.val();
          var date = new Date(val[key].date * 1000);
          var dateWithouthSecond = date.toLocaleString([],{year:'numeric', month:'2-digit', day:'2-digit', hour: '2-digit', minute:'2-digit'});
          user_name = value.name;
          // get house name
          let house_id = val[key].house_id;
          var snap1 = await database.ref(`houses/${this.state.schoolid}/${house_id}`).once('value');
          const value1 = snap1.val();
          house_name = value1.name;
          point_history.push({ index: index++, user: value.name, house_name : house_name,  date: dateWithouthSecond, point: val[key].point});
          this.setState({
            point_history: point_history,
            no_history: false,
          })
          this.refs.main.hideIndicator();
        });
        console.log('By house-->', point_history);
      } catch (error) {
        this.refs.main.hideIndicator();
      }
    }
    this._hideDateTimePicker();
  };
  
  searchedAdresses = (searchedText) => {
    var searchedAdresses = adresses.filter(function(adress) {
      return adress.street.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
    });
    this.setState({searchedAdresses: searchedAdresses});
  };

  renderUser = (user) => {
    console.log('Each item', user);
    return (
      <TouchableOpacity 
        onPress={(uid, label)=>{ 
          this.selectUser(user.uid, user.label);
          this.setState({
            userListVisible: false,
          })
        }} 
        style={Styles.listUserItem}
      >
        <Text style={{ color: 'white'}}>{user.label}</Text>
      </TouchableOpacity>
    );
  }

  renderHouse = (house) => {
    console.log('Each house item', house);
    return (
      <TouchableOpacity 
        onPress={(uid, name)=>{ 
          this.selectHouse(house.uid, house.label);
          this.setState({
            houseListVisible: false,
          })
        }} 
        style={Styles.listHouseItem}
      >
        <Text style={{ color: 'white'}}>{house.label}</Text>
      </TouchableOpacity>
    );
  }
  filterUserSearch = (text) => {
    const newData = this.state.userList.filter(function(item){
      const itemData = item.label.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      userDataSource: newData,
      userText: text
    });
  }

  filterHouseSearch = (text) => {
    const newData = this.state.houselist.filter(function(item){
      const itemData = item.label.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      houseDataSource: newData,
      houseText: text
    });
  }
  render() {
    console.log('Point history', this.state.point_history.length);
    let optionsAry = [{key: 0, label: 'Reset All Houses'}];
    this.state.houselist.forEach(house => {
      optionsAry.push({key: house.index + 1, label: 'Reset ' + house.label});
    });
    return (
      <TouchableWithoutFeedback onPress={this.isPress}>
        <ActivityComponent ref='main'>
          <ImageBackground
              style={Styles.container}
              source={Assets.background}
              resizeMode='cover'
          >
            <Navbar
              left={Assets.menubtn}
              leftHandler={this.menuBtnClicked.bind(this)}
              title='Point History'
              logo={Assets.point_history}
            />
            <View style={Styles.contentView}>
              <View style={{ zIndex: 100, flexDirection: 'row', paddingTop: 20, paddingLeft: 20, paddingRight: 10, alignSelf: 'flex-start'}}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{  flexDirection: 'row'}}>
                    <Text style={{ color: 'white', fontSize: 18, alignSelf: 'flex-start'}}>Filter:</Text>
                  </View>
                  <View style={{ }}>
                    <View style={{ zIndex: 102 }}>
                      {/* <TextInput
                        style={Styles.filterHouseInput}
                        editable={true}
                        placeholder='House: All'
                        placeholderTextColor='gray'
                        underlineColorAndroid='transparent'
                        value={ 'House:' + this.state.selectedHouseName }
                        onChangeText = {(text) => {
                            this.setState({
                                selectedUserName: text,
                            })
                        }}
                        /> */}
                        <View style={{flexDirection: 'row'}}>
                          <TextInput
                            style={Styles.filterHouseInput}
                            editable={true}
                            placeholder='House name'
                            placeholderTextColor='gray'
                            underlineColorAndroid='transparent'
                            defaultValue='House: '
                            onChangeText={(text) => {
                              this.filterHouseSearch(text);
                              this.setState({
                                houseListVisible: true,
                                selectedHouseName: text,
                              });
                              }
                            }
                            value={ this.state.selectedHouseName }
                          />
                       
                              <ModalSelector
                              key={this.state.houselist.key}                                
                              data={this.state.houselist}
                              cancelText='Cancel'
                              selectStyle={{borderColor: 'transparent'}}
                              // selectTextStyle={{fontSize: 20, color: 'white', fontWeight: 'bold', backgroundColor: 'transparent'}}
                              optionStyle={{height: 40, alignItems: 'center', justifyContent: 'center'}}
                              optionTextStyle={{fontSize: 16, fontWeight: 'bold'}}
                              cancelStyle={{height: 40, alignItems: 'center', justifyContent: 'center'}}
                              cancelTextStyle={{fontSize: 16, fontWeight: 'bold'}}
                              onChange={(option)=>{
                                this.selectHouse(option.key, option.label);
                              }}
                            >
                              <View style={Styles.filterHouseSelect}>
                                 <Icon style={{paddingLeft:5}} name="chevron-down" size={30} color="white" />
                              </View>
                            </ModalSelector>
                        </View>

                        { this.state.houseText.length > 0 && this.state.houseListVisible &&
                          <ListView
                            style={{ zIndex: 101,left: 20 }}
                            dataSource={ds.cloneWithRows(this.state.houseDataSource)}
                            renderRow={(house) => this.renderHouse(house)} />
                        }
                    
                    </View>
                    <View style={Styles.dateContainer}>
                      
                      <View style={{ width : '50%'}}>
                          {/* <View style={{ flex: 1, width: 100, }}> */}
                         <View style={{flexDirection: 'row'}}>
                            <TextInput
                            style={Styles.filterUserInput}
                            editable={true}
                            placeholder='User name'
                            placeholderTextColor='gray'
                            underlineColorAndroid='transparent'
                            onChangeText={(text) => {
                              this.filterUserSearch(text);
                              this.setState({
                                userListVisible: true,
                                selectedUserName: text,
                              });
                              }
                            }
                            value={ this.state.selectedUserName }
                            />

                             <ModalSelector
                              key={this.state.houselist.key}                                
                              data={this.state.userList}
                              cancelText='Cancel'
                              selectStyle={{borderColor: 'transparent'}}
                              // selectTextStyle={{fontSize: 20, color: 'white', fontWeight: 'bold', backgroundColor: 'transparent'}}
                              optionStyle={{height: 40, alignItems: 'center', justifyContent: 'center'}}
                              optionTextStyle={{fontSize: 16, fontWeight: 'bold'}}
                              cancelStyle={{height: 40, alignItems: 'center', justifyContent: 'center'}}
                              cancelTextStyle={{fontSize: 16, fontWeight: 'bold'}}
                              onChange={(option)=>{ 
                                this.selectUser(option.uid, option.label);}}
                            >
                              <View style={Styles.filterUserSelect}>
                                <Icon style={{paddingLeft:5}} name="chevron-down" size={30} color="white" />
                              </View>
                            </ModalSelector>  
                          </View>
                          { this.state.userText.length > 0 && this.state.userListVisible &&
                          <ListView
                            style={{ zIndex: 101,  left: 0 }}
                            dataSource={ds.cloneWithRows(this.state.userDataSource)}
                            renderRow={(user) => this.renderUser(user)} />
                          }
                          {/* </View> */}
                          {/* <Autocomplete
                            data={this.state.userList}
                            defaultValue={this.state.selectedUserName}
                            onChangeText={text => this.setState({ selectedUserName: text })}
                            renderItem={item => (
                              <TouchableOpacity onPress={() => this.setState({ selectedUserName: item.label })}>
                                <Text>{item.label}</Text>
                              </TouchableOpacity>
                            )}
                          />
                          </View> */}
                            {/* <AutoSuggest
                                onChangeText={(text) => console.log('input changing!')}
                                terms={['Apple', 'Banana', 'Orange', 'Strawberry', 'Lemon', 'Cantaloupe', 'Peach', 'Mandarin', 'Date', 'Kiwi']}
                              /> */}
                              {/* </View> */}
                          
                       
                      </View>
                      <View style={{ flexDirection: 'row', width : '50%', justifyContent:'flex-end' }}>
                          <TextInput
                          style={Styles.filterDateInput}
                          editable={false}
                          placeholder='Date / Time'
                          placeholderTextColor='gray'
                          underlineColorAndroid='transparent'
                          value={this.state.selectedDateLabel}
                          />
                          <TouchableOpacity onPress={this._showDateTimePicker} style={Styles.filterDateSelect}>
                            <Icon style={{paddingLeft:5}} name="chevron-down" size={30} color="white" />
                          </TouchableOpacity>
                          <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this._handleDatePicked}
                            onCancel={this._hideDateTimePicker}
                          />
                      </View>
                    
                    </View>
                  </View>
                </View>
              </View>
              <ScrollView style={{ marginLeft: 20, marginRight: 20, marginTop: 30, marginBottom: 30 }}>
                { this.state.no_history && <Text style={{ color: 'white', fontSize: 18, alignSelf: 'center' }}>No history to show</Text>}
                { this.state.point_history.length > 0 &&
                  this.state.point_history.map((item, index) => (
                    <View key={index}>
                    <View style={Styles.item_top} >
                      <Text style={{ color: 'white', fontSize: 16 }}>{item.user}</Text>
                      <Text style={{ color: 'white', fontSize: 14 }}>{item.date}</Text>
                    </View>
                    <View style={Styles.line}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight:'700' }}>{item.house_name}</Text>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight:'700'  }}>{item.point>0 &&  <Text>+</Text>}{item.point}</Text>
                     
                    </View>
                    </View>
                  ))
                }
              </ScrollView>
            </View>
          </ImageBackground>
        </ActivityComponent>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = (state, props) => {
	return({
    user: state.sidemenu.user,
	});
};

export default connect(mapStateToProps, null)(PointHistoryScreen);
