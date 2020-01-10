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
    const septaFragment = document.createDocumentFragment()
    const njFragment = document.createDocumentFragment()

    const filterWrapper = document.createElement('div')
    const septaWrapper = document.createElement('div')
    const njWrapper = document.createElement('div')
    const selectedSeptaFilters = document.createElement('div')
    const selectedNJFilters = document.createElement('div')

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
    selectedSeptaFilters.classList.add('reliability__selected-filters-wrapper')
    selectedNJFilters.classList.add('reliability__selected-filters-wrapper')
    septaLabel.classList.add('reliability__filter-label')
    njLabel.classList.add('reliability__filter-label')
    septaInput.classList.add('reliability__filter-input')
    njInput.classList.add('reliability__filter-input')
    addSeptaFilter.classList.add('reliability__filter-btn')
    addNjFilter.classList.add('reliability__filter-btn')

    selectedSeptaFilters.id = 'septa-filter-wrapper'
    selectedNJFilters.id = 'njtransit-filter-wrapper'
    septaRoutes.id = 'septa-routes'
    njRoutes.id ='nj-routes'

    septaInput.type = 'text'
    septaInput.setAttribute('list', 'septa-routes')
    njInput.type = 'text'
    njInput.setAttribute('list', 'nj-routes')

    // add text
    septaLabel.textContent = 'SEPTA Routes: '
    njLabel.textContent = 'NJ TRANSIT Routes: '
    addSeptaFilter.textContent = 'add'
    addNjFilter.textContent = 'add'

    // add to wrappers
    septaFragment.appendChild(septaLabel)
    septaFragment.appendChild(septaInput)
    septaFragment.appendChild(septaRoutes)
    septaFragment.appendChild(addSeptaFilter)
    septaWrapper.appendChild(septaFragment)

    njFragment.appendChild(njLabel)
    njFragment.appendChild(njInput)
    njFragment.appendChild(njRoutes)
    njFragment.appendChild(addNjFilter)
    njWrapper.appendChild(njFragment)

    filterWrapper.appendChild(septaWrapper)
    filterWrapper.appendChild(selectedSeptaFilters)
    filterWrapper.appendChild(njWrapper)
    filterWrapper.appendChild(selectedNJFilters)

    element.appendChild(filterWrapper)

    // return elements that need additional functionality
    const septaFilter = { septaRoutes, addSeptaFilter, septaInput }
    const njFilter = { njRoutes, addNjFilter, njInput }

    return [septaFilter, njFilter]
}

export { makeFilter, populateDatalist }