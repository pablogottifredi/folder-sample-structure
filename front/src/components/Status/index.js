import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    ...state.status    
    });
    
const mapDispatchToProps = dispatch => ({
});

class Status extends React.Component {
    constructor(){
        super();
        this.state = {
            message: '',
            dated: ''
        }
    }
    componentWillMount(){
     
    }
   render() {
        return (
            <p>{this.props.message} | at {this.props.dated}</p>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Status);
