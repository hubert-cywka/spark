import { RouterProvider } from "react-router";

import { Provider } from "@/app/Provider";
import { router } from "@/app/router";

function App() {
    return (
        <Provider>
            <RouterProvider router={router} />
        </Provider>
    );
}

export default App;
