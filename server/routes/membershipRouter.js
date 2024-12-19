const express = require('express')
const router = express.Router()

// Extracts the result of the validation and determines if there are errors or not
const dataValidator = require('../middlewares/dataValidator')

// Validates if user has token or not
const tokenValidator = require('../middlewares/tokenValidator') 

// Controller
const MembershipController = require('../controllers/MembershipController')

// Express-validator
const { param, cookie, body } = require('express-validator')

// ROUTES
/*  
    GET     [DONE]   list my accepted memberships im a part of
    GET     [DONE]   list my membership requests
    GET     [DONE]   list all memberships of a group
    GET     [DONE]   list requests in a group (must be owner or admin to see)
    POST    [DONE]   send request to be a part of group
    PUT     [DONE]   accept request to be part of group  (needs to be owner or admin)
    DELETE  [DONE]   deny request to be part of group  (needs to be owner or admin)
    DELETE  [DONE]   remove membership from group. delete membership (needs to be owner, admin or user himself)
    PUT     [DONE]   change role of a group member (needs to be owner or admin)
*/

// LIST MY ACCEPTED MEMBERSHIPS IM IN
router.get(
    '/',

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),

    dataValidator,
    tokenValidator,
    MembershipController.listAllMemberships
) 

router.get(
    '/me/accepted',

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),

    dataValidator,
    tokenValidator,
    MembershipController.listAcceptedMemberships
) 

// LIST MY MEMBERSHIP REQUESTS
router.get(
    '/me/requests',

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),

    dataValidator,
    tokenValidator,
    MembershipController.listMembershipRequests
) 

// LIST ALL MEMBERSHIPS OF A GROUP
router.get(
    '/members/:id',

    param('id')
        .trim()
        .exists().withMessage('Missing id')
        .notEmpty().withMessage('Empty id')
        .isNumeric().withMessage('Invalid id'),

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),

    dataValidator,
    tokenValidator,
    MembershipController.listMembersOfGroup
) 

// LIST ALL MEMBERSHIP REQUESTS OF A GROUP
router.get(
    '/requests/:id',

    param('id')
        .trim()
        .exists().withMessage('Missing id')
        .notEmpty().withMessage('Empty id')
        .isNumeric().withMessage('Invalid id'),

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),

    dataValidator,
    tokenValidator,
    MembershipController.listRequestsOfGroup
) 

// SEND REQUEST TO JOIN A GROUP
router.post(
    '/send/:id',

    param('id')
        .trim()
        .exists().withMessage('Missing id')
        .notEmpty().withMessage('Empty id')
        .isNumeric().withMessage('Invalid id'),

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),

    dataValidator,
    tokenValidator,
    MembershipController.sendRequestToJoinGroup
)

// ACCEPT REQUEST TO BE A PART OF GROUP (MUST BE OWNER OR ADMIN)
router.put(
    '/accept/:id',

    param('id')
        .trim()
        .exists().withMessage('Missing id')
        .notEmpty().withMessage('Empty id')
        .isNumeric().withMessage('Invalid id'),

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),

    dataValidator,
    tokenValidator,
    MembershipController.acceptRequestToJoinGroup
)

// DENY REQUEST TO BE A PART OF GROUP (MUST BE OWNER OR ADMIN)
router.delete(
    '/deny/:id',

    param('id')
        .trim()
        .exists().withMessage('Missing id')
        .notEmpty().withMessage('Empty id')
        .isNumeric().withMessage('Invalid id'),

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),

    dataValidator,
    tokenValidator,
    MembershipController.denyRequestToJoinGroup
) 

// REVOKE MEMBERSHIP OF A USER (MUST BE OWNER, ADMIN OR THE USER HIMSELF)
router.delete(
    '/revoke/:id',

    param('id')
        .trim()
        .exists().withMessage('Missing id')
        .notEmpty().withMessage('Empty id')
        .isNumeric().withMessage('Invalid id'),

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),

    dataValidator,
    tokenValidator,
    MembershipController.revokeMembership
) 

// CHANGE ROLE A CERTAIN MEMBERSHIP (MUST BE OWNER)
router.put(
    '/updateRole/:id',

    param('id')
        .trim()
        .exists().withMessage('Missing id')
        .notEmpty().withMessage('Empty id')
        .isNumeric().withMessage('Invalid id'),

    body('newRole')
        .trim()
        .escape()
        .exists().withMessage('Missing newRole')
        .notEmpty().withMessage('Empty newRole')
        .isIn(['admin', 'user']).withMessage('newRole must be user or admin'),

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),

    dataValidator,
    tokenValidator,
    MembershipController.updateRole
)

module.exports = router