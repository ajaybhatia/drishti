import { AppRegistry } from 'react-native';
import App from './App';

process.nextTick = setImmediate;

AppRegistry.registerComponent('drishti', () => App);
