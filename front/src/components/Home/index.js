
import React from 'react';
import Tags from '../Tags';
import Status from '../Status';
import Search from '../Search';
import IncidentList from '../IncidentList';
import { connect } from 'react-redux';

import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from './types';

//const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  onLoad: (tab, pager, payload) =>
    dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED })
});

export class Home extends React.Component {
  componentWillMount() {
    
  }


  render() {
    return (
      <div className="home-page">
        <div className="page">
          <div className="row ">
            <div className="col s8">
              <h4>{this.props.appName}</h4>
              <Search/>
              <IncidentList></IncidentList>
            </div>
            <div className="col s4 indigo lighten-5 full-height">
              <Tags global={true} tags={this.props.tags} onClickTag={this.props.onClickTag} />
              <Tags global={false} tags={this.props.tags} onClickTag={this.props.onClickTag} />
            </div>
          </div>
        </div>
        <div className="indigo lighten-5 status ">
          <Status/>
        </div>
      </div>
            
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
