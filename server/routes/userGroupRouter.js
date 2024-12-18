const express = require('express')
const router = express.Router()

// Extracts the result of the validation and determines if there are errors or not
const dataValidator = require('../middlewares/dataValidator')

// Validates if user has token or not
const tokenValidator = require('../middlewares/tokenValidator') 

// Controller
const GroupController = require('../controllers/GroupController')

// Express-validator
const { body, param, cookie } = require('express-validator')

// ROUTES
/*  
    GET     [... ]   list groups im a part of
    GET     [... ]   list groups i sent a request to be a part of
    GET     [... ]   list all accepted users in a group
    GET     [... ]   list all non-accepted users in a group (requests) (needs to be owner or admin)
    POST    [... ]   send request to be a part of group
    POST    [... ]   accept request to be part of group  (needs to be owner or admin)
    DELETE  [... ]   deny request to be part of group  (needs to be owner or admin)
    DELETE  [... ]   remove user from group (needs to be owner or admin)
*/

router.post(
        '/create',

        body('name')
            .trim()
            .escape()
            .exists().withMessage('Missing name')
            .notEmpty().withMessage('Empty name')
            .isLength({max: 30}).withMessage('Maximum length for name: 30'),

        body('description')
            .trim()
            .escape()
            .exists().withMessage('Missing description')
            .notEmpty().withMessage('Empty description')
            .isLength({max: 150}).withMessage('Maximum length for description: 300'),

        cookie('jwt')
            .trim()
            .exists().withMessage('Missing JWT on cookies')
            .notEmpty().withMessage('Empty JWT on cookies'),

        dataValidator,
        tokenValidator,
        GroupController.createGroup
    )

router.get(
        '/list/own',

        cookie('jwt')
            .trim()
            .exists().withMessage('Missing JWT on cookies')
            .notEmpty().withMessage('Empty JWT on cookies'),

        dataValidator,
        tokenValidator,
        GroupController.listCreatedGroups
    )

router.get(
        '/list/partof',

        cookie('jwt')
            .trim()
            .exists().withMessage('Missing JWT on cookies')
            .notEmpty().withMessage('Empty JWT on cookies'),

        dataValidator,
        tokenValidator,
        GroupController.listGroupsImPartOf
    )

router.get(
        '/list/request-sent',

        cookie('jwt')
            .trim()
            .exists().withMessage('Missing JWT on cookies')
            .notEmpty().withMessage('Empty JWT on cookies'),

        dataValidator,
        tokenValidator,
        GroupController.listGroupsISentRequestTo
    )

// List requests of this group
router.get(
        '/list/requests/:id',

        cookie('jwt')
            .trim()
            .exists().withMessage('Missing JWT on cookies')
            .notEmpty().withMessage('Empty JWT on cookies'),

        dataValidator,
        tokenValidator,
        GroupController.listRequestsOfThisGroup
    ) 

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
    )

module.exports = router