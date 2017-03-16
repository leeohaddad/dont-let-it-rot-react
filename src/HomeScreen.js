'use strict';

var React = require('react');
var {
  Component
} = React;
var ReactNative = require('react-native');
var {
  StyleSheet,
  ScrollView,
  View
} = ReactNative;
var ToolbarAndroid = require('ToolbarAndroid');
var Product = require("./Product");

var HomeScreen = React.createClass({
  getInitialState: function() {
    return {
      toolbarSwitch: false,
      colorProps: {
        titleColor: '#3b5998',
        subtitleColor: '#6a7180',
      },
    };
  },
  render: function () {
    return (
      <View style={styles.container}>
        <ToolbarAndroid
          actions={toolbarActions}
          logo={require('../img/icon_logo.png')}
          onActionSelected={this._onActionSelected}
          style={styles.toolbar}
          title="Don't Let It Rot!"
          titleColor="#ffffff" />
        <ScrollView>
          <Product />
          <Product />
          <Product />
          <Product />
          <Product />
          <Product />
          <Product />
          <Product />
        </ScrollView>
      </View>
    );
  },
  _onActionSelected: function(position) {
    alert("selected: " + position);
  },
});

var toolbarActions = [
  {title: 'Settings', icon: require('../img/icon_settings.png'), show: 'always'},
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#4b0082',
  },
  toolbar: {
    backgroundColor: '#00aaaa',
    height: 56,
  },
});

module.exports = HomeScreen;