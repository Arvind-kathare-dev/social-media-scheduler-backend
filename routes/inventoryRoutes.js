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
 *               - item_name
 *               - item_code
 *             properties:
 *               item_name:
 *                 type: string
 *               item_code:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: number
 *               unit_of_measure:
 *                 type: string
 *               reorder_level:
 *                 type: number
 *               unit_price:
 *                 type: number
 *               supplier_name:
 *                 type: string
 *               supplier_contact:
 *                 type: string
 *               location:
 *                 type: string
 *               expiry_date:
 *                 type: string
 *                 format: date
 *               batch_number:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *           example:
 *             item_name: Surgical Gloves
 *             item_code: SG-001
 *             description: Latex surgical gloves, size M
 *             category: Medical Supplies
 *             quantity: 500
 *             unit_of_measure: boxes
 *             reorder_level: 100
 *             unit_price: 15.99
 *             supplier_name: MedSupply Inc
 *             supplier_contact: contact@medsupply.com
 *             location: Warehouse A, Shelf 3
 *             expiry_date: 2025-12-31
 *             batch_number: BATCH-2024-001
 *             is_active: true
 *     responses:
 *       201:
 *         description: Inventory item created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Item code already exists
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
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by item name, code, or description
 *       - in: query
 *         name: low_stock
 *         schema:
 *           type: boolean
 *         description: Filter items at or below reorder level
 *     responses:
 *       200:
 *         description: Inventory items retrieved successfully
 */
router.get('/', InventoryController.getAllInventoryItems);

/**
 * @swagger
 * /api/inventory/low-stock:
 *   get:
 *     summary: Get low stock items
 *     tags: [Inventory]
 *     security: []
 *     responses:
 *       200:
 *         description: Low stock items retrieved successfully
 */
router.get('/low-stock', InventoryController.getLowStockItems);

/**
 * @swagger
 * /api/inventory/expiring-soon:
 *   get:
 *     summary: Get items expiring soon
 *     tags: [Inventory]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to check for expiry
 *     responses:
 *       200:
 *         description: Expiring items retrieved successfully
 */
router.get('/expiring-soon', InventoryController.getExpiringSoonItems);

/**
 * @swagger
 * /api/inventory/category/{category}:
 *   get:
 *     summary: Get items by category
 *     tags: [Inventory]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name
 *     responses:
 *       200:
 *         description: Items retrieved successfully
 */
router.get('/category/:category', InventoryController.getItemsByCategory);

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
 *     responses:
 *       200:
 *         description: Inventory item retrieved successfully
 *       404:
 *         description: Inventory item not found
 */
router.get('/:id', InventoryController.getInventoryItemById);

/**
 * @swagger
 * /api/inventory/code/{code}:
 *   get:
 *     summary: Get inventory item by item code
 *     tags: [Inventory]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Item code
 *     responses:
 *       200:
 *         description: Inventory item retrieved successfully
 *       404:
 *         description: Inventory item not found
 */
router.get('/code/:code', InventoryController.getInventoryItemByCode);

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item_name:
 *                 type: string
 *               item_code:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: number
 *               unit_of_measure:
 *                 type: string
 *               reorder_level:
 *                 type: number
 *               unit_price:
 *                 type: number
 *               supplier_name:
 *                 type: string
 *               supplier_contact:
 *                 type: string
 *               location:
 *                 type: string
 *               expiry_date:
 *                 type: string
 *                 format: date
 *               batch_number:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Inventory item updated successfully
 *       404:
 *         description: Inventory item not found
 */
router.put('/:id', InventoryController.updateInventoryItem);

/**
 * @swagger
 * /api/inventory/{id}/quantity:
 *   patch:
 *     summary: Update inventory quantity (add or subtract)
 *     tags: [Inventory]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inventory item ID
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
 *                 description: Positive to add, negative to subtract
 *           example:
 *             quantity_change: -10
 *     responses:
 *       200:
 *         description: Quantity updated successfully
 *       404:
 *         description: Inventory item not found
 */
router.patch('/:id/quantity', InventoryController.updateQuantity);

/**
 * @swagger
 * /api/inventory/{id}/deactivate:
 *   patch:
 *     summary: Deactivate inventory item
 *     tags: [Inventory]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inventory item ID
 *     responses:
 *       200:
 *         description: Inventory item deactivated successfully
 *       404:
 *         description: Inventory item not found
 */
router.patch('/:id/deactivate', InventoryController.deactivateInventoryItem);

/**
 * @swagger
 * /api/inventory/{id}/activate:
 *   patch:
 *     summary: Activate inventory item
 *     tags: [Inventory]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Inventory item ID
 *     responses:
 *       200:
 *         description: Inventory item activated successfully
 *       404:
 *         description: Inventory item not found
 */
router.patch('/:id/activate', InventoryController.activateInventoryItem);

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
 *     responses:
 *       200:
 *         description: Inventory item deleted successfully
 *       404:
 *         description: Inventory item not found
 *       409:
 *         description: Cannot delete item with associated records
 */
router.delete('/:id', InventoryController.deleteInventoryItem);

export default router;
