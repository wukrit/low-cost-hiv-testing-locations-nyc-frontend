// Fetch to NYC Open Data
const testingLocationsUrl = "https://data.cityofnewyork.us/resource/72ss-25qh.json"

// Initial Fetch
fetch(testingLocationsUrl)
	.then(response => response.json())
	.then(locationArr => {
		const siteTable = document.querySelector("#site-table tbody")
		locationArr.map( locationObj => {
			let newLoactionTr =createLocationTr(locationObj)
			siteTable.append(newLoactionTr)
		})
	})

// Specific Fetch
const fetchLocation = siteId => {
	return obj = fetch(`${testingLocationsUrl}?site_id=${siteId}`)
		.then(response => response.json())
		.then(locationArr => locationArr[0])
}

// DOM Helper Methods
const propertyIsDefined = (obj, property) => {
	if (typeof obj[property] === "undefined") {
		return "N/A"
	} else {
		return obj[property]
	}
}

const createLocationTr = locationObj => {
	const locationTr = document.createElement("tr")
	const siteName = document.createElement("td")
	const sitePhoneNumber = document.createElement("td")
	const siteAddress1 = document.createElement("td")
	const siteAddress2 = document.createElement("td")
	const siteZip = document.createElement("td")
	const borough = document.createElement("td")
	const free = document.createElement("td")

	locationTr.id = `testing-location-id-${locationObj.site_id}`
	locationTr.addEventListener("click", handleTrClick)


	siteName.classList.add("site-name")
	sitePhoneNumber.classList.add("site-phone")
	siteAddress1.classList.add("site-address")
	siteAddress2.classList.add("site-address")
	siteZip.classList.add("site-address")
	borough.classList.add("site-address")
	free.classList.add("site-free")

	siteName.innerText = propertyIsDefined(locationObj, "site_name")
	sitePhoneNumber.innerText = propertyIsDefined(locationObj, "phone_number")
	siteAddress1.innerText = propertyIsDefined(locationObj, "address")
	siteAddress2.innerText = propertyIsDefined(locationObj, "building_floor_suite")
	siteZip.innerText = propertyIsDefined(locationObj, "zip_code")
	borough.innerText = propertyIsDefined(locationObj, "borough")
	free.innerText = propertyIsDefined(locationObj, "free")

	locationTr.append(siteName, sitePhoneNumber, free, siteAddress1,  siteAddress2, siteZip, borough)
	return locationTr
}


const handleTrClick = (e) => {
	let locationId = ""
	if (e.target.tagName !== "TR" ) {
		locationId = e.target.parentElement.id.substr(20)
		console.log(locationId);
	} else {
		locationId = e.target.id.substr(20)
		console.log(locationId);
	}

	const promise = fetchLocation(locationId)
	createLocationModal(promise)
}

const createLocationModal = (promise) => {
	const locationModal = document.createElement("div")
	locationModal.classList.add("modal")
	const modalContent = document.createElement("div")
	modalContent.classList.add("modal-content")

	const siteName = document.createElement("h2")
	const sitePhoneNumber = document.createElement("p")
	const siteAddress1 = document.createElement("p")
	const siteAddress2 = document.createElement("p")
	const siteZip = document.createElement("p")
	const borough = document.createElement("p")
	const free = document.createElement("p")

	promise.then(locationObj => {
		siteName.innerText = propertyIsDefined(locationObj, "site_name")
		sitePhoneNumber.innerText = `Phone Number: ${propertyIsDefined(locationObj, "phone_number")}`
		siteAddress1.innerText = `Address: ${propertyIsDefined(locationObj, "address")}`
		siteAddress2.innerText = `Building/Office: ${propertyIsDefined(locationObj, "building_floor_suite")}`
		siteZip.innerText = `Zip Code: ${propertyIsDefined(locationObj, "zip_code")}`
		borough.innerText = `Borough: ${propertyIsDefined(locationObj, "borough")}`
		free.innerText = `Free Testing Offered: ${propertyIsDefined(locationObj, "free")}`

		modalContent.append(siteName, sitePhoneNumber, free, siteAddress1,  siteAddress2, siteZip, borough)
		locationModal.append(modalContent)

		document.body.append(locationModal)
		window.addEventListener("click", (event) => {
		  if (event.target === locationModal) {
		    locationModal.remove()
		  }
		})
	})
}
