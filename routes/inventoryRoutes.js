import express from 'express';
import InventoryController from '../controllers/InventoryController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management
 */

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Create a new inventory item
 *     tags: [Inventory]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sku
 *               - item_name
 *             properties:
 *               sku:
 *                 type: string
 *               item_name:
 *                 type: string
 *               current_stock:
 *                 type: number
 *               last_restock:
 *                 type: string
 *                 format: date
 *               cost_per_unit:
 *                 type: number
 *               supply_status:
 *                 type: string
 *                 enum: [Active, Discontinued, Out of Stock, Low Stock]
 *           example:
 *             sku: AD-1234
 *             item_name: Adult Diapers
 *             current_stock: 252
 *             last_restock: 2025-06-20
 *             cost_per_unit: 11
 *             supply_status: Active
 *     responses:
 *       201:
 *         description: Inventory item created successfully
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
 *                   example: Inventory item created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     sku:
 *                       type: string
 *                     item_name:
 *                       type: string
 *                     current_stock:
 *                       type: number
 *                     last_restock:
 *                       type: string
 *                       format: date
 *                     cost_per_unit:
 *                       type: number
 *                     total_stock_value:
 *                       type: number
 *                     supply_status:
 *                       type: string
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
 *                   example: SKU and item name are required
 *       409:
 *         description: Inventory item already exists
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
 *                   example: Inventory item with this SKU already exists
 */
router.post('/', InventoryController.createInventoryItem);

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get all inventory items
 *     tags: [Inventory]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: supply_status
 *         schema:
 *           type: string
 *           enum: [Active, Discontinued, Out of Stock, Low Stock]
 *         description: Filter by supply status
 *         example: Active
 *     responses:
 *       200:
 *         description: Inventory items retrieved successfully
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
 *                   example: Inventory items retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 6
 *                     inventoryItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           sku:
 *                             type: string
 *                           item_name:
 *                             type: string
 *                           current_stock:
 *                             type: number
 *                           last_restock:
 *                             type: string
 *                             format: date
 *                           cost_per_unit:
 *                             type: number
 *                           total_stock_value:
 *                             type: number
 *                           supply_status:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *             example:
 *               status: Success
 *               message: Inventory items retrieved successfully
 *               data:
 *                 count: 6
 *                 inventoryItems:
 *                   - id: 1
 *                     sku: AD-1234
 *                     item_name: Adult Diapers
 *                     current_stock: 252
 *                     last_restock: 2025-06-20
 *                     cost_per_unit: 11
 *                     total_stock_value: 2772.00
 *                     supply_status: Active
 *                     created_at: 2024-01-01T00:00:00.000Z
 *                   - id: 2
 *                     sku: GN-5387
 *                     item_name: Gauzes
 *                     current_stock: 4
 *                     last_restock: 2025-07-05
 *                     cost_per_unit: 14
 *                     total_stock_value: 56.00
 *                     supply_status: Discontinued
 *                     created_at: 2024-01-01T00:00:00.000Z
 */
router.get('/', InventoryController.getAllInventoryItems);

/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     summary: Get inventory item by ID
 *     tags: [Inventory]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inventory item ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Inventory item retrieved successfully
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
 *                   example: Inventory item retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     sku:
 *                       type: string
 *                     item_name:
 *                       type: string
 *                     current_stock:
 *                       type: number
 *                     last_restock:
 *                       type: string
 *                       format: date
 *                     cost_per_unit:
 *                       type: number
 *                     total_stock_value:
 *                       type: number
 *                     supply_status:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *             example:
 *               status: Success
 *               message: Inventory item retrieved successfully
 *               data:
 *                 id: 1
 *                 sku: AD-1234
 *                 item_name: Adult Diapers
 *                 current_stock: 252
 *                 last_restock: 2025-06-20
 *                 cost_per_unit: 11
 *                 total_stock_value: 2772.00
 *                 supply_status: Active
 *                 created_at: 2024-01-01T00:00:00.000Z
 *                 updated_at: 2024-01-01T00:00:00.000Z
 *       404:
 *         description: Inventory item not found
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
 *                   example: Inventory item not found
 */
router.get('/:id', InventoryController.getInventoryItemById);

/**
 * @swagger
 * /api/inventory/sku/{sku}:
 *   get:
 *     summary: Get inventory item by SKU
 *     tags: [Inventory]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory item SKU
 *         example: AD-1234
 *     responses:
 *       200:
 *         description: Inventory item retrieved successfully
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
 *                   example: Inventory item retrieved successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Inventory item not found
 */
router.get('/sku/:sku', InventoryController.getInventoryItemBySku);

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Update inventory item
 *     tags: [Inventory]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inventory item ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sku:
 *                 type: string
 *               item_name:
 *                 type: string
 *               current_stock:
 *                 type: number
 *               last_restock:
 *                 type: string
 *                 format: date
 *               cost_per_unit:
 *                 type: number
 *               supply_status:
 *                 type: string
 *                 enum: [Active, Discontinued, Out of Stock, Low Stock]
 *           example:
 *             sku: AD-1234
 *             item_name: Adult Diapers Updated
 *             current_stock: 300
 *             last_restock: 2025-06-25
 *             cost_per_unit: 12
 *             supply_status: Active
 *     responses:
 *       200:
 *         description: Inventory item updated successfully
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
 *                   example: Inventory item updated successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Inventory item not found
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
 *                   example: Inventory item not found
 */
router.put('/:id', InventoryController.updateInventoryItem);

/**
 * @swagger
 * /api/inventory/{id}/stock:
 *   patch:
 *     summary: Update stock (add or subtract)
 *     tags: [Inventory]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inventory item ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity_change
 *             properties:
 *               quantity_change:
 *                 type: number
 *                 description: Positive to add stock, negative to subtract
 *           example:
 *             quantity_change: 50
 *     responses:
 *       200:
 *         description: Stock updated successfully
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
 *                   example: Stock updated successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Inventory item not found
 */
router.patch('/:id/stock', InventoryController.updateStock);

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Delete inventory item
 *     tags: [Inventory]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inventory item ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Inventory item deleted successfully
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
 *                   example: Inventory item deleted successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Inventory item not found
 *       409:
 *         description: Cannot delete inventory item with associated records
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
 *                   example: Cannot delete inventory item. It has associated records
 */
router.delete('/:id', InventoryController.deleteInventoryItem);

export default router;
