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

const removeOne = <View style={{flex:1, backgroundColor:'#ffa500', alignItems:'flex-end', justifyContent:'center'}}><Text style={{fontSize:25, fontWeight:'bold'}}>-1  </Text></View>;
const removeAll = <View style={{flex:1, backgroundColor:'#ff0000', alignItems:'flex-start', justifyContent:'center'}}><Text style={{fontSize:25, fontWeight:'bold', fontColor:'#ffffff'}}>  deletar</Text></View>;

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
                    <Text style={styles.expireDateText}>{this.props.expireDate || '00/00/0000'}</Text>
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
    // alert("Remove Me: pid=" + this.props.productId + ", name=" + this.props.name + ", qtty=" + this.props.quantity + ", expireDate=" + this.props.expireDate + " !");
    if (this.props.quantity == 1) {
      this._removeUs();
      return;
    }
    var that = this;
    this.props.database.decreaseMyProduct(this.props.productId, this.props.expireDate, () => {
      that.props.root.updateCurrentList();
    });
  },
  _removeUs: function () {
    // alert("Remove Us: pid=" + this.props.productId + ", name=" + this.props.name + ", qtty=" + this.props.quantity + ", expireDate=" + this.props.expireDate + " !");
    var that = this;
    this.props.database.removeMyProduct(this.props.productId, this.props.expireDate, () => {
      that.props.root.updateCurrentList();
    });
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4b0082',
  },
  expireDateText: {
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    color: '#4b0082',
  },
});

module.exports = Product;
