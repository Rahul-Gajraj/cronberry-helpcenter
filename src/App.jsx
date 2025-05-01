import toast, { ToastBar, Toaster } from "react-hot-toast";
import "./App.css";

import CronberryHelp from "./pages/CronberryHelp";

function App() {
  return (
    <>
      <Toaster position={"top-right"}>
        {(t) => (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => toast.dismiss(t.id)}
          >
            <ToastBar toast={t}>
              {({ icon, message }) => (
                <>
                  {icon}
                  <div style={{ wordBreak: "break-word" }}>{message}</div>
                </>
              )}
            </ToastBar>
          </div>
        )}
      </Toaster>
      <CronberryHelp />
    </>
  );
}

export default App;
