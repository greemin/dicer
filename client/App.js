import React from "react";
import Dicer from "./components/Dicer";

const path = window.location.pathname;
const apiEndpoint = path + "dice-results";

function App() {
  return <Dicer url={apiEndpoint} />;
}

export default App;
