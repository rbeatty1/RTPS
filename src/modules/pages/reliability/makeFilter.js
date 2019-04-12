// create datalists for typeahead functionality on the sept and njtransit input boxes
const populateDatalist = (datalist, name, filterRef) => {
    const optionFragment = document.createDocumentFragment()

    filterRef[name].forEach(el => {
        const option = document.createElement('option')
        option.value = el
        optionFragment.appendChild(option)
    })

    datalist.appendChild(optionFragment)
}

const makeFilter = element => {
// create the elements
    const filterWrapper = document.createElement('div')
    const septaWrapper = document.createElement('div')
    const njWrapper = document.createElement('div')

    const septaRoutes = document.createElement('datalist')
    const njRoutes = document.createElement('datalist')

    const septaLabel = document.createElement('label')
    const njLabel = document.createElement('label')

    const septaInput = document.createElement('input')
    const njInput = document.createElement('input')

    const addSeptaFilter = document.createElement('button')
    const addNjFilter = document.createElement('button')

    // add classes
    filterWrapper.classList.add('reliability__sidebar-control')
    filterWrapper.classList.add('reliability__route-filter-wrapper')
    septaWrapper.classList.add('reliability__route-filter-input-wrapper')
    njWrapper.classList.add('reliability__route-filter-input-wrapper')
    septaLabel.classList.add('reliability__filter-label')
    njLabel.classList.add('reliability__filter-label')
    septaInput.classList.add('reliability__filter-input')
    njInput.classList.add('reliability__filter-input')
    addSeptaFilter.classList.add('reliability__filter-btn')
    addNjFilter.classList.add('reliability__filter-btn')

    septaRoutes.id = 'septa-routes'
    njRoutes.id ='nj-routes'

    septaInput.type = 'text'
    septaInput.setAttribute('list', 'septa-routes')
    njInput.type = 'text'
    njInput.setAttribute('list', 'nj-routes')

    // add text
    septaLabel.textContent = 'Septa routes: '
    njLabel.textContent = 'NJ Transit routes: '
    addSeptaFilter.textContent = 'add'
    addNjFilter.textContent = 'add'

    // add to wrappers
    septaWrapper.appendChild(septaLabel)
    septaWrapper.appendChild(septaInput)
    septaWrapper.appendChild(septaRoutes)
    septaWrapper.appendChild(addSeptaFilter)
    njWrapper.appendChild(njLabel)
    njWrapper.appendChild(njInput)
    njWrapper.appendChild(njRoutes)
    njWrapper.appendChild(addNjFilter)

    filterWrapper.appendChild(septaWrapper)
    filterWrapper.appendChild(njWrapper)

    element.appendChild(filterWrapper)

    // return elements that need additional functionality
    const septaFilter = { septaRoutes, addSeptaFilter, septaInput }
    const njFilter = { njRoutes, addNjFilter, njInput }

    return [septaFilter, njFilter]
}

export { makeFilter, populateDatalist }