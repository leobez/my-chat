const express = require('express')
const router = express.Router()

// Extracts the result of the validation and determines if there are errors or not
const dataValidator = require('../middlewares/dataValidator')

// Validates if user has token or not
const tokenValidator = require('../middlewares/tokenValidator') 

// Controller
const UserGroupController = require('../controllers/UserGroupController')

// Express-validator
const { body, param, cookie } = require('express-validator')

// ROUTES (STILL HAS TO TEST ALL BTW)
/*  
    GET     [DONE]   list groups im a part of
    GET     [DONE]   list groups i sent a request to be a part of
    GET     [DONE]   list memebers in a group
    GET     [DONE]   list requests in a group (must be owner or admin to see)
    POST    [DONE]   send request to be a part of group
    PUT    [... ]   accept request to be part of group  (needs to be owner or admin)
    DELETE  [... ]   deny request to be part of group  (needs to be owner or admin)
    DELETE  [... ]   remove user from group (needs to be owner or admin)
    PUT     [... ]   change role of a group member
*/

// LIST GROUPS IM IN
router.get(
    '/list/accepted',

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),

    dataValidator,
    tokenValidator,
    UserGroupController.listGroupsImPartOf
) 

// LIST GROUPS REQUESTS I SENT (STILL WAITING TO BE ACCEPTED)
router.get(
    '/list/wait',

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),

    dataValidator,
    tokenValidator,
    UserGroupController.listGroupsRequestSent
) 

// LIST ALL MEMBERS IN A GROUP
router.get(
    '/list/members/:id',

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
    UserGroupController.listMembersOfGroup
) 

// LIST ALL (STILL NOT ACCEPTED) REQUESTS TO A GROUP
router.get(
    '/list/requests/:id',

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
    UserGroupController.listRequestsOfGroup
) 

// SEND REQUEST TO BE A PART OF GROUP
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
    UserGroupController.sendRequestToJoinGroup
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
    UserGroupController.acceptRequestToJoinGroup
)

// DENY REQUEST TO BE A PART OF GROUP (MUST BE OWNER OR ADMIN)









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