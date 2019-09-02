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
      new_volume: '5',
      new_rx: <Text />,
      old_rx: <Text />,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    let take_amount = parseInt(this.state.take_amount, 10);
    let take_times = parseInt(this.state.take_times, 10);
    let for_x = parseInt(this.state.for_x, 10);
    if (!isNaN(take_amount) && !isNaN(take_times) && !isNaN(for_x)) {
      const total =
        this.state.for_type === 'ml'
          ? for_x
          : this.getAmount() * this.getTimes() * for_x;
      const timesPerDay = this.getTimes();
      const totalInDays =
        this.state.for_type === 'ml'
          ? total / (this.getAmount() * timesPerDay)
          : this.state.for_x;
      const amount = (Math.round(this.getAmount() * 10) / 10).toFixed(1);
      const totalMl = Math.ceil(amount * timesPerDay * totalInDays);
      const takeMg = (
        Math.round(
          (parseInt(this.state.og_amount, 10) /
            parseInt(this.state.og_volume, 10)) *
            this.getAmount() *
            10,
        ) / 10
      ).toFixed(1);
      if (this.state.take_times_type === 'hours') {
        const old_rx = `Take ${amount} ml (${takeMg} mg) every ${24 /
          timesPerDay} hours for ${totalInDays} days, total ${totalMl} ml`;
        this.setState({old_rx});
      } else {
        const old_rx = `Take ${amount} ml (${takeMg} mg) ${timesPerDay} times per day for ${totalInDays} days, total ${totalMl} ml`;
        this.setState({old_rx});
      }
      let og_amount = parseInt(this.state.og_amount, 10);
      let og_volume = parseInt(this.state.og_volume, 10);
      let new_amount = parseInt(this.state.new_amount, 10);
      let new_volume = parseInt(this.state.new_volume, 10);
      if (
        !isNaN(og_amount) &&
        !isNaN(og_volume) &&
        !isNaN(new_amount) &&
        !isNaN(new_volume)
      ) {
        const dosage = this.getDosage(og_amount, og_volume, this.getAmount());
        const newAmount = (
          Math.round(this.getNewAmount(dosage, new_amount, new_volume) * 10) /
          10
        ).toFixed(1);
        const newTotalMl = Math.ceil(newAmount * timesPerDay * totalInDays);
        const newTakeMg = (
          Math.round(
            (parseInt(this.state.new_amount, 10) /
              parseInt(this.state.new_volume, 10)) *
              this.getNewAmount(dosage, new_amount, new_volume) *
              10,
          ) / 10
        ).toFixed(1);
        if (this.state.take_times_type === 'hours') {
          const new_rx = `Take ${newAmount} ml (${newTakeMg} mg) every ${24 /
            timesPerDay} hours for ${totalInDays} days, total ${newTotalMl} ml`;
          this.setState({new_rx});
        } else {
          const new_rx = `Take ${newAmount} ml (${newTakeMg} mg) ${timesPerDay} times per day for ${totalInDays} days, total ${newTotalMl} ml`;
          this.setState({new_rx});
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
      ? parseInt(this.state.take_amount, 10) * 5
      : this.state.take_amount;
  }

  getTimes() {
    return this.state.take_times_type === 'hours'
      ? 24 / parseInt(this.state.take_times, 10)
      : this.state.take_times;
  }

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps={'always'}>
        <View>
          <Text style={this.props.styles.title}>Original Rx</Text>
        </View>
        <View style={this.props.styles.rowContainer}>
          <Text style={this.props.styles.h1}>Strength: </Text>
          <TextInput
            keyboardType={'numeric'}
            returnKeyType={'next'}
            value={this.state.og_amount}
            style={this.props.styles.tInput}
            onChangeText={text =>
              this.setState({og_amount: text}, this.handleChange)
            }
            onSubmitEditing={() => this.input2.focus()}
            blurOnSubmit={false}
          />
          <Text style={this.props.styles.text}>mg /</Text>
          <TextInput
            keyboardType={'numeric'}
            returnKeyType={'next'}
            value={this.state.og_volume}
            style={this.props.styles.tInput}
            onChangeText={text =>
              this.setState({og_volume: text}, this.handleChange)
            }
            ref={ref => {
              this.input2 = ref;
            }}
            onSubmitEditing={() => this.input3.focus()}
            blurOnSubmit={false}
          />
          <Text style={this.props.styles.text}>ml</Text>
        </View>
        <View style={this.props.styles.rowContainer}>
          <Text style={this.props.styles.h1}>Take </Text>
          <TextInput
            keyboardType={'numeric'}
            returnKeyType={'next'}
            value={this.state.take_amount}
            style={this.props.styles.tInput}
            onChangeText={text =>
              this.setState({take_amount: text}, this.handleChange)
            }
            ref={ref => {
              this.input3 = ref;
            }}
            onSubmitEditing={() => this.input4.focus()}
            blurOnSubmit={false}
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
              returnKeyType={'next'}
              value={this.state.take_times}
              style={this.props.styles.tInput}
              onChangeText={text =>
                this.setState({take_times: text}, this.handleChange)
              }
              ref={ref => {
                this.input4 = ref;
              }}
              onSubmitEditing={() => this.input5.focus()}
              blurOnSubmit={false}
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
            returnKeyType={'next'}
            value={this.state.for_x}
            style={this.props.styles.tInput}
            onChangeText={text =>
              this.setState({for_x: text}, this.handleChange)
            }
            ref={ref => {
              this.input5 = ref;
            }}
            onSubmitEditing={() => this.input6.focus()}
            blurOnSubmit={false}
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
          <Text style={this.props.styles.rx}>{this.state.old_rx}</Text>
        </View>
        <View style={this.props.styles.margin} />
        <View>
          <Text style={this.props.styles.title}>New Rx</Text>
        </View>
        <View style={this.props.styles.rowContainer}>
          <Text style={this.props.styles.h1}>Strength: </Text>
          <TextInput
            keyboardType={'numeric'}
            returnKeyType={'next'}
            value={this.state.new_amount}
            style={this.props.styles.tInput}
            onChangeText={text =>
              this.setState({new_amount: text}, this.handleChange)
            }
            ref={ref => {
              this.input6 = ref;
            }}
            onSubmitEditing={() => this.input7.focus()}
            blurOnSubmit={false}
          />
          <Text style={this.props.styles.text}>mg /</Text>
          <TextInput
            keyboardType={'numeric'}
            value={this.state.new_volume}
            style={this.props.styles.tInput}
            onChangeText={text =>
              this.setState({new_volume: text}, this.handleChange)
            }
            ref={ref => {
              this.input7 = ref;
            }}
          />
          <Text style={this.props.styles.text}>ml</Text>
        </View>
        <View style={this.props.styles.margin} />
        <View>
          <Text style={this.props.styles.rx}>{this.state.new_rx}</Text>
        </View>
      </ScrollView>
    );
  }
}
