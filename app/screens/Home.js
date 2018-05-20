import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import Camera from 'react-native-camera';
import RNFS from 'react-native-fs';
import Clarifai from 'clarifai';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  captureImage = async () => {
    const app = new Clarifai.App({
      apiKey: 'YOUR_API_KEY'
    });

    try {
      const data = await this.camera.capture();
      const base64image = await RNFS.readFile(data.path, 'base64');
      // console.log(base64image);

      app.models.predict(Clarifai.GENERAL_MODEL, {base64: base64image}).then(
        function(response) {
          // do something with response
          let results = response.outputs[0].data.concepts;
          // results = results.slice(0, results.length/2);
          // results.map(obj => console.log(`${obj.name} with value=${obj.value}`));
          // const total = results.map(obj => obj.value).reduce((total, value) => total+value, 0);
          // const avg = total / results.length;
          // console.log(avg.toFixed(2));

          results.filter(obj => {
            // console.log(obj.value.toFixed(2), avg.toFixed(2));
            if (obj.value.toFixed(2) >= 0.95) {
              console.log(obj.name);
            }
          });
        },
        function(err) {
          // there was an error
          console.log(err);
        }
      );

    } catch (err) {
      console.log('err: ', err);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={ref => {
            this.camera = ref;
          }}
          captureTarget={Camera.constants.CaptureTarget.temp}
          style={styles.preview}
        />
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
          <TouchableOpacity
            onPress={this.captureImage}
            style={styles.capture}
          >
            <Text style={{fontSize: 14}}> SNAP </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  }
});

export default Home;
