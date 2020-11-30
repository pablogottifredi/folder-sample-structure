import React from 'react';
import { connect } from 'react-redux';
import { TIMER_EXPIRED, TIMER_STARTED } from './types';

  
const mapDispatchToProps = dispatch => ({
  onTimerExpired: (payload) =>
    dispatch({ type: TIMER_EXPIRED, payload }),
  onTimerStarted: (payload) =>
    dispatch({ type: TIMER_STARTED, payload })
});

class Timer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            ticks: props.seconds * 10 || 3600,
            initial: props.seconds * 10 || 3600,
            key: props.parent || 'nobody',
            reset: props.reset || true
        }
        this.ticksRemaining = (this.state.ticks);
        this.intervalHandle;
        this.startCountDown = this.startCountDown.bind(this);
        this.tick = this.tick.bind(this);

    }
    componentWillMount(){
        this.startCountDown();
    }
    tick() {
        this.setState({ ticks: this.ticksRemaining });
        if (this.ticksRemaining === 0) {
            if (this.state.reset) this.ticksRemaining = this.state.initial
            else clearInterval(this.intervalHandle);
            this.props.onTimerExpired( this.key )
        }
        this.ticksRemaining--
    }
    startCountDown() {
        this.intervalHandle = setInterval(this.tick, 100);
    }
 
    render() {
        return (
            <label >{this.props.message}  {this.ticksRemaining/10}</label>
        );
    }
}

export default connect(() => ({}), mapDispatchToProps)(Timer);
