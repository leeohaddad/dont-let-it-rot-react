'use strict';

var React = require('react');
var {
  Component
} = React;
var ReactNative = require('react-native');
var {
  StyleSheet,
  Image,
  Text,
  View
} = ReactNative;
const Swipeable = require('react-native-swipeable').default;

const removeOne = <View style={{flex:1, backgroundColor:'#ffa500'}} />;
const removeAll = <View style={{flex:1, backgroundColor:'#ff0000'}} />;

var Product = React.createClass({
  render: function () {
    return (
      <Swipeable leftContent={removeOne} onLeftActionRelease={this._removeMe}
                 rightContent={removeAll} onRightActionRelease={this._removeUs}>
      <View style={styles.item}>
        <View style={{flex:0.05}} />
        <View style={{flex:0.95, flexDirection:'row'}}>
          <View style={{flex:0.02}} />
          <View style={{flex:0.96, flexDirection:'column', backgroundColor:'#4b0082'}}>
            <View style={{flex:0.05}} />
            <View style={{flex:0.9, flexDirection:'row'}}>
              <View style={{flex:0.02}} />
              <View style={{flex:0.96, flexDirection:'row', backgroundColor:'#ffffff'}}>
                <View style={{flex:0.7, flexDirection:'column', alignItems:'center'}}>
                  <View style={{flex:0.15}} />
                  <View style={{flex:0.1}}>
                    <Text style={styles.titleText}>{this.props.name || "Nome do Produto"}</Text>
                  </View>
                  <View style={{flex:0.2}} />
                  <View style={{flex:0.1}}>
                    <Text style={styles.baseText}>Quantidade: {this.props.quantity || 0}</Text>
                  </View>
                  <View style={{flex:0.2}} />
                  <View style={{flex:0.1}}>
                    <Text style={styles.baseText}>{this.props.expireDate || '00/00/0000'}</Text>
                  </View>
                  <View style={{flex:0.15}} />
                </View>
                <View style={{flex:0.3, flexDirection:'column'}}>
                  <View style={{flex:0.1}} />
                  <View style={{flex:0.8, flexDirection:'row'}}>
                    <View style={{flex:0.1}} />
                    <View style={{flex:0.8}}>
                      <Image source={require('../img/placeholder.jpg')}
                             style={styles.image} />
                    </View>
                    <View style={{flex:0.1}} />
                  </View>
                  <View style={{flex:0.1}} />
                </View>
              </View>
              <View style={{flex:0.02}} />
            </View>
            <View style={{flex:0.05}} />
          </View>
          <View style={{flex:0.02}} />
        </View>
      </View>
      </Swipeable>
    );
  },
  _removeMe: function () {
    alert("Remove Me!");
  },
  _removeUs: function () {
    alert("Remove Us!");
  },
});

const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: 120,
    backgroundColor: '#ffffff',
  },
  image: {
    flex: 0.5,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
  baseText: {
    fontFamily: 'Cochin',
    color: '#4b0082',
  },
  titleText: {
    color: '#4b0082',
    fontWeight: 'bold',
  },
});

module.exports = Product;
