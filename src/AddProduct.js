'use strict';

var React = require('react');
var {
  Component
} = React;
var ReactNative = require('react-native');
var {
  Button,
  Modal,
  Picker,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  View
} = ReactNative;
var ToolbarAndroid = require('ToolbarAndroid');
var ListProducts = require("./ListProducts");
import DatePicker from 'react-native-datepicker'

var AddProduct = React.createClass({
  componentDidMount: function() {
    this.updateProductsList();
  },
  updateProductsList: function () {
    this.props.database.requestProductNamesList((data) => this.setProductsList(data));
  },
  setProductsList: function (data) {
    data.unshift({productId:0, name:'Escolher produto...'});
    this.setState({productsList: data});
  },
  getInitialState: function() {
    return {
      productsList: [{productId:0, name:'Escolher produto...'}],
      listProducts: false,
      productId: 0,
      quantity: '0',
      expireDate: (this.ensureTwoDigits(new Date().getDate())+"/"+this.ensureTwoDigits(new Date().getMonth())+"/"+(new Date().getFullYear()))
    };
  },
  ensureTwoDigits: function (input) {
    if (input < 10)
      return ("0"+input);
    return input;
  },
  render: function () {
    let ProductsList = this.state.productsList.map((a, i) => {
      return <Picker.Item label={a.name} value={a.productId} key={i} />
    })
    return (
      <View style={{flex:1}}>
        <View style={styles.container}>
          <ToolbarAndroid
            actions={toolbarActions}
            logo={require('../img/icon_logo.png')}
            onActionSelected={this._onActionSelected}
            style={styles.toolbar}
            title="Don't Let It Rot!"
            titleColor="#ffffff" />
          <View style={{flex:1, backgroundColor:'#ffffff', flexDirection:'row'}}>
            <View style={{flex:0.05}} />
            <View style={{flex:0.90, flexDirection:'column'}}>
              <View style={{flex:0.1}} />
              <View style={{flex:0.1, alignItems:'center'}}>
                <Text style={{flex:0.1, fontWeight:'bold', fontSize:20}}>ADICIONAR COMPRA</Text>
              </View>
              <View style={{flex:0.15}} />
              <View style={{flex:0.1, alignItems:'center'}}>
                <Text style={{flex:0.1}}>Nome do Produto</Text> 
              </View>          
              <Picker
                style={{flex:0.1}}
                selectedValue={this.state.productId}
                onValueChange={(pId) => this.setState({productId: pId})}>
                {ProductsList}
              </Picker>
              <View style={{flex:0.1}} />
              <View style={{flex:0.1, alignItems:'center'}}>
                <Text style={{flex:0.1}}>Quantidade</Text>           
              </View>
              <View style={{flex:0.1, flexDirection:'row'}}>
                <View style={{flex:0.4}} />
                <TextInput
                  keyboardType="numeric"
                  style={{flex:0.2, height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={(text) => this.setState({quantity: text})}
                  value={this.state.quantity} />
                <View style={{flex:0.4}} />
              </View>
              <View style={{flex:0.1}} />
              <View style={{flex:0.1, alignItems:'center'}}>
                <Text style={{flex:0.1}}>Data de Validade</Text>           
              </View>
              <View style={{alignItems:'center'}}>
              <DatePicker
                date={this.state.expireDate}
                mode="date"
                placeholder="Selecione a Data"
                format="DD/MM/YYYY"
                minDate="01/03/2016"
                maxDate="31/12/9016"
                confirmBtnText="Confirmar"
                cancelBtnText="Cancelar"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                  // ... You can check the source to find the other keys.
                }}
                onOpenModal={this.onDateChange}
                onDateChange={(date) => {this.setState({expireDate: date})}} />
              </View>
              <View style={{flex:0.2}} />
              <View style={{flex:0.1, flexDirection:'row'}}>
                <View style={{flex:0.1}} />
                <View style={{flex:0.35}}>
                  <Button
                    onPress={() => this.props.root.setState({addProduct: false})}
                    title="Cancelar"
                    color="#00aaaa"
                    accessibilityLabel="Cancelar a adição do novo produto." />
                </View>
                <View style={{flex:0.1}} />
                <View style={{flex:0.35}}>
                  <Button
                    onPress={this._onPressSalvar}
                    title="Salvar"
                    color="#00aaaa"
                    accessibilityLabel="Concluir a adição do novo produto." />
                </View>
                <View style={{flex:0.1}} />
              </View>
              <View style={{flex:0.2}} />
            </View>
            <View style={{flex:0.05}} />
          </View>
        </View>
      </View>
    );
  },
  _onActionSelected: function(position) {
    if (position == 0) {
      this.props.root.setState({listProducts: true});
    }
  },
  _onPressSalvar: function() {
    if (this.state.productId == undefined || this.state.productId == 0) {
      alert("Escolha um produto!"); 
      return;
    }
    if (this.state.quantity == 0) {
      alert("Defina uma quantidade!");
      return;
    }
    var that = this;
    this.props.database.addMyProduct(this.state.productId, this.state.quantity, this.state.expireDate, () => {
      that.props.root.setState({addProduct: false});
      that.props.root.updateCurrentList();
    })
  },
});

var toolbarActions = [
  {title: 'List', icon: require('../img/icon_list.png'), show: 'always'},
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

module.exports = AddProduct;