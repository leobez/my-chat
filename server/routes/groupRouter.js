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
    [DONE] create a group
    [DONE] list my created groups
    [DONE] list groups im a part of
    [DONE] list groups i sent request to a part of
    [DONE] list all requests of this group (only owner or admin of group can see)

    list all users of this group (only owner or admin of group can see)

    [DONE] (user) send request to be part of group
    (owner) accept/deny request to be part of group


    remove user from group
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