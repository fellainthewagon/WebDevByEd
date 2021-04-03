console.log("start");

/* const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("got the user");
    //resolve({ user: "ali" });
    reject(new Error("no result"));
  }, 2000);
});

promise
  .then((user) => {
    console.log(user);
  })
  .catch((err) => console.log(err)); */

// ------------------  -  -  -  -  promises

function loginUser(email, pass) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("waiting...");
      const person = { email: email };
      resolve(person);
    }, 2000);
  });
}

function getUserVideos(email) {
  return new Promise((resolve, reject) => {
    console.log(`got email: ${email}`);
    setTimeout(() => {
      const videos = ["predator", "rembo", "terminator"];
      resolve(videos);
    }, 2000);
  });
}

function videoDetails(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data[2]);
    }, 2000);
  });
}

/* loginUser("mia@mail.ru")
  .then((user) => getUserVideos(user.email))
  .then((videos) => videoDetails(videos))
  .then((film) => console.log(film));
 */

async function displayUser() {
  try {
    const loggedUser = await loginUser("mia@mail.ru");
    const videosAll = await getUserVideos(loggedUser.email);
    const filmName = await videoDetails(videosAll);
    console.log(filmName);
  } catch (err) {
    console.log("Error");
  }
}

displayUser();

console.log("finish");
