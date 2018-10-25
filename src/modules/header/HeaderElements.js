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
                options : ['Zone', 'Municipality']
            },
            muniList : {
                id : 2,
                name : 'Select a Municipality',
                elem_id : 'muni',
                options : ["Abington Township", "Aldan Borough" , "Ambler Borough", "Aston Township","Atglen Borough","Audubon Borough","Audubon Park Borough","Avondale Borough","Barrington Borough","Bass River Township","Bedminster Township","Bellmawr Borough","Bensalem Township","Berlin Borough","Berlin Township","Bethel Township","Beverly City","Birmingham Township","Bordentown City","Bordentown Township","Bridgeport Borough","Bridgeton Township","Bristol Borough","Bristol Township","Brookhaven Borough","Brooklawn Borough","Bryn Athyn Borough","Buckingham Township","Burlington City","Burlington Township","Caln Township","Camden City","Chadds Ford Township","Chalfont Borough","Charlestown Township","Cheltenham Township","Cherry Hill Township","Chesilhurst Borough","Chester City","Chester Heights Borough","Chester Township","Chesterfield Township","Cinnaminson Township","Clayton Borough","Clementon Borough","Clifton Heights Borough","Coatesville City","Collegeville Borough","Collingdale Borough","Collingswood Borough","Colwyn Borough","Concord Township","Conshohocken Borough","Darby Borough","Darby Township","Delanco Township","Delran Township","Deptford Township","Douglass Township","Downingtown Borough","Doylestown Borough","Doylestown Township","Dublin Borough","Durham Township","East Bradford Township","East Brandywine Township","East Caln Township","East Coventry Township","East Fallowfield Township","East Goshen Township","East Greenville Borough","East Greenwich Township","East Lansdowne Borough","East Marlborough Township","East Nantmeal Township","East Norriton Township","East Nottingham Township","East Pikeland Township","East Rockhill Township","East Vincent Township","East Whiteland Township","East Windsor Township","Eastampton Township","Easttown Township","Eddystone Borough","Edgewater Park Township","Edgmont Township","Elk Township","Elverson Borough","Evesham Township","Ewing Township","Falls Township","Fieldsboro Borough","Florence Township","Folcroft Borough","Franconia Township","Franklin Township","Gibbsboro Borough","Glassboro Borough","Glenolden Borough","Gloucester City","Gloucester Township","Green Lane Borough","Greenwich Township","Haddon Heights Borough","Haddon Township","Haddonfield Borough","Hainesport Township","Hamilton Township","Harrison Township","Hatboro Borough","Hatfield Borough","Hatfield Township","Haverford Township","Haycock Township","Highland Township","Hightstown Borough","Hilltown Township","Hi-Nella Borough","Honey Brook Borough","Honey Brook Township","Hopewell Borough","Hopewell Township","Horsham Township","Hulmeville Borough","Ivyland Borough","Jenkintown Borough","Kennett Square Borough","Kennett Township","Langhorne Borough","Langhorne Manor Borough","Lansdale Borough","Lansdowne Borough","Laurel Springs Borough","Lawnside Borough","Lawrence Township","Limerick Township","Lindenwold Borough","Logan Township","London Britain Township","London Grove Township","Londonderry Township","Lower Chichester Township","Lower Frederick Township","Lower Gwynedd Township","Lower Makefield Township","Lower Merion Township","Lower Moreland Township","Lower Oxford Township","Lower Pottsgrove Township","Lower Providence Township","Lower Salford Township","Lower Southampton Township","Lumberton Township","Magnolia Borough","Malvern Borough","Mansfield Township","Mantua Township","Maple Shade Township","Marcus Hook Borough","Marlborough Township","Marple Township","Medford Lakes Borough","Medford Township","Media Borough","Merchantville Borough","Middletown Township","Milford Township","Millbourne Borough","Modena Borough","Monroe Township","Montgomery Township","Moorestown Township","Morrisville Borough","Morton Borough","Mount Ephraim Borough","Mount Holly Township","Mount Laurel Township","Narberth Borough","National Park Borough","Nether Providence Township","New Britain Borough","New Britain Township","New Garden Township","New Hanover Township","New Hope Borough","New London Township","Newfield Borough","Newlin Township","Newtown Borough","Newtown Township","Nockamixon Township","Norristown Borough","North Coventry Township","North Hanover Township","North Wales Borough","Northampton Township","Norwood Borough","Oaklyn Borough","Oxford Borough","Palmyra Borough","Parkesburg Borough","Parkside Borough","Paulsboro Borough","Pemberton Borough","Pemberton Township","Penn Township","Penndel Borough","Pennington Borough","Pennsauken Township","Pennsburg Borough","Pennsbury Township","Perkasie Borough","Perkiomen Township","Philadelphia City","Phoenixville Borough","Pine Hill Borough","Pine Valley Borough","Pitman Borough","Plumstead Township","Plymouth Township","Pocopson Township","Pottstown Borough","Princeton","Prospect Park Borough","Quakertown Borough","Radnor Township","Red Hill Borough","Richland Township","Richlandtown Borough","Ridley Park Borough","Ridley Township","Riegelsville Borough","Riverside Township","Riverton Borough","Robbinsville Township","Rockledge Borough","Rose Valley Borough","Royersford Borough","Runnemede Borough","Rutledge Borough","Sadsbury Township","Salford Township","Schuylkill Township","Schwenksville Borough","Sellersville Borough","Shamong Township","Sharon Hill Borough","Silverdale Borough","Skippack Township","Solebury Township","Somerdale Borough","Souderton Borough","South Coatesville Borough","South Coventry Township","South Harrison Township","Southampton Township","Spring City Borough","Springfield Township","Stratford Borough","Swarthmore Borough","Swedesboro Borough","Tabernacle Township","Tavistock Borough","Telford Borough","Thornbury Township","Tinicum Township","Towamencin Township","Trainer Borough","Trappe Borough","Tredyffrin Township","Trenton City","Trumbauersville Borough","Tullytown Borough","Upland Borough","Upper Chichester Township","Upper Darby Township","Upper Dublin Township","Upper Frederick Township","Upper Gwynedd Township","Upper Hanover Township","Upper Makefield Township","Upper Merion Township","Upper Moreland Township","Upper Oxford Township","Upper Pottsgrove Township","Upper Providence Township","Upper Salford Township","Upper Southampton Township","Upper Uwchlan Township","Uwchlan Township","Valley Township","Voorhees Township","Wallace Township","Warminster Township","Warrington Township","Warwick Township","Washington Township","Waterford Township","Wenonah Borough","West Bradford Township","West Brandywine Township","West Caln Township","West Chester Borough","West Conshohocken Borough","West Deptford Township","West Fallowfield Township","West Goshen Township","West Grove Borough","West Marlborough Township","West Nantmeal Township","West Norriton Township","West Nottingham Township","West Pikeland Township","West Pottsgrove Township","West Rockhill Township","West Sadsbury Township","West Vincent Township","West Whiteland Township","West Windsor Township","Westampton Township","Westtown Township","Westville Borough","Whitemarsh Township","Whitpain Township","Willingboro Township","Willistown Township","Winslow Township","Woodbury City","Woodbury Heights Borough","Woodland Township","Woodlynne Borough","Woolwich Township","Worcester Township","Wrightstown Borough","Wrightstown Township" ,"Yardley Borough","Yeadon Borough"]
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