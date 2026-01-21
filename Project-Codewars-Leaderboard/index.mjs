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
		renderTable();
		const allUsersInArray = usersInput.value.split(",");
		for(const username of allUsersInArray) {
			await displayUser(username);
		}
	});


	console.log("hello");
}

function renderTable() {
	const usersTableEl = document.getElementById("usersTable");

	usersTableEl.innerHTML = `<tr style="background-color:#ccc; color:black;">
	<td>UserName</td>
	<td>Name</td>
	<td>Score</td>
	</tr>`;
}

async function displayUser (username) {
	const usersTableEl = document.getElementById("usersTable");

	const getDefUser = await getUserInfo(username);

	usersTableEl.innerHTML += `<tr style="background-color:#333; color:white;">
	<td>${getDefUser.username}</td>
	<td>${getDefUser.name}</td>
	<td>${getDefUser.ranks.overall.score}</td>
	</tr>`;
}

window.onload = setup;