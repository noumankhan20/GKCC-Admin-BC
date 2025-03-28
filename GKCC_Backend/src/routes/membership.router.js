import { Router } from 'express';
import { createMembership, loginMembership, getMemberDetail, updateMemberDetails, totalMember, totalPendingMember, associationPendingMemberCount, associationTotalMemberCount, getTotalMembersInAssociation, getTotalMembersInAssociationByGKCCId, getMembersByAssociationName} from '../controllers/membership.controller.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminAuthMiddleware } from '../middlewares/adminauth.middleware.js';
import verifyCaptcha from '../middlewares/verifycaptcha.middleware.js';


const router = Router();

// testing routes
router.route("/").post((req, res) => {
    return res.status(200).json(new ApiResponse(200, "working"));
});

router.get('/protected-route', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.user });
  });



// Route for creating a membership
router.route("/Submitmemberform").post(verifyCaptcha,createMembership);
router.route("/login").post(loginMembership)
router.get('/membership', authMiddleware, getMemberDetail);

// route to update the Member details for the Individual Membership
router.put('/updateMember', authMiddleware, updateMemberDetails);

// get Count

router.route("/getmembercount").get(totalMember)
router.route("/getpendingmembercount").get(totalPendingMember)
router.route("/thisAssociationPendingCount").get(adminAuthMiddleware,associationPendingMemberCount)
router.route("/thisAssociationTotalCount").get(adminAuthMiddleware,associationTotalMemberCount)


router.route("/totalMembers/:associationName").get(getTotalMembersInAssociation); //

router.route("/totalMember/:GKCCId").get(getTotalMembersInAssociationByGKCCId);

router.get("/memberships/:associationName", getMembersByAssociationName);

export default router;
