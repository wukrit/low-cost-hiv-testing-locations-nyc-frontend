// Fetch to NYC Open Data
const testingLocationsUrl = "https://data.cityofnewyork.us/resource/72ss-25qh.json"
const thumbsUrl = "http://localhost:3000/thumbs"

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

// Specific Fetches
const fetchLocation = siteId => {
	return obj = fetch(`${testingLocationsUrl}?site_id=${siteId}`)
		.then(response => response.json())
		.then(locationArr => locationArr[0])
}

const getThumbs = siteId => {
	return fetch(thumbsUrl)
		.then(response => response.json())
		.then(thumbArr => thumbArr.filter(site => site.site_id == siteId))		
		.then(siteThumbArr => {
			const up = siteThumbArr.filter(thumb => thumb.up === true).length
			const down = siteThumbArr.filter(thumb => thumb.up === false).length
			const thumbObj = {up: up, down: down}
			return thumbObj
		})

}

// Event Handlers
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

const handleThumb = () => {
	const location = document.querySelector(".modal-site-name")
	const site_id = location.id.substr(12)
	if (event.target.classList.contains("thumbs-up") && !(event.target.classList.contains("filled")) && event.target.tagName === "path") {
		fetch(thumbsUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json"
			},
			body: JSON.stringify({site_id: site_id, up: true})
		})
		event.target.classList.add("filled")
		const count = event.target.parentElement.nextElementSibling
		const countFloat = parseFloat(count.innerText) + 1
		count.innerText = countFloat
	} else if (event.target.classList.contains("thumbs-down") && !(event.target.classList.contains("filled")) && event.target.tagName === "path") {
		event.target.classList.add("filled")
		fetch(thumbsUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json"
			},
			body: JSON.stringify({site_id: site_id, up: false})
		})
		const count = event.target.parentElement.nextElementSibling
		const countFloat = parseFloat(count.innerText) + 1
		count.innerText = countFloat
	} else if (event.target.classList.contains("star") && !(event.target.classList.contains("filled")) && event.target.tagName === "polygon") {
		event.target.classList.add("filled")
		const count = event.target.parentElement.nextElementSibling
		const countFloat = parseFloat(count.innerText) + 1
		count.innerText = countFloat
	}
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

const createLocationModal = (promise) => {
	const locationModal = document.createElement("div")
	locationModal.classList.add("modal")
	const modalContent = document.createElement("div")
	modalContent.classList.add("modal-content")
	const modalUpper = document.createElement("div")
	modalUpper.classList.add("modal-upper")
	const modalText = document.createElement("div")
	modalText.classList.add("modal-text")
	const modalMap = document.createElement("div")
	modalMap.classList.add("modal-map")

	const siteName = document.createElement("h2")
	siteName.classList.add("modal-site-name")
	const sitePhoneNumber = document.createElement("p")
	const siteAddress1 = document.createElement("p")
	const siteAddress2 = document.createElement("p")
	const siteZip = document.createElement("p")
	const borough = document.createElement("p")
	const free = document.createElement("p")

	promise.then(locationObj => {
		siteName.id = `location-id-${locationObj.site_id}`
		siteName.innerText = propertyIsDefined(locationObj, "site_name")
		sitePhoneNumber.innerText = `Phone Number: ${propertyIsDefined(locationObj, "phone_number")}`
		siteAddress1.innerText = `Address: ${propertyIsDefined(locationObj, "address")}`
		siteAddress2.innerText = `Building/Office: ${propertyIsDefined(locationObj, "building_floor_suite")}`
		siteZip.innerText = `Zip Code: ${propertyIsDefined(locationObj, "zip_code")}`
		borough.innerText = `Borough: ${propertyIsDefined(locationObj, "borough")}`
		free.innerText = `Free Testing Offered: ${propertyIsDefined(locationObj, "free")}`


		modalMap.innerHTML = `<iframe
		  width="100%"
		  height="400"
		  frameborder="0" style="border:0"
		  src="https://www.google.com/maps/embed/v1/place?key=${gApiKey}&q=${locationObj.site_name.replace(" ", "+")}" allowfullscreen>
		</iframe>`

		const reviewSection = createReviewSection(locationObj.site_id)

		modalText.append(siteName, sitePhoneNumber, free, siteAddress1,  siteAddress2, siteZip, borough)
		modalUpper.append(modalText, modalMap)
		modalContent.append(modalUpper, reviewSection)
		locationModal.append(modalContent)

		locationModal.addEventListener("click", handleThumb)

		document.body.append(locationModal)
		window.addEventListener("click", (event) => {
		  if (event.target === locationModal) {
		    locationModal.remove()
		  }
		})
	})
}

const createReviewSection = siteId => {
	const reviewSection = document.createElement("div")
	reviewSection.classList.add("reviews")

	const star = document.createElement("span")
	star.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="star"><polygon class="star" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
	const thumbsUp = document.createElement("span")
	thumbsUp.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="thumbs-up"><path class="thumbs-up" d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`
	const thumbsDown = document.createElement("span")
	thumbsDown.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="thumbs-down"><path class="thumbs-down" d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>`


	const reviewHeader = document.createElement("h3")
	reviewHeader.innerText = "Reviews"

	const thumbPromise = getThumbs(siteId)
	thumbPromise.then(thumbObj => {
		thumbsUp.innerHTML += `<span class="thumb-count">${thumbObj.up}</span>`
		thumbsDown.innerHTML += `<span class="thumb-count">${thumbObj.down}</span>`
	})

	star.innerHTML += `<span class="thumb-count">0</span>`

	reviewSection.append(reviewHeader, star, thumbsUp, thumbsDown)
	return reviewSection
}