import OrderType from '../models/OrderType.js';
import responseHandler from '../utils/responseHandler.js';

class OrderTypeController {
    // Create new order type
    static async createOrderType(req, res) {
        try {
            const { type_name, description, is_active } = req.body;

            // Validation
            if (!type_name) {
                return responseHandler.validationError(
                    res,
                    'Type name is required',
                    400
                );
            }

            const created_by = req.user?.id || null;

            const newOrderType = await OrderType.create({
                type_name,
                description,
                is_active,
                created_by
            });

            return responseHandler.success(
                res,
                'Order type created successfully',
                newOrderType,
                201
            );
        } catch (error) {
            console.error('Error creating order type:', error);

            if (error.code === '23505') {
                return responseHandler.error(
                    res,
                    'Order type with this name already exists',
                    error.message,
                    409
                );
            }

            return responseHandler.error(
                res,
                'Failed to create order type',
                error.message,
                500
            );
        }
    }

    // Get order type by ID
    static async getOrderTypeById(req, res) {
        try {
            const { id } = req.params;

            const orderType = await OrderType.findById(id);

            if (!orderType) {
                return responseHandler.notFound(
                    res,
                    'Order type not found',
                    404
                );
            }

            return responseHandler.success(
                res,
                'Order type retrieved successfully',
                orderType,
                200
            );
        } catch (error) {
            console.error('Error fetching order type:', error);
            return responseHandler.error(
                res,
                'Failed to fetch order type',
                error.message,
                500
            );
        }
    }

    // Get order type by name
    static async getOrderTypeByName(req, res) {
        try {
            const { name } = req.params;

            const orderType = await OrderType.findByName(name);

            if (!orderType) {
                return responseHandler.notFound(
                    res,
                    'Order type not found',
                    404
                );
            }

            return responseHandler.success(
                res,
                'Order type retrieved successfully',
                orderType,
                200
            );
        } catch (error) {
            console.error('Error fetching order type:', error);
            return responseHandler.error(
                res,
                'Failed to fetch order type',
                error.message,
                500
            );
        }
    }

    // Get all order types with filters
    static async getAllOrderTypes(req, res) {
        try {
            const { is_active, search } = req.query;

            const filters = {};

            if (is_active !== undefined) {
                filters.is_active = is_active === 'true';
            }

            if (search) {
                filters.search = search;
            }

            const orderTypes = await OrderType.findAll(filters);

            return responseHandler.success(
                res,
                'Order types retrieved successfully',
                {
                    count: orderTypes.length,
                    orderTypes
                },
                200
            );
        } catch (error) {
            console.error('Error fetching order types:', error);
            return responseHandler.error(
                res,
                'Failed to fetch order types',
                error.message,
                500
            );
        }
    }

    // Update order type
    static async updateOrderType(req, res) {
        try {
            const { id } = req.params;
            const { type_name, description, is_active } = req.body;

            const updated_by = req.user?.id || null;

            // Check if order type exists
            const existingOrderType = await OrderType.findById(id);
            if (!existingOrderType) {
                return responseHandler.notFound(
                    res,
                    'Order type not found',
                    404
                );
            }

            const updatedOrderType = await OrderType.update(id, {
                type_name,
                description,
                is_active,
                updated_by
            });

            if (!updatedOrderType) {
                return responseHandler.validationError(
                    res,
                    'No fields to update',
                    400
                );
            }

            return responseHandler.success(
                res,
                'Order type updated successfully',
                updatedOrderType,
                200
            );
        } catch (error) {
            console.error('Error updating order type:', error);

            if (error.code === '23505') {
                return responseHandler.error(
                    res,
                    'Order type with this name already exists',
                    error.message,
                    409
                );
            }

            return responseHandler.error(
                res,
                'Failed to update order type',
                error.message,
                500
            );
        }
    }

    // Delete order type
    static async deleteOrderType(req, res) {
        try {
            const { id } = req.params;

            const orderType = await OrderType.findById(id);
            if (!orderType) {
                return responseHandler.notFound(
                    res,
                    'Order type not found',
                    404
                );
            }

            const deletedOrderType = await OrderType.delete(id);

            return responseHandler.success(
                res,
                'Order type deleted successfully',
                deletedOrderType,
                200
            );
        } catch (error) {
            console.error('Error deleting order type:', error);

            if (error.code === '23503') {
                return responseHandler.error(
                    res,
                    'Cannot delete order type. It has associated records',
                    error.message,
                    409
                );
            }

            return responseHandler.error(
                res,
                'Failed to delete order type',
                error.message,
                500
            );
        }
    }

    // Deactivate order type
    static async deactivateOrderType(req, res) {
        try {
            const { id } = req.params;
            const updated_by = req.user?.id || null;

            const orderType = await OrderType.findById(id);
            if (!orderType) {
                return responseHandler.notFound(
                    res,
                    'Order type not found',
                    404
                );
            }

            const deactivatedOrderType = await OrderType.update(id, {
                is_active: false,
                updated_by
            });

            return responseHandler.success(
                res,
                'Order type deactivated successfully',
                deactivatedOrderType,
                200
            );
        } catch (error) {
            console.error('Error deactivating order type:', error);
            return responseHandler.error(
                res,
                'Failed to deactivate order type',
                error.message,
                500
            );
        }
    }

    // Activate order type
    static async activateOrderType(req, res) {
        try {
            const { id } = req.params;
            const updated_by = req.user?.id || null;

            const orderType = await OrderType.findById(id);
            if (!orderType) {
                return responseHandler.notFound(
                    res,
                    'Order type not found',
                    404
                );
            }

            const activatedOrderType = await OrderType.update(id, {
                is_active: true,
                updated_by
            });

            return responseHandler.success(
                res,
                'Order type activated successfully',
                activatedOrderType,
                200
            );
        } catch (error) {
            console.error('Error activating order type:', error);
            return responseHandler.error(
                res,
                'Failed to activate order type',
                error.message,
                500
            );
        }
    }
}

export default OrderTypeController;
