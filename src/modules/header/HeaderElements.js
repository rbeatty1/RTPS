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
            home: {
                pageId: 1,
                name: 'Home',
            },
            availibility : {
                pageId : 2,
                name : 'Accessibility',
            },
            frequency : {
                pageId : 3,
                name : 'Frequency',
            },
            gap : {
                pageId : 4,
                name : 'Gap',
            },
            reliability : {
                pageId : 5,
                name : 'Reliability',
            },
        }
    }
]

export {HeaderElements};