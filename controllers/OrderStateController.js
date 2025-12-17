import OrderState from '../models/OrderState.js';
import responseHandler from '../utils/responseHandler.js';

class OrderStateController {
    // Create new order state
    static async createOrderState(req, res) {
        try {
            const { state_name, description, is_active } = req.body;

            // Validation
            if (!state_name) {
                return responseHandler.validationError(
                    res,
                    'State name is required',
                    400
                );
            }

            const created_by = req.user?.id || null;

            const newOrderState = await OrderState.create({
                state_name,
                description,
                is_active,
                created_by
            });

            return responseHandler.success(
                res,
                'Order state created successfully',
                newOrderState,
                201
            );
        } catch (error) {
            console.error('Error creating order state:', error);

            if (error.code === '23505') {
                return responseHandler.error(
                    res,
                    'Order state with this name already exists',
                    error.message,
                    409
                );
            }

            return responseHandler.error(
                res,
                'Failed to create order state',
                error.message,
                500
            );
        }
    }

    // Get order state by ID
    static async getOrderStateById(req, res) {
        try {
            const { id } = req.params;

            const orderState = await OrderState.findById(id);

            if (!orderState) {
                return responseHandler.notFound(
                    res,
                    'Order state not found',
                    404
                );
            }

            return responseHandler.success(
                res,
                'Order state retrieved successfully',
                orderState,
                200
            );
        } catch (error) {
            console.error('Error fetching order state:', error);
            return responseHandler.error(
                res,
                'Failed to fetch order state',
                error.message,
                500
            );
        }
    }

    // Get order state by name
    static async getOrderStateByName(req, res) {
        try {
            const { name } = req.params;

            const orderState = await OrderState.findByName(name);

            if (!orderState) {
                return responseHandler.notFound(
                    res,
                    'Order state not found',
                    404
                );
            }

            return responseHandler.success(
                res,
                'Order state retrieved successfully',
                orderState,
                200
            );
        } catch (error) {
            console.error('Error fetching order state:', error);
            return responseHandler.error(
                res,
                'Failed to fetch order state',
                error.message,
                500
            );
        }
    }

    // Get all order states with filters
    static async getAllOrderStates(req, res) {
        try {
            const { is_active, search } = req.query;

            const filters = {};

            if (is_active !== undefined) {
                filters.is_active = is_active === 'true';
            }

            if (search) {
                filters.search = search;
            }

            const orderStates = await OrderState.findAll(filters);

            return responseHandler.success(
                res,
                'Order states retrieved successfully',
                {
                    count: orderStates.length,
                    orderStates
                },
                200
            );
        } catch (error) {
            console.error('Error fetching order states:', error);
            return responseHandler.error(
                res,
                'Failed to fetch order states',
                error.message,
                500
            );
        }
    }

    // Update order state
    static async updateOrderState(req, res) {
        try {
            const { id } = req.params;
            const { state_name, description, is_active } = req.body;

            const updated_by = req.user?.id || null;

            // Check if order state exists
            const existingOrderState = await OrderState.findById(id);
            if (!existingOrderState) {
                return responseHandler.notFound(
                    res,
                    'Order state not found',
                    404
                );
            }

            const updatedOrderState = await OrderState.update(id, {
                state_name,
                description,
                is_active,
                updated_by
            });

            if (!updatedOrderState) {
                return responseHandler.validationError(
                    res,
                    'No fields to update',
                    400
                );
            }

            return responseHandler.success(
                res,
                'Order state updated successfully',
                updatedOrderState,
                200
            );
        } catch (error) {
            console.error('Error updating order state:', error);

            if (error.code === '23505') {
                return responseHandler.error(
                    res,
                    'Order state with this name already exists',
                    error.message,
                    409
                );
            }

            return responseHandler.error(
                res,
                'Failed to update order state',
                error.message,
                500
            );
        }
    }

    // Delete order state
    static async deleteOrderState(req, res) {
        try {
            const { id } = req.params;

            const orderState = await OrderState.findById(id);
            if (!orderState) {
                return responseHandler.notFound(
                    res,
                    'Order state not found',
                    404
                );
            }

            const deletedOrderState = await OrderState.delete(id);

            return responseHandler.success(
                res,
                'Order state deleted successfully',
                deletedOrderState,
                200
            );
        } catch (error) {
            console.error('Error deleting order state:', error);

            if (error.code === '23503') {
                return responseHandler.error(
                    res,
                    'Cannot delete order state. It has associated records',
                    error.message,
                    409
                );
            }

            return responseHandler.error(
                res,
                'Failed to delete order state',
                error.message,
                500
            );
        }
    }

    // Deactivate order state
    static async deactivateOrderState(req, res) {
        try {
            const { id } = req.params;
            const updated_by = req.user?.id || null;

            const orderState = await OrderState.findById(id);
            if (!orderState) {
                return responseHandler.notFound(
                    res,
                    'Order state not found',
                    404
                );
            }

            const deactivatedOrderState = await OrderState.update(id, {
                is_active: false,
                updated_by
            });

            return responseHandler.success(
                res,
                'Order state deactivated successfully',
                deactivatedOrderState,
                200
            );
        } catch (error) {
            console.error('Error deactivating order state:', error);
            return responseHandler.error(
                res,
                'Failed to deactivate order state',
                error.message,
                500
            );
        }
    }

    // Activate order state
    static async activateOrderState(req, res) {
        try {
            const { id } = req.params;
            const updated_by = req.user?.id || null;

            const orderState = await OrderState.findById(id);
            if (!orderState) {
                return responseHandler.notFound(
                    res,
                    'Order state not found',
                    404
                );
            }

            const activatedOrderState = await OrderState.update(id, {
                is_active: true,
                updated_by
            });

            return responseHandler.success(
                res,
                'Order state activated successfully',
                activatedOrderState,
                200
            );
        } catch (error) {
            console.error('Error activating order state:', error);
            return responseHandler.error(
                res,
                'Failed to activate order state',
                error.message,
                500
            );
        }
    }
}

export default OrderStateController;
