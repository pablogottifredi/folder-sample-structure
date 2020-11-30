import React from 'react';
import agent from './agent';
import { connect } from 'react-redux';

import { 
  TAGS_DATA_CHANGED,
  TAG_SELECTED,
  COMPONENT_NAME
} from './types';
import {
  ASYNC_AGENT_START,
  ASYNC_AGENT_END,
  ASYNC_AGENT_ERROR
} from '../Status/types';

import Timer from '../Timer';

const mapStateToProps = state => ({
     ...state.search
  });

const mapDispatchToProps = dispatch => ({
    onClickTag: payload => dispatch({ type: TAG_SELECTED, payload: payload }),
    onAgentStart: () => dispatch({ type: ASYNC_AGENT_START, payload: ASYNC_AGENT_START + ' ' + COMPONENT_NAME }),
    onAgentEnd: () => dispatch({ type: ASYNC_AGENT_END, payload: ASYNC_AGENT_END + ' ' + COMPONENT_NAME  }),
    onAgentFail: () => dispatch({ type: ASYNC_AGENT_ERROR, payload: ASYNC_AGENT_ERROR + ' ' + COMPONENT_NAME  }), 
    onDataChanged: payload => dispatch({ type: TAGS_DATA_CHANGED, payload: payload })
});

class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      fetched: '',
      global: false,
      error: ''
    };
    this.global = props.global;
    this.componentWillMount = ()=>{
      const token = window.localStorage.getItem('jwt');
      if (token) { agent.setToken(token); }
      this.fetchTags();
      
    }
    this.fetchTags =() => {
      this.props.onAgentStart();
      if (this.global) {
        agent.Tags.getAll()
          .then( (data) =>{
            this.setState( { tags: data, fetched: new Date().toUTCString(),  error:'' });
            this.props.onAgentEnd();
            this.props.onDataChanged(data);
          }, (err) => {
            this.setState( { error: 'Problem getting data' + err.message })
            this.props.onAgentFail()
          })
      } else {
        agent.Tags.getByHelpDeskId(this.props.helpdeskid)
          .then( (data) =>{
            this.setState( { tags: data, fetched: new Date().toUTCString() , error:''});
            this.props.onAgentEnd();
            this.props.onDataChanged(data);
          }, (err) => {
            this.setState( { error: 'Problem getting data' + err.message })
            this.props.onAgentFail()
          })
      }
    }
    this.componentDidUpdate = (oldProps) => {
      const newProps = this.props
      if (newProps !== oldProps)
        this.fetchTags();
    }
  }

  tagsElList = (tagObj, idx, handle) =>{
    const tgx = 'tag_'+tagObj.tag+idx;
    const handleClick = ev => {
      ev.preventDefault();
      this.props.onClickTag(tagObj.tag);
    };
    const chipcolor = this.props.global? 'chip red white-text': 'chip blue white-text';
    return (
      <div key={tgx} className="float-left" >
        <a
          href=""
          className={chipcolor}
          onClick={handleClick}>
          {tagObj.tag}
        </a>
      </div>
    );
  };
  tagtitle = () =>{
    return (this.global)?'global search trends':'helpdesk ID#'+this.props.helpdeskid+' search trends'
  }
  render() {
    const tags = (this.state.tags && this.state.tags.length)?this.state.tags: [{ tag: 'no data' }];
    const handle = (this.state.tags && this.state.tags.length > 0);
    const mustrender = (tags && (this.global || (!this.global && this.props.helpdeskid) )  );
    if (mustrender) {
      return (
        <div>
          <div className="default-padding">
            <div className="row">
              <h5 className="center-align valign-wrapper">{this.tagtitle()}</h5>
            </div>
            <div className="row">
              <div className="tag-list">
                {
                  tags.map((tagObj,idx) => { return this.tagsElList(tagObj,idx,handle) } ) 
                }
              </div>
            </div>
            <div className="row">
              <label>Data fetched at: {this.state.fetched} </label>
              <p>{this.state.error}</p>
              <Timer seconds="10" reset="true" message="Data will expire in"/>
            </div>
          </div>
        </div>
        );
    } else {
      return (
        <div></div>
      );
    }
}
}

export default connect(mapStateToProps, mapDispatchToProps)(Tags);
