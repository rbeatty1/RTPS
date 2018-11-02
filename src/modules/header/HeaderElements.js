const GetGeomNames= x =>{
    let mcds = {}
    fetch('https://a.michaelruane.com/api/rtps/gap?list')
    .then(response=>{
        if (response.status ==200) return response.json()
    })
    .then(jawn=>{
        fetch('https://arcgis.dvrpc.org/arcgis/rest/services/Demographics/PopEmpForecastMCD/FeatureServer/0/query?where=1%3D1&outFields=GEOID%2C+MUN_NAME&returnGeometry=false&orderByFields=MUN_NAME&f=json')
        .then(response=>{ 
            if (response.status==200) return response.json() 
        })
        .then(agoJawn=>{
            agoJawn.features.map(feature=>{
                mcds[feature.attributes.MUN_NAME] = feature.attributes.GEOID
            })
        })
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
                options : ['To Zone', 'From Zone']
            },
            runQuery : {
                id : 5,
                name: 'Run Analysis'
            },
            clearQuery : {
                id : 6,
                name : 'Clear Selection & Results'
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