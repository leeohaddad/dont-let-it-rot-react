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
          <Product name='Abóbora' quantity='2' expireDate='20/03/2017' />
          <Product name='Feijão' quantity='2' expireDate='22/03/2017' />
          <Product name='Macarrão' quantity='1' expireDate='23/03/2017' />
          <Product name='Cebola' quantity='2' expireDate='21/03/2017' />
          <Product name='Banana' quantity='6' expireDate='18/03/2017' />
          <Product name='Tomate' quantity='5' expireDate='25/03/2017' />
          <Product name='Queijo' quantity='1' expireDate='23/03/2017' />
          <Product name='Pão' quantity='2' expireDate='20/03/2017' />
          <Product />
        </ScrollView>
      </View>
    );
  },
  _onActionSelected: function(position) {
    if (position == 0) {
      alert("List products!");
    }
    else if (position == 1) {
      alert("Add a new product!");
    }
  },
});

var toolbarActions = [
  {title: 'List', icon: require('../img/icon_list.png'), show: 'always'},
  {title: 'Add', icon: require('../img/icon_plus.png'), show: 'always'},
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