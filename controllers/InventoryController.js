import Inventory from '../models/Inventory.js';
import responseHandler from '../utils/responseHandler.js';

class InventoryController {
    // Create new inventory item
    static async createInventoryItem(req, res) {
        try {
            const { sku, item_name, location, current_stock, last_restock, cost_per_unit, supply_status } = req.body;

            // Validation
            if (!sku || !item_name) {
                return responseHandler.validationError(
                    res,
                    'SKU and item name are required',
                    400
                );
            }

            const created_by = req.user?.id || null;

            const newInventoryItem = await Inventory.create({
                sku,
                item_name,
                location,
                current_stock,
                last_restock,
                cost_per_unit,
                supply_status,
                created_by
            });

            return responseHandler.success(
                res,
                'Inventory item created successfully',
                newInventoryItem,
                201
            );
        } catch (error) {
            console.error('Error creating inventory item:', error);

            if (error.code === '23505') {
                return responseHandler.error(
                    res,
                    'Inventory item with this SKU already exists',
                    error.message,
                    409
                );
            }

            return responseHandler.error(
                res,
                'Failed to create inventory item',
                error.message,
                500
            );
        }
    }

    // Get inventory item by ID
    static async getInventoryItemById(req, res) {
        try {
            const { id } = req.params;

            const inventoryItem = await Inventory.findById(id);

            if (!inventoryItem) {
                return responseHandler.notFound(
                    res,
                    'Inventory item not found',
                    404
                );
            }

            return responseHandler.success(
                res,
                'Inventory item retrieved successfully',
                inventoryItem,
                200
            );
        } catch (error) {
            console.error('Error fetching inventory item:', error);
            return responseHandler.error(
                res,
                'Failed to fetch inventory item',
                error.message,
                500
            );
        }
    }

    // Get inventory item by SKU
    static async getInventoryItemBySku(req, res) {
        try {
            const { sku } = req.params;

            const inventoryItem = await Inventory.findBySku(sku);

            if (!inventoryItem) {
                return responseHandler.notFound(
                    res,
                    'Inventory item not found',
                    404
                );
            }

            return responseHandler.success(
                res,
                'Inventory item retrieved successfully',
                inventoryItem,
                200
            );
        } catch (error) {
            console.error('Error fetching inventory item:', error);
            return responseHandler.error(
                res,
                'Failed to fetch inventory item',
                error.message,
                500
            );
        }
    }

    // Get all inventory items with filters
    static async getAllInventoryItems(req, res) {
        try {
            const { supply_status, location } = req.query;

            const filters = {};

            if (supply_status !== undefined) {
                filters.supply_status = supply_status;
            }

            if (location !== undefined) {
                filters.location = location;
            }

            const inventoryItems = await Inventory.findAll(filters);

            return responseHandler.success(
                res,
                'Inventory items retrieved successfully',
                {
                    count: inventoryItems.length,
                    inventoryItems
                },
                200
            );
        } catch (error) {
            console.error('Error fetching inventory items:', error);
            return responseHandler.error(
                res,
                'Failed to fetch inventory items',
                error.message,
                500
            );
        }
    }

    // Update inventory item
    static async updateInventoryItem(req, res) {
        try {
            const { id } = req.params;
            const { sku, item_name, location, current_stock, last_restock, cost_per_unit, supply_status } = req.body;

            const updated_by = req.user?.id || null;

            // Check if inventory item exists
            const existingItem = await Inventory.findById(id);
            if (!existingItem) {
                return responseHandler.notFound(
                    res,
                    'Inventory item not found',
                    404
                );
            }

            const updatedItem = await Inventory.update(id, {
                sku,
                item_name,
                location,
                current_stock,
                last_restock,
                cost_per_unit,
                supply_status,
                updated_by
            });

            if (!updatedItem) {
                return responseHandler.validationError(
                    res,
                    'No fields to update',
                    400
                );
            }

            return responseHandler.success(
                res,
                'Inventory item updated successfully',
                updatedItem,
                200
            );
        } catch (error) {
            console.error('Error updating inventory item:', error);

            if (error.code === '23505') {
                return responseHandler.error(
                    res,
                    'Inventory item with this SKU already exists',
                    error.message,
                    409
                );
            }

            return responseHandler.error(
                res,
                'Failed to update inventory item',
                error.message,
                500
            );
        }
    }

    // Update stock (add or subtract)
    static async updateStock(req, res) {
        try {
            const { id } = req.params;
            const { quantity_change } = req.body;

            if (quantity_change === undefined || quantity_change === null) {
                return responseHandler.validationError(
                    res,
                    'Quantity change is required',
                    400
                );
            }

            const updated_by = req.user?.id || null;

            // Check if inventory item exists
            const existingItem = await Inventory.findById(id);
            if (!existingItem) {
                return responseHandler.notFound(
                    res,
                    'Inventory item not found',
                    404
                );
            }

            const updatedItem = await Inventory.updateStock(id, quantity_change, updated_by);

            return responseHandler.success(
                res,
                'Stock updated successfully',
                updatedItem,
                200
            );
        } catch (error) {
            console.error('Error updating stock:', error);
            return responseHandler.error(
                res,
                'Failed to update stock',
                error.message,
                500
            );
        }
    }

    // Delete inventory item
    static async deleteInventoryItem(req, res) {
        try {
            const { id } = req.params;

            const inventoryItem = await Inventory.findById(id);
            if (!inventoryItem) {
                return responseHandler.notFound(
                    res,
                    'Inventory item not found',
                    404
                );
            }

            const deletedItem = await Inventory.delete(id);

            return responseHandler.success(
                res,
                'Inventory item deleted successfully',
                deletedItem,
                200
            );
        } catch (error) {
            console.error('Error deleting inventory item:', error);

            if (error.code === '23503') {
                return responseHandler.error(
                    res,
                    'Cannot delete inventory item. It has associated records',
                    error.message,
                    409
                );
            }

            return responseHandler.error(
                res,
                'Failed to delete inventory item',
                error.message,
                500
            );
        }
    }
}

export default InventoryController;
