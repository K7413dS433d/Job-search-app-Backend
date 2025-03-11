// auth router
import authRouter from "./authentication/auth.controller.js";

//user router
import userRouter from "./user/user.controller.js";

//company
import companyRouter from "./company/company.controller.js";

//job
import jobRouter from "./job/job.controller.js";

//chat
import chatRouter from "./chat/chat.controller.js";

//export
export default { authRouter, userRouter, companyRouter, jobRouter, chatRouter };
