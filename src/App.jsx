import { useState } from "react";
import "./App.css";

import CronberryHelp from "./pages/CronberryHelp";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <CronberryHelp />
    </>
  );
}

export default App;
