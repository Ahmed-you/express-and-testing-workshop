const request = require("supertest");

const app = require("../app");
const { promises } = require("supertest/lib/test");

//test1
test("the rout /facsters should return an array", async () => {
  const res = await request(app).get("/facsters").expect(200);
  expect(res.body).toBeInstanceOf(Array);
  expect(res.body.length).toBeGreaterThan(0);
});

//test2
test(" Abdullah should be the first user", async () => {
  const res = await request(app).get("/facsters").expect(200);
  expect(res.body[0].firstname).toBe("Abdullah");
});

//test3
test(` all elements must be like this structure:
{
 id: (type of number),
 firstname: '(type of string)',
  surname: '(type of string)', 
  cohort:(type of number)
  }
  `, async () => {
  const res = await request(app).get("/facsters").expect(200);

  res.body.forEach((user) => {
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("firstname");
    expect(user).toHaveProperty("surname");
    expect(user).toHaveProperty("cohort");
    // Ensures all users have cohort 11
    expect(user.cohort).toBe(11);

    expect(typeof user.id).toBe("number");
    expect(typeof user.firstname).toBe("string");
    expect(typeof user.surname).toBe("string");
    expect(typeof user.cohort).toBe("number");
  });
});

test("should be able to get the facester by their name ", async () => {
  const names = ["Abdullah", "Amelie", "Aseel", "Alina", "Bart", "Yahia"];

  const requests = names.map((name) =>
    request(app).get(`/facsters/${name}`).expect(200)
  );
  const responses = await Promise.all(requests);

  responses.forEach((res) => {
    expect(res.body).toHaveProperty("firstname", res.body.firstname);
  });
});

test("Should add a new facster", async () => {
  const facTwelver = { firstname: "jason", surname: "bourne", cohort: 11 };

  // Await the POST request response.
  const res = await request(app)
    .post("/facster/new")
    .send(facTwelver)
    .expect(201) // Expect HTTP status 201
    .expect("Content-Type", /json/); // Expect JSON content-type

  // Validate the response using Jest's expect
  expect(res.body.firstname).toBe("jason");
});

test("Should find a facster's hobbies", async () => {
  res = await request(app)
    .get("/facsters/bart/hobby")
    .expect(200)
    .expect("Content-Type", /json/);
  expect(res.body.hobby).toBe("Ninja training");
});

test("Should return a given facster's superpower", async () => {
  const res = await request(app)
    .get("/facsters/abdullah/superpower")
    .expect(200)
    .expect("Content-Type", /json/);

  // Assert that the superpower is as expected
  expect(res.body.superpower).toBe("linting wizard");
});

