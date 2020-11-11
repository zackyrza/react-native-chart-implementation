import remove from 'lodash.remove';

// Base URL's
export const uri = 'https://develop3.kickavenue.com/products/sale-history?ids=';

// Action Types
export const GET_GRAPH = 'GET_GRAPH';

// Action Creators
export function getgraph(id) {
    return {
        type: GET_GRAPH,
        id
    }
}

// Reducers
const initialState = {
    lineGraph: {
        labels: [],
        data: [],
    },
};

async function graphReducer(state = initialState, action) {
    switch (action.type) {
        case GET_GRAPH:
            let headers = new Headers();

            let stateData = await fetch(uri + action.id, headers)
                .then(response => {
                    return response.json();
                })
                .then(async res => {
                    const fetchedData = res.data;
                    let labels = [];
                    let data = [];
                    let finalState = {};
                    await fetchedData.map(t => {
                        const id = labels.indexOf(t.customer_paid.split(' ')[0]);
                        if(id >= 0){
                            if(data[id] > parseInt(t.price)){
                                data[id] = parseInt(t.price)
                            }
                        }else{
                            labels.push(t.customer_paid.split(' ')[0]);
                            data.push(parseInt(t.price));
                        }
                    });
                    finalState = {
                        lineGraph: {
                            labels,
                            data,
                        }
                    };
                    console.log('graphReducer -> GET_GRAPH() -> data', finalState);
                    return finalState;
                });

            console.log('graphReducer -> GET_GRAPH() -> stateData', stateData);
            return stateData;
        default:
            return state
    }
}

export default graphReducer;
