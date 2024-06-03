const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const parseJwt = require("../libraries/utils/decodeToken");

// Define person routes
router.get("/", async (req, res) => {
  try {
    const personSnapshot = await admin.firestore().collection("person").get();
    const persons = [];
    personSnapshot.forEach((doc) => {
      persons.push(doc.data());
    });
    res.json(persons);
  } catch (error) {
    console.error("Error fetching persons:", error);
    res.status(500).json({ error: "Error fetching persons" });
  }
});

router.get("/person", async (req, res) => {
  try {
    const accessToken = req.headers.authorization;
    const idToken = accessToken.split("Bearer ")[1];
    const parsedToken = parseJwt(idToken);

    const personCollection = admin.firestore().collection("person");

    const querySnapshotPerson = await personCollection
      .where("user_id", "==", parsedToken.user_id)
      .get();

    if (querySnapshotPerson.empty) {
      return res.status(404).json({ error: "Person not found for the user" });
    }

    const person = querySnapshotPerson.docs[0].data();

    const response = {
      personType: person.person_type,
      firstName: person.first_name,
      lastName: person.last_name,
    };

    console.log(response, "logging person back");
    res.json(response);
  } catch (error) {
    console.error("Error retrieving person:", error);
    res.status(500).json({ error: "Error retrieving person" });
  }
});

router.post("/insertPerson", async (req, res) => {
  try {
    const accessToken = req.headers.authorization;
    const idToken = accessToken.split("Bearer ")[1];
    const parsedToken = parseJwt(idToken);
    const userId = parsedToken.user_id;

    const jsonBody = JSON.parse(req.body);

    const personBody = {
      first_name: jsonBody.firstName,
      last_name: jsonBody.lastName,
      person_type: jsonBody.personType,
      user_id: userId,
    };

    const personCollection = admin.firestore().collection("person");
    const newPersonRef = await personCollection.add(personBody);

    res
      .status(201)
      .json({ id: newPersonRef, message: "Person created successfully" });
  } catch (error) {
    console.error("Error creating person:", error);
    res.status(500).json({ error: "Error creating person" });
  }
});

module.exports = router;
