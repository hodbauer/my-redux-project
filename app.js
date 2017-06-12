var actionTypes = {
    ADD_ITEM: 'ADD_ITEM',
    DELETE_ITEM: 'DELETE_ITEM',
    DELETE_ITEM_BY_INDEX: 'DELETE_ITEM_BY_INDEX',
    RESET: 'RESET'
};

function createStore(reducer, initState){

    // this is our store's state
    var list = initState || []; //list of strings
    var events = [];

    return {
        /**
         * @description just return the stae
         * @returns {*|Array}
         */
        getState: function(){
            return list;
        },
        /**
         * @description activate the reducer
         * @param action
         */
        dispatch: function(action){
            list = reducer(list, action);
            for (var i = 0; i < events.length; i++){
                events[i](list, action);
            }
        },
        subscribe: function(cb){
            events.push(cb);
        },
        unsubscribe: function(index){
            events.splice(index, 1);
        }
    }
}

function listReducer(lastState, action){

    // create in a new variable in order to prevent sending a new object when no change happened
    var newState = JSON.parse(JSON.stringify(lastState)); // simple naive clone... better to use lodash :)
    switch(action.type){
        case actionTypes.ADD_ITEM:
            newState.push(action.payload);
            break;
        case actionTypes.DELETE_ITEM:
            newState.splice(newState.indexOf(action.payload), 1);
            break;
        case actionTypes.DELETE_ITEM_BY_INDEX:
            newState.splice(action.payload, 1);
            break;
        case actionTypes.RESET:
            return [];
        default:
            return lastState;
    }
    return newState;
}

// since we have no angular/react, we do it "manually" with jQuery...
function listViewHandler(state) {
    if (typeof $ === 'undefined') {
        return;
    }
    var listHtml = '';
    for (var i = 0; i < state.length; i++) {
        listHtml += '<li onclick="selectItem()" data-index="' + i + '" class="list-item">' + state[i] + '</li>';
    }
    $('#list').html(listHtml);
}

function addItemButton() {
    var payload = $('#list-item').val();
    if (payload === '') {
        return;
    }

    myStore.dispatch({
        type: actionTypes.ADD_ITEM,
        payload: payload
    });
}

var INIT_STATE = ['Yuval', 'Arbel'];

var myStore = createStore(listReducer, INIT_STATE);

myStore.subscribe(listViewHandler);
