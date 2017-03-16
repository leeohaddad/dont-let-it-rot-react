'use strict';

var React = require('react');
var {
  Component
} = React;
var ReactNative = require('react-native');
var {
  AppRegistry,
} = ReactNative;
var HomeScreen = require("./src/HomeScreen");

var DontLetItRot = React.createClass({
  statics: {
    title: 'Dont Let It Rot',
    description: 'Application to help manage rot dates.'
  },
  render: function () {
    return (
      <HomeScreen />
    );
  },
});

AppRegistry.registerComponent('DontLetItRot', () => DontLetItRot);
