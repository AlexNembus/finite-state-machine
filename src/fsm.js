class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        let errorEmptyConfig = {failure: 'Config is empty'};
        if(!config){ throw new Error(errorEmptyConfig.failure); }
        this.currentState = 'normal';
        this.stateSequenceArray = ['normal'];
        this.config = config.states;
        this.unDoArr = [];
        this.clear = 0;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        let errorNoState = {failure: 'Specific State does not exist'};
        let stateConfig = this.config;
        for(let key in stateConfig){
            if (key === state){ this.currentState = state; 
                this.stateSequenceArray.push(state); 
                this.unDoArr.push('change');
                return; 
            }
        }
        throw new Error(errorNoState.failure);
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let stateConfig = this.config;
        let errorNoEvent = {failure: 'Specific Event does not exist in current State'};
        for(let key in stateConfig){
            if(key === this.currentState){
            for(let key2 in stateConfig[key].transitions){
                if(event === key2){ 
                    this.currentState = stateConfig[key].transitions[key2];
                    this.stateSequenceArray.push(this.currentState); 
                    this.unDoArr.push('trigger');
                    return; 
                }
            }
          }
        }
        throw new Error(errorNoEvent.failure);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.currentState = 'normal';
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let stateConfig = this.config;
        let errorNoEvent = {failure: 'Specific Event does not exist'};
        let statesArr = [];
        if(!event){ return ['normal', 'busy', 'hungry', 'sleeping']; }
        for(let key in stateConfig){
            for(let key2 in stateConfig[key].transitions){
                 if(event === key2){ statesArr.push(key); }
            }
        }
        if(statesArr){ return statesArr; }
        throw new Error(errorNoEvent.failure);
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this.clear === 1){ return false; }
        if(this.stateSequenceArray.length === 1){
            return false;
        }
        this.currentState = this.stateSequenceArray.pop();
        this.unDoArr.push(this.currentState);
        this.currentState = this.stateSequenceArray.pop();
        this.stateSequenceArray.push(this.currentState);
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this.clear === 1){ return false; }
        if(this.unDoArr.length === 0){ return false; }
        let unDoValue = this.unDoArr.pop();
        if(unDoValue === 'trigger' || unDoValue === 'change'){ 
            this.unDoArr.push(unDoValue);
            return false; }
        this.currentState = unDoValue;
        this.stateSequenceArray.push(this.currentState);
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
      this.clear = 1;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
