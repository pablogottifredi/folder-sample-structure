import React from 'react';
import { connect } from 'react-redux';
//import { Route, Switch } from 'react-router-dom';
import { store } from '../store';
import { push } from 'react-router-redux';
import { Home } from './Home'

const mapStateToProps = state => {
  return {
    appName: 'invgate.search.test',
    appLoaded: true
  }};

const mapDispatchToProps = dispatch => ({
  
});

class App extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      store.dispatch(push(nextProps.redirectTo));
      this.props.onRedirect();
    }
  }

  componentWillMount() {
    
  }

  render() {
    if (this.props.appLoaded) {
      return (
        <div className="page" >
          <Home appName={this.props.appName}/>
        </div>
      );
    }
    return (
      <div className="page" appName={this.props.appName} >
      </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
