// Fetch to NYC Open Data
const testingLocationsUrl = "https://data.cityofnewyork.us/resource/72ss-25qh.json"
fetch(testingLocationsUrl)
	.then(response => response.json())
	.then(locationArr => {
		const siteTable = document.querySelector("#site-table tbody")
		locationArr.map( locationObj => {
			let newLoactionTr =createLocationTr(locationObj)
			siteTable.append(newLoactionTr)
		})
	})

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
