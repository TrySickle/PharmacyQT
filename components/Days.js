import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TextInput,
  Picker,
} from 'react-native';

import firebase from 'react-native-firebase';

export default class Days extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      db_types: [],
      db_names: [],
      name: '',
      db_quantity: [],
      quantity: '',
      db_qty_unit: [],
      qty_unit: '',
      db_doses: [],
      doses: 0,
      db_dose_units: [],
      db_max_day_sppl: [],
      db_box_unit: [],
      db_box_qty: [],
      max_day_sppl: '',
      take_times: '',
      take_times_text: false,
      take_times_type: 'xDay',
      amount: '',
      days: '',
      refreshing: false,
      dose_unit: '',
      action: '',
      selectedIndex: 0,
    };

    this.update = this.update.bind(this);
    this.resetState = this.resetState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getDoses = this.getDoses.bind(this);
    this.getDoseUnit = this.getDoseUnit.bind(this);
    this.getAction = this.getAction.bind(this);
    this.getQtyUnit = this.getQtyUnit.bind(this);
    this.getMaxDaySppl = this.getMaxDaySppl.bind(this);
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    let root = firebase.database().ref('/masterSheet/');

    this.resetState();

    root
      .once('value', snapshot => {
        snapshot.forEach(entry => {
          this.update(entry);
        });
      })
      .then(() => {
        this.setState({refreshing: false});
      });
  };

  resetState() {
    this.setState({
      db_types: [],
      db_names: [],
      name: '',
      db_quantity: [],
      quantity: '',
      db_qty_unit: [],
      db_doses: [],
      db_dose_units: [],
      db_max_day_sppl: [],
      take_times: '',
      take_times_text: false,
      take_times_type: 'xDay',
      days: '',
      amount: '',
      db_box_unit: [],
      db_box_qty: [],
    });
  }

  update(snapshot) {
    this.setState({
      db_types: this.state.db_types.slice().concat([snapshot.val().types]),
      db_names: this.state.db_names.slice().concat([snapshot.val().names]),
      db_quantity: this.state.db_quantity
        .slice()
        .concat([snapshot.val().quantity]),
      db_qty_unit: this.state.db_qty_unit
        .slice()
        .concat([snapshot.val().qty_unit]),
      db_doses: this.state.db_doses.slice().concat([snapshot.val().doses]),
      db_dose_units: this.state.db_dose_units
        .slice()
        .concat([snapshot.val().dose_units]),
      db_max_day_sppl: this.state.db_max_day_sppl
        .slice()
        .concat([snapshot.val().max_day_sppl]),
      db_box_unit: this.state.db_box_unit
        .slice()
        .concat([snapshot.val().box_unit]),
      db_box_qty: this.state.db_box_qty
        .slice()
        .concat([snapshot.val().box_qty]),
    });
  }

  getDoses() {
    return parseInt(this.state.db_doses[this.state.selectedIndex]);
  }

  getDoseUnit() {
    return this.state.db_dose_units[this.state.selectedIndex];
  }

  getAction() {
    let type = this.state.db_types[this.state.selectedIndex];
    switch (type) {
      case 'Inhaler':
        return 'Inhale';
      case 'Injection':
        return 'Inject';
      case 'Drops':
        return 'Instill';
      case 'Gel_pump':
        return 'Apply';
      default:
        return 'Take';
    }
  }

  getQtyUnit() {
    return this.state.db_qty_unit[this.state.selectedIndex];
  }

  getDisplayQtyUnit() {
    const len = this.state.qty_unit.length;
    if (this.state.qty_unit.slice([len - 2]) === 'es') {
      return this.state.qty_unit.slice(0, len - 2);
    } else if (this.state.qty_unit[len - 1] === 's') {
      return this.state.qty_unit.slice(0, len - 1);
    }
    return this.state.qty_unit;
  }

  getMaxDaySppl() {
    let maxDaySppl = this.state.db_max_day_sppl[this.state.selectedIndex];
    return maxDaySppl !== '' ? maxDaySppl : 'N/A';
  }

  getBoxUnit() {
    return this.state.db_box_unit[this.state.selectedIndex];
  }

  getBoxQty() {
    return this.state.db_box_qty[this.state.selectedIndex];
  }

  getDays(quantity, doses, take, amount, max_day_sppl) {
    let days = Math.floor((quantity * doses) / take / amount);
    if (days > max_day_sppl) {
      return quantity * max_day_sppl;
    } else {
      return days;
    }
  }

  handleChange() {
    let quantity = parseInt(this.state.quantity);
    let amount = parseInt(this.state.amount);
    let take_times = parseInt(this.state.take_times);
    if (!isNaN(quantity) && !isNaN(amount) && !isNaN(take_times)) {
      let doses = this.getDoses();
      let max_day_sppl = this.getMaxDaySppl();
      console.log(doses);
      if (this.state.take_times_type === 'hours') {
        this.setState({
          days: this.getDays(
            quantity,
            doses,
            amount,
            24 / take_times,
            max_day_sppl,
          ),
        });
      } else {
        this.setState({
          days: this.getDays(quantity, doses, amount, take_times, max_day_sppl),
        });
      }
    } else {
      this.setState({
        days: '',
      });
    }
    this.setState({
      doses: this.getDoses(),
      dose_unit: this.getDoseUnit(),
      action: this.getAction(),
      qty_unit: this.getQtyUnit(),
      max_day_sppl: this.getMaxDaySppl(),
      box_unit: this.getBoxUnit(),
      box_qty: this.getBoxQty(),
    });
  }

  componentDidMount() {
    let root = firebase.database().ref('/masterSheet/');

    root
      .once('value', snapshot => {
        snapshot.forEach(entry => {
          this.update(entry);
        });
      })
      .then(() => {
        this.setState({
          name: this.state.db_names[0],
          doses: this.getDoses(),
          dose_unit: this.getDoseUnit(),
          action: this.getAction(),
          qty_unit: this.getQtyUnit(),
          max_day_sppl: this.getMaxDaySppl(),
          box_unit: this.getBoxUnit(),
          box_qty: this.getBoxQty(),
        });
      });
  }

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
        <View>
          <Text style={this.props.styles.title}>Medication</Text>
        </View>
        <View style={this.props.styles.rowContainer}>
          <Text style={this.props.styles.h1}>Name </Text>
          <Picker
            selectedValue={this.state.name}
            style={{width: 200}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({selectedIndex: itemIndex}, this.handleChange)
            }>
            {this.state.db_names.map((item, index) => {
              return <Picker.Item label={item} value={item} key={index} />;
            })}
          </Picker>
        </View>
        <View>
          <Text style={this.props.styles.text}>
            1 {this.getDisplayQtyUnit()} is {this.state.doses}{' '}
            {this.state.dose_unit}
          </Text>
        </View>
        <View>
          <Text style={this.props.styles.text}>
            Max day supply: {this.state.max_day_sppl}
          </Text>
        </View>
        <View style={this.props.styles.margin} />
        <View>
          <Text style={this.props.styles.title}>Prescription</Text>
        </View>
        <View style={this.props.styles.rowContainer}>
          <Text style={this.props.styles.h1}>Quantity: </Text>
          <TextInput
            keyboardType={'numeric'}
            returnKeyType={'next'}
            value={this.state.quantity}
            style={this.props.styles.tInput}
            onChangeText={text =>
              this.setState({quantity: text}, this.handleChange)
            }
            onSubmitEditing={() => this.input2.focus()}
            blurOnSubmit={false}
          />
          <Text style={this.props.styles.text}>{this.state.qty_unit}</Text>
          {!!this.state.quantity && (
            <Text style={this.props.styles.text}>
              {`/${this.state.quantity * this.state.box_qty} ${
                this.state.box_unit
              }`}
            </Text>
          )}
        </View>
        <View style={this.props.styles.rowContainer}>
          <Text style={this.props.styles.h1}>{this.state.action} </Text>
          <TextInput
            keyboardType={'numeric'}
            returnKeyType={'next'}
            value={this.state.amount}
            style={this.props.styles.tInput}
            onChangeText={text =>
              this.setState({amount: text}, this.handleChange)
            }
            ref={ref => {
              this.input2 = ref;
            }}
            onSubmitEditing={() => this.input3.focus()}
            blurOnSubmit={false}
          />
          <Text style={this.props.styles.text}>{this.state.dose_unit}</Text>
        </View>
        <View style={this.props.styles.rowContainer}>
          <Text style={this.props.styles.h1}>
            {this.state.take_times_text ? 'Every ' : ' '}
          </Text>
          <View style={this.props.styles.absoluteRowContainer}>
            <TextInput
              keyboardType={'numeric'}
              value={this.state.take_times}
              style={this.props.styles.tInput}
              onChangeText={text =>
                this.setState({take_times: text}, this.handleChange)
              }
              ref={ref => {
                this.input3 = ref;
              }}
            />
            <Picker
              selectedValue={this.state.take_times_type}
              style={{width: 175}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState(
                  {
                    take_times_type: itemValue,
                    take_times_text: itemValue === 'hours',
                  },
                  this.handleChange,
                )
              }>
              <Picker.Item label="times per day" value="xDay" />
              <Picker.Item label="hours" value="hours" />
            </Picker>
          </View>
        </View>
        <View style={this.props.styles.margin} />
        <View>
          <Text style={this.props.styles.title}>Output</Text>
        </View>
        <View style={this.props.styles.rowContainer}>
          <Text style={this.props.styles.h1}>Days of Supply</Text>
        </View>
        <View style={this.props.styles.rowContainer}>
          {this.state.days !== '' && (
            <Text style={this.props.styles.text}>
              {this.state.quantity} {this.state.qty_unit} is for{' '}
              {this.state.days} days
            </Text>
          )}
          {this.state.days === '' && (
            <Text style={this.props.styles.text}>
              Please enter all information
            </Text>
          )}
        </View>
      </ScrollView>
    );
  }
}
