const GetGeomNames= x =>{
    let mcds = []
    fetch('https://a.michaelruane.com/api/rtps/gap?list')
    .then(response=>{
        if (response.status ==200) return response.json()
    })
    .then(jawn=>{
        for (let i in jawn){
            mcds.push(jawn[i])
        }
    })
    return mcds
}


const HeaderElements = [
    {
        elemName : 'logo'
    },
    {
        elemName: 'queryInputs',
        content: {
            inputOne : {
                id : 1,
                name : 'Select a Study Area',
                elem_id: 'geography',
                options : ['Municipality', 'Zone']
            },
            muniList : {
                id : 2,
                name : 'Select a Municipality',
                elem_id : 'muni',
                options: GetGeomNames(),
            },
            inputTwo : {
                id : 3,
                name : 'Select a Direction',
                elem_id: 'direction',
                options : ['To', 'From']
            },
            runQuery : {
                id : 5,
                name: 'Run'
            },
            clearQuery : {
                id : 6,
                name : 'Reset'
            }
        }
    },
    {
        elemName : 'navigation',
        content : {
            gap : {
                title: 'Transit Network Gap Analyzer',
                shorthand: 'gap',
                color: '#8bb23f'
            },
            reliability : {
                title: 'Surface Transit Reliability',
                shorthand: 'reliability',
                color: '#e89234'
            },
            frequency : {
                title: 'Doubled Frequency Scenario',
                shorthand: 'frequency',
                color: '#d8c72e'
            },
            accessibility : {
                title: 'Wheelchair Accessibility',
                shorthand: 'accessibility',
                color: '#06bf9c'
            }
        }
    }
]

export {HeaderElements};