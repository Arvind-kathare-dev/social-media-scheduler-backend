import express from 'express';
import AgencyController from '../controllers/AgencyController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Agencies
 *   description: Agency management and authentication
 */

/**
 * @swagger
 * /api/agencies/login:
 *   post:
 *     summary: Agency login
 *     tags: [Agencies]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *           example:
 *             email: william.christiana023@gmail.com
 *             password: your_password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               status: Success
 *               message: Login successful
 *               data:
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ3aWxsaWFtLmNocmlzdGlhbmEwMjNAZ21haWwuY29tIiwiYWdlbmN5X25hbWUiOiJXaWxsaWFtIENocmlzdGlhbmEiLCJhZ2VuY3lfbm8iOiJBRzI1TUcwMSIsImFnZW5jeV9yb2xlIjoiQWRtaW4iLCJyb2xlIjoiYWdlbmN5IiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE2NDEwODE2MDB9.abc123xyz
 *                 agency:
 *                   id: 1
 *                   agency_name: William Christiana
 *                   email: william.christiana023@gmail.com
 *                   contact_no: +1-415-555-1023
 *                   date_of_birth: 1998-03-25
 *                   agency_no: AG25MG01
 *                   license_no: CA-458921
 *                   hospital_name: SAN Francisco General Hospital
 *                   sign_threshold: 2 Days
 *                   is_active: true
 *                   role: Admin
 *                   created_at: 2024-01-01T00:00:00.000Z
 *                 expiresIn: 24h
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: Error
 *               message: Email and password are required
 *       401:
 *         description: Invalid credentials or deactivated account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: Error
 *               message: Invalid email or password
 */
router.post('/login', AgencyController.loginAgency);

/**
 * @swagger
 * /api/agencies:
 *   post:
 *     summary: Create a new agency
 *     tags: [Agencies]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgencyInput'
 *           example:
 *             agency_name: William Christiana
 *             email: william.christiana023@gmail.com
 *             password: SecurePass123!
 *             contact_no: +1-415-555-1023
 *             date_of_birth: 1998-03-25
 *             agency_no: AG25MG01
 *             license_no: CA-458921
 *             hospital_name: SAN Francisco General Hospital
 *             sign_threshold: 2 Days
 *             is_active: true
 *             role: Admin
 *     responses:
 *       201:
 *         description: Agency created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               status: Success
 *               message: Agency created successfully
 *               data:
 *                 id: 1
 *                 agency_name: William Christiana
 *                 email: william.christiana023@gmail.com
 *                 contact_no: +1-415-555-1023
 *                 date_of_birth: 1998-03-25
 *                 agency_no: AG25MG01
 *                 license_no: CA-458921
 *                 hospital_name: SAN Francisco General Hospital
 *                 sign_threshold: 2 Days
 *                 is_active: true
 *                 role: Admin
 *                 created_at: 2024-01-01T00:00:00.000Z
 *                 updated_at: 2024-01-01T00:00:00.000Z
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: Error
 *               message: Agency name, email, and contact number are required
 *       409:
 *         description: Agency already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: Error
 *               message: Agency with this email or agency number already exists
 */
router.post('/', AgencyController.createAgency);

/**
 * @swagger
 * /api/agencies:
 *   get:
 *     summary: Get all agencies
 *     tags: [Agencies]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *         example: true
 *       - in: query
 *         name: hospital_name
 *         schema:
 *           type: string
 *         description: Filter by hospital name
 *         example: SAN Francisco General Hospital
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [Admin, Staff]
 *         description: Filter by role
 *         example: Admin
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by agency name, email, or agency number
 *         example: William
 *     responses:
 *       200:
 *         description: Agencies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: Agencies retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 10
 *                     agencies:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Agency'
 *             example:
 *               status: Success
 *               message: Agencies retrieved successfully
 *               data:
 *                 count: 2
 *                 agencies:
 *                   - id: 1
 *                     agency_name: William Christiana
 *                     email: william.christiana023@gmail.com
 *                     contact_no: +1-415-555-1023
 *                     agency_no: AG25MG01
 *                     hospital_name: SAN Francisco General Hospital
 *                     is_active: true
 *                     role: Admin
 *                   - id: 2
 *                     agency_name: John Smith
 *                     email: john.smith@example.com
 *                     contact_no: +1-415-555-2000
 *                     agency_no: AG25MG02
 *                     hospital_name: City Medical Center
 *                     is_active: true
 *                     role: Staff
 */
router.get('/', AgencyController.getAllAgencies);

/**
 * @swagger
 * /api/agencies/{id}:
 *   get:
 *     summary: Get agency by ID
 *     tags: [Agencies]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Agency ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Agency retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: Agency retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Agency'
 *             example:
 *               status: Success
 *               message: Agency retrieved successfully
 *               data:
 *                 id: 1
 *                 agency_name: William Christiana
 *                 email: william.christiana023@gmail.com
 *                 contact_no: +1-415-555-1023
 *                 date_of_birth: 1998-03-25
 *                 agency_no: AG25MG01
 *                 license_no: CA-458921
 *                 hospital_name: SAN Francisco General Hospital
 *                 sign_threshold: 2 Days
 *                 is_active: true
 *                 role: Admin
 *                 created_at: 2024-01-01T00:00:00.000Z
 *                 updated_at: 2024-01-01T00:00:00.000Z
 *       404:
 *         description: Agency not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: Error
 *               message: Agency not found
 */
router.get('/:id', AgencyController.getAgencyById);

/**
 * @swagger
 * /api/agencies/{id}/stats:
 *   get:
 *     summary: Get agency statistics
 *     tags: [Agencies]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Agency ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Agency statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               status: Success
 *               message: Agency statistics retrieved successfully
 *               data:
 *                 agency_id: 1
 *                 agency_name: William Christiana
 *                 is_active: true
 *                 created_at: 2024-01-01T00:00:00.000Z
 *       404:
 *         description: Agency not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: Error
 *               message: Agency not found
 */
router.get('/:id/stats', AgencyController.getAgencyStats);

/**
 * @swagger
 * /api/agencies/{id}:
 *   put:
 *     summary: Update agency
 *     tags: [Agencies]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Agency ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               agency_name:
 *                 type: string
 *               email:
 *                 type: string
 *               contact_no:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               agency_no:
 *                 type: string
 *               license_no:
 *                 type: string
 *               hospital_name:
 *                 type: string
 *               sign_threshold:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *               role:
 *                 type: string
 *                 enum: [Admin, Staff]
 *           example:
 *             agency_name: William Christiana Updated
 *             contact_no: +1-415-555-9999
 *             hospital_name: Updated Hospital Name
 *             role: Staff
 *     responses:
 *       200:
 *         description: Agency updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               status: Success
 *               message: Agency updated successfully
 *               data:
 *                 id: 1
 *                 agency_name: William Christiana Updated
 *                 email: william.christiana023@gmail.com
 *                 contact_no: +1-415-555-9999
 *                 hospital_name: Updated Hospital Name
 *                 role: Staff
 *                 updated_at: 2024-01-02T00:00:00.000Z
 *       404:
 *         description: Agency not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: Error
 *               message: Agency not found
 */
router.put('/:id', AgencyController.updateAgency);

/**
 * @swagger
 * /api/agencies/{id}/deactivate:
 *   patch:
 *     summary: Deactivate agency
 *     tags: [Agencies]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Agency ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Agency deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               status: Success
 *               message: Agency deactivated successfully
 *               data:
 *                 id: 1
 *                 agency_name: William Christiana
 *                 is_active: false
 *                 updated_at: 2024-01-02T00:00:00.000Z
 *       404:
 *         description: Agency not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: Error
 *               message: Agency not found
 */
router.patch('/:id/deactivate', AgencyController.deactivateAgency);

/**
 * @swagger
 * /api/agencies/{id}/activate:
 *   patch:
 *     summary: Activate agency
 *     tags: [Agencies]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Agency ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Agency activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               status: Success
 *               message: Agency activated successfully
 *               data:
 *                 id: 1
 *                 agency_name: William Christiana
 *                 is_active: true
 *                 updated_at: 2024-01-02T00:00:00.000Z
 *       404:
 *         description: Agency not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: Error
 *               message: Agency not found
 */
router.patch('/:id/activate', AgencyController.activateAgency);

/**
 * @swagger
 * /api/agencies/{id}:
 *   delete:
 *     summary: Delete agency
 *     tags: [Agencies]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Agency ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Agency deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               status: Success
 *               message: Agency deleted successfully
 *               data:
 *                 id: 1
 *                 agency_name: William Christiana
 *                 email: william.christiana023@gmail.com
 *       404:
 *         description: Agency not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: Error
 *               message: Agency not found
 *       409:
 *         description: Cannot delete agency with associated records
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: Error
 *               message: Cannot delete agency. It has associated records (physicians, orders, etc.)
 */
router.delete('/:id', AgencyController.deleteAgency);

export default router;
