const express = require('express')
const router = express.Router()

// Extracts the result of the validation and determines if there are errors or not
const dataValidator = require('../middlewares/dataValidator')

// Validates if user has token or not
const tokenValidator = require('../middlewares/tokenValidator') 

// Controller
const MembershipController = require('../controllers/MembershipController')

// Express-validator
const { param, cookie } = require('express-validator')

// ROUTES (STILL HAS TO TEST ALL BTW)
/*  
    GET     [DONE]   list groups im a part of
    GET     [DONE]   list groups i sent a request to be a part of
    GET     [DONE]   list memebers in a group
    GET     [DONE]   list requests in a group (must be owner or admin to see)
    POST    [DONE]   send request to be a part of group
    PUT     [... ]   accept request to be part of group  (needs to be owner or admin)
    DELETE  [... ]   deny request to be part of group  (needs to be owner or admin)
    DELETE  [... ]   remove user from group (needs to be owner or admin)
    PUT     [... ]   change role of a group member
*/

// LIST GROUPS IM IN
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

// LIST ALL MEMBERS OF A GROUP
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

// ...







/* 
router.post(
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
        GroupController.denyRequestToJoinGroup
    ) */

module.exports = router