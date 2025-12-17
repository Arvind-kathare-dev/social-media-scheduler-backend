import express from 'express';
import OrderStateController from '../controllers/OrderStateController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Order States
 *   description: Order state management
 */

/**
 * @swagger
 * /api/order-states:
 *   post:
 *     summary: Create a new order state
 *     tags: [Order States]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - state_name
 *             properties:
 *               state_name:
 *                 type: string
 *               description:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *           example:
 *             state_name: Draft
 *             description: Order is in draft state
 *             is_active: true
 *     responses:
 *       201:
 *         description: Order state created successfully
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
 *                   example: Order state created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     state_name:
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
 *                   example: State name is required
 *       409:
 *         description: Order state already exists
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
 *                   example: Order state with this name already exists
 */
router.post('/', OrderStateController.createOrderState);

/**
 * @swagger
 * /api/order-states:
 *   get:
 *     summary: Get all order states
 *     tags: [Order States]
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
 *         description: Search by state name or description
 *         example: Draft
 *     responses:
 *       200:
 *         description: Order states retrieved successfully
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
 *                   example: Order states retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 5
 *                     orderStates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           state_name:
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
 *               message: Order states retrieved successfully
 *               data:
 *                 count: 3
 *                 orderStates:
 *                   - id: 1
 *                     state_name: Draft
 *                     description: Order is in draft state
 *                     is_active: true
 *                     created_at: 2024-01-01T00:00:00.000Z
 *                   - id: 2
 *                     state_name: Unopened
 *                     description: Order has been submitted but not viewed
 *                     is_active: true
 *                     created_at: 2024-01-01T00:00:00.000Z
 *                   - id: 3
 *                     state_name: Signed
 *                     description: Order has been signed by physician
 *                     is_active: true
 *                     created_at: 2024-01-01T00:00:00.000Z
 */
router.get('/', OrderStateController.getAllOrderStates);

/**
 * @swagger
 * /api/order-states/{id}:
 *   get:
 *     summary: Get order state by ID
 *     tags: [Order States]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order state ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Order state retrieved successfully
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
 *                   example: Order state retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     state_name:
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
 *               message: Order state retrieved successfully
 *               data:
 *                 id: 1
 *                 state_name: Draft
 *                 description: Order is in draft state
 *                 is_active: true
 *                 created_at: 2024-01-01T00:00:00.000Z
 *                 updated_at: 2024-01-01T00:00:00.000Z
 *       404:
 *         description: Order state not found
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
 *                   example: Order state not found
 */
router.get('/:id', OrderStateController.getOrderStateById);

/**
 * @swagger
 * /api/order-states/name/{name}:
 *   get:
 *     summary: Get order state by name
 *     tags: [Order States]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Order state name
 *         example: Draft
 *     responses:
 *       200:
 *         description: Order state retrieved successfully
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
 *                   example: Order state retrieved successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Order state not found
 */
router.get('/name/:name', OrderStateController.getOrderStateByName);

/**
 * @swagger
 * /api/order-states/{id}:
 *   put:
 *     summary: Update order state
 *     tags: [Order States]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order state ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state_name:
 *                 type: string
 *               description:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *           example:
 *             state_name: Draft Updated
 *             description: Updated description for draft state
 *             is_active: true
 *     responses:
 *       200:
 *         description: Order state updated successfully
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
 *                   example: Order state updated successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Order state not found
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
 *                   example: Order state not found
 */
router.put('/:id', OrderStateController.updateOrderState);

/**
 * @swagger
 * /api/order-states/{id}/deactivate:
 *   patch:
 *     summary: Deactivate order state
 *     tags: [Order States]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order state ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Order state deactivated successfully
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
 *                   example: Order state deactivated successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Order state not found
 */
router.patch('/:id/deactivate', OrderStateController.deactivateOrderState);

/**
 * @swagger
 * /api/order-states/{id}/activate:
 *   patch:
 *     summary: Activate order state
 *     tags: [Order States]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order state ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Order state activated successfully
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
 *                   example: Order state activated successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Order state not found
 */
router.patch('/:id/activate', OrderStateController.activateOrderState);

/**
 * @swagger
 * /api/order-states/{id}:
 *   delete:
 *     summary: Delete order state
 *     tags: [Order States]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order state ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Order state deleted successfully
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
 *                   example: Order state deleted successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Order state not found
 *       409:
 *         description: Cannot delete order state with associated records
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
 *                   example: Cannot delete order state. It has associated records
 */
router.delete('/:id', OrderStateController.deleteOrderState);

export default router;
