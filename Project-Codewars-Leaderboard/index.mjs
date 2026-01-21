// This is a placeholder file to show how you can "mock" fetch requests using
// the nock library.
// You can delete the contents of the file once you have understood how it
// works.

async function getUserInfo(username) {
  const url = await fetch(`https://www.codewars.com/api/v1/users/${username}`);
  return await url.json();
}

async function setup () {
	const submitUsersBtn=document.getElementById("submitUsers");
	const usersInput    =document.getElementById("usersInput");
	
	submitUsersBtn.addEventListener("click", async (e)=> {
		e.preventDefault();
		const allUsersInArray = usersInput.value.split(",");
		
		renderTable();
		await fillLanguagesDropDown(allUsersInArray);
		await displayUsers(allUsersInArray);
	});
}
async function fillLanguagesDropDown(allUsersInArray) {
	const languagesDropDownEl = document.getElementById("languagesDropDown");

	for(const username of allUsersInArray) {
		const userData = await getUserInfo(username);
		console.log(userData.ranks.languages);
	}
	
}

function renderTable() {
	const usersTableEl = document.getElementById("usersTable");

	usersTableEl.innerHTML = `<tr style="background-color:#ccc; color:black;">
	<td>UserName</td>
	<td>Name</td>
	<td>Score</td>
	</tr>`;
}

async function displayUsers (allUsersInArray) {
	const usersTableEl = document.getElementById("usersTable");

	for(const username of allUsersInArray) {
		const userData = await getUserInfo(username);

		usersTableEl.innerHTML += `<tr style="background-color:#333; color:white;">
		<td>${userData.username}</td>
		<td>${userData.name}</td>
		<td>${userData.ranks.overall.score}</td>
		</tr>`;
	}
}

window.onload = setup;