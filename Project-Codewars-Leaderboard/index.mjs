// This is a placeholder file to show how you can "mock" fetch requests using
// the nock library.
// You can delete the contents of the file once you have understood how it
// works.

async function getUserInfo(username) {
	try {
		const url = await fetch(`https://www.codewars.com/api/v1/users/${username}`);
		if(!url.ok)	return null;	
		return await url.json();
	} catch (error){
		return null;
	}
}

async function setup () {
	const submitUsersBtn		=	document.getElementById("submitUsers");
	const usersInput			=	document.getElementById("usersInput");
	const languagesDropDownEl	=	document.getElementById("languagesDropDown");
	const loadingTextEl			=	document.getElementById("loadingText");

	let allUsersFetchedData = [];
	
	submitUsersBtn.addEventListener("click", async (e)=> {
		e.preventDefault();
		loadingTextEl.innerHTML = "Loading ...";
		const allUsersInArray	=	usersInput.value;
		
		renderTable();
		allUsersFetchedData = await fetchAllUsersData(allUsersInArray);
		fillLanguagesDropDown(allUsersFetchedData);
		displayUsers(allUsersFetchedData, "overall");
		loadingTextEl.innerHTML = "";
	});

	languagesDropDownEl.addEventListener("change", async () => {
		loadingTextEl.innerHTML = "Loading ...";
		const allUsersInArray		=	usersInput.value;
		renderTable();
		displayUsers(allUsersFetchedData, languagesDropDownEl.value);
		loadingTextEl.innerHTML = "";
	});
}

async function fetchAllUsersData (listOfUsernames) {
	const allUsersInArray = listOfUsernames.split(",");
	let allUsersFetchedData = [];

	for(const username of allUsersInArray) {
		const userData = await getUserInfo(username);

		if ( !userData) continue;
	
		allUsersFetchedData.push(userData);
	}
	
	return allUsersFetchedData;
}

async function fillLanguagesDropDown(allUsersDataInArray) {
	const languagesDropDownEl = document.getElementById("languagesDropDown");
	let languagesOfAllUsers = [];

	allUsersDataInArray.forEach((userData) =>  {

		const langs = Object.keys(userData.ranks.languages);

		langs.forEach( (lang) => {
			languagesOfAllUsers.push(lang);
		});
	});

	languagesOfAllUsers = new Set(languagesOfAllUsers);

	languagesDropDownEl.disabled = false;
	languagesDropDownEl.innerHTML = `<option value="overall">Overall</option>`;
	languagesOfAllUsers.forEach( (lang) => {
		languagesDropDownEl.innerHTML += `<option value="${lang}">${lang}</option>`;
	});
	
}

function renderTable() {
	const usersTableBodyEl = document.getElementById("usersTableBody");

	usersTableBodyEl.innerHTML = "";
}

async function displayUsers (allUsersInArray, selectedLanguage) {
	const usersTableBody = document.getElementById("usersTableBody");
	let contentArray = [];

	allUsersInArray.forEach((userData) => {
		const langScore = selectedLanguage === "overall"
			? userData.ranks.overall?.score ?? 0 
			: userData.ranks.languages[selectedLanguage]?.score ?? 0;

		const userClan = userData.clan == null ? "" : userData.clan;

		if(langScore !== 0)
		{
			contentArray.push({
			username: userData.username,
			clan: userClan,
			score: langScore
			});
		}
	});

	contentArray.sort((a, b) => b.score - a.score);

	contentArray.forEach ( (userData, i) => {

		let bgColor = "#333";
		let color	= "white";
		if(i == 0) {
			bgColor = "gold";
			color	= "black";
		}

		usersTableBody.innerHTML += `<tr style="background-color:${bgColor}; color:${color};">
			<td>${userData.username}</td>
			<td>${userData.clan}</td>
			<td>${userData.score}</td>
			</tr>`;
	});
}

window.onload = setup;
