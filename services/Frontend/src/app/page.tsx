import "server-only";

import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore";

// TODO: Rework structure of components, move some to pages if used only there, move some to features if that makes sense, rename them, split, refactor.
function Page() {
    return <p>Home</p>;
}

export default withSessionRestore(Page);
