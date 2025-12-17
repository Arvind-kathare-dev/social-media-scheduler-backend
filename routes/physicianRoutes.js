import express from 'express';
import PhysicianController from '../controllers/PhysicianController.js';
import authenticateToken from '../middlewares/agencyAuthMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Physicians
 *   description: Physician management for agencies
 */

/**
 * @swagger
 * /api/physicians:
 *   post:
 *     summary: Create a new physician (agency_id from token)
 *     tags: [Physicians]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - physician_type
 *               - first_name
 *               - last_name
 *               - primary_email
 *             properties:
 *               physician_type:
 *                 type: string
 *                 enum: [agency_owned, external]
 *                 description: Type of physician - agency_owned or external
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 default: active
 *                 description: Current status of the physician
 *               first_name:
 *                 type: string
 *                 description: Physician's first name (required)
 *               last_name:
 *                 type: string
 *                 description: Physician's last name (required)
 *               display_name:
 *                 type: string
 *                 description: Display name (e.g., Dr. John Doe)
 *               primary_email:
 *                 type: string
 *                 format: email
 *                 description: Primary email address (required, must be unique)
 *               secondary_email:
 *                 type: string
 *                 format: email
 *                 description: Secondary email address (optional)
 *               phone_number:
 *                 type: string
 *                 description: Contact phone number
 *               fax_number:
 *                 type: string
 *                 description: Fax number (required for external physicians using fax)
 *               preferred_contact_method:
 *                 type: string
 *                 enum: [ordina, email, fax, erp]
 *                 description: Preferred method for order delivery
 *               login_enabled:
 *                 type: boolean
 *                 default: true
 *                 description: Whether physician can login (agency-owned only)
 *               login_email:
 *                 type: string
 *                 format: email
 *                 description: Email for login credentials (agency-owned only)
 *               role:
 *                 type: string
 *                 default: physician
 *                 description: User role in the system
 *               account_status:
 *                 type: string
 *                 enum: [invited, active, suspended]
 *                 description: Account status (agency-owned only)
 *               specialty:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Medical specialties (e.g., Cardiology, Internal Medicine)
 *                 example: ["Cardiology", "Internal Medicine"]
 *               department:
 *                 type: string
 *                 description: Department name
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Free-form tags for categorization
 *                 example: ["urgent-care", "weekend-available"]
 *               internal_notes:
 *                 type: string
 *                 description: Internal notes visible only to agency staff
 *               npi_number:
 *                 type: string
 *                 maxLength: 10
 *                 description: National Provider Identifier (10 digits, optional)
 *               npi_source:
 *                 type: string
 *                 enum: [agency, erp, external]
 *                 description: Source of NPI number
 *               pecos_id:
 *                 type: string
 *                 description: US Medicare PECOS identifier (optional)
 *               pecos_status:
 *                 type: string
 *                 enum: [enrolled, pending, unknown]
 *                 description: PECOS enrollment status
 *               pecos_source:
 *                 type: string
 *                 enum: [agency, erp]
 *                 description: Source of PECOS information
 *               default_delivery_method:
 *                 type: string
 *                 enum: [ordina, fax, email, erp]
 *                 description: Default method for order delivery
 *               auto_notify:
 *                 type: boolean
 *                 default: true
 *                 description: Enable automatic notifications for new orders
 *               reminder_enabled:
 *                 type: boolean
 *                 default: true
 *                 description: Enable SLA reminder notifications
 *               preferred_sla:
 *                 type: string
 *                 description: Preferred SLA (e.g., 24h, 48h, custom)
 *           example:
 *             physician_type: agency_owned
 *             status: active
 *             first_name: John
 *             last_name: Doe
 *             display_name: Dr. John Doe
 *             primary_email: john.doe@hospital.com
 *             secondary_email: j.doe@clinic.com
 *             phone_number: +1-415-555-1234
 *             fax_number: +1-415-555-1235
 *             preferred_contact_method: ordina
 *             login_enabled: true
 *             login_email: john.doe@hospital.com
 *             role: physician
 *             account_status: active
 *             specialty: ["Cardiology", "Internal Medicine"]
 *             department: Cardiology Department
 *             tags: ["senior-physician", "weekend-available"]
 *             internal_notes: Prefers morning appointments
 *             npi_number: "1234567890"
 *             npi_source: agency
 *             pecos_id: "PECOS123456"
 *             pecos_status: enrolled
 *             pecos_source: agency
 *             default_delivery_method: ordina
 *             auto_notify: true
 *             reminder_enabled: true
 *             preferred_sla: 24h
 *     responses:
 *       201:
 *         description: Physician created successfully
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
 *                   example: Physician created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     physician_id:
 *                       type: string
 *                       format: uuid
 *                     agency_id:
 *                       type: integer
 *                     physician_type:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     primary_email:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Error
 *                 message:
 *                   type: string
 *                   example: Physician type, first name, last name, and primary email are required
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Error
 *                 message:
 *                   type: string
 *                   example: Authorization token missing
 *       409:
 *         description: Physician already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Error
 *                 message:
 *                   type: string
 *                   example: Physician with this email already exists
 */
router.post('/', authenticateToken, PhysicianController.createPhysician);

/**
 * @swagger
 * /api/physicians:
 *   get:
 *     summary: Get all physicians for authenticated agency
 *     tags: [Physicians]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: physician_type
 *         schema:
 *           type: string
 *           enum: [agency_owned, external]
 *         description: Filter by physician type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, or NPI number
 *     responses:
 *       200:
 *         description: Physicians retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get('/', authenticateToken, PhysicianController.getAllPhysicians);

/**
 * @swagger
 * /api/physicians/{physician_id}:
 *   get:
 *     summary: Get physician by ID (must belong to authenticated agency)
 *     tags: [Physicians]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: physician_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Physician UUID
 *     responses:
 *       200:
 *         description: Physician retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Physician does not belong to your agency
 *       404:
 *         description: Physician not found
 */
router.get('/:physician_id', authenticateToken, PhysicianController.getPhysicianById);

/**
 * @swagger
 * /api/physicians/agency/list:
 *   get:
 *     summary: Get physicians for authenticated agency (alternative endpoint)
 *     tags: [Physicians]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: physician_type
 *         schema:
 *           type: string
 *           enum: [agency_owned, external]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Physicians retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get('/agency/list', authenticateToken, PhysicianController.getPhysiciansByAgency);

/**
 * @swagger
 * /api/physicians/{physician_id}:
 *   put:
 *     summary: Update physician (must belong to authenticated agency)
 *     tags: [Physicians]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: physician_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Physician UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             first_name: John
 *             last_name: Doe Updated
 *             phone_number: +1-415-555-9999
 *             specialty: ["Cardiology"]
 *     responses:
 *       200:
 *         description: Physician updated successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Physician does not belong to your agency
 *       404:
 *         description: Physician not found
 */
router.put('/:physician_id', authenticateToken, PhysicianController.updatePhysician);

/**
 * @swagger
 * /api/physicians/{physician_id}/deactivate:
 *   patch:
 *     summary: Deactivate physician (deactivated_by from token)
 *     tags: [Physicians]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: physician_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Physician ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deactivation_reason:
 *                 type: string
 *           example:
 *             deactivation_reason: No longer practicing
 *     responses:
 *       200:
 *         description: Physician deactivated successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Physician does not belong to your agency
 *       404:
 *         description: Physician not found
 */
router.patch('/:physician_id/deactivate', authenticateToken, PhysicianController.deactivatePhysician);

/**
 * @swagger
 * /api/physicians/{physician_id}/activate:
 *   patch:
 *     summary: Activate physician (reactivate inactive physician)
 *     tags: [Physicians]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: physician_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Physician ID
 *     responses:
 *       200:
 *         description: Physician activated successfully
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
 *                   example: Physician activated successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Physician is already active
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Physician does not belong to your agency
 *       404:
 *         description: Physician not found
 */
router.patch('/:physician_id/activate', authenticateToken, PhysicianController.activatePhysician);

/**
 * @swagger
 * /api/physicians/{physician_id}:
 *   delete:
 *     summary: Delete physician (must belong to authenticated agency)
 *     tags: [Physicians]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: physician_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Physician UUID
 *     responses:
 *       200:
 *         description: Physician deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Physician does not belong to your agency
 *       404:
 *         description: Physician not found
 *       409:
 *         description: Cannot delete physician with associated orders
 */
router.delete('/:physician_id', authenticateToken, PhysicianController.deletePhysician);

export default router;
