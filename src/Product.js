'use strict';

var React = require('react');
var {
  Component
} = React;
var ReactNative = require('react-native');
var {
  StyleSheet,
  Image
} = ReactNative;

var Product = React.createClass({
  render: function () {
    return (
      <Image source={require('../img/placeholder.jpg')} />
    );
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aaaaaa',
  },
});

module.exports = Product;
