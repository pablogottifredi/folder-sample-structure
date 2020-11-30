import React from 'react';
import { connect } from 'react-redux';
import {
    SEARCH_CRITERIA_CHANGED
} from './types'

const mapDispatchToProps = dispatch => ({
    onComponentChange: (text,helpdeskid,detailed) => dispatch({ type: SEARCH_CRITERIA_CHANGED, payload: { text: text, helpdeskid: helpdeskid, detailed:detailed }  }),
});

class Search extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            text:'',
            helpdeskid: '',
            detailed: 'checked',
            filter: true
        }
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
        this.handleChangeHelpdeskId = this.handleChangeHelpdeskId.bind(this);
        this.handleChangeDetailed = this.handleChangeDetailed.bind(this);
        //this.processChange = this.processChange.bind(this);    
    }
    handleChangeSearch(event){
        this.setState({text: event.target.value});
    }
    handleChangeHelpdeskId(event){
        this.setState({helpdeskid: event.target.value});
    }
    handleChangeDetailed(event){
        this.setState({detailed: event.target.checked?'checked':'' });
    }
    componentDidUpdate(){
        if (this.state.helpdeskid && this.state.helpdeskid !== ''){
            this.props.onComponentChange( this.state.text,this.state.helpdeskid, this.state.detailed==='checked'?"detailed":"onlyid")
        }
    }

    toggleFilter = (ev) =>{
        this.setState({ filter: !this.state.filter});

    }
    ready = ()=>{
        return this.state.helpdeskid;
    }
    render() {
        const filterHide = this.state.filter?'':'hide';
        const readybutton = this.ready()?'btn-floating btn-large waves-effect waves-light red':'btn-floating btn-large waves-effect waves-light red disabled';
        return (
            <div>
                <div className="row">
                    <div className="col s10">    
                        <input value={this.state.text}  onChange={this.handleChangeSearch} type="text" id="autocomplete-input" className="autocomplete"/>
                        <label  >
                            search text
                        </label>
                        <div className="right">
                            <a onClick={this.toggleFilter} className="valign-wrapper"><label>filters & behaviour</label><i className=" material-icons">filter_list</i></a>
                        </div>
                    </div>
                    <div className="col s2">
                        <a className={readybutton}><i className="material-icons">search</i></a>
                        
                    </div>
                </div>
                <div className="row">
                    <div className="col s10">
                        <div className={filterHide} >
                            <div className="z-depth-1 col s4 right default-padding" >
                                <div className="row no-padding">
                                    <div className="right col s6 ">
                                        <label>
                                            <input type="text" value={this.state.helpdeskid}  onChange={this.handleChangeHelpdeskId} />
                                            <span>helpdesk #ID</span>

                                        </label>
                                    </div>
                                </div>
                                <div className="row no-padding">
                                    <div className="right col s12">
                                        <label className="right">
                                            <input type="checkbox" checked={this.state.detailed}  onChange={this.handleChangeDetailed} />
                                            <span><label>include detailed info</label></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}

export default connect(()=>{}, mapDispatchToProps)(Search);
