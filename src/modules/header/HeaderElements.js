const HeaderElements = [
    {
        elemName : 'logo',
        content : {
            path : '/img/RTPS-logo.png'
        }
    },
    {
        elemName: 'queryInputs',
        content: {
            inputOne : {
                id : 1,
                name : 'Query Geography',
                elem_id: 'geography',
                options : ['Zone', 'MCD']
            },
            muniList : {
                id : 2,
                name : 'Municipalities',
                elem_id : 'muni',
                options : [
                    "Abington Township",
                    "Aldan Borough",
                    "Ambler Borough",
                    "Aston Township",
                    "Atglen Borough",
                    "Audubon Borough",
                    "Audubon Park Borough",
                    "Avondale Borough",
                    "Barrington Borough",
                    "Bass River Township",
                    "Bedminster Township",
                    "Bellmawr Borough",
                    "Bensalem Township",
                    "Berlin Borough",
                    "Berlin Township",
                    "Bethel Township",
                    "Beverly City",
                    "Birmingham Township",
                    "Bordentown City",
                    "Bordentown Township",
                    "Bridgeport Borough",
                    "Bridgeton Township",
                    "Bristol Borough",
                    "Bristol Township",
                    "Brookhaven Borough",
                    "Brooklawn Borough",
                    "Bryn Athyn Borough",
                    "Buckingham Township",
                    "Burlington City",
                    "Burlington Township",
                    "Caln Township",
                    "Camden City",
                    "Chadds Ford Township",
                    "Chalfont Borough",
                    "Charlestown Township",
                    "Cheltenham Township",
                    "Cherry Hill Township",
                    "Chesilhurst Borough",
                    "Chester City",
                    "Chester Heights Borough",
                    "Chester Township",
                    "Chesterfield Township",
                    "Cinnaminson Township",
                    "Clayton Borough",
                    "Clementon Borough",
                    "Clifton Heights Borough",
                    "Coatesville City",
                    "Collegeville Borough",
                    "Collingdale Borough",
                    "Collingswood Borough",
                    "Colwyn Borough",
                    "Concord Township",
                    "Conshohocken Borough",
                    "Darby Borough",
                    "Darby Township",
                    "Delanco Township",
                    "Delran Township",
                    "Deptford Township",
                    "Douglass Township",
                    "Downingtown Borough",
                    "Doylestown Borough",
                    "Doylestown Township",
                    "Dublin Borough",
                    "Durham Township",
                    "East Bradford Township",
                    "East Brandywine Township",
                    "East Caln Township",
                    "East Coventry Township",
                    "East Fallowfield Township",
                    "East Goshen Township",
                    "East Greenville Borough",
                    "East Greenwich Township",
                    "East Lansdowne Borough",
                    "East Marlborough Township",
                    "East Nantmeal Township",
                    "East Norriton Township",
                    "East Nottingham Township",
                    "East Pikeland Township",
                    "East Rockhill Township",
                    "East Vincent Township",
                    "East Whiteland Township",
                    "East Windsor Township",
                    "Eastampton Township",
                    "Easttown Township",
                    "Eddystone Borough",
                    "Edgewater Park Township",
                    "Edgmont Township",
                    "Elk Township",
                    "Elverson Borough",
                    "Evesham Township",
                    "Ewing Township",
                    "Falls Township",
                    "Fieldsboro Borough",
                    "Florence Township",
                    "Folcroft Borough",
                    "Franconia Township",
                    "Franklin Township",
                    "Gibbsboro Borough",
                    "Glassboro Borough",
                    "Glenolden Borough"
                    ]
            },
            inputTwo : {
                id : 3,
                name : 'Direction',
                elem_id: 'direction',
                options : ['To Zone', 'From Zone']
            },
            runQuery : {
                id : 5,
                name: 'Run Query'
            },
            clearQuery : {
                id : 6,
                name : 'Clear Query'
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

export {HeaderElements};