const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const parseJwt = require("../libraries/utils/decodeToken");
const { StatusCodes } = require("http-status-codes");

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

router.get("/seed", async (req, res) => {
  // Guarding against seeding. But I want to keep this code around for future DB seeding with real data.
  return;
  try {
    // parse the newcocktails object.

    // Create new cocktail
    // If ingredient exists, use ID, otherwise create ingredient
    // same for other pieces. If exists, use Id. Otherwise create.

    const db = admin.firestore();
    const cocktailCollection = db.collection('cocktail');
    for (const cocktail of newCocktails.cocktails) {
      const querySnapshot = await cocktailCollection.where('name', '==', cocktail.name).get();

      if (!querySnapshot.empty) {
        console.error(`Error: Duplicate cocktail - ${cocktail.name}`);
        continue;
      }

      const newCocktail = {
        name: cocktail.name,
        description: cocktail.description,
        instructions: cocktail.instructions,
        ingredients: []
      };
      const glassTypeId = await findOrCreateGlassType(cocktail.glass_type);
      newCocktail.glassTypeId = db.doc(`glass_type/${glassTypeId}`);

      for (const ingredient of cocktail.ingredients) {
        const id = await findOrCreateIngredient(ingredient.name);
        const cocktailIngredient = { id: db.doc(`ingredient/${id}`) };

        if (ingredient.ingredient_size !== undefined) {
          cocktailIngredient.size = ingredient.ingredient_size;
        }

        if (ingredient.size_label) {
          cocktailIngredient.size_label = ingredient.size_label;
        }

        newCocktail.ingredients.push(cocktailIngredient);
      }

      await cocktailCollection.add(newCocktail);
      console.log(newCocktail);
    }

    return res.status(StatusCodes.OK);

  } catch (error) {
    console.error("Error retrieving cocktail by name:", error);
    res.status(500).json({ error: "Error retrieving cocktail" });
  }
});

async function findOrCreateGlassType(glassType) {
  const glassTypeCollection = admin.firestore().collection('glass_type');

  const querySnapshot = await glassTypeCollection.where('name', '==', glassType).get();

  if (querySnapshot.empty) {
    await glassTypeCollection.add({
      name: glassType
    });
    return;
  }

  if (querySnapshot.size > 1) {
    console.error('Error: Duplicate glass types.');
    return;
  }

  let id;
  querySnapshot.forEach(glassType => id = glassType.id);
  console.log(id);
  return id;
}

async function findOrCreateIngredient(ingredient) {
  const ingredientCollection = admin.firestore().collection('ingredient');

  const querySnapshot = await ingredientCollection.where('name', '==', ingredient).get();

  if (querySnapshot.empty) {
    await ingredientCollection.add({
      name: ingredient
    });
    return;
  }

  if (querySnapshot.size > 1) {
    console.error(`Error: Duplicate ingredient - ${ingredient}`);
  }

  let id;
  querySnapshot.forEach(ingredient => id = ingredient.id);
  return id;
}

module.exports = router;
