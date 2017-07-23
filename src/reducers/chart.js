import {
  GET_CHART_SUCCESS
} from '../actions/chart';

const initialState = {
  data:{
    lastMonth: [],
    thisMonth: [],
    userByDate: [],
    equipChart: []
  }
};

export default function chart(state = initialState, action = {}) {
  switch (action.type) {
    case GET_CHART_SUCCESS:
      return Object.assign({}, state, { data: action.payload.data })

    default:
      return state;
  }
}
