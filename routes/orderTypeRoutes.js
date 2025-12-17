import express from 'express';
import OrderTypeController from '../controllers/OrderTypeController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Order Types
 *   description: Order type management
 */

/**
 * @swagger
 * /api/order-types:
 *   post:
 *     summary: Create a new order type
 *     tags: [Order Types]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type_name
 *             properties:
 *               type_name:
 *                 type: string
 *               description:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *           example:
 *             type_name: Medication
 *             description: Medication order type
 *             is_active: true
 *     responses:
 *       201:
 *         description: Order type created successfully
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
 *                   example: Order type created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     type_name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     is_active:
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
 *                   example: Type name is required
 *       409:
 *         description: Order type already exists
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
 *                   example: Order type with this name already exists
 */
router.post('/', OrderTypeController.createOrderType);

/**
 * @swagger
 * /api/order-types:
 *   get:
 *     summary: Get all order types
 *     tags: [Order Types]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *         example: true
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by type name or description
 *         example: Medication
 *     responses:
 *       200:
 *         description: Order types retrieved successfully
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
 *                   example: Order types retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 5
 *                     orderTypes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           type_name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           is_active:
 *                             type: boolean
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *             example:
 *               status: Success
 *               message: Order types retrieved successfully
 *               data:
 *                 count: 5
 *                 orderTypes:
 *                   - id: 1
 *                     type_name: Medication
 *                     description: Medication order type
 *                     is_active: true
 *                     created_at: 2024-01-01T00:00:00.000Z
 *                   - id: 2
 *                     type_name: Therapy
 *                     description: Therapy order type
 *                     is_active: true
 *                     created_at: 2024-01-01T00:00:00.000Z
 *                   - id: 3
 *                     type_name: Equipment
 *                     description: Equipment order type
 *                     is_active: true
 *                     created_at: 2024-01-01T00:00:00.000Z
 */
router.get('/', OrderTypeController.getAllOrderTypes);

/**
 * @swagger
 * /api/order-types/{id}:
 *   get:
 *     summary: Get order type by ID
 *     tags: [Order Types]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order type ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Order type retrieved successfully
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
 *                   example: Order type retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     type_name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     is_active:
 *                       type: boolean
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *             example:
 *               status: Success
 *               message: Order type retrieved successfully
 *               data:
 *                 id: 1
 *                 type_name: Medication
 *                 description: Medication order type
 *                 is_active: true
 *                 created_at: 2024-01-01T00:00:00.000Z
 *                 updated_at: 2024-01-01T00:00:00.000Z
 *       404:
 *         description: Order type not found
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
 *                   example: Order type not found
 */
router.get('/:id', OrderTypeController.getOrderTypeById);

/**
 * @swagger
 * /api/order-types/name/{name}:
 *   get:
 *     summary: Get order type by name
 *     tags: [Order Types]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Order type name
 *         example: Medication
 *     responses:
 *       200:
 *         description: Order type retrieved successfully
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
 *                   example: Order type retrieved successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Order type not found
 */
router.get('/name/:name', OrderTypeController.getOrderTypeByName);

/**
 * @swagger
 * /api/order-types/{id}:
 *   put:
 *     summary: Update order type
 *     tags: [Order Types]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order type ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type_name:
 *                 type: string
 *               description:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *           example:
 *             type_name: Medication Updated
 *             description: Updated description for medication type
 *             is_active: true
 *     responses:
 *       200:
 *         description: Order type updated successfully
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
 *                   example: Order type updated successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Order type not found
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
 *                   example: Order type not found
 */
router.put('/:id', OrderTypeController.updateOrderType);

/**
 * @swagger
 * /api/order-types/{id}/deactivate:
 *   patch:
 *     summary: Deactivate order type
 *     tags: [Order Types]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order type ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Order type deactivated successfully
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
 *                   example: Order type deactivated successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Order type not found
 */
router.patch('/:id/deactivate', OrderTypeController.deactivateOrderType);

/**
 * @swagger
 * /api/order-types/{id}/activate:
 *   patch:
 *     summary: Activate order type
 *     tags: [Order Types]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order type ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Order type activated successfully
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
 *                   example: Order type activated successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Order type not found
 */
router.patch('/:id/activate', OrderTypeController.activateOrderType);

/**
 * @swagger
 * /api/order-types/{id}:
 *   delete:
 *     summary: Delete order type
 *     tags: [Order Types]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order type ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Order type deleted successfully
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
 *                   example: Order type deleted successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Order type not found
 *       409:
 *         description: Cannot delete order type with associated records
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
 *                   example: Cannot delete order type. It has associated records
 */
router.delete('/:id', OrderTypeController.deleteOrderType);

export default router;
