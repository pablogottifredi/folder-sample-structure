import React from 'react';
import { connect } from 'react-redux';
import agent from './agent';

import { 
    COMPONENT_NAME_I
  } from './types'
import {
    ASYNC_AGENT_START,
    ASYNC_AGENT_END,
    ASYNC_AGENT_ERROR
  } from '../Status/types';

const mapStateToProps = state => ({
    ...state.search   
    });
    
const mapDispatchToProps = dispatch => ({
    onAgentStart: () => dispatch({ type: ASYNC_AGENT_START, payload: ASYNC_AGENT_START + ' ' + COMPONENT_NAME_I }),
    onAgentEnd: () => dispatch({ type: ASYNC_AGENT_END, payload: ASYNC_AGENT_END + ' ' + COMPONENT_NAME_I  }),
    onAgentFail: () => dispatch({ type: ASYNC_AGENT_ERROR, payload: ASYNC_AGENT_ERROR + ' ' + COMPONENT_NAME_I  }), 
});

class IncidentList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            incidents: [ ],
            error: ''
        }
        
       
    }
    componentWillMount = ()=>{
        const token = window.localStorage.getItem('jwt');
        if (token) { agent.setToken(token); }
            this.fetchList();
        
    }
    fetchList =() => {
        this.props.onAgentStart();
        if (this.props.helpdeskid) {
            this.setState( {loading: true });
            agent.Incidents.search( { id: this.props.helpdeskid, text: this.props.text, detailed: this.props.detailed!=="onlyid"?1:0} , (err)=>{ console.log("fail"); } )
                .then( (data) =>{
                    this.setState( { loading: false, error:'' });
                    this.setState( { incidents: data, fetched: new Date().toUTCString() });
                    this.props.onAgentEnd();
                }, (err) => {
                    this.setState( { error: 'Problem getting data' + err.message, loading:false })
                    this.props.onAgentFail()
                    
                })
        
            }
        }
    componentDidUpdate = (oldProps) => {
        const newProps = this.props;

        if (newProps !== oldProps) {
            this.fetchList();
        }
    }
    createMarkup =(markup) => {
        return {__html: markup};
    }
    
    incidentElList = (incident, idx,) =>{
        const icx = 'incident_'+incident.id+idx;
        return (    
            <div key={icx} className="row collection-item">
                <div className="col s1">
                    <label>#ID </label>
                    <span>{incident.id}</span>
                </div>
                <div className="col s11">
                    <div className="row min-padding-bottom">
                        <label className="col s1 right-align">#title </label>
                        <span className="col s11 valign-top"><b>{incident.title}</b></span>
                    </div>
                    <div className="row min-padding-bottom">
                        <label className="col s1 right-align">#detail</label>
                            <div className="internalhtml col s11" dangerouslySetInnerHTML={this.createMarkup(incident.description)}></div>
                        
                    </div>
                </div>
            </div>
        );
      };
    loadingdata = (loading) => {
        if (loading) {
            return (
                <div className="min-height-loading" >
                    <label>Loading data</label>
                    <div className="progress">
                        <div className="indeterminate"></div>
                    </div>
                </div>
            )
         } else { return ( <div className="min-height-loading" ></div>)}
    }
    nodata = (show) => {
        if (show) {
            return (
                <div>
                    <span className="chip">no data</span>
                </div>
            )
         } else { return ( <div className="min-height-loading" ></div>)}
    }
    render() {
        const incidents = this.state.incidents || [];
        const records = (incidents && incidents.length)?incidents.length:0;
        const loading = this.state.loading;
        const helpdeskid = this.props.helpdeskid;
        return (
            <div className="col s10">
                <div className="row">
                    { this.loadingdata( loading )}
                    <p>{this.state.error}</p>

                </div>
                <div className="row">
                    <h6>Incidents of helpdesk #{helpdeskid} - ({records}) records matchs</h6>
                </div> 
                <div className="row collection">
                {   
                    incidents.map( (incident,idx) => { return this.incidentElList(incident,idx)})
                }
                </div>
                {this.nodata( !loading && (!incidents || incidents.length === 0))}
            </div>

           
        );
    
    
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentList);
