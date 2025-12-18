import express from 'express';
import SupplyController from '../controllers/SupplyController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Supplies
 *   description: Patient supply orders management
 */

/**
 * @swagger
 * /api/supplies:
 *   post:
 *     summary: Create a new supply order
 *     tags: [Supplies]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - patient_name
 *               - clinician_name
 *               - items
 *               - total_items
 *               - order_date
 *             properties:
 *               order_id:
 *                 type: string
 *               patient_name:
 *                 type: string
 *               clinician_name:
 *                 type: string
 *               items:
 *                 type: string
 *               total_items:
 *                 type: integer
 *               order_date:
 *                 type: string
 *                 format: date
 *               insurance_type:
 *                 type: string
 *           example:
 *             order_id: "102451"
 *             patient_name: John Doe
 *             clinician_name: Emily Carter
 *             items: Adult Diapers
 *             total_items: 5
 *             order_date: "2025-06-20"
 *             insurance_type: Medicare
 *     responses:
 *       201:
 *         description: Supply order created successfully
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
 *                   example: Supply order created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     order_id:
 *                       type: string
 *                     patient_name:
 *                       type: string
 *                     clinician_name:
 *                       type: string
 *                     items:
 *                       type: string
 *                     total_items:
 *                       type: integer
 *                     order_date:
 *                       type: string
 *                       format: date
 *                     insurance_type:
 *                       type: string
 *                     is_approve:
 *                       type: boolean
 *                     is_decline:
 *                       type: boolean
 *                     created_by:
 *                       type: integer
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
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
 *                   example: Order ID, patient name, clinician name, items, total items, and order date are required
 *       409:
 *         description: Supply order already exists
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
 *                   example: Supply order with this Order ID already exists
 */
router.post('/', SupplyController.createSupply);

/**
 * @swagger
 * /api/supplies:
 *   get:
 *     summary: Get all supply orders
 *     tags: [Supplies]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: insurance_type
 *         schema:
 *           type: string
 *         description: Filter by insurance type
 *         example: Medicare
 *       - in: query
 *         name: is_approve
 *         schema:
 *           type: boolean
 *         description: Filter by approval status
 *         example: true
 *       - in: query
 *         name: is_decline
 *         schema:
 *           type: boolean
 *         description: Filter by decline status
 *         example: false
 *     responses:
 *       200:
 *         description: Supply orders retrieved successfully
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
 *                   example: Supply orders retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 6
 *                     supplies:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           order_id:
 *                             type: string
 *                           patient_name:
 *                             type: string
 *                           clinician_name:
 *                             type: string
 *                           items:
 *                             type: string
 *                           total_items:
 *                             type: integer
 *                           order_date:
 *                             type: string
 *                             format: date
 *                           insurance_type:
 *                             type: string
 *                           is_approve:
 *                             type: boolean
 *                           is_decline:
 *                             type: boolean
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *             example:
 *               status: Success
 *               message: Supply orders retrieved successfully
 *               data:
 *                 count: 6
 *                 supplies:
 *                   - id: 1
 *                     order_id: "102451"
 *                     patient_name: John Doe
 *                     clinician_name: Emily Carter
 *                     items: Adult Diapers
 *                     total_items: 5
 *                     order_date: "2025-06-20"
 *                     insurance_type: Medicare
 *                     is_approve: false
 *                     is_decline: false
 *                     created_at: "2024-01-01T00:00:00.000Z"
 *                   - id: 2
 *                     order_id: "102450"
 *                     patient_name: Jane Smith
 *                     clinician_name: James Whitman
 *                     items: IV Drip
 *                     total_items: 14
 *                     order_date: "2025-07-05"
 *                     insurance_type: Private
 *                     is_approve: false
 *                     is_decline: false
 *                     created_at: "2024-01-01T00:00:00.000Z"
 */
router.get('/', SupplyController.getAllSupplies);

/**
 * @swagger
 * /api/supplies/{id}:
 *   get:
 *     summary: Get supply order by ID
 *     tags: [Supplies]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supply order ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Supply order retrieved successfully
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
 *                   example: Supply order retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     order_id:
 *                       type: string
 *                     patient_name:
 *                       type: string
 *                     clinician_name:
 *                       type: string
 *                     items:
 *                       type: string
 *                     total_items:
 *                       type: integer
 *                     order_date:
 *                       type: string
 *                       format: date
 *                     insurance_type:
 *                       type: string
 *                     is_approve:
 *                       type: boolean
 *                     is_decline:
 *                       type: boolean
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *             example:
 *               status: Success
 *               message: Supply order retrieved successfully
 *               data:
 *                 id: 1
 *                 order_id: "102451"
 *                 patient_name: John Doe
 *                 clinician_name: Emily Carter
 *                 items: Adult Diapers
 *                 total_items: 5
 *                 order_date: "2025-06-20"
 *                 insurance_type: Medicare
 *                 is_approve: false
 *                 is_decline: false
 *                 created_at: "2024-01-01T00:00:00.000Z"
 *                 updated_at: "2024-01-01T00:00:00.000Z"
 *       404:
 *         description: Supply order not found
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
 *                   example: Supply order not found
 */
router.get('/:id', SupplyController.getSupplyById);

/**
 * @swagger
 * /api/supplies/order/{order_id}:
 *   get:
 *     summary: Get supply order by Order ID
 *     tags: [Supplies]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supply order ID
 *         example: "102451"
 *     responses:
 *       200:
 *         description: Supply order retrieved successfully
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
 *                   example: Supply order retrieved successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Supply order not found
 */
router.get('/order/:order_id', SupplyController.getSupplyByOrderId);

/**
 * @swagger
 * /api/supplies/{id}:
 *   put:
 *     summary: Update supply order
 *     tags: [Supplies]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supply order ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: string
 *               patient_name:
 *                 type: string
 *               clinician_name:
 *                 type: string
 *               items:
 *                 type: string
 *               total_items:
 *                 type: integer
 *               order_date:
 *                 type: string
 *                 format: date
 *               insurance_type:
 *                 type: string
 *               is_approve:
 *                 type: boolean
 *               is_decline:
 *                 type: boolean
 *           example:
 *             order_id: "102451"
 *             patient_name: John Doe Updated
 *             clinician_name: Emily Carter
 *             items: Adult Diapers, IV Drip
 *             total_items: 10
 *             order_date: "2025-06-25"
 *             insurance_type: Medicare
 *             is_approve: false
 *             is_decline: false
 *     responses:
 *       200:
 *         description: Supply order updated successfully
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
 *                   example: Supply order updated successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Supply order not found
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
 *                   example: Supply order not found
 */
router.put('/:id', SupplyController.updateSupply);

/**
 * @swagger
 * /api/supplies/{id}/approve:
 *   patch:
 *     summary: Approve supply order
 *     tags: [Supplies]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supply order ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Supply order approved successfully
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
 *                   example: Supply order approved successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Supply order not found
 */
router.patch('/:id/approve', SupplyController.approveSupply);

/**
 * @swagger
 * /api/supplies/{id}/decline:
 *   patch:
 *     summary: Decline supply order
 *     tags: [Supplies]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supply order ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Supply order declined successfully
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
 *                   example: Supply order declined successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Supply order not found
 */
router.patch('/:id/decline', SupplyController.declineSupply);

/**
 * @swagger
 * /api/supplies/{id}:
 *   delete:
 *     summary: Delete supply order
 *     tags: [Supplies]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supply order ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Supply order deleted successfully
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
 *                   example: Supply order deleted successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Supply order not found
 *       409:
 *         description: Cannot delete supply order with associated records
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
 *                   example: Cannot delete supply order. It has associated records
 */
router.delete('/:id', SupplyController.deleteSupply);

export default router;
