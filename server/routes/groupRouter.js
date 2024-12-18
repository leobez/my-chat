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
    POST    [... ]   create a group
    PUT     [... ]   update a group (needs to be owner)
    DELETE  [... ]   delete a group (needs to be owner)
    GET     [... ]   list all groups
    GET     [... ]   get group by id
    GET     [... ]   list all groups created by me
*/

// CREATE A GROUP
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

// UPDATE A GROUP
router.put(
        '/update/:id',

        param('id')
            .trim()
            .exists().withMessage('Missing id')
            .notEmpty().withMessage('Empty id')
            .isNumeric().withMessage('Invalid id'),

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
        GroupController.updateGroup
    )

// DELETE A GROUP
router.delete(
        '/delete/:id',

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
        GroupController.deleteGroup
    )

// LIST ALL GROUPS
router.get(
        '/list/all',

        cookie('jwt')
            .trim()
            .exists().withMessage('Missing JWT on cookies')
            .notEmpty().withMessage('Empty JWT on cookies'),

        dataValidator,
        tokenValidator,
        GroupController.listAllGroups
    )

// GET GROUP BY ID
router.get(
    '/list/:id',
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
    GroupController.getGroupById
    )

// LIST ALL GROUP CREATED BY ME
router.get(
        '/list/own',

        cookie('jwt')
            .trim()
            .exists().withMessage('Missing JWT on cookies')
            .notEmpty().withMessage('Empty JWT on cookies'),

        dataValidator,
        tokenValidator,
        GroupController.listGroupsCreatedBy
    )

module.exports = router