import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';

import Convert from './components/Convert';
import Days from './components/Days';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {key: 'first', title: 'Convert'},
        {key: 'second', title: 'Days of Supply'},
      ],
    };
  }

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,
        })}
        onIndexChange={index => this.setState({index})}
        initialLayout={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
      />
    );
  }
}

const FirstRoute = () => (
  <View style={[styles.container, {backgroundColor: '#ffffff'}]}>
    <Convert styles={styles} />
  </View>
);

const SecondRoute = () => (
  <View style={[styles.container, {backgroundColor: '#ffffff'}]}>
    <Days styles={styles} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  h1: {
    fontSize: 20,
    color: 'black',
  },
  title: {
    fontSize: 30,
    color: 'black',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  tInput: {
    width: 40,
    borderBottomWidth: 0.5,
    padding: 0,
    textAlign: 'center',
  },
  absoluteRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 50,
  },
  text: {
    color: 'black',
    fontSize: 20,
  },
  dropdownItems: {
    color: 'black',
    fontSize: 20,
    marginBottom: 20,
  },
  margin: {
    marginTop: 20,
  },
});
