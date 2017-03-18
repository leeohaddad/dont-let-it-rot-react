'use strict';

var React = require('react');
var {
  Component
} = React;
var ReactNative = require('react-native');
var {
  Button,
  Modal,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  View
} = ReactNative;
var ToolbarAndroid = require('ToolbarAndroid');
var ImagePicker = require('react-native-image-picker');

var options = {
  title: 'Escolher Foto',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

var ListProducts = React.createClass({
  componentDidMount: function() {
    // Update products List
  },
  getInitialState: function() {
    return {
      newProduct: '',
      avatarSource: {uri: '../img/placeholder.png'}
    };
  },
  render: function () {
    let ProductsList = this.props.root.state.productsList.map((a, i) => {
      if (a.productId>0)
        return <View style={{alignItems:'center'}} key={i}><Text style={{fontSize:25, fontWeight:'bold'}}>{a.name}</Text></View>
      else return;                          
    })
    return (
      <View style={styles.container}>
        <ToolbarAndroid
          actions={toolbarActions}
          logo={require('../img/icon_logo.png')}
          onActionSelected={this._onActionSelected}
          style={styles.toolbar}
          title="Don't Let It Rot!"
          titleColor="#ffffff" />
        <View style={{flex:1, flexDirection:'row'}}>
          <View style={{flex:0.05}} />
          <View style={{flex:0.90, flexDirection:'column'}}>
            <View style={{flex:0.1}} />
            <View style={{flex:0.1, alignItems:'center'}}>
              <Text style={{fontWeight:'bold', fontSize:20}}>LISTA DE PRODUTOS CADASTRADOS</Text>
            </View>
            <View style={{flex:0.1}} />
            <TextInput
              maxLength={23}
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(text) => this.setState({newProduct: text})}
              value={this.state.newProduct} />
            <View style={{flex:0.05}} />
            <Button
              onPress={this._onPressAdicionarProduto}
              title="Adicionar"
              color="#00aaaa"
              accessibilityLabel="Cadastrar um novo tipo de produto." />
            <View style={{flex:0.15}} />
            <View style={{flex:0.5, flexDirection:'column', backgroundColor:'#000000'}}>
              <View style={{flex:0.01}} />
              <View style={{flex:0.98, flexDirection:'row'}}>
                <View style={{flex:0.01}} />
                <View style={{flex:0.98}}>
                  <ScrollView style={{flex:1, backgroundColor:'#eeeeee', borderColor:'#000000', borderWidth:10, borderRadius:10, borderStyle:'solid'}}>
                    {ProductsList}
                  </ScrollView>
                </View>
                <View style={{flex:0.01}} />
              </View>
              <View style={{flex:0.01}} />
            </View>
            <View style={{flex:0.05}} />
          </View>
          <View style={{flex:0.05}} />
        </View>
      </View>
    );
  },
  _onActionSelected: function (position) {
    if (position == 0) {
      this.props.root.setState({listProducts: false});
    }
  },
  saveNewProduct: function () {
    if (this.state.newProduct == 'ResetDB')
      this.props.database.resetDB();
    var that = this;
    this.props.database.addProductName(this.state.newProduct.trim(), this.state.avatarSource, () => {
      that.props.root.updateProductsList();
    });
    this.setState({newProduct: ''});
  },
  _onPressAdicionarProduto: function () {
    if (this.state.newProduct == undefined || this.state.newProduct.trim().length == 0) {
      alert("Defina um nome para o produto!");
      return;
    }
    var that = this;
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        alert("error picking image: " + response.error);
        console.log('ImagePicker Error: ', response.error);
      }
      else {
        let source = { uri: response.uri };
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          avatarSource: source
        });
      }
      that.saveNewProduct();
    });
  },
});

var toolbarActions = [
  {title: 'Back', icon: require('../img/icon_back.png'), show: 'always'},
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  toolbar: {
    backgroundColor: '#00aaaa',
    height: 56,
  },
});

module.exports = ListProducts;