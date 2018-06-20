const HeaderElements = [
    {
        elemName : 'logo',
        content : {
            path : '/components/header/RTPS-logo.png'
        }
    },
    {
        elemName: 'queryInputs',
        content: {
            inputOne : {
                id : '1',
                name : 'Query Geography',
                elem_id: 'geography',
                options : ['Zone', 'MCD']
            },
            inputTwo : {
                id : '2',
                name : 'Transit Demand',
                elem_id: 'demand',
                options : ['Above Average', 'Below Average']
            },
            inputThree : {
                id : '3',
                name : 'Transit Supply',
                elem_id: 'supply',
                options : ['Above Average', 'Below Average']
            },
            runQuery : {
                id : '4',
                name: 'Run Query'
            }
        }
    },
    {
        elemName : 'navigation',
        content : {
            reliability : {
                pageId : 1,
                name : 'Reliability',
                href : '#'
            },
            availibility : {
                pageId : 2,
                name : 'Availibility',
                href : '#'
            },
            frequency : {
                pageId : 3,
                name : 'Frequency',
                href : '#'
            },
            gap : {
                pageId : 4,
                name : 'Gap Analysis',
                href : '#'
            }
        }
    }
]