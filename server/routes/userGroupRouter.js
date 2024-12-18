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
    POST    [... ]   send request to be a part of group
    POST    [... ]   accept request to be part of group  (needs to be owner or admin)
    DELETE  [... ]   deny request to be part of group  (needs to be owner or admin)
    DELETE  [... ]   remove user from group (needs to be owner or admin)
*/

// LIST GROUPS IM A PART OF
router.get(
    '/list/groups-partof',

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),

    dataValidator,
    tokenValidator,
    UserGroupController.listGroupsImPartOf
) 

// LIST GROUPS REQUESTS I SENT
router.get(
    '/list/request-sent',

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

// ACCEPT REQUEST TO BE A PART OF GROUP (MUST BE OWNER OR ADMIN)

// DENY REQUEST TO BE A PART OF GROUP (MUST BE OWNER OR ADMIN)









/* 
router.post(
        '/join/:id',

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
        GroupController.sendRequestToJoinGroup
    )

router.post(
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
        GroupController.acceptRequestToJoinGroup
    )

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