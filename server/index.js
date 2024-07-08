const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const {
  client,
  createTables,
  createProduct,
  createUser,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
} = require("./db");

app.get("/api/users", async (req, res) => {
  try {
    res.send(await fetchUsers);
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/products", async (req, res) => {
  try {
    res.send(await fetchProducts);
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/user/:id/favorites", async (req, res) => {
  try {
    res.send(await fetchFavorites);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/users/:id/favorites", async (req, res) => {
  try {
    res.status(201).send(
      await createFavorite({
        users_id: req.body.users_id,
        product_id: req.body.product_id,
      })
    );
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/users/:userId/favorites/:id", async (req, res) => {
  try {
    await destroyFavorite({
      id: req.params.id,
      users_id: req.params.users_id,
    });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
  }
});

const init = async () => {
  await client.connect();
  await createTables();
  const [moe, lucy, larry, ethyl, plate, cup, fork, napkin] = await Promise.all(
    [
      createUser({ username: "moe", password: "moe_pw" }),
      createUser({ username: "lucy", password: "lucy_pw" }),
      createUser({ username: "larry", password: "larry_pw" }),
      createUser({ username: "ethyl", password: "ethyl_pw" }),
      createProduct({ name: "plate" }),
      createProduct({ name: "cup" }),
      createProduct({ name: "fork" }),
      createProduct({ name: "napkin" }),
    ]
  );
  app.listen(PORT, () => console.log(`listening on port ${PORT}`));
  console.log("does this work");
};

init();
