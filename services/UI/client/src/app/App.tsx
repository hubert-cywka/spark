import { RouterProvider } from "react-router";

import { Provider } from "@/app/Provider";
import { router } from "@/app/router";
import { PageWrapper } from "@/components/pageWrapper/PageWrapper";

function App() {
    return (
        <Provider>
            <PageWrapper>
                <RouterProvider router={router} />
            </PageWrapper>
        </Provider>
    );
}

export default App;
