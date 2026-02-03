import app from "./app";

const PORT = 5000;

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});
