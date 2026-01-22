// This is a placeholder file to show how you can "mock" fetch requests using
// the nock library.
// You can delete the contents of the file once you have understood how it
// works.

async function getUserInfo(username) {
  const url = await fetch(`https://www.codewars.com/api/v1/users/${username}`);
  return await url.json();
}

async function setup () {
	const submitUsersBtn		=	document.getElementById("submitUsers");
	const usersInput			=	document.getElementById("usersInput");
	const languagesDropDownEl	=	document.getElementById("languagesDropDown");
	const loadingTextEl			=	document.getElementById("loadingText");
	
	submitUsersBtn.addEventListener("click", async (e)=> {
		e.preventDefault();
		loadingTextEl.innerHTML = "Loading ...";
		const allUsersInArray		=	usersInput.value.split(",");
		renderTable();
		await fillLanguagesDropDown(allUsersInArray);
		await displayUsers(allUsersInArray, "javascript");
		loadingTextEl.innerHTML = "";
	});

	languagesDropDownEl.addEventListener("change", async () => {
		loadingTextEl.innerHTML = "Loading ...";
		const allUsersInArray		=	usersInput.value.split(",");
		renderTable();
		await displayUsers(allUsersInArray, languagesDropDownEl.value);
		loadingTextEl.innerHTML = "";
	})
}
async function fillLanguagesDropDown(allUsersInArray) {
	const languagesDropDownEl = document.getElementById("languagesDropDown");
	let languagesOfAllUsers = [];

	for(const username of allUsersInArray) {
		const userData = await getUserInfo(username);
		const langs = Object.keys(userData.ranks.languages);

		langs.forEach( (lang) => {
			languagesOfAllUsers.push(lang);
		});
	};
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

	for(const username of allUsersInArray) {
		const userData = await getUserInfo(username);
		console.log(`ddd${userData}`);
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
	}

	contentArray.sort((a, b) => b.score - a.score);

	contentArray.forEach ( (userData) => {
		usersTableBody.innerHTML += `<tr style="background-color:#333; color:white;">
			<td>${userData.username}</td>
			<td>${userData.clan}</td>
			<td>${userData.score}</td>
			</tr>`;
	});
}

window.onload = setup;
