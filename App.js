import React, { Component } from 'react';
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: null,
    };
  }

  componentDidMount() {
    this.getPhoneNumber();
  }

  getPhoneNumber = async () => {
    const value = await AsyncStorage.getItem('number');
    this.setState({ phoneNumber: value });
  };

  render() {
    const { phoneNumber } = this.state;

    if (!phoneNumber) {
      return <Login setPhoneNumber={this.setPhoneNumber} />;
    }

    return (
      <View style={styles.container}>
        <Text>Welcome to Your Nutrition Tracker!</Text>
        <Text>You are logged in with phone number: {phoneNumber}</Text>
        {/* Navigation and other components go here */}
        <Button title="Logout" onPress={() => AsyncStorage.removeItem('number').then(() => this.setState({ phoneNumber: null }))} />
      </View>
    );
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      error: '',
    };
  }

  handleSubmit = async () => {
    const { phone } = this.state;
    if (!phone) {
      this.setState({ error: 'You must enter your phone number to get your data' });
      return;
    }

    await AsyncStorage.setItem('number', phone);
    this.props.setPhoneNumber(phone);
  };

  render() {
    const { phone, error } = this.state;

    return (
      <View style={styles.container}>
        <Text>Welcome to Your Nutrition Tracker!</Text>
        <Text>Please enter your phone number below to get started:</Text>
        <TextInput
          placeholder="Phone Number"
          style={styles.input}
          keyboardType="numeric"
          maxLength={10}
          value={phone}
          onChangeText={(text) => this.setState({ phone: text })}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button title="Get Started" onPress={this.handleSubmit} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default App;
