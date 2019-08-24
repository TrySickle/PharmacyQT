import React from 'react';
import {View, Text, TextInput, Picker, ScrollView} from 'react-native';

export default class Convert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      og_amount: '',
      og_volume: '5',
      take_amount: '',
      take_amount_type: 'tsp',
      take_times: '',
      take_times_text: false,
      take_times_type: 'xDay',
      for_x: '',
      for_type: 'days',
      total_ml: '',
      new_amount: '',
      new_volume: '',
      new_rx: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    let take_amount = parseInt(this.state.take_amount);
    let take_times = parseInt(this.state.take_times);
    let for_x = parseInt(this.state.for_x);
    if (!isNaN(take_amount) && !isNaN(take_times) && !isNaN(for_x)) {
      const total =
        this.state.for_type === 'ml'
          ? for_x
          : this.getAmount() * this.getTimes() * for_x;
      this.setState({total_ml: total.toString()});
      let og_amount = parseInt(this.state.og_amount);
      let og_volume = parseInt(this.state.og_volume);
      let new_amount = parseInt(this.state.new_amount);
      let new_volume = parseInt(this.state.new_volume);
      if (
        !isNaN(og_amount) &&
        !isNaN(og_volume) &&
        !isNaN(new_amount) &&
        !isNaN(new_volume)
      ) {
        const dosage = this.getDosage(og_amount, og_volume, this.getAmount());
        const newAmount = this.getNewAmount(dosage, new_amount, new_volume);
        const timesPerDay = this.getTimes();
        const totalInDays =
          this.state.for_type === 'ml'
            ? total / (this.getAmount() * timesPerDay)
            : this.state.for_x;
        if (this.state.take_times_type === 'hours') {
          const newRx = `Take ${newAmount} ml every ${24 /
            timesPerDay} hours for ${totalInDays} days, total ${newAmount *
            timesPerDay *
            totalInDays} ml`;
          this.setState({new_rx: newRx});
        } else {
          const newRx = `Take ${newAmount} ml ${timesPerDay} times per day for ${totalInDays} days, total ${newAmount *
            timesPerDay *
            totalInDays} ml`;
          this.setState({new_rx: newRx});
        }
      } else {
        this.setState({new_rx: ''});
      }
    } else {
      this.setState({total_ml: ''});
    }
  }

  getDosage(mg, ml, amount) {
    return (mg / ml) * amount;
  }

  getNewAmount(dosage, mg2, ml2) {
    return (dosage * ml2) / mg2;
  }

  getAmount() {
    return this.state.take_amount_type === 'tsp'
      ? parseInt(this.state.take_amount) * 5
      : this.state.take_amount;
  }

  getTimes() {
    return this.state.take_times_type === 'hours'
      ? 24 / parseInt(this.state.take_times)
      : this.state.take_times;
  }

  render() {
    return (
      <ScrollView>
        <View>
          <Text style={this.props.styles.title}>Original Rx</Text>
        </View>
        <View style={this.props.styles.rowContainer}>
          <Text style={this.props.styles.h1}>Strength: </Text>
          <TextInput
            keyboardType={'numeric'}
            value={this.state.og_amount}
            style={this.props.styles.tInput}
            onChangeText={text =>
              this.setState({og_amount: text}, this.handleChange)
            }
          />
          <Text style={this.props.styles.text}>mg /</Text>
          <TextInput
            keyboardType={'numeric'}
            value={this.state.og_volume}
            style={this.props.styles.tInput}
            onChangeText={text =>
              this.setState({og_volume: text}, this.handleChange)
            }
          />
          <Text style={this.props.styles.text}>ml</Text>
        </View>
        <View style={this.props.styles.rowContainer}>
          <Text style={this.props.styles.h1}>Take </Text>
          <TextInput
            keyboardType={'numeric'}
            value={this.state.take_amount}
            style={this.props.styles.tInput}
            onChangeText={text =>
              this.setState({take_amount: text}, this.handleChange)
            }
          />
          <Picker
            selectedValue={this.state.take_amount_type}
            style={{width: 100}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({take_amount_type: itemValue}, this.handleChange)
            }>
            <Picker.Item label="tsp" value="tsp" />
            <Picker.Item label="ml" value="ml" />
          </Picker>
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
        <View style={this.props.styles.rowContainer}>
          <Text style={this.props.styles.h1}>For </Text>
          <TextInput
            keyboardType={'numeric'}
            value={this.state.for_x}
            style={this.props.styles.tInput}
            onChangeText={text =>
              this.setState({for_x: text}, this.handleChange)
            }
          />
          <Picker
            selectedValue={this.state.for_type}
            style={{width: 100}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({for_type: itemValue}, this.handleChange)
            }>
            <Picker.Item label="days" value="days" />
            <Picker.Item label="ml" value="ml" />
          </Picker>
        </View>
        <View style={this.props.styles.rowContainer}>
          <Text style={this.props.styles.h1}>Total ml: </Text>
          <Text style={this.props.styles.h1}>{this.state.total_ml}</Text>
        </View>
        <View style={this.props.styles.margin} />
        <View>
          <Text style={this.props.styles.title}>New Rx</Text>
        </View>
        <View style={this.props.styles.rowContainer}>
          <Text style={this.props.styles.h1}>Strength: </Text>
          <TextInput
            keyboardType={'numeric'}
            value={this.state.new_amount}
            style={this.props.styles.tInput}
            onChangeText={text =>
              this.setState({new_amount: text}, this.handleChange)
            }
          />
          <Text style={this.props.styles.text}>mg /</Text>
          <TextInput
            keyboardType={'numeric'}
            value={this.state.new_volume}
            style={this.props.styles.tInput}
            onChangeText={text =>
              this.setState({new_volume: text}, this.handleChange)
            }
          />
          <Text style={this.props.styles.text}>ml</Text>
        </View>
        <View>
          <Text style={this.props.styles.h1}>{this.state.new_rx}</Text>
        </View>
      </ScrollView>
    );
  }
}
