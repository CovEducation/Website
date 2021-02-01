import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Home } from './components/pages/Home/Home';
import './scss/tailwind.scss';

const App: React.FC = () => {
  return <Home />;
};

export default hot(App);
