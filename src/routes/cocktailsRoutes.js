const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const parseJwt = require("../libraries/utils/decodeToken");
const { StatusCodes } = require("http-status-codes");

const newCocktails = {
  "cocktails": [
    {
      "name": "Margarita",
      "description": "A refreshing cocktail with a perfect balance of sweet, sour, salty, and bitter. Served in a salt-rimmed glass, it features a vibrant mix of tequila, lime juice, and orange liqueur. The aroma is bright and citrusy, with a hint of agave. Each sip is tangy and invigorating, with a smooth finish.",
      "glass_type": "Margarita",
      "ingredients": [
        {
          "name": "Tequila",
          "ingredient_size": "2",
          "size_label": "oz"
        },
        {
          "name": "Lime Juice",
          "ingredient_size": "1",
          "size_label": "oz"
        },
        {
          "name": "Orange Liqueur",
          "ingredient_size": "1/2",
          "size_label": "oz"
        },
        {
          "name": "Ice"
        },
        {
          "name": "Salt"
        }
      ],
      "instructions": [
        "Rub the rim of a margarita glass with a lime wedge and dip it in salt to coat.",
        "Fill a shaker with ice and add tequila, lime juice, and orange liqueur.",
        "Shake well for about 20 seconds until chilled.",
        "Strain into the prepared glass filled with ice.",
        "Garnish with a lime wheel."
      ]
    },
    {
      "name": "Old Fashioned",
      "description": "A timeless cocktail known for its simplicity and robust flavor. It combines whiskey, sugar, and bitters, served over a large ice cube in a rocks glass. The aroma is rich with hints of caramel and oak, while each sip offers a smooth blend of sweetness and a subtle bitter finish.",
      "glass_type": "Rocks",
      "ingredients": [
        {
          "name": "Whiskey",
          "ingredient_size": "2",
          "size_label": "oz"
        },
        {
          "name": "Sugar Cube"
        },
        {
          "name": "Angostura Bitters",
          "ingredient_size": "2",
          "size_label": "dashes"
        },
        {
          "name": "Orange Peel"
        },
        {
          "name": "Ice"
        }
      ],
      "instructions": [
        "Place a sugar cube in a rocks glass and add bitters.",
        "Muddle the sugar and bitters until the sugar is dissolved.",
        "Add a large ice cube to the glass.",
        "Pour whiskey over the ice and stir gently.",
        "Twist the orange peel over the drink to release oils and drop it in as garnish."
      ]
    },
    {
      "name": "Mojito",
      "description": "A refreshing Cuban cocktail with a bright, minty profile. It features white rum, fresh lime juice, mint leaves, and soda water, served in a highball glass. The aroma is invigorating with mint and citrus notes. Each sip is cool, light, and revitalizing with a sweet, minty finish.",
      "glass_type": "Highball",
      "ingredients": [
        {
          "name": "White Rum",
          "ingredient_size": "2",
          "size_label": "oz"
        },
        {
          "name": "Lime Juice",
          "ingredient_size": "1",
          "size_label": "oz"
        },
        {
          "name": "Mint Leaves",
          "ingredient_size": "10",
          "size_label": "leaves"
        },
        {
          "name": "Sugar",
          "ingredient_size": "2",
          "size_label": "tsp"
        },
        {
          "name": "Soda Water"
        },
        {
          "name": "Ice"
        }
      ],
      "instructions": [
        "Muddle mint leaves and sugar in a highball glass.",
        "Add lime juice and rum.",
        "Fill the glass with ice.",
        "Top with soda water and stir gently.",
        "Garnish with a sprig of mint and a lime wheel."
      ]
    },
    {
      "name": "Negroni",
      "description": "An Italian aperitif with a perfect balance of bitterness and sweetness. It combines gin, Campari, and sweet vermouth, served over ice in a rocks glass. The aroma is complex with citrus and herbal notes. Each sip offers a bold, bittersweet flavor that is both refreshing and sophisticated.",
      "glass_type": "Rocks",
      "ingredients": [
        {
          "name": "Gin",
          "ingredient_size": "1",
          "size_label": "oz"
        },
        {
          "name": "Campari",
          "ingredient_size": "1",
          "size_label": "oz"
        },
        {
          "name": "Sweet Vermouth",
          "ingredient_size": "1",
          "size_label": "oz"
        },
        {
          "name": "Orange Peel"
        },
        {
          "name": "Ice"
        }
      ],
      "instructions": [
        "Fill a rocks glass with ice.",
        "Add gin, Campari, and sweet vermouth.",
        "Stir gently to combine.",
        "Twist the orange peel over the drink to release oils and drop it in as garnish."
      ]
    },
    {
      "name": "Cosmopolitan",
      "description": "A stylish and modern cocktail known for its vibrant pink color and tangy-sweet flavor. It combines vodka, triple sec, cranberry juice, and lime juice, served in a chilled martini glass. The aroma is fruity with citrus notes. Each sip is refreshing and tart, with a smooth finish.",
      "glass_type": "Martini",
      "ingredients": [
        {
          "name": "Vodka",
          "ingredient_size": "1 1/2",
          "size_label": "oz"
        },
        {
          "name": "Triple Sec",
          "ingredient_size": "1",
          "size_label": "oz"
        },
        {
          "name": "Cranberry Juice",
          "ingredient_size": "1/2",
          "size_label": "oz"
        },
        {
          "name": "Lime Juice",
          "ingredient_size": "1/2",
          "size_label": "oz"
        },
        {
          "name": "Ice"
        }
      ],
      "instructions": [
        "Fill a shaker with ice and add vodka, triple sec, cranberry juice, and lime juice.",
        "Shake well for about 20 seconds until chilled.",
        "Strain into a chilled martini glass.",
        "Garnish with a lime wheel or a twist of lime peel."
      ]
    },
    {
      "name": "Whiskey Sour",
      "description": "A classic cocktail with a perfect balance of whiskey, lemon juice, and sweetness. Served over ice in a rocks glass, it features a frothy top from the egg white. The aroma is bright and citrusy with a hint of whiskey. Each sip is smooth, tangy, and slightly sweet with a creamy finish.",
      "glass_type": "Rocks",
      "ingredients": [
        {
          "name": "Whiskey",
          "ingredient_size": "2",
          "size_label": "oz"
        },
        {
          "name": "Lemon Juice",
          "ingredient_size": "3/4",
          "size_label": "oz"
        },
        {
          "name": "Simple Syrup",
          "ingredient_size": "1/2",
          "size_label": "oz"
        },
        {
          "name": "Egg White"
        },
        {
          "name": "Ice"
        },
        {
          "name": "Cherry"
        }
      ],
      "instructions": [
        "Fill a shaker with ice and add whiskey, lemon juice, simple syrup, and egg white.",
        "Shake vigorously for about 20 seconds until frothy.",
        "Strain into a rocks glass filled with ice.",
        "Garnish with a cherry."
      ]
    },
    {
      "name": "Daiquiri",
      "description": "A simple and elegant cocktail with a perfect balance of rum, lime, and sugar. Served in a chilled coupe glass, it has a bright and refreshing flavor. The aroma is zesty with lime notes. Each sip is smooth, tangy, and slightly sweet, with a clean finish.",
      "glass_type": "Coupe",
      "ingredients": [
        {
          "name": "White Rum",
          "ingredient_size": "2",
          "size_label": "oz"
        },
        {
          "name": "Lime Juice",
          "ingredient_size": "1",
          "size_label": "oz"
        },
        {
          "name": "Simple Syrup",
          "ingredient_size": "1/2",
          "size_label": "oz"
        },
        {
          "name": "Ice"
        },
        {
          "name": "Lime Wheel"
        }
      ],
      "instructions": [
        "Fill a shaker with ice and add rum, lime juice, and simple syrup.",
        "Shake well for about 20 seconds until chilled.",
        "Strain into a chilled coupe glass.",
        "Garnish with a lime wheel."
      ]
    },
    {
      "name": "Mai Tai",
      "description": "A tropical cocktail with a complex flavor profile, combining multiple rums, lime juice, and orgeat syrup. Served over ice in a tiki glass, it has a rich, fruity aroma. Each sip is a delightful mix of sweetness, tartness, and a hint of nuttiness from the orgeat.",
      "glass_type": "Tiki",
      "ingredients": [
        {
          "name": "Light Rum",
          "ingredient_size": "1",
          "size_label": "oz"
        },
        {
          "name": "Dark Rum",
          "ingredient_size": "1",
          "size_label": "oz"
        },
        {
          "name": "Lime Juice",
          "ingredient_size": "1/2",
          "size_label": "oz"
        },
        {
          "name": "Orgeat Syrup",
          "ingredient_size": "1/2",
          "size_label": "oz"
        },
        {
          "name": "Triple Sec",
          "ingredient_size": "1/2",
          "size_label": "oz"
        },
        {
          "name": "Ice"
        },
        {
          "name": "Mint Sprig"
        }
      ],
      "instructions": [
        "Fill a shaker with ice and add light rum, lime juice, orgeat syrup, and triple sec.",
        "Shake well for about 20 seconds until chilled.",
        "Strain into a tiki glass filled with ice.",
        "Float the dark rum on top by pouring it over the back of a spoon.",
        "Garnish with a mint sprig."
      ]
    },
    {
      "name": "Pina Colada",
      "description": "A creamy and sweet tropical cocktail with a smooth blend of rum, coconut cream, and pineapple juice. Served in a hurricane glass, it is garnished with a pineapple wedge and cherry. The aroma is sweet and fruity with coconut notes. Each sip is rich, smooth, and indulgent.",
      "glass_type": "Hurricane",
      "ingredients": [
        {
          "name": "White Rum",
          "ingredient_size": "2",
          "size_label": "oz"
        },
        {
          "name": "Coconut Cream",
          "ingredient_size": "1 1/2",
          "size_label": "oz"
        },
        {
          "name": "Pineapple Juice",
          "ingredient_size": "1 1/2",
          "size_label": "oz"
        },
        {
          "name": "Ice"
        },
        {
          "name": "Pineapple Wedge"
        },
        {
          "name": "Cherry"
        }
      ],
      "instructions": [
        "Fill a blender with ice and add rum, coconut cream, and pineapple juice.",
        "Blend until smooth.",
        "Pour into a hurricane glass.",
        "Garnish with a pineapple wedge and a cherry."
      ]
    },
    {
      "name": "Mint Julep",
      "description": "A classic Southern cocktail with a refreshing and minty flavor. It combines bourbon, fresh mint, and sugar, served over crushed ice in a silver julep cup. The aroma is fragrant with mint and bourbon. Each sip is cool and invigorating, with a perfect balance of sweetness and bourbon.",
      "glass_type": "Julep",
      "ingredients": [
        {
          "name": "Bourbon",
          "ingredient_size": "2",
          "size_label": "oz"
        },
        {
          "name": "Mint Leaves",
          "ingredient_size": "10",
          "size_label": "leaves"
        },
        {
          "name": "Sugar",
          "ingredient_size": "1",
          "size_label": "tsp"
        },
        {
          "name": "Crushed Ice"
        },
        {
          "name": "Mint Sprig"
        }
      ],
      "instructions": [
        "Muddle mint leaves and sugar in a julep cup.",
        "Fill the cup with crushed ice.",
        "Pour bourbon over the ice and stir gently.",
        "Garnish with a sprig of mint."
      ]
    },
    {
      "name": "Tom Collins",
      "description": "A refreshing and effervescent cocktail with a perfect balance of gin, lemon juice, and sugar, topped with soda water. Served in a tall Collins glass, it has a bright and citrusy aroma. Each sip is light, fizzy, and refreshing, with a hint of sweetness.",
      "glass_type": "Collins",
      "ingredients": [
        {
          "name": "Gin",
          "ingredient_size": "2",
          "size_label": "oz"
        },
        {
          "name": "Lemon Juice",
          "ingredient_size": "1",
          "size_label": "oz"
        },
        {
          "name": "Simple Syrup",
          "ingredient_size": "1/2",
          "size_label": "oz"
        },
        {
          "name": "Soda Water"
        },
        {
          "name": "Ice"
        },
        {
          "name": "Lemon Wheel"
        }
      ],
      "instructions": [
        "Fill a shaker with ice and add gin, lemon juice, and simple syrup.",
        "Shake well for about 20 seconds until chilled.",
        "Strain into a Collins glass filled with ice.",
        "Top with soda water and stir gently.",
        "Garnish with a lemon wheel."
      ]
    },
    {
      "name": "Gimlet",
      "description": "A classic cocktail with a crisp and refreshing flavor, combining gin and lime cordial. Served in a chilled coupe glass, it has a bright, citrusy aroma. Each sip is smooth and tart with a hint of sweetness, offering a clean and invigorating finish.",
      "glass_type": "Coupe",
      "ingredients": [
        {
          "name": "Gin",
          "ingredient_size": "2",
          "size_label": "oz"
        },
        {
          "name": "Lime Cordial",
          "ingredient_size": "1",
          "size_label": "oz"
        },
        {
          "name": "Ice"
        },
        {
          "name": "Lime Wheel"
        }
      ],
      "instructions": [
        "Fill a shaker with ice and add gin and lime cordial.",
        "Shake well for about 20 seconds until chilled.",
        "Strain into a chilled coupe glass.",
        "Garnish with a lime wheel."
      ]
    },
    {
      "name": "French 75",
      "description": "A sophisticated and bubbly cocktail that combines gin, lemon juice, and champagne. Served in a champagne flute, it has a bright and citrusy aroma with hints of juniper. Each sip is light, fizzy, and refreshing, with a perfect balance of tartness and effervescence.",
      "glass_type": "Champagne Flute",
      "ingredients": [
        {
          "name": "Gin",
          "ingredient_size": "1",
          "size_label": "oz"
        },
        {
          "name": "Lemon Juice",
          "ingredient_size": "1/2",
          "size_label": "oz"
        },
        {
          "name": "Simple Syrup",
          "ingredient_size": "1/2",
          "size_label": "oz"
        },
        {
          "name": "Champagne"
        },
        {
          "name": "Lemon Twist"
        }
      ],
      "instructions": [
        "Fill a shaker with ice and add gin, lemon juice, and simple syrup.",
        "Shake well for about 20 seconds until chilled.",
        "Strain into a champagne flute.",
        "Top with champagne and stir gently.",
        "Garnish with a lemon twist."
      ]
    },
    {
      "name": "Paloma",
      "description": "A refreshing Mexican cocktail with a perfect balance of tequila, grapefruit soda, and lime juice. Served in a highball glass with a salted rim, it has a bright, citrusy aroma. Each sip is tangy, slightly sweet, and fizzy, offering a cool and invigorating finish.",
      "glass_type": "Highball",
      "ingredients": [
        {
          "name": "Tequila",
          "ingredient_size": "2",
          "size_label": "oz"
        },
        {
          "name": "Grapefruit Soda",
          "ingredient_size": "4",
          "size_label": "oz"
        },
        {
          "name": "Lime Juice",
          "ingredient_size": "1/2",
          "size_label": "oz"
        },
        {
          "name": "Salt"
        },
        {
          "name": "Ice"
        },
        {
          "name": "Lime Wheel"
        }
      ],
      "instructions": [
        "Rub the rim of a highball glass with a lime wedge and dip it in salt to coat.",
        "Fill the glass with ice.",
        "Add tequila and lime juice.",
        "Top with grapefruit soda and stir gently.",
        "Garnish with a lime wheel."
      ]
    },
    {
      "name": "Sidecar",
      "description": "A sophisticated cocktail with a perfect balance of cognac, orange liqueur, and lemon juice. Served in a chilled coupe glass with a sugared rim, it has a bright, citrusy aroma. Each sip is smooth and tangy with a hint of sweetness, offering a refined and elegant finish.",
      "glass_type": "Coupe",
      "ingredients": [
        {
          "name": "Cognac",
          "ingredient_size": "2",
          "size_label": "oz"
        },
        {
          "name": "Orange Liqueur",
          "ingredient_size": "3/4",
          "size_label": "oz"


        },
        {
          "name": "Lemon Juice",
          "ingredient_size": "3/4",
          "size_label": "oz"
        },
        {
          "name": "Sugar"
        },
        {
          "name": "Ice"
        },
        {
          "name": "Lemon Twist"
        }
      ],
      "instructions": [
        "Rub the rim of a coupe glass with a lemon wedge and dip it in sugar to coat.",
        "Fill a shaker with ice and add cognac, orange liqueur, and lemon juice.",
        "Shake well for about 20 seconds until chilled.",
        "Strain into the prepared coupe glass.",
        "Garnish with a lemon twist."
      ]
    },
    {
      "name": "Sazerac",
      "description": "A classic New Orleans cocktail with a robust and aromatic flavor. It combines rye whiskey, absinthe, and Peychaud's bitters, served in a chilled rocks glass. The aroma is rich with hints of anise and whiskey. Each sip is smooth and complex with a slightly bitter finish.",
      "glass_type": "Rocks",
      "ingredients": [
        {
          "name": "Rye Whiskey",
          "ingredient_size": "2",
          "size_label": "oz"
        },
        {
          "name": "Absinthe",
          "ingredient_size": "1/4",
          "size_label": "oz"
        },
        {
          "name": "Peychaud's Bitters",
          "ingredient_size": "3",
          "size_label": "dashes"
        },
        {
          "name": "Sugar Cube"
        },
        {
          "name": "Lemon Peel"
        },
        {
          "name": "Ice"
        }
      ],
      "instructions": [
        "Rinse a chilled rocks glass with absinthe and discard the excess.",
        "Muddle a sugar cube with bitters in a mixing glass.",
        "Add rye whiskey and ice, and stir until well chilled.",
        "Strain into the prepared rocks glass without ice.",
        "Twist the lemon peel over the drink to release oils and drop it in as garnish."
      ]
    },
    {
      "name": "Moscow Mule",
      "description": "A refreshing cocktail with a perfect balance of vodka, ginger beer, and lime juice. Served in a copper mug, it has a bright, spicy aroma. Each sip is fizzy and invigorating, with a tangy, zesty finish.",
      "glass_type": "Copper Mug",
      "ingredients": [
        {
          "name": "Vodka",
          "ingredient_size": "2",
          "size_label": "oz"
        },
        {
          "name": "Ginger Beer",
          "ingredient_size": "4",
          "size_label": "oz"
        },
        {
          "name": "Lime Juice",
          "ingredient_size": "1/2",
          "size_label": "oz"
        },
        {
          "name": "Ice"
        },
        {
          "name": "Lime Wedge"
        }
      ],
      "instructions": [
        "Fill a copper mug with ice.",
        "Add vodka and lime juice.",
        "Top with ginger beer and stir gently.",
        "Garnish with a lime wedge."
      ]
    },
    {
      "name": "Bloody Mary",
      "description": "A savory and spicy cocktail perfect for brunch. It combines vodka, tomato juice, and various seasonings, served in a highball glass. The aroma is rich with tomato and spices. Each sip is flavorful and tangy with a spicy finish.",
      "glass_type": "Highball",
      "ingredients": [
        {
          "name": "Vodka",
          "ingredient_size": "2",
          "size_label": "oz"
        },
        {
          "name": "Tomato Juice",
          "ingredient_size": "4",
          "size_label": "oz"
        },
        {
          "name": "Lemon Juice",
          "ingredient_size": "1/2",
          "size_label": "oz"
        },
        {
          "name": "Worcestershire Sauce",
          "ingredient_size": "2",
          "size_label": "dashes"
        },
        {
          "name": "Hot Sauce",
          "ingredient_size": "2",
          "size_label": "dashes"
        },
        {
          "name": "Celery Salt",
          "ingredient_size": "1",
          "size_label": "pinch"
        },
        {
          "name": "Black Pepper",
          "ingredient_size": "1",
          "size_label": "pinch"
        },
        {
          "name": "Celery Stick"
        },
        {
          "name": "Ice"
        }
      ],
      "instructions": [
        "Fill a shaker with ice and add vodka, tomato juice, lemon juice, Worcestershire sauce, hot sauce, celery salt, and black pepper.",
        "Roll the shaker back and forth to mix gently.",
        "Strain into a highball glass filled with ice.",
        "Garnish with a celery stick."
      ]
    },
    {
      "name": "Manhattan",
      "description": "A classic cocktail with a robust and sophisticated flavor, combining whiskey, sweet vermouth, and bitters. Served in a chilled martini glass, it has a rich, aromatic profile. Each sip is smooth and complex with a slightly sweet finish.",
      "glass_type": "Martini",
      "ingredients": [
        {
          "name": "Rye Whiskey",
          "ingredient_size": "2",
          "size_label": "oz"
        },
        {
          "name": "Sweet Vermouth",
          "ingredient_size": "1",
          "size_label": "oz"
        },
        {
          "name": "Angostura Bitters",
          "ingredient_size": "2",
          "size_label": "dashes"
        },
        {
          "name": "Cherry"
        },
        {
          "name": "Ice"
        }
      ],
      "instructions": [
        "Fill a mixing glass with ice and add whiskey, sweet vermouth, and bitters.",
        "Stir well for about 30 seconds until well chilled.",
        "Strain into a chilled martini glass.",
        "Garnish with a cherry."
      ]
    },
    {
      "name": "Aperol Spritz",
      "description": "A light and refreshing Italian aperitif with a perfect balance of Aperol, prosecco, and soda water. Served in a wine glass with ice, it has a bright, citrusy aroma. Each sip is fizzy and invigorating with a slightly bitter finish.",
      "glass_type": "Wine Glass",
      "ingredients": [
        {
          "name": "Aperol",
          "ingredient_size": "3",
          "size_label": "oz"
        },
        {
          "name": "Prosecco",
          "ingredient_size": "3",
          "size_label": "oz"
        },
        {
          "name": "Soda Water",
          "ingredient_size": "1",
          "size_label": "oz"
        },
        {
          "name": "Orange Slice"
        },
        {
          "name": "Ice"
        }
      ],
      "instructions": [
        "Fill a wine glass with ice.",
        "Add Aperol and prosecco.",
        "Top with soda water and stir gently.",
        "Garnish with an orange slice."
      ]
    },
    {
      "name": "Bellini",
      "description": "A delightful and fruity Italian cocktail with a perfect blend of prosecco and peach puree. Served in a champagne flute, it has a bright, fruity aroma. Each sip is light, fizzy, and refreshing with a sweet, peachy finish.",
      "glass_type": "Champagne Flute",
      "ingredients": [
        {
          "name": "Prosecco",
          "ingredient_size": "4",
          "size_label": "oz"
        },
        {
          "name": "Peach Puree",
          "ingredient_size": "2",
          "size_label": "oz"
        }
      ],
      "instructions": [
        "Pour peach puree into a champagne flute.",
        "Slowly top with prosecco and stir gently."
      ]
    },
    {
      "name": "Dark 'n' Stormy",
      "description": "A robust and spicy cocktail with a perfect balance of dark rum and ginger beer. Served in a highball glass with ice, it has a rich, spicy aroma. Each sip is bold and invigorating with a tangy, slightly sweet finish.",
      "glass_type": "Highball",
      "ingredients": [
        {
          "name": "Dark Rum",
          "ingredient_size": "2",
          "size_label": "oz"
        },
        {
          "name": "Ginger Beer",
          "ingredient_size": "4",
          "size_label": "oz"
        },
        {
          "name": "Lime Wedge"
        },
        {
          "name": "Ice"
        }
      ],
      "instructions": [
        "Fill a highball glass with ice.",
        "Add dark rum.",
        "Top with ginger beer and stir gently.",
        "Garnish with a lime wedge."
      ]
    },
    {
      "name": "Caipirinha",
      "description": "A Brazilian cocktail with a perfect balance of cachaça, lime, and sugar. Served over crushed ice in a rocks glass, it has a bright, citrusy aroma. Each sip is tangy and refreshing with a slightly sweet finish.",
      "glass_type": "Rocks",
      "ingredients": [
        {
          "name":

            "Cachaça",
          "ingredient_size": "2",
          "size_label": "oz"
        },
        {
          "name": "Lime",
          "ingredient_size": "1/2",
          "size_label": "unit"
        },
        {
          "name": "Sugar",
          "ingredient_size": "2",
          "size_label": "tsp"
        },
        {
          "name": "Crushed Ice"
        }
      ],
      "instructions": [
        "Cut half a lime into four wedges and muddle with sugar in a rocks glass.",
        "Fill the glass with crushed ice.",
        "Add cachaça and stir well."
      ]
    },
    {
      "name": "White Russian",
      "description": "A creamy and indulgent cocktail with a perfect blend of vodka, coffee liqueur, and cream. Served in a rocks glass with ice, it has a rich, coffee aroma. Each sip is smooth and velvety with a sweet, creamy finish.",
      "glass_type": "Rocks",
      "ingredients": [
        {
          "name": "Vodka",
          "ingredient_size": "2",
          "size_label": "oz"
        },
        {
          "name": "Coffee Liqueur",
          "ingredient_size": "1",
          "size_label": "oz"
        },
        {
          "name": "Heavy Cream",
          "ingredient_size": "1",
          "size_label": "oz"
        },
        {
          "name": "Ice"
        }
      ],
      "instructions": [
        "Fill a rocks glass with ice.",
        "Add vodka and coffee liqueur.",
        "Float heavy cream on top by pouring it over the back of a spoon.",
        "Stir gently before drinking."
      ]
    }
  ]
};

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
