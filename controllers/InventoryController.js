import Inventory from '../models/Inventory.js';
import responseHandler from '../utils/responseHandler.js';

class InventoryController {
    // Create new inventory item
    static async createInventoryItem(req, res) {
        try {
            const {
                item_name,
                item_code,
                description,
                category,
                quantity,
                unit_of_measure,
                reorder_level,
                unit_price,
                supplier_name,
                supplier_contact,
                location,
                expiry_date,
                batch_number,
                is_active
            } = req.body;

            // Validation
            if (!item_name || !item_code) {
                return responseHandler.validationError(
                    res,
                    'Item name and item code are required',
                    400
                );
            }

            const created_by = req.user?.id || null;

            const newInventoryItem = await Inventory.create({
                item_name,
                item_code,
                description,
                category,
                quantity,
                unit_of_measure,
                reorder_level,
                unit_price,
                supplier_name,
                supplier_contact,
                location,
                expiry_date,
                batch_number,
                is_active,
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
                    'Inventory item with this code already exists',
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

    // Get inventory item by item code
    static async getInventoryItemByCode(req, res) {
        try {
            const { code } = req.params;

            const inventoryItem = await Inventory.findByItemCode(code);

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
            const { is_active, category, search, low_stock } = req.query;

            const filters = {};

            if (is_active !== undefined) {
                filters.is_active = is_active === 'true';
            }

            if (category) {
                filters.category = category;
            }

            if (search) {
                filters.search = search;
            }

            if (low_stock) {
                filters.low_stock = low_stock;
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

    // Get low stock items
    static async getLowStockItems(req, res) {
        try {
            const lowStockItems = await Inventory.getLowStockItems();

            return responseHandler.success(
                res,
                'Low stock items retrieved successfully',
                {
                    count: lowStockItems.length,
                    items: lowStockItems
                },
                200
            );
        } catch (error) {
            console.error('Error fetching low stock items:', error);
            return responseHandler.error(
                res,
                'Failed to fetch low stock items',
                error.message,
                500
            );
        }
    }

    // Get items expiring soon
    static async getExpiringSoonItems(req, res) {
        try {
            const { days } = req.query;
            const daysParam = days ? parseInt(days) : 30;

            const expiringItems = await Inventory.getExpiringSoon(daysParam);

            return responseHandler.success(
                res,
                `Items expiring within ${daysParam} days retrieved successfully`,
                {
                    count: expiringItems.length,
                    days: daysParam,
                    items: expiringItems
                },
                200
            );
        } catch (error) {
            console.error('Error fetching expiring items:', error);
            return responseHandler.error(
                res,
                'Failed to fetch expiring items',
                error.message,
                500
            );
        }
    }

    // Get items by category
    static async getItemsByCategory(req, res) {
        try {
            const { category } = req.params;

            const items = await Inventory.getByCategory(category);

            return responseHandler.success(
                res,
                `Items in category '${category}' retrieved successfully`,
                {
                    count: items.length,
                    category,
                    items
                },
                200
            );
        } catch (error) {
            console.error('Error fetching items by category:', error);
            return responseHandler.error(
                res,
                'Failed to fetch items by category',
                error.message,
                500
            );
        }
    }

    // Update inventory item
    static async updateInventoryItem(req, res) {
        try {
            const { id } = req.params;
            const {
                item_name,
                item_code,
                description,
                category,
                quantity,
                unit_of_measure,
                reorder_level,
                unit_price,
                supplier_name,
                supplier_contact,
                location,
                expiry_date,
                batch_number,
                is_active
            } = req.body;

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
                item_name,
                item_code,
                description,
                category,
                quantity,
                unit_of_measure,
                reorder_level,
                unit_price,
                supplier_name,
                supplier_contact,
                location,
                expiry_date,
                batch_number,
                is_active,
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
                    'Inventory item with this code already exists',
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

    // Update quantity (add or subtract)
    static async updateQuantity(req, res) {
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

            const updatedItem = await Inventory.updateQuantity(id, quantity_change, updated_by);

            return responseHandler.success(
                res,
                'Inventory quantity updated successfully',
                updatedItem,
                200
            );
        } catch (error) {
            console.error('Error updating inventory quantity:', error);
            return responseHandler.error(
                res,
                'Failed to update inventory quantity',
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

    // Deactivate inventory item
    static async deactivateInventoryItem(req, res) {
        try {
            const { id } = req.params;
            const updated_by = req.user?.id || null;

            const inventoryItem = await Inventory.findById(id);
            if (!inventoryItem) {
                return responseHandler.notFound(
                    res,
                    'Inventory item not found',
                    404
                );
            }

            const deactivatedItem = await Inventory.update(id, {
                is_active: false,
                updated_by
            });

            return responseHandler.success(
                res,
                'Inventory item deactivated successfully',
                deactivatedItem,
                200
            );
        } catch (error) {
            console.error('Error deactivating inventory item:', error);
            return responseHandler.error(
                res,
                'Failed to deactivate inventory item',
                error.message,
                500
            );
        }
    }

    // Activate inventory item
    static async activateInventoryItem(req, res) {
        try {
            const { id } = req.params;
            const updated_by = req.user?.id || null;

            const inventoryItem = await Inventory.findById(id);
            if (!inventoryItem) {
                return responseHandler.notFound(
                    res,
                    'Inventory item not found',
                    404
                );
            }

            const activatedItem = await Inventory.update(id, {
                is_active: true,
                updated_by
            });

            return responseHandler.success(
                res,
                'Inventory item activated successfully',
                activatedItem,
                200
            );
        } catch (error) {
            console.error('Error activating inventory item:', error);
            return responseHandler.error(
                res,
                'Failed to activate inventory item',
                error.message,
                500
            );
        }
    }
}

export default InventoryController;
