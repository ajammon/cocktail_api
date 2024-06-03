const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const parseJwt = require("../libraries/utils/decodeToken");

router.get("/", async (req, res) => {
  try {
    const cocktailSnapshot = await admin
      .firestore()
      .collection("cocktail")
      .get();
    const cocktails = [];
    cocktailSnapshot.forEach((doc) => {
      cocktails.push(doc.data());
    });
    console.log(cocktails, "logging cocktails");
    res.json(cocktails);
  } catch (error) {
    console.error("Error fetching cocktails:", error);
    res.status(500).json({ error: "Error fetching cocktails" });
  }
});

router.get("/cocktailByName", async (req, res) => {
  try {
    const accessToken = req.headers.authorization;
    const idToken = accessToken.split("Bearer ")[1];
    const parsedToken = parseJwt(idToken);
    console.log(parsedToken, "logging parsed token");

    const cocktailCollection = admin.firestore().collection("cocktail");

    const querySnapshotCocktail = await cocktailCollection
      .where("name", "==", parsedToken.user_id)
      .get();

    if (querySnapshotCocktail.empty) {
      return res.status(404).json({ error: "Cocktail not found for the user" });
    }
    res.json(response);
  } catch (error) {
    console.error("Error retrieving cocktail by name:", error);
    res.status(500).json({ error: "Error retrieving cocktail" });
  }
});

module.exports = router;
